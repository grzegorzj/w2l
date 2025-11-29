import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { renderToSVG, renderToImage, initializeRenderer } from './renderer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Render to SVG
app.post('/render/svg', async (req, res) => {
  const startTime = Date.now();
  try {
    const { code, width = 800, height = 600 } = req.body;
    
    console.log('[SVG] Received render request');
    console.log('[SVG] Dimensions:', { width, height });
    console.log('[SVG] Code length:', code?.length || 0);

    if (!code) {
      console.log('[SVG] Error: Missing code');
      return res.status(400).json({ error: 'Missing required field: code' });
    }

    console.log('[SVG] Starting render...');
    const svg = await renderToSVG(code, { width, height });
    
    const totalTime = Date.now() - startTime;
    console.log('\x1b[36m%s\x1b[0m', `[SVG] ✓ Render successful in ${totalTime}ms`);
    console.log('[SVG] SVG length:', svg.length);
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('\x1b[31m%s\x1b[0m', `[SVG] ✗ Render failed after ${totalTime}ms`);
    console.error('[SVG] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to render SVG', 
      message: error.message 
    });
  }
});

// Render to PNG
app.post('/render/png', async (req, res) => {
  const startTime = Date.now();
  try {
    const { code, width, height, scale = 2 } = req.body;
    
    console.log('[PNG] Received render request');
    if (width && height) {
      console.log('[PNG] Dimensions:', { width, height, scale });
    } else {
      console.log('[PNG] Auto-sizing to artboard, scale:', scale);
    }

    if (!code) {
      console.log('[PNG] Error: Missing code');
      return res.status(400).json({ error: 'Missing required field: code' });
    }

    console.log('[PNG] Starting render...');
    const imageBuffer = await renderToImage(code, { 
      width, 
      height, 
      format: 'png',
      scale 
    });
    
    const totalTime = Date.now() - startTime;
    console.log('\x1b[36m%s\x1b[0m', `[PNG] ✓ Render successful in ${totalTime}ms`);
    console.log('[PNG] Buffer size:', imageBuffer.length);
    
    res.setHeader('Content-Type', 'image/png');
    res.send(imageBuffer);
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('\x1b[31m%s\x1b[0m', `[PNG] ✗ Render failed after ${totalTime}ms`);
    console.error('[PNG] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to render PNG', 
      message: error.message 
    });
  }
});

// Render to JPG
app.post('/render/jpg', async (req, res) => {
  const startTime = Date.now();
  try {
    const { code, width, height, scale = 2, quality = 90 } = req.body;
    
    console.log('[JPG] Received render request');
    if (width && height) {
      console.log('[JPG] Dimensions:', { width, height, scale, quality });
    } else {
      console.log('[JPG] Auto-sizing to artboard, scale:', scale, 'quality:', quality);
    }

    if (!code) {
      console.log('[JPG] Error: Missing code');
      return res.status(400).json({ error: 'Missing required field: code' });
    }

    console.log('[JPG] Starting render...');
    const imageBuffer = await renderToImage(code, { 
      width, 
      height, 
      format: 'jpeg',
      scale,
      quality 
    });
    
    const totalTime = Date.now() - startTime;
    console.log('\x1b[36m%s\x1b[0m', `[JPG] ✓ Render successful in ${totalTime}ms`);
    console.log('[JPG] Buffer size:', imageBuffer.length);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.send(imageBuffer);
  } catch (error) {
    const totalTime = Date.now() - startTime;
    console.error('\x1b[31m%s\x1b[0m', `[JPG] ✗ Render failed after ${totalTime}ms`);
    console.error('[JPG] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to render JPG', 
      message: error.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// Initialize renderer before starting the server
console.log('Initializing W2L Render API...');

initializeRenderer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n✓ W2L Render API ready on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\nEndpoints:`);
      console.log(`  POST /render/svg - Render to SVG`);
      console.log(`  POST /render/png - Render to PNG`);
      console.log(`  POST /render/jpg - Render to JPG`);
      console.log(`  GET  /health    - Health check\n`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize renderer:', error);
    process.exit(1);
  });
