import React from 'react';
import { WifiHigh, WifiX, ArrowClockwise, CircleNotch } from 'phosphor-react';

interface ConnectionStatusProps {
    isConnected: boolean;
    isChecking: boolean;
    isReconnecting?: boolean;
    retryCount?: number;
    maxRetries?: number;
    onRetry: () => void;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
    isConnected,
    isChecking,
    isReconnecting = false,
    retryCount = 0,
    maxRetries = 5,
    onRetry
}) => {
    if (isChecking) {
        return (
            <div className="flex items-center space-x-2 text-gray-400 text-xs">
                <CircleNotch size={14} className="animate-spin" />
                <span>Checking connection...</span>
            </div>
        );
    }

    if (!isConnected) {
        if (isReconnecting) {
            return (
                <div className="flex items-center space-x-2 bg-yellow-900/50 border border-yellow-700 rounded px-3 py-1.5">
                    <CircleNotch size={14} className="text-yellow-400 animate-spin" />
                    <span className="text-xs text-yellow-300">
                        Reconnecting... ({retryCount}/{maxRetries})
                    </span>
                    <button
                        onClick={onRetry}
                        className="ml-2 p-1 hover:bg-yellow-800 rounded transition-colors"
                        title="Retry now"
                    >
                        <ArrowClockwise size={12} className="text-yellow-300" />
                    </button>
                </div>
            );
        }

        return (
            <div className="flex items-center space-x-2 bg-red-900/50 border border-red-700 rounded px-3 py-1.5">
                <WifiX size={14} className="text-red-400" />
                <span className="text-xs text-red-300">
                    {retryCount >= maxRetries ? 'Connection failed' : 'Backend disconnected'}
                </span>
                <button
                    onClick={onRetry}
                    className="ml-2 p-1 hover:bg-red-800 rounded transition-colors"
                    title="Retry connection"
                >
                    <ArrowClockwise size={12} className="text-red-300" />
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-1 text-green-400 text-xs">
            <WifiHigh size={14} />
            <span>Connected</span>
        </div>
    );
};

export default ConnectionStatus;
