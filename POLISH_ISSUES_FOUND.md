# Polish Issues Found - December 4, 2025

## 🐛 Issues Identified

### 1. Window Resize Flickering ⚡
**Issue**: App flickers when resizing/downsizing window
**Severity**: Medium
**Impact**: Poor UX, unprofessional appearance
**Location**: Main window/layout

**Possible Causes**:
- React re-renders during resize
- CSS transitions conflicting
- Layout recalculation
- Monaco editor resize handling

**Fix Priority**: High

---

### 2. Backend Disconnected 🔴
**Issue**: "Backend disconnected" error shown
**Severity**: High
**Impact**: Core functionality broken
**Location**: Backend connection

**Possible Causes**:
- Backend not running
- Port 8000 not accessible
- Connection timeout
- CORS issues

**Fix Priority**: Critical

---

### 3. Terminal Issues 🖥️
**Issue**: Terminal is "still messed"
**Severity**: High
**Impact**: Terminal unusable
**Location**: BottomPanel/TerminalComponent

**Observed Problems**:
- Shell scope errors
- Fallback shell errors
- Terminal not initializing properly
- Multiple error messages

**Current State** (from screenshot):
```
Failed to spawn shell: error deserializing scope
Trying fallback shell...
Failed: system error deserializing scope
```

**Fix Priority**: Critical

---

### 4. Terminal Vision vs Reality 🎨
**Issue**: Current terminal doesn't match vision
**Severity**: Medium
**Impact**: UX not as intended
**Location**: Terminal UI/Layout

**Vision** (from VS Code screenshot):
- Clean tabs: "PROBLEMS | OUTPUT | TERMINAL | ..."
- Shell selector dropdown (bash, zsh, etc.)
- Clean toolbar with icons
- Multiple terminal instances
- Split view support
- Proper error handling

**Current Reality**:
- Basic implementation
- Shell errors visible
- Less polished UI
- Needs special attention

**Fix Priority**: Medium

---

## 🔧 Fixes Needed

### Fix 1: Window Resize Flickering

**File**: `tauri-shell/src/App.tsx`

**Solution**:
```typescript
// Add debounced resize handler
const [isResizing, setIsResizing] = useState(false);
const resizeTimeoutRef = useRef<number>();

useEffect(() => {
  const handleResize = () => {
    setIsResizing(true);
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      setIsResizing(false);
    }, 150);
  };

  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
  };
}, []);

// Disable transitions during resize
<div className={isResizing ? 'no-transitions' : ''}>
```

**CSS**:
```css
.no-transitions * {
  transition: none !important;
}
```

---

### Fix 2: Backend Connection

**Check**:
1. Is backend running? `ps aux | grep "python.*server.py"`
2. Is port 8000 accessible? `curl http://localhost:8000/health`
3. Check backend logs: `tail -f backend/logs/server.log`

**File**: `backend/server.py`

**Ensure**:
- CORS properly configured
- Health endpoint working
- Server actually running

**Frontend Fix** (`tauri-shell/src/hooks/useBackendConnection.ts`):
- Better error messages
- Auto-retry logic (already exists)
- Show specific error reason

---

### Fix 3: Terminal Shell Errors

**Issue**: Tauri shell scope deserialization error

**File**: `tauri-shell/src-tauri/capabilities/default.json`

**Current Problem**:
```json
{
  "permissions": [
    "shell:allow-execute"
  ]
}
```

**Fix**: Update to proper Tauri v2 format:
```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default permissions",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "shell:allow-execute",
    "shell:allow-spawn",
    "fs:default",
    "dialog:default"
  ]
}
```

**File**: `tauri-shell/src/components/TerminalComponent.tsx`

**Better Error Handling**:
```typescript
try {
  const command = Command.create(shell, shellArgs);
  const child = await command.spawn();
  // ...
} catch (err) {
  // Don't show scary errors to user
  console.error('Shell spawn failed:', err);
  term.write('\r\n\x1b[33mTerminal initialization...\x1b[0m\r\n');
  // Try simpler fallback
}
```

---

### Fix 4: Terminal UI Polish

**Vision**: VS Code-style terminal panel

**Changes Needed**:

1. **Better Tab Bar**:
```typescript
// Clean tabs like VS Code
<div className="terminal-tabs">
  <button className={active ? 'active' : ''}>PROBLEMS</button>
  <button className={active ? 'active' : ''}>OUTPUT</button>
  <button className={active ? 'active' : ''}>TERMINAL</button>
  <button className={active ? 'active' : ''}>DEBUG CONSOLE</button>
</div>
```

2. **Shell Selector**:
```typescript
<select className="shell-selector">
  <option value="zsh">zsh</option>
  <option value="bash">bash</option>
  <option value="sh">sh</option>
</select>
```

3. **Clean Toolbar**:
```typescript
<div className="terminal-toolbar">
  <button title="New Terminal">+</button>
  <button title="Split Terminal">⫽</button>
  <button title="Kill Terminal">🗑️</button>
  <select>bash ▼</select>
</div>
```

4. **Hide Errors**:
- Don't show shell initialization errors to user
- Handle gracefully in background
- Show clean "Terminal ready" message

---

## 📋 Priority Order

1. **Critical**: Fix backend connection (blocks everything)
2. **Critical**: Fix terminal shell errors (unusable)
3. **High**: Fix resize flickering (poor UX)
4. **Medium**: Polish terminal UI (vision alignment)

---

## 🎯 Quick Wins

### Immediate (5 minutes):
1. Start backend: `cd backend && python3 server.py`
2. Check if that fixes "Backend disconnected"

### Short-term (30 minutes):
1. Fix Tauri capabilities for shell
2. Add resize debouncing
3. Hide terminal error messages

### Medium-term (2 hours):
1. Redesign terminal UI to match vision
2. Add shell selector
3. Better error handling
4. Polish animations

---

## 📊 Testing Checklist

After fixes:
- [ ] Window resizes smoothly (no flicker)
- [ ] Backend connects successfully
- [ ] Terminal spawns without errors
- [ ] Terminal UI matches vision
- [ ] Multiple terminals work
- [ ] Split terminal works
- [ ] Shell selector works
- [ ] No error messages visible to user

---

**Created**: December 4, 2025, 12:40 AM  
**Status**: Issues documented, fixes planned  
**Next**: Implement fixes in priority order
