// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { X, MagnifyingGlass, Function, Cube, Tag, ArrowRight } from 'phosphor-react';
import { readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface Symbol {
  name: string;
  type: 'function' | 'class' | 'variable' | 'interface' | 'type' | 'const' | 'method';
  filePath: string;
  line: number;
  preview: string;
}

import { useAppStore } from '../stores/useAppStore';

const SymbolSearch: React.FC = () => {
  const { showSymbolSearch, setShowSymbolSearch, workspacePath, openFile } = useAppStore();
  const isOpen = showSymbolSearch;
  const onClose = () => setShowSymbolSearch(false);
  const onSymbolSelect = (filePath: string, line: number) => {
    openFile(filePath);
    // TODO: Handle line jump
  };
  const [query, setQuery] = useState('');
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [filteredSymbols, setFilteredSymbols] = useState<Symbol[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const listId = useId();

  // Focus trap for accessibility
  const dialogRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    onEscape: onClose,
    restoreFocus: true,
    autoFocus: false // We handle focus manually for the input
  });

  // Extract symbols from file content
  const extractSymbols = useCallback((content: string, filePath: string): Symbol[] => {
    const results: Symbol[] = [];
    const lines = content.split('\n');

    const addSymbol = (name: string, type: Symbol['type'], lineIndex: number) => {
      const line = lines[lineIndex] || '';
      results.push({
        name,
        type,
        filePath,
        line: lineIndex + 1,
        preview: line.trim().substring(0, 80),
      });
    };

    // Process each line for symbols
    lines.forEach((line, lineIndex) => {
      // Functions
      let match;
      const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)/;
      if ((match = line.match(funcRegex))) {
        addSymbol(match[1], 'function', lineIndex);
      }

      // Arrow functions assigned to const
      const arrowRegex = /(?:export\s+)?(?:const|let)\s+(\w+)\s*=\s*(?:async\s*)?\(/;
      if ((match = line.match(arrowRegex))) {
        addSymbol(match[1], 'function', lineIndex);
      }

      // Classes
      const classRegex = /(?:export\s+)?class\s+(\w+)/;
      if ((match = line.match(classRegex))) {
        addSymbol(match[1], 'class', lineIndex);
      }

      // Interfaces (TypeScript)
      const interfaceRegex = /(?:export\s+)?interface\s+(\w+)/;
      if ((match = line.match(interfaceRegex))) {
        addSymbol(match[1], 'interface', lineIndex);
      }

      // Types (TypeScript)
      const typeRegex = /(?:export\s+)?type\s+(\w+)\s*=/;
      if ((match = line.match(typeRegex))) {
        addSymbol(match[1], 'type', lineIndex);
      }

      // Python functions
      const pyFuncRegex = /def\s+(\w+)\s*\(/;
      if ((match = line.match(pyFuncRegex))) {
        addSymbol(match[1], 'function', lineIndex);
      }

      // Python classes
      const pyClassRegex = /class\s+(\w+)/;
      if ((match = line.match(pyClassRegex)) && !line.includes('className')) {
        addSymbol(match[1], 'class', lineIndex);
      }

      // Exported constants
      const constRegex = /export\s+const\s+(\w+)\s*=/;
      if ((match = line.match(constRegex))) {
        addSymbol(match[1], 'const', lineIndex);
      }
    });

    return results;
  }, []);

  // Recursively scan workspace for symbols
  const scanWorkspace = useCallback(async () => {
    if (!workspacePath) return;

    setIsLoading(true);
    const allSymbols: Symbol[] = [];

    const scanDirectory = async (dirPath: string, depth = 0) => {
      if (depth > 5) return; // Limit depth

      try {
        const entries = await readDir(dirPath);

        for (const entry of entries) {
          const fullPath = `${dirPath}/${entry.name}`;

          // Skip common non-code directories
          if (entry.isDirectory) {
            if (!['node_modules', '.git', 'dist', 'build', '.next', '__pycache__', 'venv'].includes(entry.name)) {
              await scanDirectory(fullPath, depth + 1);
            }
          } else if (entry.isFile) {
            const ext = '.' + entry.name.split('.').pop()?.toLowerCase();
            if (SUPPORTED_EXTENSIONS.includes(ext)) {
              try {
                const content = await readTextFile(fullPath);
                const fileSymbols = extractSymbols(content, fullPath);
                allSymbols.push(...fileSymbols);
              } catch (err) {
                // Skip files that can't be read
              }
            }
          }
        }
      } catch (err) {
        console.error('Error scanning directory:', err);
      }
    };

    await scanDirectory(workspacePath);
    setSymbols(allSymbols);
    setIsLoading(false);
  }, [workspacePath, extractSymbols]);

  // Scan workspace when opened
  useEffect(() => {
    if (isOpen && workspacePath) {
      scanWorkspace();
    }
  }, [isOpen, workspacePath, scanWorkspace]);

  // Filter symbols based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredSymbols(symbols.slice(0, 100));
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = symbols
        .filter(s => s.name.toLowerCase().includes(lowerQuery))
        .sort((a, b) => {
          // Prioritize exact matches and prefix matches
          const aExact = a.name.toLowerCase() === lowerQuery;
          const bExact = b.name.toLowerCase() === lowerQuery;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          const aPrefix = a.name.toLowerCase().startsWith(lowerQuery);
          const bPrefix = b.name.toLowerCase().startsWith(lowerQuery);
          if (aPrefix && !bPrefix) return -1;
          if (!aPrefix && bPrefix) return 1;

          return a.name.localeCompare(b.name);
        })
        .slice(0, 50);
      setFilteredSymbols(filtered);
    }
    setSelectedIndex(0);
  }, [query, symbols]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredSymbols.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredSymbols[selectedIndex]) {
          const symbol = filteredSymbols[selectedIndex];
          onSymbolSelect(symbol.filePath, symbol.line);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const getSymbolIcon = (type: Symbol['type']) => {
    switch (type) {
      case 'function':
      case 'method':
        return <Function size={14} className="text-purple-400" />;
      case 'class':
        return <Cube size={14} className="text-yellow-400" />;
      case 'interface':
      case 'type':
        return <Tag size={14} className="text-blue-400" />;
      case 'const':
      case 'variable':
        return <Tag size={14} className="text-green-400" />;
      default:
        return <Tag size={14} className="text-gray-400" />;
    }
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop() || filePath;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-[15vh] z-50"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-[#1c2128] rounded-lg border border-gray-700 w-[600px] max-h-[60vh] shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-700">
          <MagnifyingGlass size={18} className="text-gray-400 mr-3" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search symbols (functions, classes, types...)"
            aria-label="Search symbols"
            aria-controls={listId}
            aria-activedescendant={filteredSymbols[selectedIndex] ? `symbol-${selectedIndex}` : undefined}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
          />
          <span id={titleId} className="sr-only">Go to Symbol</span>
          {isLoading && (
            <div
              className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"
              role="status"
              aria-label="Loading symbols"
            />
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white ml-2"
            aria-label="Close symbol search"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Symbol search results"
          className="flex-1 overflow-y-auto"
        >
          {filteredSymbols.length === 0 ? (
            <div className="p-8 text-center text-gray-500" role="status" aria-live="polite">
              {isLoading ? 'Scanning workspace...' : query ? 'No symbols found' : 'Type to search symbols'}
            </div>
          ) : (
            filteredSymbols.map((symbol, index) => (
              <div
                key={`${symbol.filePath}-${symbol.line}-${symbol.name}`}
                id={`symbol-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => {
                  onSymbolSelect(symbol.filePath, symbol.line);
                  onClose();
                }}
                className={`flex items-center px-4 py-2 cursor-pointer ${index === selectedIndex ? 'bg-blue-600/30' : 'hover:bg-gray-800/50'
                  }`}
              >
                <div className="mr-3" aria-hidden="true">{getSymbolIcon(symbol.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <span className="text-white font-medium">{symbol.name}</span>
                    <span className="text-gray-500 text-xs ml-2">{symbol.type}</span>
                  </div>
                  <div className="text-gray-500 text-xs truncate">{symbol.preview}</div>
                </div>
                <div className="flex items-center text-gray-500 text-xs ml-4">
                  <span className="truncate max-w-[150px]">{getFileName(symbol.filePath)}</span>
                  <ArrowRight size={12} className="mx-1" aria-hidden="true" />
                  <span>:{symbol.line}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
          <span aria-live="polite">{filteredSymbols.length} symbols</span>
          <span>↑↓ navigate • Enter select • Esc close</span>
        </div>
      </div>
    </div>
  );
};

export default SymbolSearch;
