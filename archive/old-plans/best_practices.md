# NemoCode IDE - Best Practices & Design Principles

## 1. User Experience (UX) - The "Control Center" Philosophy
The user must always feel in control of the AI, even when it is acting autonomously.
- **Feature Toggles**: Critical features must be toggleable via the UI.
    - **Live RAG**: Switch to enable/disable context retrieval.
    - **Visual Effects ("Wow Factor")**: Switch to toggle high-end animations/glassmorphism for performance or preference.
    - **Autonomy Level**: Switch between "Supervised" (Ask before acting) and "Autonomous" (Decide and proceed).
- **Visual Feedback**: The UI must indicate *why* the agent is waiting or what it is doing (e.g., "Thinking...", "Waiting for Approval").

## 2. Architectural Robustness & Resilience
- **Failure Resistance**: The system must not hang or crash if a component fails.
    - **Lazy Loading**: Heavy components (RAG, LLMs) must load asynchronously.
    - **Graceful Degradation**: If RAG fails, the agent should continue without it.
    - **Self-Healing**: The agent should attempt to restart failed subprocesses (like the sidecar).
- **Testing**: Every feature must be "hanging-resistant".
    - **Timeouts**: All network/process calls must have strict timeouts.
    - **E2E Verification**: Features are only "done" when verified by an end-to-end test.

## 3. Asynchronous Agency ("Always Ahead")
- **Non-Blocking Execution**: The IDE must support "Fire and Forget" tasks.
    - **Background Prioritization**: When in "Autonomous/Turbo" mode, long-running tasks (builds, refactors) must run in a background thread/worker.
    - **Responsiveness**: The "Chat Agent" must remain available to answer user queries even while the "Worker Agent" is busy coding.
    - **Proactivity**: The system should actively scan for issues (lint errors, failed tests) in the background and queue fixes without explicit user prompting.

## 4. Graceful Interruption & State Preservation
- **"Stop" != "Destroy"**: Interrupting an agent must never result in data loss or abandoned state.
    - **Atomic Actions**: File edits and commands should be atomic. If interrupted, the file should remain in a valid state (either the old version or the new one, never half-written).
    - **Context Update**: When interrupted with new instructions, the agent must:
        1.  **Pause**: Safely suspend the current task.
        2.  **Ingest**: Read the new user instruction.
        3.  **Refine**: Update the existing plan/todo list with the new requirement.
        4.  **Resume**: Continue execution with the updated context.
    - **Cleanup**: If a task is fully cancelled, the agent must clean up temporary files or processes (e.g., kill a running server) before switching context.

## 5. Security
- **Sandboxing**: All agent code execution happens in isolated containers.
- **Secrets**: API keys are never stored in plain text or git.

## 6. Code Quality
- **Typed Strictness**: Use TypeScript strict mode.
## 7. Latency & Responsiveness ("No Hanging")
- **Zero-Block Policy**: The UI thread must NEVER block. All heavy lifting (AI generation, file I/O) must happen in background workers.
- **Optimistic UI**: The interface should react immediately to user input (e.g., showing a "Queued" state) before the backend confirms.
- **Timeouts**: Every network call must have a timeout. If it takes too long, fail fast and let the user retry.

## 8. Connection Recovery ("The Wake Up Call")
- **Retry Button**: A prominent "Retry" or "Wake Up" button must be available if the connection drops.
- **Stateful Resume**: Clicking "Retry" should not just restart the request, but **resume** from the last saved state (using the Task Queue persistence).
## 9. Collaboration Standards
- **Real-Time Sync**: All collaborative edits must use WebSockets or CRDTs. Polling is forbidden for text editing.
- **Conflict Resolution**: In MVP, "Last Write Wins". In Production, use Yjs/Automerge.
- **Presence**: Users must see who else is in the session (e.g., "User A is typing...").

## 10. Cloud Security (MCP)
- **Zero-Trust**: The IDE never stores cloud credentials directly. It relies on the local MCP server to handle auth.
- **Least Privilege**: Only request tools that are absolutely necessary (e.g., `s3:ListBuckets`, not `*:*`).
- **Audit Logging**: All cloud actions (deploy, delete) must be logged to the "Agent Manager" panel.
