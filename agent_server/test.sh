#!/bin/bash

# Test script for W2L Agent Server
# Tests all endpoints and tool functionality

echo "🧪 W2L Agent Server Test Suite"
echo "================================"
echo ""

# Check if server is running
if ! curl -s http://localhost:3100/health > /dev/null 2>&1; then
  echo "⚠️  Server is not running. Starting it..."
  echo "   Run: cd agent_server && npm start"
  echo ""
  echo "   Or use: cd agent_server && ./run.sh"
  exit 1
fi

echo "✅ Server is running"
echo ""

# Test 1: Health check
echo "📍 Test 1: Health Check"
echo "   GET /health"
curl -s http://localhost:3100/health | jq '.'
echo ""

# Test 2: Get context
echo "📍 Test 2: Get Available Context"
echo "   GET /context"
echo "   (showing summary only)"
curl -s http://localhost:3100/context | jq '{
  guides: .guides | length,
  elements: .elements | length,
  sample_guides: .guides[0:2],
  sample_elements: .elements[0:3]
}'
echo ""

# Test 3: Get guides tool
echo "📍 Test 3: Get Guides Tool"
echo "   POST /tools/execute"
echo "   Tool: get_guides"
curl -s http://localhost:3100/tools/execute \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"tool":"get_guides","arguments":{"guides":["basic-shapes"]}}' \
  | jq '.result[] | {id, title, content: .content[0:200] + "..."}'
echo ""

# Test 4: Get elements tool
echo "📍 Test 4: Get Elements Tool"
echo "   POST /tools/execute"
echo "   Tool: get_elements"
curl -s http://localhost:3100/tools/execute \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"tool":"get_elements","arguments":{"elements":["Circle","Rect","Text"]}}' \
  | jq '.result'
echo ""

# Test 5: Get tool schemas
echo "📍 Test 5: Get Tool Schemas"
echo "   GET /tools/schemas"
curl -s http://localhost:3100/tools/schemas | jq '.tools[] | {name: .function.name, description: .function.description}'
echo ""

# Test 6: OpenAI-compatible endpoint (mock)
echo "📍 Test 6: OpenAI-Compatible Chat Endpoint"
echo "   POST /v1/chat/completions"
curl -s http://localhost:3100/v1/chat/completions \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cerebras/llama3-70b",
    "messages": [
      {"role": "system", "content": "You are an SVG generation assistant."},
      {"role": "user", "content": "Create a simple circle"}
    ]
  }' \
  | jq '{id, model, message: .choices[0].message}'
echo ""

echo "================================"
echo "✨ All tests completed!"
echo ""
echo "💡 Usage Examples:"
echo ""
echo "   # Get available context"
echo "   curl http://localhost:3100/context"
echo ""
echo "   # Get a guide"
echo "   curl -X POST http://localhost:3100/tools/execute \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"tool\":\"get_guides\",\"arguments\":{\"guides\":[\"basic-shapes\"]}}'"
echo ""
echo "   # Get element documentation"
echo "   curl -X POST http://localhost:3100/tools/execute \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"tool\":\"get_elements\",\"arguments\":{\"elements\":[\"Circle\",\"Rect\"]}}'"
echo ""

