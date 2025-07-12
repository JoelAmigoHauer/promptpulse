#!/bin/bash

echo "🔧 Debugging Frontend Startup"
echo "=============================="

# Check current directory
echo "📁 Current directory: $(pwd)"

# Check if frontend directory exists
FRONTEND_DIR="/Users/joel/Desktop/promptpulse/promptpulse-frontend"
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Frontend directory not found: $FRONTEND_DIR"
    exit 1
fi

echo "✅ Frontend directory exists: $FRONTEND_DIR"

# Navigate to frontend directory
cd "$FRONTEND_DIR"
echo "📁 Changed to: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

echo "✅ package.json found"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed!"
        exit 1
    fi
else
    echo "✅ node_modules exists"
fi

# Check Node.js version
echo "🟢 Node.js version: $(node --version)"
echo "📦 npm version: $(npm --version)"

# Check if port 3000 is available
if command -v lsof >/dev/null 2>&1; then
    PORT_CHECK=$(lsof -i :3000 2>/dev/null)
    if [ ! -z "$PORT_CHECK" ]; then
        echo "⚠️  Port 3000 is already in use:"
        echo "$PORT_CHECK"
        echo "🔄 Killing existing processes on port 3000..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
fi

echo "🚀 Starting frontend server..."
echo "📍 URL will be: http://localhost:3000"
echo "⏰ This may take 30-60 seconds..."
echo ""

# Start the development server with verbose output
npm run dev 2>&1