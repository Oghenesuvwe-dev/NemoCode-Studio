import React from 'react';
import { CircleNotch } from 'phosphor-react';

interface LoadingOverlayProps {
    isLoading: boolean;
    message?: string;
    fullScreen?: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    isLoading,
    message = 'Loading...',
    fullScreen = false
}) => {
    if (!isLoading) return null;

    const containerClass = fullScreen
        ? 'fixed inset-0 z-50'
        : 'absolute inset-0 z-10';

    return (
        <div className={`${containerClass} bg-black/50 backdrop-blur-sm flex items-center justify-center`}>
            <div className="bg-[#161b22] border border-gray-700 rounded-lg p-6 flex flex-col items-center space-y-3 shadow-xl">
                <CircleNotch size={32} className="text-blue-400 animate-spin" />
                <span className="text-sm text-gray-300">{message}</span>
            </div>
        </div>
    );
};

export default LoadingOverlay;
