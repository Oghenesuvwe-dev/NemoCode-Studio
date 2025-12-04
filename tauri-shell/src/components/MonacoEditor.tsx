import React, { useRef } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { useSettings } from '../contexts/SettingsContext';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'light' | 'dark' | 'high-contrast';
  readOnly?: boolean;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onEditorClick?: (e: monaco.editor.IEditorMouseEvent) => void;
}

const MonacoEditorComponent: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  theme = 'dark',
  readOnly = false,
  onMount,
  onEditorClick
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { showMinimap } = useSettings();

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      minimap: { 
        enabled: showMinimap,
        side: 'right',
        showSlider: 'always',
        renderCharacters: true,
        maxColumn: 120,
      },
      fontSize: 14,
      lineNumbers: 'on',
      scrollBeyondLastLine: false,
      wordWrap: 'off',
      formatOnPaste: true,
      formatOnType: true,
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'languageDefined',
      // Multi-cursor support (TASK-007)
      multiCursorModifier: 'ctrlCmd',
      multiCursorMergeOverlapping: true,
      // Bracket matching (TASK-009)
      bracketPairColorization: {
        enabled: true
      },
      matchBrackets: 'always',
      // Code folding (TASK-008)
      folding: true,
      foldingStrategy: 'auto',
      showFoldingControls: 'always',
      foldingHighlight: true,
      unfoldOnClickAfterEndOfLine: true,
      // Other options
      renderWhitespace: 'none',
      smoothScrolling: true,
      cursorBlinking: 'blink',
      cursorSmoothCaretAnimation: 'on',
      mouseWheelZoom: true,
      readOnly
    } as any);

    // Add mouse event listener for Cmd+Click
    if (onEditorClick) {
      editor.onMouseDown(onEditorClick);
    }

    if (onMount) {
      onMount(editor);
    }
  };

  const handleChange: OnChange = (newValue) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  const getTheme = () => {
    switch (theme) {
      case 'light':
        return 'vs-light';
      case 'high-contrast':
        return 'hc-black';
      case 'dark':
      default:
        return 'vs-dark';
    }
  };

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={handleChange}
      onMount={handleEditorMount}
      theme={getTheme()}
      options={{
        minimap: { 
          enabled: showMinimap,
          side: 'right',
          showSlider: 'always',
          renderCharacters: true,
          maxColumn: 120,
        },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'off',
        formatOnPaste: true,
        formatOnType: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        autoSurround: 'languageDefined',
        bracketPairColorization: {
          enabled: true
        },
        folding: true,
        foldingStrategy: 'indentation',
        showFoldingControls: 'always',
        matchBrackets: 'always',
        renderWhitespace: 'none',
        smoothScrolling: true,
        cursorBlinking: 'blink',
        cursorSmoothCaretAnimation: 'on',
        mouseWheelZoom: true,
        readOnly
      }}
    />
  );
};

export default MonacoEditorComponent;
