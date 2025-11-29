# W2L Render API

Production API service for rendering w2l code to SVG, PNG, and JPG formats. Runs headless using Puppeteer.

## Features

- ✅ Render w2l code to SVG, PNG, or JPG
- ✅ Configurable dimensions and quality
- ✅ Docker support
- ✅ Railway deployment ready
- ✅ CORS enabled
- ✅ Health check endpoint

## Local Development

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Step-by-Step Setup

1. **Navigate to the deployment folder**
   ```bash
   cd /Users/grzegorzjanik/Development/w2l/deployment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file** (optional)
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` if you want to customize:
   - `PORT` - Server port (default: 3000)
   - `MAX_RENDER_TIME` - Maximum render time in ms (default: 30000)
   - `MAX_IMAGE_WIDTH` - Maximum image width (default: 4096)
   - `MAX_IMAGE_HEIGHT` - Maximum image height (default: 4096)

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Verify it's running**
   ```bash
   curl http://localhost:3000/health
   ```
   
   Should return:
   ```json
   {"status":"ok","timestamp":"2025-11-29T..."}
   ```

## API Endpoints

### Health Check
```
GET /health
```

### Render to SVG
```
POST /render/svg
Content-Type: application/json

{
  "code": "const canvas = new Canvas(800, 600); canvas.add(new Rect(100, 100, 200, 150)); canvas.render('container');",
  "width": 800,
  "height": 600
}
```

### Render to PNG
```
POST /render/png
Content-Type: application/json

{
  "code": "const canvas = new Canvas(800, 600); canvas.add(new Circle(400, 300, 100)); canvas.render('container');",
  "width": 800,
  "height": 600,
  "scale": 2
}
```

### Render to JPG
```
POST /render/jpg
Content-Type: application/json

{
  "code": "const canvas = new Canvas(800, 600); canvas.add(new Text('Hello World', 400, 300)); canvas.render('container');",
  "width": 800,
  "height": 600,
  "scale": 2,
  "quality": 90
}
```

## Example Usage with curl

### Simple Rectangle (SVG)
```bash
curl -X POST http://localhost:3000/render/svg \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const canvas = new Canvas(400, 300); canvas.add(new Rect(50, 50, 300, 200, { fill: \"#4A90E2\", stroke: \"#2E5C8A\", strokeWidth: 3 })); canvas.render(\"container\");",
    "width": 400,
    "height": 300
  }' \
  -o output.svg
```

### Circle with Text (PNG)
```bash
curl -X POST http://localhost:3000/render/png \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const canvas = new Canvas(600, 400); canvas.add(new Circle(300, 200, 80, { fill: \"#FF6B6B\", stroke: \"#C92A2A\", strokeWidth: 4 })); canvas.add(new Text(\"Hello W2L\", 300, 200, { fontSize: 24, textAlign: \"center\", fill: \"white\" })); canvas.render(\"container\");",
    "width": 600,
    "height": 400,
    "scale": 2
  }' \
  -o output.png
```

### Pythagorean Theorem Diagram (JPG)
```bash
curl -X POST http://localhost:3000/render/jpg \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const canvas = new Canvas(800, 600); const stack = new Stack({ direction: \"vertical\", gap: 20, alignment: \"center\" }); stack.add(new Text(\"Pythagorean Theorem\", 0, 0, { fontSize: 32, fontWeight: \"bold\" })); const card = new Card({ width: 400, height: 300, padding: 30 }); card.add(new Line(50, 250, 350, 250, { stroke: \"#000\", strokeWidth: 2 })); card.add(new Line(350, 250, 350, 50, { stroke: \"#000\", strokeWidth: 2 })); card.add(new Line(50, 250, 350, 50, { stroke: \"#E03131\", strokeWidth: 3 })); card.add(new Text(\"a² + b² = c²\", 200, 150, { fontSize: 24, textAlign: \"center\" })); stack.add(card); canvas.add(stack); canvas.render(\"container\");",
    "width": 800,
    "height": 600,
    "scale": 2,
    "quality": 95
  }' \
  -o diagram.jpg
```

### Testing with a More Complex Example
```bash
curl -X POST http://localhost:3000/render/png \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const canvas = new Canvas(1000, 800); const grid = new Grid({ cols: 2, rows: 2, gap: 30 }); const colors = [\"#FF6B6B\", \"#4ECDC4\", \"#45B7D1\", \"#FFA07A\"]; for (let i = 0; i < 4; i++) { const card = new Card({ width: 450, height: 350, padding: 40 }); card.add(new Circle(225, 175, 60, { fill: colors[i] })); card.add(new Text(`Item ${i + 1}`, 225, 280, { fontSize: 28, textAlign: \"center\", fontWeight: \"bold\" })); grid.add(card); } canvas.add(grid); canvas.render(\"container\");",
    "width": 1000,
    "height": 800,
    "scale": 2
  }' \
  -o grid-example.png
```

## Docker Deployment

### Build Docker Image
```bash
docker build -t w2l-render-api .
```

### Run Container
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e MAX_RENDER_TIME=30000 \
  w2l-render-api
```

## Railway Deployment

1. **Install Railway CLI** (if not already installed)
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Railway project**
   ```bash
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Set environment variables** (optional)
   ```bash
   railway variables set MAX_RENDER_TIME=30000
   railway variables set MAX_IMAGE_WIDTH=4096
   railway variables set MAX_IMAGE_HEIGHT=4096
   ```

6. **Get your deployment URL**
   ```bash
   railway domain
   ```

## API Parameters

### Common Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `code` | string | *required* | W2L code to render |
| `width` | number | 800 | Canvas width in pixels |
| `height` | number | 600 | Canvas height in pixels |

### PNG/JPG Specific Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scale` | number | 2 | Device scale factor for high-DPI rendering |
| `quality` | number | 90 | JPEG quality (1-100, JPG only) |

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad request (missing required fields)
- `500` - Server error (rendering failed)

Error response format:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Performance Notes

- The service reuses a single Puppeteer browser instance for better performance
- Each request creates a new page context for isolation
- Maximum render time is configurable (default: 30 seconds)
- Maximum image dimensions are configurable to prevent memory issues

## Troubleshooting

### Puppeteer fails to launch
Make sure all required dependencies are installed. On Linux:
```bash
sudo apt-get install -y \
  wget gnupg ca-certificates \
  fonts-liberation libappindicator3-1 \
  libasound2 libatk-bridge2.0-0 libatk1.0-0 \
  libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 \
  libnspr4 libnss3 libx11-xcb1 libxcomposite1 \
  libxdamage1 libxrandr2 libgbm1 libgtk-3-0
```

### Module not found errors
Ensure you're running from the deployment directory and the parent w2l library is accessible:
```bash
cd /Users/grzegorzjanik/Development/w2l/deployment
npm install
```

## License

Same as the parent w2l project.
