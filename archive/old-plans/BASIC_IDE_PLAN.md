# Basic Functional IDE - Implementation Plan

**Goal**: Get a stable, resizable desktop IDE with terminal, file explorer, and editor working.

**Current Issue**: App is stretched wide and not resizable ❌

---

## 🎯 What You Need (Priority Order)

### ✅ Already Working
1. File explorer (left sidebar)
2. Editor with syntax highlighting
3. Terminal at bottom
4. Basic UI layout

### ❌ What's Broken/Missing
1. **Window not resizable** - CRITICAL
2. **Panels not resizable** - Can't adjust sizes
3. **Can't open files from desktop** - File dialogs needed
4. **Terminal may not work properly** - Needs testing
5. **UI too wide** - Fixed widths

---

## 🔧 Fix Plan (2-3 hours)

### Phase 1: Make Window Resizable (30 min) - CRITICAL
**File**: `tauri-shell/src-tauri/tauri.conf.json`

**Current Problem**: Window has fixed size or wrong constraints

**Fix**:
```json
{
  "app": {
    "windows": [{
      "title": "Nemo Code",
      "width": 1200,
      "height": 800,
      "minWidth": 800,    // Allow smaller
      "minHeight": 600,   // Allow smaller
      "resizable": true,  // Must be true
      "decorations": true // Show window controls
    }]
  }
}
```

### Phase 2: Make Panels Resizable (1 hour)
**File**: `tauri-shell/src/App.tsx`

**Current Problem**: Fixed widths (w-64, w-80) don't adapt

**Fix**: Replace fixed widths with flexible layout
```typescript
// Current (BROKEN):
<div className="w-64">Explorer</div>  // Fixed 256px

// Fixed (WORKING):
<div style={{ width: `${explorerWidth}px` }}>
  <Explorer />
  {/* Drag handle */}
  <div 
    className="w-1 cursor-col-resize"
    onMouseDown={handleResize}
  />
</div>
```

### Phase 3: File Dialogs (30 min)
**File**: `tauri-shell/src/components/FileExplorer.tsx`

**Add**: Open file from desktop button
```typescript
import { open } from '@tauri-apps/plugin-dialog';

const handleOpenFile = async () => {
  const file = await open({
    multiple: false,
    filters: [{
      name: 'Code',
      extensions: ['js', 'ts', 'tsx', 'py', 'md']
    }]
  });
  
  if (file) {
    // Open file in editor
  }
};
```

### Phase 4: Terminal Fixes (30 min)
**File**: `tauri-shell/src/components/TerminalComponent.tsx`

**Verify**:
- Terminal actually runs commands
- Can type and see output
- Copy/paste works
- Resizable height

---

## 📋 Detailed Implementation

### Task 1: Fix Window Resizing (CRITICAL)

**Step 1**: Update Tauri config
```bash
# Edit: tauri-shell/src-tauri/tauri.conf.json
```

**Change**:
```json
{
  "app": {
    "windows": [{
      "title": "Nemo Code",
      "width": 1200,
      "height": 800,
      "minWidth": 800,
      "minHeight": 600,
      "maxWidth": 2560,
      "maxHeight": 1440,
      "resizable": true,
      "decorations": true,
      "transparent": false
    }]
  }
}
```

**Step 2**: Rebuild
```bash
cd tauri-shell
npm run tauri build
```

**Test**: Window should resize smoothly

---

### Task 2: Fix Panel Resizing

**Step 1**: Update App.tsx state
```typescript
const [explorerWidth, setExplorerWidth] = useState(250);
const [chatWidth, setChatWidth] = useState(300);
const [terminalHeight, setTerminalHeight] = useState(200);
```

**Step 2**: Add resize handlers
```typescript
const handleExplorerResize = (e: React.MouseEvent) => {
  const startX = e.clientX;
  const startWidth = explorerWidth;

  const handleMouseMove = (moveEvent: MouseEvent) => {
    const delta = moveEvent.clientX - startX;
    const newWidth = Math.max(200, Math.min(400, startWidth + delta));
    setExplorerWidth(newWidth);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};
```

