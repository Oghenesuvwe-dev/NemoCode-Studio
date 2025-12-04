import React, { useState } from 'react';
import {
    Github,
    Cloud,
    Box,
    Trello,
    FileText,
    Search,
    Settings,
    Play,
    Pause,
    Square,
    Activity,
    Terminal,
    Cpu,
    MessageSquare,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';

// Mock Data for Agents
const AGENTS = [
    { id: 1, name: 'Review Agent', status: 'idle', color: 'bg-green-500' },
    { id: 2, name: 'DevOps Agent', status: 'working', color: 'bg-yellow-500' },
    { id: 3, name: 'Coder Agent', status: 'error', color: 'bg-red-500' },
];

const DashboardMockup = () => {
    const [activeTab, setActiveTab] = useState('editor');

    return (
        <div className="flex h-screen w-full bg-[#0d1117] text-gray-300 font-sans overflow-hidden">

            {/* 1. Far Left Activity Bar (DevOps Strip) */}
            <div className="w-16 flex flex-col items-center py-4 bg-[#161b22] border-r border-gray-800 z-20">
                <div className="space-y-6 mb-auto">
                    <SidebarIcon icon={<FileText size={24} />} label="Explorer" active />
                    <SidebarIcon icon={<Search size={24} />} label="Search" />

                    {/* Divider */}
                    <div className="w-8 h-[1px] bg-gray-700 mx-auto my-2" />

                    {/* DevOps Tools */}
                    <SidebarIcon icon={<Github size={24} />} label="GitHub" color="text-purple-400" />
                    <SidebarIcon icon={<Cloud size={24} />} label="AWS" color="text-orange-400" />
                    <SidebarIcon icon={<Box size={24} />} label="Docker" color="text-blue-400" />
                    <SidebarIcon icon={<Trello size={24} />} label="Jira" color="text-blue-300" />
                </div>
                <div className="mt-auto space-y-6">
                    <SidebarIcon icon={<Settings size={24} />} label="Settings" />
                </div>
            </div>

            {/* 2. Left Sidebar (File Explorer) */}
            <div className="w-64 bg-[#0d1117] border-r border-gray-800 flex flex-col">
                <div className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</div>
                <div className="flex-1 overflow-y-auto px-2">
                    <FileItem name="src" isFolder isOpen />
                    <div className="pl-4">
                        <FileItem name="components" isFolder />
                        <FileItem name="App.tsx" active />
                        <FileItem name="main.tsx" />
                        <FileItem name="index.css" />
                    </div>
                    <FileItem name="package.json" />
                    <FileItem name="tsconfig.json" />
                </div>
            </div>

            {/* 3. Center Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">

                {/* Top: Editor Tabs */}
                <div className="flex bg-[#161b22] border-b border-gray-800">
                    <Tab name="App.tsx" active />
                    <Tab name="main.tsx" />
                    <Tab name="index.css" />
                </div>

                {/* Middle: Code Editor */}
                <div className="flex-1 p-4 font-mono text-sm overflow-auto relative">
                    <div className="absolute inset-0 p-4">
                        <span className="text-pink-400">import</span> React <span className="text-pink-400">from</span> <span className="text-green-400">'react'</span>;<br />
                        <br />
                        <span className="text-blue-400">function</span> <span className="text-yellow-300">App</span>() {'{'}<br />
                        &nbsp;&nbsp;<span className="text-pink-400">return</span> (<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-300">div</span> <span className="text-purple-300">className</span>=<span className="text-green-400">"App"</span>&gt;<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-blue-300">h1</span>&gt;Hello Nemo Code&lt;/<span className="text-blue-300">h1</span>&gt;<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-blue-300">div</span>&gt;<br />
                        &nbsp;&nbsp;);<br />
                        {'}'}<br />
                        <br />
                        <span className="text-pink-400">export default</span> App;
                    </div>
                </div>

                {/* Bottom: Agent Manager Panel */}
                <div className="h-48 bg-[#161b22] border-t border-gray-800 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#21262d] border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <Cpu size={16} className="text-blue-400" />
                            <span className="text-sm font-semibold text-gray-200">Agent Manager</span>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-1 hover:bg-gray-700 rounded"><MoreHorizontal size={16} /></button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 flex space-x-4 overflow-x-auto">
                        {AGENTS.map(agent => (
                            <div key={agent.id} className="w-64 bg-[#0d1117] border border-gray-700 rounded-lg p-3 flex flex-col shadow-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-2 h-2 rounded-full ${agent.color} animate-pulse`} />
                                        <span className="font-medium text-sm">{agent.name}</span>
                                    </div>
                                    <Activity size={14} className="text-gray-500" />
                                </div>
                                <div className="flex-1 bg-black/20 rounded mb-2 p-2 font-mono text-xs text-gray-500 overflow-hidden">
                                    {agent.status === 'working' ? '> Analyzing dependencies...\n> Checking security policies...' : '> Waiting for changes...'}
                                </div>
                                <div className="flex space-x-2 mt-auto">
                                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-xs py-1 rounded border border-gray-600">Logs</button>
                                    <button className="p-1 bg-gray-800 hover:bg-gray-700 rounded border border-gray-600"><Pause size={12} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Right Sidebar (AI Chat) */}
            <div className="w-80 bg-[#161b22] border-l border-gray-800 flex flex-col">
                {/* Model Selector */}
                <div className="p-3 border-b border-gray-800">
                    <button className="w-full bg-[#21262d] hover:bg-[#30363d] text-left px-3 py-2 rounded border border-gray-700 flex justify-between items-center text-sm">
                        <span className="font-medium text-blue-400">Llama 3.1 (Local)</span>
                        <ChevronDown size={14} />
                    </button>
                </div>

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <ChatMessage role="user" text="Can you review the auth logic in App.tsx?" />
                    <ChatMessage role="ai" text="I'm checking App.tsx now. It looks like you're using a basic JWT flow. I recommend adding token refresh logic." />
                    <div className="flex items-center space-x-2 text-xs text-gray-500 italic">
                        <Terminal size={12} />
                        <span>Running security scan...</span>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-800">
                    <div className="relative">
                        <textarea
                            className="w-full bg-[#0d1117] border border-gray-700 rounded-lg p-3 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none h-24"
                            placeholder="Ask Nemo..."
                        />
                        <button className="absolute bottom-2 right-2 p-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white">
                            <MessageSquare size={16} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

// --- Helper Components ---

const SidebarIcon = ({ icon, label, active, color = "text-gray-400" }) => (
    <div className={`group relative flex justify-center w-full cursor-pointer ${active ? 'border-l-2 border-blue-500' : ''}`}>
        <div className={`p-2 rounded-lg transition-colors ${active ? 'text-blue-400' : color} hover:bg-gray-800`}>
            {icon}
        </div>
        {/* Tooltip */}
        <div className="absolute left-14 top-2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-gray-700">
            {label}
        </div>
    </div>
);

const FileItem = ({ name, isFolder, isOpen, active }) => (
    <div className={`flex items-center px-2 py-1 cursor-pointer text-sm ${active ? 'bg-[#21262d] text-white' : 'text-gray-400 hover:bg-[#161b22] hover:text-gray-300'}`}>
        <span className="mr-1.5 opacity-70">{isFolder ? (isOpen ? '📂' : '📁') : '📄'}</span>
        <span>{name}</span>
    </div>
);

const Tab = ({ name, active }) => (
    <div className={`px-4 py-2 text-sm cursor-pointer border-t-2 ${active ? 'bg-[#0d1117] text-white border-blue-500' : 'bg-[#21262d] text-gray-500 border-transparent hover:bg-[#161b22]'}`}>
        {name}
    </div>
);

const ChatMessage = ({ role, text }) => (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[85%] rounded-lg p-3 text-sm ${role === 'user' ? 'bg-blue-600 text-white' : 'bg-[#21262d] text-gray-300 border border-gray-700'}`}>
            {text}
        </div>
    </div>
);

export default DashboardMockup;
