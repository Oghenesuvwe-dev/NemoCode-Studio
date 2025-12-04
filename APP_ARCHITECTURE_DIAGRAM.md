# Nemo Code IDE - Architecture & Data Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEMO CODE DESKTOP APP                       │
│                    (Tauri + React + TypeScript)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    REACT FRONTEND                        │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  App.tsx (Main Component)                          │  │  │
│  │  │  ├─ Activity Bar (64px)                            │  │  │
│  │  │  ├─ File Explorer (200-400px, resizable)           │  │  │
│  │  │  ├─ Editor (flex, grows)                           │  │  │
│  │  │  │  ├─ Tabs                                        │  │  │
│  │  │  │  └─ Code Editor                                 │  │  │
│  │  │  ├─ Agent Manager (bottom)                         │  │  │
│  │  │  └─ Chat Panel (250-400px, resizable)              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  State Management (Zustand)                        │  │  │
│  │  │  ├─ UI State (activeTab, openTabs, etc.)           │  │  │
│  │  │  ├─ Chat State (messages, model)                   │  │  │
│  │  │  ├─ Agent State (status, logs)                     │  │  │
│  │  │  └─ File State (selectedFile, content)             │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  API Layer                                         │  │  │
│  │  │  ├─ Tauri Invoke (file operations)                 │  │  │
│  │  │  ├─ HTTP Client (backend API)                      │  │  │
│  │  │  └─ WebSocket (real-time updates)                  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Utilities                                         │  │  │
│  │  │  ├─ Error Boundary                                 │  │  │
│  │  │  ├─ Toast Notifications                            │  │  │
│  │  │  ├─ Keyboard Shortcuts                             │  │  │
│  │  │  └─ Resizable Panels                               │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              TAURI RUNTIME (Rust Backend)               │  │
│  │  ├─ Window Management                                   │  │
│  │  ├─ File System Access                                  │  │
│  │  ├─ Process Management (sidecar)                        │  │
│  │  └─ IPC Bridge (invoke commands)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
         │                                    │
         ▼                                    ▼
    ┌─────────────┐                  ┌──────────────────┐
    │ File System │                  │ Backend Server   │
    │ (Local)     │                  │ (localhost:8000) │
    │             │                  │                  │
    │ • Read      │                  │ • Chat API       │
    │ • Write     │                  │ • Agent API      │
    │ • Delete    │                  │ • File API       │
    │ • Rename    │                  │ • WebSocket      │
    └─────────────┘                  └──────────────────┘
```

---

## Data Flow Diagram

### User Action → State Update → UI Render

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│  (Click button, type message, resize panel, etc.)           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  EVENT HANDLER                              │
│  (onClick, onChange, onMouseDown, etc.)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              ZUSTAND STORE UPDATE                           │
│  (setActiveTab, addMessage, updateAgentStatus, etc.)        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            ASYNC API CALL (if needed)                       │
│  (fetch, Tauri invoke, WebSocket)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           STORE UPDATE WITH RESPONSE                        │
│  (setChatMessages, updateAgentStatus, etc.)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         REACT RE-RENDER (affected components)               │
│  (ChatPanel, AgentManager, etc.)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              UI UPDATES ON SCREEN                           │
│  (New message appears, agent status changes, etc.)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App (Main)
├── ActivityBar
│   ├── SidebarIcon (Explorer)
│   ├── SidebarIcon (Search)
│   ├── SidebarIcon (GitHub)
│   ├── SidebarIcon (AWS)
│   ├── SidebarIcon (Docker)
│   ├── SidebarIcon (Jira)
│   └── SidebarIcon (Settings)
│
├── ResizablePanel (Explorer)
│   ├── FileItem (src/)
│   │   ├── FileItem (components/)
│   │   ├── FileItem (App.tsx)
│   │   ├── FileItem (main.tsx)
│   │   └── FileItem (index.css)
│   ├── FileItem (package.json)
│   └── FileItem (tsconfig.json)
│
├── EditorPanel
│   ├── TabBar
│   │   ├── Tab (App.tsx)
│   │   ├── Tab (main.tsx)
│   │   └── Tab (index.css)
│   └── CodeEditor
│       └── (Syntax highlighted code)
│
├── AgentManager
│   ├── AgentCard (Review Agent)
│   ├── AgentCard (DevOps Agent)
│   └── AgentCard (Coder Agent)
│
└── ResizablePanel (Chat)
    ├── ModelSelector
    ├── ChatHistory
    │   ├── ChatMessage (User)
    │   ├── ChatMessage (AI)
    │   └── ChatMessage (Status)
    └── ChatInput
        └── SendButton
```

---

## State Management Structure

