# Button & Functionality Matrix - Nemo Code IDE

## 🎯 Quick Reference

### Activity Bar (Left Strip) - 64px Fixed
```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Explorer      → Toggle file explorer panel               │
│ 🔍 Search        → Open file search (Cmd+P)                 │
│ ─────────────────────────────────────────────────────────── │
│ 🐙 GitHub        → Open GitHub integration modal            │
│ ☁️  AWS           → Open AWS console                         │
│ 📦 Docker        → Show Docker containers list              │
│ 📋 Jira          → Open Jira board                          │
│ ─────────────────────────────────────────────────────────── │
│ ⚙️  Settings      → Open settings modal                      │
└─────────────────────────────────────────────────────────────┘
```

### File Explorer (Left Panel) - 200-400px Resizable
```
┌─────────────────────────────────────────────────────────────┐
│ EXPLORER                                                    │
├─────────────────────────────────────────────────────────────┤
│ ▼ src/                                                      │
│   ├─ ▶ components/                                          │
│   ├─ ● App.tsx          (active, unsaved indicator)         │
│   ├─ ○ main.tsx                                             │
│   └─ ○ index.css                                            │
│ ○ package.json                                              │
│ ○ tsconfig.json                                             │
│                                                             │
│ Actions:                                                    │
│ • Click folder → Expand/collapse                           │
│ • Click file → Open in editor                              │
│ • Right-click → Context menu (new, delete, rename)         │
│ • Drag & drop → Move files                                 │
└─────────────────────────────────────────────────────────────┘
```

### Editor Tabs (Top Center)
```
┌─────────────────────────────────────────────────────────────┐
│ ● App.tsx [x]  │ main.tsx [x]  │ index.css [x]  │ + New Tab │
├─────────────────────────────────────────────────────────────┤
│ (Code editor content)                                       │
│                                                             │
│ Actions:                                                    │
│ • Click tab → Switch file                                  │
│ • Click [x] → Close tab                                    │
│ • ● indicator → Unsaved changes                            │
│ • Drag tab → Reorder tabs                                  │
│ • Right-click → Close all, close others                    │
└─────────────────────────────────────────────────────────────┘
```

### Agent Manager (Bottom Center) - 48px Header + Scrollable
```
┌─────────────────────────────────────────────────────────────┐
│ 🖥️  AGENT MANAGER                              [⋯] [Refresh] │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐│
│ │ 🟢 Review Agent  │  │ 🟡 DevOps Agent  │  │ 🔴 Coder Ag. ││
│ │ Status: idle     │  │ Status: working  │  │ Status: error││
│ │ > Waiting...     │  │ > Analyzing...   │  │ > Failed...  ││
│ │ [Logs] [⏸]      │  │ [Logs] [⏸]      │  │ [Logs] [⏸]  ││
│ └──────────────────┘  └──────────────────┘  └──────────────┘│
│                                                             │
│ Actions:                                                    │
│ • Click [Logs] → Show agent logs in modal                  │
│ • Click [⏸] → Pause/resume agent                           │
│ • Status dot → Real-time status indicator                  │
│ • [⋯] → More options (kill, restart, config)              │
│ • [Refresh] → Refresh all agents                           │
└─────────────────────────────────────────────────────────────┘
```

