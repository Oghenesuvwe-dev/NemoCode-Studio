use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem, MasterPty};
use std::sync::{Arc, Mutex};
use std::collections::HashMap;
use std::thread;
use std::io::{Read, Write};
use tauri::{Emitter, Window};
use serde::Serialize;

pub struct PtyInstance {
    master: Box<dyn portable_pty::MasterPty + Send>,
    writer: Box<dyn std::io::Write + Send>,
    killer: Box<dyn portable_pty::ChildKiller + Send + Sync>,
}

pub struct TerminalState {
    pub ptys: Arc<Mutex<HashMap<String, PtyInstance>>>,
}

impl TerminalState {
    pub fn new() -> Self {
        Self {
            ptys: Arc::new(Mutex::new(HashMap::new())),
        }
    }
}

impl Drop for TerminalState {
    fn drop(&mut self) {
        log::info!("Cleaning up TerminalState - killing all PTY processes");
        if let Ok(mut ptys) = self.ptys.lock() {
            for (id, mut instance) in ptys.drain() {
                log::debug!("Killing PTY process: {}", id);
                let _ = instance.killer.kill();
            }
        }
        log::info!("TerminalState cleanup complete");
    }
}

#[derive(Clone, Serialize)]
struct TerminalOutput {
    id: String,
    data: String,
}

#[tauri::command]
pub fn spawn_pty(id: String, shell: Option<String>, cwd: Option<String>, window: Window, state: tauri::State<'_, TerminalState>) -> Result<(), String> {
    log::info!("Spawning PTY with id: {}, shell: {:?}, cwd: {:?}", id, shell, cwd);
    let pty_system = NativePtySystem::default();

    let pair = pty_system.openpty(PtySize {
        rows: 24,
        cols: 80,
        pixel_width: 0,
        pixel_height: 0,
    }).map_err(|e| e.to_string())?;

    let shell_cmd = shell.unwrap_or_else(|| "zsh".to_string());
    let mut cmd = CommandBuilder::new(shell_cmd);
    
    if let Some(dir) = cwd {
        cmd.cwd(dir);
    }
    
    // Set environment variables for better shell integration
    cmd.env("TERM", "xterm-256color");
    cmd.env("COLORTERM", "truecolor");

    let mut child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    
    let killer = child.clone_killer();

    // Release the slave, we don't need it anymore
    drop(pair.slave);

    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;
    
    let id_clone = id.clone();
    
    // Spawn a thread to read from the PTY and emit events
    thread::spawn(move || {
        // Increased buffer size for better performance
        let mut buffer = [0u8; 8192];
        loop {
            match reader.read(&mut buffer) {
                Ok(n) if n > 0 => {
                    let data = String::from_utf8_lossy(&buffer[..n]).to_string();
                    // Emit event to frontend
                    let _ = window.emit("pty-output", TerminalOutput {
                        id: id_clone.clone(),
                        data,
                    });
                }
                Ok(_) => break, // EOF
                Err(_) => break, // Error
            }
        }
        // Wait for child to exit to avoid zombies
        let _ = child.wait();
    });

    let id_for_log = id.clone();
    state.ptys.lock()
        .map_err(|e| format!("Failed to lock PTY state: {}", e))?
        .insert(id, PtyInstance {
            master: pair.master,
            writer,
            killer,
        });
    log::info!("PTY {} spawned successfully", id_for_log);
    Ok(())
}

#[tauri::command]
pub fn write_pty(id: String, data: String, state: tauri::State<'_, TerminalState>) -> Result<(), String> {
    let mut ptys = state.ptys.lock()
        .map_err(|e| format!("Failed to lock PTY state: {}", e))?;
    if let Some(instance) = ptys.get_mut(&id) {
        instance.writer.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn resize_pty(id: String, rows: u16, cols: u16, state: tauri::State<'_, TerminalState>) -> Result<(), String> {
    let mut ptys = state.ptys.lock()
        .map_err(|e| format!("Failed to lock PTY state: {}", e))?;
    if let Some(instance) = ptys.get_mut(&id) {
        instance.master.resize(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        }).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn close_pty(id: String, state: tauri::State<'_, TerminalState>) -> Result<(), String> {
    log::info!("Closing PTY: {}", id);
    let mut ptys = state.ptys.lock()
        .map_err(|e| format!("Failed to lock PTY state: {}", e))?;
    if let Some(mut instance) = ptys.remove(&id) {
        let _ = instance.killer.kill();
    }
    Ok(())
}
