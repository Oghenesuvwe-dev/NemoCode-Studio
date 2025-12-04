# Stability Implementation Plan - Quick Start

## 1. Install Required Dependencies

```bash
npm install --prefix tauri-shell zustand react-hot-toast hotkeys-js
```

## 2. Create State Management (Zustand)

**File**: `tauri-shell/src/store.ts`

```typescript
import { create } from 'zustand';

interface AppState {
  // UI State
  activeTab: string;
  openTabs: string[];
  expandedFolders: Set<string>;
  selectedFile: string | null;
  
  // Chat State
  chatMessages: Array<{ role: 'user' | 'ai'; text: string }>;
  selectedModel: string;
  
  // Agent State
  agents: Array<{ id: number; name: string; status: 'idle' | 'working' | 'error' }>;
  
  // UI Actions
  setActiveTab: (tab: string) => void;
  openTab: (tab: string) => void;
  closeTab: (tab: string) => void;
  toggleFolder: (path: string) => void;
  selectFile: (file: string) => void;
  
  // Chat Actions
  addMessage: (role: 'user' | 'ai', text: string) => void;
  clearChat: () => void;
  setModel: (model: string) => void;
  
  // Agent Actions
  updateAgentStatus: (id: number, status: 'idle' | 'working' | 'error') => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'App.tsx',
  openTabs: ['App.tsx', 'main.tsx'],
  expandedFolders: new Set(['src']),
  selectedFile: 'App.tsx',
  chatMessages: [],
  selectedModel: 'Llama 3.1 (Local)',
  agents: [
    { id: 1, name: 'Review Agent', status: 'idle' },
    { id: 2, name: 'DevOps Agent', status: 'working' },
    { id: 3, name: 'Coder Agent', status: 'error' },
  ],
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  openTab: (tab) => set((state) => ({
    openTabs: [...new Set([...state.openTabs, tab])],
    activeTab: tab,
  })),
  closeTab: (tab) => set((state) => ({
    openTabs: state.openTabs.filter((t) => t !== tab),
    activeTab: state.openTabs[0] || '',
  })),
  toggleFolder: (path) => set((state) => {
    const newSet = new Set(state.expandedFolders);
    if (newSet.has(path)) newSet.delete(path);
    else newSet.add(path);
    return { expandedFolders: newSet };
  }),
  selectFile: (file) => set({ selectedFile: file }),
  
  addMessage: (role, text) => set((state) => ({
    chatMessages: [...state.chatMessages, { role, text }],
  })),
  clearChat: () => set({ chatMessages: [] }),
  setModel: (model) => set({ selectedModel: model }),
  
  updateAgentStatus: (id, status) => set((state) => ({
    agents: state.agents.map((a) => (a.id === id ? { ...a, status } : a)),
  })),
}));
```

## 3. Add Keyboard Shortcuts

**File**: `tauri-shell/src/hooks/useKeyboardShortcuts.ts`

```typescript
import { useEffect } from 'react';
import hotkeys from 'hotkeys-js';
import { useAppStore } from '../store';

export const useKeyboardShortcuts = () => {
  const { openTab, setActiveTab, clearChat } = useAppStore();

  useEffect(() => {
    // Cmd+P: Quick file open
    hotkeys('cmd+p', (e) => {
      e.preventDefault();
      // TODO: Open file search dialog
    });

    // Cmd+K: Focus chat
    hotkeys('cmd+k', (e) => {
      e.preventDefault();
      // TODO: Focus chat input
    });

    // Cmd+B: Toggle sidebar
    hotkeys('cmd+b', (e) => {
      e.preventDefault();
      // TODO: Toggle sidebar visibility
    });

    // Cmd+Shift+P: Command palette
    hotkeys('cmd+shift+p', (e) => {
      e.preventDefault();
      // TODO: Open command palette
    });

    return () => hotkeys.unbind();
  }, []);
};
```

## 4. Flexible Panel Resizing

**File**: `tauri-shell/src/components/ResizablePanel.tsx`

```typescript
import { useState, useRef } from 'react';

interface ResizablePanelProps {
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  children: React.ReactNode;
}

export const ResizablePanel = ({
  defaultWidth,
  minWidth,
  maxWidth,
  children,
}: ResizablePanelProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div style={{ width }}>
      {children}
      <div
        onMouseDown={handleMouseDown}
        className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors"
      />
    </div>
  );
};
```

## 5. Error Handling & Loading States

**File**: `tauri-shell/src/components/ErrorBoundary.tsx`

```typescript
import { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#0d1117]">
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h1 className="text-xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## 6. API Integration with Tauri

**File**: `tauri-shell/src/api/backend.ts`

```typescript
import { invoke } from '@tauri-apps/api/core';

export const backendAPI = {
  // File operations
  async readFile(path: string) {
    try {
      return await invoke('read_file', { path });
    } catch (error) {
      console.error('Failed to read file:', error);
      throw error;
    }
  },

  async writeFile(path: string, content: string) {
    try {
      return await invoke('write_file', { path, content });
    } catch (error) {
      console.error('Failed to write file:', error);
      throw error;
    }
  },

  // Chat operations
  async sendMessage(message: string, model: string) {
    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, model }),
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  // Agent operations
  async getAgentStatus(agentId: number) {
    try {
      const response = await fetch(`http://localhost:8000/api/agents/${agentId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get agent status:', error);
      throw error;
    }
  },
};
```

## 7. Loading & Error Toast Notifications

**File**: `tauri-shell/src/components/Toast.tsx`

```typescript
import { Toaster, toast } from 'react-hot-toast';

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
};

export const ToastContainer = () => <Toaster position="bottom-right" />;
```

## 8. Responsive Layout Fix

**Update**: `tauri-shell/src/App.tsx`

```typescript
// Replace fixed widths with responsive classes
<div className="w-16 md:w-20 lg:w-16">  {/* Activity bar */}
<div className="w-48 md:w-64 lg:w-64">  {/* Explorer */}
<div className="w-72 md:w-80 lg:w-96">  {/* Chat panel */}

// Add media queries for small screens
@media (max-width: 1024px) {
  .sidebar { display: none; }  /* Hide on small screens */
}
```

## 9. Performance Optimization

```typescript
// Use React.memo for components
export const SidebarIcon = React.memo(({ icon, label, active }: any) => (
  // component
));

// Use useCallback for handlers
const handleTabClick = useCallback((tab: string) => {
  setActiveTab(tab);
}, []);

// Lazy load components
const ChatPanel = lazy(() => import('./ChatPanel'));
const AgentManager = lazy(() => import('./AgentManager'));
```

## 10. Testing Checklist

- [ ] Window resizes without breaking layout
- [ ] All buttons have click handlers
- [ ] Chat sends messages to backend
- [ ] File explorer opens files
- [ ] Agent status updates in real-time
- [ ] Keyboard shortcuts work
- [ ] Error messages display properly
- [ ] App loads in < 2 seconds
- [ ] No console errors
- [ ] Works on 1024x768 and up

---

## Implementation Order

1. **Day 1**: Install deps, create store, add keyboard shortcuts
2. **Day 2**: Implement resizing, error handling, API integration
3. **Day 3**: Wire up all buttons, add loading states
4. **Day 4**: Performance optimization, testing
5. **Day 5**: Polish, accessibility, final testing

