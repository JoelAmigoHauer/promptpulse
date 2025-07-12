#!/bin/bash

echo "🔧 PromptPulse Frontend - Clean Start"
echo "====================================="
echo ""

# Kill any existing processes on ports 3000, 3001, 5173
echo "🔄 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"
echo ""

# Navigate to frontend directory
FRONTEND_DIR="/Users/joel/Desktop/promptpulse/promptpulse-frontend"
echo "📁 Navigating to frontend directory..."
cd "$FRONTEND_DIR"
echo "✅ Now in: $(pwd)"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

# Install/update dependencies
echo "📦 Installing/updating dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi
echo "✅ Dependencies ready"
echo ""

# Remove any build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf dist node_modules/.vite 2>/dev/null || true
echo "✅ Build artifacts cleaned"
echo ""

# Start the development server
echo "🚀 Starting development server..."
echo "📍 URL: http://localhost:3001"
echo "⏰ Server starting... (may take 30-60 seconds)"
echo ""
echo "🌐 Open your browser to: http://localhost:3001"
echo "📝 Note: Use port 3001, NOT 3000"
echo ""
echo "Starting now..."
echo "==============="

# Start with explicit configuration
npm run dev -- --port 3001 --host 0.0.0.0 --clearScreen false

echo ""
echo "🛑 Server stopped"