import React, { useId } from 'react';
import { X, Keyboard } from 'phosphor-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

import { useAppStore } from '../stores/useAppStore';

const shortcuts = [
    {
        category: 'File', items: [
            { keys: '⌘ P', description: 'Quick Open - Search files' },
            { keys: '⌘ E', description: 'Recent Files' },
            { keys: '⌘ S', description: 'Save File' },
            { keys: '⌘ W', description: 'Close Tab' },
        ]
    },
    {
        category: 'Edit', items: [
            { keys: '⌘ F', description: 'Find in File' },
            { keys: '⌘ H', description: 'Find and Replace' },
            { keys: '⌘ G', description: 'Go to Line' },
            { keys: '⇧ ⌥ F', description: 'Format Document' },
            { keys: '⌘ Z', description: 'Undo' },
            { keys: '⌘ ⇧ Z', description: 'Redo' },
        ]
    },
    {
        category: 'Navigation', items: [
            { keys: '⌘ [', description: 'Go Back' },
            { keys: '⌘ ]', description: 'Go Forward' },
        ]
    },
    {
        category: 'Search', items: [
            { keys: '⌘ ⇧ F', description: 'Search in Files' },
            { keys: '⌘ T', description: 'Go to Symbol' },
            { keys: 'F12', description: 'Go to Definition' },
            { keys: '⌘ Click', description: 'Go to Definition' },
        ]
    },
    {
        category: 'Terminal', items: [
            { keys: 'Split H', description: 'Split Terminal Horizontal' },
            { keys: 'Split V', description: 'Split Terminal Vertical' },
        ]
    },
    {
        category: 'View', items: [
            { keys: '⌘ M', description: 'Toggle Minimap' },
            { keys: '⌘ B', description: 'Toggle Sidebar' },
            { keys: '⌘ J', description: 'Toggle Terminal' },
            { keys: '⌘ ⇧ P', description: 'Command Palette' },
            { keys: '⌘ R', description: 'Reload Window' },
        ]
    },
];

const KeyboardShortcuts: React.FC = () => {
    const { showKeyboardShortcuts, setShowKeyboardShortcuts } = useAppStore();
    const isOpen = showKeyboardShortcuts;
    const onClose = () => setShowKeyboardShortcuts(false);
    const titleId = useId();
    const dialogRef = useFocusTrap<HTMLDivElement>({
        isActive: isOpen,
        onEscape: onClose,
        restoreFocus: true,
        autoFocus: true
    });

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="bg-[#161b22] rounded-lg border border-gray-700 w-[600px] max-h-[80vh] shadow-2xl flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                        <Keyboard size={20} className="text-blue-400" aria-hidden="true" />
                        <span id={titleId} className="text-sm font-medium text-gray-200">Keyboard Shortcuts</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                        aria-label="Close keyboard shortcuts"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-6">
                        {shortcuts.map(section => (
                            <div key={section.category}>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    {section.category}
                                </h3>
                                <div className="space-y-2">
                                    {section.items.map(item => (
                                        <div key={item.keys} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-300">{item.description}</span>
                                            <kbd className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded text-gray-400 font-mono">
                                                {item.keys}
                                            </kbd>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-700 text-xs text-gray-500 text-center">
                    Press <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded">Esc</kbd> to close
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcuts;
