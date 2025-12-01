#!/bin/bash

# Test script for W2L Render API
# Usage: ./test-api.sh [API_URL] [API_KEY]

API_URL="${1:-http://localhost:3000}"
API_KEY="${2:-your-api-key-here}"

echo "Testing W2L Render API at: $API_URL"
echo "Using API Key: ${API_KEY:0:10}..."
echo ""

# Test health endpoint (no auth)
echo "1. Testing health endpoint..."
curl -s "$API_URL/health" | jq . || curl -s "$API_URL/health"
echo -e "\n"

# Test W2L code
W2L_CODE='const artboard = new Artboard({ width: 400, height: 300, background: "#f0f0f0" }); const rect = new Rect({ x: 50, y: 50, width: 100, height: 100, fill: "blue", stroke: "black", strokeWidth: 2 }); const circle = new Circle({ cx: 250, cy: 150, r: 50, fill: "red", opacity: 0.7 }); artboard.add(rect); artboard.add(circle);'

# Test SVG rendering
echo "2. Testing SVG rendering..."
HTTP_CODE=$(curl -s -o test-output.svg -w "%{http_code}" \
  -X POST "$API_URL/render/svg" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{
    \"code\": \"$W2L_CODE\",
    \"width\": 400,
    \"height\": 300
  }")

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✓ SVG render successful (HTTP $HTTP_CODE)"
  echo "  Output saved to: test-output.svg"
  ls -lh test-output.svg
else
  echo "✗ SVG render failed (HTTP $HTTP_CODE)"
  cat test-output.svg
fi
echo ""

# Test PNG rendering
echo "3. Testing PNG rendering..."
HTTP_CODE=$(curl -s -o test-output.png -w "%{http_code}" \
  -X POST "$API_URL/render/png" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{
    \"code\": \"$W2L_CODE\",
    \"scale\": 2
  }")

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✓ PNG render successful (HTTP $HTTP_CODE)"
  echo "  Output saved to: test-output.png"
  ls -lh test-output.png
else
  echo "✗ PNG render failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test JPG rendering
echo "4. Testing JPG rendering..."
HTTP_CODE=$(curl -s -o test-output.jpg -w "%{http_code}" \
  -X POST "$API_URL/render/jpg" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{
    \"code\": \"$W2L_CODE\",
    \"scale\": 2,
    \"quality\": 90
  }")

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✓ JPG render successful (HTTP $HTTP_CODE)"
  echo "  Output saved to: test-output.jpg"
  ls -lh test-output.jpg
else
  echo "✗ JPG render failed (HTTP $HTTP_CODE)"
fi
echo ""

# Test authentication failure
echo "5. Testing authentication (should fail with 403)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/render/svg" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: wrong-key" \
  -d "{
    \"code\": \"$W2L_CODE\",
    \"width\": 400,
    \"height\": 300
  }")

if [ "$HTTP_CODE" -eq 403 ]; then
  echo "✓ Authentication properly rejected invalid key (HTTP $HTTP_CODE)"
else
  echo "✗ Expected HTTP 403, got HTTP $HTTP_CODE"
fi
echo ""

# Test missing authentication
echo "6. Testing missing authentication (should fail with 401)..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X POST "$API_URL/render/svg" \
  -H "Content-Type: application/json" \
  -d "{
    \"code\": \"$W2L_CODE\",
    \"width\": 400,
    \"height\": 300
  }")

if [ "$HTTP_CODE" -eq 401 ]; then
  echo "✓ Authentication properly required (HTTP $HTTP_CODE)"
else
  echo "✗ Expected HTTP 401, got HTTP $HTTP_CODE"
fi
echo ""

echo "All tests completed!"
echo ""
echo "Generated files:"
ls -lh test-output.* 2>/dev/null || echo "  No output files generated"


