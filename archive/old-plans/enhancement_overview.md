# NemoCode IDE: Enhancement & Architecture Overview

## 1. Project Architecture Briefing
**NemoCode** is an autonomous, AI-powered Integrated Development Environment designed to bridge the gap between human intent and code execution.

### Core Components
- **Frontend (Shell):** 
  - **Technology:** Tauri (Rust) + React/TypeScript.
  - **Role:** Provides the native desktop experience, terminal emulation, and chat interface.
- **Backend (Sidecar):**
  - **Technology:** Python (FastAPI).
  - **Role:** Handles heavy orchestration, file system operations, and AI model interaction.
- **Data Layer:**
  - **Technology:** ChromaDB (Vector Store).
  - **Role:** Semantic memory (RAG) for codebase understanding and context retrieval.
- **Communication:**
  - **Protocol:** HTTP/REST (or WebSocket) bridge between Tauri and the Python sidecar.

---

## 2. Best Practices for Hybrid Architecture (Rust/TS/Python)

### Lifecycle Management
- **Strict Process Control:** The Python sidecar must be a child process of the Tauri application. Use Tauri's `Command` sidecar capability to ensure the backend terminates instantly when the frontend closes.
- **Health Checks:** Implement a `/health` endpoint in the Python backend. The frontend should poll this on startup and display a "Connecting to Brain..." state until ready.

### Type Safety & Contracts
- **Shared Schemas:** Do not rely on loose JSON.
  - Use **Pydantic** in Python to define data models.
  - Use tools like `datamodel-code-generator` to automatically generate TypeScript interfaces from `openapi.json` (FastAPI).
- **Validation:** Validate all inputs at the boundary (API endpoints) to prevent silent failures in the Python logic.

### Unified Observability
- **Log Streaming:** Python `stdout/stderr` should be captured by the Rust process and emitted to the frontend console or a unified `app.log` file.
- **Error Propagation:** Backend errors should return structured JSON (e.g., `{ "error": "code", "message": "...", "details": {...} }`) so the UI can display helpful toasts or fix actions.

### Dependency Isolation
- **Containerized Build:** Avoid relying on the user's system Python.
  - Use **PyInstaller** or **Nuitka** to compile the backend into a standalone executable.
  - **Docker Strategy:** Perform the build inside a Docker container to prevent "No space left on device" errors and ensure a clean glibc environment.

---

## 3. Feature Variations & Strategy Pattern
To manage complexity between different modes (Standard, Turbo, Swarm), use the **Strategy Pattern** in the backend.

### Architecture
- **Orchestrator:** The central brain that receives a user goal. It delegates execution to a specific `AgentStrategy`.
- **Strategies:**
  1.  **Standard Mode (Human-in-the-Loop):**
      - Generates a plan.
      - Pauses after every step for user confirmation.
  2.  **Turbo Mode (Autonomous):**
      - Generates a plan.
      - Executes steps in a loop.
      - Stops only on critical errors or completion.
  3.  **Swarm Mode (Multi-Agent):**
      - **Planner Agent:** Decomposes the request into sub-tasks.
      - **Worker Agents:** Execute sub-tasks in parallel (where possible).
      - **Reviewer Agent:** Validates output before merging.

### Frontend Implementation
- **Context-Aware UI:** Use a React Context (`ModeContext`) to switch UI elements.
  - *Standard:* Show "Approve", "Reject", "Modify" buttons.
  - *Turbo:* Show "Stop", "Pause", "View Logs" buttons.

---

## 4. AI Model Strategy: Prioritizing Open Source
To ensure privacy, lower costs, and user control, NemoCode will prioritize high-performance open-weight models.

### Primary Coding Engines (The "Hands")
*These models handle code generation, refactoring, and file editing.*

1.  **Qwen 2.5 Coder (32B):**
    - **Verdict:** Currently the best open-weight coding model for consumer hardware. Rivals GPT-4 in coding benchmarks.
    - **Use Case:** Main code generation, bug fixing, and unit test writing.
    - **Hardware:** Fits on 24GB VRAM (RTX 3090/4090) or Mac Studio (M-series).
2.  **DeepSeek Coder V2 (Lite/Instruct):**
    - **Verdict:** Excellent performance, specifically tuned for repository-level tasks.
    - **Use Case:** Project scaffolding and complex logic.

### Reasoning & Planning Engines (The "Brain")
*These models handle high-level planning, architectural decisions, and task decomposition.*

1.  **Llama 3.1 (70B):**
    - **Verdict:** The open-source standard for reasoning.
    - **Use Case:** Breaking down vague user requests into actionable steps (JSON plans).
    - **Deployment:** Requires significant VRAM (48GB+) or quantization (e.g., GGUF 4-bit).
2.  **Mistral Large 2 (123B) / Qwen 2.5 (72B):**
    - **Verdict:** Top-tier reasoning capabilities.
    - **Use Case:** Complex debugging and architectural review.

### Embedding Models (The "Memory")
*For RAG (Retrieval Augmented Generation) in ChromaDB.*

1.  **Nomic Embed Text (`nomic-embed-text-v1.5`):**
    - **Verdict:** High performance, supports long context (8192 tokens), fully open source.
    - **Use Case:** Indexing the user's codebase for semantic search.
2.  **BGE-M3 (BAAI General Embedding):**
    - **Verdict:** Multi-lingual, dense and sparse retrieval capabilities.

### Serving Infrastructure
To run these models locally within NemoCode:
- **Ollama:** The easiest integration path. NemoCode should bundle or detect an Ollama instance.
- **vLLM:** For high-throughput serving if the user has a powerful dedicated GPU server.
