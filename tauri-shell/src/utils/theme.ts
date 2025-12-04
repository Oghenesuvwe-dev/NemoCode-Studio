/**
 * Get a CSS variable value from the current theme
 */
export const getThemeValue = (variable: string): string => {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variable)
        .trim();
};

/**
 * Terminal theme configuration using CSS variables
 */
export const getTerminalTheme = () => ({
    background: getThemeValue('--terminal-bg'),
    foreground: getThemeValue('--terminal-fg'),
    cursor: getThemeValue('--terminal-cursor'),
    selectionBackground: getThemeValue('--terminal-selection'),
    black: getThemeValue('--terminal-black'),
    red: getThemeValue('--terminal-red'),
    green: getThemeValue('--terminal-green'),
    yellow: getThemeValue('--terminal-yellow'),
    blue: getThemeValue('--terminal-blue'),
    magenta: getThemeValue('--terminal-magenta'),
    cyan: getThemeValue('--terminal-cyan'),
    white: getThemeValue('--terminal-white'),
    brightBlack: getThemeValue('--terminal-bright-black'),
    brightRed: getThemeValue('--terminal-bright-red'),
    brightGreen: getThemeValue('--terminal-bright-green'),
    brightYellow: getThemeValue('--terminal-bright-yellow'),
    brightBlue: getThemeValue('--terminal-bright-blue'),
    brightMagenta: getThemeValue('--terminal-bright-magenta'),
    brightCyan: getThemeValue('--terminal-bright-cyan'),
    brightWhite: getThemeValue('--terminal-bright-white'),
});

/**
 * Monaco Editor theme configuration using CSS variables
 */
export const getEditorTheme = () => ({
    base: 'vs-dark' as const,
    inherit: true,
    rules: [],
    colors: {
        'editor.background': getThemeValue('--editor-bg'),
        'editor.foreground': getThemeValue('--editor-fg'),
        'editor.lineHighlightBackground': getThemeValue('--editor-line-highlight'),
        'editor.selectionBackground': getThemeValue('--editor-selection'),
        'editorCursor.foreground': getThemeValue('--editor-cursor'),
    }
});

/**
 * Common color values
 */
export const colors = {
    // Backgrounds
    bgPrimary: () => getThemeValue('--bg-primary'),
    bgSecondary: () => getThemeValue('--bg-secondary'),
    bgTertiary: () => getThemeValue('--bg-tertiary'),

    // Text
    textPrimary: () => getThemeValue('--text-primary'),
    textSecondary: () => getThemeValue('--text-secondary'),
    textMuted: () => getThemeValue('--text-muted'),

    // Accents
    accentBlue: () => getThemeValue('--accent-blue'),
    accentGreen: () => getThemeValue('--accent-green'),
    accentRed: () => getThemeValue('--accent-red'),
    accentPurple: () => getThemeValue('--accent-purple'),

    // Borders
    borderDefault: () => getThemeValue('--border-default'),
};

export default {
    getThemeValue,
    getTerminalTheme,
    getEditorTheme,
    colors
};