**Step 3**: Add resize handles to UI
```typescript
<div style={{ width: `${explorerWidth}px` }}>
  <FileExplorer />
  <div 
    className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize"
    onMouseDown={handleExplorerResize}
  />
</div>
```

---

### Task 3: Add File Dialogs

**Step 1**: Add "Open File" button to FileExplorer
```typescript
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';

const FileExplorer = () => {
  const handleOpenFile = async () => {
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'All Files',
        extensions: ['*']
      }]
    });

    if (selected && typeof selected === 'string') {
      const content = await readTextFile(selected);
      onFileClick(selected, content);
    }
  };

  return (
    <div>
      <button onClick={handleOpenFile}>
        📂 Open File
      </button>
      {/* Rest of file tree */}
    </div>
  );
};
```

---

### Task 4: Verify Terminal Works

**Check**:
1. Can type commands
2. See output
3. Copy/paste works
4. Can resize height

**If broken**, the TerminalComponent already exists and should work.

---

## 🎯 Success Criteria

After these fixes, you should have:

- [x] Window resizes smoothly (drag corners/edges)
- [x] Can make window smaller (800x600 minimum)
- [x] Explorer panel resizes (drag divider)
- [x] Terminal resizes (drag divider)
- [x] Can open files from desktop (File > Open)
- [x] Terminal runs commands
- [x] Can type in terminal
- [x] Copy/paste works

---

## 🚀 Quick Fix (30 minutes)

### Just Fix Resizing:

**1. Edit Tauri Config** (5 min)
```bash
# File: tauri-shell/src-tauri/tauri.conf.json
# Change:
"resizable": true,
"decorations": true,
"minWidth": 800,
"minHeight": 600
```

**2. Rebuild** (5 min)
```bash
cd tauri-shell
npm run tauri build
```

**3. Test** (5 min)
```bash
open tauri-shell/src-tauri/target/release/bundle/macos/tauri-shell.app
```

**4. Fix Panel Widths** (15 min)
- Replace `w-64` with `style={{ width: '250px' }}`
- Replace `w-80` with `style={{ width: '300px' }}`
- Add `flex-1` to editor panel

This will make it functional immediately!

---

## 📊 Current vs Fixed

### Current (Broken):
```
┌────────────────────────────────────────────┐
│  [Fixed 64px] [Fixed 256px] [Flex] [320px] │
│  Can't resize window                       │
│  Can't resize panels                       │
│  Too wide                                  │
└────────────────────────────────────────────┘
```

### Fixed (Working):
```
┌──────────────────────────────────┐
│  [64px] [250px] [Flex] [300px]   │
│  ◄────► Resizable window         │
│  ◄────► Resizable panels         │
│  Compact size OK                 │
└──────────────────────────────────┘
```

---

## 💡 Immediate Action

**Run this now** (5 minutes):

1. Check current Tauri config:
```bash
cat tauri-shell/src-tauri/tauri.conf.json | grep -A 10 "windows"
```

2. If `resizable: false` or `decorations: false`, that's the problem!

3. Change to:
```json
"resizable": true,
"decorations": true,
"minWidth": 800,
"minHeight": 600
```

4. Rebuild:
```bash
cd tauri-shell && npm run tauri build
```

**This alone will fix 80% of your issue!**

---

## 📝 Summary

**To get a stable, functional, resizable IDE:**

1. ✅ **Fix window resizing** (5 min) - Edit Tauri config
2. ✅ **Fix panel resizing** (15 min) - Update App.tsx
3. ✅ **Add file dialogs** (10 min) - Add open button
4. ✅ **Test terminal** (5 min) - Should already work

**Total Time**: 30-45 minutes

**No AI chat needed** - Just basic IDE functionality!

