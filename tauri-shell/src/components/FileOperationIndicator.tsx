import React from 'react';
import { FileOperation } from '../hooks/useFileOperation';
import ProgressBar from './ProgressBar';
import { FloppyDisk, FolderOpen, Trash, PencilSimple, FilePlus, CheckCircle, XCircle } from 'phosphor-react';

interface FileOperationIndicatorProps {
  operations: FileOperation[];
  onClose?: (id: string) => void;
}

const FileOperationIndicator: React.FC<FileOperationIndicatorProps> = ({
  operations,
  onClose
}) => {
  if (operations.length === 0) return null;

  const getIcon = (type: FileOperation['type']) => {
    switch (type) {
      case 'save':
        return <FloppyDisk size={14} />;
      case 'load':
        return <FolderOpen size={14} />;
      case 'delete':
        return <Trash size={14} />;
      case 'rename':
        return <PencilSimple size={14} />;
      case 'create':
        return <FilePlus size={14} />;
    }
  };

  const getStatusIcon = (status: FileOperation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'error':
        return <XCircle size={14} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getActionText = (type: FileOperation['type']) => {
    switch (type) {
      case 'save':
        return 'Saving';
      case 'load':
        return 'Loading';
      case 'delete':
        return 'Deleting';
      case 'rename':
        return 'Renaming';
      case 'create':
        return 'Creating';
    }
  };

  return (
    <div className="fixed bottom-8 right-4 z-40 space-y-2 max-w-sm">
      {operations.map(op => (
        <div
          key={op.id}
          className="bg-[#161b22] border border-gray-700 rounded-lg shadow-xl p-3 animate-slide-up"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-gray-300">
              {getIcon(op.type)}
              <span className="text-sm font-medium">
                {getActionText(op.type)} {op.fileName.split('/').pop()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(op.status)}
              {onClose && (
                <button
                  onClick={() => onClose(op.id)}
                  className="text-gray-500 hover:text-gray-300"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {op.status === 'in-progress' && (
            <ProgressBar
              progress={op.progress}
              size="sm"
              color="blue"
              showPercentage={false}
            />
          )}

          {op.status === 'error' && op.error && (
            <p className="text-xs text-red-400 mt-1">{op.error}</p>
          )}

          {op.status === 'completed' && (
            <p className="text-xs text-green-400 mt-1">Completed</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileOperationIndicator;
