use serde::{Deserialize, Serialize};
use crate::llm::{LlmClient, ChatMessage, ToolCall};
use crate::tools::{Tool, ReadFile, WriteFile, ListDir, RunCommand};
use serde_json::json;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum AgentState {
    Idle,
    Thinking,
    Working,
    Error(String),
}

pub struct Agent {
    pub state: AgentState,
    pub llm: LlmClient,
    pub history: Vec<ChatMessage>,
    pub system_prompt: String,
    pub tools: Vec<Box<dyn Tool>>,
}

impl Agent {
    pub fn new(llm: LlmClient) -> Self {
        let tools: Vec<Box<dyn Tool>> = vec![
            Box::new(ReadFile),
            Box::new(WriteFile),
            Box::new(ListDir),
            Box::new(RunCommand),
        ];

        Self {
            state: AgentState::Idle,
            llm,
            history: Vec::new(),
            system_prompt: "You are Nemo, an advanced AI coding assistant built into the NemoCode IDE. You are helpful, concise, and expert in Rust, React, and TypeScript. You have access to tools to read files, write files, list directories, and run commands. Use them when necessary.".to_string(),
            tools,
        }
    }

    pub fn set_model(&mut self, model: &str) {
        self.llm.set_model(model);
    }

    pub async fn process_message<F>(&mut self, message: &str, on_token: F) -> Result<String, String> 
    where F: Fn(String) + Send + Sync + 'static + Clone
    {
        println!("Agent received message: {}", message);
        self.state = AgentState::Thinking;
        
        // Add user message to history
        self.history.push(ChatMessage {
            role: "user".to_string(),
            content: message.to_string(),
            tool_calls: None,
        });

        // Prepare messages with system prompt
        let mut messages = vec![ChatMessage {
            role: "system".to_string(),
            content: self.system_prompt.clone(),
            tool_calls: None,
        }];
        messages.extend(self.history.clone());

        // Prepare tool definitions
        let tool_definitions = Some(self.tools.iter().map(|t| t.definition()).collect());

        // Main Loop
        let mut response_content = String::new();
        let max_turns = 5;
        let mut turn = 0;

        while turn < max_turns {
            turn += 1;
            
            // Use chat_stream instead of chat
            match self.llm.chat_stream(messages.clone(), tool_definitions.clone(), on_token.clone()).await {
                Ok(response) => {
                    // Add assistant response to history and current messages
                    self.history.push(response.clone());
                    messages.push(response.clone());

                    if let Some(tool_calls) = &response.tool_calls {
                        if tool_calls.is_empty() {
                            response_content = response.content;
                            break;
                        }
                        
                        self.state = AgentState::Working;
                        
                        // Execute tools
                        for tool_call in tool_calls {
                            let tool_name = &tool_call.function.name;
                            let args = &tool_call.function.arguments;
                            
                            // Notify frontend about tool execution (optional, but good for UX)
                            on_token(format!("\n\n*Executing tool: {}*\n\n", tool_name));

                            let result = if let Some(tool) = self.tools.iter().find(|t| t.name() == *tool_name) {
                                tool.execute(args.clone()).unwrap_or_else(|e| format!("Error: {}", e))
                            } else {
                                format!("Error: Tool {} not found", tool_name)
                            };
                            
                            // Notify frontend about tool result (optional)
                            // on_token(format!("\n*Result: {}*\n", result.chars().take(50).collect::<String>()));

                            // Add tool result to messages
                            // Note: Ollama expects tool results as "tool" role messages? 
                            // Actually, OpenAI format uses "tool" role with tool_call_id.
                            // Ollama might be slightly different depending on version.
                            // For Llama 3.1, it usually expects a "tool" role message.
                            // Let's assume standard OpenAI format but without call_id for now if Ollama simplifies it,
                            // or just "user" role saying "Tool Output: ...".
                            // Checking Ollama docs... usually "tool" role.
                            
                            messages.push(ChatMessage {
                                role: "tool".to_string(),
                                content: result,
                                tool_calls: None,
                            });
                        }
                    } else {
                        response_content = response.content;
                        break;
                    }
                }
                Err(e) => {
                    let err_msg = e.to_string();
                    self.state = AgentState::Error(err_msg.clone());
                    return Err(err_msg);
                }
            }
        }

        self.state = AgentState::Idle;
        Ok(response_content)
    }

    pub fn get_history(&self) -> Vec<ChatMessage> {
        self.history.clone()
    }

    pub fn clear_history(&mut self) {
        self.history.clear();
    }
}
