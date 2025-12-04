use serde_json::{json, Value};
use crate::llm::{ToolDefinition, ToolFunctionDefinition};
use std::fs;
use std::path::Path;
use std::process::Command;

pub trait Tool: Send + Sync {
    fn name(&self) -> String;
    fn description(&self) -> String;
    fn parameters(&self) -> Value;
    fn definition(&self) -> ToolDefinition {
        ToolDefinition {
            tool_type: "function".to_string(),
            function: ToolFunctionDefinition {
                name: self.name(),
                description: self.description(),
                parameters: self.parameters(),
            }
        }
    }
    fn execute(&self, args: Value) -> Result<String, String>;
}

pub struct ReadFile;
impl Tool for ReadFile {
    fn name(&self) -> String { "read_file".to_string() }
    fn description(&self) -> String { "Read the contents of a file".to_string() }
    fn parameters(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "path": { "type": "string", "description": "The absolute path to the file" }
            },
            "required": ["path"]
        })
    }
    fn execute(&self, args: Value) -> Result<String, String> {
        let path_str = args["path"].as_str().ok_or("Missing path argument")?;
        fs::read_to_string(path_str).map_err(|e| e.to_string())
    }
}

pub struct WriteFile;
impl Tool for WriteFile {
    fn name(&self) -> String { "write_file".to_string() }
    fn description(&self) -> String { "Write content to a file".to_string() }
    fn parameters(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "path": { "type": "string", "description": "The absolute path to the file" },
                "content": { "type": "string", "description": "The content to write" }
            },
            "required": ["path", "content"]
        })
    }
    fn execute(&self, args: Value) -> Result<String, String> {
        let path_str = args["path"].as_str().ok_or("Missing path argument")?;
        let content = args["content"].as_str().ok_or("Missing content argument")?;
        fs::write(path_str, content).map_err(|e| e.to_string())?;
        Ok(format!("Successfully wrote to {}", path_str))
    }
}

pub struct ListDir;
impl Tool for ListDir {
    fn name(&self) -> String { "list_dir".to_string() }
    fn description(&self) -> String { "List contents of a directory".to_string() }
    fn parameters(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "path": { "type": "string", "description": "The absolute path to the directory" }
            },
            "required": ["path"]
        })
    }
    fn execute(&self, args: Value) -> Result<String, String> {
        let path_str = args["path"].as_str().ok_or("Missing path argument")?;
        let entries = fs::read_dir(path_str).map_err(|e| e.to_string())?;
        let mut result = String::new();
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                let name = path.file_name().unwrap_or_default().to_string_lossy();
                let is_dir = path.is_dir();
                result.push_str(&format!("{} {}\n", if is_dir { "[DIR]" } else { "[FILE]" }, name));
            }
        }
        Ok(result)
    }
}

pub struct RunCommand;
impl Tool for RunCommand {
    fn name(&self) -> String { "run_command".to_string() }
    fn description(&self) -> String { "Run a shell command".to_string() }
    fn parameters(&self) -> Value {
        json!({
            "type": "object",
            "properties": {
                "command": { "type": "string", "description": "The command to run" },
                "cwd": { "type": "string", "description": "Current working directory (optional)" }
            },
            "required": ["command"]
        })
    }
    fn execute(&self, args: Value) -> Result<String, String> {
        let command = args["command"].as_str().ok_or("Missing command argument")?;
        let cwd = args["cwd"].as_str().unwrap_or(".");
        
        let output = Command::new("sh")
            .arg("-c")
            .arg(command)
            .current_dir(cwd)
            .output()
            .map_err(|e| e.to_string())?;
            
        let stdout = String::from_utf8_lossy(&output.stdout);
        let stderr = String::from_utf8_lossy(&output.stderr);
        
        Ok(format!("Stdout:\n{}\nStderr:\n{}", stdout, stderr))
    }
}
