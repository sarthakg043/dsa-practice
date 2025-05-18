#!/bin/bash

# Set up error handling
set -e
trap cleanup EXIT

# Function to clean up processes on exit
cleanup() {
  echo "🧹 Cleaning up processes..."
  kill $SERVER_PID 2>/dev/null || true
  kill $FRONTEND_PID 2>/dev/null || true
}

# Get the absolute path of the script directory
get_abs_path() {
  local path="$1"
  if [[ -d "$path" ]]; then
    (cd "$path" && pwd)
  elif [[ -f "$path" ]]; then
    if [[ "$path" = /* ]]; then
      echo "$(dirname "$path")"
    else
      echo "$(cd "$(dirname "$path")" && pwd)"
    fi
  fi
}

# Store the root directory path
ROOT_DIR="$(get_abs_path "$(dirname "$0")")"
echo "📂 Root directory: $ROOT_DIR"

# Start the DSA Repository Tracker
echo "🚀 Starting DSA Repository Tracker..."

# Change to the frontend directory first
cd "$ROOT_DIR/frontend"
echo "👉 Current directory: $(pwd)"

# Check if the node_modules directory exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Start the server in the background
echo "🌐 Starting the server..."
node server.js &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Test server endpoints
echo "🧪 Testing server connection..."
if curl -s "http://localhost:3000/api/health" > /dev/null; then
  echo "✅ Server is responding correctly"
else
  echo "⚠️ Server might not be responding, but continuing..."
fi

# Run the frontend
echo "🌐 Starting the frontend..."
npm run dev &
FRONTEND_PID=$!

# Wait for processes to finish
wait $FRONTEND_PID

echo "✅ Application stopped successfully!"
