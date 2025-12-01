# Railway Deployment Guide

This guide will walk you through deploying the W2L Render API to Railway.

## Prerequisites

1. A [Railway account](https://railway.app/) (sign up for free)
2. Railway CLI installed (optional, but recommended)
3. Your W2L library built (run `npm run build` in the parent directory)

## Environment Variables Required

The service requires the following environment variables:

- `API_KEY` (REQUIRED) - A secure API key for authentication
- `PORT` (optional) - Railway will set this automatically
- `NODE_ENV` (optional) - Set to `production` 
- `MAX_RENDER_TIME` (optional) - Max time for rendering in ms (default: 30000)
- `MAX_IMAGE_WIDTH` (optional) - Max image width (default: 4096)
- `MAX_IMAGE_HEIGHT` (optional) - Max image height (default: 4096)

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Easiest)

1. **Create a New Project**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account if not already connected
   - Select your repository

2. **Configure the Service**
   - Railway will auto-detect the deployment configuration
   - It will use the `railway.json` configuration file

3. **Set Environment Variables**
   - In your project, click on the service
   - Go to the "Variables" tab
   - Add the following variables:
     ```
     API_KEY=<generate-a-secure-random-key-here>
     NODE_ENV=production
     ```
   - To generate a secure API key, you can use:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

4. **Set Root Directory**
   - In the service settings, go to "Settings"
   - Under "Root Directory", set it to: `deployment`
   - This tells Railway to deploy from the deployment folder

5. **Deploy**
   - Railway will automatically build and deploy your service
   - Once deployed, you'll get a public URL

### Option 2: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd deployment
   railway init
   ```

4. **Set Environment Variables**
   ```bash
   # Generate a secure API key
   API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
   
   # Set the variables
   railway variables set API_KEY=$API_KEY
   railway variables set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Get Your URL**
   ```bash
   railway domain
   ```

## After Deployment

### Testing Your Deployment

Once deployed, test your API with:

```bash
# Get your Railway URL (e.g., https://your-service.up.railway.app)
RAILWAY_URL="https://your-service.up.railway.app"
YOUR_API_KEY="your-api-key-here"

# Test health endpoint (no auth required)
curl $RAILWAY_URL/health

# Test SVG rendering
curl -X POST $RAILWAY_URL/render/svg \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $YOUR_API_KEY" \
  -d '{
    "code": "const artboard = new Artboard({ width: 400, height: 300, background: \"#f0f0f0\" }); const rect = new Rect({ x: 50, y: 50, width: 100, height: 100, fill: \"blue\" }); artboard.add(rect);",
    "width": 400,
    "height": 300
  }' \
  --output test.svg

# Test PNG rendering
curl -X POST $RAILWAY_URL/render/png \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $YOUR_API_KEY" \
  -d '{
    "code": "const artboard = new Artboard({ width: 400, height: 300, background: \"#f0f0f0\" }); const rect = new Rect({ x: 50, y: 50, width: 100, height: 100, fill: \"blue\" }); artboard.add(rect);",
    "scale": 2
  }' \
  --output test.png
```

### Using the API

The API supports two authentication methods:

1. **X-API-Key header** (recommended):
   ```javascript
   fetch('https://your-service.up.railway.app/render/svg', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'X-API-Key': 'your-api-key'
     },
     body: JSON.stringify({
       code: 'const artboard = new Artboard({ width: 400, height: 300 }); ...',
       width: 400,
       height: 300
     })
   })
   ```

2. **Authorization Bearer header**:
   ```javascript
   fetch('https://your-service.up.railway.app/render/svg', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer your-api-key'
     },
     body: JSON.stringify({
       code: 'const artboard = new Artboard({ width: 400, height: 300 }); ...',
       width: 400,
       height: 300
     })
   })
   ```

## API Endpoints

### `GET /health`
Health check endpoint (no authentication required)

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### `POST /render/svg`
Render W2L code to SVG

**Headers:**
- `X-API-Key: your-api-key` (or `Authorization: Bearer your-api-key`)

**Body:**
```json
{
  "code": "const artboard = new Artboard({ width: 400, height: 300 }); ...",
  "width": 400,
  "height": 300
}
```

**Response:** SVG content (Content-Type: image/svg+xml)

### `POST /render/png`
Render W2L code to PNG

**Headers:**
- `X-API-Key: your-api-key` (or `Authorization: Bearer your-api-key`)

**Body:**
```json
{
  "code": "const artboard = new Artboard({ width: 400, height: 300 }); ...",
  "scale": 2
}
```

**Response:** PNG image (Content-Type: image/png)

### `POST /render/jpg`
Render W2L code to JPEG

**Headers:**
- `X-API-Key: your-api-key` (or `Authorization: Bearer your-api-key`)

**Body:**
```json
{
  "code": "const artboard = new Artboard({ width: 400, height: 300 }); ...",
  "scale": 2,
  "quality": 90
}
```

**Response:** JPEG image (Content-Type: image/jpeg)

## Important Notes

### Building the W2L Library

Before deploying, make sure you've built the W2L library:

```bash
cd /path/to/w2l
npm run build
```

The deployment service needs the compiled `dist/` folder from the parent directory. Railway will need access to this.

### Monorepo Structure

If your repository is a monorepo, ensure:
1. The "Root Directory" is set to `deployment` in Railway settings
2. The parent `dist/` folder is accessible (Railway should have access to parent directory)
3. If Railway can't access parent directory, you may need to copy the `dist` folder into `deployment/`

### Resource Requirements

The service uses Puppeteer which requires:
- At least 512MB RAM (1GB recommended)
- Node.js 18 or higher

Railway's free tier should be sufficient for development/testing, but consider upgrading for production workloads.

### Security

- **Never commit your API key to version control**
- Generate a secure, random API key for production
- Rotate your API key periodically
- Monitor your Railway logs for unauthorized access attempts

## Troubleshooting

### "API_KEY environment variable is not set"
Make sure you've set the `API_KEY` environment variable in Railway's dashboard.

### "w2l library not built"
Run `npm run build` in the parent directory before deploying.

### Puppeteer errors
Railway's environment should support Puppeteer out of the box. If you encounter issues, check the deployment logs.

### Build fails
Ensure your `package.json` and `railway.json` are properly configured and in the deployment folder.

## Cost Optimization

Railway charges based on usage. To optimize costs:

1. **Set appropriate timeouts** - The default `MAX_RENDER_TIME` is 30s
2. **Monitor usage** - Check Railway's usage dashboard regularly
3. **Implement rate limiting** - Consider adding rate limiting for production
4. **Cache results** - Consider caching rendered SVGs/images if possible

## Support

For issues with:
- **W2L Library**: Check the main project repository
- **Railway Platform**: Visit [Railway docs](https://docs.railway.app/) or their Discord
- **This Deployment**: Check the deployment logs in Railway dashboard


