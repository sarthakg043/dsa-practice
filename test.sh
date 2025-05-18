#!/bin/bash

# Test script for DSA Repository Tracker
echo "🧪 Testing DSA Repository Tracker..."

# Test API server
cd "$(dirname "$0")/api"

if [ ! -d "node_modules" ] || [ ! -f "node_modules/express/package.json" ]; then
  echo "📦 Installing API dependencies..."
  npm install express
fi

echo "🔍 Testing API initialization..."
node -e "console.log('Testing API server initialization...'); const app = require('./server'); console.log('✅ API server initialized successfully!')"

if [ $? -ne 0 ]; then
  echo "❌ API server initialization failed!"
  exit 1
fi

# Start API server in background
echo "🚀 Starting API server for tests..."
node -e "const http = require('http'); const app = require('./server'); const server = http.createServer(app); server.listen(3001, () => { console.log('API server started on http://localhost:3001'); });" &
API_PID=$!

# Give the API server a moment to start
sleep 2

# Test the API endpoints
echo "🔍 Testing /api/tree endpoint..."
TREE_RESPONSE=$(curl -s http://localhost:3001/api/tree)
if [[ $TREE_RESPONSE == *"name"* && $TREE_RESPONSE == *"children"* ]]; then
  echo "✅ /api/tree endpoint working correctly"
else
  echo "❌ /api/tree endpoint failed: $TREE_RESPONSE"
  kill $API_PID 2>/dev/null || true
  exit 1
fi

echo "🔍 Testing /api/file endpoint..."
FILE_RESPONSE=$(curl -s "http://localhost:3001/api/file?path=/Arrays/two-sum.md")
if [[ $FILE_RESPONSE == *"content"* && $FILE_RESPONSE == *"metadata"* ]]; then
  echo "✅ /api/file endpoint working correctly"
else
  echo "❌ /api/file endpoint failed: $FILE_RESPONSE"
  kill $API_PID 2>/dev/null || true
  exit 1
fi

echo "🔍 Testing /api/statistics endpoint..."
STATS_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"test":"data"}' http://localhost:3001/api/statistics)
if [[ $STATS_RESPONSE == *"success"* ]]; then
  echo "✅ /api/statistics endpoint working correctly"
else
  echo "❌ /api/statistics endpoint failed: $STATS_RESPONSE"
  kill $API_PID 2>/dev/null || true
  exit 1
fi

echo "🔍 Testing invalid route error handling..."
ERROR_RESPONSE=$(curl -s http://localhost:3001/not-found)
if [[ $ERROR_RESPONSE == *"error"* ]]; then
  echo "✅ Error handling working correctly"
else
  echo "❌ Error handling failed: $ERROR_RESPONSE"
  kill $API_PID 2>/dev/null || true
  exit 1
fi

# Clean up
echo "🧹 Cleaning up..."
kill $API_PID 2>/dev/null || true

echo "✅ All tests passed successfully!"
