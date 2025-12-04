# Phase 8: Robustness & Self-Healing Implementation Plan

## Objective
Ensure the IDE is "always running" and never hangs. It must recover from backend crashes, network failures, and agent errors automatically.

## Strategies

### 1. Process Supervision (The "Watchdog")
- [ ] **Sidecar Monitor**: Implement a mechanism in Tauri (Rust) to monitor the Python sidecar process.
- [ ] **Auto-Restart**: If the Python process exits or becomes unresponsive (heartbeat fail), automatically restart it and restore context.

### 2. Agent Error Recovery
- [ ] **Tool Fallbacks**: If a tool fails (e.g., `read_file` fails), the agent should automatically try a fallback strategy (e.g., `list_dir` to check filename) without user intervention.
- [ ] **Exception Handling**: Wrap all LLM calls and tool executions in robust try/catch blocks that feed errors back to the agent as "observations" rather than crashing the app.

### 3. State Persistence
- [ ] **Session Saving**: Periodically save the chat history, active plan, and agent states to a local JSON/SQLite file.
- [ ] **Hydration**: On app launch, check for a saved session and restore it, so the user picks up exactly where they left off.

## Step-by-Step Plan

### 1. Backend Hardening
- [ ] **Heartbeat Endpoint**: Add `GET /health` to Python backend.
- [ ] **Rust Monitor**: Create a polling loop in Tauri to check `/health`.

### 2. Agent Resilience
- [ ] **Retry Logic**: Implement exponential backoff for Ollama API calls.
- [ ] **Self-Correction Prompt**: Update system prompt to explicitly instruct the agent on how to handle tool errors.

### 3. Persistence Layer
- [ ] **Database**: Set up a simple `sqlite3` database in `backend/` to store sessions.
- [ ] **Auto-Save**: Trigger save on every new message/action.
