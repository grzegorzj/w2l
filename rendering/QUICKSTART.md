# W2L Renderer API - Quick Start Guide

Get the W2L Renderer API running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Build Parent Library

The renderer needs the w2l library to be built first:

```bash
cd ..
npm run build
cd deployment
```

## Step 3: Start the Server

```bash
npm start
```

You should see:
```
🚀 W2L Renderer API running on port 3000
   Health check: http://localhost:3000/health
   Render endpoint: http://localhost:3000/render
```

## Step 4: Test It

Test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "w2l-renderer",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Step 5: Render Your First Image

Create a test file `test-render.json`:

```json
{
  "code": "import { Artboard, Circle } from 'w2l'; const artboard = new Artboard({ width: 400, height: 400, backgroundColor: '#f5f5f5' }); const circle = new Circle({ radius: 100, style: { fill: '#3498db', stroke: '#2980b9', strokeWidth: 3 } }); circle.position({ relativeFrom: circle.center, relativeTo: artboard.contentBox.center, x: 0, y: 0 }); artboard.addElement(circle); return artboard.render();",
  "format": "svg"
}
```

Render it:

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -d @test-render.json > output.svg
```

Open `output.svg` in your browser to see the result!

## Step 6: Try PNG Output

```bash
curl -X POST http://localhost:3000/render \
  -H "Content-Type: application/json" \
  -d '{
    "code": "import { Artboard, Circle } from \"w2l\"; const artboard = new Artboard({ width: 400, height: 400, backgroundColor: \"#f5f5f5\" }); const circle = new Circle({ radius: 100, style: { fill: \"#3498db\" } }); circle.position({ relativeFrom: circle.center, relativeTo: artboard.contentBox.center, x: 0, y: 0 }); artboard.addElement(circle); return artboard.render();",
    "format": "png",
    "width": 800
  }' > output.png
```

## Common Issues

### "W2L library not found"

**Solution**: Build the parent library:
```bash
cd ..
npm run build
cd deployment
```

### "Cannot find module 'sharp'"

**Solution**: Install dependencies:
```bash
npm install
```

### Port 3000 already in use

**Solution**: Use a different port:
```bash
PORT=8000 npm start
```

## Next Steps

- 📖 Read the [full README](./README.md) for API documentation
- 🚀 See the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for production setup
- 🧪 Run tests with `npm test`
- 🐳 Try Docker: `./build.sh`

## Example Code Snippets

### Simple Circle

```javascript
import { Artboard, Circle } from "w2l";

const artboard = new Artboard({
  width: 400,
  height: 400,
  backgroundColor: "#f5f5f5"
});

const circle = new Circle({
  radius: 100,
  style: { fill: "#3498db", stroke: "#2980b9", strokeWidth: 3 }
});

circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.contentBox.center,
  x: 0,
  y: 0
});

artboard.addElement(circle);
return artboard.render();
```

### Multiple Shapes

```javascript
import { Artboard, Circle, Square, Triangle } from "w2l";

const artboard = new Artboard({
  width: 600,
  height: 400,
  backgroundColor: "#ecf0f1"
});

const circle = new Circle({
  radius: 60,
  style: { fill: "#e74c3c" }
});

const square = new Square({
  side: 120,
  style: { fill: "#3498db" }
});

const triangle = new Triangle({
  type: "equilateral",
  a: 120,
  style: { fill: "#2ecc71" }
});

// Position shapes
circle.position({
  relativeFrom: circle.center,
  relativeTo: artboard.contentBox.topLeft,
  x: 100, y: 100
});

square.position({
  relativeFrom: square.center,
  relativeTo: artboard.contentBox.center,
  x: 0, y: 0
});

triangle.position({
  relativeFrom: triangle.center,
  relativeTo: artboard.contentBox.bottomRight,
  x: -100, y: -80
});

artboard.addElement(circle);
artboard.addElement(square);
artboard.addElement(triangle);

return artboard.render();
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/render` | POST | Render single image |
| `/render/batch` | POST | Render multiple images |

## Support

- 📧 Issues? Check the troubleshooting section in [README.md](./README.md)
- 📝 Need examples? See [examples.js](./examples.js)
- 🧪 Run tests: `npm test`

Happy rendering! 🎨

