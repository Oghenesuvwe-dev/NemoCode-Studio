import { create } from 'zustand';
import { EditorTab } from '../types';

interface AppState {
    // Editor State
    tabs: EditorTab[];
    activeTabId: string;
    workspacePath: string | null;

    // UI State
    showWelcome: boolean;
    isLoading: boolean;
    showFindReplace: boolean;
    showGoToLine: boolean;
    showGlobalSearch: boolean;
    showQuickOpen: boolean;
    showSymbolSearch: boolean;
    showKeyboardShortcuts: boolean;

    // Panel Visibility
    showChat: boolean;
    showAgents: boolean;
    showTerminal: boolean;
    showExplorer: boolean;

    // Layout State
    terminalHeight: number;
    isTerminalMaximized: number | boolean; // Using number for height restoration or boolean for state? App.tsx used boolean + previousHeight state.
    previousTerminalHeight: number;
    explorerWidth: number;

    // Navigation History
    navigationHistory: string[];
    navigationIndex: number;

    // Actions
    setWorkspacePath: (path: string | null) => void;
    setIsLoading: (loading: boolean) => void;
    setShowWelcome: (show: boolean) => void;

    // Panel Actions
    toggleChat: () => void;
    toggleAgents: () => void;
    toggleTerminal: () => void;
    toggleExplorer: () => void;
    setTerminalHeight: (height: number) => void;
    toggleTerminalMaximize: () => void;
    setExplorerWidth: (width: number) => void;

    // Modal Actions
    setShowFindReplace: (show: boolean) => void;
    setShowGoToLine: (show: boolean) => void;
    setShowGlobalSearch: (show: boolean) => void;
    setShowQuickOpen: (show: boolean) => void;
    setShowSymbolSearch: (show: boolean) => void;
    setShowKeyboardShortcuts: (show: boolean) => void;

    // Editor Actions
    openFile: (path: string, name?: string, content?: string) => void;
    closeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;
    updateTabContent: (tabId: string, content: string) => void;
    setTabDirty: (tabId: string, isDirty: boolean) => void;
    saveFile: (tabId: string) => Promise<void>;

    // Navigation Actions
    navigateBack: () => void;
    navigateForward: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Initial State
    tabs: [
        {
            id: '1',
            name: 'Welcome.md',
            path: '/Welcome.md',
            content: '# Welcome to Nemo Code IDE\n\nStart by opening a file or folder.',
            isDirty: false,
            isPinned: false,
        },
    ],
    activeTabId: '1',
    workspacePath: null,

    showWelcome: true,
    isLoading: false,
    showFindReplace: false,
    showGoToLine: false,
    showGlobalSearch: false,
    showQuickOpen: false,
    showSymbolSearch: false,
    showKeyboardShortcuts: false,

    showChat: true,
    showAgents: true,
    showTerminal: true,
    showExplorer: true,

    terminalHeight: 200,
    isTerminalMaximized: false,
    previousTerminalHeight: 200,
    explorerWidth: 250,

    navigationHistory: ['1'],
    navigationIndex: 0,

