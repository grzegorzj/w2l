# W2L Agent Server Integration

This document describes the integration between the W2L Playground and the Agent Server.

## Overview

The W2L Playground now uses the Agent Server for AI-powered code generation. The Agent Server leverages Cerebras with tool calling to access W2L documentation and generate accurate code.

## Architecture

```
┌─────────────────────┐
│  Playground UI      │  Port 3000 (Vite + React)
│  - Monaco Editor    │
│  - Chat Interface   │
└──────────┬──────────┘
           │
           │ HTTP
           ▼
┌─────────────────────┐
│ Playground Server   │  Port 3001 (Express)
│ - Conversations DB  │
│ - Message History   │
└──────────┬──────────┘
           │
           │ HTTP (when USE_AGENT_SERVER=true)
           ▼
┌─────────────────────┐
│   Agent Server      │  Port 3100 (Express + Cerebras)
│ - Tool Calling      │
│ - W2L Documentation │
│ - Code Generation   │
└─────────────────────┘
```

## Setup

### 1. Configure Environment Variables

**For Agent Server** (`/agent_server/.env` or `/.env` in project root):
```bash
CEREBRAS_API_KEY=your-cerebras-api-key
```

**For Playground Server** (`/server/.env`):
```bash
USE_AGENT_SERVER=true
AGENT_SERVER_URL=http://localhost:3100
PORT=3001
```

### 2. Start All Services

You need to start **3 terminals**:

**Terminal 1: Agent Server**
```bash
cd agent_server
npm install
npm run dev
```

**Terminal 2: Playground Server**
```bash
cd server
npm install
npm run dev
```

**Terminal 3: Playground UI**
```bash
cd playground
npm install
npm run dev
```

### 3. Access the Playground

Open your browser to: `http://localhost:3000`

## How It Works

### Request Flow

1. **User sends message** in the playground chat
   - Chat component sends POST to `/api/conversations/:id/chat`

2. **Playground server processes request**
   - Loads conversation history from SQLite database
   - Checks `USE_AGENT_SERVER` environment variable
   - If true, calls agent server; if false, calls OpenAI

3. **Agent server generates code** (when `USE_AGENT_SERVER=true`)
   - Receives user message + conversation context
   - Uses Cerebras with tool calling
   - Calls `get_guides` to fetch relevant documentation
   - Calls `get_elements` to get API specs
   - Generates W2L code based on documentation
   - Returns structured JSON: `{ code: "...", explanation: "..." }`

4. **Playground server streams response**
   - Parses agent server response
   - Extracts code and explanation
   - Streams explanation as SSE chunks to frontend
   - Sends code update event
   - Saves message and code to database

5. **UI updates**
   - Chat displays streaming explanation
   - Monaco editor updates with generated code
   - Code auto-executes to render SVG

### Response Format

**Agent Server Response:**
```json
{
  "id": "chat-abc123",
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "{\"code\":\"...\",\"explanation\":\"...\"}"
    }
  }]
}
```

**Playground Server SSE Stream:**
```
data: {"type":"chunk","content":"Creating a blue circle..."}

data: {"type":"code","content":"const artboard = new Artboard(...)..."}

data: {"type":"done"}
```

## Configuration Options

### Use OpenAI Instead

If you want to use OpenAI instead of the agent server:

**`/server/.env`:**
```bash
USE_AGENT_SERVER=false
OPENAI_API_KEY=sk-your-openai-key
PORT=3001
```

### Change Agent Server URL

If running the agent server on a different host/port:

**`/server/.env`:**
```bash
USE_AGENT_SERVER=true
AGENT_SERVER_URL=http://your-host:port
```

## Troubleshooting

### Agent Server Not Responding

**Symptoms:** Playground hangs when sending messages

**Solution:**
1. Check agent server is running: `curl http://localhost:3100/health`
2. Check environment variable: `USE_AGENT_SERVER=true` in `/server/.env`
3. Check CEREBRAS_API_KEY is set in agent server environment

### Code Not Updating in Editor

**Symptoms:** Chat shows response but editor doesn't update

**Solution:**
1. Check browser console for errors
2. Verify agent server is returning proper JSON with `code` field
3. Check playground server logs for parsing errors

### Connection Refused

**Symptoms:** `ECONNREFUSED` error in playground server logs

**Solution:**
1. Ensure agent server is running on port 3100
2. Check firewall settings
3. Verify `AGENT_SERVER_URL` in `/server/.env`

## Development

### Testing Agent Server Directly

Test the agent server without the playground:

```bash
cd agent_server
./test-ai.sh "Create a blue circle"
```

### Monitoring Logs

Watch all three services in parallel:

**Terminal 1:**
```bash
cd agent_server && npm run dev
```

**Terminal 2:**
```bash
cd server && npm run dev
```

**Terminal 3:**
```bash
cd playground && npm run dev
```

## Benefits of Agent Server

1. **Tool Calling**: Automatically fetches relevant documentation
2. **Structured Output**: Returns clean JSON with code and explanation
3. **Fast Generation**: Cerebras provides ultra-fast inference
4. **Cost Effective**: More affordable than OpenAI for code generation
5. **Specialized**: Designed specifically for W2L library

## Migration from OpenAI

To migrate an existing setup:

1. **Install Cerebras SDK** in agent server (already done)
2. **Set environment variable** in playground server: `USE_AGENT_SERVER=true`
3. **Start agent server** before playground server
4. **Test with simple prompt**: "Create a red square"

Existing conversations and code will continue to work. New messages will use the agent server.

