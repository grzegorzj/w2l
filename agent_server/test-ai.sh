#!/bin/bash

# Test the AI agent with Cerebras
# Make sure CEREBRAS_API_KEY is set in ../.env

echo "🤖 Testing W2L AI Agent with Cerebras"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f "../.env" ]; then
  echo "❌ .env file not found in project root"
  echo ""
  echo "Create ../.env with:"
  echo "  CEREBRAS_API_KEY=your-api-key-here"
  echo ""
  exit 1
fi

# Check if server is running
if ! curl -s http://localhost:3100/health > /dev/null 2>&1; then
  echo "❌ Server is not running"
  echo ""
  echo "Start it with: npm run dev"
  echo ""
  exit 1
fi

# Check health and API key
echo "📍 Checking server status..."
HEALTH=$(curl -s http://localhost:3100/health)
echo "$HEALTH" | grep -q '"cerebrasConfigured":true' && echo "✅ Cerebras API key is configured" || echo "⚠️  Cerebras API key not found"
echo ""

# Test query
QUERY="${1:-Create a simple diagram with a blue circle and a red rectangle side by side}"

echo "📝 Query: $QUERY"
echo ""
echo "🔄 Sending to AI agent..."
echo ""

# Call the AI endpoint
RESPONSE=$(curl -s http://localhost:3100/v1/chat/completions \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": \"$QUERY\"
      }
    ]
  }")

# Check for error
if echo "$RESPONSE" | grep -q '"error"'; then
  echo "❌ Error:"
  echo "$RESPONSE" | grep -o '"error":"[^"]*"' || echo "$RESPONSE"
  echo ""
  exit 1
fi

# Extract and display the response
echo "✨ AI Response:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$RESPONSE" | grep -o '"content":"[^"]*"' | sed 's/"content":"//;s/"$//' | sed 's/\\n/\n/g' | head -50
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show full response if verbose
if [ "$2" = "-v" ] || [ "$2" = "--verbose" ]; then
  echo "📊 Full Response:"
  echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
  echo ""
fi

echo "✅ Test completed!"
echo ""
echo "💡 Tips:"
echo "  - Use your own query: ./test-ai.sh \"Create a bar chart\""
echo "  - See full response: ./test-ai.sh \"your query\" -v"
echo "  - Watch server logs in the terminal where npm run dev is running"
echo ""

