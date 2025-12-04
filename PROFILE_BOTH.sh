#!/bin/bash

echo "🔍 NemoCode IDE - Full Memory Profiling"
echo "========================================"
echo ""
echo "This will profile BOTH frontend and backend simultaneously"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create logs directory
mkdir -p logs/memory

# Get timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKEND_LOG="logs/memory/backend_profile_${TIMESTAMP}.log"
FRONTEND_LOG="logs/memory/frontend_profile_${TIMESTAMP}.md"

echo -e "${BLUE}📦 Checking dependencies...${NC}"

# Check if memory_profiler is installed
if ! python3 -c "import memory_profiler" 2>/dev/null; then
    echo "Installing memory_profiler..."
    pip3 install memory_profiler psutil
fi

echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""

# Create frontend profiling instructions
cat > "${FRONTEND_LOG}" << 'EOF'
# Frontend Memory Profiling Session

**Started**: $(date)
**Duration**: 4-8 hours recommended

---

## 📋 Instructions

### 1. Open Chrome DevTools
1. Open IDE in browser: http://localhost:1420
2. Press F12 or Cmd+Option+I
3. Go to **Memory** tab

### 2. Take Initial Snapshot
1. Click "Take snapshot"
2. Label: "Initial - Clean State"
3. Note heap size: _______ MB

### 3. Use IDE for 4-8 Hours
Perform these actions repeatedly:
- [ ] Open 20-30 files
- [ ] Close files
- [ ] Use Find/Replace (Cmd+F)
- [ ] Use Global Search (Cmd+Shift+F)
- [ ] Create/close terminal tabs
- [ ] Use Monaco editor features
- [ ] Send AI chat messages
- [ ] Toggle panels (sidebar, chat, terminal)
- [ ] Navigate back/forward
- [ ] Use multi-cursor editing

### 4. Take Snapshots Every Hour
| Time | Heap Size | Notes |
|------|-----------|-------|
| Start | _____ MB | Initial |
| 1h | _____ MB | |
| 2h | _____ MB | |
| 3h | _____ MB | |
| 4h | _____ MB | |
| 5h | _____ MB | |
| 6h | _____ MB | |
| 7h | _____ MB | |
| 8h | _____ MB | Final |

### 5. Take Final Snapshot
1. Click "Take snapshot"
2. Label: "Final - After X hours"
3. Note heap size: _______ MB

### 6. Compare Snapshots
1. Select final snapshot
2. Change view to "Comparison"
3. Select initial snapshot as baseline
4. Look for:
   - Detached DOM nodes (red flag)
   - Growing arrays/objects
   - Event listeners not cleaned up
   - Timers still running

---

## 📊 Results

### Memory Growth:
- Initial: _______ MB
- Final: _______ MB
- Growth: _______ MB
- Duration: _______ hours
- Growth Rate: _______ MB/hour

### Status:
- [ ] ✅ Healthy (< 50 MB/hour)
- [ ] ⚠️ Concerning (50-100 MB/hour)
- [ ] ❌ Leak (> 100 MB/hour)

### Detached Nodes:
- Count: _______
- Sources: _______________________

### Issues Found:
1. _______________________
2. _______________________
3. _______________________

### Actions Needed:
- [ ] No issues found
- [ ] Fix event listeners
- [ ] Fix timers
- [ ] Fix component cleanup
- [ ] Fix Monaco editor disposal
- [ ] Fix terminal disposal

---

**Completed**: _______
**Analyzed By**: _______
EOF

echo -e "${BLUE}📊 Starting Backend Profiling...${NC}"
echo "   Log: ${BACKEND_LOG}"
echo ""

echo -e "${BLUE}📊 Frontend Profiling Instructions Created...${NC}"
echo "   Guide: ${FRONTEND_LOG}"
echo ""

echo -e "${YELLOW}⏱️  Recommended: Run for 4-8 hours${NC}"
echo ""
echo -e "${GREEN}🎯 What to do now:${NC}"
echo "   1. Backend profiling will start automatically"
echo "   2. Open the IDE in Chrome: http://localhost:1420"
echo "   3. Follow instructions in: ${FRONTEND_LOG}"
echo "   4. Use the IDE normally for 4-8 hours"
echo "   5. Press Ctrl+C when done"
echo ""
echo -e "${YELLOW}💡 Tip: The more you use the IDE, the better the profiling!${NC}"
echo ""
echo "Starting in 5 seconds..."
sleep 5

# Start backend profiling
cd backend
python3 -m memory_profiler server.py 2>&1 | tee "../${BACKEND_LOG}"
