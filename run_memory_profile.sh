#!/bin/bash

echo "🔍 NemoCode IDE - Memory Profiling"
echo "=================================="
echo ""

# Check if memory_profiler is installed
if ! python3 -c "import memory_profiler" 2>/dev/null; then
    echo "📦 Installing memory_profiler..."
    pip3 install memory_profiler psutil
    echo ""
fi

echo "✅ memory_profiler installed"
echo ""

# Create logs directory
mkdir -p logs/memory

# Get timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="logs/memory/backend_profile_${TIMESTAMP}.log"

echo "🚀 Starting backend with memory profiling..."
echo "📊 Profile will be saved to: ${LOG_FILE}"
echo ""
echo "⏱️  Recommended runtime: 4-8 hours for accurate profiling"
echo "💡 Tip: Use the IDE normally (open files, search, terminal, etc.)"
echo "🛑 To stop: Press Ctrl+C or run: kill \$(ps aux | grep 'memory_profiler' | grep -v grep | awk '{print \$2}')"
echo ""
echo "Starting in 3 seconds..."
sleep 3

# Run backend with memory profiling
cd backend
python3 -m memory_profiler server.py 2>&1 | tee "../${LOG_FILE}"
