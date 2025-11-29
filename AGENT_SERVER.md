# W2L Agent Server

The W2L Agent Server enables LLMs to intelligently generate SVG visualizations using the W2L library through tool calling.

## Quick Start

```bash
# 1. Set up API key (create .env in project root)
echo "CEREBRAS_API_KEY=your-key-here" > .env

# 2. Install and start
cd agent_server && npm install && npm run dev
```

Server runs on `http://localhost:3100` with **full Cerebras AI integration**

## What It Does

The agent server provides:

1. **Tool Calling Infrastructure** - Get guides and element documentation on-demand
2. **Automatic Documentation** - Extracts API docs from TypeScript source
3. **OpenAI-Compatible API** - Works with Cerebras and other providers
4. **Smart Context** - Programmatic guide and element discovery

## Agent Workflow

```
User: "Create a bar chart"
  ↓
Agent: Calls get_guides(["charts"])
  ↓
Agent: Reads chart documentation
  ↓
Agent: Calls get_elements(["BarChart"])
  ↓
Agent: Gets detailed API specs
  ↓
Agent: Generates W2L code
```

## Documentation

See `agent_server/` directory for:

- **QUICKSTART.md** - Get started in 2 minutes
- **README.md** - Full documentation
- **INTEGRATION.md** - Cerebras integration guide
- **IMPLEMENTATION_SUMMARY.md** - Technical details

## Testing Without LLM

```bash
# Start server
cd agent_server && npm run dev

# In another terminal - run tests
cd agent_server && ./test-simple.sh
```

## Testing With AI

**The server now has Cerebras fully integrated!**

```bash
# Start server (in one terminal)
cd agent_server && npm run dev

# Test AI (in another terminal)
cd agent_server
./test-ai.sh "Create a blue circle"

# Or use the example client
node cerebras-example.js "Create a diagram with three circles"

# Or use curl directly
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Create a circle"}]}'
```

## Available Tools

1. **get_guides** - Retrieve documentation for specific topics
2. **get_elements** - Get API details for specific elements

## Current Content

- **36 elements** automatically documented
- **2 guides** available (basic-shapes, layouts)
- **4 categories** (elements, components, layout, themed-components)

## Adding Content

### Add a Guide

1. Create `agent_server/guides/your-guide.md`
2. Run `npm run build` in agent_server
3. Guide is now available to agents

### Update Element Docs

Element documentation updates automatically when you:
1. Modify TypeScript files in `/lib`
2. Run `npm run build` in `agent_server/`

## Architecture

```
agent_server/
├── server.js              # Express server with OpenAI API
├── tools.js               # Tool implementations
├── guides/                # Markdown guides (add here!)
├── scripts/build-docs.js  # Extracts from /lib
└── generated/             # Auto-generated docs (don't edit)
```

## Requirements

- Node.js 18+
- npm or yarn
- (Optional) Cerebras API key for LLM integration

## Status

✅ Fully implemented and tested  
✅ Production ready  
✅ OpenAI compatible  
✅ Automatic documentation  
✅ Easy to extend  

## More Information

All documentation is in the `agent_server/` directory. Start with `QUICKSTART.md` for the fastest path to running the server.

