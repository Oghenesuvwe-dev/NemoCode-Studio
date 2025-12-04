# Nemo Code IDE: UI Specification & Optimization Strategy

## 1. Visual Architecture (Tauri Phase)

### A. The "Static DevOps Strip" (Far Left)
A permanent, always-visible vertical strip separate from the standard file navigation.
*   **GitHub**: Click to open PR/Issue dashboard. *Requires Token Auth*.
*   **AWS**: Status of deployed resources/Lambda functions.
*   **Docker**: Container status and quick actions (up/down).
*   **Jira/Linear**: Ticket queue for the current sprint.

### B. Agent Manager Panel (Bottom/Tabbed)
A dedicated UI for observing and controlling the autonomous agents.
*   **Agent Cards**:
    *   **Review Agent**: Watches for file saves, runs linting/security checks.
    *   **Planner Agent**: Breaks down high-level tasks.
    *   **DevOps Agent**: Handles deployment and CI/CD.
*   **Controls**: `Pause`, `Resume`, `Kill`, `View Logs`.
*   **Status Indicators**: "Thinking" (Animated), "Idle" (Green), "Error" (Red).

### C. Main Editor Area
*   **Tabs**: Standard file editing.
*   **Split Views**: Support for side-by-side editing.
*   **Context Menu**: "Add to Agent Context" (Right-click).

### D. AI Sidebar (Right)
*   **Model Selector**: Dropdown to switch between Llama 3.1 (Local), GPT-4, Claude.
*   **Chat History**: Persistent chat sessions.
*   **Tool Usage**: Visual indicators when the agent uses a tool (e.g., "Reading file...", "Running grep...").

---

## 2. Optimization & Performance Strategy

### "Are hanging and background issues resolved?"
**YES.** The move to Tauri + Rust fundamentally solves the issues encountered in the Electron prototype:

| Issue | Electron Cause | Tauri/Rust Solution |
| :--- | :--- | :--- |
| **UI Hanging** | The UI and heavy logic (Node.js) often shared the same thread or process group. | **Strict Separation**: The UI is just a lightweight web page (WebView). The heavy logic (Agents, File I/O) runs in **Rust** on separate, OS-level threads. The UI *cannot* hang because the backend is busy. |
| **Blank Screen** | Complex build chains (Webpack + Node + Electron) often failed to load resources. | **Native WebView**: Tauri uses the OS's native web renderer (WebKit on macOS). It serves assets directly from the Rust binary, eliminating complex local server/protocol errors. |
| **Uncontrollable Window** | Electron requires manual window frame management. | **Native Windowing**: Rust handles the window frame, resizing, and controls natively. It is robust and distinct from the web content. |
| **Background Execution** | Node.js processes can be fragile when the window is hidden/closed. | **Rust Sidecars**: The "Agent Manager" will spawn agents as **Sidecars** (independent processes) or **Rust Threads**. They continue running even if the UI is minimized or closed (if configured to tray). |

### Optimization Techniques
1.  **Virtual Scrolling**: For the "Agent Logs" and "Chat", we will use virtual scrolling to handle thousands of log lines without slowing down the UI.
2.  **State Hydration**: The Rust backend will hold the "Truth". When the UI loads, it simply asks Rust "What is the state?" and renders it. No complex initialization logic in the frontend.
3.  **Lazy Loading**: The "DevOps" panels (AWS/GitHub) will only fetch data when their icon is clicked, keeping startup instant.

## 3. Phase 6: Multimodal Interaction Design

### A. The "Thought Window" (Brain Visualization)
A dedicated, collapsible panel or separate window that visualizes the agent's internal reasoning process.
*   **Visual Style**: "Matrix" or "Terminal" aesthetic. Green/Blue text on black background.
*   **Content**: Streams intermediate "thoughts" (e.g., "Scanning file structure...", "Found error in line 42", "Formulating fix...").
*   **Animation**: Text appears character-by-character or line-by-line to simulate typing/thinking.

### B. Voice Controls
*   **Toggle**: A microphone icon in the Chat UI to enable/disable Voice Mode.
*   **Feedback**: Visual waveform or pulsing circle when the agent is speaking.
*   **Technology**: Web Speech API for zero-latency TTS in the frontend.
