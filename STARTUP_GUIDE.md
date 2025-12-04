# Nemo Code IDE - Startup Guide

## 🚀 Quick Start

### Easiest Way (Interactive Menu):
```bash
./run.sh
```
This will show you a menu to choose how to run the app.

---

## 📋 All Available Commands

### 1. Browser Development (Default)
```bash
./start.sh
```
- Opens in browser at `http://localhost:1420`
- Hot reload enabled
- DevTools available (F12)
- **Best for daily development**

### 2. Desktop Development
```bash
./start_desktop.sh
```
- Opens native desktop window
- Hot reload enabled
- Native OS integration
- **Best for testing desktop features**

### 3. Desktop Production
```bash
# First build it:
cd tauri-shell && npm run tauri build

# Then run it:
open tauri-shell/src-tauri/target/release/bundle/macos/tauri-shell.app
```
- Optimized production build
- No hot reload
- **Best for end users**

### 4. Backend Only
```bash
./start_backend.sh
```
- Starts Python backend on port 8000
- Useful if you want to run frontend separately

---

## 🎯 Which One Should I Use?

### For Development Work:
✅ **Use `./start.sh` (Browser)**
- Fastest hot reload
- Best debugging tools
- Easy to test changes

### For Testing Desktop Features:
✅ **Use `./start_desktop.sh`**
- Test native window behavior
- Test file dialogs
- Test OS integration

### For End Users:
✅ **Use the built app**
- Double-click the app icon
- No terminal needed
- Production-ready

---

## 📊 Current Architecture

**The project supports BOTH:**

1. **Browser-based** (Primary development)
   - React app runs in browser
   - Vite dev server on port 1420
   - Python backend on port 8000

2. **Desktop app** (Tauri)
   - Native macOS/Windows/Linux app
   - Same React frontend
   - Same Python backend
   - Better performance
   - Native OS integration

---

## 🔧 What `./start.sh` Does

Currently, `./start.sh` runs the **browser-based version**:

1. ✅ Starts Python backend (port 8000)
2. ✅ Starts Vite dev server (port 1420)
3. ✅ Opens in your browser
4. ✅ Hot reload enabled

**It does NOT start the Tauri desktop app.**

---

## 🖥️ To Run Desktop App

### Development Mode (with hot reload):
```bash
./start_desktop.sh
```

### Production Mode (built app):
```bash
# Build first (one time):
cd tauri-shell
npm run tauri build

# Then run:
open tauri-shell/src-tauri/target/release/bundle/macos/tauri-shell.app
```

---

## 📦 Build Locations

After running `npm run tauri build`, find your app at:

**macOS:**
- App: `tauri-shell/src-tauri/target/release/bundle/macos/tauri-shell.app`
- DMG: `tauri-shell/src-tauri/target/release/bundle/dmg/tauri-shell_0.1.0_x64.dmg`

**Windows:**
- EXE: `tauri-shell/src-tauri/target/release/tauri-shell.exe`
- MSI: `tauri-shell/src-tauri/target/release/bundle/msi/tauri-shell_0.1.0_x64.msi`

**Linux:**
- Binary: `tauri-shell/src-tauri/target/release/tauri-shell`
- AppImage: `tauri-shell/src-tauri/target/release/bundle/appimage/tauri-shell_0.1.0_amd64.AppImage`

---

## 🎮 Interactive Menu

Run `./run.sh` to see this menu:

```
╔════════════════════════════════════════╗
║     🚀 NemoCode IDE Launcher          ║
╚════════════════════════════════════════╝

How would you like to run the application?

  1) 🌐 Browser (Development)
  2) 🖥️  Desktop App (Development)
  3) 📦 Desktop App (Production)
  4) 🔨 Build Desktop App
  5) ❌ Exit
```

---

## 💡 Recommendations

### Daily Development:
```bash
./start.sh
```
Use browser mode for fastest iteration.

### Weekly Testing:
```bash
./start_desktop.sh
```
Test desktop features work correctly.

### Before Release:
```bash
cd tauri-shell && npm run tauri build
```
Build and test production version.

---

## 🐛 Troubleshooting

### "Backend not running"
```bash
./start_backend.sh
```

### "Port already in use"
```bash
# Kill backend
lsof -ti:8000 | xargs kill -9

# Kill frontend
lsof -ti:1420 | xargs kill -9
```

### "Tauri build fails"
```bash
# Update Rust
rustup update

# Clean and rebuild
cd tauri-shell
rm -rf src-tauri/target
npm run tauri build
```

---

## 📝 Summary

**Current Setup:**
- `./start.sh` → Browser development mode ✅
- `./start_desktop.sh` → Desktop development mode ✅
- `./run.sh` → Interactive menu ✅
- Built app → Production desktop app ✅

**You can use either browser OR desktop, both work!**

The browser version is faster for development, the desktop version is better for end users.

