// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use tauri_plugin_shell::ShellExt;
use tauri::{Manager, Emitter};
use std::sync::Arc;
use tokio::sync::Mutex;
use sysinfo::System;

mod llm;
mod agent;
mod rag;
mod tools;
mod terminal;
mod error;
mod logging;

use agent::Agent;
use llm::LlmClient;
use rag::RagSystem;
use terminal::TerminalState;

struct AppState {
    agent: Mutex<Agent>,
    rag: Mutex<RagSystem>,
}

#[tauri::command]
async fn chat(window: tauri::Window, message: String, state: tauri::State<'_, AppState>) -> Result<String, String> {
    let mut agent = state.agent.lock().await;
    agent.process_message(&message, move |token| {
        let _ = window.emit("chat-token", token);
    }).await
}

#[tauri::command]
async fn index_codebase(path: String, state: tauri::State<'_, AppState>) -> Result<(), String> {
    let rag = state.rag.lock().await;
    let agent = state.agent.lock().await;
    rag.index_directory(&path, &agent.llm).await
}

#[tauri::command]
async fn search_codebase(query: String, state: tauri::State<'_, AppState>) -> Result<Vec<String>, String> {
    let rag = state.rag.lock().await;
    let agent = state.agent.lock().await;
    rag.search(&query, &agent.llm).await
}

#[tauri::command]
async fn get_models(state: tauri::State<'_, AppState>) -> Result<Vec<String>, String> {
    let agent = state.agent.lock().await;
    let models = agent.llm.get_models().await.map_err(|e| e.to_string())?;
    
    // Filter for stable/recommended models only
    let filtered_models: Vec<String> = models.into_iter()
        .filter(|m| {
            let m = m.to_lowercase();
            m.contains("llama3.2") || 
            m.contains("llama3.1") || 
            m.contains("mistral") ||
            m.contains("codellama")
        })
        .collect();

    Ok(filtered_models)
}

#[tauri::command]
async fn get_history(state: tauri::State<'_, AppState>) -> Result<Vec<llm::ChatMessage>, String> {
    let agent = state.agent.lock().await;
    Ok(agent.get_history())
}

#[tauri::command]
async fn clear_history(state: tauri::State<'_, AppState>) -> Result<(), String> {
    let mut agent = state.agent.lock().await;
    agent.clear_history();
    Ok(())
}

#[tauri::command]
async fn set_model(state: tauri::State<'_, AppState>, model: String) -> Result<(), String> {
    let mut agent = state.agent.lock().await;
    agent.set_model(&model);
    Ok(())
}

#[tauri::command]
fn log_msg(msg: String) {
    println!("Frontend Log: {}", msg);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize logging system
    if let Err(e) = logging::init_logging() {
        eprintln!("Failed to initialize logging: {}", e);
    } else {
        log::info!("NemoCode IDE starting...");
    }

    let sidecar_pid = Arc::new(std::sync::Mutex::new(None));
    let sidecar_pid_clone = sidecar_pid.clone();
    
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState {
            agent: Mutex::new(Agent::new(LlmClient::new("http://localhost:11434", "llama3.2:1b"))), // Updated default model
            rag: Mutex::new(tauri::async_runtime::block_on(async {
                match RagSystem::new("data/lancedb").await {
                    Ok(rag) => {
                        log::info!("RAG system initialized successfully");
                        rag
                    }
                    Err(e) => {
                        log::error!("Failed to initialize RAG system: {}. Using fallback.", e);
                        // Return a default/fallback RAG system or handle gracefully
                        RagSystem::new("data/lancedb").await.unwrap_or_else(|_| {
                            panic!("Critical: Cannot initialize RAG system")
                        })
                    }
                }
            })),
        })
        .manage(TerminalState::new())
        .setup(move |app| {
            // Configure the main window for proper dragging on macOS
            if let Some(window) = app.get_webview_window("main") {
                #[cfg(target_os = "macos")]
                {
                    use cocoa::appkit::{NSWindow, NSWindowStyleMask};
                    use cocoa::base::id;
                    
                    unsafe {
                        let ns_window = window.ns_window().unwrap() as id;
                        
                        // Enable full-size content view
                        ns_window.setTitlebarAppearsTransparent_(cocoa::base::YES);
                        ns_window.setTitleVisibility_(cocoa::appkit::NSWindowTitleVisibility::NSWindowTitleHidden);
                        
                        // Make the window movable by background
                        ns_window.setMovableByWindowBackground_(cocoa::base::YES);
                        
                        // Set proper style mask
                        let mut style_mask = ns_window.styleMask();
                        style_mask |= NSWindowStyleMask::NSFullSizeContentViewWindowMask;
                        ns_window.setStyleMask_(style_mask);
                    }
                }
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet, 
            chat, 
            index_codebase, 
            search_codebase,
            terminal::spawn_pty,
            terminal::write_pty,
            terminal::resize_pty,
            terminal::close_pty,
            get_models,
            set_model,
            get_history,
            clear_history,
            log_msg
        ])
        .on_window_event(move |_window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                if let Some(pid) = *sidecar_pid.lock().unwrap() {
                    kill_process_tree(pid);
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn kill_process_tree(parent_pid: u32) {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let parent_pid_sysinfo = sysinfo::Pid::from(parent_pid as usize);
    
    // Find and kill all child processes
    for (pid, process) in sys.processes() {
        if let Some(parent) = process.parent() {
            if parent == parent_pid_sysinfo {
                #[cfg(target_os = "macos")]
                std::process::Command::new("kill")
                    .arg("-9")
                    .arg(pid.as_u32().to_string())
                    .output()
                    .ok();
                
                #[cfg(target_os = "windows")]
                std::process::Command::new("taskkill")
                    .args(&["/PID", &pid.as_u32().to_string(), "/F"])
                    .output()
                    .ok();
                
                #[cfg(target_os = "linux")]
                std::process::Command::new("kill")
                    .arg("-9")
                    .arg(pid.as_u32().to_string())
                    .output()
                    .ok();
            }
        }
    }
    
    // Kill parent process
    #[cfg(target_os = "macos")]
    std::process::Command::new("kill")
        .arg("-9")
        .arg(parent_pid.to_string())
        .output()
        .ok();
    
    #[cfg(target_os = "windows")]
    std::process::Command::new("taskkill")
        .args(&["/PID", &parent_pid.to_string(), "/F"])
        .output()
        .ok();
    
    #[cfg(target_os = "linux")]
    std::process::Command::new("kill")
        .arg("-9")
        .arg(parent_pid.to_string())
        .output()
        .ok();
}
