#!/bin/bash

echo "🚀 Starting NemoCode Backend..."
echo ""

# Check if already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Backend already running on port 8000"
    echo ""
    echo "To restart:"
    echo "  1. Kill existing: kill \$(lsof -ti:8000)"
    echo "  2. Run this script again"
    exit 1
fi

# Check if in correct directory
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    echo "Please run this script from the project root"
    exit 1
fi

cd backend

echo "✅ Starting server on http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 server.py
