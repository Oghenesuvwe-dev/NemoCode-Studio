# Implementation Plan: Multimodal Interaction (Phase 6)

## Objective
Enhance the Nemo Code IDE with **Multimodal Interaction** capabilities, allowing the agent to "speak" its response and visualize its internal reasoning process ("thoughts") in a dedicated UI.

## Architecture Overview
*   **Frontend**: React/Tauri. Uses **Web Speech API** for TTS and renders a new "Thought Window" component.
*   **Backend**: Python (FastAPI). Modified to stream "thoughts" (intermediate steps) separate from the final response.

## Step-by-Step Plan

### 1. Frontend: Voice Output (TTS)
- [x] **Implement TTS Hook**: Create a `useSpeechSynthesis` hook or utility function in React.
- [x] **Add UI Toggle**: Add a "Speaker" icon to the Chat UI to mute/unmute the agent.
- [x] **Integrate**: Trigger speech when a new message arrives from the AI (if unmuted).

### 2. Backend: Thought Streaming
- [x] **Update Agent Logic**: Modify `NemotronAgent.chat` to yield intermediate steps (e.g., "Searching files...", "Reading context...") before the final answer.
- [x] **API Update**: Ensure the `/chat` endpoint can return these intermediate states (or use a streaming response format). *Note: For simplicity, we might initially include thoughts in the JSON response under a `thoughts` key.*

### 3. Frontend: Thought Window UI
- [x] **Create Component**: Build `ThoughtWindow.tsx` with a "Matrix/Terminal" aesthetic (dark bg, green monospace text).
- [x] **Integrate**: Add a collapsible panel or a new tab in the bottom panel for the Thought Window.
- [x] **Animation**: Implement a typing effect for the thought stream.

### 4. Integration & Polish
- [x] **Sync Voice & Text**: Ensure the voice speaks the final response, while the Thought Window shows the reasoning.
- [x] **Testing**: Verify TTS works on macOS (Tauri WebView).

## Risk Assessment
*   **Latency**: Streaming thoughts might introduce complexity in the request/response cycle.
*   **Browser Support**: Web Speech API is generally supported but might behave differently in Tauri's WebView on different OSs.
