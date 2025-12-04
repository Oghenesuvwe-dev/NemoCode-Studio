# UI Controls Implementation Plan

**Goal**: Add toggle buttons and window controls for a professional IDE experience

---

## 🎯 What to Add

### 1. Window Controls (Top-Left) - macOS Style
```
[🔴 Close] [🟡 Minimize] [🟢 Maximize]
```

### 2. View Toggle Buttons (Top-Right)
```
[📁 Sidebar] [💬 Chat] [🖥️ Terminal] [🤖 Agents]
```

---

## 📋 Implementation

### Step 1: Add Window Controls to TitleBar

**File**: `tauri-shell/src/components/TitleBar.tsx`

**Add**:
```typescript
import { appWindow } from '@tauri-apps/api/window';

const TitleBar = () => {
  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();
  const handleClose = () => appWindow.close();

  return (
    <div className="h-8 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-2">
      {/* Left: Window Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
          title="Close"
        />
        <button
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600"
          title="Minimize"
        />
        <button
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
          title="Maximize"
        />
      </div>

      {/* Center: Title */}
      <div className="text-xs text-gray-400">Nemo Code</div>

      {/* Right: View Toggles */}
      <div className="flex items-center space-x-1">
        {/* Toggle buttons here */}
      </div>
    </div>
  );
};
```

### Step 2: Add View Toggle Buttons

**File**: `tauri-shell/src/App.tsx`

**Add state**:
```typescript
const [showExplorer, setShowExplorer] = useState(true);
const [showChat, setShowChat] = useState(true);
const [showTerminal, setShowTerminal] = useState(true);
const [showAgents, setShowAgents] = useState(true);
```

**Add to TitleBar**:
```typescript
<div className="flex items-center space-x-1">
  <button
    onClick={() => setShowExplorer(!showExplorer)}
    className={`p-1 rounded ${showExplorer ? 'bg-blue-600' : 'bg-gray-700'}`}
    title="Toggle Sidebar"
  >
    📁
  </button>
  <button
    onClick={() => setShowChat(!showChat)}
    className={`p-1 rounded ${showChat ? 'bg-blue-600' : 'bg-gray-700'}`}
    title="Toggle Chat"
  >
    💬
  </button>
  <button
    onClick={() => setShowTerminal(!showTerminal)}
    className={`p-1 rounded ${showTerminal ? 'bg-blue-600' : 'bg-gray-700'}`}
    title="Toggle Terminal"
  >
    🖥️
  </button>
  <button
    onClick={() => setShowAgents(!showAgents)}
    className={`p-1 rounded ${showAgents ? 'bg-blue-600' : 'bg-gray-700'}`}
    title="Toggle Agents"
  >
    🤖
  </button>
</div>
```

### Step 3: Use State to Show/Hide Panels

**In App.tsx**:
```typescript
{/* Explorer - only show if showExplorer is true */}
{showExplorer && (
  <div style={{ width: `${explorerWidth}px` }}>
    <FileExplorer />
  </div>
)}

{/* Chat - only show if showChat is true */}
{showChat && (
  <div className="w-80">
    <RealChat />
  </div>
)}

{/* Terminal - only show if showTerminal is true */}
{showTerminal && (
  <div style={{ height: `${terminalHeight}px` }}>
    <TerminalComponent />
  </div>
)}

{/* Agents - only show if showAgents is true */}
{showAgents && (
  <div className="h-48">
    <AgentManager />
  </div>
)}
```

---

## 🎨 Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│ [🔴🟡🟢]  Nemo Code  [📁][💬][🖥️][🤖]                    │ ← Title Bar
├─────────────────────────────────────────────────────────┤
│ 📁 │ Editor                              │ 💬 Chat      │
│ E  │                                     │              │
│ x  │                                     │              │
│ p  │                                     │              │
│ l  │                                     │              │
│ o  │                                     │              │
│ r  │                                     │              │
│ e  │                                     │              │
│ r  │                                     │              │
│    ├─────────────────────────────────────┤              │
│    │ 🤖 Agent Manager                    │              │
│    ├─────────────────────────────────────┤              │
│    │ 🖥️ Terminal                         │              │
└────┴─────────────────────────────────────┴──────────────┘
```

**Click buttons to toggle**:
- 📁 = Hide/show Explorer
- 💬 = Hide/show Chat
- 🖥️ = Hide/show Terminal
- 🤖 = Hide/show Agent Manager

---

## ⌨️ Keyboard Shortcuts

Add these shortcuts:
- `Cmd+B` = Toggle Sidebar (Explorer)
- `Cmd+J` = Toggle Terminal
- `Cmd+Shift+C` = Toggle Chat
- `Cmd+Shift+A` = Toggle Agents

---

## 🚀 Quick Implementation

I'll implement this now!

