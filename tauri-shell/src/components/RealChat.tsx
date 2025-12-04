import React, { useState, useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSettings } from '../contexts/SettingsContext';
import { useAgent } from '../hooks/useAgent';
import { useAppStore } from '../stores/useAppStore';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';

interface Message {
    sender: 'user' | 'ai';
    text: string;
    thoughts?: string[];
}

interface RealChatProps {
    className?: string;
}

const RealChat: React.FC<RealChatProps> = ({ className }) => {
    const { workspacePath, setWorkspacePath } = useAppStore();
    const [prompt, setPrompt] = useState("");
    const [history, setHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState("llama3.2:1b");
    const [isMuted, setIsMuted] = useState(false);
    const [swarmMode, setSwarmMode] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { sendMessage, indexCodebase } = useAgent();
    const { speak, supported: ttsSupported } = useSpeechSynthesis();
    const { isListening, startListening, stopListening, supported: sttSupported } = useSpeechRecognition({
        onResult: (text) => setPrompt(text)
    });
    const { backendUrl } = useSettings();

    // Listen for streaming tokens
    useEffect(() => {
        let isMounted = true;
        let unlistenFn: (() => void) | undefined;

        const setupListener = async () => {
            console.log("Setting up chat-token listener");
            const { listen } = await import('@tauri-apps/api/event');
            const unlisten = await listen<string>('chat-token', (event) => {
                if (!isMounted) return;
                const token = event.payload;
                setHistory(prev => {
                    const lastMsg = prev[prev.length - 1];
                    if (lastMsg && lastMsg.sender === 'ai') {
                        const newHistory = [...prev];
                        newHistory[newHistory.length - 1] = {
                            ...lastMsg,
                            text: lastMsg.text + token
                        };
                        return newHistory;
                    }
                    return prev;
                });
            });

            if (!isMounted) {
                unlisten();
            } else {
                unlistenFn = unlisten;
            }
        };

        setupListener();

        return () => {
            console.log("Cleaning up chat-token listener");
            isMounted = false;
            if (unlistenFn) unlistenFn();
        };
    }, []);

    // Fetch models on mount
    useEffect(() => {
        invoke<string[]>('get_models')
            .then(models => {
                setModels(models);
                if (models.length > 0 && !models.includes(selectedModel)) {
                    setSelectedModel(models[0]);
                }
            })
            .catch(err => console.error("Failed to fetch models:", err));

        // Fetch history
        invoke<Message[]>('get_history')
            .then(data => {
                if (Array.isArray(data)) {
                    setHistory(data);
                }
            })
            .catch(err => console.error("Failed to fetch history:", err));
    }, [selectedModel]);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleSend = async () => {
        if (!prompt.trim()) return;

        const userMsg = prompt;
        setHistory(prev => [...prev, { sender: 'user', text: userMsg }]);
        setPrompt("");
        setLoading(true);

        invoke('log_msg', { msg: `Frontend sending message: ${userMsg.substring(0, 50)}...` }).catch(console.error);

        // Add placeholder for AI response
        setHistory(prev => [...prev, { sender: 'ai', text: '' }]);

        try {
            await sendMessage(userMsg);
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg = typeof error === 'string' ? error : JSON.stringify(error);
            invoke('log_msg', { msg: `Frontend Chat Error: ${errorMsg}` }).catch(console.error);
            setHistory(prev => [...prev, { sender: 'ai', text: `Error: ${error}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async () => {
        try {
            await fetch(`${backendUrl}/stop`, { method: 'POST' });
            setLoading(false);
        } catch (e) {
            console.error("Failed to stop generation", e);
        }
    };

    const handleNewChat = () => {
        setHistory([]);
        setPrompt("");
    };

    const handleOpenWorkspace = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: 'Select Workspace Folder'
            });

            if (selected && typeof selected === 'string') {
                setWorkspacePath(selected);
                invoke('log_msg', { msg: `Workspace set to: ${selected}` }).catch(console.error);
            }
        } catch (err) {
            console.error('Failed to open workspace:', err);
        }
    };

    const handleAttachFile = async () => {
        try {
            const selected = await open({
                multiple: false,
                filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'json', 'ts', 'tsx', 'js', 'jsx', 'py', 'rs'] }]
            });

            if (selected && typeof selected === 'string') {
                const content = await readTextFile(selected);
                setPrompt(prev => `${prev}\n\nFile: ${selected}\n\`\`\`\n${content}\n\`\`\``);
            }
        } catch (err) {
            console.error('Failed to attach file:', err);
        }
    };

    const handleSpeak = (text: string) => {
        if (!isMuted && ttsSupported) {
            speak(text);
        }
    };

    const handleToggleListening = () => {
        if (isListening) {
            stopListening();
        } else if (sttSupported) {
            startListening();
        }
    };

    const handleIndexCodebase = async () => {
        if (workspacePath) {
            try {
                await indexCodebase(workspacePath);
                invoke('log_msg', { msg: 'Codebase indexed successfully' }).catch(console.error);
            } catch (err) {
                console.error('Failed to index codebase:', err);
            }
        }
    };

    return (
        <div className={`flex flex-col h-full bg-[#0d1117] ${className || ''}`}>
            <ChatHeader
                models={models}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                workspacePath={workspacePath}
                onOpenWorkspace={handleOpenWorkspace}
                swarmMode={swarmMode}
                onToggleSwarmMode={() => setSwarmMode(!swarmMode)}
                onOpenSettings={() => setShowSettings(!showSettings)}
                onIndexCodebase={handleIndexCodebase}
                loading={loading}
            />

            <MessageList
                messages={history}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(!isMuted)}
                onSpeak={handleSpeak}
            />

            <div ref={chatEndRef} />

            <ChatInput
                prompt={prompt}
                onPromptChange={setPrompt}
                onSend={handleSend}
                onAttachFile={handleAttachFile}
                onNewChat={handleNewChat}
                loading={loading}
                onStop={handleStop}
                isListening={isListening}
                onToggleListening={handleToggleListening}
            />

            {/* Settings Panel - TODO: Extract to separate component */}
            {showSettings && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#161b22] border border-gray-700 rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Settings</h3>
                        <p className="text-sm text-gray-400">Settings panel coming soon...</p>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealChat;
