# W2L Render API

A production-ready REST API service for rendering W2L (Words to Lines) code to SVG, PNG, and JPEG formats.

## Features

- 🎨 Render W2L code to **SVG**, **PNG**, or **JPEG**
- 🔐 **API Key authentication** for secure access
- 🚀 Optimized with **Puppeteer** for fast rendering
- 📦 Ready for **Railway deployment**
- 🔧 Configurable dimensions, scale, and quality
- 💪 Handles complex visualizations and layouts

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the W2L library** (from parent directory):
   ```bash
   cd ..
   npm run build
   cd deployment
   ```

3. **Set up environment variables:**
   ```bash
   cp env.template .env
   # Edit .env and set your API_KEY
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   ```

### Deploy to Railway

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for complete deployment instructions.

**Quick deploy:**
1. Push your code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repository
4. Set root directory to `deployment`
5. Add environment variable: `API_KEY=<your-secure-key>`
6. Deploy!

## API Usage

### Authentication

All render endpoints require authentication via API key. Include it in one of two ways:

**Option 1: X-API-Key header (recommended)**
```bash
curl -H "X-API-Key: your-api-key" ...
```

**Option 2: Authorization Bearer header**
```bash
curl -H "Authorization: Bearer your-api-key" ...
```

### Endpoints

#### Health Check
```bash
GET /health
```
No authentication required.

#### Render to SVG
```bash
POST /render/svg
Content-Type: application/json
X-API-Key: your-api-key

{
  "code": "const artboard = new Artboard({ width: 400, height: 300 }); ...",
  "width": 400,
  "height": 300
}
```

#### Render to PNG
```bash
POST /render/png
Content-Type: application/json
X-API-Key: your-api-key

{
  "code": "const artboard = new Artboard({ width: 400, height: 300 }); ...",
  "scale": 2
}
```

#### Render to JPEG
```bash
POST /render/jpg
Content-Type: application/json
X-API-Key: your-api-key

{
  "code": "const artboard = new Artboard({ width: 400, height: 300 }); ...",
  "scale": 2,
  "quality": 90
}
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_KEY` | ✅ Yes | - | Secure API key for authentication |
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment (production/development) |
| `MAX_RENDER_TIME` | No | 30000 | Max render time in milliseconds |
| `MAX_IMAGE_WIDTH` | No | 4096 | Maximum image width |
| `MAX_IMAGE_HEIGHT` | No | 4096 | Maximum image height |

## Example Usage

### JavaScript/TypeScript

```javascript
async function renderW2L(code) {
  const response = await fetch('https://your-api.railway.app/render/svg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'your-api-key'
    },
    body: JSON.stringify({
      code,
      width: 800,
      height: 600
    })
  });
  
  return await response.text(); // SVG content
}
```

### Python

```python
import requests

def render_w2l(code):
    response = requests.post(
        'https://your-api.railway.app/render/png',
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': 'your-api-key'
        },
        json={
            'code': code,
            'scale': 2
        }
    )
    
    return response.content  # PNG bytes
```

### cURL

```bash
# Render to SVG
curl -X POST https://your-api.railway.app/render/svg \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "code": "const artboard = new Artboard({ width: 400, height: 300, background: \"white\" }); const rect = new Rect({ x: 50, y: 50, width: 100, height: 100, fill: \"blue\" }); artboard.add(rect);",
    "width": 400,
    "height": 300
  }' \
  --output diagram.svg

# Render to PNG
curl -X POST https://your-api.railway.app/render/png \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "code": "const artboard = new Artboard({ width: 400, height: 300, background: \"white\" }); const circle = new Circle({ cx: 200, cy: 150, r: 50, fill: \"red\" }); artboard.add(circle);",
    "scale": 2
  }' \
  --output diagram.png
```

## Architecture

- **Express.js** - HTTP server and routing
- **Puppeteer** - Headless browser for rendering
- **W2L Library** - Core visualization library (from parent directory)

The service works by:
1. Receiving W2L code via HTTP POST
2. Creating an HTML page with the W2L library loaded
3. Executing the code in a headless browser
4. Capturing the rendered output as SVG/PNG/JPEG
5. Returning the result to the client

## Security

- API key authentication protects all render endpoints
- Request size limited to 10MB
- Render timeouts prevent infinite loops
- Image dimensions are capped to prevent abuse
- CORS enabled for cross-origin requests

## Performance

- Browser instance is reused across requests
- W2L library is preloaded and cached
- Static files served from in-memory server
- Typical render times: 100-500ms

## Troubleshooting

### "API_KEY environment variable is not set"
Set the `API_KEY` environment variable before starting the server.

### "w2l library not built"
Run `npm run build` in the parent directory.

### Slow first request
The first request initializes Puppeteer and loads the W2L library, which takes longer. Subsequent requests are much faster.

### Out of memory errors
Increase the available memory or reduce `MAX_IMAGE_WIDTH` and `MAX_IMAGE_HEIGHT`.

## License

MIT

## Support

For issues and questions, please refer to the main W2L project repository.


