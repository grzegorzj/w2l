# W2L Server

Backend server for the W2L Playground with LLM-powered code editing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in this directory:
```bash
cp env.template .env
```

3. Configure your LLM backend:

**Option A: Use Agent Server (Recommended)**
```
USE_AGENT_SERVER=true
AGENT_SERVER_URL=http://localhost:3100
PORT=3001
```

Then start the agent server in another terminal:
```bash
cd ../agent_server && npm run dev
```

**Option B: Use OpenAI**
```
USE_AGENT_SERVER=false
OPENAI_API_KEY=your_key_here
PORT=3001
```

4. Start the server:
```bash
npm run dev  # Development mode with auto-reload
# or
npm start    # Production mode
```

## API Endpoints

### Conversations

- `GET /api/conversations` - List all conversations
- `GET /api/conversations/:id` - Get a specific conversation with messages
- `POST /api/conversations` - Create a new conversation
  - Body: `{ title?: string, code?: string }`
- `PATCH /api/conversations/:id/code` - Update conversation code
  - Body: `{ code: string }`
- `DELETE /api/conversations/:id` - Delete a conversation

### Chat

- `POST /api/conversations/:id/chat` - Send a message and get streaming response
  - Body: `{ message: string, currentCode?: string }`
  - Returns: Server-Sent Events (SSE) stream
  - Event types:
    - `chunk`: Text chunk from LLM
    - `code`: Extracted code block
    - `done`: Stream complete
    - `error`: Error occurred

## Database

SQLite database (`conversations.db`) with tables:
- `conversations`: Stores conversation metadata and code
- `messages`: Stores chat messages

## Features

- SQLite database for persistent storage
- **W2L Agent Server integration** with Cerebras + tool calling (recommended)
- OpenAI GPT-4 integration with streaming (legacy)
- Automatic code extraction from LLM responses
- Conversation title generation
- RESTful API for conversation management

## Architecture

The server acts as a proxy between the playground UI and the LLM backend:

```
Playground UI (port 3000)
    ↓
Playground Server (port 3001) - Manages conversations & database
    ↓
Agent Server (port 3100) - Generates W2L code with Cerebras + tools
```

When `USE_AGENT_SERVER=true`, the server delegates all code generation to the agent server, which uses Cerebras with tool calling to access W2L documentation and generate accurate code.

