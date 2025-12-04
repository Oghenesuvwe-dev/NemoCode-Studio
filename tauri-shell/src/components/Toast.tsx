import React, { useState, createContext, useContext, useCallback } from 'react';
import { X, CheckCircle, WarningCircle, Info, XCircle } from 'phosphor-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, type, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
    const icons = {
        success: <CheckCircle size={20} className="text-green-400" weight="fill" />,
        error: <XCircle size={20} className="text-red-400" weight="fill" />,
        warning: <WarningCircle size={20} className="text-yellow-400" weight="fill" />,
        info: <Info size={20} className="text-blue-400" weight="fill" />
    };

    const bgColors = {
        success: 'bg-green-900/90 border-green-700',
        error: 'bg-red-900/90 border-red-700',
        warning: 'bg-yellow-900/90 border-yellow-700',
        info: 'bg-blue-900/90 border-blue-700'
    };

    return (
        <div className={`flex items-start space-x-3 p-3 rounded-lg border shadow-lg backdrop-blur-sm ${bgColors[toast.type]} animate-slide-in`}>
            {icons[toast.type]}
            <p className="flex-1 text-sm text-gray-200">{toast.message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X size={16} />
            </button>
        </div>
    );
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    .animate-slide-in {
        animation: slide-in 0.3s ease-out;
    }
`;
document.head.appendChild(style);

export default ToastProvider;
