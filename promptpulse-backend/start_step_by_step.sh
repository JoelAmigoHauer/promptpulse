#!/bin/bash

echo "🎯 PromptPulse Frontend Setup - Step by Step"
echo "============================================="
echo ""

# Step 1: Check current location
echo "📍 STEP 1: Checking location..."
echo "Current directory: $(pwd)"
echo ""

# Step 2: Navigate to frontend
echo "📁 STEP 2: Navigating to frontend directory..."
FRONTEND_DIR="/Users/joel/Desktop/promptpulse/promptpulse-frontend"
cd "$FRONTEND_DIR"
echo "✅ Now in: $(pwd)"
echo ""

# Step 3: Check Node.js
echo "🟢 STEP 3: Checking Node.js..."
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Step 4: Check package.json
echo "📦 STEP 4: Checking package.json..."
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "Available scripts:"
    cat package.json | grep -A 5 '"scripts"'
else
    echo "❌ package.json NOT found!"
    exit 1
fi
echo ""

# Step 5: Install dependencies
echo "📦 STEP 5: Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Step 6: Kill any existing server
echo "🔄 STEP 6: Cleaning up any existing servers..."
pkill -f "vite" 2>/dev/null || true
sleep 2
echo "✅ Cleanup complete"
echo ""

# Step 7: Start the server
echo "🚀 STEP 7: Starting development server..."
echo "This will start the PromptPulse frontend on http://localhost:3000"
echo "Keep this terminal window open!"
echo ""
echo "In 10 seconds, open your browser and go to: http://localhost:3000"
echo ""
echo "Starting server now..."
echo "========================="

npm run dev