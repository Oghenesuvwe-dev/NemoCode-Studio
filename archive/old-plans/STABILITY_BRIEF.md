# Nemo Code IDE - Stability & Functionality Brief

## Executive Summary

The desktop app is **built and running** but needs **stability hardening** and **functionality wiring**. Current state: 30% complete (UI layout done, logic missing).

---

## 🔴 Critical Issues (Fix First)

### 1. **No Button Functionality**
- All 20+ buttons are visual only
- No click handlers implemented
- App feels broken to users

**Fix**: Wire up handlers using Zustand state management

### 2. **Fixed Panel Widths Break on Resize**
- Explorer: 256px (w-64) - doesn't adapt
- Chat: 320px (w-80) - doesn't adapt
- No draggable dividers
- Breaks on screens < 1024px

**Fix**: Implement flexible panels with min/max constraints

### 3. **No Backend Integration**
- Chat doesn't send messages
- File operations don't work
- Agent status is hardcoded
- No real data flow

**Fix**: Add Tauri invoke commands + API integration

### 4. **No State Management**
- Mock data hardcoded in component
- Can't persist state
- No real-time updates
- Memory leaks possible

**Fix**: Implement Zustand store

### 5. **No Error Handling**
- No try-catch blocks
- No error messages
- App crashes silently
- No loading states

**Fix**: Add error boundaries + toast notifications

---

## 📋 Required Buttons (Priority Order)

### P0 - Must Have (This Week)
```
✅ File Explorer
   - Click file → Open in editor
   - Click folder → Expand/collapse
   - Show file tree

✅ Editor Tabs
   - Click tab → Switch file
   - Click [x] → Close tab
   - Show unsaved indicator (●)

✅ Chat Panel
   - Type message → Send to backend
   - Model selector → Switch AI
   - Show chat history

✅ Agent Manager
   - Show real-time status
   - Pause/resume buttons
   - Show logs
```

### P1 - Important (Next Week)
```
⚠️ Settings
   - Open settings modal
   - Save preferences
   - Theme toggle

⚠️ Search
   - Cmd+P file search
   - Cmd+K chat focus
   - Cmd+B toggle sidebar

⚠️ Context Menus
   - Right-click file → new, delete, rename
   - Right-click tab → close all, close others
   - Right-click message → copy, delete
```

### P2 - Nice to Have (Later)
```
◯ GitHub Integration
◯ AWS Console
◯ Docker Containers
◯ Jira Board
◯ Draggable Panels
◯ Syntax Highlighting
```

---

## 🎯 Resizing Strategy

### Current Problem
```
┌──────────────────────────────────────────────────────┐
│ 64px │ 256px │ flex │ 320px │
│ Fixed│ Fixed │ Flex │ Fixed │
│      │ BREAKS│      │ BREAKS│
└──────────────────────────────────────────────────────┘
```

### Solution
```
┌──────────────────────────────────────────────────────┐
│ 64px │ 200-400px │ flex │ 250-400px │
│ Fixed│ Resizable │ Flex │ Resizable │
│      │ ◄────────►│      │ ◄────────►│
│      │ Draggable │      │ Draggable │
└──────────────────────────────────────────────────────┘

Min/Max Constraints:
- Explorer: 200px min, 400px max
- Chat: 250px min, 400px max
- Editor: Always flex (grows/shrinks)
- Activity bar: Always 64px (fixed)

Responsive:
- Desktop (1400px+): All panels visible
- Laptop (1024px): All panels visible, smaller
- Tablet (768px): Hide explorer & chat, show toggles
- Mobile (<768px): Full-width editor, bottom nav
```

---

## 🏗️ Architecture Needed

### State Management (Zustand)
```typescript
// Store all app state in one place
- activeTab: string
- openTabs: string[]
- selectedFile: string
- chatMessages: Message[]
- agentStatus: Agent[]
- panelWidths: { explorer: number; chat: number }
```

### API Layer
```typescript
// Tauri invoke commands
- read_file(path)
- write_file(path, content)
- list_files(path)

// HTTP to backend (localhost:8000)
- POST /api/chat (send message)
- GET /api/agents (get status)
- WS /api/stream (real-time updates)
```

### Error Handling
```typescript
// Try-catch all async operations
// Show toast notifications
// Error boundary for crashes
// Loading states for async
```

---

## 📊 Implementation Roadmap

