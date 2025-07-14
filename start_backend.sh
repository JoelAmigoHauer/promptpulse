#!/bin/bash

set -e

# Step 1: Go to backend directory
cd "$(dirname "$0")/promptpulse-backend"
echo "[INFO] Changed directory to $(pwd)"

# Step 2: Kill any process using port 8000
if lsof -ti:8000 > /dev/null; then
  echo "[INFO] Killing process on port 8000..."
  lsof -ti:8000 | xargs kill -9
else
  echo "[INFO] No process running on port 8000."
fi

# Step 3: Activate virtual environment
if [ ! -d "venv" ]; then
  echo "[INFO] Creating virtual environment..."
  python3 -m venv venv
fi
source venv/bin/activate

echo "[INFO] Virtual environment activated. Python: $(which python)"

# Step 4: Install dependencies if needed
if [ requirements.txt -nt venv ]; then
  echo "[INFO] Installing/updating dependencies..."
  pip install --upgrade pip
  pip install -r requirements.txt
else
  echo "[INFO] Dependencies already installed."
fi

# Step 5: Start the backend server

echo "[INFO] Starting backend server on http://localhost:8000 ..."
uvicorn src.main:app --reload --port 8000 