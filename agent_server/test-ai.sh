#!/bin/bash

# Test the AI agent with Cerebras - simple version
# Usage: ./test-ai.sh "your prompt here"

QUERY="${1:-Create a simple diagram with a blue circle and a red rectangle side by side}"

echo "🤖 Query: $QUERY"
echo ""

curl -s http://localhost:3100/v1/chat/completions \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": \"$QUERY\"
      }
    ]
  }"

echo ""
