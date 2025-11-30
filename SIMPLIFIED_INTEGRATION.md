# W2L Playground - Simplified Direct Integration

## ✅ What Changed

The playground now talks **directly** to the agent server, simplifying the architecture:

### Before (Complex)
```
Playground UI → Playground Server → Agent Server
```

### Now (Simple)
```
Playground UI → Agent Server
```

## 🏗️ Architecture

```
┌─────────────────────┐
│  Playground UI      │  Port 3000 (Vite + React)
│  - Monaco Editor    │
│  - Chat Interface   │
│  - localStorage     │
└──────────┬──────────┘
           │
           │ POST /v1/chat/completions
           ▼
┌─────────────────────┐
│   Agent Server      │  Port 3100 (Express + Cerebras)
│ - Tool Calling      │
│ - W2L Documentation │
│ - Code Generation   │
└─────────────────────┘
```

## 🚀 Quick Start

### 1. Set Up Cerebras API Key

```bash
echo "CEREBRAS_API_KEY=your-cerebras-key" > .env
```

### 2. Start Services

```bash
./start-playground.sh
```

This starts:
- Agent Server on port 3100
- Playground UI on port 3000

### 3. Use the Playground

1. Open `http://localhost:3000`
2. Type in chat: "Create a blue circle with radius 50"
3. Watch the code generate and render!

## 📦 What Was Changed

### Files Modified

1. **`/playground/src/components/Chat.tsx`**
   - Removed dependency on conversation server
   - Now calls agent server directly at `http://localhost:3100/v1/chat/completions`
   - Stores conversation history in localStorage
   - Added "Clear Chat" button

2. **`/playground/src/App.tsx`**
   - Removed conversation management logic
   - Removed ConversationSelector component
   - Simplified props to Chat component

3. **`/start-playground.sh`** (new)
   - Simple startup script for just 2 services
   - Agent server + Playground UI only

4. **`/README.md`**
   - Updated Quick Start section
   - Simplified architecture explanation

### Files Removed from Flow

- `/server/*` - No longer needed (was the middle layer)
- ConversationSelector component - No longer used

## 🎯 Benefits

✅ **Simpler** - Only 2 services instead of 3  
✅ **Faster** - Direct communication, no proxy layer  
✅ **Easier** - Fewer dependencies to manage  
✅ **Cleaner** - localStorage for chat history (no DB needed)  

## 💻 How It Works

### Request Flow

1. **User types message** in chat input
   - Example: "Create a red square"

2. **Chat component builds request**
   ```javascript
   POST http://localhost:3100/v1/chat/completions
   {
     "messages": [
       {"role": "user", "content": "Create a red square"}
     ],
     "model": "llama3.1-8b",
     "max_completion_tokens": 4096
   }
   ```

3. **Agent server processes**
   - Uses Cerebras with tool calling
   - Calls `get_guides()` for relevant docs
   - Calls `get_elements()` for API specs
   - Generates code

4. **Agent server responds**
   ```json
   {
     "choices": [{
       "message": {
         "content": "{\"code\":\"...\",\"explanation\":\"...\"}"
       }
     }]
   }
   ```

5. **Chat component handles response**
   - Displays explanation in chat
   - Updates Monaco editor with code
   - Saves to localStorage

## 🗂️ Data Storage

### Chat History
- Stored in: `localStorage` (key: `w2l-chat-messages`)
- Format: Array of `{id, role, content}` objects
- Persists across browser sessions
- Can be cleared with "Clear Chat" button

### Code
- Stored in: `localStorage` (key: `w2l-code`)
- Auto-saves on every edit
- Loads on page refresh

## 🧪 Testing

### Test Agent Server Directly

```bash
cd agent_server
./test-ai.sh "Create a blue circle"
```

### Test Full Stack

1. Start services: `./start-playground.sh`
2. Open `http://localhost:3000`
3. Type: "Create a blue circle"
4. Verify:
   - Chat shows explanation
   - Editor updates with code
   - SVG renders

### Check Logs

```bash
# Agent server
tail -f /tmp/w2l-agent-server.log

# Playground UI
tail -f /tmp/w2l-playground-ui.log
```

## 🔧 Configuration

### Agent Server URL

By default, the playground connects to `http://localhost:3100`. To change:

**Edit `/playground/src/components/Chat.tsx`:**
```typescript
const AGENT_SERVER_URL = "http://your-host:port";
```

### Cerebras Model

To use a different model, edit the API call in Chat.tsx:
```typescript
body: JSON.stringify({
  messages: apiMessages,
  model: "llama3.1-70b", // or other Cerebras model
  max_completion_tokens: 4096,
  temperature: 0.1,
}),
```

## 🎓 Example Prompts

Try these in the chat:

**Basic Shapes:**
- "Create a blue circle with radius 50"
- "Draw a red square with side length 100"
- "Make a triangle"

**Layouts:**
- "Create a horizontal row of 5 colored circles"
- "Make a 3x3 grid of squares"

**Complex:**
- "Create a bar chart showing values [10, 25, 15, 30]"
- "Draw a flowchart with 3 connected boxes"

## 🐛 Troubleshooting

### "Agent server not responding"

**Check if agent server is running:**
```bash
curl http://localhost:3100/health
```

**Restart agent server:**
```bash
cd agent_server && npm run dev
```

### "CEREBRAS_API_KEY not configured"

**Set the key:**
```bash
echo "CEREBRAS_API_KEY=your-key" > .env
```

**Restart agent server after setting key.**

### Chat shows error message

**Check browser console** for detailed errors:
- F12 → Console tab

**Check agent server logs:**
```bash
tail -f /tmp/w2l-agent-server.log
```

## 📝 API Reference

### Agent Server Endpoint

**URL:** `POST http://localhost:3100/v1/chat/completions`

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Your prompt here"}
  ],
  "model": "llama3.1-8b",
  "max_completion_tokens": 4096,
  "temperature": 0.1
}
```

**Response:**
```json
{
  "id": "chat-abc123",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "{\"code\":\"const artboard = ...\",\"explanation\":\"Created...\"}"
    }
  }],
  "usage": {...}
}
```

## 🎉 Success!

You now have a simplified, direct integration between the playground and agent server. The architecture is cleaner, faster, and easier to maintain!

---

**Need help?** Check the agent server logs or open an issue.

