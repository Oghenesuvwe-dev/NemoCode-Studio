# NemoCode IDE — Architecture & Capabilities

Technical overview of the AI-powered IDE.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     NemoCode IDE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Tauri     │    │   React     │    │  Python     │     │
│  │   (Rust)    │◄──►│   Frontend  │◄──►│  Backend    │     │
│  │             │    │             │    │             │     │
│  │  - Window   │    │  - UI       │    │  - Agent    │     │
│  │  - Process  │    │  - Editor   │    │  - RAG      │     │
│  │  - IPC      │    │  - Chat     │    │  - MCP      │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                              │              │
│                                              ▼              │
│                                        ┌─────────────┐     │
│                                        │   Ollama    │     │
│                                        │   (LLM)     │     │
│                                        └─────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Components

### The Shell (Tauri/Rust)

**Role:** Native desktop wrapper

**Responsibilities:**
- Window management (drag, resize, minimize, maximize)
- Process lifecycle (spawn, monitor, terminate)
- IPC bridge between frontend and backend
- File system access
- System integration (clipboard, notifications)

**Key Files:**
- `tauri-shell/src-tauri/src/lib.rs`
- `tauri-shell/src-tauri/tauri.conf.json`

---

### The UI (React/TypeScript)

**Role:** User interface

**Responsibilities:**
- Editor rendering and interaction
- File explorer and navigation
- Chat interface
- Terminal emulation
- Settings management
- Visual feedback

**Key Components:**
- `App.tsx` — Main layout and state
- `FileExplorer.tsx` — File tree
- `RealChat.tsx` — AI chat interface
- `TerminalComponent.tsx` — Terminal emulator
- `CommandPalette.tsx` — Quick commands

---

### The Brain (Python/FastAPI)

**Role:** AI orchestration

**Responsibilities:**
- LLM communication via Ollama
- RAG retrieval from ChromaDB
- Agent loop (plan, execute, observe)
- Tool execution
- MCP protocol handling

**Key Files:**
- `backend/server.py` — FastAPI endpoints
- `backend/agent.py` — Agent logic
- `backend/rag.py` — Vector search
- `backend/mcp_client.py` — Cloud connectors

---

### The Memory (ChromaDB)

**Role:** Semantic search

**Responsibilities:**
- Index codebase files
- Embed text chunks
- Retrieve relevant context
- Persist vectors locally

**Configuration:**
- Embedding model: `all-MiniLM-L6-v2`
- Chunk size: 500 tokens
- Overlap: 50 tokens

---

## Agent System

### Brain & Hands Architecture

The agent is split into two parts:

**Brain (Decision Engine)**
- Receives user requests
- Manages conversation history
- Creates execution plans
- Delegates to worker

**Hands (Execution Engine)**
- Runs in background thread
- Executes atomic actions
- Streams progress to UI
- Can be paused/cancelled

### Agent Loop

```
User Request
     │
     ▼
┌─────────┐
│  Plan   │ ─── Break into steps
└────┬────┘
     │
     ▼
┌─────────┐
│ Execute │ ─── Run current step
└────┬────┘
     │
     ▼
┌─────────┐
│ Observe │ ─── Check result
└────┬────┘
     │
     ▼
  Success? ──No──► Retry/Fix
     │
    Yes
     │
     ▼
  More steps? ──Yes──► Execute
     │
    No
     │
     ▼
  Complete
```

### Agent Modes

| Mode | Behavior |
|------|----------|
| Supervised | Pause after each step for approval |
| Autonomous | Execute all steps without stopping |
| Turbo | Fast execution, minimal logging |

---

## Browser System

The IDE uses a dual-browser architecture for different purposes:

### 1. Built-in Browser (WebKit) — Inside IDE

| Aspect | Detail |
|--------|--------|
| Engine | WebKit (non-Chromium) via Tauri WebView |
| Location | Browser panel inside the IDE |
| Purpose | View web content without leaving the IDE |
| Use Cases | Preview localhost, view docs, render HTML |
| Control | User browses or agent displays content |

### 2. Desktop Browser Control (Playwright) — User's Machine

| Aspect | Detail |
|--------|--------|
| Engine | User's installed browser (Chrome, Firefox, etc.) |
| Location | Real browser window on user's desktop |
| Purpose | Agent performs web tasks requiring real browser |
| Use Cases | Google search, GitHub actions, form filling, logins |
| Control | Agent controls browser, user watches in real-time |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    NemoCode IDE                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Built-in Browser (WebKit)               │   │
│  │                                                 │   │
│  │    • Preview localhost:3000                     │   │
│  │    • View documentation                         │   │
│  │    • Render HTML output                         │   │
│  │    • Non-Chromium, lightweight                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────┐
│         User's Desktop (Separate Window)                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │      Desktop Browser (Playwright Control)       │   │
│  │                                                 │   │
│  │    • Agent opens Chrome/Firefox                 │   │
│  │    • Google searches                            │   │
│  │    • Open GitHub repos                          │   │
│  │    • Fill forms, click buttons                  │   │
│  │    • Login to websites                          │   │
│  │    • User watches agent's actions               │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Example Usage

