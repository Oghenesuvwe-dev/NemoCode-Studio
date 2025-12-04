# Memory Profiling - Quick Brief

**Task**: TASK-016 Memory Profiling  
**Status**: 🟡 Tools Ready, Profiling Needed  
**Time Required**: 4-6 hours (mostly runtime)

---

## 🎯 What Is Memory Profiling?

Memory profiling identifies **memory leaks** - situations where memory is allocated but never freed, causing the application to consume more and more RAM over time until it crashes or slows down.

---

## 🔍 What We're Looking For

### Backend (Python):
- **Growing lists/dicts** that never get cleared
- **Unclosed file handles** or database connections
- **Thread leaks** - threads that don't terminate
- **Circular references** preventing garbage collection
- **Large objects** kept in memory unnecessarily

### Frontend (React/TypeScript):
- **Detached DOM nodes** - removed from page but still in memory
- **Event listeners** not removed when components unmount
- **Timers** (setInterval/setTimeout) not cleared
- **WebSocket connections** not closed
- **Monaco Editor instances** not disposed
- **Terminal instances** not cleaned up

---

## 📊 How It Works

### Backend Profiling:
```bash
# Run this script
./run_memory_profile.sh

# It will:
1. Install memory_profiler if needed
2. Start backend with profiling enabled
3. Log memory usage to logs/memory/
4. Run for 2-4 hours
```

**What to watch**: Memory should stay stable (~200-500 MB). If it grows continuously (>50 MB/hour), there's a leak.

### Frontend Profiling:
```
1. Open IDE in Chrome: http://localhost:1420
2. Open DevTools (F12) > Memory tab
3. Take "Heap Snapshot" (initial)
4. Use IDE normally for 1-2 hours:
   - Open/close files
   - Use search
   - Create/kill terminals
   - Toggle panels
5. Take another "Heap Snapshot" (final)
6. Compare snapshots
```

**What to watch**: Heap size should stay under 800 MB. Look for "Detached" nodes or growing object counts.

---

## ⚠️ Common Leaks We Might Find

### 1. Terminal Component Leak
**Problem**: Terminal instances not disposed when tabs close  
**Fix**: Ensure `term.dispose()` is called  
**Status**: Already looks good in code, but needs verification

### 2. Monaco Editor Leak
**Problem**: Editor instances not disposed when files close  
**Fix**: Call `editor.dispose()` in cleanup  
**Status**: Needs checking

### 3. useBackendConnection Hook Leak
**Problem**: WebSocket or intervals not cleaned up  
**Fix**: Ensure cleanup in useEffect return  
**Status**: Already looks good, but needs verification

### 4. Event Listener Leak
**Problem**: Window/document listeners not removed  
**Fix**: Remove listeners in useEffect cleanup  
**Status**: Needs checking

---

## 🚀 Quick Start

### Option 1: Start Backend Profiling Now
```bash
./run_memory_profile.sh
```
Then let it run for 4 hours while you work on other things.

### Option 2: Frontend Profiling (Manual)
Follow the guide in `FRONTEND_MEMORY_PROFILING.md`

### Option 3: Skip for Now
Memory profiling requires long runtime. We can:
- Move to UI/UX polish tasks
- Come back to profiling later
- Run it overnight

---

## 📈 Expected Results

### Healthy Profile:
```
Time    | Backend RAM | Frontend RAM
--------|-------------|-------------
Start   | 200 MB      | 300 MB
1 hour  | 250 MB      | 400 MB
2 hours | 280 MB      | 450 MB
4 hours | 320 MB      | 500 MB

Growth: ~30 MB/hour (acceptable)
```

### Unhealthy Profile (Leak):
```
Time    | Backend RAM | Frontend RAM
--------|-------------|-------------
Start   | 200 MB      | 300 MB
1 hour  | 400 MB      | 600 MB
2 hours | 600 MB      | 900 MB
4 hours | 1000 MB     | 1500 MB

Growth: ~200 MB/hour (LEAK!)
```

---

## 🔧 What Happens After Profiling

### If No Leaks Found:
✅ Mark TASK-016 complete  
✅ Backend stability is done!  
✅ Move to next phase

### If Leaks Found:
1. Identify the source (file/function)
2. Add cleanup code
3. Re-test for 1-2 hours
4. Verify leak is fixed

---

## ⏱️ Time Breakdown

| Activity | Time | Can Do Other Work? |
|----------|------|-------------------|
| Setup profiling | 5 min | No |
| Backend profiling | 4 hours | ✅ Yes - runs in background |
| Frontend profiling | 2 hours | ⚠️ Partial - need to use IDE |
| Analysis | 30 min | No |
| Fixes (if needed) | 1 hour | No |
| Re-test | 1 hour | ✅ Yes |

**Total**: 4-8 hours (but mostly waiting)

---

## 💡 Recommendation

### Best Approach:
1. **Start backend profiling now** (`./run_memory_profile.sh`)
2. **Let it run in background** (4 hours)
3. **Work on other tasks** (UI/UX polish, testing)
4. **Come back later** to analyze results
5. **Do frontend profiling** when convenient

### Why This Works:
- Backend profiling is passive (just runs)
- You can work on other tasks
- Frontend profiling can be done anytime
- Efficient use of time

---

## 📝 Quick Commands

### Start Backend Profiling:
```bash
./run_memory_profile.sh
```

### Check If Running:
```bash
ps aux | grep memory_profiler
```

### View Live Memory Usage:
```bash
# Backend
ps aux | grep "python.*server.py"

# Frontend (in browser)
Chrome DevTools > Performance Monitor
```

### Stop Profiling:
```bash
# Find process
ps aux | grep memory_profiler

# Kill it
kill <PID>
```

---

## 🎯 Bottom Line

**Memory profiling is important but time-consuming.**

**Options**:
1. ✅ **Start it now, work on other things** (recommended)
2. ⏸️ **Skip for now, do it later** (acceptable)
3. 🔄 **Run it overnight** (most efficient)

**My recommendation**: Start backend profiling now, move to UI/UX polish tasks, come back to analyze results in 4 hours.

---

**Status**: Tools ready, waiting for your decision  
**Files**: `run_memory_profile.sh`, `FRONTEND_MEMORY_PROFILING.md`  
**Next**: Your choice - start profiling or move to next phase?
