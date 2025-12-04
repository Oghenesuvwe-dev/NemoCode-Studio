import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface UseAgentReturn {
    sendMessage: (message: string) => Promise<string>;
    indexCodebase: (path: string) => Promise<void>;
    searchCodebase: (query: string) => Promise<string[]>;
    isLoading: boolean;
    error: string | null;
}

export function useAgent(): UseAgentReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (message: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await invoke<string>('chat', { message });
            return response;
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : 'Failed to send message';
            console.error("Agent Error:", errorMessage);
            invoke('log_msg', { msg: `Agent Error: ${errorMessage}` }).catch(console.error);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const indexCodebase = useCallback(async (path: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await invoke('index_codebase', { path });
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : 'Failed to index codebase';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchCodebase = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await invoke<string[]>('search_codebase', { query });
            return results;
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : 'Failed to search codebase';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        sendMessage,
        indexCodebase,
        searchCodebase,
        isLoading,
        error,
    };
}