| User Request | Browser Used | Action |
|--------------|--------------|--------|
| "Preview my app" | Built-in (WebKit) | Shows localhost:3000 in IDE panel |
| "Search for React hooks" | Desktop (Playwright) | Opens Chrome, searches Google |
| "Open my GitHub repo" | Desktop (Playwright) | Opens Chrome, navigates to repo |
| "Show MDN fetch docs" | Built-in (WebKit) | Displays page in IDE panel |
| "Fill out this form for me" | Desktop (Playwright) | Agent controls browser, fills form |

---

## Tools

### Built-in Tools

| Tool | Capability |
|------|------------|
| `read_file` | Read file contents |
| `write_file` | Create or update files |
| `list_directory` | List folder contents |
| `run_command` | Execute shell commands |
| `search_codebase` | RAG semantic search |
| `browse_url` | Fetch web pages (Playwright) |
| `screenshot_page` | Capture web page (Playwright) |
| `click_element` | Click on page element (planned) |
| `fill_form` | Fill form fields (planned) |

### MCP Tools (External)

| Connector | Capabilities |
|-----------|--------------|
| AWS | List EC2, S3, RDS |
| Terraform | Validate, plan |
| Docker | List, start, stop containers |
| Kubernetes | Get pods, nodes, services |

---

## Security

### Sidecar Validation

Only approved binaries can be executed:

```python
ALLOWED_SIDECARS = [
    "python",
    "node",
    "npm",
    "ollama"
]
```

### Secrets Management

API keys stored in OS Keyring:
- macOS: Keychain
- Windows: Credential Manager
- Linux: Secret Service

### Content Security Policy

```json
{
  "csp": "default-src 'self'; script-src 'self'"
}
```

---

## Performance

### Optimizations

| Optimization | Impact |
|--------------|--------|
| Token buffering | 50x fewer IPC events |
| Binary serialization | 55% smaller payloads |
| Tool caching | 500x faster lookups |
| Context pruning | 97% token reduction |

### Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| File open | < 500ms | ~200ms |
| Search (1000 files) | < 2s | ~1.5s |
| AI response start | < 3s | ~2s |
| Memory (idle) | < 500MB | ~400MB |

---

## Data Flow

### Chat Request

```
User types message
       │
       ▼
React captures input
       │
       ▼
POST /chat to backend
       │
       ▼
Agent processes request
       │
       ▼
RAG retrieves context
       │
       ▼
Ollama generates response
       │
       ▼
Stream tokens to frontend
       │
       ▼
React renders incrementally
```

### File Operation

```
User clicks save
       │
       ▼
React calls Tauri command
       │
       ▼
Rust writes to filesystem
       │
       ▼
Success/error returned
       │
       ▼
UI updates state
```

---

## Deployment

### One-Click Deploy

Supported platforms:

| Platform | Project Type | Command |
|----------|--------------|---------|
| Vercel | Next.js, React | `vercel deploy` |
| Netlify | Static sites | `netlify deploy` |
| Cloudflare | Workers | `wrangler deploy` |
| Render | Full stack | `render deploy` |

### Detection Logic

```python
def detect_platform(workspace):
    if has_file("next.config.js"):
        return "vercel"
    if has_file("netlify.toml"):
        return "netlify"
    if has_file("wrangler.toml"):
        return "cloudflare"
    return "render"
```

---

## Collaboration

### Real-Time Editing

- Protocol: WebSocket
- Sync: Operational Transform
- Latency: < 100ms

### Session Sharing

```
Host starts session
       │
       ▼
Generate session ID
       │
       ▼
Share invite link
       │
       ▼
Guest connects via WebSocket
       │
       ▼
Cursors and edits sync
```

---

## Extensibility

### Adding Tools

1. Create tool function in `backend/tools/`
2. Register in agent's tool list
3. Add to system prompt

```python
@tool
def my_tool(param: str) -> str:
    """Description for the AI."""
    return result
```

### Adding MCP Connectors

1. Create connector in `backend/mcp_connectors/`
2. Implement `connect()`, `list_tools()`, `call_tool()`
3. Register in settings UI

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+S | Save file |
| Cmd+Z | Undo |
| Cmd+Shift+Z | Redo |
| Cmd+Shift+P | Command palette |
| Cmd+R | Reload window |
| Cmd+L | Focus chat |
| Cmd+` | Toggle terminal |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `tauri.conf.json` | Tauri settings, security |
| `.env` | Environment variables |
| `config.json` | User preferences |
| `tasks.json` | Persisted task queue |

---

## Logs

| Location | Content |
|----------|---------|
| `backend/logs/` | Server logs |
| `~/.nemocode/logs/` | Application logs |
| Console (DevTools) | Frontend logs |

---

## Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Ollama Documentation](https://ollama.ai/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
