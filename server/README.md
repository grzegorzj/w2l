# W2L Server

Backend server for the W2L Playground with LLM-powered code editing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in this directory:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to the `.env` file:
```
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
- OpenAI GPT-4 integration with streaming
- Automatic code extraction from LLM responses
- Conversation title generation
- RESTful API for conversation management

