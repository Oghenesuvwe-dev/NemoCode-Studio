import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlass, X, ArrowDown, ArrowUp, TextAa, Asterisk, ArrowsClockwise, ClockClockwise, Trash } from 'phosphor-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

import { useAppStore } from '../stores/useAppStore';

const FindReplace: React.FC = () => {
    const { showFindReplace, setShowFindReplace, tabs, activeTabId, updateTabContent } = useAppStore();
    const isOpen = showFindReplace;
    const onClose = () => setShowFindReplace(false);

    const activeTab = tabs.find(t => t.id === activeTabId);
    const content = activeTab?.content || '';

    const onContentChange = (newContent: string) => {
        if (activeTabId) {
            updateTabContent(activeTabId, newContent);
        }
    };

    const onHighlightMatches = (_matches: { start: number; end: number }[]) => {
        // TODO: Implement highlight
    };

    const onJumpToMatch = (_position: number) => {
        // TODO: Implement jump
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [showReplace, setShowReplace] = useState(false);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [useRegex, setUseRegex] = useState(false);
    const [wholeWord, setWholeWord] = useState(false);
    const [preserveCase, setPreserveCase] = useState(false);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [matches, setMatches] = useState<{ start: number; end: number }[]>([]);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Focus trap for accessibility
    const panelRef = useFocusTrap<HTMLDivElement>({
        isActive: isOpen,
        onEscape: onClose,
        restoreFocus: true,
        autoFocus: false // We handle focus manually for the search input
    });

    // Load search history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('findReplaceHistory');
        if (saved) {
            try {
                setSearchHistory(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load search history:', e);
            }
        }
    }, []);

    // Save to history when search term changes
    const addToHistory = useCallback((term: string) => {
        if (!term || term.length < 2) return;

        const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 20);
        setSearchHistory(newHistory);
        localStorage.setItem('findReplaceHistory', JSON.stringify(newHistory));
    }, [searchHistory]);

    // Clear history
    const clearHistory = useCallback(() => {
        setSearchHistory([]);
        localStorage.removeItem('findReplaceHistory');
        setShowHistory(false);
    }, []);

    // Find all matches
    const findMatches = useCallback(() => {
        if (!searchTerm || !content) {
            setMatches([]);
            onHighlightMatches([]);
            return;
        }

        try {
            let regex: RegExp;
            if (useRegex) {
                const pattern = wholeWord ? `\\b${searchTerm}\\b` : searchTerm;
                regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
            } else {
                const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
                regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
            }

            const foundMatches: { start: number; end: number }[] = [];
            let match;
            while ((match = regex.exec(content)) !== null) {
                foundMatches.push({ start: match.index, end: match.index + match[0].length });
                if (match[0].length === 0) break; // Prevent infinite loop on zero-length matches
            }

            setMatches(foundMatches);
            onHighlightMatches(foundMatches);

            if (foundMatches.length > 0 && currentMatchIndex >= foundMatches.length) {
                setCurrentMatchIndex(0);
            }
        } catch (e) {
            // Invalid regex
            console.error('Invalid search pattern:', e);
            setMatches([]);
            onHighlightMatches([]);
        }
    }, [searchTerm, content, caseSensitive, useRegex, wholeWord, onHighlightMatches, currentMatchIndex]);

    useEffect(() => {
        findMatches();
    }, [findMatches]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.select();
        }
    }, [isOpen]);

    // Jump to current match
    useEffect(() => {
        if (matches.length > 0 && matches[currentMatchIndex]) {
            onJumpToMatch(matches[currentMatchIndex].start);
        }
    }, [currentMatchIndex, matches, onJumpToMatch]);

    const goToNextMatch = () => {
        if (matches.length === 0) return;
        setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    };

    const goToPrevMatch = () => {
        if (matches.length === 0) return;
        setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    };

    // Preserve case helper
    const getReplacementText = (originalText: string, replacement: string): string => {
        if (!preserveCase || !originalText || !replacement) return replacement;

        // All uppercase
        if (originalText === originalText.toUpperCase() && originalText !== originalText.toLowerCase()) {
            return replacement.toUpperCase();
        }
        // First letter uppercase
        if (originalText.length > 0 && originalText[0] === originalText[0].toUpperCase() && originalText[0] !== originalText[0].toLowerCase()) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1).toLowerCase();
        }
        // All lowercase
        return replacement.toLowerCase();
    };

    const replaceCurrentMatch = () => {
        if (matches.length === 0 || !matches[currentMatchIndex]) {
            console.warn('No match to replace');
            return;
        }

        const match = matches[currentMatchIndex];

        // Validate match bounds
        if (match.start < 0 || match.end > content.length || match.start >= match.end) {
            console.error('Invalid match bounds');
            return;
        }

        try {
            const originalText = content.slice(match.start, match.end);
            const replacement = getReplacementText(originalText, replaceTerm);
            const newContent = content.slice(0, match.start) + replacement + content.slice(match.end);
            onContentChange(newContent);
        } catch (err) {
            console.error('Replace failed:', err);
        }
    };

    const replaceAllMatches = () => {
        if (matches.length === 0) {
            console.warn('No matches to replace');
            return;
        }

        try {
            let regex: RegExp;
            try {
                if (useRegex) {
                    const pattern = wholeWord ? `\\b${searchTerm}\\b` : searchTerm;
                    regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
                } else {
                    const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const pattern = wholeWord ? `\\b${escaped}\\b` : escaped;
                    regex = new RegExp(pattern, caseSensitive ? 'g' : 'gi');
                }
            } catch (regexErr) {
                console.error('Invalid regex pattern:', regexErr);
                return;
            }

            const newContent = preserveCase
                ? content.replace(regex, (match) => getReplacementText(match, replaceTerm))
                : content.replace(regex, replaceTerm);

            if (newContent === content) {
                console.warn('No replacements made');
            }

            onContentChange(newContent);
        } catch (e) {
            console.error('Replace all failed:', e);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'Enter') {
            if (e.shiftKey) {
                goToPrevMatch();
            } else {
                goToNextMatch();
            }
        } else if (e.key === 'h' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setShowReplace(true);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            role="search"
            aria-label="Find and replace in file"
            className="absolute top-0 right-4 z-30 bg-[#1c2128] border border-gray-700 rounded-lg shadow-xl p-3 w-[400px]"
        >
            {/* Search Row */}
            <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 relative">
                    <div className="flex items-center bg-[#0d1117] border border-gray-700 rounded px-2 py-1.5">
                        <MagnifyingGlass size={14} className="text-gray-500 mr-2" aria-hidden="true" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addToHistory(searchTerm);
                                }
                                handleKeyDown(e);
                            }}
                            onFocus={() => searchHistory.length > 0 && setShowHistory(true)}
                            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                            placeholder="Find"
                            aria-label="Search text"
                            aria-describedby="search-results-count"
                            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                        />
                        <span id="search-results-count" className="text-xs text-gray-500 ml-2" aria-live="polite">
                            {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : 'No results'}
                        </span>
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

                {/* Toggle buttons */}
                <button
                    onClick={() => setCaseSensitive(!caseSensitive)}
                    className={`p-1.5 rounded ${caseSensitive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    title="Match Case"
                    aria-label={`Match case: ${caseSensitive ? 'on' : 'off'}`}
                    aria-pressed={caseSensitive}
                >
                    <TextAa size={14} aria-hidden="true" />
                </button>
                <button
                    onClick={() => setWholeWord(!wholeWord)}
                    className={`p-1.5 rounded text-xs ${wholeWord ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    title="Match Whole Word"
                    aria-label={`Match whole word: ${wholeWord ? 'on' : 'off'}`}
                    aria-pressed={wholeWord}
                >
                    <span className="font-mono">ab</span>
                </button>
                <button
                    onClick={() => setUseRegex(!useRegex)}
                    className={`p-1.5 rounded ${useRegex ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    title="Use Regex"
                    aria-label={`Use regular expression: ${useRegex ? 'on' : 'off'}`}
                    aria-pressed={useRegex}
                >
                    <Asterisk size={14} aria-hidden="true" />
                </button>
            </div>

            {/* Advanced options */}
            {showReplace && (
                <div className="flex items-center space-x-2 mb-2 px-2">
                    <label className="flex items-center space-x-1 text-xs text-gray-400 cursor-pointer hover:text-gray-300">
                        <input
                            type="checkbox"
                            checked={preserveCase}
                            onChange={(e) => setPreserveCase(e.target.checked)}
                            className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <span>Preserve Case</span>
                    </label>
                </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center space-x-1 mb-2">
                <button
                    onClick={goToPrevMatch}
                    disabled={matches.length === 0}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Previous Match (Shift+Enter)"
                    aria-label="Previous match"
                >
                    <ArrowUp size={14} aria-hidden="true" />
                </button>
                <button
                    onClick={goToNextMatch}
                    disabled={matches.length === 0}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Next Match (Enter)"
                    aria-label="Next match"
                >
                    <ArrowDown size={14} aria-hidden="true" />
                </button>
                <button
                    onClick={() => setShowReplace(!showReplace)}
                    className={`p-1.5 rounded ${showReplace ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    title="Toggle Replace (Cmd+H)"
                    aria-label={`Toggle replace panel: ${showReplace ? 'visible' : 'hidden'}`}
                    aria-expanded={showReplace}
                >
                    <ArrowsClockwise size={14} aria-hidden="true" />
                </button>
                <div className="flex-1" />
                <button
                    onClick={onClose}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                    title="Close (Esc)"
                    aria-label="Close find and replace"
                >
                    <X size={14} aria-hidden="true" />
                </button>
            </div>

            {/* Replace Row */}
            {showReplace && (
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
                    <div className="flex-1 flex items-center bg-[#0d1117] border border-gray-700 rounded px-2 py-1.5">
                        <input
                            type="text"
                            value={replaceTerm}
                            onChange={(e) => setReplaceTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Replace"
                            aria-label="Replace text"
                            className="flex-1 bg-transparent outline-none text-sm text-gray-200 placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={replaceCurrentMatch}
                        disabled={matches.length === 0}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Replace current match"
                    >
                        Replace
                    </button>
                    <button
                        onClick={replaceAllMatches}
                        disabled={matches.length === 0}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Replace all ${matches.length} matches`}
                    >
                        All
                    </button>
                </div>
            )}
        </div>
    );
};

export default FindReplace;
