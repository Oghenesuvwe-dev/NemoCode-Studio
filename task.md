# 🚀 Nemo Code IDE - Master Roadmap

## Phase 0: Foundation Repair (Current Priority)
**Level:** Functional MVP. The UI works and connects to the backend.
- [x] Debug Empty UI (Migrated to React) <!-- id: 40 -->
- [x] Verify Backend Connection (Implicit in new UI) <!-- id: 41 -->

## Phase 1: Model Flexibility
**Level:** Multi-Model Intelligence. User can choose the right brain for the job (Llama 3.1, GPT-4, etc.).
- [x] **Backend**: Update `server.py` and `agent.py` to accept dynamic model parameters. <!-- id: 42 -->
- [x] **Frontend**: Add a **Model Selector Dropdown** in the Chat UI. <!-- id: 43 -->
- [x] **Ollama Integration**: Dynamically fetch available local models. <!-- id: 44 -->

## Phase 2: Context Awareness
**Level:** Context-Aware Coding. The agent "sees" what you see.
- [x] **Frontend**: Implement **@file** mentions to attach specific files to context. <!-- id: 45 -->
- [x] **Frontend**: Add "Add to Context" right-click menu in File Explorer. <!-- id: 46 -->
- [x] **Backend**: Enhance RAG to prioritize explicitly mentioned files. <!-- id: 47 -->

## Phase 3: Tool Integration (MCP)
**Level:** Agentic IDE. The agent can *do* things (check tickets, deploy code).
- [x] **Backend**: Implement full **Model Context Protocol (MCP)** client (Mocked for demo, ready for real server). <!-- id: 48 -->
- [x] **Tools**: Add support for Jira, GitHub, and Postgres connectors. <!-- id: 49 -->
- [x] **Frontend**: Add UI for managing active tools/connectors. <!-- id: 50 -->

## Phase 4: Autonomous Agents
**Level:** Autonomous Engineer. The agent plans and executes complex multi-step tasks.
- [x] **Backend**: Implement "Manager Agent" for high-level planning. <!-- id: 51 -->
- [x] **Frontend**: Add "Plan Mode" UI to visualize and approve execution steps. <!-- id: 52 -->

## Phase 5: Architecture Migration (Non-Chromium)
**Level:** High-Performance Native. Moving away from Electron to a lighter, faster stack.
- [x] **Fix Blank Screen**: Resolve current Electron build issues to ensure immediate usability. <!-- id: 53 -->
- [x] **Prototype Tauri Shell**: Create a proof-of-concept Tauri app wrapping the current UI. <!-- id: 54 -->
- [x] **Migrate Backend**: Port Node.js/Electron main process logic to Rust (via Sidecar). <!-- id: 55 -->
- [x] **Switch Engine**: Fully replace Electron with Tauri (WebKit/WebView2). <!-- id: 56 -->
- [x] **Window Controls**: Implement custom title bar and window controls in the UI. <!-- id: 57 -->

## Phase 6: Multimodal Interaction (Enhancement)
**Level:** Jarvis-like Experience. The agent speaks and visualizes its reasoning.
- [x] **Thought Streaming**: Stream intermediate reasoning steps ("thoughts") from backend to UI. <!-- id: 58 -->
- [x] **Voice Output (TTS)**: Implement Text-to-Speech using Web Speech API or local Python library. <!-- id: 59 -->
- [x] **Thought Window**: Create a dedicated UI panel or window to visualize the "Brain" (matrix/terminal style). <!-- id: 60 -->

## Phase 7: Agent Swarms (Collaboration)
**Level:** Engineering Team. Multiple specialized agents working together.
- [x] **Swarm Orchestrator**: Backend logic to delegate tasks to sub-agents (Reviewer, Coder, DevOps). <!-- id: 61 -->
- [x] **Inter-Agent Messaging**: Enable agents to pass context and results to each other. <!-- id: 62 -->
- [x] **Swarm UI**: Update Agent Manager to visualize real-time status and logs of multiple agents. <!-- id: 63 -->

