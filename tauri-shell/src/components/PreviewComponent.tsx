import React, { useEffect, useRef } from 'react';

interface PreviewComponentProps {
    code: string;
    onClose?: () => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({ code, onClose }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                // Basic HTML template with Tailwind support via CDN for quick styling
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { background-color: #ffffff; color: #000000; }
                        </style>
                    </head>
                    <body>
                        ${code}
                    </body>
                    </html>
                `);
                doc.close();
            }
        }
    }, [code]);

    return (
        <div className="flex flex-col h-full w-full bg-white relative">
            <div className="h-8 bg-gray-100 border-b border-gray-300 flex items-center px-4 justify-between">
                <span className="text-xs font-semibold text-gray-600">Live Preview</span>
                {onClose && (
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        ✕
                    </button>
                )}
            </div>
            <iframe
                ref={iframeRef}
                className="flex-1 w-full h-full border-none"
                title="Preview"
                sandbox="allow-scripts"
            />
        </div>
    );
};

export default PreviewComponent;
