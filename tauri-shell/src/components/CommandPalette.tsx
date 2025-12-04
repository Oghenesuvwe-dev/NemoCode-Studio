import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, X } from 'phosphor-react';

interface Command {
    id: string;
    label: string;
    description?: string;
    action: () => void;
    category: string;
}

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, commands }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
            e.preventDefault();
            filteredCommands[selectedIndex].action();
            onClose();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#161b22] rounded-lg border border-gray-700 w-[600px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center border-b border-gray-700 px-4 py-3">
                    <MagnifyingGlass size={18} className="text-gray-400 mr-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                    />
                    <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">
                        <X size={18} />
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {filteredCommands.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No commands found
                        </div>
                    ) : (
                        filteredCommands.map((cmd, idx) => (
                            <div
                                key={cmd.id}
                                onClick={() => {
                                    cmd.action();
                                    onClose();
                                }}
                                className={`px-4 py-3 cursor-pointer border-b border-gray-800 last:border-b-0 ${
                                    idx === selectedIndex ? 'bg-blue-900/30 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-200 font-medium">{cmd.label}</div>
                                        {cmd.description && (
                                            <div className="text-xs text-gray-500 mt-0.5">{cmd.description}</div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-600 uppercase">{cmd.category}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
