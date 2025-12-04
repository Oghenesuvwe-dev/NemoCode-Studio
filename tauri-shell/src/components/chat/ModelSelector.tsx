import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ModelSelectorProps {
    models: string[];
    selectedModel: string;
    onModelChange: (model: string) => void;
    disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
    models,
    selectedModel,
    onModelChange,
    disabled = false
}) => {
    return (
        <div className="relative">
            <select
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                disabled={disabled}
                className="appearance-none bg-[#21262d] text-gray-300 text-xs px-3 py-1.5 pr-8 rounded border border-gray-700 hover:border-gray-600 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {models.length === 0 ? (
                    <option>Loading models...</option>
                ) : (
                    models.map((model) => (
                        <option key={model} value={model}>
                            {model}
                        </option>
                    ))
                )}
            </select>
            <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
        </div>
    );
};

export default ModelSelector;
