use serde::{Deserialize, Serialize};
use std::fmt;

/// Application-wide error type
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppError {
    pub code: ErrorCode,
    pub message: String,
    pub details: Option<String>,
}

/// Error codes for categorizing errors
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ErrorCode {
    // LLM Errors
    LlmConnectionFailed,
    LlmRequestFailed,
    LlmStreamingFailed,
    ModelNotFound,
    
    // RAG Errors
    RagIndexingFailed,
    RagQueryFailed,
    RagStorageError,
    
    // Terminal Errors
    PtySpawnFailed,
    PtyWriteFailed,
    PtyResizeFailed,
    PtyNotFound,
    
    // File System Errors
    FileReadFailed,
    FileWriteFailed,
    DirectoryReadFailed,
    PathNotFound,
    
    // Agent Errors
    AgentExecutionFailed,
    ToolExecutionFailed,
    
    // General Errors
    InvalidInput,
    ConfigurationError,
    InternalError,
    Unknown,
}

impl AppError {
    /// Create a new AppError
    pub fn new(code: ErrorCode, message: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
            details: None,
        }
    }

    /// Create an AppError with details
    pub fn with_details(code: ErrorCode, message: impl Into<String>, details: impl Into<String>) -> Self {
        Self {
            code,
            message: message.into(),
            details: Some(details.into()),
        }
    }

    /// Create an LLM connection error
    pub fn llm_connection(details: impl Into<String>) -> Self {
        Self::with_details(
            ErrorCode::LlmConnectionFailed,
            "Failed to connect to LLM service",
            details,
        )
    }

    /// Create a PTY spawn error
    pub fn pty_spawn(details: impl Into<String>) -> Self {
        Self::with_details(
            ErrorCode::PtySpawnFailed,
            "Failed to spawn PTY",
            details,
        )
    }

    /// Create a file read error
    pub fn file_read(path: impl Into<String>) -> Self {
        Self::with_details(
            ErrorCode::FileReadFailed,
            "Failed to read file",
            path,
        )
    }

    /// Create an internal error
    pub fn internal(details: impl Into<String>) -> Self {
        Self::with_details(
            ErrorCode::InternalError,
            "Internal error occurred",
            details,
        )
    }
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{:?}] {}", self.code, self.message)?;
        if let Some(details) = &self.details {
            write!(f, ": {}", details)?;
        }
        Ok(())
    }
}

impl std::error::Error for AppError {}

// Implement From for common error types
impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        AppError::with_details(
            ErrorCode::InternalError,
            "IO error",
            err.to_string(),
        )
    }
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        AppError::with_details(
            ErrorCode::LlmRequestFailed,
            "HTTP request failed",
            err.to_string(),
        )
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::with_details(
            ErrorCode::InternalError,
            "JSON serialization error",
            err.to_string(),
        )
    }
}

// Convert AppError to String for Tauri commands
impl From<AppError> for String {
    fn from(err: AppError) -> Self {
        err.to_string()
    }
}

/// Result type alias for application operations
pub type AppResult<T> = Result<T, AppError>;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_creation() {
        let err = AppError::new(ErrorCode::LlmConnectionFailed, "Connection timeout");
        assert_eq!(err.code, ErrorCode::LlmConnectionFailed);
        assert_eq!(err.message, "Connection timeout");
        assert!(err.details.is_none());
    }

    #[test]
    fn test_error_with_details() {
        let err = AppError::with_details(
            ErrorCode::FileReadFailed,
            "Cannot read file",
            "/path/to/file.txt",
        );
        assert!(err.details.is_some());
        assert_eq!(err.details.unwrap(), "/path/to/file.txt");
    }

    #[test]
    fn test_error_display() {
        let err = AppError::with_details(
            ErrorCode::PtySpawnFailed,
            "Failed to spawn",
            "Permission denied",
        );
        let display = format!("{}", err);
        assert!(display.contains("PtySpawnFailed"));
        assert!(display.contains("Failed to spawn"));
        assert!(display.contains("Permission denied"));
    }
}
