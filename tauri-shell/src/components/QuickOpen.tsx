import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { X, File, Folder, MagnifyingGlass, CircleNotch } from 'phosphor-react';
import { readDir } from '@tauri-apps/plugin-fs';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useAppStore } from '../stores/useAppStore';

const QuickOpen: React.FC = () => {
    const { showQuickOpen, setShowQuickOpen, workspacePath, openFile } = useAppStore();
    const isOpen = showQuickOpen;
    const onClose = () => setShowQuickOpen(false);
    const onFileSelect = (path: string) => {
        openFile(path);
    };
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [allFiles, setAllFiles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const titleId = useId();
    const listId = useId();

    // Focus trap for accessibility
    const dialogRef = useFocusTrap<HTMLDivElement>({
        isActive: isOpen,
        onEscape: onClose,
        restoreFocus: true,
        autoFocus: false // We handle focus manually for the input
    });

    // File extensions to include
    const includeExtensions = [
        '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.css', '.scss',
        '.html', '.xml', '.yaml', '.yml', '.toml', '.py', '.rs', '.go', '.java',
        '.c', '.cpp', '.h', '.hpp', '.sh', '.bash', '.zsh', '.env', '.gitignore',
        '.sql', '.graphql', '.vue', '.svelte'
    ];

    const isIncludedFile = (name: string): boolean => {
        const lower = name.toLowerCase();
        return includeExtensions.some(ext => lower.endsWith(ext)) ||
            !name.includes('.'); // Files without extension
    };

    // Recursively get all files
    const getAllFiles = useCallback(async (dirPath: string, maxDepth: number = 5): Promise<string[]> => {
        if (maxDepth <= 0) return [];
        const files: string[] = [];
        try {
            const entries = await readDir(dirPath);
            for (const entry of entries) {
                const fullPath = `${dirPath}/${entry.name}`;

                // Skip hidden folders and common ignore patterns
                if (entry.name.startsWith('.') ||
                    entry.name === 'node_modules' ||
                    entry.name === 'dist' ||
                    entry.name === 'build' ||
                    entry.name === 'target' ||
                    entry.name === '__pycache__' ||
                    entry.name === 'venv' ||
                    entry.name === '.git') {
                    continue;
                }

                if (entry.isDirectory) {
                    const subFiles = await getAllFiles(fullPath, maxDepth - 1);
                    files.push(...subFiles);
                } else if (isIncludedFile(entry.name)) {
                    files.push(fullPath);
                }
            }
        } catch (err) {
            console.error(`Error reading directory ${dirPath}:`, err);
        }
        return files;
    }, []);

    // Load files when opened
    useEffect(() => {
        if (isOpen && workspacePath && allFiles.length === 0) {
            setIsLoading(true);
            getAllFiles(workspacePath).then(files => {
                setAllFiles(files);
                setIsLoading(false);
            });
        }
    }, [isOpen, workspacePath, getAllFiles, allFiles.length]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Fuzzy match function
    const fuzzyMatch = (file: string, query: string): number => {
        const fileName = file.split('/').pop()?.toLowerCase() || '';
        const queryLower = query.toLowerCase();

        // Exact match gets highest score
        if (fileName === queryLower) return 1000;

        // Starts with query
        if (fileName.startsWith(queryLower)) return 500;

        // Contains query
        if (fileName.includes(queryLower)) return 100;

        // Fuzzy match
        let score = 0;
        let queryIndex = 0;
        for (let i = 0; i < fileName.length && queryIndex < queryLower.length; i++) {
            if (fileName[i] === queryLower[queryIndex]) {
                score += 10;
                queryIndex++;
            }
        }

        return queryIndex === queryLower.length ? score : 0;
    };

    const filteredFiles = search.length > 0
        ? allFiles
            .map(file => ({ file, score: fuzzyMatch(file, search) }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 50)
            .map(item => item.file)
        : allFiles.slice(0, 50);

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
                className="bg-[#161b22] rounded-lg border border-gray-700 w-[600px] shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center border-b border-gray-700 px-4 py-3">
                    <MagnifyingGlass size={18} className="text-gray-400 mr-2" aria-hidden="true" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search files by name..."
                        aria-label="Search files"
                        aria-controls={listId}
                        aria-activedescendant={filteredFiles[selectedIndex] ? `file-${selectedIndex}` : undefined}
                        className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                    />
                    <span id={titleId} className="sr-only">Quick Open - Search Files</span>
                    {isLoading && <CircleNotch size={16} className="text-blue-400 animate-spin mr-2" aria-label="Loading files" />}
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white ml-2"
                        aria-label="Close quick open"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <div
                    id={listId}
                    role="listbox"
                    aria-label="File search results"
                    className="max-h-[400px] overflow-y-auto"
                >
                    {!workspacePath ? (
                        <div className="p-8 text-center text-gray-500 text-sm" role="status">
                            <Folder size={32} className="mx-auto mb-2 opacity-30" aria-hidden="true" />
                            Open a workspace first
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 text-sm" role="status" aria-live="polite">
                            {isLoading ? 'Indexing files...' : 'No matching files'}
                        </div>
                    ) : (
                        filteredFiles.map((file, idx) => {
                            const fileName = file.split('/').pop() || file;
                            const relativePath = workspacePath ? file.replace(workspacePath + '/', '') : file;
                            const dirPath = relativePath.substring(0, relativePath.lastIndexOf('/'));

                            return (
                                <div
                                    key={file}
                                    id={`file-${idx}`}
                                    role="option"
                                    aria-selected={idx === selectedIndex}
                                    onClick={() => {
                                        onFileSelect(file);
                                        onClose();
                                    }}
                                    className={`px-4 py-2.5 cursor-pointer flex items-center space-x-3 ${idx === selectedIndex ? 'bg-blue-900/30 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/50 border-l-2 border-l-transparent'
                                        }`}
                                >
                                    <File size={16} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-gray-200 truncate">{fileName}</div>
                                        {dirPath && <div className="text-xs text-gray-500 truncate">{dirPath}</div>}
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

export default QuickOpen;
