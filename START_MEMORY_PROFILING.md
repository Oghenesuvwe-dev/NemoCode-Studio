# Start Memory Profiling - Ready to Run

## ✅ Everything is Prepared

All dependencies are installed and scripts are ready. You can start memory profiling with a single command.

---

## 🚀 Quick Start

### Option 1: Run in Foreground (Recommended for Testing)
```bash
./run_memory_profile.sh
```
- See output in real-time
- Stop with Ctrl+C
- Good for short tests (1-2 hours)

### Option 2: Run in Background (Recommended for Long Tests)
```bash
nohup ./run_memory_profile.sh > logs/memory/profiling_output.log 2>&1 &
echo $! > logs/memory/profiling.pid
```
- Runs in background
- Survives terminal close
- Good for overnight (8+ hours)

### Option 3: Run with Screen (Best for Remote)
```bash
screen -S memory_profile
./run_memory_profile.sh
# Press Ctrl+A then D to detach
# Reattach with: screen -r memory_profile
```

---

## 📊 What Will Happen

1. **Script starts** - Shows banner and info
2. **Backend launches** - With memory profiling enabled
3. **Logs created** - In `logs/memory/backend_profile_TIMESTAMP.log`
4. **Memory tracked** - Every function call logged
5. **You use IDE** - Open files, search, terminal, etc.
6. **Profile completes** - After you stop it (Ctrl+C)

---

## ⏱️ Recommended Duration

| Duration | Purpose | What It Catches |
|----------|---------|-----------------|
| 1 hour | Quick check | Obvious leaks |
| 4 hours | Standard | Most leaks |
| 8 hours | Thorough | Slow leaks |
| 24 hours | Production | All leaks |

**Recommendation**: Start with 4 hours

---

## 🎯 What to Do While Profiling

### Use the IDE Normally:
- ✅ Open 20-30 files
- ✅ Use Find/Replace multiple times
- ✅ Use Global Search
- ✅ Create/close terminal tabs
- ✅ Send AI chat messages
- ✅ Toggle panels
- ✅ Switch between tabs
- ✅ Use Monaco features

### Don't:
- ❌ Leave it idle (defeats the purpose)
- ❌ Run other heavy processes
- ❌ Restart the backend
- ❌ Close the IDE

---

## 📈 Monitoring Progress

### Check if Running:
```bash
ps aux | grep memory_profiler | grep -v grep
```

### Check Memory Usage (Live):
```bash
# Every 10 seconds
watch -n 10 'ps aux | grep "python.*server.py" | grep -v grep'
```

### View Log (Live):
```bash
tail -f logs/memory/backend_profile_*.log
```

### Check Log Size:
```bash
ls -lh logs/memory/
```

---

## 🛑 Stopping Profiling

### If Running in Foreground:
```bash
# Press Ctrl+C
```

### If Running in Background:
```bash
# Find PID
cat logs/memory/profiling.pid

# Or find manually
ps aux | grep memory_profiler | grep -v grep

# Kill it
kill <PID>
```

### If Using Screen:
```bash
screen -r memory_profile
# Then press Ctrl+C
```

---

## 📊 Analyzing Results

### After Profiling Completes:

1. **Check Log File**:
```bash
cat logs/memory/backend_profile_*.log
```

2. **Look for**:
   - Functions with high memory usage
   - Memory that keeps growing
   - Specific line numbers

3. **Example Output**:
```
Line #    Mem usage    Increment   Line Contents
================================================
   123    250.5 MiB    0.0 MiB     def process_request():
   124    250.5 MiB    0.0 MiB         data = []
   125    350.5 MiB  100.0 MiB         data.append(large_object)  # LEAK!
   126    350.5 MiB    0.0 MiB         return data
```

4. **Healthy Profile**:
   - Memory stays stable
   - Small increments (< 1 MiB per call)
   - Memory gets freed

5. **Unhealthy Profile (Leak)**:
   - Memory keeps growing
   - Large increments (> 10 MiB)
   - Memory never freed

---

## 🔧 What's Installed

### Python Packages:
- ✅ `memory_profiler` - Memory profiling tool
- ✅ `psutil` - System and process utilities

### Scripts:
- ✅ `run_memory_profile.sh` - Main profiling script
- ✅ Executable permissions set

### Directories:
- ✅ `logs/memory/` - Log storage

---

## 📝 Quick Commands Reference

```bash
# Start profiling (foreground)
./run_memory_profile.sh

# Start profiling (background)
nohup ./run_memory_profile.sh > logs/memory/profiling_output.log 2>&1 &

# Check if running
ps aux | grep memory_profiler | grep -v grep

# Monitor memory
watch -n 10 'ps aux | grep "python.*server.py" | grep -v grep'

# View log live
tail -f logs/memory/backend_profile_*.log

# Stop profiling
kill $(ps aux | grep memory_profiler | grep -v grep | awk '{print $2}')

# View results
cat logs/memory/backend_profile_*.log | less
```

---

## 🎯 Success Criteria

### Healthy Backend:
- Memory growth < 50 MB/hour
- Stable memory usage
- No continuous growth
- Memory gets freed

### Needs Fixing:
- Memory growth > 100 MB/hour
- Continuous growth
- Never freed memory
- Specific functions leaking

---

## 📋 Checklist Before Starting

- [x] Dependencies installed (`memory_profiler`, `psutil`)
- [x] Script ready (`run_memory_profile.sh`)
- [x] Logs directory created (`logs/memory/`)
- [x] Backend not currently running with profiling
- [ ] Ready to start profiling (your decision)
- [ ] Plan to use IDE for 4+ hours
- [ ] Know how to stop profiling

---

## 🚦 When to Start

### Good Times:
- 🌙 **Overnight** - Run 8+ hours while sleeping
- 🏢 **During work** - Run while doing other tasks
- 🧪 **Testing session** - Dedicated profiling time
- 📅 **Weekend** - Long uninterrupted run

### Bad Times:
- ⚡ **Need backend now** - Profiling adds overhead
- 🏃 **In a hurry** - Need at least 4 hours
- 💻 **Low resources** - Profiling uses extra CPU/RAM
- 🔄 **Frequent restarts** - Need stable run

---

## 💡 Pro Tips

1. **Start overnight** - Best use of time
2. **Use IDE actively** - More realistic profiling
3. **Don't restart** - Breaks the profile
4. **Check periodically** - Ensure it's still running
5. **Save results** - Keep logs for comparison

---

## 🎬 Ready to Start?

Everything is prepared. When you're ready:

```bash
./run_memory_profile.sh
```

Then use the IDE normally for 4-8 hours.

---

**Status**: ✅ Ready to run  
**Dependencies**: ✅ Installed  
**Scripts**: ✅ Prepared  
**Logs**: ✅ Directory created  
**Next**: Run when convenient (overnight recommended)

---

**Created**: December 3, 2025  
**Last Updated**: December 3, 2025, 11:55 PM
