import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebglAddon } from '@xterm/addon-webgl';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { getTerminalTheme } from '../utils/theme';
import '@xterm/xterm/css/xterm.css';

interface TerminalInstanceProps {
    id: string;
    shell: string;
    cwd: string | null;
    isActive: boolean;
    onReady?: (id: string) => void;
    onClose?: (id: string) => void;
}

const TerminalInstance: React.FC<TerminalInstanceProps> = ({
    id,
    shell,
    cwd,
    isActive,
    onReady,
    onClose
}) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);
    const unlistenRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Create terminal instance with theme from CSS variables
        const term = new Terminal({
            cursorBlink: true,
            allowProposedApi: true,
            macOptionIsMeta: true,
            macOptionClickForcesSelection: true,
            fastScrollModifier: 'alt',
            fontSize: 13,
            lineHeight: 1.2,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: getTerminalTheme(),
        });

        const fitAddon = new FitAddon();
        const searchAddon = new SearchAddon();
        const webLinksAddon = new WebLinksAddon();

        term.loadAddon(fitAddon);
        term.loadAddon(searchAddon);
        term.loadAddon(webLinksAddon);

        try {
            const webglAddon = new WebglAddon();
            webglAddon.onContextLoss(() => webglAddon.dispose());
            term.loadAddon(webglAddon);
        } catch (e) {
            console.warn('WebGL addon failed to load', e);
        }

        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;
        fitAddonRef.current = fitAddon;

        // Initialize PTY
        const initPty = async () => {
            try {
                await invoke('spawn_pty', { id, shell, cwd });

                const unlisten = await listen<any>('pty-output', (event) => {
                    if (event.payload.id === id && xtermRef.current) {
                        xtermRef.current.write(event.payload.data);
                    }
                });

                unlistenRef.current = unlisten;

                term.onData((data) => {
                    invoke('write_pty', { id, data });
                });

                // Initial resize
                setTimeout(() => {
                    fitAddon.fit();
                    if (term.cols > 0 && term.rows > 0) {
                        invoke('resize_pty', { id, rows: term.rows, cols: term.cols });
                    }
                }, 100);

                onReady?.(id);
            } catch (err) {
                console.error('Failed to spawn PTY:', err);
                onClose?.(id);
            }
        };

        initPty();

        // Cleanup
        return () => {
            if (unlistenRef.current) {
                unlistenRef.current();
            }
            if (xtermRef.current) {
                xtermRef.current.dispose();
            }
            invoke('close_pty', { id }).catch(console.error);
        };
    }, [id, shell, cwd, onReady, onClose]);

    // Handle resize when active state changes
    useEffect(() => {
        if (isActive && fitAddonRef.current && xtermRef.current) {
            setTimeout(() => {
                fitAddonRef.current?.fit();
                if (xtermRef.current && xtermRef.current.cols > 0 && xtermRef.current.rows > 0) {
                    invoke('resize_pty', {
                        id,
                        rows: xtermRef.current.rows,
                        cols: xtermRef.current.cols
                    });
                }
                xtermRef.current?.focus();
            }, 50);
        }
    }, [isActive, id]);

    return (
        <div
            ref={terminalRef}
            className="absolute inset-0 w-full h-full bg-[#161b22]"
            style={{
                visibility: isActive ? 'visible' : 'hidden',
                zIndex: isActive ? 10 : 0
            }}
        />
    );
};

export default TerminalInstance;
