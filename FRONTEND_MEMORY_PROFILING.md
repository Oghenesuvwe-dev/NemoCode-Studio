# Frontend Memory Profiling Guide

**Date**: December 2, 2025  
**Task**: TASK-016 Memory Profiling  
**Duration**: 1-2 hours

---

## 🎯 Objective

Identify and fix memory leaks in the frontend to ensure stable 8+ hour operation.

---

## 📋 Profiling Steps

### 1. Open Chrome DevTools
1. Open the IDE in browser: `http://localhost:1420`
2. Press `F12` or `Cmd+Option+I` to open DevTools
3. Go to **Memory** tab

### 2. Take Initial Snapshot
1. Click **"Take snapshot"** button
2. Label it: "Initial - Clean State"
3. Note the heap size (should be ~50-100 MB initially)

### 3. Use the IDE Normally (1-2 hours)
Perform these actions repeatedly:
- [ ] Open 10-20 files
- [ ] Close files
- [ ] Use Find/Replace multiple times
- [ ] Use Global Search
- [ ] Open/close terminal tabs
- [ ] Create/kill terminals
- [ ] Switch between tabs
- [ ] Use Monaco Editor features
- [ ] Send chat messages
- [ ] Toggle panels (sidebar, chat, terminal)

### 4. Take Second Snapshot
1. Click **"Take snapshot"** again
2. Label it: "After 1-2 hours of use"
3. Note the heap size

### 5. Compare Snapshots
1. Select second snapshot
2. Change view to **"Comparison"**
3. Select first snapshot as baseline
4. Look for:
   - **Detached DOM nodes** (red flag)
   - **Growing arrays/objects**
   - **Event listeners** not cleaned up
   - **Timers** (setInterval/setTimeout) still running

---

## 🔍 What to Look For

### Common Memory Leaks:

#### 1. Event Listeners Not Removed
```typescript
// BAD
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// GOOD
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

#### 2. Timers Not Cleared
```typescript
// BAD
useEffect(() => {
  setInterval(() => checkHealth(), 15000);
}, []);

// GOOD
useEffect(() => {
  const interval = setInterval(() => checkHealth(), 15000);
  return () => clearInterval(interval);
}, []);
```

#### 3. WebSocket/Fetch Not Cleaned Up
```typescript
// BAD
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8000');
}, []);

// GOOD
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8000');
  return () => ws.close();
}, []);
```

#### 4. Monaco Editor Instances Not Disposed
```typescript
// BAD
const editor = monaco.editor.create(container, options);

// GOOD
useEffect(() => {
  const editor = monaco.editor.create(container, options);
  return () => editor.dispose();
}, []);
```

#### 5. Terminal Instances Not Cleaned Up
```typescript
// BAD
const term = new Terminal();
term.open(container);

// GOOD
useEffect(() => {
  const term = new Terminal();
  term.open(container);
  return () => term.dispose();
}, []);
```

---

## 📊 Expected Results

### Healthy Memory Profile:
- **Initial**: 50-100 MB
- **After 1 hour**: 300-500 MB
- **After 2 hours**: 400-700 MB
- **Growth rate**: < 50 MB/hour

### Unhealthy Memory Profile (Leak):
- **Initial**: 50-100 MB
- **After 1 hour**: 500-800 MB
- **After 2 hours**: 1000+ MB
- **Growth rate**: > 100 MB/hour
- **Detached nodes**: > 100

---

## 🔧 Files to Check

### High Priority (Most Likely to Leak):
1. **`tauri-shell/src/components/TerminalComponent.tsx`**
   - Terminal instances
   - xterm.js cleanup
   - Event listeners

2. **`tauri-shell/src/components/MonacoEditor.tsx`**
   - Monaco editor instances
   - Model disposal
   - Event listeners

3. **`tauri-shell/src/hooks/useBackendConnection.ts`**
   - WebSocket cleanup
   - Interval cleanup
   - Timeout cleanup

4. **`tauri-shell/src/App.tsx`**
   - Global event listeners
   - State management
   - Component cleanup

### Medium Priority:
5. **`tauri-shell/src/components/RealChat.tsx`**
   - Message history
   - WebSocket connections

6. **`tauri-shell/src/components/FileExplorer.tsx`**
   - File tree state
   - Event listeners

7. **`tauri-shell/src/components/GlobalSearch.tsx`**
   - Search results
   - File handles

---

## 🐛 Known Potential Leaks

### 1. Terminal Component
**Issue**: Multiple terminal instances may not be properly disposed

**Check**:
```typescript
// In TerminalComponent.tsx
const handleCloseTab = async (id: string) => {
  const instance = instancesRef.current.find(i => i.id === id);
  if (instance) {
    if (instance.child) await instance.child.kill(); // ✅ Good
    instance.xterm.dispose(); // ✅ Good
    instance.container.remove(); // ✅ Good
  }
};
```

**Status**: Looks good, but verify in profiler

### 2. Monaco Editor
**Issue**: Editor instances may not be disposed when tabs close

**Check**: Look for `editor.dispose()` calls

### 3. useBackendConnection Hook
**Issue**: WebSocket and intervals may not be cleaned up

**Check**:
```typescript
useEffect(() => {
  // ... connection logic
  return () => {
    if (wsRef.current) {
      wsRef.current.close(); // ✅ Good
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current); // ✅ Good
    }
  };
}, []);
```

**Status**: Looks good

---

## 📝 Profiling Checklist

### Before Starting:
- [ ] Close all other browser tabs
- [ ] Restart browser
- [ ] Clear browser cache
- [ ] Note initial memory usage

### During Profiling:
- [ ] Take initial snapshot
- [ ] Use IDE for 1-2 hours
- [ ] Perform varied actions
- [ ] Take final snapshot
- [ ] Compare snapshots

### After Profiling:
- [ ] Document findings
- [ ] Identify leak sources
- [ ] Create fix plan
- [ ] Implement fixes
- [ ] Re-test

---

## 🎯 Success Criteria

- [ ] Memory growth < 50 MB/hour
- [ ] No detached DOM nodes
- [ ] All event listeners cleaned up
- [ ] All timers cleared
- [ ] All WebSockets closed
- [ ] All editor instances disposed
- [ ] All terminal instances disposed

---

## 📊 Report Template

```markdown
## Memory Profiling Results

**Date**: [Date]
**Duration**: [Hours]
**Browser**: Chrome [Version]

### Heap Snapshots:
- Initial: [Size] MB
- After 1h: [Size] MB
- After 2h: [Size] MB
- Growth Rate: [Rate] MB/hour

### Detached Nodes:
- Count: [Number]
- Sources: [List]

### Identified Leaks:
1. [Leak description]
   - File: [File path]
   - Line: [Line number]
   - Fix: [Fix description]

### Fixes Applied:
1. [Fix description]
   - File: [File path]
   - Status: [Done/Pending]

### Re-test Results:
- Growth Rate After Fix: [Rate] MB/hour
- Status: [Pass/Fail]
```

---

**Next**: Run profiling and document results in `logs/memory/frontend_profile_[date].md`
