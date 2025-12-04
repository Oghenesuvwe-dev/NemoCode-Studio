# 🧹 Cleanup & Revive Task List

## 🎯 Objective
Clean up the legacy Python backend artifacts and ensure the new Rust-native architecture is fully functional and "alive".

## 🗑️ Cleanup (Remove Legacy Artifacts)
- [ ] **Remove Root Scripts**:
    - [ ] `start.sh`
    - [ ] `start_backend.sh`
    - [ ] `run.sh`
    - [ ] `quick_start.sh`
    - [ ] `install.sh`
    - [ ] `start_desktop.sh`
- [ ] **Remove Backend Directory**:
    - [ ] Delete `backend/` directory (if exists).
    - [ ] Delete `nemocode-backend.spec`.
- [ ] **Remove Legacy Data**:
    - [ ] Delete `chroma_db/` (replaced by LanceDB).
    - [ ] Delete `nemo_context.db`.
    - [ ] Delete `*.log` files in root (`server.log`, `ollama.log`, etc.).

## 🦀 Rust Backend Enhancements
- [ ] **Implement Model Listing**:
    - [ ] Add `get_models` to `LlmClient` in `src-tauri/src/llm.rs` (call `/api/tags` on Ollama).
    - [ ] Expose `get_models` command in `src-tauri/src/lib.rs`.
- [ ] **Implement History**:
    - [ ] Add `get_history` command in `src-tauri/src/lib.rs` (return agent history).
    - [ ] Add `clear_history` command.

## ⚛️ Frontend Updates (`RealChat.tsx`)
- [ ] **Remove Legacy Polling**:
    - [ ] Remove `fetch('${backendUrl}/tasks')`.
    - [ ] Remove `fetch('${backendUrl}/models')`.
    - [ ] Remove `fetch('${backendUrl}/history')`.
- [ ] **Integrate Native Commands**:
    - [ ] Use `invoke('get_models')` to populate model selector.
    - [ ] Use `invoke('get_history')` to load history.
    - [ ] Use `invoke('clear_history')` for new conversation.
- [ ] **Fix Settings**:
    - [ ] Remove "Backend URL" setting (or rename to "Ollama URL").
    - [ ] Ensure "Live RAG" toggles the Rust RAG system.

## 📚 Documentation
- [ ] **Update README.md**:
    - [ ] Remove Python requirements.
    - [ ] Update "Quick Start" to use `npm run tauri dev`.
- [ ] **Update HOW_TO_RUN.md**:
    - [ ] Remove Python instructions.
    - [ ] Simplify to `npm run tauri dev` or `npm run tauri build`.

## ✅ Verification
- [ ] **Build Check**: Run `npm run tauri build` to ensure no broken links.
- [ ] **Runtime Check**: Start app, verify chat works, voice works, and RAG works.
