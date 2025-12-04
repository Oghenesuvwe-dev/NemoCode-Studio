import React, { useEffect, useState, useRef } from 'react';
import { Brain, ChevronDown, ChevronUp } from 'lucide-react';

interface ThoughtWindowProps {
    thoughts: string[];
    isThinking: boolean;
}

const ThoughtWindow: React.FC<ThoughtWindowProps> = ({ thoughts, isThinking }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [displayedThoughts, setDisplayedThoughts] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Effect to simulate typing/streaming of thoughts
    useEffect(() => {
        setDisplayedThoughts(thoughts);
    }, [thoughts]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [displayedThoughts, isOpen]);

    if (thoughts.length === 0 && !isThinking) return null;

    return (
        <div className="border-b border-gray-800 bg-[#0d1117]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 text-xs text-green-400 bg-[#161b22] hover:bg-[#21262d] transition-colors"
            >
                <div className="flex items-center space-x-2">
                    <Brain size={14} className={isThinking ? "animate-pulse" : ""} />
                    <span className="font-mono uppercase tracking-wider">
                        {isThinking ? "Neural Process Active..." : "Neural Process Log"}
                    </span>
                </div>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {isOpen && (
                <div
                    ref={scrollRef}
                    className="p-3 max-h-40 overflow-y-auto font-mono text-xs space-y-1 bg-black/50 inner-shadow"
                >
                    {displayedThoughts.map((thought, i) => (
                        <div key={i} className="flex items-start space-x-2 text-green-500/80">
                            <span className="opacity-50 select-none">{`>`}</span>
                            <span className="typing-effect">{thought}</span>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex items-center space-x-1 text-green-500/50 animate-pulse">
                            <span>_</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ThoughtWindow;