## Phase 8: Robustness & Self-Healing (Safety)
**Level:** "Always Running". The IDE recovers from errors and never hangs.
- [x] **Process Supervision**: Ensure backend sidecars (Python/Ollama) automatically restart if they crash. <!-- id: 64 -->
- [x] **Error Recovery**: Agents self-correct when tools fail (e.g., "File not found" -> "List dir"). <!-- id: 65 -->
- [x] **State Persistence**: Save chat/agent state to disk so the IDE "remembers" after a restart. <!-- id: 66 -->

## Phase 9: Voice Input (Accessibility)
**Level:** "Talk to Code". Hands-free interaction.
- [x] **Speech-to-Text**: Implement Whisper or browser-native STT for voice input. <!-- id: 67 -->
- [x] **Wake Word**: Add detection for "Hey Nemo" to activate listening. <!-- id: 68 -->
- [x] **Voice Commands**: Map voice commands to IDE actions (e.g., "Run tests"). <!-- id: 69 -->

## Phase 10: Advanced Visualizations (Insight)
**Level:** "See the Code". Graphical representation of complex systems.
- [x] **Graph View**: Visualize file dependencies and import structures. <!-- id: 70 -->
- [x] **Live Preview**: Render React/HTML components in the Agent Manager panel. <!-- id: 71 -->
- [x] **Kanban Board**: Interactive board for managing agent tasks and plans. <!-- id: 72 -->

## Phase 11: Enterprise Infrastructure (Scale & Security)
**Level:** "Production Ready". Secure and scalable deployment.
- [x] **Remote Backend**: Allow connection to remote GPU servers for AI processing. <!-- id: 73 -->
- [x] **Docker Sandbox**: Execute agent commands inside isolated containers. <!-- id: 74 -->
- [x] **Secrets Management**: Secure storage for API keys and credentials. <!-- id: 75 -->

## Phase 12: Polish & Quality Assurance (Refinement)
**Level:** "Consumer Grade". Smooth, bug-free experience.
- [x] **Control Center UI**: Add toggles for RAG, Visual Effects, and Autonomy Levels. <!-- id: 76 -->
- [x] **Robustness Hardening**: Ensure system is resistance to hangs/crashes (Lazy Loading, Timeouts). <!-- id: 77 -->
- [x] **E2E Testing**: Run full end-to-end tests of complex coding tasks (e.g., "Build a Todo App"). <!-- id: 78 -->
- [ ] **Performance Optimization**: Reduce memory usage and startup time. <!-- id: 79 -->

## Phase 13: Cloud & Collaboration (Expansion)
**Level:** "Team Player". Multiplayer coding and deployment.
- [x] **Background Worker System**: Implement Task Queue for non-blocking execution ("Brain & Hands"). <!-- id: 80 -->
- [x] **Graceful Interruption**: Allow pausing/updating tasks without losing state. <!-- id: 81 -->
- [x] **Remote Collaboration**: Real-time shared editing (WebSocket Broadcast). <!-- id: 82 -->
- [x] **Cloud Deployment**: One-click deploy to Vercel/Netlify/Cloudflare. <!-- id: 83 -->
- [x] **Generic MCP Client**: Support for Public, Private, and Hybrid Cloud Providers. <!-- id: 84 -->

## Phase 14: Superpowers & Specialization (Next)
**Level:** "Demigod". Specialized brains and infinite tools.
- [ ] **AI Model Matrix**: Assign specific models (Qwen, GPT-4o) to specific agents (Coder, Reviewer). <!-- id: 85 -->
- [ ] **Demi Mode Controls**: Implement "Turbo Allow Policy" for dangerous actions. <!-- id: 86 -->
- [ ] **MCP Tool Expansion**: Integrate Figma (TypeScript), Sentry, and Kubernetes via MCP. <!-- id: 87 -->
- [ ] **Advanced Visualizers**: Interactive Graph View and Browser Device Emulation. <!-- id: 88 -->
