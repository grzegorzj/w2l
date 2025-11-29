#!/bin/bash

# One-liner to run the W2L Agent Server
# This script builds documentation and starts the server

echo "🔧 Building documentation..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Documentation build failed"
  exit 1
fi

echo ""
echo "🚀 Starting agent server..."
echo ""
npm start

