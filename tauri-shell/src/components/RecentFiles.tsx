import React, { useState, useEffect, useRef } from 'react';
import { X, File, Clock, MagnifyingGlass } from 'phosphor-react';

interface RecentFilesProps {
    isOpen: boolean;
    onClose: () => void;
    recentFiles: string[];
    onFileSelect: (path: string) => void;
}

const RecentFiles: React.FC<RecentFilesProps> = ({
    isOpen,
    onClose,
    recentFiles,
    onFileSelect
}) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredFiles = recentFiles.filter(file => {
        const fileName = file.split('/').pop()?.toLowerCase() || '';
        return fileName.includes(search.toLowerCase());
    });

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
            setSelectedIndex(prev => Math.min(prev + 1, filteredFiles.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredFiles[selectedIndex]) {
            e.preventDefault();
            onFileSelect(filteredFiles[selectedIndex]);
            onClose();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#161b22] rounded-lg border border-gray-700 w-[500px] shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center border-b border-gray-700 px-4 py-3">
                    <MagnifyingGlass size={18} className="text-gray-400 mr-2" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search recent files..."
                        className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                    />
                    <button onClick={onClose} className="text-gray-400 hover:text-white ml-2">
                        <X size={18} />
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    {filteredFiles.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            <Clock size={32} className="mx-auto mb-2 opacity-30" />
                            {recentFiles.length === 0 ? 'No recent files' : 'No matching files'}
                        </div>
                    ) : (
                        filteredFiles.map((file, idx) => {
                            const fileName = file.split('/').pop() || file;
                            const dirPath = file.substring(0, file.lastIndexOf('/'));
                            
                            return (
                                <div
                                    key={file}
                                    onClick={() => {
                                        onFileSelect(file);
                                        onClose();
                                    }}
                                    className={`px-4 py-2.5 cursor-pointer flex items-center space-x-3 ${
                                        idx === selectedIndex ? 'bg-blue-900/30 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/50 border-l-2 border-l-transparent'
                                    }`}
                                >
                                    <File size={16} className="text-gray-400 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-gray-200 truncate">{fileName}</div>
                                        <div className="text-xs text-gray-500 truncate">{dirPath}</div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500 flex items-center justify-between">
                    <span>↑↓ to navigate</span>
                    <span>↵ to open</span>
                    <span>esc to close</span>
                </div>
            </div>
        </div>
    );
};

export default RecentFiles;
