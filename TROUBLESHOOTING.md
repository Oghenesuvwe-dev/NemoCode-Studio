# NemoCode IDE - Troubleshooting Guide

This guide helps you resolve common issues with NemoCode IDE.

---

## Table of Contents

1. [Backend Connection Issues](#backend-connection-issues)
2. [File Operation Errors](#file-operation-errors)
3. [Performance Issues](#performance-issues)
4. [AI Features Issues](#ai-features-issues)
5. [Terminal Issues](#terminal-issues)
6. [Search & Navigation Issues](#search--navigation-issues)
7. [Installation Issues](#installation-issues)
8. [FAQ](#faq)

---

## Backend Connection Issues

### Backend Won't Start

**Symptoms:**
- "Backend not responding" message
- Red connection indicator in status bar
- No AI responses

**Solutions:**

1. **Check if backend is running:**
   ```bash
   # Check if process is running
   ps aux | grep python | grep server.py
   ```

2. **Start backend manually:**
   ```bash
   cd backend
   python server.py
   ```

3. **Check for port conflicts:**
   ```bash
   # Check if port 8000 is in use
   lsof -i :8000
   
   # Kill process using port 8000
   kill -9 <PID>
   ```

4. **Check Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

5. **Check logs:**
   ```bash
   tail -f backend/logs/server.log
   ```

---

### Connection Refused / Timeout

**Symptoms:**
- "Failed to connect to backend" error
- Requests timeout after 5 seconds

**Solutions:**

1. **Verify backend URL:**
   - Default: `http://localhost:8000`
   - Check Settings → Backend URL

2. **Check firewall:**
   ```bash
   # macOS
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
   
   # Allow Python through firewall
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/bin/python3
   ```

3. **Test backend directly:**
   ```bash
   curl http://localhost:8000/health
   # Should return: {"status": "healthy"}
   ```

4. **Restart backend:**
   ```bash
   # Kill existing backend
   pkill -f "python.*server.py"
   
   # Start fresh
   cd backend && python server.py
   ```

---

### Backend Crashes Frequently

**Symptoms:**
- Backend stops responding after a few minutes
- Memory usage keeps increasing
- "Agent health check failed" messages

**Solutions:**

1. **Check memory usage:**
   ```bash
   # Monitor backend memory
   ps aux | grep python | grep server.py
   ```

2. **Enable agent health monitoring:**
   - Already enabled by default
   - Check `backend/health_monitor.py` logs

3. **Reduce concurrent requests:**
   - Settings → Max Concurrent Requests → 3

4. **Clear ChromaDB cache:**
   ```bash
   rm -rf backend/chroma_db/*
   ```

5. **Update dependencies:**
   ```bash
   cd backend
   pip install --upgrade -r requirements.txt
   ```

---

## File Operation Errors

### Can't Open File

**Symptoms:**
- "Failed to open file" error
- File appears in explorer but won't open

**Solutions:**

1. **Check file permissions:**
   ```bash
   ls -la /path/to/file
   chmod 644 /path/to/file  # Make readable
   ```

2. **Check file size:**
   - Files > 10MB may be slow to open
   - Consider using external editor for very large files

3. **Check file encoding:**
   - Only UTF-8 files are fully supported
   - Binary files may not display correctly

4. **Restart the app:**
   - Sometimes file handles get stuck
   - Cmd+Q and reopen

---

### Permission Denied

**Symptoms:**
- "Permission denied" when saving
- "Failed to create file/folder"

**Solutions:**

1. **Check folder permissions:**
   ```bash
   ls -la /path/to/workspace
   chmod 755 /path/to/workspace  # Make writable
   ```

2. **Run with proper permissions:**
   - Don't run as root unless necessary
   - Check workspace is not in protected directory

3. **Check disk space:**
   ```bash
   df -h
   ```

---

### Save Failed

**Symptoms:**
- "Failed to save file" error
- Changes not persisting

**Solutions:**

1. **Check file is not read-only:**
   ```bash
   ls -la /path/to/file
   chmod 644 /path/to/file
   ```

2. **Check disk space:**
   ```bash
   df -h /path/to/workspace
   ```

3. **Close other programs:**
   - Another program may have file locked
   - Close IDEs, text editors using same file

4. **Try "Save As":**
   - File → Save As
   - Save to different location

---

## Performance Issues

### Slow Loading

**Symptoms:**
- App takes > 10 seconds to start
- File tree takes long to load
- Search is very slow

**Solutions:**

1. **Reduce workspace size:**
   - Exclude `node_modules`, `dist`, `build` folders
   - Use search filters to exclude large directories

2. **Clear cache:**
   ```bash
   # Clear browser cache (if using web version)
   # Or restart app
   ```

3. **Check system resources:**
   ```bash
   # macOS
   top -o cpu
   top -o mem
   ```

4. **Disable unnecessary features:**
   - Settings → Disable file watcher
   - Settings → Reduce search result limit

---

### High Memory Usage

**Symptoms:**
- App uses > 2GB RAM
- System becomes slow
- "Out of memory" errors

**Solutions:**

1. **Close unused tabs:**
   - Each open file uses memory
   - Close tabs you're not using

2. **Reduce search results:**
   - Settings → Max Search Results → 100

3. **Restart the app:**
   - Memory leaks may accumulate
   - Restart clears memory

4. **Check backend memory:**
   ```bash
   ps aux | grep python | grep server.py
   # If > 1GB, restart backend
   ```

---

### UI Freezing

**Symptoms:**
- UI becomes unresponsive
- Typing has lag
- Can't click buttons

**Solutions:**

1. **Check for infinite loops:**
   - Open DevTools (Cmd+Option+I)
   - Check Console for errors

2. **Reduce file size:**
   - Files > 10,000 lines may cause lag
   - Split into smaller files

3. **Disable syntax highlighting:**
   - For very large files
   - Settings → Disable Syntax Highlighting

4. **Restart the app:**
   - Cmd+Q and reopen

---

## AI Features Issues

### AI Not Responding

**Symptoms:**
- No response after sending message
- "Thinking..." never completes
- Timeout errors

**Solutions:**

1. **Check backend connection:**
   - Look for green indicator in status bar
   - If red, see [Backend Connection Issues](#backend-connection-issues)

2. **Check Ollama is running:**
   ```bash
   # Check if Ollama is running
   ps aux | grep ollama
   
   # Start Ollama
   ollama serve
   ```

3. **Check model is downloaded:**
   ```bash
   ollama list
   # Should show llama3.1 or your selected model
   
   # Download if missing
   ollama pull llama3.1
   ```

4. **Check backend logs:**
   ```bash
   tail -f backend/logs/server.log
   ```

---

### Slow AI Responses

**Symptoms:**
- AI takes > 30 seconds to respond
- Responses are incomplete

**Solutions:**

1. **Use smaller model:**
   - Settings → Model → llama3.1:8b (instead of 70b)

2. **Reduce context size:**
   - Settings → Max Context Files → 5

3. **Check system resources:**
   ```bash
   # Ollama needs significant CPU/RAM
   top -o cpu
   ```

4. **Close other applications:**
   - Free up CPU/RAM for Ollama

---

### Incorrect AI Suggestions

**Symptoms:**
- AI gives wrong answers
- Suggestions don't match context
- Hallucinations

**Solutions:**

1. **Provide more context:**
   - Attach relevant files to chat
   - Be specific in your questions

2. **Use better model:**
   - Settings → Model → llama3.1:70b (if you have resources)

3. **Clear chat history:**
   - Start new conversation
   - Previous context may be confusing AI

4. **Update RAG database:**
   ```bash
   rm -rf backend/chroma_db/*
   # Restart backend to rebuild
   ```

---

## Terminal Issues

### Terminal Won't Open

**Symptoms:**
- Terminal panel is blank
- "Failed to spawn shell" error

**Solutions:**

1. **Check shell exists:**
   ```bash
   which zsh
   which bash
   ```

2. **Check Tauri permissions:**
   - File: `tauri-shell/src-tauri/capabilities/default.json`
   - Ensure `shell:allow-execute` is present

3. **Try different shell:**
   - Settings → Terminal → Shell → /bin/bash

4. **Check logs:**
   - Open DevTools (Cmd+Option+I)
   - Check Console for errors

---

### Terminal Commands Not Working

**Symptoms:**
- Commands don't execute
- No output shown
- Terminal freezes

**Solutions:**

1. **Check shell is running:**
   ```bash
   ps aux | grep zsh
   ```

2. **Restart terminal:**
   - Click trash icon to kill terminal
   - Click + to create new terminal

3. **Check PATH:**
   ```bash
   echo $PATH
   # Should include /usr/local/bin, /usr/bin, etc.
   ```

4. **Try simple command:**
   ```bash
   echo "test"
   # If this works, issue is with specific command
   ```

---

### Can't Copy/Paste in Terminal

**Symptoms:**
- Cmd+C/Cmd+V don't work
- Right-click menu doesn't appear

**Solutions:**

1. **Use right-click menu:**
   - Right-click in terminal
   - Select Copy or Paste

2. **Check keyboard shortcuts:**
   - Settings → Keyboard Shortcuts
   - Verify Cmd+C/Cmd+V are mapped

3. **Try alternative shortcuts:**
   - Ctrl+Shift+C (copy)
   - Ctrl+Shift+V (paste)

---

## Search & Navigation Issues

### Search Not Finding Files

**Symptoms:**
- Search returns no results
- Files exist but don't appear in search

**Solutions:**

1. **Check search filters:**
   - Click filter icon
   - Verify include/exclude patterns
   - Clear filters if needed

2. **Check file extensions:**
   - Only certain extensions are searched by default
   - Add your extension to include pattern: `*.yourext`

3. **Rebuild file index:**
   - Close and reopen workspace
   - File → Refresh File Tree

4. **Check file is not excluded:**
   - Default excludes: `node_modules`, `dist`, `build`, `.git`

---

### Replace Not Working

**Symptoms:**
- Replace button doesn't work
- "Failed to replace" error
- No replacements made

**Solutions:**

1. **Check file permissions:**
   ```bash
   ls -la /path/to/file
   chmod 644 /path/to/file
   ```

2. **Check regex pattern:**
   - Invalid regex will fail silently
   - Test pattern in regex tester first

3. **Check match exists:**
   - Verify search finds matches first
   - Then try replace

4. **Try single replace first:**
   - Don't use "Replace All" immediately
   - Test with single replace

---

### Go to Definition Not Working

**Symptoms:**
- Cmd+Click does nothing
- "Definition not found" message

**Solutions:**

1. **Check file type:**
   - Only works for TypeScript, Python, JavaScript
   - Other languages use text search fallback

2. **Check symbol exists:**
   - Symbol must be defined in workspace
   - External libraries may not work

3. **Rebuild symbol index:**
   - Close and reopen workspace

---

## Installation Issues

### App Won't Start

**Symptoms:**
- Double-click does nothing
- App crashes immediately
- "Damaged app" error on macOS

**Solutions:**

1. **macOS: Remove quarantine:**
   ```bash
   xattr -cr /Applications/NemoCode.app
   ```

2. **Check system requirements:**
   - macOS 10.15+ or Windows 10+
   - 4GB RAM minimum
   - 500MB disk space

3. **Reinstall:**
   ```bash
   # Remove old installation
   rm -rf /Applications/NemoCode.app
   
   # Download and install fresh copy
   ```

---

### Dependencies Missing

**Symptoms:**
- "Module not found" errors
- Backend won't start
- Import errors

**Solutions:**

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Install Node dependencies (for development):**
   ```bash
   cd tauri-shell
   npm install
   ```

3. **Install Ollama:**
   ```bash
   # macOS
   brew install ollama
   
   # Or download from https://ollama.ai
   ```

---

## FAQ

### Q: How do I update NemoCode IDE?

**A:** Download the latest version from GitHub releases and replace the old app. Your settings and workspace will be preserved.

---

### Q: Can I use a different AI model?

**A:** Yes! Settings → Model → Select from dropdown. You can use any Ollama-compatible model.

---

### Q: How do I change the theme?

**A:** Settings → Theme → Select Dark, Light, or High Contrast.

---

### Q: Can I use NemoCode with remote servers?

**A:** Not yet. Remote development is planned for a future release.

---

### Q: How do I report a bug?

**A:** Open an issue on GitHub: https://github.com/yourusername/nemocode/issues

Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Console logs (Cmd+Option+I → Console)

---

### Q: Is my code sent to external servers?

**A:** No. All AI processing happens locally using Ollama. Your code never leaves your machine.

---

### Q: How much disk space does NemoCode use?

**A:** 
- App: ~200MB
- Backend: ~100MB
- Ollama models: 4-40GB depending on model
- ChromaDB cache: ~100MB per workspace

---

### Q: Can I use NemoCode for commercial projects?

**A:** Yes! NemoCode is open source under MIT license.

---

### Q: How do I backup my settings?

**A:** Settings are stored in:
- macOS: `~/Library/Application Support/com.nemocode.app/`
- Windows: `%APPDATA%/com.nemocode.app/`

Copy this folder to backup.

---

### Q: Why is the first AI response slow?

**A:** The first response loads the model into memory. Subsequent responses are faster. This is normal Ollama behavior.

---

### Q: Can I disable AI features?

**A:** Yes. Settings → Disable AI Assistant. The IDE will work as a regular code editor.

---

### Q: How do I clear all data?

**A:**
```bash
# macOS
rm -rf ~/Library/Application\ Support/com.nemocode.app/
rm -rf backend/chroma_db/
rm -rf backend/logs/

# Windows
rmdir /s %APPDATA%\com.nemocode.app
rmdir /s backend\chroma_db
rmdir /s backend\logs
```

---

## Still Having Issues?

If none of these solutions work:

1. **Check GitHub Issues:** https://github.com/yourusername/nemocode/issues
2. **Open DevTools:** Cmd+Option+I → Console → Look for errors
3. **Check Logs:**
   - Backend: `backend/logs/server.log`
   - Frontend: DevTools Console
4. **Create Issue:** Include error messages, steps to reproduce, and system info

---

## System Information

To help with troubleshooting, gather this info:

```bash
# macOS
sw_vers
python3 --version
node --version
ollama --version

# Check running processes
ps aux | grep -E "python|ollama|nemocode"

# Check ports
lsof -i :8000
```

Include this information when reporting issues.

---

*Last Updated: December 3, 2025*
