import React, { useState, useEffect, useRef, useId } from 'react';
import { X, ArrowRight } from 'phosphor-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

import { useAppStore } from '../stores/useAppStore';

const GoToLine: React.FC = () => {
    const { showGoToLine, setShowGoToLine, tabs, activeTabId } = useAppStore();
    const isOpen = showGoToLine;
    const onClose = () => setShowGoToLine(false);

    const activeTab = tabs.find(t => t.id === activeTabId);
    const totalLines = activeTab ? activeTab.content.split('\n').length : 0;
    const currentLine = 1; // TODO: Get from editor state
    const onGoToLine = (line: number) => {
        // TODO: Implement jump
        console.log('Jump to line:', line);
    };
    const [lineNumber, setLineNumber] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    // Focus trap for accessibility
    const dialogRef = useFocusTrap<HTMLDivElement>({
        isActive: isOpen,
        onEscape: onClose,
        restoreFocus: true,
        autoFocus: false // We handle focus manually for the input
    });

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setLineNumber(String(currentLine));
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isOpen, currentLine]);

    const handleSubmit = () => {
        const line = parseInt(lineNumber, 10);
        if (!isNaN(line) && line >= 1 && line <= totalLines) {
            onGoToLine(line);
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50 backdrop-blur-sm"
            onClick={onClose}
            role="presentation"
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                className="bg-[#161b22] rounded-lg border border-gray-700 w-[350px] shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                    <span id={titleId} className="text-sm font-medium text-gray-200">Go to Line</span>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                        aria-label="Close dialog"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 flex items-center bg-[#0d1117] border border-gray-700 rounded px-3 py-2">
                            <input
                                ref={inputRef}
                                type="number"
                                min={1}
                                max={totalLines}
                                value={lineNumber}
                                onChange={(e) => setLineNumber(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Line number (1-${totalLines})`}
                                aria-label={`Enter line number between 1 and ${totalLines}`}
                                className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded flex items-center space-x-1"
                            aria-label="Go to line"
                        >
                            <span>Go</span>
                            <ArrowRight size={14} aria-hidden="true" />
                        </button>
                    </div>

                    <div id={descriptionId} className="mt-2 text-xs text-gray-500">
                        Current: Line {currentLine} of {totalLines}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoToLine;
