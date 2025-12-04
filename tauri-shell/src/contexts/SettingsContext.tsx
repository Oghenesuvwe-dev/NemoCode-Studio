import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'high-contrast';

interface SettingsContextType {
    backendUrl: string;
    setBackendUrl: (url: string) => void;
    enableRAG: boolean;
    setEnableRAG: (enable: boolean) => void;
    enableEffects: boolean;
    setEnableEffects: (enable: boolean) => void;
    autonomyMode: 'supervised' | 'autonomous';
    setAutonomyMode: (mode: 'supervised' | 'autonomous') => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    formatOnSave: boolean;
    setFormatOnSave: (enable: boolean) => void;
    showMinimap: boolean;
    setShowMinimap: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [backendUrl, setBackendUrl] = useState<string>(() => {
        return localStorage.getItem('nemo_backend_url') || 'http://localhost:8000';
    });

    const [enableRAG, setEnableRAG] = useState<boolean>(() => {
        return localStorage.getItem('nemo_enable_rag') !== 'false'; // Default true
    });

    const [enableEffects, setEnableEffects] = useState<boolean>(() => {
        return localStorage.getItem('nemo_enable_effects') !== 'false'; // Default true
    });

    const [autonomyMode, setAutonomyMode] = useState<'supervised' | 'autonomous'>(() => {
        return (localStorage.getItem('nemo_autonomy_mode') as 'supervised' | 'autonomous') || 'supervised';
    });

    const [theme, setTheme] = useState<Theme>(() => {
        return (localStorage.getItem('nemo_theme') as Theme) || 'dark';
    });

    const [formatOnSave, setFormatOnSave] = useState<boolean>(() => {
        return localStorage.getItem('nemo_format_on_save') === 'true'; // Default false
    });

    const [showMinimap, setShowMinimap] = useState<boolean>(() => {
        return localStorage.getItem('nemo_show_minimap') === 'true'; // Default false
    });

    useEffect(() => {
        localStorage.setItem('nemo_backend_url', backendUrl);
        localStorage.setItem('nemo_enable_rag', String(enableRAG));
        localStorage.setItem('nemo_enable_effects', String(enableEffects));
        localStorage.setItem('nemo_autonomy_mode', autonomyMode);
        localStorage.setItem('nemo_theme', theme);
        localStorage.setItem('nemo_format_on_save', String(formatOnSave));
        localStorage.setItem('nemo_show_minimap', String(showMinimap));
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
    }, [backendUrl, enableRAG, enableEffects, autonomyMode, theme, formatOnSave, showMinimap]);

    return (
        <SettingsContext.Provider value={{
            backendUrl, setBackendUrl,
            enableRAG, setEnableRAG,
            enableEffects, setEnableEffects,
            autonomyMode, setAutonomyMode,
            theme, setTheme,
            formatOnSave, setFormatOnSave,
            showMinimap, setShowMinimap
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
