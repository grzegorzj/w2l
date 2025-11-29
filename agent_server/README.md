# W2L Agent Server

An intelligent agent server for generating SVG visualizations using the W2L library. Provides tool calling infrastructure with OpenAI-compatible API.

## Features

- 🔧 **Tool Calling**: Get guides and element documentation on-demand
- 📚 **Automatic Documentation**: Extracts API docs from TypeScript source
- 🎯 **Smart Context**: Programmatic guide and element discovery
- 🔌 **OpenAI Compatible**: Works with Cerebras and other providers
- 🚀 **One-liner Setup**: Quick start for testing

## Quick Start

**Setup:**
```bash
# 1. Create .env file in project root
echo "CEREBRAS_API_KEY=your-api-key-here" > ../.env

# 2. Install and start
cd agent_server && npm install && npm run dev
```

The server will be available at `http://localhost:3100`

**Or use the run script:**
```bash
cd agent_server && ./run.sh
```

## Usage

### 1. View Available Context

```bash
curl http://localhost:3100/context
```

This returns all available guides and elements that the agent can access.

### 2. Test Tool Execution

Get guides:
```bash
curl -X POST http://localhost:3100/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_guides",
    "arguments": {
      "guides": ["basic-shapes"]
    }
  }'
```

Get element documentation:
```bash
curl -X POST http://localhost:3100/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_elements",
    "arguments": {
      "elements": ["Circle", "Rect", "Text"]
    }
  }'
```

### 3. Use with AI Agent (Cerebras)

The server now has Cerebras fully integrated! Just send your request:

```bash
# Using curl
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Create a blue circle"}]}'

# Using the example client
node cerebras-example.js "Create a blue circle and red rectangle"

# Using the test script
./test-ai.sh "Create a bar chart"
```

## Architecture

### Tool Calling Flow

1. **Agent receives task** → Decides which guides to read
2. **Calls `get_guides`** → Retrieves relevant documentation
3. **Analyzes guides** → Determines needed elements
4. **Calls `get_elements`** → Gets detailed API specs
5. **Generates code** → Creates SVG using W2L library

### Files Structure

```
agent_server/
├── server.js              # Express server with OpenAI-compatible API
├── tools.js               # Tool implementations
├── guides/                # Markdown guides for different tasks
│   └── basic-shapes.md
├── scripts/
│   └── build-docs.js      # Documentation extraction script
└── generated/             # Auto-generated on build
    ├── elements.json
    ├── guides.json
    └── agent-context.json
```

## Available Tools

### `get_guides`
Retrieves detailed guides for specific topics.

**Parameters:**
- `guides`: Array of guide IDs (e.g., `["basic-shapes"]`)

**Returns:**
- Full guide content in Markdown format

### `get_elements`
Retrieves API documentation for specific elements.

**Parameters:**
- `elements`: Array of element names (e.g., `["Circle", "Rect"]`)

**Returns:**
- Element configuration, properties, and usage details

## Building Documentation

Documentation is automatically extracted from the TypeScript source in `/lib`:

```bash
npm run build
```

This:
1. Scans all TypeScript files in `/lib`
2. Extracts JSDoc comments and interfaces
3. Generates `elements.json` with all element definitions
4. Scans `/guides` for markdown documentation
5. Creates `agent-context.json` for system prompts

## Adding New Guides

1. Create a markdown file in `agent_server/guides/`
2. Follow this structure:

```markdown
# Guide Title

## Overview
Brief description of what this guide covers.

## When to Use This Guide
- Use case 1
- Use case 2

## Content
Your guide content here...
```

3. Run `npm run build` to regenerate documentation

## Scripts

- `npm run build` - Build documentation from source
- `npm start` - Start the server
- `npm run dev` - Build and start (recommended for development)

## Cerebras Integration

Cerebras is **fully integrated** into the server! The server:

1. ✅ Loads `CEREBRAS_API_KEY` from `../.env`
2. ✅ Automatically handles tool calling loop
3. ✅ Executes tools (`get_guides`, `get_elements`)
4. ✅ Continues conversation until completion
5. ✅ Returns final code to the user

**No client-side integration needed!** Just POST to `/v1/chat/completions`.

## API Endpoints

- `GET /health` - Health check
- `GET /context` - Get available guides and elements
- `GET /example` - Usage examples
- `POST /v1/chat/completions` - OpenAI-compatible chat
- `POST /tools/execute` - Direct tool execution (testing)
- `GET /tools/schemas` - Tool definitions

## Development

The server automatically reloads on changes when using `npm run dev`.

For production:
1. Build documentation: `npm run build`
2. Start server: `npm start`
3. Configure environment variables for your LLM provider

