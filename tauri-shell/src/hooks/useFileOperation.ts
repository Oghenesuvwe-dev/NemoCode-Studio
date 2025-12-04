import { useState, useCallback } from 'react';

export interface FileOperation {
  id: string;
  type: 'save' | 'load' | 'delete' | 'rename' | 'create';
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  error?: string;
}

export const useFileOperation = () => {
  const [operations, setOperations] = useState<FileOperation[]>([]);

  const startOperation = useCallback((
    type: FileOperation['type'],
    fileName: string
  ): string => {
    const id = `${type}-${fileName}-${Date.now()}`;
    const operation: FileOperation = {
      id,
      type,
      fileName,
      progress: 0,
      status: 'pending'
    };
    
    setOperations(prev => [...prev, operation]);
    return id;
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setOperations(prev =>
      prev.map(op =>
        op.id === id
          ? { ...op, progress, status: 'in-progress' as const }
          : op
      )
    );
  }, []);

  const completeOperation = useCallback((id: string) => {
    setOperations(prev =>
      prev.map(op =>
        op.id === id
          ? { ...op, progress: 100, status: 'completed' as const }
          : op
      )
    );

    // Remove completed operation after 2 seconds
    setTimeout(() => {
      setOperations(prev => prev.filter(op => op.id !== id));
    }, 2000);
  }, []);

  const failOperation = useCallback((id: string, error: string) => {
    setOperations(prev =>
      prev.map(op =>
        op.id === id
          ? { ...op, status: 'error' as const, error }
          : op
      )
    );

    // Remove failed operation after 5 seconds
    setTimeout(() => {
      setOperations(prev => prev.filter(op => op.id !== id));
    }, 5000);
  }, []);

  const clearOperation = useCallback((id: string) => {
    setOperations(prev => prev.filter(op => op.id !== id));
  }, []);

  return {
    operations,
    startOperation,
    updateProgress,
    completeOperation,
    failOperation,
    clearOperation
  };
};
