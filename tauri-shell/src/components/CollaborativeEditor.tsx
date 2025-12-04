import React, { useEffect, useState, useRef } from 'react';

interface CollaborativeEditorProps {
    docId: string;
    backendUrl: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ docId, backendUrl }) => {
    const [content, setContent] = useState("// Start coding together...\n");
    const [status, setStatus] = useState("Disconnected");
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to WebSocket
        const wsUrl = backendUrl.replace("http", "ws") + `/collab/${docId}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("Connected");
            console.log("Connected to Collab Session");
        };

        ws.onmessage = (event) => {
            // In a real app, this would be a Yjs update.
            // Here, we just blindly replace content for the demo (Last Write Wins).
            const newContent = event.data;
            setContent(newContent);
        };

        ws.onclose = () => setStatus("Disconnected");

        return () => {
            ws.close();
        };
    }, [docId, backendUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setContent(newText);
        // Broadcast change
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(newText);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-gray-300 font-mono text-sm border border-gray-700 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-[#252526] border-b border-gray-700">
                <span className="font-bold text-gray-400">Collaborative Editor ({docId})</span>
                <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-500">{status}</span>
                </div>
            </div>
            <textarea
                className="flex-1 bg-[#1e1e1e] p-4 outline-none resize-none text-gray-300 font-mono"
                value={content}
                onChange={handleChange}
                spellCheck={false}
            />
        </div>
    );
};

export default CollaborativeEditor;
