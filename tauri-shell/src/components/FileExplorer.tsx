import React, { useState, useEffect } from 'react';
import { readDir, DirEntry, remove, rename as renameFile } from '@tauri-apps/plugin-fs';
import { CaretRight as ChevronRight, CaretDown as ChevronDown, File, Folder, FolderOpen, FilePlus, FolderPlus, ArrowClockwise, Check, X, Trash, PencilSimple, Copy, Eye, Play, ChatCircle } from 'phosphor-react';
import { open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, mkdir } from '@tauri-apps/plugin-fs';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import SkeletonLoader from './SkeletonLoader';
import { useAppStore } from '../stores/useAppStore';

const FileExplorer: React.FC = () => {
    const { workspacePath, setWorkspacePath, openFile } = useAppStore();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isCreating, setIsCreating] = useState<'file' | 'folder' | null>(null);
    const [newItemName, setNewItemName] = useState("");

    const onFileClick = (path: string) => {
        openFile(path);
    };

    const onWorkspaceChange = (path: string) => {
        setWorkspacePath(path);
    };


    // Handle moving files between folders
    const handleMoveFile = async (sourcePath: string, targetDir: string) => {
        const fileName = sourcePath.split('/').pop();
        if (!fileName) return;

        const newPath = `${targetDir}/${fileName}`;

        // Check if target already exists
        if (sourcePath === newPath) return;

        try {
            await renameFile(sourcePath, newPath);
            setRefreshTrigger(prev => prev + 1);
        } catch (err) {
            console.error('Move failed:', err);
            alert(`Failed to move ${fileName}`);
        }
    };

    const handleOpenFolder = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
                title: 'Select Workspace Folder'
            });

            if (selected && typeof selected === 'string') {
                onWorkspaceChange?.(selected);
            }
        } catch (error) {
            console.error('Failed to open folder:', error);
        }
    };

    const handleOpenFile = async () => {
        try {
            const selected = await open({
                multiple: false,
                title: 'Open File',
                filters: [{
                    name: 'All Files',
                    extensions: ['*']
                }]
            });

            if (selected && typeof selected === 'string') {
                onFileClick?.(selected);
            }
        } catch (error) {
            console.error('Failed to open file:', error);
        }
    };

    const handleCreate = async () => {
        if (!workspacePath || !newItemName) return;
        const fullPath = `${workspacePath}/${newItemName}`; // Note: Simple path join, might need OS specific handling

        try {
            if (isCreating === 'file') {
                await writeTextFile(fullPath, "");
            } else if (isCreating === 'folder') {
                await mkdir(fullPath);
            }
            setRefreshTrigger(prev => prev + 1);
            setIsCreating(null);
            setNewItemName("");
        } catch (err) {
            console.error("Failed to create item:", err);
            alert("Failed to create item");
        }
    };

    if (!workspacePath) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                <Folder size={48} className="mb-2 opacity-20" />
                <p className="text-sm">No workspace open</p>
                <p className="text-xs mt-1 mb-4">Open a folder to start</p>
                <button
                    onClick={handleOpenFolder}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md transition-colors flex items-center space-x-2"
                >
                    <FolderOpen size={16} />
                    <span>Open Folder</span>
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-2 py-1 bg-[#161b22] border-b border-gray-800">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Explorer</span>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={handleOpenFile}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        title="Open File"
                    >
                        <File size={14} />
                    </button>
                    <button
                        onClick={handleOpenFolder}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        title="Open Folder"
                    >
                        <FolderOpen size={14} />
                    </button>
                    <button
                        onClick={() => setIsCreating('file')}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        title="New File"
                    >
                        <FilePlus size={14} />
                    </button>
                    <button
                        onClick={() => setIsCreating('folder')}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        title="New Folder"
                    >
                        <FolderPlus size={14} />
                    </button>
                    <button
                        onClick={() => setRefreshTrigger(prev => prev + 1)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                        title="Refresh"
                    >
                        <ArrowClockwise size={14} />
                    </button>
                </div>
            </div>

            {/* Creation Input */}
            {isCreating && (
                <div className="px-2 py-1 flex items-center space-x-1 bg-[#1c2128] border-b border-gray-700">
                    {isCreating === 'file' ? <File size={14} className="text-gray-400" /> : <Folder size={14} className="text-blue-400" />}
                    <input
                        autoFocus
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreate();
                            if (e.key === 'Escape') {
                                setIsCreating(null);
                                setNewItemName("");
                            }
                        }}
                        placeholder={`Name...`}
                        className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                    />
                    <button onClick={handleCreate} className="text-green-500 hover:text-green-400"><Check size={12} /></button>
                    <button onClick={() => { setIsCreating(null); setNewItemName(""); }} className="text-red-500 hover:text-red-400"><X size={12} /></button>
                </div>
            )}

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                <FileTreeItem
                    key={refreshTrigger}
                    name={workspacePath.split(/[/\\]/).pop() || "Workspace"}
                    path={workspacePath}
                    isDirectory={true}
                    level={0}
                    defaultOpen={true}
                    onFileClick={onFileClick}
                    onMoveFile={handleMoveFile}
                />
            </div>
        </div>
    );
};

