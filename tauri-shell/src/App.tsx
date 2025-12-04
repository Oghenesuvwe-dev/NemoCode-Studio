import React, { useEffect, useCallback, useRef } from 'react';
import { useSettings } from './contexts/SettingsContext';
import FileExplorer from './components/FileExplorer';
import MonacoEditor from './components/MonacoEditor';
import BottomPanel from './components/BottomPanel';
import StatusBar from './components/StatusBar';
import TitleBar from './components/TitleBar';
import RealChat from './components/RealChat';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingOverlay from './components/LoadingOverlay';
import FindReplace from './components/FindReplace';
import GoToLine from './components/GoToLine';
import GlobalSearch from './components/GlobalSearch';
import QuickOpen from './components/QuickOpen';
import SymbolSearch from './components/SymbolSearch';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import ErrorBoundary from './components/ErrorBoundary';
import { useBackendConnection } from './hooks/useBackendConnection';
import { useAppStore } from './stores/useAppStore';
import './styles/theme.css';
import './App.css';

const App: React.FC = () => {
  const { theme, formatOnSave, showMinimap, setShowMinimap } = useSettings();
  const { isConnected } = useBackendConnection({
    backendUrl: 'http://localhost:8000',
    maxRetries: 5,
    onConnectionChange: (connected) => {
      console.log(`Backend ${connected ? 'connected' : 'disconnected'}`);
    }
  });

  // Global State
  const store = useAppStore();

  // Resize handling to prevent flicker
  const [isResizing, setIsResizing] = React.useState(false);
  const resizeTimeoutRef = useRef<number | undefined>(undefined);

  // Handle window resize with debouncing to prevent flicker
  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        setIsResizing(false);
      }, 2000);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (modifier) {
        switch (e.key.toLowerCase()) {
          case 'f':
            if (e.shiftKey) {
              e.preventDefault();
              store.setShowGlobalSearch(true);
            } else {
              e.preventDefault();
              store.setShowFindReplace(true);
            }
            break;
          case 'h':
            e.preventDefault();
            store.setShowFindReplace(true);
            break;
          case 'g':
            e.preventDefault();
            store.setShowGoToLine(true);
            break;
          case 'p':
            e.preventDefault();
            store.setShowQuickOpen(true);
            break;
          case 't':
            e.preventDefault();
            store.setShowSymbolSearch(true);
            break;
          case 'b':
            e.preventDefault();
            store.toggleExplorer();
            break;
          case 'j':
            e.preventDefault();
            store.toggleTerminal();
            break;
          case 'c':
            if (e.shiftKey) {
              e.preventDefault();
              store.toggleChat();
            }
            break;
          case '[':
            e.preventDefault();
            store.navigateBack();
            break;
          case ']':
            e.preventDefault();
            store.navigateForward();
            break;
          case 'm':
            e.preventDefault();
            setShowMinimap(!showMinimap);
            break;
          case 'a':
            if (e.shiftKey) {
              e.preventDefault();
              store.toggleAgents();
            }
            break;
          case '?':
            e.preventDefault();
            store.setShowKeyboardShortcuts(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store, showMinimap, setShowMinimap]);

  // Handle file content change with auto-save
  const handleFileChange = useCallback((content: string) => {
    store.updateTabContent(store.activeTabId, content);

    // Auto-save if enabled
    if (formatOnSave) {
      store.saveFile(store.activeTabId);
    }
  }, [store, formatOnSave]);

  const activeTab = store.tabs.find((t) => t.id === store.activeTabId);

  return (
    <div className={`flex flex-col h-screen w-screen bg-[#0d1117] text-gray-300 ${theme} ${isResizing ? 'resizing' : ''}`}>
      {/* Title Bar */}
      <TitleBar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        {store.showExplorer && (
          <div
            className="bg-[#161b22] border-r border-gray-800 flex flex-col"
            style={{ width: `${store.explorerWidth}px` }}
          >
            <ErrorBoundary fallbackTitle="File Explorer Error">
              <FileExplorer />
            </ErrorBoundary>
            {/* Resize handle */}
            <div
              className="w-1 bg-gray-800 hover:bg-blue-500 cursor-col-resize transition-colors"
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startWidth = store.explorerWidth;

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const delta = moveEvent.clientX - startX;
                  const newWidth = Math.max(200, Math.min(400, startWidth + delta));
                  store.setExplorerWidth(newWidth);
                };

                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            />
          </div>
        )}

        {/* Center - Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navigation Bar */}
          <div className="flex items-center bg-[#161b22] border-b border-gray-800 px-2 py-1 gap-1">
            <button
              onClick={store.navigateBack}
              disabled={store.navigationIndex <= 0}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Go Back (Cmd+[)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M10 13L5 8l5-5v10z" />
              </svg>
            </button>
            <button
              onClick={store.navigateForward}
              disabled={store.navigationIndex >= store.navigationHistory.length - 1}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title="Go Forward (Cmd+])"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3l5 5-5 5V3z" />
              </svg>
            </button>
            <div className="w-px h-4 bg-gray-700 mx-1" />
          </div>

          {/* Editor Tabs */}
          <div className="flex bg-[#161b22] border-b border-gray-800 overflow-x-auto">
            {store.tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => store.setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm cursor-pointer border-b-2 flex items-center gap-2 whitespace-nowrap ${store.activeTabId === tab.id
                  ? 'bg-[#0d1117] text-white border-blue-500'
                  : 'bg-[#21262d] text-gray-500 border-transparent hover:bg-[#161b22]'
                  }`}
              >
                {tab.isDirty && <span className="text-yellow-400">●</span>}
                <span>{tab.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    store.closeTab(tab.id);
                  }}
                  className="ml-2 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Editor Content */}
          <ErrorBoundary fallbackTitle="Editor Error">
            {store.showWelcome ? (
              <WelcomeScreen />
            ) : activeTab ? (
              <MonacoEditor
                value={activeTab.content}
                onChange={handleFileChange}
                language="typescript"
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                No file selected
              </div>
            )}
          </ErrorBoundary>

          {/* Bottom Panel (Terminal, Output, Debug, Problems, Ports) */}
          {store.showTerminal && (
            <>
              <div
                className="w-full bg-gray-800 hover:bg-blue-500 cursor-row-resize transition-colors h-1"
                style={{ WebkitAppRegion: 'no-drag' } as any}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  const startY = e.clientY;
                  const startHeight = store.terminalHeight;

                  const handleMouseMove = (moveEvent: MouseEvent) => {
                    moveEvent.preventDefault();
                    const delta = moveEvent.clientY - startY;
                    const newHeight = Math.max(100, Math.min(600, startHeight - delta));
                    store.setTerminalHeight(newHeight);
                  };

                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.body.style.cursor = '';
                  };

                  document.body.style.cursor = 'row-resize';
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
              <div
                style={{ height: store.isTerminalMaximized ? 'calc(100vh - 120px)' : `${store.terminalHeight}px` }}
                className="bg-[#0d1117] transition-all duration-200"
              >
                <ErrorBoundary fallbackTitle="Terminal Error">
                  <BottomPanel />
                </ErrorBoundary>
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar - Chat */}
        {store.showChat && (
          <div className="w-80 bg-[#161b22] border-l border-gray-800 flex flex-col">
            <ErrorBoundary fallbackTitle="Chat Error">
              <RealChat />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar
        line={1}
        column={1}
        totalLines={activeTab?.content.split('\n').length || 1}
        fileName={activeTab?.name || 'Welcome'}
        language="typescript"
        encoding="UTF-8"
        isConnected={isConnected}
      />

      {/* Loading Overlay */}
      {store.isLoading && <LoadingOverlay isLoading={store.isLoading} />}

      {/* Search Modals */}
      <FindReplace />

      <GoToLine />

      {store.showGlobalSearch && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#161b22] rounded-lg shadow-xl w-full max-w-2xl max-h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold">Global Search</h2>
              <button
                onClick={() => store.setShowGlobalSearch(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <GlobalSearch />
          </div>
        </div>
      )}

      <QuickOpen />

      <SymbolSearch />

      <KeyboardShortcuts />
    </div>
  );
};

export default App;
