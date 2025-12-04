# NemoCode IDE - User Guide

Welcome to NemoCode IDE, a modern AI-powered development environment built for productivity.

---

## 🚀 Getting Started

### Installation

1. Download the latest release from the releases page
2. Install the application for your platform (macOS, Windows, Linux)
3. Launch NemoCode IDE

### Opening a Project

1. Click **File > Open Folder** or use `Cmd+O` (macOS) / `Ctrl+O` (Windows/Linux)
2. Select your project folder
3. The file explorer will populate with your project files

---

## 📁 File Explorer

The file explorer is located in the left sidebar.

### Features
- **Tree View**: Navigate your project structure
- **Create Files/Folders**: Right-click for context menu
- **Rename/Delete**: Right-click on any file or folder
- **Drag & Drop**: Move files between folders

### Quick Actions
- Click a file to open it in the editor
- Double-click to pin a tab
- Right-click for more options

---

## ✏️ Code Editor

### Basic Editing
- **Save**: `Cmd+S`
- **Undo**: `Cmd+Z`
- **Redo**: `Cmd+Shift+Z`
- **Find**: `Cmd+F`
- **Replace**: `Cmd+H`

### Navigation
- **Go to Line**: `Cmd+G`
- **Go to Definition**: `F12` or `Cmd+Click`
- **Go to Symbol**: `Cmd+T`
- **Quick Open**: `Cmd+P`

### Code Formatting
- **Format Document**: `Shift+Alt+F`
- **Format on Save**: Enable in settings

---

## 🔍 Search Features

### Find in File (`Cmd+F`)
- Search within the current file
- Supports regex and case-sensitive options
- Navigate matches with Enter/Shift+Enter

### Global Search (`Cmd+Shift+F`)
- Search across all workspace files
- Results grouped by file
- Click to jump to match location

### Symbol Search (`Cmd+T`)
- Find functions, classes, and types
- Fuzzy matching for quick navigation
- Shows file location and line number

### Quick Open (`Cmd+P`)
- Fuzzy search for files by name
- Fast navigation in large projects
- Arrow keys to navigate, Enter to open

---

## 💻 Integrated Terminal

### Opening Terminal
- Click the Terminal tab at the bottom
- Or use the terminal icon in the sidebar

### Terminal Features
- **Multiple Terminals**: Click "+" to add new terminal
- **Split View**: Split horizontally or vertically
- **Copy/Paste**: `Cmd+C` / `Cmd+V`
- **Clear**: Right-click > Clear
- **Search**: `Cmd+F` in terminal

### Terminal Shortcuts
- Up/Down arrows: Navigate command history
- Tab: Auto-complete commands
- Ctrl+C: Cancel current command

---

## 🤖 AI Assistant

### Using the AI Chat
1. Open the AI panel on the right sidebar
2. Type your question or request
3. Press Enter to send

### What AI Can Help With
- Generate code snippets
- Explain code functionality
- Debug errors
- Suggest improvements
- Answer programming questions

### Tips for Better Results
- Be specific in your requests
- Provide context about your project
- Include relevant code snippets
- Ask follow-up questions

---

## ⌨️ Keyboard Shortcuts

### File Operations
| Shortcut | Action |
|----------|--------|
| `Cmd+P` | Quick Open |
| `Cmd+E` | Recent Files |
| `Cmd+S` | Save File |
| `Cmd+W` | Close Tab |

### Editing
| Shortcut | Action |
|----------|--------|
| `Cmd+F` | Find in File |
| `Cmd+H` | Find and Replace |
| `Cmd+G` | Go to Line |
| `Shift+Alt+F` | Format Document |
| `Cmd+Z` | Undo |
| `Cmd+Shift+Z` | Redo |

### Navigation
| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+F` | Search in Files |
| `Cmd+T` | Go to Symbol |
| `F12` | Go to Definition |
| `Cmd+Click` | Go to Definition |

### View
| Shortcut | Action |
|----------|--------|
| `Cmd+Shift+P` | Command Palette |
| `Cmd+R` | Reload Window |

---

## 🎨 Themes

NemoCode IDE includes three built-in themes:

1. **Dark** (default) - Easy on the eyes for long coding sessions
2. **Light** - High visibility for bright environments
3. **High Contrast** - Maximum readability

### Changing Theme
1. Open Command Palette (`Cmd+Shift+P`)
2. Type "Theme"
3. Select your preferred theme

---

## ⚙️ Settings

### Format on Save
Enable automatic code formatting when saving files:
1. Open Command Palette (`Cmd+Shift+P`)
2. Search for "Format on Save"
3. Toggle the setting

### Prettier Configuration
Create a `.prettierrc` file in your project root to customize formatting:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

## 🔧 Troubleshooting

### Backend Connection Issues
If you see "Backend Disconnected" in the status bar:
1. Check if the backend server is running
2. Verify the backend URL in settings
3. Try reloading the window (`Cmd+R`)

### File Not Saving
- Check file permissions
- Ensure the file isn't locked by another process
- Try "Save As" to a different location

### Slow Performance
- Close unused tabs
- Reduce the number of open terminals
- For large projects, use Quick Open instead of browsing

### AI Not Responding
- Check backend connection status
- Verify Ollama is running (if using local AI)
- Check network connectivity

---

## 📞 Getting Help

### Command Palette
Press `Cmd+Shift+P` to access all available commands.

### Keyboard Shortcuts Panel
Press `Cmd+Shift+P` and search for "Keyboard Shortcuts" to see all shortcuts.

### Welcome Screen
Access the welcome tutorial anytime from Command Palette > "Welcome Screen".

---

## 🔄 Updates

NemoCode IDE checks for updates automatically. When an update is available:
1. You'll see a notification
2. Click to download and install
3. Restart the application

---

**Version**: 0.9.0 (Beta)  
**Last Updated**: December 2, 2025

---

*Thank you for using NemoCode IDE! We're constantly improving based on your feedback.*