    // Actions
    setWorkspacePath: (path) => set({ workspacePath: path }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setShowWelcome: (show) => set({ showWelcome: show }),

    toggleChat: () => set((state) => ({ showChat: !state.showChat })),
    toggleAgents: () => set((state) => ({ showAgents: !state.showAgents })),
    toggleTerminal: () => set((state) => ({ showTerminal: !state.showTerminal })),
    toggleExplorer: () => set((state) => ({ showExplorer: !state.showExplorer })),

    setTerminalHeight: (height) => set({ terminalHeight: height }),
    toggleTerminalMaximize: () => set((state) => {
        if (state.isTerminalMaximized) {
            return {
                isTerminalMaximized: false,
                terminalHeight: state.previousTerminalHeight
            };
        } else {
            return {
                isTerminalMaximized: true,
                previousTerminalHeight: state.terminalHeight,
                // Height will be handled by UI using calc(100vh - ...)
            };
        }
    }),
    setExplorerWidth: (width) => set({ explorerWidth: width }),

    setShowFindReplace: (show) => set({ showFindReplace: show }),
    setShowGoToLine: (show) => set({ showGoToLine: show }),
    setShowGlobalSearch: (show) => set({ showGlobalSearch: show }),
    setShowQuickOpen: (show) => set({ showQuickOpen: show }),
    setShowSymbolSearch: (show) => set({ showSymbolSearch: show }),
    setShowKeyboardShortcuts: (show) => set({ showKeyboardShortcuts: show }),

    openFile: (path, name, content = '') => {
        const { tabs, navigationHistory, navigationIndex } = get();
        const existingTab = tabs.find((t) => t.path === path);

        if (existingTab) {
            // If already open, just switch to it
            if (existingTab.id !== get().activeTabId) {
                const newHistory = navigationHistory.slice(0, navigationIndex + 1);
                newHistory.push(existingTab.id);
                set({
                    activeTabId: existingTab.id,
                    navigationHistory: newHistory,
                    navigationIndex: newHistory.length - 1
                });
            }
        } else {
            // Open new tab
            const newTab: EditorTab = {
                id: Date.now().toString(),
                name: name || path.split('/').pop() || 'Untitled',
                path,
                content,
                isDirty: false,
                isPinned: false,
            };

            const newHistory = navigationHistory.slice(0, navigationIndex + 1);
            newHistory.push(newTab.id);

            set({
                tabs: [...tabs, newTab],
                activeTabId: newTab.id,
                showWelcome: false,
                navigationHistory: newHistory,
                navigationIndex: newHistory.length - 1
            });
        }
    },

    closeTab: (tabId) => {
        const { tabs, activeTabId } = get();
        const newTabs = tabs.filter((t) => t.id !== tabId);

        let newActiveId = activeTabId;
        if (activeTabId === tabId) {
            newActiveId = newTabs[newTabs.length - 1]?.id || '';
        }

        set({ tabs: newTabs, activeTabId: newActiveId });
    },

    setActiveTab: (tabId) => {
        const { activeTabId, navigationHistory, navigationIndex } = get();
        if (tabId === activeTabId) return;

        const newHistory = navigationHistory.slice(0, navigationIndex + 1);
        newHistory.push(tabId);

        set({
            activeTabId: tabId,
            navigationHistory: newHistory,
            navigationIndex: newHistory.length - 1
        });
    },

    updateTabContent: (tabId, content) => set((state) => ({
        tabs: state.tabs.map((t) =>
            t.id === tabId ? { ...t, content, isDirty: true } : t
        )
    })),

    setTabDirty: (tabId, isDirty) => set((state) => ({
        tabs: state.tabs.map((t) =>
            t.id === tabId ? { ...t, isDirty } : t
        )
    })),

    saveFile: async (tabId) => {
        const { tabs } = get();
        const tab = tabs.find((t) => t.id === tabId);
        if (!tab) return;

        set({ isLoading: true });
        try {
            const response = await fetch('http://localhost:8000/api/files/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: tab.path, content: tab.content }),
            });

            if (response.ok) {
                set((state) => ({
                    tabs: state.tabs.map((t) =>
                        t.id === tabId ? { ...t, isDirty: false } : t
                    ),
                    isLoading: false
                }));
            } else {
                console.error('Failed to save file');
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to save file:', error);
            set({ isLoading: false });
        }
    },

    navigateBack: () => {
        const { navigationIndex, navigationHistory } = get();
        if (navigationIndex > 0) {
            const newIndex = navigationIndex - 1;
            set({
                navigationIndex: newIndex,
                activeTabId: navigationHistory[newIndex]
            });
        }
    },

    navigateForward: () => {
        const { navigationIndex, navigationHistory } = get();
        if (navigationIndex < navigationHistory.length - 1) {
            const newIndex = navigationIndex + 1;
            set({
                navigationIndex: newIndex,
                activeTabId: navigationHistory[newIndex]
            });
        }
    }
}));
