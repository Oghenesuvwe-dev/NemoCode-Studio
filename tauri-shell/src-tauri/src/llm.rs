use reqwest::Client;
use serde::{Deserialize, Serialize};
use anyhow::Result;
use serde_json::Value;

#[derive(Clone)]
pub struct LlmClient {
    client: Client,
    base_url: String,
    model: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tool_calls: Option<Vec<ToolCall>>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ToolCall {
    pub function: FunctionCall,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct FunctionCall {
    pub name: String,
    pub arguments: Value,
}

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
    stream: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    tools: Option<Vec<ToolDefinition>>,
}

#[derive(Serialize, Clone)]
pub struct ToolDefinition {
    #[serde(rename = "type")]
    pub tool_type: String,
    pub function: ToolFunctionDefinition,
}

#[derive(Serialize, Clone)]
pub struct ToolFunctionDefinition {
    pub name: String,
    pub description: String,
    pub parameters: Value,
}

#[derive(Deserialize)]
struct ChatResponse {
    message: ChatMessage,
    done: bool,
}

#[derive(Serialize)]
struct EmbeddingRequest {
    model: String,
    prompt: String,
}

#[derive(Deserialize)]
struct EmbeddingResponse {
    embedding: Vec<f32>,
}

#[derive(Deserialize)]
struct TagsResponse {
    models: Vec<ModelInfo>,
}

#[derive(Deserialize)]
struct ModelInfo {
    name: String,
}

impl LlmClient {
    pub fn new(base_url: &str, model: &str) -> Self {
        Self {
            client: Client::builder()
                .timeout(std::time::Duration::from_secs(120))
                .build()
                .unwrap(),
            base_url: base_url.to_string(),
            model: model.to_string(),
        }
    }

    pub fn set_model(&mut self, model: &str) {
        self.model = model.to_string();
    }

    pub async fn chat(&self, messages: Vec<ChatMessage>, tools: Option<Vec<ToolDefinition>>) -> Result<ChatMessage> {
        let url = format!("{}/api/chat", self.base_url);
        println!("Sending chat request to: {}", url);
        let request = ChatRequest {
            model: self.model.clone(),
            messages,
            stream: false,
            tools,
        };

        let res = self.client
            .post(&url)
            .json(&request)
            .send()
            .await?;
            
        println!("Received response from LLM");
        let res_json = res.json::<ChatResponse>().await?;

        Ok(res_json.message)
    }

    pub async fn chat_stream<F>(&self, messages: Vec<ChatMessage>, tools: Option<Vec<ToolDefinition>>, on_token: F) -> Result<ChatMessage> 
    where F: Fn(String) + Send + Sync + 'static 
    {
        let url = format!("{}/api/chat", self.base_url);
        // Check if model supports tools (simple heuristic or hardcoded list)
        let supports_tools = self.model.contains("llama3.1") || self.model.contains("mistral") || self.model.contains("llama3.2");
        
        println!("Model: {}, Supports tools: {}", self.model, supports_tools);

        let request = ChatRequest {
            model: self.model.clone(),
            messages,
            stream: true,
            tools: if supports_tools { tools } else { None },
        };

        println!("Sending stream request to {} with model {}", url, self.model);
        let mut res = self.client
            .post(&url)
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                println!("LLM Request Failed: {}", e);
                anyhow::anyhow!("LLM Request Failed: {}", e)
            })?;

        let mut full_content = String::new();
        let mut final_message = ChatMessage {
            role: "assistant".to_string(),
            content: String::new(),
            tool_calls: None,
        };

        // use futures::StreamExt;

        while let Some(chunk) = res.chunk().await? {
            let text = String::from_utf8_lossy(&chunk);
            // Ollama sends multiple JSON objects in one chunk sometimes, or across chunks
            // We need to handle this robustly. 
            // For simplicity, let's assume line-delimited JSON or just try to parse what we get.
            // Actually, Ollama stream is usually one JSON object per line/chunk.
            
            for line in text.lines() {
                if line.trim().is_empty() { continue; }
                match serde_json::from_str::<ChatResponse>(line) {
                    Ok(response) => {
                        if let Some(tool_calls) = response.message.tool_calls {
                            if final_message.tool_calls.is_none() {
                                final_message.tool_calls = Some(Vec::new());
                            }
                            if let Some(existing) = &mut final_message.tool_calls {
                                existing.extend(tool_calls);
                            }
                        }
                        
                        let content_part = response.message.content;
                        if !content_part.is_empty() {
                            full_content.push_str(&content_part);
                            on_token(content_part);
                        }
                    },
                    Err(e) => {
                        println!("Failed to parse LLM chunk: {}", e);
                        println!("Raw line: {}", line);
                    }
                }
            }
        }
        
        final_message.content = full_content;
        Ok(final_message)
    }

    // Keep generate for backward compatibility if needed, but chat is preferred
    pub async fn generate(&self, prompt: &str) -> Result<String> {
        let messages = vec![ChatMessage {
            role: "user".to_string(),
            content: prompt.to_string(),
            tool_calls: None,
        }];
        let response = self.chat(messages, None).await?;
        Ok(response.content)
    }

    pub async fn generate_embedding(&self, prompt: &str) -> Result<Vec<f32>> {
        let url = format!("{}/api/embeddings", self.base_url);
        let request = EmbeddingRequest {
            model: self.model.clone(),
            prompt: prompt.to_string(),
        };

        let res = self.client
            .post(&url)
            .json(&request)
            .send()
            .await?
            .json::<EmbeddingResponse>()
            .await?;

        Ok(res.embedding)
    }

    pub async fn get_models(&self) -> Result<Vec<String>> {
        let url = format!("{}/api/tags", self.base_url);
        let res = self.client
            .get(&url)
            .send()
            .await?
            .json::<TagsResponse>()
            .await?;
        
        Ok(res.models.into_iter().map(|m| m.name).collect())
    }
}
