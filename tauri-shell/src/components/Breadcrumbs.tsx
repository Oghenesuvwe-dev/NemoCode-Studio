import React from 'react';
import { CaretRight, Folder, File } from 'phosphor-react';

interface BreadcrumbsProps {
    filePath: string | null;
    workspacePath: string | null;
    onNavigate?: (path: string) => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    filePath,
    workspacePath,
    onNavigate
}) => {
    if (!filePath) return null;

    // Get relative path from workspace
    let relativePath = filePath;
    if (workspacePath && filePath.startsWith(workspacePath)) {
        relativePath = filePath.slice(workspacePath.length + 1);
    }

    const parts = relativePath.split('/').filter(Boolean);
    const fileName = parts.pop() || '';

    return (
        <div className="flex items-center px-3 py-1.5 bg-[#161b22] border-b border-gray-800 text-xs text-gray-400 overflow-x-auto no-scrollbar">
            {/* Workspace root */}
            {workspacePath && (
                <>
                    <button
                        onClick={() => onNavigate?.(workspacePath)}
                        className="flex items-center hover:text-gray-200 transition-colors"
                    >
                        <Folder size={12} className="mr-1" />
                        <span>{workspacePath.split('/').pop()}</span>
                    </button>
                    {parts.length > 0 && <CaretRight size={10} className="mx-1 text-gray-600" />}
                </>
            )}

            {/* Path segments */}
            {parts.map((part, index) => {
                const pathUpToHere = workspacePath 
                    ? `${workspacePath}/${parts.slice(0, index + 1).join('/')}`
                    : parts.slice(0, index + 1).join('/');

                return (
                    <React.Fragment key={index}>
                        <button
                            onClick={() => onNavigate?.(pathUpToHere)}
                            className="hover:text-gray-200 transition-colors"
                        >
                            {part}
                        </button>
                        <CaretRight size={10} className="mx-1 text-gray-600" />
                    </React.Fragment>
                );
            })}

            {/* Current file */}
            <span className="flex items-center text-gray-200">
                <File size={12} className="mr-1" />
                {fileName}
            </span>
        </div>
    );
};

export default Breadcrumbs;
