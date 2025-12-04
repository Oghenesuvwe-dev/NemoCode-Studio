import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowCounterClockwise as RotateCcw, X } from 'phosphor-react';

interface BrowserComponentProps {
    initialUrl?: string;
    onClose: () => void;
}

const BrowserComponent: React.FC<BrowserComponentProps> = ({ initialUrl = 'https://www.google.com', onClose }) => {
    const [url, setUrl] = useState(initialUrl);
    const [inputUrl, setInputUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);

    // Sync with prop changes (e.g. when Agent opens a new URL)
    React.useEffect(() => {
        setUrl(initialUrl);
        setInputUrl(initialUrl);
    }, [initialUrl]);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let target = inputUrl;
        if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        setUrl(target);
    };

    return (
        <div className="flex flex-col h-full bg-white text-black">
            {/* Browser Toolbar */}
            <div className="flex items-center p-2 bg-gray-100 border-b border-gray-300 space-x-2">
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                    <ArrowLeft size={16} />
                </button>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                    <ArrowRight size={16} />
                </button>
                <button
                    className="p-1 hover:bg-gray-200 rounded text-gray-600"
                    onClick={() => setUrl(url)} // Reload
                >
                    <RotateCcw size={16} />
                </button>

                {/* Address Bar */}
                <form onSubmit={handleNavigate} className="flex-1">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="w-full px-3 py-1 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </form>

                <button onClick={onClose} className="p-1 hover:bg-red-100 hover:text-red-500 rounded text-gray-600">
                    <X size={16} />
                </button>
            </div>

            {/* Web View (Iframe for MVP) */}
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                )}
                <iframe
                    src={url}
                    className="w-full h-full border-none"
                    title="Built-in Browser"
                    onLoad={() => setIsLoading(false)}
                    onError={() => setIsLoading(false)}
                />
            </div>
        </div>
    );
};

export default BrowserComponent;
