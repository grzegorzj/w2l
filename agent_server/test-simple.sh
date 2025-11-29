#!/bin/bash

# Simple test script for W2L Agent Server (no jq dependency)

echo "🧪 W2L Agent Server - Simple Test"
echo "=================================="
echo ""

# Check if server is running
if ! curl -s http://localhost:3100/health > /dev/null 2>&1; then
  echo "❌ Server is not running!"
  echo ""
  echo "To start the server, run:"
  echo "  cd agent_server && npm run dev"
  echo ""
  exit 1
fi

echo "✅ Server is running"
echo ""

echo "📍 Test 1: Health Check"
curl -s http://localhost:3100/health
echo -e "\n"

echo "📍 Test 2: Get Guides (basic-shapes)"
curl -s http://localhost:3100/tools/execute \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"tool":"get_guides","arguments":{"guides":["basic-shapes"]}}' \
  | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps({'id': data['result'][0]['id'], 'title': data['result'][0]['title'], 'content_length': len(data['result'][0]['content'])}, indent=2))" 2>/dev/null || echo "(Install python3 for formatted output)"
echo ""

echo "📍 Test 3: Get Elements (Circle, Rect)"
curl -s http://localhost:3100/tools/execute \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"tool":"get_elements","arguments":{"elements":["Circle","Rect"]}}'
echo -e "\n"

echo "================================"
echo "✨ Tests completed!"
echo ""
echo "Try these commands:"
echo ""
echo "  # View all available guides and elements"
echo "  curl http://localhost:3100/context"
echo ""
echo "  # Get element documentation"
echo "  curl -X POST http://localhost:3100/tools/execute \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"tool\":\"get_elements\",\"arguments\":{\"elements\":[\"Text\",\"Container\"]}}'"
echo ""

