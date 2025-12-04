use log::{Level, LevelFilter, Metadata, Record};
use std::fs::{File, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::sync::Mutex;

/// Custom logger that writes to both console and file
pub struct AppLogger {
    file: Mutex<File>,
    level: LevelFilter,
}

impl AppLogger {
    /// Create a new logger with the specified log file path
    pub fn new(log_path: PathBuf, level: LevelFilter) -> Result<Self, std::io::Error> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(log_path)?;

        Ok(Self {
            file: Mutex::new(file),
            level,
        })
    }

    /// Initialize the global logger
    pub fn init(log_path: PathBuf, level: LevelFilter) -> Result<(), Box<dyn std::error::Error>> {
        let logger = Self::new(log_path, level)?;
        log::set_boxed_logger(Box::new(logger))?;
        log::set_max_level(level);
        Ok(())
    }
}

impl log::Log for AppLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= self.level
    }

    fn log(&self, record: &Record) {
        if !self.enabled(record.metadata()) {
            return;
        }

        let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S%.3f");
        let level = record.level();
        let target = record.target();
        let message = record.args();

        // Format: [TIMESTAMP] LEVEL TARGET: MESSAGE
        let log_line = format!("[{}] {} {}: {}\n", timestamp, level, target, message);

        // Write to console (stderr for errors, stdout for others)
        if level == Level::Error {
            eprint!("{}", log_line);
        } else {
            print!("{}", log_line);
        }

        // Write to file
        if let Ok(mut file) = self.file.lock() {
            let _ = file.write_all(log_line.as_bytes());
            let _ = file.flush();
        }
    }

    fn flush(&self) {
        if let Ok(mut file) = self.file.lock() {
            let _ = file.flush();
        }
    }
}

/// Get the default log file path
pub fn get_log_path() -> PathBuf {
    let mut path = dirs::data_local_dir()
        .unwrap_or_else(|| PathBuf::from("."));
    path.push("nemocode");
    std::fs::create_dir_all(&path).ok();
    path.push("app.log");
    path
}

/// Initialize logging with default settings
pub fn init_logging() -> Result<(), Box<dyn std::error::Error>> {
    let log_path = get_log_path();
    let level = if cfg!(debug_assertions) {
        LevelFilter::Debug
    } else {
        LevelFilter::Info
    };

    AppLogger::init(log_path.clone(), level)?;
    log::info!("Logging initialized. Log file: {:?}", log_path);
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use tempfile::tempdir;

    #[test]
    fn test_logger_creation() {
        let dir = tempdir().unwrap();
        let log_path = dir.path().join("test.log");
        
        let logger = AppLogger::new(log_path.clone(), LevelFilter::Debug);
        assert!(logger.is_ok());
        assert!(log_path.exists());
    }

    #[test]
    fn test_log_path() {
        let path = get_log_path();
        assert!(path.to_str().unwrap().contains("nemocode"));
        assert!(path.to_str().unwrap().ends_with("app.log"));
    }
}