interface FileTreeItemProps {
    name: string;
    path: string;
    isDirectory: boolean;
    level: number;
    defaultOpen?: boolean;
    onFileClick?: (path: string) => void;
    onMoveFile?: (sourcePath: string, targetDir: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
    name,
    path,
    isDirectory,
    level,
    defaultOpen = false,
    onFileClick,
    onMoveFile
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [children, setChildren] = useState<DirEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(name);
    const [isDragOver, setIsDragOver] = useState(false);

    // Drag handlers
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('text/plain', path);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        if (!isDirectory) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (!isDirectory) return;

        const sourcePath = e.dataTransfer.getData('text/plain');
        if (!sourcePath || sourcePath === path) return;

        // Don't allow dropping into itself or its children
        if (path.startsWith(sourcePath + '/')) return;

        onMoveFile?.(sourcePath, path);
    };

    const toggleOpen = async () => {
        if (!isDirectory) {
            onFileClick?.(path);
            return;
        }

        const newOpenState = !isOpen;
        setIsOpen(newOpenState);

        if (newOpenState && children.length === 0 && !loading) {
            loadChildren();
        }
    };

    const loadChildren = async () => {
        setLoading(true);
        setError(null);
        try {
            // readDir returns Promise<DirEntry[]>
            const entries = await readDir(path);

            // Sort: Directories first, then files. Alphabetical within groups.
            const sorted = entries.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });

            setChildren(sorted);
        } catch (err) {
            console.error(`Failed to read dir ${path}:`, err);
            setError("Failed to load");
        } finally {
            setLoading(false);
        }
    };

    // Load children initially if defaultOpen is true
    useEffect(() => {
        if (defaultOpen && isDirectory) {
            loadChildren();
        }
    }, []);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleRename = async () => {
        if (newName === name || !newName) return;
        try {
            const dir = path.substring(0, path.lastIndexOf('/'));
            await renameFile(path, `${dir}/${newName}`);
            setIsRenaming(false);
            window.location.reload(); // Simple refresh
        } catch (err) {
            console.error('Rename failed:', err);
            alert('Failed to rename');
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Delete ${name}?`)) return;
        try {
            await remove(path, { recursive: isDirectory });
            window.location.reload();
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete');
        }
    };

    const handleCopyPath = async () => {
        try {
            await writeText(path);
            setContextMenu(null);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const paddingLeft = `${level * 12}px`;

    return (
        <div>
            {contextMenu && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
                    <div
                        className="fixed z-50 bg-[#161b22] border border-gray-700 rounded-md shadow-xl py-1 min-w-[180px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                    >
                        <button onClick={() => { setIsRenaming(true); setContextMenu(null); }} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 flex items-center space-x-2">
                            <PencilSimple size={14} /> <span>Rename</span>
                        </button>
                        <button onClick={handleDelete} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 flex items-center space-x-2 text-red-400">
                            <Trash size={14} /> <span>Delete</span>
                        </button>
                        <div className="h-px bg-gray-700 my-1" />
                        <button onClick={handleCopyPath} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 flex items-center space-x-2">
                            <Copy size={14} /> <span>Copy Path</span>
                        </button>
                        <button onClick={() => { window.open(`file://${path}`); setContextMenu(null); }} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 flex items-center space-x-2">
                            <Eye size={14} /> <span>Reveal in Finder</span>
                        </button>
                        {!isDirectory && (
                            <>
                                <div className="h-px bg-gray-700 my-1" />
                                <button onClick={() => { alert('Add to AI Context: ' + path); setContextMenu(null); }} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 flex items-center space-x-2">
                                    <ChatCircle size={14} /> <span>Add to AI Context</span>
                                </button>
                                <button onClick={() => { alert('Run File: ' + path); setContextMenu(null); }} className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-800 flex items-center space-x-2">
                                    <Play size={14} /> <span>Run File</span>
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
            <div
                className={`flex items-center py-1 px-2 cursor-pointer text-sm hover:bg-[#21262d] rounded ${!isDirectory ? 'text-gray-300' : 'text-gray-200 font-medium'} ${isDragOver ? 'bg-blue-900/30 border border-blue-500 border-dashed' : ''}`}
                style={{ paddingLeft }}
                onClick={toggleOpen}
                onContextMenu={handleContextMenu}
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <span className="mr-1 text-gray-500">
                    {isDirectory ? (
                        isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                        <span className="w-[14px] inline-block" />
                    )}
                </span>

                <span className="mr-2 text-blue-400">
                    {isDirectory ? (
                        isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
                    ) : (
                        <File size={16} className="text-gray-400" />
                    )}
                </span>

                {isRenaming ? (
                    <input
                        autoFocus
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === 'Enter') handleRename();
                            if (e.key === 'Escape') setIsRenaming(false);
                        }}
                        onBlur={handleRename}
                        className="flex-1 bg-[#0d1117] border border-blue-500 rounded px-1 text-xs outline-none"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="truncate">{name}</span>
                )}
            </div>

            {isOpen && isDirectory && (
                <div>
                    {loading && (
                        <div className="pl-8">
                            <SkeletonLoader type="file-tree" count={3} />
                        </div>
                    )}
                    {error && <div className="pl-8 text-xs text-red-500 py-1">{error}</div>}
                    {!loading && !error && children.map((child) => (
                        <FileTreeItem
                            key={child.name}
                            name={child.name}
                            path={`${path}/${child.name}`}
                            isDirectory={child.isDirectory}
                            level={level + 1}
                            onFileClick={onFileClick}
                            onMoveFile={onMoveFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileExplorer;
