import React, { useState, useEffect } from 'react';
import { GitBranch, FileCode, WifiHigh, WifiX, Robot, Warning } from 'phosphor-react';

interface StatusBarProps {
    line: number;
    column: number;
    totalLines: number;
    fileName: string | null;
    language: string;
    encoding: string;
    isConnected: boolean;
    gitBranch?: string;
    fileSize?: number; // in bytes
}

const StatusBar: React.FC<StatusBarProps> = ({
    line,
    column,
    totalLines,
    fileName,
    language,
    encoding,
    isConnected,
    gitBranch,
    fileSize
}) => {
    // Format file size
    const formatFileSize = (bytes: number | undefined): string => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    // Detect language from file extension
    const getLanguageFromFile = (file: string | null): string => {
        if (!file) return 'Plain Text';
        const ext = file.split('.').pop()?.toLowerCase();
        const langMap: { [key: string]: string } = {
            'ts': 'TypeScript',
            'tsx': 'TypeScript React',
            'js': 'JavaScript',
            'jsx': 'JavaScript React',
            'py': 'Python',
            'rs': 'Rust',
            'go': 'Go',
            'java': 'Java',
            'c': 'C',
            'cpp': 'C++',
            'h': 'C Header',
            'hpp': 'C++ Header',
            'css': 'CSS',
            'scss': 'SCSS',
            'html': 'HTML',
            'json': 'JSON',
            'md': 'Markdown',
            'yaml': 'YAML',
            'yml': 'YAML',
            'toml': 'TOML',
            'xml': 'XML',
            'sh': 'Shell',
            'bash': 'Bash',
            'zsh': 'Zsh',
            'sql': 'SQL',
        };
        return langMap[ext || ''] || 'Plain Text';
    };

    const displayLanguage = language || getLanguageFromFile(fileName);

    // Agent health status
    const [agentHealth, setAgentHealth] = useState<any>(null);

    useEffect(() => {
        const checkAgentHealth = async () => {
            if (!isConnected) {
                setAgentHealth(null);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/health/agents');
                if (response.ok) {
                    const data = await response.json();
                    setAgentHealth(data);
                }
            } catch (error) {
                // Silently fail - agent health is optional
                setAgentHealth(null);
            }
        };

        // Check immediately
        checkAgentHealth();

        // Check every 30 seconds
        const interval = setInterval(checkAgentHealth, 30000);

        return () => clearInterval(interval);
    }, [isConnected]);

    // Get agent status color and icon
    const getAgentStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-500';
            case 'degraded': return 'text-yellow-500';
            case 'hung': return 'text-orange-500';
            case 'failed': return 'text-red-500';
            case 'restarting': return 'text-blue-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <footer 
            role="status" 
            aria-label="Editor status bar"
            className="h-6 bg-[#161b22] border-t border-gray-800 flex items-center justify-between px-3 text-xs text-gray-400 select-none"
        >
            {/* Left side */}
            <div className="flex items-center space-x-4">
                {/* Connection status */}
                <div 
                    className="flex items-center space-x-1" 
                    title={isConnected ? 'Backend Connected' : 'Backend Disconnected'}
                    role="status"
                    aria-live="polite"
                    aria-label={isConnected ? 'Backend connected' : 'Backend disconnected'}
                >
                    {isConnected ? (
                        <WifiHigh size={12} className="text-green-500" aria-hidden="true" />
                    ) : (
                        <WifiX size={12} className="text-red-500" aria-hidden="true" />
                    )}
                </div>

                {/* Agent health status */}
                {agentHealth && agentHealth.main_agent && (
                    <div 
                        className="flex items-center space-x-1" 
                        title={`Agent: ${agentHealth.main_agent.status} (${agentHealth.main_agent.restart_count} restarts)`}
                        aria-label={`Agent status: ${agentHealth.main_agent.status}`}
                    >
                        {agentHealth.main_agent.status === 'healthy' ? (
                            <Robot size={12} className={getAgentStatusColor(agentHealth.main_agent.status)} aria-hidden="true" />
                        ) : (
                            <Warning size={12} className={getAgentStatusColor(agentHealth.main_agent.status)} aria-hidden="true" />
                        )}
                        <span className={getAgentStatusColor(agentHealth.main_agent.status)}>
                            Agent
                        </span>
                    </div>
                )}

                {/* Git branch */}
                {gitBranch && (
                    <div className="flex items-center space-x-1" aria-label={`Git branch: ${gitBranch}`}>
                        <GitBranch size={12} aria-hidden="true" />
                        <span>{gitBranch}</span>
                    </div>
                )}
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                {/* Line/Column */}
                {fileName && (
                    <div className="flex items-center space-x-1" aria-label={`Cursor at line ${line}, column ${column}`}>
                        <span>Ln {line}, Col {column}</span>
                    </div>
                )}

                {/* Total lines */}
                {fileName && totalLines > 0 && (
                    <div className="text-gray-500" aria-label={`${totalLines} total lines`}>
                        {totalLines} lines
                    </div>
                )}

                {/* File size */}
                {fileSize && (
                    <div className="text-gray-500" aria-label={`File size: ${formatFileSize(fileSize)}`}>
                        {formatFileSize(fileSize)}
                    </div>
                )}

                {/* Encoding */}
                <div aria-label={`File encoding: ${encoding}`}>{encoding}</div>

                {/* Language */}
                <div className="flex items-center space-x-1" aria-label={`Language: ${displayLanguage}`}>
                    <FileCode size={12} aria-hidden="true" />
                    <span>{displayLanguage}</span>
                </div>
            </div>
        </footer>
    );
};

export default StatusBar;
