#!/bin/bash

# Set up error handling and cleanup
set -e
trap cleanup EXIT

# Function to clean up processes on exit
cleanup() {
  echo "🧹 Cleaning up processes..."
  kill $API_PID 2>/dev/null || true
  echo "✅ Application shutdown complete!"
}

# DSA Repository Tracker - Simple Starter Script
echo "🚀 Starting DSA Repository Tracker..."

# Get script directory absolute path
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo "📂 Root directory: $SCRIPT_DIR"

# Start API server
echo "📦 Starting API server..."
cd "$SCRIPT_DIR/api"
echo "👉 Current location: $(pwd)"

# Install express if needed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/express/package.json" ]; then
  echo "📦 Installing Express..."
  npm install
fi

# Start API server in background with error handling
echo "🌐 Starting API server..."
node -e "process.on('uncaughtException', (err) => { console.error('Uncaught exception:', err); }); process.on('unhandledRejection', (reason, promise) => { console.error('Unhandled Rejection at:', promise, 'reason:', reason); }); const http = require('http'); const app = require('./server'); const server = http.createServer(app); server.listen(3001, () => { console.log('API server started on http://localhost:3001'); });" &
API_PID=$!

# Give the API server a moment to start
sleep 2

# Test API endpoint
echo "🧪 Testing API connection..."
if command -v curl &> /dev/null; then
  if ! curl -s "http://localhost:3001/api/health" > /dev/null; then
    echo "⚠️ API server might not be responding, but continuing..."
  else
    echo "✅ API server is responding correctly"
  fi
else
  echo "⚠️ curl not found, skipping API test"
fi

# Start frontend
echo "📦 Starting frontend..."
cd "$SCRIPT_DIR/frontend"
echo "👉 Current location: $(pwd)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Start frontend development server
echo "🚀 Starting frontend development server..."
npm run dev
