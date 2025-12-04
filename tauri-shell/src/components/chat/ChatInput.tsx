import React, { useState } from 'react';
import { Send, Paperclip, Mic, Square, Plus } from 'lucide-react';

interface ChatInputProps {
    prompt: string;
    onPromptChange: (value: string) => void;
    onSend: () => void;
    onAttachFile: () => void;
    onNewChat: () => void;
    loading: boolean;
    onStop: () => void;
    isListening: boolean;
    onToggleListening: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
    prompt,
    onPromptChange,
    onSend,
    onAttachFile,
    onNewChat,
    loading,
    onStop,
    isListening,
    onToggleListening
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!loading && prompt.trim()) {
                onSend();
            }
        }
    };

    return (
        <div className="border-t border-gray-800 p-4 bg-[#161b22]">
            <div
                className={`flex items-end space-x-2 bg-[#0d1117] rounded-lg border transition-colors ${isFocused ? 'border-blue-500' : 'border-gray-700'
                    }`}
            >
                {/* Attachment Button */}
                <button
                    onClick={onAttachFile}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors m-1"
                    title="Attach file"
                >
                    <Paperclip size={18} />
                </button>

                {/* Text Input */}
                <textarea
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent text-gray-200 placeholder-gray-500 outline-none resize-none py-3 px-2 max-h-32 min-h-[2.5rem]"
                    rows={1}
                    style={{
                        height: 'auto',
                        minHeight: '2.5rem',
                        maxHeight: '8rem'
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
                    }}
                />

                {/* Voice Input Button */}
                <button
                    onClick={onToggleListening}
                    className={`p-2 rounded-lg transition-colors m-1 ${isListening
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                    title={isListening ? 'Stop listening' : 'Voice input'}
                >
                    <Mic size={18} />
                </button>

                {/* Send/Stop Button */}
                {loading ? (
                    <button
                        onClick={onStop}
                        className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors m-1"
                        title="Stop generation"
                    >
                        <Square size={18} fill="currentColor" />
                    </button>
                ) : (
                    <button
                        onClick={onSend}
                        disabled={!prompt.trim()}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed m-1"
                        title="Send message"
                    >
                        <Send size={18} />
                    </button>
                )}
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={onNewChat}
                    className="flex items-center space-x-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors"
                >
                    <Plus size={14} />
                    <span>New Chat</span>
                </button>

                <div className="text-xs text-gray-500">
                    {isListening && <span className="text-red-400">● Listening...</span>}
                    {loading && <span className="text-blue-400">● Generating...</span>}
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
