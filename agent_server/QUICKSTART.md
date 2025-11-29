# Quick Start Guide

Get the W2L Agent Server running in under 2 minutes.

## Installation

```bash
# 1. Set up your API key (in project root)
echo "CEREBRAS_API_KEY=your-key-here" > .env

# 2. Install and start
cd agent_server
npm install
npm run dev
```

That's it! The AI-powered server is now running on `http://localhost:3100`

## Test It

### 1. Health Check

```bash
curl http://localhost:3100/health
```

### 2. See What's Available

```bash
curl http://localhost:3100/context
```

This shows all guides and elements the agent can access.

### 3. Get a Guide

```bash
curl -X POST http://localhost:3100/tools/execute \
  -H "Content-Type: application/json" \
  -d '{"tool":"get_guides","arguments":{"guides":["basic-shapes"]}}'
```

### 4. Get Element Documentation

```bash
curl -X POST http://localhost:3100/tools/execute \
  -H "Content-Type: application/json" \
  -d '{"tool":"get_elements","arguments":{"elements":["Circle","Rect","Text"]}}'
```

## What You Get

The agent can help generate SVG visualizations by:

1. **Reading guides** - Understanding different types of diagrams
2. **Looking up elements** - Getting exact API details
3. **Generating code** - Creating W2L library code

## Example Response

When you call `get_elements` for "Circle":

```json
{
  "result": [{
    "name": "Circle",
    "category": "elements",
    "description": "A simple circle element for testing positioning.",
    "config": "CircleConfig",
    "properties": [
      {"name": "radius", "type": "number", "required": true},
      {"name": "style", "type": "Partial<Style>", "required": false}
    ]
  }]
}
```

## Next Steps

- **Add more guides**: Create `.md` files in `agent_server/guides/`
- **Integrate with LLM**: See `INTEGRATION.md` for Cerebras setup
- **Auto-rebuild**: Run `npm run build` after changing library code

## Troubleshooting

**Port already in use?**
```bash
# Change the port
PORT=3200 npm start
```

**Documentation not found?**
```bash
# Rebuild it
npm run build
```

**Need to add a guide?**
1. Create `agent_server/guides/your-guide.md`
2. Run `npm run build`
3. Restart server

## File Structure

```
agent_server/
├── server.js           # Main server
├── tools.js            # Tool implementations  
├── guides/             # Your guides (add here!)
│   └── basic-shapes.md
├── scripts/
│   └── build-docs.js   # Extracts from /lib
└── generated/          # Auto-generated (don't edit)
    ├── elements.json
    └── guides.json
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Check if server is running |
| `/context` | GET | Get all guides and elements |
| `/tools/execute` | POST | Execute a tool directly |
| `/tools/schemas` | GET | Get tool definitions |
| `/v1/chat/completions` | POST | OpenAI-compatible endpoint |

## Using with AI (Cerebras)

**The server handles everything automatically!** Just send your request:

```bash
curl -X POST http://localhost:3100/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Create a bar chart"}]}'
```

Behind the scenes:

1. Server receives: "Create a bar chart"
2. AI calls `get_guides(["charts"])` automatically
3. AI reads the chart guide
4. AI calls `get_elements(["BarChart"])` automatically
5. AI generates code:

```javascript
import { Artboard, BarChart } from 'w2l';

const chart = new BarChart({
  data: [
    { label: 'Jan', value: 10 },
    { label: 'Feb', value: 20 }
  ],
  width: 400,
  height: 300
});

const artboard = new Artboard({ width: 500, height: 400 });
artboard.addChild(chart);
console.log(artboard.render());
```

See `cerebras-example.js` for a complete implementation with tool calling loop.

## Running Tests

```bash
# Start server in one terminal
npm run dev

# In another terminal
./test-simple.sh
```

## Scripts

- `npm run build` - Build documentation
- `npm start` - Start server (after building)
- `npm run dev` - Build and start (recommended)
- `./run.sh` - One-liner build and start
- `./test-simple.sh` - Test all endpoints

## That's It!

You now have a working agent server that can:
- ✅ Provide documentation on-demand
- ✅ Integrate with any OpenAI-compatible LLM
- ✅ Auto-update when library changes
- ✅ Support tool calling workflows

For advanced usage, see:
- `README.md` - Full documentation
- `INTEGRATION.md` - Cerebras integration guide
- `cerebras-example.js` - Complete example with LLM

