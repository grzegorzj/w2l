#!/bin/bash

# Build script for W2L Renderer API
# This script ensures the parent w2l library is built before building the Docker image

set -e

echo "🏗️  Building W2L Renderer API"
echo ""

# Check if we're in the deployment directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from deployment directory"
    exit 1
fi

# Build parent w2l library
echo "📦 Building parent w2l library..."
cd ..
npm run build
echo "✅ Parent library built"
echo ""

# Build Docker image
echo "🐳 Building Docker image..."
cd deployment
docker build -t w2l-renderer -f Dockerfile ..
echo "✅ Docker image built"
echo ""

echo "🎉 Build complete!"
echo ""
echo "To run the container:"
echo "  docker run -p 3000:3000 w2l-renderer"
echo ""
echo "Or use docker-compose:"
echo "  docker-compose up -d"

