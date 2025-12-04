/**
 * Detect programming language from file extension
 */
export function detectLanguage(filePath: string): string {
  if (!filePath) return 'plaintext';

  const ext = filePath.split('.').pop()?.toLowerCase();
  
  const languageMap: { [key: string]: string } = {
    // Web
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'htm': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'scss',
    'less': 'less',
    'json': 'json',
    'jsonc': 'jsonc',
    'xml': 'xml',
    'svg': 'xml',
    
    // Python
    'py': 'python',
    'pyw': 'python',
    'pyi': 'python',
    
    // Java
    'java': 'java',
    'class': 'java',
    'jar': 'java',
    
    // C/C++
    'c': 'c',
    'h': 'c',
    'cpp': 'cpp',
    'cc': 'cpp',
    'cxx': 'cpp',
    'hpp': 'cpp',
    'hxx': 'cpp',
    
    // C#
    'cs': 'csharp',
    'csx': 'csharp',
    
    // Go
    'go': 'go',
    
    // Rust
    'rs': 'rust',
    
    // Ruby
    'rb': 'ruby',
    'erb': 'ruby',
    
    // PHP
    'php': 'php',
    'php3': 'php',
    'php4': 'php',
    'php5': 'php',
    'phtml': 'php',
    
    // Shell
    'sh': 'shell',
    'bash': 'shell',
    'zsh': 'shell',
    'fish': 'shell',
    
    // SQL
    'sql': 'sql',
    'mysql': 'sql',
    'pgsql': 'sql',
    
    // Markdown
    'md': 'markdown',
    'markdown': 'markdown',
    'mdown': 'markdown',
    'mkdn': 'markdown',
    'mkd': 'markdown',
    
    // YAML
    'yaml': 'yaml',
    'yml': 'yaml',
    
    // TOML
    'toml': 'toml',
    
    // INI
    'ini': 'ini',
    'cfg': 'ini',
    'conf': 'ini',
    
    // Properties
    'properties': 'properties',
    
    // Dockerfile
    'dockerfile': 'dockerfile',
    
    // Docker Compose
    'docker-compose': 'yaml',
    
    // GraphQL
    'graphql': 'graphql',
    'gql': 'graphql',
    
    // Groovy
    'groovy': 'groovy',
    'gradle': 'groovy',
    
    // Kotlin
    'kt': 'kotlin',
    'kts': 'kotlin',
    
    // Swift
    'swift': 'swift',
    
    // Objective-C
    'm': 'objective-c',
    'mm': 'objective-c',
    
    // Perl
    'pl': 'perl',
    'pm': 'perl',
    
    // Lua
    'lua': 'lua',
    
    // VB.NET
    'vb': 'vb',
    'vbs': 'vb',
    
    // Batch
    'bat': 'bat',
    'cmd': 'bat',
    
    // PowerShell
    'ps1': 'powershell',
    'psd1': 'powershell',
    'psm1': 'powershell',
    
    // R
    'r': 'r',
    'rmd': 'r',
    
    // Clojure
    'clj': 'clojure',
    'cljs': 'clojure',
    'cljc': 'clojure',
    
    // Elixir
    'ex': 'elixir',
    'exs': 'elixir',
    
    // Erlang
    'erl': 'erlang',
    'hrl': 'erlang',
    
    // Haskell
    'hs': 'haskell',
    'lhs': 'haskell',
    
    // Scala
    'scala': 'scala',
    'sc': 'scala',
    
    // Dart
    'dart': 'dart',
    
    // Vim
    'vim': 'vim',
    
    // Diff
    'diff': 'diff',
    'patch': 'diff',
    
    // Log
    'log': 'log',
    
    // Text
    'txt': 'plaintext',
    'text': 'plaintext',
  };

  return languageMap[ext || ''] || 'plaintext';
}

/**
 * Get display name for language
 */
export function getLanguageDisplayName(language: string): string {
  const displayNames: { [key: string]: string } = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'c': 'C',
    'cpp': 'C++',
    'csharp': 'C#',
    'go': 'Go',
    'rust': 'Rust',
    'ruby': 'Ruby',
    'php': 'PHP',
    'shell': 'Shell',
    'sql': 'SQL',
    'markdown': 'Markdown',
    'yaml': 'YAML',
    'json': 'JSON',
    'html': 'HTML',
    'css': 'CSS',
    'scss': 'SCSS',
    'xml': 'XML',
    'plaintext': 'Plain Text',
  };

  return displayNames[language] || language.charAt(0).toUpperCase() + language.slice(1);
}
