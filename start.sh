#!/bin/bash

# Set up error handling
set -e
trap cleanup EXIT

# Function to clean up processes on exit
cleanup() {
  echo "🧹 Cleaning up processes..."
  kill $API_PID 2>/dev/null || true
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

# Install API dependencies if needed
echo "📦 Checking API dependencies..."
cd "$ROOT_DIR/api"
echo "👉 Current API directory: $(pwd)"
if [ ! -d "node_modules" ] || [ ! -f "node_modules/express/package.json" ]; then
  echo "📦 Installing API dependencies..."
  npm install 
fi

# Start the API server in the background with proper error handling
echo "🌐 Starting API server..."
node -e "process.on('uncaughtException', (err) => { console.error('Uncaught exception:', err); }); process.on('unhandledRejection', (reason, promise) => { console.error('Unhandled Rejection at:', promise, 'reason:', reason); }); const http = require('http'); const app = require('./server'); const server = http.createServer(app); server.listen(3001, () => { console.log('API server started on http://localhost:3001'); });" &
API_PID=$!

# Give the API server a moment to start
sleep 2

# Test API endpoint
echo "🧪 Testing API connection..."
if ! curl -s "http://localhost:3001/api/health" > /dev/null; then
  echo "⚠️ API server might not be responding, but continuing..."
fi

# Change to the frontend directory
cd "$ROOT_DIR/frontend"
echo "👉 Current frontend directory: $(pwd)"

# List package.json to verify it exists
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found in the frontend directory!"
  kill $API_PID 2>/dev/null || true
  exit 1
fi

# Display available scripts
echo "📄 Available npm scripts:"
npm run --json | grep -E '"(dev|start|server)"' || echo "No scripts found"

# Check if the node_modules directory exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Run the frontend
echo "🌐 Starting the frontend..."
if grep -q '"dev": "vite"' package.json; then
  npm run dev
else
  echo "❌ Error: 'dev' script not found in package.json!"
  echo "   Available scripts:"
  npm run --json | grep name
  kill $API_PID 2>/dev/null || true
  exit 1
fi

# This will only execute when the frontend is stopped
echo "🛑 Shutting down API server..."
kill $API_PID 2>/dev/null || true

echo "✅ Application stopped successfully!"
