#!/bin/bash
# Quick start script for memory profiling
# Usage: ./QUICK_START_PROFILING.sh

echo "🚀 Starting Memory Profiling..."
echo ""
echo "This will:"
echo "  1. Install dependencies (if needed)"
echo "  2. Start backend with memory profiling"
echo "  3. Run for 4-8 hours (recommended)"
echo ""
echo "Press Ctrl+C to stop anytime"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

./run_memory_profile.sh
