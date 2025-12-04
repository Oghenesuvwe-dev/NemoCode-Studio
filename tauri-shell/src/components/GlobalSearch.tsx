import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlass, X, File, CaretRight, CaretDown, TextAa, Asterisk, FolderOpen, CircleNotch, ClockClockwise, Trash, ArrowsClockwise, Funnel } from 'phosphor-react';
import { readDir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import SkeletonLoader from './SkeletonLoader';
import { useAppStore } from '../stores/useAppStore';

interface SearchMatch {
    line: number;
    column: number;
    text: string;
    matchStart: number;
    matchEnd: number;
}

interface FileSearchResult {
    path: string;
    fileName: string;
    matches: SearchMatch[];
    isExpanded: boolean;
}

const GlobalSearch: React.FC = () => {
    const { workspacePath, openFile, setShowGlobalSearch } = useAppStore();
    const onFileClick = (path: string) => {
        openFile(path);
        setShowGlobalSearch(false);
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [showReplace, setShowReplace] = useState(false);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const [results, setResults] = useState<FileSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [totalMatches, setTotalMatches] = useState(0);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [includePattern, setIncludePattern] = useState('');
    const [excludePattern, setExcludePattern] = useState('node_modules, dist, build, .git');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load search history and filter presets from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('globalSearchHistory');
        if (saved) {
            try {
                setSearchHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load search history:', e);
            }
        }

        const savedFilters = localStorage.getItem('globalSearchFilters');
        if (savedFilters) {
            try {
                const filters = JSON.parse(savedFilters);
                setIncludePattern(filters.include || '');
                setExcludePattern(filters.exclude || 'node_modules, dist, build, .git');
            } catch (e) {
                console.error('Failed to load filter presets:', e);
            }
        }
    }, []);

    // Save filter presets when they change
    useEffect(() => {
        localStorage.setItem('globalSearchFilters', JSON.stringify({
            include: includePattern,
            exclude: excludePattern
        }));
    }, [includePattern, excludePattern]);

    // Add to history
    const addToHistory = useCallback((term: string) => {
        if (!term || term.length < 2) return;

        const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 20);
        setSearchHistory(newHistory);
        localStorage.setItem('globalSearchHistory', JSON.stringify(newHistory));
    }, [searchHistory]);

    // Clear history
    const clearHistory = useCallback(() => {
        setSearchHistory([]);
        localStorage.removeItem('globalSearchHistory');
        setShowHistory(false);
    }, []);

    // File extensions to search
    const searchableExtensions = [
        '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.css', '.scss',
        '.html', '.xml', '.yaml', '.yml', '.toml', '.py', '.rs', '.go', '.java',
        '.c', '.cpp', '.h', '.hpp', '.sh', '.bash', '.zsh', '.env', '.gitignore'
    ];

    // Match file against patterns
    const matchesPattern = (filePath: string, patterns: string): boolean => {
        if (!patterns.trim()) return true;

        const patternList = patterns.split(',').map(p => p.trim()).filter(p => p);
        return patternList.some(pattern => {
            // Convert glob pattern to regex
            const regexPattern = pattern
                .replace(/\./g, '\\.')
                .replace(/\*/g, '.*')
                .replace(/\?/g, '.');
            const regex = new RegExp(regexPattern, 'i');
            return regex.test(filePath);
        });
    };

    const isSearchableFile = (name: string, fullPath: string): boolean => {
        // Check exclude patterns first
        if (excludePattern && matchesPattern(fullPath, excludePattern)) {
            return false;
        }

        // If include pattern is specified, file must match it
        if (includePattern && !matchesPattern(fullPath, includePattern)) {
            return false;
        }

        // Default searchable extensions
        const lower = name.toLowerCase();
        return searchableExtensions.some(ext => lower.endsWith(ext)) ||
            !name.includes('.'); // Files without extension (like Makefile)
    };

    // Recursively get all files
    const getAllFiles = async (dirPath: string): Promise<string[]> => {
        const files: string[] = [];
        try {
            const entries = await readDir(dirPath);
            for (const entry of entries) {
                const fullPath = `${dirPath}/${entry.name}`;

                // Skip hidden folders and common build/dependency folders
                if (entry.name.startsWith('.') ||
                    entry.name === 'node_modules' ||
                    entry.name === 'dist' ||
                    entry.name === 'build' ||
                    entry.name === 'target' ||
                    entry.name === '__pycache__' ||
                    entry.name === 'venv') {
                    continue;
                }

                if (entry.isDirectory) {
                    const subFiles = await getAllFiles(fullPath);
                    files.push(...subFiles);
                } else if (isSearchableFile(entry.name, fullPath)) {
                    files.push(fullPath);
                }
            }
        } catch (err) {
            console.error(`Error reading directory ${dirPath}:`, err);
        }
        return files;
    };

    // Search in a single file
    const searchInFile = async (filePath: string, regex: RegExp): Promise<SearchMatch[]> => {
        try {
            const content = await readTextFile(filePath);
            const lines = content.split('\n');
            const matches: SearchMatch[] = [];

            lines.forEach((line, lineIndex) => {
                let match;
                const lineRegex = new RegExp(regex.source, regex.flags.replace('g', '') + 'g');
                while ((match = lineRegex.exec(line)) !== null) {
                    matches.push({
                        line: lineIndex + 1,
                        column: match.index + 1,
                        text: line.trim(),
                        matchStart: match.index,
                        matchEnd: match.index + match[0].length
                    });
                    if (match[0].length === 0) break;
                }
            });

            return matches;
        } catch (err) {
            return [];
        }
    };

    // Perform search
    const performSearch = useCallback(async () => {
        if (!workspacePath || !searchTerm || searchTerm.length < 2) {
            setResults([]);
            setTotalMatches(0);
            return;
        }

        setIsSearching(true);
        setResults([]);

        try {
            let regex: RegExp;
            if (useRegex) {
                regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
            } else {
                const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regex = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
            }

            const files = await getAllFiles(workspacePath);
            const searchResults: FileSearchResult[] = [];
            let matchCount = 0;

            // Search files in batches for better UX
            const batchSize = 50;
            for (let i = 0; i < files.length; i += batchSize) {
                const batch = files.slice(i, i + batchSize);
                const batchResults = await Promise.all(
                    batch.map(async (filePath) => {
                        const matches = await searchInFile(filePath, regex);
                        if (matches.length > 0) {
                            matchCount += matches.length;
                            return {
                                path: filePath,
                                fileName: filePath.split('/').pop() || filePath,
                                matches,
                                isExpanded: true
                            };
                        }
                        return null;
                    })
                );

                const validResults = batchResults.filter((r): r is FileSearchResult => r !== null);
                if (validResults.length > 0) {
                    searchResults.push(...validResults);
                    setResults([...searchResults]);
                    setTotalMatches(matchCount);
                }
            }

            setResults(searchResults);
            setTotalMatches(matchCount);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setIsSearching(false);
        }
    }, [workspacePath, searchTerm, caseSensitive, useRegex]);

    // Replace functions
    const replaceInFile = useCallback(async (filePath: string, matchIndex: number) => {
        try {
            const content = await readTextFile(filePath);
            const result = results.find(r => r.path === filePath);
            if (!result || !result.matches[matchIndex]) {
                console.warn('Match not found for replacement');
                return;
            }

            const match = result.matches[matchIndex];
            const lines = content.split('\n');

            // Validate line exists
            if (match.line - 1 >= lines.length) {
                console.error('Line number out of bounds');
                return;
            }

            const line = lines[match.line - 1];

            // Validate match positions
            if (match.matchStart < 0 || match.matchEnd > line.length) {
                console.error('Match position out of bounds');
                return;
            }

            const newLine = line.slice(0, match.matchStart) + replaceTerm + line.slice(match.matchEnd);
            lines[match.line - 1] = newLine;

            await writeTextFile(filePath, lines.join('\n'));

            // Refresh search results
            performSearch();
        } catch (err) {
            console.error('Replace error:', err);
            alert(`Failed to replace in ${filePath}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }, [results, replaceTerm, performSearch]);

    const replaceAllInFile = useCallback(async (filePath: string) => {
        try {
            const content = await readTextFile(filePath);
            let regex: RegExp;

            try {
                if (useRegex) {
                    regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
                } else {
                    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    regex = new RegExp(escaped, caseSensitive ? 'g' : 'gi');
                }
            } catch (regexErr) {
                console.error('Invalid regex pattern:', regexErr);
                alert('Invalid search pattern');
                return;
            }

            const newContent = content.replace(regex, replaceTerm);

            // Check if any replacements were made
            if (newContent === content) {
                console.warn('No replacements made in', filePath);
            }

            await writeTextFile(filePath, newContent);

            // Refresh search results
            performSearch();
        } catch (err) {
            console.error('Replace all in file error:', err);
            alert(`Failed to replace in ${filePath}: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }, [searchTerm, replaceTerm, caseSensitive, useRegex, performSearch]);

    const replaceAllInWorkspace = useCallback(async () => {
        setShowConfirmDialog(false);

        if (!results || results.length === 0) {
            console.warn('No results to replace');
            return;
        }

        let successCount = 0;
        let failCount = 0;

        try {
            for (const result of results) {
                try {
                    await replaceAllInFile(result.path);
                    successCount++;
                } catch (err) {
                    failCount++;
                    console.error(`Failed to replace in ${result.path}:`, err);
                }
            }

            if (failCount > 0) {
                alert(`Replaced in ${successCount} file(s), failed in ${failCount} file(s)`);
            }
        } catch (err) {
            console.error('Replace all in workspace error:', err);
            alert(`Failed to complete replacement: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    }, [results, replaceAllInFile]);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchTerm.length >= 2) {
            searchTimeoutRef.current = setTimeout(() => {
                performSearch();
            }, 300);
        } else {
            setResults([]);
            setTotalMatches(0);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, caseSensitive, useRegex, includePattern, excludePattern, performSearch]);

    const toggleFileExpanded = (index: number) => {
        setResults(prev => prev.map((r, i) =>
            i === index ? { ...r, isExpanded: !r.isExpanded } : r
        ));
    };

    const highlightMatch = (text: string, matchStart: number, matchEnd: number) => {
        // Truncate long lines
        const maxLength = 80;
        let displayText = text;
        let adjustedStart = matchStart;
        let adjustedEnd = matchEnd;

        if (text.length > maxLength) {
            const start = Math.max(0, matchStart - 20);
            const end = Math.min(text.length, matchEnd + 40);
            displayText = (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
            adjustedStart = matchStart - start + (start > 0 ? 3 : 0);
            adjustedEnd = matchEnd - start + (start > 0 ? 3 : 0);
        }

        return (
            <span className="font-mono text-xs">
                {displayText.slice(0, adjustedStart)}
                <span className="bg-yellow-500/30 text-yellow-200">{displayText.slice(adjustedStart, adjustedEnd)}</span>
                {displayText.slice(adjustedEnd)}
            </span>
        );
    };

    if (!workspacePath) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                <FolderOpen size={48} className="mb-2 opacity-20" />
                <p className="text-sm">Open a workspace to search</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-800">
                <div className="relative">
                    <div className="flex items-center bg-[#0d1117] border border-gray-700 rounded px-2 py-1.5 mb-2">
                        <MagnifyingGlass size={14} className="text-gray-500 mr-2" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addToHistory(searchTerm);
                                }
                            }}
                            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                            placeholder="Search in files..."
                            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="text-gray-500 hover:text-gray-300">
                                <X size={12} />
                            </button>
                        )}
                        {searchHistory.length > 0 && (
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="ml-1 p-1 text-gray-500 hover:text-gray-300 rounded"
                                title="Search History"
                            >
                                <ClockClockwise size={12} />
                            </button>
                        )}
                    </div>

                    {/* History Dropdown */}
                    {showHistory && searchHistory.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-[#161b22] border border-gray-700 rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
                                <span className="text-xs text-gray-400">Recent Searches</span>
                                <button
                                    onClick={clearHistory}
                                    className="text-gray-500 hover:text-red-400 p-1"
                                    title="Clear History"
                                >
                                    <Trash size={12} />
                                </button>
                            </div>
                            {searchHistory.map((term, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSearchTerm(term);
                                        setShowHistory(false);
                                        searchInputRef.current?.focus();
                                    }}
                                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Replace Input */}
                {showReplace && (
                    <div className="flex items-center bg-[#0d1117] border border-gray-700 rounded px-2 py-1.5 mb-2">
                        <input
                            type="text"
                            value={replaceTerm}
                            onChange={(e) => setReplaceTerm(e.target.value)}
                            placeholder="Replace with..."
                            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                        />
                    </div>
                )}

                {/* Filter Inputs */}
                {showFilters && (
                    <div className="space-y-2 mb-2">
                        <div className="flex items-center bg-[#0d1117] border border-gray-700 rounded px-2 py-1.5">
                            <input
                                type="text"
                                value={includePattern}
                                onChange={(e) => setIncludePattern(e.target.value)}
                                placeholder="Include: *.js, *.ts, src/**"
                                className="flex-1 bg-transparent outline-none text-xs text-gray-200 placeholder-gray-500"
                            />
                        </div>
                        <div className="flex items-center bg-[#0d1117] border border-gray-700 rounded px-2 py-1.5">
                            <input
                                type="text"
                                value={excludePattern}
                                onChange={(e) => setExcludePattern(e.target.value)}
                                placeholder="Exclude: node_modules, dist, *.test.js"
                                className="flex-1 bg-transparent outline-none text-xs text-gray-200 placeholder-gray-500"
                            />
                        </div>
                    </div>
                )}

                {/* Options */}
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCaseSensitive(!caseSensitive)}
                        className={`p-1 rounded text-xs flex items-center space-x-1 ${caseSensitive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        title="Match Case"
                    >
                        <TextAa size={12} />
                        <span>Aa</span>
                    </button>
                    <button
                        onClick={() => setUseRegex(!useRegex)}
                        className={`p-1 rounded text-xs flex items-center space-x-1 ${useRegex ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        title="Use Regex"
                    >
                        <Asterisk size={12} />
                        <span>.*</span>
                    </button>
                    <button
                        onClick={() => setShowReplace(!showReplace)}
                        className={`p-1 rounded text-xs flex items-center space-x-1 ${showReplace ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        title="Toggle Replace"
                    >
                        <ArrowsClockwise size={12} />
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-1 rounded text-xs flex items-center space-x-1 ${showFilters ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                        title="Toggle Filters"
                    >
                        <Funnel size={12} />
                    </button>

                    <div className="flex-1" />

                    {showReplace && totalMatches > 0 && (
                        <button
                            onClick={() => setShowConfirmDialog(true)}
                            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                            title="Replace All in Workspace"
                        >
                            Replace All ({totalMatches})
                        </button>
                    )}

                    {isSearching && (
                        <CircleNotch size={14} className="text-blue-400 animate-spin" />
                    )}

                    {!isSearching && totalMatches > 0 && (
                        <span className="text-xs text-gray-500">
                            {totalMatches} result{totalMatches !== 1 ? 's' : ''} in {results.length} file{results.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#1c2128] border border-gray-700 rounded-lg p-4 max-w-md">
                        <h3 className="text-white font-semibold mb-2">Replace All Occurrences?</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            This will replace {totalMatches} occurrence{totalMatches !== 1 ? 's' : ''} across {results.length} file{results.length !== 1 ? 's' : ''}. This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={replaceAllInWorkspace}
                                className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                                Replace All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
                {isSearching && (
                    <SkeletonLoader type="search-result" count={5} />
                )}

                {!isSearching && results.length === 0 && searchTerm.length >= 2 && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                        No results found
                    </div>
                )}

                {!isSearching && results.map((result, fileIndex) => (
                    <div key={result.path} className="border-b border-gray-800">
                        {/* File Header */}
                        <div className="flex items-center px-3 py-2 hover:bg-[#161b22]">
                            <span
                                onClick={() => toggleFileExpanded(fileIndex)}
                                className="text-gray-500 mr-1 cursor-pointer"
                            >
                                {result.isExpanded ? <CaretDown size={12} /> : <CaretRight size={12} />}
                            </span>
                            <File size={14} className="text-gray-400 mr-2" />
                            <span
                                onClick={() => toggleFileExpanded(fileIndex)}
                                className="text-sm text-gray-200 truncate flex-1 cursor-pointer"
                            >
                                {result.fileName}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">{result.matches.length}</span>
                            {showReplace && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        replaceAllInFile(result.path);
                                    }}
                                    className="ml-2 px-2 py-0.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                                    title="Replace All in File"
                                >
                                    Replace All
                                </button>
                            )}
                        </div>

                        {/* Matches */}
                        {result.isExpanded && (
                            <div className="bg-[#0d1117]">
                                {result.matches.slice(0, 20).map((match, matchIndex) => (
                                    <div
                                        key={`${match.line}-${match.column}-${matchIndex}`}
                                        className="flex items-start px-6 py-1.5 hover:bg-[#161b22] border-l-2 border-transparent hover:border-blue-500 group"
                                    >
                                        <span className="text-xs text-gray-500 w-8 flex-shrink-0">{match.line}</span>
                                        <span
                                            onClick={() => onFileClick(result.path)}
                                            className="text-gray-300 truncate flex-1 cursor-pointer"
                                        >
                                            {highlightMatch(match.text, match.matchStart, match.matchEnd)}
                                        </span>
                                        {showReplace && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    replaceInFile(result.path, matchIndex);
                                                }}
                                                className="ml-2 px-2 py-0.5 text-xs bg-gray-700 hover:bg-blue-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Replace This"
                                            >
                                                Replace
                                            </button>
                                        )}
                                    </div>
                                ))}
                                {result.matches.length > 20 && (
                                    <div className="px-6 py-1.5 text-xs text-gray-500">
                                        ... and {result.matches.length - 20} more matches
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlobalSearch;
