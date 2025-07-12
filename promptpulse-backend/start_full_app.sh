#!/bin/bash

echo "🚀 Starting PromptPulse Full Application"
echo "========================================"

# Check if backend is already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend already running on port 8000"
else
    echo "🔧 Starting backend server..."
    cd /Users/joel/Desktop/promptpulse/promptpulse-backend
    python -m uvicorn src.main:app --reload --host 127.0.0.1 --port 8000 &
    BACKEND_PID=$!
    echo "Backend started with PID: $BACKEND_PID"
fi

# Wait a moment for backend to start
sleep 2

# Check if frontend is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Frontend already running on port 3000"
else
    echo "🎨 Starting frontend server..."
    cd /Users/joel/Desktop/promptpulse/promptpulse-frontend
    npm run dev &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID"
fi

echo ""
echo "🌐 Application URLs:"
echo "================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "🎯 Ready to test with all 3 AI providers!"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user input
read -p "Press Enter to stop servers or Ctrl+C to keep running..."

# Kill background processes if they were started by this script
if [ ! -z "$BACKEND_PID" ]; then
    kill $BACKEND_PID 2>/dev/null
fi
if [ ! -z "$FRONTEND_PID" ]; then
    kill $FRONTEND_PID 2>/dev/null
fi