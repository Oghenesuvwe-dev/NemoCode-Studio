import React, { useState, useId } from 'react';
import { X, FolderOpen, Keyboard, Rocket, CheckCircle, ArrowRight } from 'phosphor-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useAppStore } from '../stores/useAppStore';
import { open } from '@tauri-apps/plugin-dialog';

const WelcomeScreen: React.FC = () => {
  const { showWelcome, setShowWelcome, setWorkspacePath } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const titleId = useId();
  const descriptionId = useId();

  const handleOpenFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Workspace Folder'
      });

      if (selected && typeof selected === 'string') {
        setWorkspacePath(selected);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  };

  // Focus trap for accessibility
  const dialogRef = useFocusTrap<HTMLDivElement>({
    isActive: showWelcome,
    onEscape: () => setShowWelcome(false),
    restoreFocus: true,
    autoFocus: true
  });

  if (!showWelcome) return null;

  const onClose = () => setShowWelcome(false);


  const steps = [
    {
      title: 'Welcome to NemoCode IDE',
      icon: <Rocket size={48} className="text-blue-400" />,
      description: 'A modern, AI-powered IDE built for developers',
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            NemoCode IDE combines powerful code editing with AI assistance to boost your productivity.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-blue-400 mb-2">Smart Navigation</h4>
              <p className="text-xs text-gray-400">
                Go to definition, symbol search, and fuzzy file finding
              </p>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-green-400 mb-2">AI Assistant</h4>
              <p className="text-xs text-gray-400">
                Chat with AI to generate code, fix bugs, and learn
              </p>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Integrated Terminal</h4>
              <p className="text-xs text-gray-400">
                Split terminals, command history, and context menus
              </p>
            </div>
            <div className="bg-[#0d1117] p-4 rounded-lg border border-gray-700">
              <h4 className="text-sm font-semibold text-purple-400 mb-2">Code Formatting</h4>
              <p className="text-xs text-gray-400">
                Prettier integration with format on save
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Essential Keyboard Shortcuts',
      icon: <Keyboard size={48} className="text-purple-400" />,
      description: 'Master these shortcuts to work faster',
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ShortcutItem shortcut="⌘ P" description="Quick Open Files" />
            <ShortcutItem shortcut="⌘ T" description="Go to Symbol" />
            <ShortcutItem shortcut="⌘ F" description="Find in File" />
            <ShortcutItem shortcut="⌘ ⇧ F" description="Search in Files" />
            <ShortcutItem shortcut="F12" description="Go to Definition" />
            <ShortcutItem shortcut="⌘ G" description="Go to Line" />
            <ShortcutItem shortcut="⌘ E" description="Recent Files" />
            <ShortcutItem shortcut="⌘ S" description="Save File" />
            <ShortcutItem shortcut="⇧ ⌥ F" description="Format Document" />
            <ShortcutItem shortcut="⌘ ⇧ P" description="Command Palette" />
          </div>
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300">
              💡 Tip: Press <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs">⌘ ⇧ P</kbd> to see all available commands
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Get Started',
      icon: <FolderOpen size={48} className="text-green-400" />,
      description: 'Open a folder to start coding',
      content: (
        <div className="space-y-6">
          <p className="text-gray-300">
            To begin using NemoCode IDE, open a folder containing your project files.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle size={20} className="text-green-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-200">File Explorer</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Browse and manage your project files in the left sidebar
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle size={20} className="text-green-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-200">AI Chat</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Ask questions and get code suggestions in the right sidebar
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle size={20} className="text-green-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-200">Terminal</h4>
                <p className="text-xs text-gray-400 mt-1">
                  Run commands and scripts in the integrated terminal at the bottom
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              handleOpenFolder();
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <FolderOpen size={20} />
            <span>Open Folder</span>
          </button>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="bg-[#161b22] rounded-lg border border-gray-700 w-[700px] max-h-[80vh] shadow-2xl flex flex-col overflow-hidden animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <span aria-hidden="true">{currentStepData.icon}</span>
            <div>
              <h2 id={titleId} className="text-lg font-bold text-gray-200">{currentStepData.title}</h2>
              <p id={descriptionId} className="text-sm text-gray-400">{currentStepData.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close welcome screen"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center space-x-2" role="tablist" aria-label="Tutorial steps">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                role="tab"
                aria-selected={index === currentStep}
                aria-label={`Step ${index + 1}: ${step.title}`}
                className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                  ? 'bg-blue-500 w-6'
                  : index < currentStep
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                  }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-2">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                Back
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex items-center space-x-1"
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-500 text-white rounded transition-colors flex items-center space-x-1"
              >
                <CheckCircle size={16} />
                <span>Get Started</span>
              </button>
            )}
          </div>
        </div>

        {/* Skip Button */}
        <div className="px-6 pb-3 text-center">
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Skip tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

const ShortcutItem: React.FC<{ shortcut: string; description: string }> = ({
  shortcut,
  description
}) => (
  <div className="flex items-center justify-between p-2 bg-[#0d1117] rounded border border-gray-700">
    <span className="text-xs text-gray-300">{description}</span>
    <kbd className="px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-gray-400 font-mono">
      {shortcut}
    </kbd>
  </div>
);

export default WelcomeScreen;
