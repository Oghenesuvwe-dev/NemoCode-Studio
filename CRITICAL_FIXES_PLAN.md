# Critical Fixes Plan - NemoCode IDE

## Three Critical Issues

### 1. Backend Connection Never Works
**Symptom**: Red banner "Backend disconnected" never goes away
**Root Cause**: Frontend connection logic is fundamentally broken
**Fix Strategy**: Simplify connection detection, remove retry logic complexity

### 2. Terminal Never Initializes  
**Symptom**: "Terminal initialization failed. Please check Tauri permissions."
**Root Cause**: Tauri v2 shell permissions not properly configured
**Fix Strategy**: Use working Tauri v2 shell configuration from documentation

### 3. Resize Flickering and Window Dragging
**Symptom**: Resizing causes severe flicker, mouse drags window instead of resizing
**Root Cause**: Drag regions interfering with resize, insufficient flicker prevention
**Fix Strategy**: Remove all drag regions, add proper resize CSS, increase debounce

---

## Fix Order (Most Critical First)

1. **Backend Connection** - Without this, nothing else matters
2. **Window Resize/Drag** - Makes IDE unusable
3. **Terminal** - Important but can work around it

---

## Implementation Plan

### Phase 1: Backend Connection (IMMEDIATE)
- Simplify useBackendConnection hook
- Remove complex retry logic
- Add direct fetch with simple error handling
- Test with curl to verify backend is actually running

### Phase 2: Window Resize (IMMEDIATE)
- Remove ALL data-tauri-drag-region attributes
- Add proper CSS to prevent flicker
- Increase debounce to 1000ms
- Test resize smoothness

### Phase 3: Terminal (HIGH PRIORITY)
- Research working Tauri v2 shell configuration
- Try alternative permission formats
- Consider using different shell spawn method
- Add better error logging

---

## Success Criteria

### Backend Connection:
- ✅ Red banner disappears within 5 seconds of app start
- ✅ "Retry Now" button works immediately
- ✅ Connection stays stable

### Window Resize:
- ✅ No flickering when resizing window
- ✅ Resize handles work smoothly
- ✅ Window doesn't drag when trying to resize
- ✅ Smooth, professional resize experience

### Terminal:
- ✅ Terminal opens with shell prompt
- ✅ Can execute commands
- ✅ No permission errors

---

## Execution

Starting with Backend Connection fix...