```
Zustand Store (useAppStore)
│
├── UI State
│   ├── activeTab: "App.tsx"
│   ├── openTabs: ["App.tsx", "main.tsx", "index.css"]
│   ├── expandedFolders: Set(["src", "src/components"])
│   ├── selectedFile: "App.tsx"
│   ├── panelWidths: { explorer: 300, chat: 350 }
│   └── sidebarVisible: true
│
├── Chat State
│   ├── chatMessages: [
│   │   { role: "user", text: "..." },
│   │   { role: "ai", text: "..." }
│   │ ]
│   ├── selectedModel: "Llama 3.1 (Local)"
│   ├── isLoading: false
│   └── error: null
│
├── Agent State
│   ├── agents: [
│   │   { id: 1, name: "Review Agent", status: "idle" },
│   │   { id: 2, name: "DevOps Agent", status: "working" },
│   │   { id: 3, name: "Coder Agent", status: "error" }
│   │ ]
│   ├── selectedAgent: 1
│   └── agentLogs: { 1: [...], 2: [...], 3: [...] }
│
├── File State
│   ├── fileContents: {
│   │   "App.tsx": "import React...",
│   │   "main.tsx": "import App..."
│   │ }
│   ├── unsavedFiles: Set(["App.tsx"])
│   └── fileTree: { ... }
│
└── Actions
    ├── setActiveTab(tab)
    ├── openTab(tab)
    ├── closeTab(tab)
    ├── toggleFolder(path)
    ├── selectFile(file)
    ├── addMessage(role, text)
    ├── clearChat()
    ├── setModel(model)
    ├── updateAgentStatus(id, status)
    ├── setPanelWidth(panel, width)
    └── ...
```

---

## API Integration Points

### 1. File Operations (Tauri Invoke)
```
Frontend                          Tauri Runtime              File System
   │                                  │                          │
   ├─ invoke('read_file', path) ────► │                          │
   │                                  ├─ Read file ─────────────► │
   │                                  │                          │
   │                                  │ ◄─ File content ────────┤
   │ ◄─ Response ────────────────────┤                          │
   │                                  │                          │
   ├─ invoke('write_file', ...) ────► │                          │
   │                                  ├─ Write file ───────────► │
   │                                  │                          │
   │ ◄─ Success ────────────────────┤                          │
```

### 2. Chat Operations (HTTP)
```
Frontend                          Backend Server
   │                                  │
   ├─ POST /api/chat ────────────────► │
   │   { message, model }             │
   │                                  ├─ Process with LLM
   │                                  │
   │ ◄─ { response, tokens } ────────┤
   │                                  │
   ├─ WS /api/stream ────────────────► │
   │   (Real-time updates)            │
   │                                  │
   │ ◄─ Stream events ───────────────┤
```

### 3. Agent Status (WebSocket)
```
Frontend                          Backend Server
   │                                  │
   ├─ WS /api/agents ────────────────► │
   │   (Subscribe to updates)         │
   │                                  │
   │ ◄─ Agent status events ─────────┤
   │   { agentId, status, logs }      │
   │                                  │
   │ ◄─ Real-time updates ───────────┤
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│                  API CALL                               │
│  (fetch, Tauri invoke, WebSocket)                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Try-Catch Block      │
        └────────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    ┌─────────┐            ┌──────────┐
    │ Success │            │  Error   │
    └────┬────┘            └────┬─────┘
         │                      │
         ▼                      ▼
    ┌─────────────┐      ┌──────────────┐
    │ Update      │      │ Show Toast   │
    │ Store       │      │ Error        │
    └─────────────┘      └──────────────┘
         │                      │
         ▼                      ▼
    ┌─────────────┐      ┌──────────────┐
    │ Re-render   │      │ Log Error    │
    │ UI          │      │ to Console   │
    └─────────────┘      └──────────────┘
```

---

## Performance Optimization Strategy

```
┌─────────────────────────────────────────────────────────┐
│              PERFORMANCE OPTIMIZATION                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. Code Splitting                                       │
│    ├─ Lazy load ChatPanel                              │
│    ├─ Lazy load AgentManager                           │
│    └─ Lazy load SettingsModal                          │
│                                                         │
│ 2. Component Memoization                               │
│    ├─ React.memo(SidebarIcon)                          │
│    ├─ React.memo(FileItem)                             │
│    └─ React.memo(ChatMessage)                          │
│                                                         │
│ 3. Event Optimization                                  │
│    ├─ useCallback for handlers                         │
│    ├─ Debounce resize events                           │
│    └─ Throttle scroll events                           │
│                                                         │
│ 4. Virtual Scrolling                                   │
│    ├─ Large file lists                                 │
│    ├─ Long chat history                                │
│    └─ Agent logs                                       │
│                                                         │
│ 5. Bundle Optimization                                 │
│    ├─ Tree-shake unused code                           │
│    ├─ Minify CSS                                       │
│    └─ Compress images                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  PRODUCTION BUILD                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  npm run tauri build                                    │
│         │                                               │
│         ├─ npm run build (Vite)                         │
│         │  └─ dist/ (optimized frontend)                │
│         │                                               │
│         └─ cargo build --release (Rust)                 │
│            └─ Tauri binary                              │
│                                                         │
│  Output:                                                │
│  ├─ tauri-shell.app (macOS)                             │
│  ├─ tauri-shell.dmg (macOS installer)                   │
│  ├─ tauri-shell.exe (Windows)                           │
│  ├─ tauri-shell.msi (Windows installer)                 │
│  └─ tauri-shell.AppImage (Linux)                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Monitoring & Debugging

```
Development Mode:
  npm run tauri dev
  ├─ Hot reload on file changes
  ├─ DevTools available (F12)
  ├─ Console logging
  └─ Error stack traces

Production Mode:
  npm run tauri build
  ├─ Optimized bundle
  ├─ No DevTools
  ├─ Error reporting
  └─ Performance monitoring

Debugging Tools:
  ├─ Chrome DevTools (F12)
  ├─ Tauri CLI (tauri dev)
  ├─ Rust debugger (lldb)
  └─ Network inspector
```

---

## Summary

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Scalable state management
- ✅ Robust error handling
- ✅ Optimized performance
- ✅ Real-time updates
- ✅ Cross-platform compatibility

