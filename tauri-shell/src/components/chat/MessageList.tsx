import React from 'react';
import { MessageSquare, Volume2, VolumeX } from 'lucide-react';

interface Message {
    sender: 'user' | 'ai';
    text: string;
    thoughts?: string[];
}

interface MessageListProps {
    messages: Message[];
    isMuted: boolean;
    onToggleMute: () => void;
    onSpeak: (text: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isMuted, onSpeak }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare size={48} className="mb-4 opacity-30" />
                    <p className="text-sm">Start a conversation...</p>
                </div>
            ) : (
                messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-[#21262d] text-gray-200 border border-gray-700'
                                }`}
                        >
                            {msg.thoughts && msg.thoughts.length > 0 && (
                                <details className="mb-2 text-xs opacity-70">
                                    <summary className="cursor-pointer hover:opacity-100">
                                        💭 Thoughts ({msg.thoughts.length})
                                    </summary>
                                    <div className="mt-2 space-y-1 pl-2 border-l-2 border-gray-600">
                                        {msg.thoughts.map((thought, i) => (
                                            <div key={i} className="text-gray-400">
                                                {thought}
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )}
                            <div className="whitespace-pre-wrap break-words text-sm">
                                {msg.text}
                            </div>
                            {msg.sender === 'ai' && msg.text && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <button
                                        onClick={() => onSpeak(msg.text)}
                                        className="text-xs opacity-50 hover:opacity-100 transition-opacity"
                                        title="Read aloud"
                                    >
                                        {isMuted ? (
                                            <VolumeX size={14} />
                                        ) : (
                                            <Volume2 size={14} />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MessageList;
