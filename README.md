# NemoCode Studio

<div align="center">

![NemoCode Studio](https://img.shields.io/badge/NemoCode-Studio-blue?style=for-the-badge)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/Oghenesuvwe-dev/NemoCode-Studio/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/Oghenesuvwe-dev/NemoCode-Studio/actions)
[![Release](https://img.shields.io/github/v/release/Oghenesuvwe-dev/NemoCode-Studio?style=for-the-badge)](https://github.com/Oghenesuvwe-dev/NemoCode-Studio/releases)

**An AI-powered code editor built with Tauri, React, and Rust**

[Features](#-features) • [Installation](#-installation) • [Development](#-development) • [Contributing](#-contributing)

</div>

---

## 🚀 Features

### **AI-Powered Coding**
- 🤖 **Integrated AI Assistant** - Chat with local LLMs via Ollama
- 🧠 **RAG-Enhanced Context** - Intelligent codebase understanding
- 🔊 **Voice Interaction** - Speech-to-text and text-to-speech support
- 🤝 **Swarm Mode** - Multi-agent collaboration for complex tasks

### **Modern Code Editor**
- 📝 **Monaco Editor** - Full-featured code editing with syntax highlighting
- 🔍 **Advanced Search** - Global search, symbol search, and quick file navigation
- 📁 **File Explorer** - Intuitive workspace management
- 🎨 **Customizable Themes** - Dark/Light mode with CSS variables

### **Integrated Terminal**
- 💻 **Multiple Terminals** - Spawn and manage multiple shell sessions
- 🎯 **PTY Support** - True terminal emulation with xterm.js
- 🔄 **Session Management** - Persistent terminal sessions

### **Developer Experience**
- ⚡ **Fast & Lightweight** - Built with Rust and Tauri
- 🎯 **Keyboard Shortcuts** - Vim-inspired shortcuts for power users
- 🔧 **Extensible** - Plugin-ready architecture
- 📊 **Status Bar** - Real-time connection and file info

---

## 📦 Installation

### **Download Pre-built Binaries**

Visit the [Releases](https://github.com/Oghenesuvwe-dev/NemoCode-Studio/releases) page and download the appropriate version for your platform:

- **macOS**: Download `.dmg` file
- **Windows**: Download `.msi` or `.exe` installer
- **Linux**: Download `.deb` or `.AppImage` file

### **Build from Source**

#### Prerequisites

- **Node.js** 20+ and npm
- **Rust** 1.70+ (install via [rustup](https://rustup.rs/))
- **Ollama** (for AI features) - [Install Ollama](https://ollama.ai/)

#### Platform-specific dependencies

**macOS:**
```bash
# Xcode Command Line Tools
xcode-select --install
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.0-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

**Windows:**
- Install [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/Oghenesuvwe-dev/NemoCode-Studio.git
cd NemoCode-Studio/tauri-shell

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

---

## 🎯 Quick Start

1. **Install Ollama** (for AI features):
   ```bash
   # macOS/Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull a model
   ollama pull llama3.2:1b
   ```

2. **Launch NemoCode Studio**

3. **Open a workspace** - Click the folder icon or use `Cmd/Ctrl + O`

4. **Start coding with AI** - Use the chat panel on the right to interact with the AI assistant

---

## 🛠️ Development

### **Project Structure**

```
NemoCode-Studio/
├── tauri-shell/
│   ├── src/                    # React frontend
│   │   ├── components/         # UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── stores/             # Zustand state management
│   │   ├── styles/             # CSS and themes
│   │   └── utils/              # Utility functions
│   ├── src-tauri/              # Rust backend
│   │   └── src/
│   │       ├── agent.rs        # AI agent logic
│   │       ├── llm.rs          # LLM client
│   │       ├── rag.rs          # RAG system
│   │       ├── terminal.rs     # Terminal management
│   │       ├── error.rs        # Error handling
│   │       └── logging.rs      # Logging system
│   └── package.json
└── .github/
    └── workflows/              # CI/CD pipelines
```

### **Tech Stack**

**Frontend:**
- React 18 + TypeScript
- Zustand (state management)
- Monaco Editor (code editing)
- xterm.js (terminal emulation)
- Tailwind CSS (styling)

**Backend:**
- Rust + Tauri 2.0
- Tokio (async runtime)
- LanceDB (vector database for RAG)
- portable-pty (terminal emulation)

### **Available Scripts**

```bash
# Development
npm run dev              # Start dev server
npm run tauri dev        # Start Tauri app in dev mode

# Building
npm run build            # Build frontend
npm run tauri build      # Build Tauri app

# Code Quality
npm run lint             # Run ESLint
cargo check              # Check Rust code
cargo test               # Run Rust tests
cargo clippy             # Run Rust linter
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- Powered by [Ollama](https://ollama.ai/)
- Editor by [Monaco](https://microsoft.github.io/monaco-editor/)
- Terminal by [xterm.js](https://xtermjs.org/)

---

## 📧 Contact

**Oghenesuvwe** - [@Oghenesuvwe-dev](https://github.com/Oghenesuvwe-dev)

Project Link: [https://github.com/Oghenesuvwe-dev/NemoCode-Studio](https://github.com/Oghenesuvwe-dev/NemoCode-Studio)

---

<div align="center">

**Made with ❤️ and AI**

</div>