### Chat Panel (Right) - 250-400px Resizable
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI CHAT                                                  │
├─────────────────────────────────────────────────────────────┤
│ [Llama 3.1 (Local) ▼]  [Clear] [Settings]                  │
├─────────────────────────────────────────────────────────────┤
│ User: Can you review the auth logic?                        │
│                                                             │
│ AI: I'm checking App.tsx now. It looks like you're using   │
│     a basic JWT flow. I recommend adding token refresh...  │
│                                                             │
│ 🖥️  Running security scan...                               │
├─────────────────────────────────────────────────────────────┤
│ [Type message...                                    [Send] │
│                                                             │
│ Actions:                                                    │
│ • Click model dropdown → Switch AI model                   │
│ • Type message → Send to backend                           │
│ • [Send] button → Submit message (Cmd+Enter)              │
│ • [Clear] → Clear chat history                            │
│ • Right-click message → Copy, delete                       │
│ • Cmd+K → Focus chat input                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Complete Button Inventory

### Status: ❌ Not Implemented | ⚠️ Partial | ✅ Complete

| Component | Button | Function | Status | Priority |
|-----------|--------|----------|--------|----------|
| **Activity Bar** | Explorer | Toggle sidebar | ❌ | P0 |
| | Search | Open file search | ❌ | P0 |
| | GitHub | GitHub integration | ❌ | P2 |
| | AWS | AWS console | ❌ | P2 |
| | Docker | Docker containers | ❌ | P2 |
| | Jira | Jira board | ❌ | P2 |
| | Settings | Settings modal | ❌ | P1 |
| **File Explorer** | Folder Toggle | Expand/collapse | ❌ | P0 |
| | File Click | Open file | ❌ | P0 |
| | Right-click | Context menu | ❌ | P1 |
| | Drag & Drop | Move files | ❌ | P2 |
| **Editor Tabs** | Tab Click | Switch file | ❌ | P0 |
| | Tab Close | Close tab | ❌ | P0 |
| | New Tab | Create new file | ❌ | P1 |
| | Tab Drag | Reorder tabs | ❌ | P2 |
| **Agent Manager** | Logs Button | Show logs | ❌ | P1 |
| | Pause Button | Pause agent | ❌ | P1 |
| | Refresh | Refresh agents | ❌ | P1 |
| | More Options | Agent menu | ❌ | P2 |
| **Chat Panel** | Model Dropdown | Switch model | ❌ | P0 |
| | Send Button | Send message | ❌ | P0 |
| | Clear Button | Clear history | ❌ | P1 |
| | Settings | Chat settings | ❌ | P2 |

---

## 🔧 Resizing Strategy

### Current Issues
- ❌ Fixed widths don't adapt to window size
- ❌ No draggable dividers between panels
- ❌ Breaks on screens < 1024px
- ❌ No persistence of panel sizes

### Solution
```
┌─────────────────────────────────────────────────────────────┐
│ Activity │ Explorer │ Editor │ Chat │
│  64px    │ 200-400  │ flex   │ 250-400
│ (fixed)  │ (drag)   │ (grow) │ (drag)
│          │◄────────►│        │◄────►│
└─────────────────────────────────────────────────────────────┘

Draggable dividers (4px wide):
- Between Explorer & Editor
- Between Editor & Chat
- Smooth drag with visual feedback
- Min/max constraints
- Persist to localStorage
```

### Responsive Breakpoints
```
Desktop (1400px+):
  Activity: 64px | Explorer: 300px | Editor: flex | Chat: 350px

Laptop (1024px):
  Activity: 64px | Explorer: 250px | Editor: flex | Chat: 300px

Tablet (768px):
  Activity: 64px | Explorer: hidden | Editor: flex | Chat: hidden
  (Show toggle buttons in header)

Mobile (< 768px):
  Activity: 48px | Explorer: hidden | Editor: full | Chat: hidden
  (Bottom tab bar for navigation)
```

---

## ⚡ Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Initial Load | < 2s | ? | ⚠️ Unknown |
| Tab Switch | < 100ms | ? | ⚠️ Unknown |
| Chat Response | < 500ms | ? | ⚠️ Unknown |
| Memory Usage | < 200MB | ? | ⚠️ Unknown |
| CPU Idle | < 5% | ? | ⚠️ Unknown |

---

## 🎮 Keyboard Shortcuts

| Shortcut | Action | Status |
|----------|--------|--------|
| Cmd+P | Quick file open | ❌ |
| Cmd+K | Focus chat | ❌ |
| Cmd+B | Toggle sidebar | ❌ |
| Cmd+Shift+P | Command palette | ❌ |
| Cmd+Enter | Send chat message | ❌ |
| Cmd+W | Close tab | ❌ |
| Cmd+Tab | Switch tabs | ❌ |
| Cmd+, | Open settings | ❌ |
| Cmd+/ | Toggle comment | ❌ |
| Cmd+S | Save file | ❌ |

---

## 🚀 Implementation Phases

### Phase 1: Core Stability (Days 1-2)
- [x] Fix window resizing
- [ ] Wire up all button handlers
- [ ] Add state management
- [ ] Implement keyboard shortcuts
- [ ] Add error handling

### Phase 2: Functionality (Days 3-4)
- [ ] File explorer operations
- [ ] Tab management
- [ ] Chat integration
- [ ] Agent status updates
- [ ] Backend API calls

### Phase 3: Polish (Days 5-6)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Theme customization
- [ ] Settings persistence
- [ ] User preferences

### Phase 4: Advanced (Days 7+)
- [ ] Draggable panels
- [ ] Context menus
- [ ] Syntax highlighting
- [ ] Search functionality
- [ ] Plugin system

---

## 📊 Success Criteria

✅ All buttons have click handlers
✅ Window resizes without breaking layout
✅ Chat sends messages to backend
✅ File explorer opens files
✅ Agent status updates in real-time
✅ Keyboard shortcuts work
✅ Error messages display properly
✅ App loads in < 2 seconds
✅ No console errors
✅ Works on 1024x768 and up

