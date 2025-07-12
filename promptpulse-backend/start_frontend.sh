#!/bin/bash

echo "Starting PromptPulse Frontend..."
echo "================================"

# Navigate to frontend directory
cd /Users/joel/Desktop/promptpulse/promptpulse-frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🚀 Starting frontend development server..."
echo "Frontend will be available at: http://localhost:5173"
echo "Backend is running at: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev