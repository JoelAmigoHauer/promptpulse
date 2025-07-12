#!/bin/bash

echo "🚀 Starting Frontend on Alternative Port"
echo "========================================"

cd /Users/joel/Desktop/promptpulse/promptpulse-frontend

# Kill any existing processes
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Start on port 5173 (Vite default)
echo "🌐 Starting on http://localhost:5173"
npx vite --port 5173 --host