# Chatbot Improvement Plan

## Objective
Optimize the NemoCode IDE chatbot for speed, usability, and flexibility. Address slow loading times, lack of streaming, and model selection limitations.

## Phase 1: Immediate Fixes & Backend Prep
- [ ] **Update Default Model**: Change the hardcoded model in `src-tauri/src/lib.rs` from `llama3.1` to `llama3.1:latest` (or a known instruct variant) to ensure better instruction following and speed.
- [ ] **Implement `set_model` Command**: Add a Tauri command in `lib.rs` and `agent.rs` to allow the frontend to dynamically update the active model in `LlmClient`.
- [ ] **Verify `get_models`**: Ensure the existing `get_models` command returns the list of available Ollama models correctly.

## Phase 2: Frontend UI/UX Enhancements
- [ ] **Model Selector Dropdown**: Add a dropdown menu in `RealChat.tsx` (header area) to list available models fetched from `get_models`.
- [ ] **Connect Selector to Backend**: When a user selects a model, invoke the `set_model` command to update the agent's configuration.
- [ ] **Loading State Feedback**: Ensure the UI clearly indicates when the agent is "Thinking" or "Working" (executing tools), potentially using the existing `SkeletonLoader` or a status indicator.

## Phase 3: Streaming Response Support (Major Performance Upgrade)
- [ ] **Update `LlmClient` for Streaming**: Modify `src-tauri/src/llm.rs` to support `stream: true` in the request and return a stream of chunks.
- [ ] **Update `Agent` for Streaming**: Refactor `agent.rs` to handle streaming responses. *Note: Tool calling with streaming is complex; we might need to buffer for tool calls or use a hybrid approach.*
- [ ] **Frontend Streaming Handler**: Update `RealChat.tsx` to handle incoming stream events (using Tauri events or a streaming command) and update the message content in real-time.

## Phase 4: Optimization
- [ ] **Tool Definition Optimization**: Investigate sending tool definitions only when necessary or optimizing the prompt to reduce overhead.
- [ ] **Turn Limits**: Review and potentially adjust `max_turns` in `agent.rs` to prevent long loops, or add a "Stop" button functionality that actually kills the generation.
