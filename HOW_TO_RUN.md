# How to Run Nemo Code IDE

## 🚀 Quick Start

The NemoCode IDE is now a fully native Rust application.

### Prerequisites
1.  **Node.js** (v18+)
2.  **Rust** (latest stable)
3.  **Ollama** (running with `llama3.1` model)

### Running in Development Mode

```bash
# 1. Start Ollama (in a separate terminal)
ollama serve
# Make sure you have the model: ollama pull llama3.1

# 2. Start the App
cd tauri-shell
npm install  # Only first time
npm run tauri dev
```

This will compile the Rust backend and launch the application window with hot-reloading enabled for the frontend.

### Building for Production

```bash
cd tauri-shell
npm run tauri build
```

The executable will be located in `tauri-shell/src-tauri/target/release/bundle/`.

## 🐛 Troubleshooting

### "Backend not connected"
- Ensure Ollama is running on port 11434.
- Check `tauri-shell/src-tauri/target/debug/` for any build errors.

### "Terminal Permissions"
- The integrated terminal requires specific permissions on macOS. If it fails, try running the app from a terminal that has Full Disk Access, or use an external terminal for now.
