/**
 * Code formatting utilities using Prettier
 */
import * as prettier from 'prettier';
import { readTextFile } from '@tauri-apps/plugin-fs';

// Cache for .prettierrc config
let cachedConfig: prettier.Options | null = null;
let configPath: string | null = null;

export type SupportedLanguage = 
    | 'javascript'
    | 'typescript'
    | 'css'
    | 'scss'
    | 'json'
    | 'html'
    | 'markdown'
    | 'yaml';

const parserMap: Record<string, string> = {
    'js': 'babel',
    'jsx': 'babel',
    'ts': 'typescript',
    'tsx': 'typescript',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'html': 'html',
    'md': 'markdown',
    'yaml': 'yaml',
    'yml': 'yaml',
};

/**
 * Get the Prettier parser for a file extension
 */
export function getParserForFile(fileName: string): string | null {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return null;
    return parserMap[ext] || null;
}

/**
 * Check if a file can be formatted
 */
export function canFormat(fileName: string): boolean {
    return getParserForFile(fileName) !== null;
}

/**
 * Load .prettierrc configuration from workspace
 */
export async function loadPrettierConfig(workspacePath: string): Promise<prettier.Options> {
    // Return cached config if already loaded for this path
    if (cachedConfig && configPath === workspacePath) {
        return cachedConfig;
    }

    const configFiles = [
        '.prettierrc',
        '.prettierrc.json',
        '.prettierrc.js',
        'prettier.config.js'
    ];

    for (const configFile of configFiles) {
        try {
            const fullPath = `${workspacePath}/${configFile}`;
            const content = await readTextFile(fullPath);
            
            // Parse JSON config (for .prettierrc and .prettierrc.json)
            if (configFile.endsWith('.json') || configFile === '.prettierrc') {
                const config = JSON.parse(content);
                cachedConfig = config;
                configPath = workspacePath;
                return config;
            }
        } catch {
            // Config file doesn't exist or can't be read, try next
            continue;
        }
    }

    // No config found, return empty object
    return {};
}

/**
 * Clear cached Prettier config (call when workspace changes)
 */
export function clearPrettierConfigCache(): void {
    cachedConfig = null;
    configPath = null;
}

/**
 * Format code using Prettier
 */
export async function formatCode(
    code: string,
    fileName: string,
    workspacePath?: string,
    options: prettier.Options = {}
): Promise<{ formatted: string; error: string | null }> {
    const parser = getParserForFile(fileName);
    
    if (!parser) {
        return {
            formatted: code,
            error: `No formatter available for this file type`
        };
    }

    try {
        // Load workspace config if available
        let workspaceConfig: prettier.Options = {};
        if (workspacePath) {
            workspaceConfig = await loadPrettierConfig(workspacePath);
        }

        // Default config
        const defaultConfig: prettier.Options = {
            parser,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            trailingComma: 'es5',
            bracketSpacing: true,
            arrowParens: 'avoid',
            printWidth: 100,
        };

        // Merge configs: defaults < workspace config < explicit options
        const finalConfig = {
            ...defaultConfig,
            ...workspaceConfig,
            ...options
        };

        const formatted = await prettier.format(code, finalConfig);

        return { formatted, error: null };
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown formatting error';
        return {
            formatted: code,
            error: `Formatting failed: ${errorMessage}`
        };
    }
}

/**
 * Get supported file extensions
 */
export function getSupportedExtensions(): string[] {
    return Object.keys(parserMap);
}
