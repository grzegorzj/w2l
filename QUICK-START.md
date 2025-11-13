# Quick Start Guide

## TL;DR - Get Running in 3 Steps

### 1. Install Dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../playground
npm install
cd ..
```

### 2. Configure OpenAI API Key

```bash
# Copy the template
cp server/env.template server/.env

# Edit server/.env and add your OpenAI API key
# The file should contain:
# OPENAI_API_KEY=sk-your-actual-key-here
# PORT=3001
```

### 3. Start Everything

Choose based on what you want to run:

**Option A: Just the LLM Playground (server + playground)**

```bash
npm run dev:llm-playground
```

**Option B: Everything (library + docs + server + playground)**

```bash
npm run dev:all
```

**Option C: Use the startup script**

```bash
chmod +x start-playground.sh
./start-playground.sh
```

**Option D: Manual start (two terminals)**

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd playground
npm run dev
```

## What You'll See

Once both servers are running:

1. Open http://localhost:3000
2. You'll see three panels:
   ```
   ┌─────────────────────────────────┬─────────────────┐
   │ Conversation Selector [+ New]   │                 │
   ├─────────────────────────────────┤                 │
   │                                 │                 │
   │  Code Editor (Monaco)           │   SVG Preview   │
   │                                 │   (Renderer)    │
   │─────────────────────────────────│                 │
   │  Chat Interface                 │                 │
   │  (Talk to AI)                   │                 │
   └─────────────────────────────────┴─────────────────┘
   ```

## First Conversation

1. Click **"+ New"** to create a conversation
2. In the chat, try: _"Create a blue rectangle with rounded corners"_
3. Watch as the AI:
   - Responds with an explanation
   - Generates TypeScript code
   - Automatically updates the editor
   - The code executes and renders in the preview

## Example Prompts to Try

- "Draw a red circle in the center"
- "Create a grid of 5x5 colored squares"
- "Add a triangle with a gradient fill"
- "Make the rectangle bigger and rotate it 45 degrees"
- "Create a simple house using rectangles and a triangle"

## Interface Tips

### Resizing

- Drag the **vertical bar** between code and chat to resize
- Drag the **horizontal bar** between left and right panels

### Keyboard Shortcuts

- **Cmd/Ctrl + Enter**: Run code manually
- **Enter**: Send chat message
- **Shift + Enter**: New line in chat

### Conversation Management

- Use the dropdown to switch between conversations
- Each conversation has its own code and chat history
- Everything is automatically saved

## Troubleshooting

### "Failed to fetch" errors

- Make sure backend server is running on port 3001
- Check `server/.env` has your OpenAI API key

### Code doesn't update

- The AI must wrap code in a markdown code block
- Check browser console for errors

### Port already in use

- Stop any existing processes on ports 3000 or 3001
- Or change ports in `server/.env` and `playground/server.js`

## Available Dev Commands

From the project root, you can run:

- `npm run dev:llm-playground` - Server + Playground only
- `npm run dev:all` - Library + Docs + Server + Playground (everything!)
- `npm run dev:lib` - Library build with watch + type generation
- `npm run dev:docs` - Documentation with watch
- `npm run dev:server` - Backend server only
- `npm run dev:playground` - Playground only

## Next Steps

- Customize the system prompt in `server/llm.js`
- Check out the example prompts below
- Explore the library documentation

## Cost Note

Each message to the AI uses OpenAI API credits. GPT-4 costs approximately:

- $0.01-0.03 per message for typical conversations
- More for longer conversations with lots of context

Monitor your usage at https://platform.openai.com/usage
