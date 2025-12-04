import React from 'react';
import { Settings, FolderOpen, Users, Download } from 'lucide-react';
import ModelSelector from './ModelSelector';

interface ChatHeaderProps {
    models: string[];
    selectedModel: string;
    onModelChange: (model: string) => void;
    workspacePath: string | null;
    onOpenWorkspace: () => void;
    swarmMode: boolean;
    onToggleSwarmMode: () => void;
    onOpenSettings: () => void;
    onIndexCodebase?: () => void;
    loading: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
    models,
    selectedModel,
    onModelChange,
    workspacePath,
    onOpenWorkspace,
    swarmMode,
    onToggleSwarmMode,
    onOpenSettings,
    onIndexCodebase,
    loading
}) => {
    return (
        <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-[#161b22]">
            <div className="flex items-center space-x-2">
                <h2 className="text-sm font-semibold text-gray-200">AI Assistant</h2>
                <ModelSelector
                    models={models}
                    selectedModel={selectedModel}
                    onModelChange={onModelChange}
                    disabled={loading}
                />
            </div>

            <div className="flex items-center space-x-1">
                {/* Workspace Button */}
                <button
                    onClick={onOpenWorkspace}
                    className={`p-1.5 rounded transition-colors ${workspacePath
                            ? 'text-green-400 hover:bg-gray-800'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                    title={workspacePath || 'Open workspace'}
                >
                    <FolderOpen size={16} />
                </button>

                {/* Index Codebase Button */}
                {workspacePath && onIndexCodebase && (
                    <button
                        onClick={onIndexCodebase}
                        className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                        title="Index codebase for RAG"
                    >
                        <Download size={16} />
                    </button>
                )}

                {/* Swarm Mode Toggle */}
                <button
                    onClick={onToggleSwarmMode}
                    className={`p-1.5 rounded transition-colors ${swarmMode
                            ? 'text-purple-400 bg-purple-900/30'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                    title={swarmMode ? 'Swarm Mode: ON' : 'Swarm Mode: OFF'}
                >
                    <Users size={16} />
                </button>

                {/* Settings Button */}
                <button
                    onClick={onOpenSettings}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
                    title="Settings"
                >
                    <Settings size={16} />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
