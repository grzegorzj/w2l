# Cerebras Integration Guide

The W2L Agent Server has **full Cerebras integration built-in**. You don't need to handle tool calling yourself!

## Architecture

```
┌─────────────┐
│   Client    │  (Your app, curl, etc.)
└──────┬──────┘
       │ POST /v1/chat/completions
       │ { messages: [...] }
       ↓
┌─────────────────────────────┐
│    W2L Agent Server         │
│  (Handles Everything!)      │
│                             │
│  1. Adds system prompt      │
│  2. Calls Cerebras API      │
│  3. Executes tools          │
│  4. Continues loop          │
│  5. Returns final result    │
└─────────────────────────────┘
```

**You just send a request. The server handles all tool calling automatically!**

## Quick Start

### 1. Set Up API Key

Create `.env` file in project root:

```bash
echo "CEREBRAS_API_KEY=your-key-here" > .env
```

### 2. Start Server

```bash
cd agent_server
npm install
npm run dev
```

### 3. Make Requests

**Using curl:**
```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Create a blue circle"}
    ]
  }'
```

**Using the example client:**
```bash
node cerebras-example.js "Create a diagram with circles"
```

**Using the test script:**
```bash
./test-ai.sh "Create a bar chart"
```

## What Happens Behind The Scenes

When you send a request:

1. **Server receives your message**
   ```json
   {"messages": [{"role": "user", "content": "Create a circle"}]}
   ```

2. **Server adds system prompt** with available guides and elements

3. **Server calls Cerebras** with tools enabled

4. **Cerebras decides to call tools** (e.g., `get_guides`, `get_elements`)

5. **Server executes tools automatically** and returns results to Cerebras

6. **Loop continues** until Cerebras has all info needed

7. **Cerebras generates final code** using W2L library

8. **Server returns response** to you:
   ```json
   {
     "choices": [{
       "message": {
         "content": "import { Circle, Artboard } from 'w2l';\n..."
       }
     }]
   }
   ```

## Server Configuration

The server is configured in `server.js`:

- **Model**: `llama-3.3-70b` (default, configurable)
- **Max tokens**: 65536
- **Temperature**: 1
- **Tool calling**: Enabled automatically
- **Max iterations**: 10 (prevents infinite loops)

## API Reference

### POST /v1/chat/completions

Standard OpenAI-compatible endpoint with automatic tool calling.

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Your request"}
  ],
  "model": "llama-3.3-70b",  // optional
  "temperature": 1,          // optional
  "max_completion_tokens": 65536  // optional
}
```

**Response:**
```json
{
  "id": "chatcmpl-...",
  "object": "chat.completion",
  "model": "llama-3.3-70b",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "Generated code..."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 1234,
    "completion_tokens": 567,
    "total_tokens": 1801
  }
}
```

### POST /v1/chat/completions/stream

Streaming version (for real-time responses):

```bash
curl -X POST http://localhost:3100/v1/chat/completions/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Create a circle"}]}'
```

Returns Server-Sent Events (SSE) stream.

## Example Requests

### Simple Shape
```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Create a red circle with radius 50"}
    ]
  }'
```

### Complex Layout
```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user", 
        "content": "Create a diagram with three circles arranged horizontally"
      }
    ]
  }'
```

### Chart
```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Create a bar chart showing monthly sales: Jan=100, Feb=150, Mar=120"
      }
    ]
  }'
```

## Using from JavaScript

```javascript
async function generateSVG(prompt) {
  const response = await fetch('http://localhost:3100/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

// Use it
const code = await generateSVG('Create a blue circle');
console.log(code);
```

## Using from Python

```python
import requests

def generate_svg(prompt):
    response = requests.post(
        'http://localhost:3100/v1/chat/completions',
        json={
            'messages': [
                {'role': 'user', 'content': prompt}
            ]
        }
    )
    return response.json()['choices'][0]['message']['content']

# Use it
code = generate_svg('Create a blue circle')
print(code)
```

## Error Handling

### API Key Not Set
```json
{
  "error": "CEREBRAS_API_KEY not configured. Please set it in .env file in the project root."
}
```

**Fix:** Create `.env` file with `CEREBRAS_API_KEY=your-key`

### Server Not Running
```
curl: (7) Failed to connect to localhost port 3100
```

**Fix:** Start the server with `npm run dev`

### Tool Execution Errors
If a tool fails, the server will pass the error back to Cerebras, which will try to handle it or ask for clarification.

## Monitoring

The server logs all activity:

```
🤖 Chat Completion Request
   Model: llama-3.3-70b
   Messages: 1
   Stream: false

🔄 Iteration 1
   Agent requested 1 tool call(s)
   🔧 Executing: get_guides({"guides":["basic-shapes"]})
      ✓ Success

🔄 Iteration 2
   Agent requested 1 tool call(s)
   🔧 Executing: get_elements({"elements":["Circle"]})
      ✓ Success

🔄 Iteration 3
   ✨ Agent completed
```

## Advanced Configuration

### Custom Model

```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [...],
    "model": "llama-3.1-8b"
  }'
```

### Lower Temperature (More Deterministic)

```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [...],
    "temperature": 0.3
  }'
```

### Custom Max Tokens

```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [...],
    "max_completion_tokens": 4096
  }'
```

## Troubleshooting

### "Maximum iterations reached"

The agent tried too many tool calls. This usually means:
- The query is too complex
- The agent is confused about what tools to use
- There's a logic loop

**Fix:** Simplify your request or add more specific guidance.

### Slow Responses

Tool calling requires multiple LLM calls. Typical flow:
1. Initial call (~2s)
2. Tool execution (~0.05s per tool)
3. Follow-up call(s) (~2s each)

**Total:** 5-10 seconds for complex requests

### Tools Not Being Called

Check server logs. The AI should call tools automatically. If not:
- Make sure system prompt is being added
- Verify tools are properly defined in response
- Check Cerebras API status

## Production Deployment

For production:

1. **Set environment variables:**
   ```bash
   CEREBRAS_API_KEY=your-key
   PORT=3100
   NODE_ENV=production
   ```

2. **Use a process manager:**
   ```bash
   pm2 start server.js --name w2l-agent
   ```

3. **Add rate limiting** (recommended)

4. **Set up monitoring** and logging

5. **Use HTTPS** with reverse proxy (nginx, etc.)

## Comparison: Old vs New

### Old Approach (cerebras-example.js was doing this)
```
Client → Cerebras API directly
         ↓
      Tool calls returned
         ↓
Client executes tools
         ↓
Client sends results back to Cerebras
         ↓
      ... repeat ...
```

### New Approach (server handles it)
```
Client → Agent Server
         ↓
      Server does everything
         ↓
      Returns final result
```

**Much simpler for clients!**

## Summary

The W2L Agent Server is **fully self-contained**:

✅ Loads API key from `.env`  
✅ Handles tool calling loop automatically  
✅ Executes tools without client involvement  
✅ Continues until completion  
✅ Returns final generated code  

**You just send requests. Everything else is handled!**

## Next Steps

- **Test it:** `./test-ai.sh "Create a circle"`
- **Add guides:** Create `.md` files in `guides/`
- **Integrate:** Use `/v1/chat/completions` from your app
- **Deploy:** Follow production deployment guide above
