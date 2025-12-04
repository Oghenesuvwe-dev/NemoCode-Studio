import {
    Folders,
    ChatsCircle,
    TerminalWindow,
    Brain
} from 'phosphor-react';
import { useAppStore } from '../stores/useAppStore';

const TitleBar: React.FC = () => {
    const {
        showExplorer, showChat, showTerminal, showAgents,
        toggleExplorer, toggleChat, toggleTerminal, toggleAgents
    } = useAppStore();

    const handleDeploy = async () => {
        try {
            const res = await fetch('http://localhost:8000/deploy/detect');
            const data = await res.json();
            const confirmed = confirm(`Detected Framework: ${data.framework}\nSuggested Provider: ${data.suggested_provider}\n\nDo you want to run: ${data.command}?`);
            if (confirmed) {
                // In a real app, we would send this to the Task Queue
                alert(`🚀 Deploying to ${data.suggested_provider}...\n(Command: ${data.command})`);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to detect deployment configuration.");
        }
    };

    return (
        <div
            className="h-10 bg-[#0d1117] flex items-center justify-between select-none border-b border-gray-800 relative"
            style={{ paddingLeft: '80px', paddingRight: '16px' } as any}
        >
            {/* Left: Branding */}
            <div className="flex items-center space-x-2 text-gray-400">
                <span className="text-xs font-semibold tracking-wide">NemoCode Studio</span>
                <TerminalWindow size={16} weight="duotone" className="text-blue-500" />
            </div>

            {/* Center: Deploy Button */}
            <div className="flex-1 flex justify-center items-center">
                <button
                    className="bg-green-700 hover:bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center space-x-1 transition-colors"
                    onClick={handleDeploy}
                >
                    <span>🚀 DEPLOY</span>
                </button>
            </div>

            {/* Right: View Toggle Buttons */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={toggleExplorer}
                    className={`p-1.5 transition-colors ${showExplorer
                            ? 'text-blue-400'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    title="Toggle Sidebar (Cmd+B)"
                >
                    <Folders size={18} weight="duotone" />
                </button>
                <button
                    onClick={toggleChat}
                    className={`p-1.5 transition-colors ${showChat
                            ? 'text-blue-400'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    title="Toggle Chat (Cmd+Shift+C)"
                >
                    <ChatsCircle size={18} weight="duotone" />
                </button>
                <button
                    onClick={toggleTerminal}
                    className={`p-1.5 transition-colors ${showTerminal
                            ? 'text-blue-400'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    title="Toggle Terminal (Cmd+J)"
                >
                    <TerminalWindow size={18} weight="duotone" />
                </button>
                <button
                    onClick={toggleAgents}
                    className={`p-1.5 transition-colors ${showAgents
                            ? 'text-blue-400'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                    title="Toggle Agents (Cmd+Shift+A)"
                >
                    <Brain size={18} weight="duotone" />
                </button>
            </div>
        </div>
    );
};

export default TitleBar;
