import { useState, useEffect, useCallback, useRef } from 'react';

interface FileWatcherOptions {
    filePath: string | null;
    currentContent: string;
    onExternalChange: (newContent: string) => void;
    checkInterval?: number;
}

interface FileWatcherState {
    hasExternalChanges: boolean;
    lastModified: number | null;
}

/**
 * Hook to watch a file for external changes
 * Uses polling since Tauri's fs watch requires additional setup
 */
export function useFileWatcher({
    filePath,
    currentContent,
    onExternalChange,
    checkInterval = 2000
}: FileWatcherOptions) {
    const [state, setState] = useState<FileWatcherState>({
        hasExternalChanges: false,
        lastModified: null
    });
    
    const contentHashRef = useRef<string>('');
    const isCheckingRef = useRef(false);

    // Simple hash function for content comparison
    const hashContent = (content: string): string => {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    };

    // Update hash when content changes from editor
    useEffect(() => {
        contentHashRef.current = hashContent(currentContent);
    }, [currentContent]);

    // Check for external changes
    const checkForChanges = useCallback(async () => {
        if (!filePath || isCheckingRef.current) return;
        
        isCheckingRef.current = true;
        
        try {
            // Dynamic import to avoid issues during SSR/build
            const { readTextFile } = await import('@tauri-apps/plugin-fs');
            const diskContent = await readTextFile(filePath);
            const diskHash = hashContent(diskContent);
            
            if (diskHash !== contentHashRef.current) {
                setState(prev => ({ ...prev, hasExternalChanges: true }));
            }
        } catch (err) {
            // File might not exist or be inaccessible
            console.debug('File watcher check failed:', err);
        } finally {
            isCheckingRef.current = false;
        }
    }, [filePath]);

    // Set up polling interval
    useEffect(() => {
        if (!filePath) return;

        const interval = setInterval(checkForChanges, checkInterval);
        return () => clearInterval(interval);
    }, [filePath, checkInterval, checkForChanges]);

    // Reload file from disk
    const reloadFromDisk = useCallback(async () => {
        if (!filePath) return;
        
        try {
            const { readTextFile } = await import('@tauri-apps/plugin-fs');
            const diskContent = await readTextFile(filePath);
            contentHashRef.current = hashContent(diskContent);
            setState({ hasExternalChanges: false, lastModified: Date.now() });
            onExternalChange(diskContent);
        } catch (err) {
            console.error('Failed to reload file:', err);
        }
    }, [filePath, onExternalChange]);

    // Dismiss the external change notification
    const dismissChanges = useCallback(() => {
        // Update hash to current content to ignore the external change
        contentHashRef.current = hashContent(currentContent);
        setState(prev => ({ ...prev, hasExternalChanges: false }));
    }, [currentContent]);

    return {
        hasExternalChanges: state.hasExternalChanges,
        reloadFromDisk,
        dismissChanges
    };
}

export default useFileWatcher;
