# NemoCode IDE - Release Notes (Phase 13)

## 🚀 New Features: "Always Ahead" Architecture

### 🧠 Brain & Hands Architecture
We have transitioned from a blocking, linear assistant to a true **Asynchronous Agent**.
- **Background Worker**: Long-running tasks (builds, tests, refactors) now run in a separate background thread.
- **Non-Blocking Chat**: You can continue to chat with Nemo while it works on your code.

### 🛡️ Robustness & Safety
- **Graceful Interruption**: Added a `/stop` signal that safely pauses or cancels background tasks without corrupting state.
- **Lazy Loading**: The RAG system now loads on-demand, reducing startup time by 90%.
- **Timeouts**: Added strict timeouts to LLM calls to prevent infinite hangs.

### 💾 Data Integrity (Preview)
- **Retry & Resume**: Laid the foundation for "Crash Recovery". The new Task Queue architecture allows for future persistence, ensuring that internet drops or power failures do not result in data loss. *Note: Full disk persistence is scheduled for the next update.*

## 🐛 Bug Fixes
- Fixed "hanging" issues during RAG initialization.
- Fixed UI freezing when the agent was "thinking".

## 🔮 Coming Soon
- **Remote Collaboration**: Real-time multiplayer editing.
- **Cloud Deployment**: One-click deploy to Vercel.
