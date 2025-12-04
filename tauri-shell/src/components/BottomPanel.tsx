import React, { useState } from 'react';
import { Terminal, ListBullets, Bug, Warning, Globe, ArrowsOut, ArrowsIn } from 'phosphor-react';
import TerminalComponent from './TerminalComponent';
import { useAppStore } from '../stores/useAppStore';

type PanelTab = 'terminal' | 'output' | 'debug' | 'problems' | 'ports';

const BottomPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<PanelTab>('terminal');
    const { isTerminalMaximized, toggleTerminalMaximize } = useAppStore();

    const tabs = [
        { id: 'terminal' as PanelTab, label: 'Terminal', icon: Terminal },
        { id: 'output' as PanelTab, label: 'Output', icon: ListBullets },
        { id: 'debug' as PanelTab, label: 'Debug Console', icon: Bug },
        { id: 'problems' as PanelTab, label: 'Problems', icon: Warning },
        { id: 'ports' as PanelTab, label: 'Ports', icon: Globe },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0d1117] border-t border-gray-800">
            {/* Panel Tabs */}
            <div className="flex items-center justify-between h-9 bg-[#161b22] border-b border-gray-800 px-2">
                <div className="flex items-center">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-white border-b-2 border-blue-500'
                                    : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                <Icon size={14} weight="regular" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
                {/* Maximize/Restore Button */}
                <button
                    onClick={toggleTerminalMaximize}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    title={isTerminalMaximized ? "Restore Panel" : "Maximize Panel"}
                >
                    {isTerminalMaximized ? <ArrowsIn size={14} /> : <ArrowsOut size={14} />}
                </button>
            </div>

            <div className="flex-1 overflow-hidden">
                {activeTab === 'terminal' && (
                    <TerminalComponent />
                )}
                {activeTab === 'output' && (
                    <div className="p-4 text-gray-400 text-sm">
                        <p>Output panel - Coming soon</p>
                    </div>
                )}
                {activeTab === 'debug' && (
                    <div className="p-4 text-gray-400 text-sm">
                        <p>Debug console - Coming soon</p>
                    </div>
                )}
                {activeTab === 'problems' && (
                    <div className="p-4 text-gray-400 text-sm">
                        <p>Problems panel - Coming soon</p>
                    </div>
                )}
                {activeTab === 'ports' && (
                    <div className="p-4 text-gray-400 text-sm">
                        <p>Ports panel - Coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BottomPanel;
