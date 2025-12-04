# 🚀 NemoCode IDE - Setup & Startup Guide

## ✅ Current Status
- **All 131 tasks complete (100%)**
- **Backend dependencies installed**
- **Ready for v1.0 release**

---

## 🔧 Backend Setup

### Python Environment
The project uses **Python 3.11** (recommended) with all dependencies installed.

**Available Python versions:**
- Python 3.11 ✅ (fully configured)
- Python 3.13 (msgpack installed)
- Python 3.14 (msgpack installed)

### Required Dependencies
All packages from `backend/requirements.txt` are installed:
- msgpack (IPC serialization)
- fastapi + uvicorn (web framework)
- langchain ecosystem (AI/ML)
- chromadb (vector database)
- Cloud SDKs (AWS, Azure, GCP)
- Web tools (Playwright, BeautifulSoup)

---

## 🚀 Starting the Backend

### Option 1: Using the Startup Script (Recommended)
```bash
./start_backend.sh
```

This script:
- ✅ Verifies Python 3.11 is available
- ✅ Checks msgpack is installed
- ✅ Starts the backend server
- ✅ Handles errors gracefully

### Option 2: Manual Startup
```bash
/usr/local/bin/python3.11 backend/server.py
```

### Option 3: Using Python Directly
```bash
python3.11 backend/server.py
```

---

## 📋 Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'msgpack'"

**Solution 1: Use Python 3.11**
```bash
/usr/local/bin/python3.11 backend/server.py
```

**Solution 2: Install msgpack for your Python version**
```bash
python3 -m pip install msgpack
```

**Solution 3: Install all requirements**
```bash
python3 -m pip install -r backend/requirements.txt
```

### Issue: "Python not found"

Check available Python versions:
```bash
ls -la /usr/local/bin/python*
```

Use the full path to Python:
```bash
/usr/local/bin/python3.11 backend/server.py
```

### Issue: "Permission denied" on start_backend.sh

Make it executable:
```bash
chmod +x start_backend.sh
```

---

## 🎯 Full Stack Startup

### Terminal 1: Backend Server
```bash
./start_backend.sh
# or
/usr/local/bin/python3.11 backend/server.py
```

### Terminal 2: Frontend Development Server
```bash
cd tauri-shell
npm run dev
```

### Terminal 3: Tauri App (Optional)
```bash
cd tauri-shell
npm run tauri dev
```

---

## 📊 Project Structure

```
NemoCode-IDE/
├── backend/                    # Python backend
│   ├── server.py              # Main server
│   ├── requirements.txt        # Python dependencies
│   ├── agent.py               # AI agent
│   ├── swarm.py               # Multi-agent coordination
│   └── ...
├── tauri-shell/               # Frontend (React + Tauri)
│   ├── src/
│   ├── package.json
│   └── ...
├── start_backend.sh           # Backend startup script
└── SETUP_GUIDE.md            # This file
```

---

## ✅ Verification Checklist

Before starting the application:

- [ ] Python 3.11 is installed: `which python3.11`
- [ ] msgpack is available: `python3.11 -c "import msgpack"`
- [ ] Backend requirements installed: `python3.11 -m pip list | grep fastapi`
- [ ] Node.js is installed: `node --version`
- [ ] npm is installed: `npm --version`
- [ ] start_backend.sh is executable: `ls -la start_backend.sh`

---

## 🎉 Success Indicators

### Backend Started Successfully
```
🐍 Starting Server...
✅ Server running on http://localhost:8000
```

### Frontend Started Successfully
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Full Stack Running
- Backend API: http://localhost:8000
- Frontend: http://localhost:5173
- Tauri App: Native window (if running)

---

## 📚 Additional Resources

- **Backend Documentation**: See `backend/server.py` for API endpoints
- **Frontend Documentation**: See `tauri-shell/README.md`
- **Task Tracking**: See `REMAINING_TASKS.md` (all 131 tasks complete ✅)
- **Progress**: See `PRIORITY_TASKS.md` and `STABILITY_ROADMAP.md`

---

## 🔗 Quick Links

- **Start Backend**: `./start_backend.sh`
- **Start Frontend**: `cd tauri-shell && npm run dev`
- **View Tasks**: `REMAINING_TASKS.md`
- **Check Status**: `PRIORITY_TASKS.md`

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify Python version: `python3.11 --version`
3. Check dependencies: `python3.11 -m pip list`
4. Review error logs in terminal output
5. Ensure all ports are available (8000 for backend, 5173 for frontend)

---

**Last Updated**: December 2, 2025  
**Status**: ✅ Ready for v1.0 Release  
**All Tasks**: 131/131 Complete (100%)
