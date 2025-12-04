# Testing Checklist - Backend & Terminal Fixes

## Current Status
- ✅ Backend running on port 8000 (Process ID: 4)
- ✅ Frontend running on port 1420 (Process ID: 11)
- ✅ Backend receiving health checks from frontend (confirmed in logs)
- ✅ Capabilities file updated with shell permissions
- ✅ App recompiled with new permissions

## Test 1: Backend Connection

### What to Check:
1. Open the app (should already be open at http://localhost:1420)
2. Look at the top banner

### Expected Results:
- ✅ **GOOD**: No "Backend disconnected" banner
- ✅ **GOOD**: No "Reconnecting..." message
- ⚠️ **IF STILL SHOWING**: Try these steps:
  1. Click "Retry Now" button
  2. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
  3. Check browser console (F12) for errors

### Why It Should Work:
- Backend logs show successful health check responses (200 OK)
- Frontend is polling backend every few seconds
- Connection hook bug was fixed

---

## Test 2: Terminal Initialization

### What to Check:
1. Click on "Terminal" tab at the bottom
2. OR press Cmd+J (Mac) / Ctrl+J (Windows)

### Expected Results:
- ✅ **GOOD**: See "NemoCode Terminal" header in cyan
- ✅ **GOOD**: See a shell prompt (like `machine@Machines-MBP ~ %`)
- ✅ **GOOD**: Cursor blinking, ready for input
- ❌ **BAD**: "Terminal initialization failed. Please check Tauri permissions."

### If Terminal Still Fails:
1. **Check Browser Console** (F12 → Console tab)
   - Look for errors mentioning "spawn", "shell", or "permission"
   - Copy any error messages

2. **Check Tauri Console** (the terminal where you ran the app)
   - Look for "Scoped command" errors
   - Look for permission denied errors

3. **Verify Shell Paths**:
   ```bash
   which zsh
   which bash
   which sh
   ```
   - Should show `/bin/zsh`, `/bin/bash`, `/bin/sh`
   - If different paths, we need to update capabilities

---

## Test 3: Terminal Functionality (If Terminal Opens)

### What to Test:
1. Type: `echo "Hello from NemoCode"`
2. Press Enter
3. Type: `pwd`
4. Press Enter
5. Type: `ls`
6. Press Enter

### Expected Results:
- ✅ Commands execute and show output
- ✅ No errors or permission issues
- ✅ Terminal responds normally

---

## Debugging Commands

If issues persist, run these in your system terminal:

```bash
# Check if processes are running
ps aux | grep "python3 server.py"
ps aux | grep "tauri-shell"

# Test backend directly
curl http://localhost:8000/health

# Check shell availability
which zsh bash sh
ls -la /bin/zsh /bin/bash /bin/sh

# Check Tauri process output
# (Already being monitored via getProcessOutput)
```

---

## What I Can See From Logs

### Backend (✅ Working):
```
INFO: 127.0.0.1:53881 - "GET /health HTTP/1.1" 200 OK
INFO: 127.0.0.1:53868 - "GET /health HTTP/1.1" 200 OK
```
- Backend is responding successfully
- Frontend IS connecting (two different connection ports)
- Health checks happening regularly

### Frontend (✅ Running):
```
VITE v7.2.4  ready in 962 ms
➜  Local:   http://localhost:1420/
Finished `dev` profile [unoptimized + debuginfo] target(s) in 3.17s
Running `target/debug/tauri-shell`
```
- Vite dev server running
- Tauri app compiled and running
- No compilation errors

### Terminal (❓ Unknown):
- No "Scoped command not found" errors (good sign!)
- No spawn errors in logs (good sign!)
- But can't confirm if it's actually working without seeing the UI

---

## Next Steps Based on Results

### If Backend Still Shows "Reconnecting":
1. This is likely a UI state issue
2. The connection IS working (logs prove it)
3. Try hard refresh or click "Retry Now"
4. May need to clear React state or add better connection detection

### If Terminal Still Fails:
1. Need to see the actual error message from browser console
2. May need to adjust shell paths in capabilities
3. May need different permission format
4. Could be a Tauri v2 API change we're missing

### If Both Work:
1. 🎉 Success! Document the working configuration
2. Update documentation with correct setup
3. Consider adding better error messages
4. Move on to memory profiling

---

## Report Back

Please test and let me know:
1. ✅ or ❌ Backend connection status
2. ✅ or ❌ Terminal initialization status
3. Any error messages from browser console (F12)
4. Any error messages from Tauri console

This will help me determine the next fix!
