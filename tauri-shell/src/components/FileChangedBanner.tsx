import React from 'react';
import { Warning, ArrowClockwise, X } from 'phosphor-react';

interface FileChangedBannerProps {
    fileName: string;
    onReload: () => void;
    onDismiss: () => void;
}

const FileChangedBanner: React.FC<FileChangedBannerProps> = ({
    fileName,
    onReload,
    onDismiss
}) => {
    return (
        <div className="flex items-center justify-between px-3 py-2 bg-yellow-900/50 border-b border-yellow-700 text-yellow-200 text-sm">
            <div className="flex items-center space-x-2">
                <Warning size={16} className="text-yellow-400" />
                <span>
                    <strong>{fileName}</strong> has been changed on disk.
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={onReload}
                    className="flex items-center space-x-1 px-2 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-xs font-medium transition-colors"
                >
                    <ArrowClockwise size={12} />
                    <span>Reload</span>
                </button>
                <button
                    onClick={onDismiss}
                    className="p-1 hover:bg-yellow-800 rounded transition-colors"
                    title="Keep current version"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
};

export default FileChangedBanner;
