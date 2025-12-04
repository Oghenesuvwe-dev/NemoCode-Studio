import React from 'react';

interface SkeletonLoaderProps {
    type?: 'text' | 'file-tree' | 'search-result' | 'chat-message';
    count?: number;
    className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
    type = 'text', 
    count = 1,
    className = '' 
}) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'file-tree':
                return (
                    <div className="space-y-2 p-2">
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-2 animate-pulse">
                                <div className="w-4 h-4 bg-gray-700 rounded" />
                                <div className="h-4 bg-gray-700 rounded flex-1" style={{ width: `${60 + Math.random() * 30}%` }} />
                            </div>
                        ))}
                    </div>
                );
            
            case 'search-result':
                return (
                    <div className="space-y-3 p-3">
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-4 h-4 bg-gray-700 rounded" />
                                    <div className="h-4 bg-gray-700 rounded w-48" />
                                    <div className="h-3 bg-gray-700 rounded w-8 ml-auto" />
                                </div>
                                <div className="ml-6 space-y-1.5">
                                    <div className="h-3 bg-gray-700/50 rounded w-full" />
                                    <div className="h-3 bg-gray-700/50 rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            
            case 'chat-message':
                return (
                    <div className="space-y-4 p-4">
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-6 h-6 bg-gray-700 rounded-full" />
                                    <div className="h-4 bg-gray-700 rounded w-24" />
                                </div>
                                <div className="ml-8 space-y-2">
                                    <div className="h-3 bg-gray-700/50 rounded w-full" />
                                    <div className="h-3 bg-gray-700/50 rounded w-11/12" />
                                    <div className="h-3 bg-gray-700/50 rounded w-4/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            
            case 'text':
            default:
                return (
                    <div className="space-y-2 animate-pulse">
                        {Array.from({ length: count }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-700 rounded" style={{ width: `${70 + Math.random() * 25}%` }} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className={className}>
            {renderSkeleton()}
        </div>
    );
};

export default SkeletonLoader;
