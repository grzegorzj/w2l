# Quick Start Guide

## What Was Added

Your deployment service now includes:

✅ **API Key Authentication** - All render endpoints are protected  
✅ **Railway Configuration** - Ready to deploy with `railway.json` and `nixpacks.toml`  
✅ **Environment Variables** - Template file with all required settings  
✅ **Comprehensive Documentation** - Complete deployment and API guides  
✅ **Test Script** - Automated testing for all endpoints

## Files Created/Modified

```
deployment/
├── server.js              (MODIFIED - Added API key auth)
├── renderer.js            (Unchanged)
├── package.json           (NEW - Dependencies and scripts)
├── railway.json           (NEW - Railway config)
├── nixpacks.toml          (NEW - Build configuration)
├── env.template           (NEW - Environment variables template)
├── .gitignore             (NEW - Ignore sensitive files)
├── .dockerignore          (NEW - Cleaner builds)
├── README.md              (NEW - Service documentation)
├── RAILWAY_DEPLOYMENT.md  (NEW - Deployment guide)
├── QUICKSTART.md          (NEW - This file)
└── test-api.sh            (NEW - Test script)
```

## Deploy to Railway in 5 Minutes

### Step 1: Prepare Your Repository

Make sure your W2L library is built:

```bash
cd /Users/grzegorzjanik/Development/w2l
npm run build
```

Commit and push all changes:

```bash
git add deployment/
git commit -m "Add Railway deployment with API key authentication"
git push origin main
```

### Step 2: Create Railway Project

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `w2l` repository
5. Railway will start deploying automatically

### Step 3: Configure the Service

1. Click on your service in Railway dashboard
2. Go to **"Settings"** tab
3. Under **"Root Directory"**, set it to: `deployment`
4. Click **"Save"**

### Step 4: Set Environment Variables

1. Go to the **"Variables"** tab
2. Click **"+ New Variable"**
3. Add the following:

```bash
# Generate a secure API key first:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Then add these variables in Railway:
API_KEY=<paste-your-generated-key-here>
NODE_ENV=production
```

### Step 5: Deploy

Railway will automatically redeploy with your changes. Wait for the build to complete (usually 2-3 minutes).

### Step 6: Get Your URL

1. Go to the **"Settings"** tab
2. Click **"Generate Domain"** under "Networking"
3. Copy your public URL (e.g., `https://your-service.up.railway.app`)

### Step 7: Test Your API

```bash
# Set your values
export RAILWAY_URL="https://your-service.up.railway.app"
export API_KEY="your-generated-api-key"

# Test health check
curl $RAILWAY_URL/health

# Test SVG rendering
curl -X POST $RAILWAY_URL/render/svg \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{
    "code": "const artboard = new Artboard({ width: 400, height: 300, background: \"white\" }); const rect = new Rect({ x: 50, y: 50, width: 100, height: 100, fill: \"blue\" }); artboard.add(rect);",
    "width": 400,
    "height": 300
  }' \
  --output test.svg

# Or use the test script
cd deployment
./test-api.sh $RAILWAY_URL $API_KEY
```

## Local Testing

Want to test locally before deploying?

### 1. Install Dependencies

```bash
cd /Users/grzegorzjanik/Development/w2l/deployment
npm install
```

### 2. Create Environment File

```bash
cp env.template .env
```

Edit `.env` and set your API_KEY:

```bash
# Generate a key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Then edit .env:
API_KEY=<your-generated-key>
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

```bash
npm start
```

### 4. Test Locally

```bash
# In a new terminal:
export API_KEY="<your-key-from-env>"
./test-api.sh http://localhost:3000 $API_KEY
```

## Using Your API

### JavaScript/Fetch

```javascript
const renderW2L = async (code) => {
  const response = await fetch(
    "https://your-service.up.railway.app/render/svg",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "your-api-key",
      },
      body: JSON.stringify({
        code: code,
        width: 800,
        height: 600,
      }),
    }
  );

  return await response.text(); // SVG string
};
```

### Python/Requests

```python
import requests

def render_w2l(code):
    response = requests.post(
        'https://your-service.up.railway.app/render/png',
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': 'your-api-key'
        },
        json={'code': code, 'scale': 2}
    )
    return response.content  # PNG bytes
```

### cURL

```bash
curl -X POST https://your-service.up.railway.app/render/png \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"code": "...", "scale": 2}' \
  --output diagram.png
```

## Important Security Notes

🔒 **Keep Your API Key Secret!**

- Never commit `.env` to version control
- Don't share your API key publicly
- Rotate your key periodically
- Use different keys for development and production

🔍 **Monitor Usage**

- Check Railway's usage dashboard regularly
- Set up usage alerts if available
- Monitor logs for suspicious activity

## Troubleshooting

### Build Fails on Railway

**Problem:** Railway can't find the W2L library

**Solution:** Make sure you've run `npm run build` in the parent directory and committed the `dist/` folder to git.

### API Returns 401/403

**Problem:** Authentication error

**Solution:**

- Check that you've set `API_KEY` environment variable in Railway
- Verify you're sending the correct API key in requests
- Make sure you're using the header `X-API-Key` or `Authorization: Bearer <key>`

### First Request Takes Forever

**Problem:** Initial request is slow

**Solution:** This is normal! The first request initializes Puppeteer and loads the W2L library. Subsequent requests will be much faster (typically 100-500ms).

### Out of Memory

**Problem:** Railway service runs out of memory

**Solution:**

- Upgrade to a plan with more RAM (1GB recommended)
- Reduce `MAX_IMAGE_WIDTH` and `MAX_IMAGE_HEIGHT` in environment variables
- Implement request queuing to limit concurrent renders

## Next Steps

1. ✅ Deploy to Railway
2. 📝 Save your API key securely
3. 🧪 Test all endpoints
4. 📊 Monitor usage and performance
5. 🔧 Adjust settings as needed
6. 🚀 Integrate into your applications!

## Need Help?

- **API Documentation:** See `README.md`
- **Deployment Details:** See `RAILWAY_DEPLOYMENT.md`
- **Test Your Setup:** Run `./test-api.sh`
- **Railway Docs:** https://docs.railway.app/

Happy rendering! 🎨
