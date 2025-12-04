# NemoCode IDE — Setup Guide

Complete installation and configuration instructions.

---

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| OS | macOS 10.15+ / Windows 10+ / Ubuntu 20.04+ | macOS 12+ |
| RAM | 8 GB | 16 GB+ |
| Storage | 10 GB | 50 GB |
| Node.js | 18.x | 20.x |
| Python | 3.10+ | 3.11+ |
| Rust | 1.70+ | Latest |

---

## Step 1: Install Prerequisites

### macOS

```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Python
brew install python@3.11

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Ollama
brew install ollama
```

### Windows

```powershell
# Install Node.js from https://nodejs.org
# Install Python from https://python.org
# Install Rust from https://rustup.rs
# Install Ollama from https://ollama.ai
```

### Linux (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install python3.11 python3.11-venv python3-pip

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh
```

---

## Step 2: Install Ollama Model

```bash
# Start Ollama service
ollama serve

# Pull the model (in new terminal)
ollama pull llama3.1

# Verify installation
ollama list
```

Expected output:
```
NAME            SIZE
llama3.1        4.7 GB
```

---

## Step 3: Clone Repository

```bash
git clone https://github.com/your-repo/nemocode-ide.git
cd nemocode-ide
```

---

## Step 4: Install Frontend

```bash
cd tauri-shell

# Install dependencies
npm install

# Verify Tauri CLI
npm run tauri --version
```

---

## Step 5: Install Backend

```bash
cd ../backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt
```

---

## Step 6: Start the Application

### Terminal 1 — Backend

```bash
cd backend
source venv/bin/activate
python server.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Terminal 2 — Frontend

```bash
cd tauri-shell
npm run tauri dev
```

The IDE window will open automatically.

---

## Verify Installation

### Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected:
```json
{"status": "ok", "model": "llama3.1"}
```

### Frontend Check

1. Open the IDE
2. Click the chat icon in the sidebar
3. Type "Hello" and press Enter
4. You should receive an AI response

---

## Configuration

### Change AI Model

Edit `backend/server.py`:

```python
MODEL_NAME = "llama3.1"  # Change to your preferred model
```

Available models:
- `llama3.1` — Default, balanced
- `llama3.1:70b` — Larger, better quality
- `mistral` — Fast, good for code
- `codellama` — Optimized for coding

### Change Backend URL

In the IDE:
1. Open Settings (gear icon)
2. Update "Backend URL" field
3. Click Save

### Environment Variables

Create `.env` in the `backend/` folder:

```env
OLLAMA_HOST=http://localhost:11434
LOG_LEVEL=INFO
RAG_ENABLED=true
```

---

## Troubleshooting

### "Connection Refused" Error

**Cause:** Backend not running

**Fix:**
```bash
cd backend
python server.py
```

### "Model Not Found" Error

**Cause:** Ollama model not pulled

**Fix:**
```bash
ollama pull llama3.1
```

### Slow Responses

**Cause:** Large model or insufficient RAM

**Fix:**
- Use smaller model: `ollama pull llama3.1:8b`
- Close other applications
- Increase swap space

### Frontend Won't Start

**Cause:** Missing Rust or Tauri dependencies

**Fix:**
```bash
# macOS
xcode-select --install

# Linux
sudo apt install libwebkit2gtk-4.0-dev build-essential
```

### Port Already in Use

**Cause:** Another process on port 8000

**Fix:**
```bash
# Find process
lsof -i :8000

# Kill it
kill -9 <PID>
```

---

## Development Mode

### Hot Reload (Frontend)

```bash
cd tauri-shell
npm run dev
```

Changes to React components will auto-refresh.

### Debug Backend

```bash
cd backend
LOG_LEVEL=DEBUG python server.py
```

### Build for Production

```bash
cd tauri-shell
npm run tauri build
```

Output: `tauri-shell/src-tauri/target/release/`

---

## Project Structure

```
nemocode-ide/
├── tauri-shell/              # Desktop application
│   ├── src/                  # React frontend
│   │   ├── components/       # UI components
│   │   ├── App.tsx           # Main app
│   │   └── main.tsx          # Entry point
│   ├── src-tauri/            # Rust backend
│   │   ├── src/lib.rs        # Tauri commands
│   │   └── tauri.conf.json   # Tauri config
│   └── package.json
│
├── backend/                  # Python AI backend
│   ├── server.py             # FastAPI server
│   ├── agent.py              # AI agent logic
│   ├── rag.py                # RAG engine
│   └── requirements.txt
│
├── README.md
├── SETUP.md
├── CHANGELOG.md
└── ROADMAP.md
```

---

## Next Steps

1. Read the [Changelog](./CHANGELOG.md) for feature history
2. Check the [Roadmap](./ROADMAP.md) for upcoming features
3. Explore the IDE and try the AI assistant
