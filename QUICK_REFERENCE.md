# Nemo Code IDE - Quick Reference Card

## 🚀 Start Here

### Run the App
```bash
# Development mode (hot reload)
npm run tauri dev --prefix tauri-shell

# Production build
npm run tauri build --prefix tauri-shell

# Run built app
open tauri-shell/src-tauri/target/release/bundle/macos/tauri-shell.app
```

### Install Dependencies
```bash
npm install --prefix tauri-shell zustand react-hot-toast hotkeys-js
```

---

## 📋 What Needs to Be Done

### Priority 1 (This Week)
- [ ] Create Zustand store (`tauri-shell/src/store.ts`)
- [ ] Wire up all button click handlers
- [ ] Implement flexible panel resizing
- [ ] Add error handling & try-catch blocks
- [ ] Add loading states for async operations

### Priority 2 (Next Week)
- [ ] Connect to backend API (localhost:8000)
- [ ] Implement file operations
- [ ] Implement chat functionality
- [ ] Add real-time agent status updates
- [ ] Add WebSocket for live updates

### Priority 3 (Week 3)
- [ ] Add keyboard shortcuts (Cmd+P, Cmd+K, etc.)
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Theme customization
- [ ] Settings persistence

---

## 🎯 20+ Buttons to Wire Up

### Activity Bar (7)
```
Explorer → toggleSidebar()
Search → openFileSearch()
GitHub → openGitHub()
AWS → openAWS()
Docker → openDocker()
Jira → openJira()
Settings → openSettings()
```

### File Explorer (4)
```
Folder → toggleFolder(path)
File → openFile(path)
Right-click → showContextMenu()
Drag & drop → moveFile(from, to)
```

### Editor Tabs (4)
```
Tab click → setActiveTab(tab)
Tab close → closeTab(tab)
New tab → createNewFile()
Tab drag → reorderTabs(from, to)
```

### Agent Manager (4)
```
Logs → showAgentLogs(agentId)
Pause → pauseAgent(agentId)
Refresh → refreshAgents()
More → showAgentMenu(agentId)
```

### Chat Panel (3)
```
Model selector → setModel(model)
Send button → sendMessage(text)
Clear button → clearChat()
```

---

## 📁 File Structure

```
tauri-shell/src/
├── App.tsx                    ← Main component (needs wiring)
├── store.ts                   ← CREATE THIS (Zustand store)
├── main.tsx                   ← Entry point (OK)
├── api/
│   └── backend.ts             ← CREATE THIS (API calls)
├── components/
│   ├── ResizablePanel.tsx     ← CREATE THIS (resizing)
│   ├── ErrorBoundary.tsx      ← CREATE THIS (error handling)
│   └── Toast.tsx              ← CREATE THIS (notifications)
└── hooks/
    └── useKeyboardShortcuts.ts ← CREATE THIS (shortcuts)
```

---

## 🔧 Code Templates

### Zustand Store
```typescript
import { create } from 'zustand';

export const useAppStore = create((set) => ({
  activeTab: 'App.tsx',
  openTabs: ['App.tsx'],
  chatMessages: [],
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  addMessage: (role, text) => set((state) => ({
    chatMessages: [...state.chatMessages, { role, text }],
  })),
}));
```

### Button Handler
```typescript
const handleTabClick = (tab: string) => {
  useAppStore.setState({ activeTab: tab });
};

// In JSX
<button onClick={() => handleTabClick('App.tsx')}>
  App.tsx
</button>
```

### API Call
```typescript
const sendMessage = async (text: string) => {
  try {
    const response = await fetch('http://localhost:8000/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    useAppStore.setState((state) => ({
      chatMessages: [...state.chatMessages, { role: 'ai', text: data.response }],
    }));
  } catch (error) {
    console.error('Failed to send message:', error);
    toast.error('Failed to send message');
  }
};
```

### Error Handling
```typescript
try {
  // Do something
} catch (error) {
  console.error('Error:', error);
  toast.error('Something went wrong');
}
```

### Keyboard Shortcut
```typescript
import hotkeys from 'hotkeys-js';

hotkeys('cmd+p', (e) => {
  e.preventDefault();
  // Open file search
});
```

