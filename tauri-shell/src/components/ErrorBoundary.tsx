import { Component, ErrorInfo, ReactNode } from 'react';
import { Warning, ArrowClockwise } from 'phosphor-react';

interface Props {
    children: ReactNode;
    fallbackTitle?: string;
    onReset?: () => void;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        this.props.onReset?.();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-[#0d1117] p-8">
                    <div className="max-w-2xl w-full bg-[#161b22] border border-red-900/50 rounded-lg p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <Warning size={32} className="text-red-500" />
                            <h2 className="text-xl font-semibold text-red-400">
                                {this.props.fallbackTitle || 'Something went wrong'}
                            </h2>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-300 mb-2">
                                An unexpected error occurred in this component.
                            </p>
                            {this.state.error && (
                                <div className="bg-[#0d1117] border border-gray-800 rounded p-3 mb-3">
                                    <p className="text-sm font-mono text-red-400">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {import.meta.env.DEV && this.state.errorInfo && (
                            <details className="mb-4">
                                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 mb-2">
                                    Stack Trace (Development Only)
                                </summary>
                                <div className="bg-[#0d1117] border border-gray-800 rounded p-3 overflow-auto max-h-64">
                                    <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            </details>
                        )}

                        <div className="flex space-x-3">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                            >
                                <ArrowClockwise size={16} />
                                <span>Try Again</span>
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                            >
                                Reload Application
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
