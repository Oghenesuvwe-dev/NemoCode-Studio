// @ts-nocheck
import React, { useState, useCallback } from 'react';
import { readDir, readTextFile } from '@tauri-apps/plugin-fs';

interface Definition {
  filePath: string;
  line: number;
  preview: string;
  type: 'function' | 'class' | 'variable' | 'import' | 'type';
}

interface GoToDefinitionResult {
  definitions: Definition[];
  isSearching: boolean;
  error: string | null;
}

const SUPPORTED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.rs'];

export const useGoToDefinition = (workspacePath: string | null) => {
  const [result, setResult] = useState<GoToDefinitionResult>({
    definitions: [],
    isSearching: false,
    error: null,
  });

  const findDefinition = useCallback(async (symbol: string): Promise<Definition[]> => {
    if (!workspacePath || !symbol.trim()) return [];

    const definitions: Definition[] = [];
    
    // Patterns to find definitions
    const patterns = [
      // Function declarations
      new RegExp(`(?:export\\s+)?(?:async\\s+)?function\\s+${symbol}\\s*\\(`, 'i'),
      // Arrow functions
      new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${symbol}\\s*=\\s*(?:async\\s*)?\\(`, 'i'),
      // Class declarations
      new RegExp(`(?:export\\s+)?class\\s+${symbol}\\b`, 'i'),
      // Interface declarations
      new RegExp(`(?:export\\s+)?interface\\s+${symbol}\\b`, 'i'),
      // Type declarations
      new RegExp(`(?:export\\s+)?type\\s+${symbol}\\s*=`, 'i'),
      // Variable declarations
      new RegExp(`(?:export\\s+)?(?:const|let|var)\\s+${symbol}\\s*=`, 'i'),
      // Python function
      new RegExp(`def\\s+${symbol}\\s*\\(`, 'i'),
      // Python class
      new RegExp(`class\\s+${symbol}\\s*[:\\(]`, 'i'),
    ];

    const scanDirectory = async (dirPath: string, depth = 0) => {
      if (depth > 5) return;
      
      try {
        const entries = await readDir(dirPath);
        
        for (const entry of entries) {
          const fullPath = `${dirPath}/${entry.name}`;
          
          if (entry.isDirectory) {
            if (!['node_modules', '.git', 'dist', 'build', '.next', '__pycache__', 'venv'].includes(entry.name)) {
              await scanDirectory(fullPath, depth + 1);
            }
          } else if (entry.isFile) {
            const ext = '.' + entry.name.split('.').pop()?.toLowerCase();
            if (SUPPORTED_EXTENSIONS.includes(ext)) {
              try {
                const content = await readTextFile(fullPath);
                const lines = content.split('\n');
                
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i];
                  for (const pattern of patterns) {
                    if (pattern.test(line)) {
                      let type: Definition['type'] = 'variable';
                      if (/function/.test(line) || /def\s/.test(line) || /=>\s*\{/.test(line) || /=\s*\(/.test(line)) {
                        type = 'function';
                      } else if (/class\s/.test(line)) {
                        type = 'class';
                      } else if (/interface\s/.test(line)) {
                        type = 'type';
                      } else if (/type\s/.test(line)) {
                        type = 'type';
                      }
                      
                      definitions.push({
                        filePath: fullPath,
                        line: i + 1,
                        preview: line.trim().substring(0, 100),
                        type,
                      });
                      break; // Only one match per line
                    }
                  }
                }
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
    return definitions;
  }, [workspacePath]);

  const goToDefinition = useCallback(async (symbol: string) => {
    setResult({ definitions: [], isSearching: true, error: null });
    
    try {
      const defs = await findDefinition(symbol);
      setResult({ definitions: defs, isSearching: false, error: null });
      return defs;
    } catch (err) {
      setResult({ definitions: [], isSearching: false, error: String(err) });
      return [];
    }
  }, [findDefinition]);

  return { ...result, goToDefinition, findDefinition };
};

// Helper to extract symbol under cursor from text
export const getSymbolAtPosition = (text: string, position: number): string | null => {
  // Find word boundaries around the position
  const before = text.substring(0, position);
  const after = text.substring(position);
  
  // Match word characters before cursor
  const beforeMatch = before.match(/[\w$]+$/);
  // Match word characters after cursor
  const afterMatch = after.match(/^[\w$]*/);
  
  const word = (beforeMatch?.[0] || '') + (afterMatch?.[0] || '');
  return word.length > 0 ? word : null;
};

export default useGoToDefinition;
