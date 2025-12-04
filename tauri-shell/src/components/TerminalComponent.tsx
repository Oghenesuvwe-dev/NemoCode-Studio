import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Trash, X, CaretDown, Terminal as TerminalIcon, Copy, ClipboardText, Eraser } from 'phosphor-react';
import { useAppStore } from '../stores/useAppStore';
import TerminalInstance from './TerminalInstance';

interface TerminalTab {
    id: string;
    shellName: string;
}

const TerminalComponent: React.FC = () => {
    const { workspacePath } = useAppStore();
    const [tabs, setTabs] = useState<TerminalTab[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [showShellDropdown, setShowShellDropdown] = useState(false);

    // Create a new terminal tab
    const createTerminal = useCallback((shell: string = 'zsh') => {
        const id = `term-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newTab: TerminalTab = {
            id,
            shellName: shell
        };
        setTabs(prev => [...prev, newTab]);
        setActiveId(id);
    }, []);

    // Initialize first terminal
    useEffect(() => {
        if (tabs.length === 0) {
            createTerminal();
        }
    }, [tabs.length, createTerminal]);

    // Handle global resize
    useEffect(() => {
        const handleResize = () => {
            // Terminal instances will handle their own resize
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCloseTab = useCallback((id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        setTabs(prev => {
            const newTabs = prev.filter(t => t.id !== id);

            // Switch active tab if needed
            if (activeId === id && newTabs.length > 0) {
                setActiveId(newTabs[newTabs.length - 1].id);
            } else if (newTabs.length === 0) {
                setActiveId(null);
            }

            return newTabs;
        });
    }, [activeId]);

    const handleKillActive = useCallback(() => {
        if (activeId) {
            handleCloseTab(activeId);
        }
    }, [activeId, handleCloseTab]);

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    }, []);

    const handleCopy = useCallback(() => {
        // Copy functionality would need access to the terminal instance
        // For now, use browser's native copy
        document.execCommand('copy');
        setContextMenu(null);
    }, []);

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            // Paste functionality would need access to the terminal instance
            // This is a limitation we'll address with a ref pattern if needed
            console.log('Paste:', text);
        } catch (err) {
            console.error('Paste failed:', err);
        }
        setContextMenu(null);
    }, []);

    const handleClear = useCallback(() => {
        // Clear functionality would need access to the terminal instance
        setContextMenu(null);
    }, []);

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClick);
            return () => document.removeEventListener('click', handleClick);
        }
    }, [contextMenu]);

    return (
        <div className="flex h-full bg-[#161b22] overflow-hidden">
            {/* Main Terminal Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-3 h-9 bg-[#161b22] border-b border-gray-800 shrink-0">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Terminal</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        {/* Shell Selector / New Terminal */}
                        <div className="relative">
                            <button
                                onClick={() => setShowShellDropdown(!showShellDropdown)}
                                className="flex items-center space-x-1 text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 text-xs transition-colors"
                                title="New Terminal"
                            >
                                <Plus size={14} weight="bold" />
                                <CaretDown size={10} weight="bold" />
                            </button>

                            {showShellDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowShellDropdown(false)} />
                                    <div className="absolute right-0 top-full mt-1 w-32 bg-[#21262d] border border-gray-700 rounded-md shadow-xl z-50 py-1">
                                        {['zsh', 'bash', 'sh', 'python3', 'node'].map(shell => (
                                            <button
                                                key={shell}
                                                onClick={() => {
                                                    createTerminal(shell);
                                                    setShowShellDropdown(false);
                                                }}
                                                className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-blue-600 hover:text-white flex items-center space-x-2"
                                            >
                                                <TerminalIcon size={12} />
                                                <span>{shell}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="w-px h-3 bg-gray-700 mx-1" />

                        <button
                            onClick={handleKillActive}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                            title="Kill Active Terminal"
                        >
                            <Trash size={14} />
                        </button>
                    </div>
                </div>

                {/* Terminal Container */}
                <div className="flex-1 relative bg-[#161b22] p-0 overflow-hidden" onContextMenu={handleContextMenu}>
                    {tabs.map(tab => (
                        <TerminalInstance
                            key={tab.id}
                            id={tab.id}
                            shell={tab.shellName}
                            cwd={workspacePath}
                            isActive={tab.id === activeId}
                            onClose={handleCloseTab}
                        />
                    ))}
                </div>
            </div>

            {/* Right Sidebar - Tabs */}
            <div className="w-40 bg-[#0d1117] flex flex-col border-l border-gray-800 shrink-0">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Open Terminals</div>
                <div className="flex-1 overflow-y-auto">
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveId(tab.id)}
                            className={`group flex items-center justify-between px-3 py-1.5 cursor-pointer border-l-2 transition-colors ${activeId === tab.id
                                    ? 'bg-[#161b22] text-white border-blue-500'
                                    : 'text-gray-400 border-transparent hover:bg-[#161b22] hover:text-gray-300'
                                }`}
                        >
                            <div className="flex items-center space-x-2 truncate min-w-0">
                                <TerminalIcon size={13} className={activeId === tab.id ? 'text-blue-400' : 'text-gray-500'} />
                                <span className="truncate text-xs font-medium">{tab.shellName}</span>
                            </div>
                            <button
                                onClick={(e) => handleCloseTab(tab.id, e)}
                                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 p-0.5 rounded transition-opacity"
                            >
                                <X size={12} weight="bold" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
                    <div
                        className="fixed bg-[#21262d] border border-gray-700 rounded-md shadow-xl py-1 z-50 min-w-[140px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button onClick={handleCopy} className="w-full px-3 py-1.5 text-left text-xs text-gray-300 hover:bg-blue-600 hover:text-white flex items-center space-x-2">
                            <Copy size={14} />
                            <span>Copy</span>
                        </button>
                        <button onClick={handlePaste} className="w-full px-3 py-1.5 text-left text-xs text-gray-300 hover:bg-blue-600 hover:text-white flex items-center space-x-2">
                            <ClipboardText size={14} />
                            <span>Paste</span>
                        </button>
                        <div className="border-t border-gray-700 my-1" />
                        <button onClick={handleClear} className="w-full px-3 py-1.5 text-left text-xs text-gray-300 hover:bg-blue-600 hover:text-white flex items-center space-x-2">
                            <Eraser size={14} />
                            <span>Clear</span>
                        </button>
                        <button onClick={handleKillActive} className="w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-red-900/50 hover:text-red-300 flex items-center space-x-2">
                            <Trash size={14} />
                            <span>Kill Terminal</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default TerminalComponent;
