# Simultaneous Frontend & Backend Memory Profiling

## Yes! They Can and Should Run Together

Running both simultaneously gives you the most realistic profiling because:
- ✅ **Real-world usage** - How users actually use the IDE
- ✅ **Interaction effects** - See how frontend/backend affect each other
- ✅ **Complete picture** - Identify leaks in both layers
- ✅ **Time efficient** - Profile everything in one session

---

## 🚀 Quick Start (Choose One)

### Option 1: Foreground (Interactive)
```bash
./PROFILE_BOTH.sh
```
- See backend output in real-time
- Stop with Ctrl+C
- Good for monitoring

### Option 2: Background (Recommended for Long Runs)
```bash
./PROFILE_BOTH_BACKGROUND.sh
```
- Runs in background
- Survives terminal close
- Perfect for overnight

### Option 3: Screen (Best for Remote)
```bash
screen -S memory_profile
./PROFILE_BOTH.sh
# Press Ctrl+A then D to detach
```

---

## 📊 What Happens

### Backend (Automatic):
1. ✅ Script starts backend with memory profiling
2. ✅ Logs every function call and memory usage
3. ✅ Saves to `logs/memory/backend_profile_TIMESTAMP.log`
4. ✅ Runs until you stop it (Ctrl+C)

### Frontend (Manual):
1. 📝 Script creates instructions file
2. 👤 You open IDE in Chrome
3. 👤 You open DevTools > Memory tab
4. 👤 You take heap snapshots
5. 👤 You use IDE normally
6. 👤 You compare snapshots

---

## 🎯 Step-by-Step Guide

### 1. Start Profiling
```bash
./PROFILE_BOTH.sh
```

### 2. Open IDE in Chrome
```
http://localhost:1420
```

### 3. Open Chrome DevTools
- Press `F12` or `Cmd+Option+I`
- Go to **Memory** tab

### 4. Take Initial Snapshot
- Click "Take snapshot" button
- Label it: "Initial - Clean State"
- Note the heap size (e.g., 300 MB)

### 5. Use IDE Normally (4-8 hours)
Do these actions repeatedly:
- ✅ Open 20-30 files
- ✅ Close files
- ✅ Use Find/Replace (Cmd+F)
- ✅ Use Global Search (Cmd+Shift+F)
- ✅ Create/close terminal tabs
- ✅ Use Monaco features (multi-cursor, folding)
- ✅ Send AI chat messages
- ✅ Toggle panels
- ✅ Navigate back/forward
- ✅ Use minimap

### 6. Take Snapshots Every Hour
| Time | Action |
|------|--------|
| Start | Take snapshot |
| 1h | Take snapshot |
| 2h | Take snapshot |
| 4h | Take snapshot |
| 8h | Take final snapshot |

### 7. Compare Snapshots
- Select final snapshot
- Change view to "Comparison"
- Select initial as baseline
- Look for leaks

### 8. Stop Profiling
```bash
# Press Ctrl+C in terminal
# Or if running in background:
kill $(cat logs/memory/profiling.pid)
```

---

## 📈 What to Look For

### Backend (Automatic Analysis):
```
Line #    Mem usage    Increment   Line Contents
================================================
   123    250.5 MiB    0.0 MiB     def process():
   124    350.5 MiB  100.0 MiB         data.append(obj)  # LEAK!
```

**Healthy**: Small increments (< 1 MiB), memory gets freed  
**Leak**: Large increments (> 10 MiB), memory never freed

### Frontend (Manual Analysis):
**Healthy**:
- Heap growth < 50 MB/hour
- Few detached nodes (< 10)
- Event listeners cleaned up

**Leak**:
- Heap growth > 100 MB/hour
- Many detached nodes (> 100)
- Growing object counts

---

## 📊 Expected Results

### Healthy Profile:
| Component | Start | 4h | 8h | Growth/hour |
|-----------|-------|----|----|-------------|
| Backend | 200 MB | 300 MB | 350 MB | ~20 MB/h ✅ |
| Frontend | 300 MB | 450 MB | 500 MB | ~25 MB/h ✅ |

### Unhealthy Profile (Leak):
| Component | Start | 4h | 8h | Growth/hour |
|-----------|-------|----|----|-------------|
| Backend | 200 MB | 600 MB | 1000 MB | ~100 MB/h ❌ |
| Frontend | 300 MB | 900 MB | 1500 MB | ~150 MB/h ❌ |

---

## 🛠️ Monitoring While Running

### Check Backend Status:
```bash
# Is it running?
ps aux | grep memory_profiler | grep -v grep

# Memory usage
ps aux | grep "python.*server.py" | grep -v grep

# Live log
tail -f logs/memory/backend_profile_*.log
```

### Check Frontend Status:
```bash
# In Chrome DevTools:
Performance Monitor > JS heap size
```

---

## 🛑 Stopping Profiling

### If Running in Foreground:
```bash
Press Ctrl+C
```

### If Running in Background:
```bash
kill $(cat logs/memory/profiling.pid)
```

### If Using Screen:
```bash
screen -r memory_profile
# Then Ctrl+C
```

---

## 📊 Analyzing Results

### Backend Results:
```bash
cat logs/memory/backend_profile_*.log | less
```

Look for:
- Functions with high memory usage
- Memory that keeps growing
- Specific line numbers

### Frontend Results:
1. Open Chrome DevTools > Memory
2. Select final snapshot
3. Change to "Comparison" view
4. Look for:
   - Detached DOM nodes
   - Growing arrays/objects
   - Event listeners
   - Timers

---

## 💡 Pro Tips

1. **Start overnight** - Best use of time
2. **Use IDE actively** - More realistic profiling
3. **Take hourly snapshots** - Track growth over time
4. **Don't restart** - Breaks the profile
5. **Save all snapshots** - For comparison later

---

## 📝 Quick Commands

```bash
# Start both (foreground)
./PROFILE_BOTH.sh

# Start both (background)
./PROFILE_BOTH_BACKGROUND.sh

# Check status
ps aux | grep memory_profiler | grep -v grep

# Monitor backend
tail -f logs/memory/backend_profile_*.log

# Stop
kill $(cat logs/memory/profiling.pid)

# View backend results
cat logs/memory/backend_profile_*.log

# View frontend instructions
cat logs/memory/frontend_profile_*.md
```

---

## 🎯 Success Criteria

### Backend:
- [x] Memory growth < 50 MB/hour
- [x] No continuous growth
- [x] Memory gets freed

### Frontend:
- [x] Heap growth < 50 MB/hour
- [x] Detached nodes < 10
- [x] Event listeners cleaned up
- [x] Timers cleared

---

## 📋 Checklist

### Before Starting:
- [x] Dependencies installed
- [x] Scripts ready
- [ ] Ready to use IDE for 4-8 hours
- [ ] Chrome browser ready
- [ ] Know how to take heap snapshots

### During Profiling:
- [ ] Backend profiling running
- [ ] IDE open in Chrome
- [ ] Initial snapshot taken
- [ ] Using IDE actively
- [ ] Taking hourly snapshots

### After Profiling:
- [ ] Final snapshot taken
- [ ] Snapshots compared
- [ ] Backend log analyzed
- [ ] Issues documented
- [ ] Fixes planned

---

## 🚀 Ready to Start?

Everything is prepared. When ready:

```bash
./PROFILE_BOTH.sh
```

Then open IDE in Chrome and follow the frontend instructions!

---

**Created**: December 3, 2025  
**Status**: Ready to run  
**Recommendation**: Run overnight for best results