### Week 1: Stability
```
Day 1: Install deps, create Zustand store
Day 2: Wire up all button handlers
Day 3: Implement flexible panel resizing
Day 4: Add error handling & loading states
Day 5: Test on different screen sizes
```

### Week 2: Functionality
```
Day 1: Backend API integration
Day 2: File explorer operations
Day 3: Chat functionality
Day 4: Agent status updates
Day 5: Real-time WebSocket updates
```

### Week 3: Polish
```
Day 1: Performance optimization
Day 2: Keyboard shortcuts
Day 3: Accessibility audit
Day 4: Theme customization
Day 5: Settings persistence
```

---

## 🚀 Quick Start (Today)

### 1. Install Dependencies
```bash
npm install --prefix tauri-shell zustand react-hot-toast hotkeys-js
```

### 2. Create Store
```bash
# Create tauri-shell/src/store.ts
# Copy code from STABILITY_IMPLEMENTATION_PLAN.md
```

### 3. Wire Up Buttons
```bash
# Update App.tsx with onClick handlers
# Connect to store actions
```

### 4. Test
```bash
npm run tauri dev --prefix tauri-shell
```

---

## ✅ Success Criteria

- [ ] All buttons have click handlers
- [ ] Window resizes without breaking
- [ ] Chat sends messages to backend
- [ ] File explorer opens files
- [ ] Agent status updates in real-time
- [ ] Keyboard shortcuts work (Cmd+P, Cmd+K, etc.)
- [ ] Error messages display properly
- [ ] App loads in < 2 seconds
- [ ] No console errors
- [ ] Works on 1024x768 and up

---

## 📈 Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Initial Load | < 2s | DevTools Network tab |
| Tab Switch | < 100ms | DevTools Performance |
| Chat Response | < 500ms | Network latency |
| Memory Usage | < 200MB | Activity Monitor |
| CPU Idle | < 5% | Activity Monitor |

---

## 🎮 Keyboard Shortcuts (Priority)

| Shortcut | Action | Priority |
|----------|--------|----------|
| Cmd+P | Quick file open | P0 |
| Cmd+K | Focus chat | P0 |
| Cmd+B | Toggle sidebar | P0 |
| Cmd+Enter | Send message | P0 |
| Cmd+W | Close tab | P1 |
| Cmd+, | Settings | P1 |
| Cmd+/ | Toggle comment | P2 |

---

## 📁 File Structure

```
tauri-shell/src/
├── App.tsx                 (Main component - needs wiring)
├── store.ts               (Zustand store - needs creation)
├── api/
│   └── backend.ts         (API calls - needs creation)
├── components/
│   ├── ResizablePanel.tsx (Resizing - needs creation)
│   ├── ErrorBoundary.tsx  (Error handling - needs creation)
│   └── Toast.tsx          (Notifications - needs creation)
├── hooks/
│   └── useKeyboardShortcuts.ts (Shortcuts - needs creation)
└── main.tsx               (Entry point - OK)
```

---

## 🔗 Related Documents

- `APP_STABILITY_ASSESSMENT.md` - Detailed analysis
- `STABILITY_IMPLEMENTATION_PLAN.md` - Code examples
- `BUTTON_FUNCTIONALITY_MATRIX.md` - Complete button inventory
- `DESKTOP_APP_READY.md` - How to run the app

---

## 💡 Key Takeaways

1. **UI is done** - Layout looks great, just needs wiring
2. **State management is missing** - Add Zustand today
3. **Buttons need handlers** - Wire up all 20+ buttons
4. **Resizing is broken** - Implement flexible panels
5. **Backend not connected** - Add API integration
6. **Error handling missing** - Add try-catch everywhere
7. **Performance unknown** - Need to measure and optimize
8. **Keyboard shortcuts missing** - Add hotkeys.js

---

## 🎯 Next Steps

1. **Read** `STABILITY_IMPLEMENTATION_PLAN.md` for code examples
2. **Install** dependencies: `npm install zustand react-hot-toast hotkeys-js`
3. **Create** `store.ts` with Zustand
4. **Wire up** all button handlers
5. **Test** on different screen sizes
6. **Measure** performance with DevTools

---

**Status**: 🟡 In Progress - Ready for stability hardening
**Estimated Time**: 2-3 weeks to full stability
**Risk Level**: 🟡 Medium - UI is solid, logic needs work

