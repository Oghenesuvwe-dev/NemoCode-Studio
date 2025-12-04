import { useState, useEffect, useCallback, useRef } from 'react';

interface UseBackendConnectionOptions {
    backendUrl: string;
    checkInterval?: number;
    maxRetries?: number;
    onConnectionChange?: (connected: boolean) => void;
}

export function useBackendConnection({
    backendUrl,
    checkInterval = 5000, // Check every 5 seconds
    maxRetries = 10,
    onConnectionChange
}: UseBackendConnectionOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const previousConnected = useRef<boolean | null>(null);
    const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const checkConnection = useCallback(async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(`${backendUrl}/health`, {
                signal: controller.signal,
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                setIsConnected(true);
                setIsReconnecting(false);
                setRetryCount(0);

                if (previousConnected.current !== true) {
                    previousConnected.current = true;
                    onConnectionChange?.(true);
                }
                return true;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            setIsConnected(false);
            setRetryCount(prev => prev + 1);

            if (previousConnected.current !== false) {
                previousConnected.current = false;
                onConnectionChange?.(false);
            }

            if (retryCount < maxRetries) {
                setIsReconnecting(true);
            } else {
                setIsReconnecting(false);
            }
            return false;
        }
    }, [backendUrl, onConnectionChange, retryCount, maxRetries]);

    // Initial check and periodic checks
    useEffect(() => {
        // Immediate check
        checkConnection();

        // Set up interval
        checkIntervalRef.current = setInterval(checkConnection, checkInterval);

        return () => {
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
            }
        };
    }, [checkConnection, checkInterval]);

    const retry = useCallback(() => {
        setRetryCount(0);
        setIsReconnecting(false);
        checkConnection();
    }, [checkConnection]);

    return {
        isConnected,
        isReconnecting,
        retryCount,
        maxRetries,
        retry,
        checkConnection
    };
}

export default useBackendConnection;
