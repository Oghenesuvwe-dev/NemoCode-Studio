# Phase 13: Cloud & Collaboration (Expansion) - Implementation Plan

## Objective
Transition NemoCode from a linear, blocking assistant to an **Asynchronous, "Always Ahead" Agent**. This involves splitting the architecture into a "Brain" (Chat/API) and "Hands" (Background Worker) to support non-blocking execution, graceful interruption, and dynamic re-planning.

## Architecture: "Brain & Hands"
We will decouple the **Decision Engine** from the **Execution Engine**.

1.  **The Brain (API Server)**:
    *   Handles HTTP/WebSocket requests from the UI.
    *   Manages the Conversation History and High-Level Plan.
    *   **Delegates** heavy tasks to the Worker via a Task Queue.
    *   **Interrupts** the Worker when the user provides new input.

2.  **The Hands (Background Worker)**:
    *   Polls the Task Queue.
    *   Executes atomic actions (File Edits, Commands, RAG).
    *   Streams logs/status back to the Brain/UI.
    *   Can be paused/cancelled safely.

3.  **The State (Shared Memory)**:
    *   **Task Queue**: A priority queue for pending actions.
    *   **Workspace State**: File system (source of truth).
    *   **Agent State**: "Idle", "Working", "Paused".

## Feature Breakdown

### 1. Background Worker System <!-- id: 80 -->
- **Task Queue**: Implement a simple in-memory queue (or Redis-lite) to manage tasks.
- **Worker Process**: A separate thread/process that consumes the queue.
- **Action Handlers**: Move `edit_file`, `run_command` logic to the worker.

### 2. Graceful Interruption <!-- id: 81 -->
- **Interrupt Signal**: Mechanism to stop the current worker task (e.g., `Event` flag).
- **State Preservation**: Ensure the worker saves its progress (e.g., "Step 3/5 complete") before stopping.
- **Re-planning**: When interrupted, the Brain reads the new prompt + current state -> generates a *new* plan -> pushes new tasks to the queue.

### 3. Generic MCP Client (Cloud Integrations) <!-- id: 84 -->
- **Status**: ✅ Completed
- **Objective**: Connect to external Cloud Providers (AWS, Azure, Nutanix) without bloating the IDE.
- **Architecture**:
    - `MCPClient`: A Python class that manages connections to local MCP servers (subprocesses).
    - **Transport**: Stdio (Standard Input/Output) communication with MCP binaries.
    - **Tool Registry**: Dynamically register tools exposed by MCP servers (e.g., `aws_list_instances`, `nutanix_deploy_vm`).
- **UI**:
    - "Cloud Connect" button in Settings.
    - Configuration form for MCP Server command (e.g., `npx -y @modelcontextprotocol/server-aws`).

### 4. Remote Collaboration (Real-Time) <!-- id: 82 -->
- **Status**: ✅ Completed (MVP)
- **Objective**: Google Docs-style multiplayer coding.
- **Tech Stack**: WebSocket Server (Broadcast).
- **Implementation**:
    - **Backend**: `/collab/{doc_id}` WebSocket endpoint.
    - **Frontend**: Connect Editor to WebSocket.

### 5. Cloud Deployment (One-Click) <!-- id: 83 -->
- **Status**: ✅ Completed
- **Objective**: One-click deploy to major platforms.
- **Supported Providers**:
    - **Vercel** (Frontend/Next.js) via MCP or CLI.
    - **Netlify** (Static Sites) via CLI.
    - **Cloudflare Workers** (Wrangler) via CLI.
    - **Render** (Full Stack) via MCP.
- **Implementation**:
    - **Backend**: `DeploymentManager` to detect project type (e.g., `package.json` -> Next.js -> Suggest Vercel) and trigger the appropriate tool.
    - **UI**: "Deploy" button in the Title Bar.

## Implementation Steps (Updated)

1.  **Implement MCP Client**:
    - Create `backend/mcp_client.py`.
    - Implement `StdioClientTransport`.
    - Integrate with `agent.py` tool execution.
2.  **Cloud UI**:
    - Add "Connectors" tab to Settings.
    - Allow adding/removing MCP servers.
3.  **Remote Collaboration**:
    - Set up Yjs WebSocket server.
    - Connect frontend editor.

## Best Practices Checklist
- [ ] **Atomic Actions**: Ensure file writes are atomic to prevent corruption on interrupt.
- [ ] **Zombie Prevention**: Ensure subprocesses (like `npm start`) are killed when the worker stops.
- [ ] **Feedback**: The UI must clearly show "Background Work in Progress".
