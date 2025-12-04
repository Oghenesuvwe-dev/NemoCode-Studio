import React, { useId } from 'react';
import { Warning, X } from 'phosphor-react';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
  showDontAskAgain?: boolean;
  onDontAskAgainChange?: (checked: boolean) => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'warning',
  showDontAskAgain = false,
  onDontAskAgainChange
}) => {
  const [dontAskAgain, setDontAskAgain] = React.useState(false);
  const titleId = useId();
  const descriptionId = useId();
  
  // Focus trap for accessibility
  const dialogRef = useFocusTrap<HTMLDivElement>({
    isActive: isOpen,
    onEscape: onCancel,
    restoreFocus: true,
    autoFocus: true
  });

  if (!isOpen) return null;

  const variantColors = {
    danger: 'bg-red-600 hover:bg-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-500',
    info: 'bg-blue-600 hover:bg-blue-500'
  };

  const iconColors = {
    danger: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={onCancel}
      role="presentation"
    >
      <div 
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="bg-[#161b22] rounded-lg border border-gray-700 w-[400px] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Warning size={20} className={iconColors[variant]} aria-hidden="true" />
            <span id={titleId} className="text-sm font-medium text-gray-200">{title}</span>
          </div>
          <button 
            onClick={onCancel} 
            className="text-gray-400 hover:text-white"
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4">
          <p id={descriptionId} className="text-sm text-gray-300">{message}</p>
          
          {/* Don't ask again checkbox */}
          {showDontAskAgain && (
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="dont-ask-again"
                checked={dontAskAgain}
                onChange={(e) => {
                  setDontAskAgain(e.target.checked);
                  onDontAskAgainChange?.(e.target.checked);
                }}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="dont-ask-again" className="ml-2 text-sm text-gray-400 cursor-pointer">
                Don't ask again
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 px-4 py-3 border-t border-gray-700">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 text-sm text-white rounded transition-colors ${variantColors[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
