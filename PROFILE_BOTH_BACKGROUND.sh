#!/bin/bash

echo "🔍 Starting Full Memory Profiling (Background Mode)"
echo "===================================================="
echo ""

# Create logs directory
mkdir -p logs/memory

# Get timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Start backend profiling in background
nohup ./PROFILE_BOTH.sh > logs/memory/profiling_output_${TIMESTAMP}.log 2>&1 &
BACKEND_PID=$!

# Save PID
echo $BACKEND_PID > logs/memory/profiling.pid

echo "✅ Backend profiling started in background"
echo "   PID: $BACKEND_PID"
echo "   Output: logs/memory/profiling_output_${TIMESTAMP}.log"
echo ""
echo "📊 Frontend profiling instructions:"
echo "   1. Open IDE: http://localhost:1420"
echo "   2. Open Chrome DevTools (F12) > Memory tab"
echo "   3. Take initial heap snapshot"
echo "   4. Use IDE for 4-8 hours"
echo "   5. Take final heap snapshot"
echo "   6. Compare snapshots"
echo ""
echo "🛑 To stop profiling:"
echo "   kill $BACKEND_PID"
echo "   or: kill \$(cat logs/memory/profiling.pid)"
echo ""
echo "📈 To monitor:"
echo "   tail -f logs/memory/profiling_output_${TIMESTAMP}.log"
echo "   ps aux | grep memory_profiler"
echo ""