---

## 🎨 Resizing Implementation

### Current (Broken)
```jsx
<div className="w-64">Explorer</div>  {/* Fixed 256px */}
<div className="flex-1">Editor</div>
<div className="w-80">Chat</div>      {/* Fixed 320px */}
```

### Fixed (Flexible)
```jsx
<ResizablePanel defaultWidth={300} minWidth={200} maxWidth={400}>
  <Explorer />
</ResizablePanel>
<div className="flex-1">
  <Editor />
</div>
<ResizablePanel defaultWidth={350} minWidth={250} maxWidth={400}>
  <Chat />
</ResizablePanel>
```

---

## 📊 Performance Checklist

- [ ] Initial load < 2 seconds
- [ ] Tab switch < 100ms
- [ ] Chat response < 500ms
- [ ] Memory usage < 200MB
- [ ] CPU idle < 5%
- [ ] No console errors
- [ ] No memory leaks
- [ ] Smooth animations

---

## 🐛 Debugging Tips

### Check State
```typescript
// In browser console
useAppStore.getState()
```

### Log Store Changes
```typescript
useAppStore.subscribe(
  (state) => console.log('State updated:', state)
);
```

### DevTools
```bash
# Open DevTools
F12

# Check Network tab for API calls
# Check Console for errors
# Check Performance for bottlenecks
```

### Tauri Logs
```bash
# Check Tauri logs
tail -f ~/Library/Logs/tauri-shell/tauri-shell.log
```

---

## 🚨 Common Issues & Fixes

### Issue: Buttons don't work
**Fix**: Add onClick handler and connect to store

### Issue: Layout breaks on resize
**Fix**: Use ResizablePanel component with flex layout

### Issue: Chat doesn't send
**Fix**: Check backend is running on localhost:8000

### Issue: App crashes silently
**Fix**: Add error boundary and try-catch blocks

### Issue: State doesn't persist
**Fix**: Save to localStorage in store

### Issue: Slow performance
**Fix**: Use React.memo, useCallback, lazy loading

---

## 📞 Quick Commands

```bash
# Install deps
npm install --prefix tauri-shell zustand react-hot-toast hotkeys-js

# Dev mode
npm run tauri dev --prefix tauri-shell

# Build
npm run tauri build --prefix tauri-shell

# Check types
npm run type-check --prefix tauri-shell

# Format code
npm run format --prefix tauri-shell

# Lint
npm run lint --prefix tauri-shell

# Start backend
./start_backend.sh

# View logs
tail -f ~/Library/Logs/tauri-shell/tauri-shell.log
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `EXECUTIVE_SUMMARY.md` | High-level overview |
| `APP_STABILITY_ASSESSMENT.md` | Detailed analysis |
| `STABILITY_IMPLEMENTATION_PLAN.md` | Code examples |
| `BUTTON_FUNCTIONALITY_MATRIX.md` | Button inventory |
| `APP_ARCHITECTURE_DIAGRAM.md` | System design |
| `QUICK_REFERENCE.md` | This file |

---

## ✅ Success Checklist

- [ ] All buttons have handlers
- [ ] Resizing works smoothly
- [ ] Chat sends messages
- [ ] Files open in editor
- [ ] Agent status updates
- [ ] Keyboard shortcuts work
- [ ] Errors display properly
- [ ] App loads fast
- [ ] No console errors
- [ ] Works on all screen sizes

---

## 🎯 Next 24 Hours

1. **Read** `STABILITY_IMPLEMENTATION_PLAN.md`
2. **Install** dependencies
3. **Create** `store.ts` with Zustand
4. **Wire up** 3-5 buttons
5. **Test** in dev mode
6. **Commit** changes

---

## 💡 Pro Tips

- Use `useAppStore` everywhere instead of prop drilling
- Always wrap async calls in try-catch
- Use `React.memo` for components that don't need re-renders
- Debounce resize events to improve performance
- Test on different screen sizes early
- Use DevTools to debug state changes
- Keep components small and focused
- Use TypeScript for type safety

---

**Status**: Ready to implement  
**Estimated Time**: 2-3 weeks  
**Difficulty**: Medium  
**Priority**: High

