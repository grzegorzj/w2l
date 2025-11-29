import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_RENDER_TIME = parseInt(process.env.MAX_RENDER_TIME) || 30000;
const MAX_WIDTH = parseInt(process.env.MAX_IMAGE_WIDTH) || 4096;
const MAX_HEIGHT = parseInt(process.env.MAX_IMAGE_HEIGHT) || 4096;

let browser = null;
let staticServer = null;
let staticServerPort = null;
let w2lLibraryCode = null;

/**
 * Load and bundle the w2l library code for injection
 */
async function loadW2LLibrary() {
  if (w2lLibraryCode) {
    return w2lLibraryCode;
  }

  console.log('[Renderer] Loading w2l library...');
  
  const distPath = path.resolve(__dirname, '../dist');
  const indexPath = path.join(distPath, 'index.js');
  
  if (!fs.existsSync(indexPath)) {
    throw new Error('w2l library not built. Run: npm run build in parent directory');
  }

  // Read all the necessary files and bundle them
  // We'll need to follow imports and concatenate everything
  const files = getAllFilesInDist(distPath);
  
  console.log(`[Renderer] Found ${files.length} library files`);
  
  // For now, use a simpler approach: serve via static server for ES modules
  // But we'll preload a page with the library already imported
  w2lLibraryCode = 'loaded'; // Marker that we've checked
  
  return w2lLibraryCode;
}

function getAllFilesInDist(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFilesInDist(filePath, fileList);
    } else if (file.endsWith('.js') && !file.endsWith('.map')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Start a local static file server for serving w2l library files
 */
async function getStaticServer() {
  if (staticServer) {
    return staticServerPort;
  }

  const app = express();
  
  // Enable CORS for all origins (since we're loading from null origin in puppeteer)
  app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }));
  
  // Serve the parent directory (w2l root) as static files
  const w2lRoot = path.resolve(__dirname, '..');
  console.log('[Renderer] Serving w2l files from:', w2lRoot);
  app.use(express.static(w2lRoot));

  // Find an available port
  staticServerPort = await new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      console.log('[Renderer] Static file server started on port:', port);
      staticServer = server;
      resolve(port);
    });
    server.on('error', reject);
  });

  return staticServerPort;
}

/**
 * Get or create a browser instance
 */
async function getBrowser() {
  if (!browser) {
    console.log('[Renderer] Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
    });
    console.log('[Renderer] Browser launched successfully');

    // Cleanup on exit
    process.on('exit', async () => {
      if (browser) {
        console.log('[Renderer] Closing browser on exit');
        await browser.close();
      }
    });
    
    process.on('SIGINT', async () => {
      if (browser) {
        console.log('[Renderer] Closing browser on SIGINT');
        await browser.close();
        process.exit(0);
      }
    });
    
    process.on('SIGTERM', async () => {
      if (browser) {
        console.log('[Renderer] Closing browser on SIGTERM');
        await browser.close();
        process.exit(0);
      }
    });
  }
  return browser;
}

/**
 * Initialize the renderer (browser and static server)
 * Call this at startup to avoid delays on first request
 */
export async function initializeRenderer() {
  console.log('[Renderer] Initializing...');
  
  // Load w2l library
  await loadW2LLibrary();
  
  // Start static server
  await getStaticServer();
  
  // Launch browser
  const browser = await getBrowser();
  
  // Create a template page with w2l preloaded
  console.log('[Renderer] Preloading w2l library in browser...');
  const testPage = await browser.newPage();
  const html = createRenderPage('', 100, 100, staticServerPort);
  
  const t1 = Date.now();
  await testPage.setContent(html, { 
    waitUntil: 'domcontentloaded',
    timeout: MAX_RENDER_TIME 
  });
  
  // Wait for w2l to load
  await testPage.waitForFunction(
    () => window.w2l !== undefined,
    { timeout: MAX_RENDER_TIME }
  );
  
  const preloadTime = Date.now() - t1;
  console.log(`[Renderer] w2l library preloaded in ${preloadTime}ms`);
  
  await testPage.close();
  
  console.log('[Renderer] Initialization complete');
}

/**
 * Create HTML page that renders w2l code
 * The w2l library is loaded once and cached by the browser
 */
function createRenderPage(code, width, height, serverPort) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    #container {
      width: ${width}px;
      height: ${height}px;
    }
  </style>
  <!-- Preload the w2l library as a module -->
  <link rel="modulepreload" href="http://localhost:${serverPort}/dist/index.js">
</head>
<body>
  <div id="container"></div>
  <script type="module">
    const t0 = performance.now();
    
    try {
      // Import w2l from local static server (should be cached after first load)
      const w2l = await import('http://localhost:${serverPort}/dist/index.js');
      
      const t1 = performance.now();
      console.log('[Page] w2l loaded in ' + (t1 - t0).toFixed(2) + 'ms');
      
      // Make w2l available globally
      window.w2l = w2l;
      
      // Execute user code and capture artboard
      const t2 = performance.now();
      
      // Wrap user code to automatically capture and render the artboard
      const wrappedCode = \`
        const { Artboard: OriginalArtboard, Rect, Circle, Text, Line, Arrow, Grid, Columns, Card, Container, Triangle, Quadrilateral, RegularPolygon, Square, TextArea, Latex, FunctionGraph, Image, BezierCurve, Angle, BarChart, Bar, DonutChart, LineChart, DataPoint, Chart, RadarChart } = w2l;
        
        let __artboard__ = null;
        
        // Intercept Artboard construction to capture the instance
        const Artboard = new Proxy(OriginalArtboard, {
          construct(target, args) {
            const instance = new target(...args);
            __artboard__ = instance;
            return instance;
          }
        });
        
        // Execute user code
        ${code.replace(/artboard\.render\(['"]container['"]\)/g, '').replace(/\.render\(\s*\)/g, '')}
        
        // Return the captured artboard
        return __artboard__;
      \`;
      
      const userFunction = new Function('w2l', wrappedCode);
      const artboard = userFunction(w2l);
      
      const t3 = performance.now();
      console.log('[Page] Code executed in ' + (t3 - t2).toFixed(2) + 'ms');
      
      if (artboard && typeof artboard.render === 'function') {
        const svgString = artboard.render();
        
        const t4 = performance.now();
        console.log('[Page] Artboard rendered in ' + (t4 - t3).toFixed(2) + 'ms');
        
        // Insert into container
        const container = document.getElementById('container');
        if (container && svgString) {
          container.innerHTML = svgString;
        } else {
          window.renderError = 'Failed to insert SVG into container';
        }
      } else {
        window.renderError = 'No artboard was created. Please create an Artboard instance.';
      }
      
      // Signal that rendering is complete
      window.renderComplete = true;
      
      const tTotal = performance.now();
      console.log('[Page] Total page time: ' + tTotal.toFixed(2) + 'ms');
      
    } catch (error) {
      console.error('[Page] Fatal error:', error);
      console.error('[Page] Stack:', error.stack);
      window.renderError = error.message + ' | Stack: ' + error.stack;
    }
  </script>
</body>
</html>
  `;
}

/**
 * Render w2l code to SVG
 */
export async function renderToSVG(code, options = {}) {
  const timings = {};
  const startTime = Date.now();
  
  const { width = 800, height = 600 } = options;

  console.log('[Renderer] Starting SVG render');
  console.log('[Renderer] Dimensions:', { width, height });

  // Validate dimensions
  if (width > MAX_WIDTH || height > MAX_HEIGHT) {
    throw new Error(`Dimensions exceed maximum allowed (${MAX_WIDTH}x${MAX_HEIGHT})`);
  }

  const t1 = Date.now();
  const browser = await getBrowser();
  const page = await browser.newPage();
  timings.pageCreation = Date.now() - t1;

  // Listen to console messages from the page
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[Browser ${type}]`, text);
  });

  // Listen to page errors
  page.on('pageerror', error => {
    console.error('[Browser Error]', error.message);
  });

  try {
    // Get static server port (already running from initialization)
    const serverPort = staticServerPort;
    
    const t2 = Date.now();
    await page.setViewport({ width, height });
    timings.viewport = Date.now() - t2;

    // Create HTML content
    const html = createRenderPage(code, width, height, serverPort);
    
    const t3 = Date.now();
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded', // Changed from 'networkidle0' for speed
      timeout: MAX_RENDER_TIME 
    });
    timings.contentLoad = Date.now() - t3;

    // Wait for rendering to complete
    const t4 = Date.now();
    await page.waitForFunction(
      () => window.renderComplete || window.renderError,
      { timeout: MAX_RENDER_TIME }
    );
    timings.rendering = Date.now() - t4;

    // Check for render errors
    const renderError = await page.evaluate(() => window.renderError);
    if (renderError) {
      console.error('[Renderer] Render error from page:', renderError);
      throw new Error(`Render error: ${renderError}`);
    }

    // Extract SVG from the container
    const t5 = Date.now();
    const svg = await page.evaluate(() => {
      const container = document.getElementById('container');
      if (!container) return null;
      
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        return svgElement.outerHTML;
      }
      
      // Check if SVG is anywhere in the document
      const anySvg = document.querySelector('svg');
      if (anySvg) {
        return anySvg.outerHTML;
      }
      
      return null;
    });
    timings.svgExtraction = Date.now() - t5;

    if (!svg) {
      console.error('[Renderer] No SVG found after rendering');
      throw new Error('No SVG element found after rendering');
    }

    timings.total = Date.now() - startTime;
    
    // Print timing summary in cyan
    console.log('\x1b[36m%s\x1b[0m', `[Timing] Page: ${timings.pageCreation}ms | Viewport: ${timings.viewport}ms | Load: ${timings.contentLoad}ms | Render: ${timings.rendering}ms | Extract: ${timings.svgExtraction}ms | Total: ${timings.total}ms`);
    
    return svg;

  } finally {
    await page.close();
    console.log('[Renderer] Page closed');
  }
}

/**
 * Render w2l code to image (PNG or JPEG)
 */
export async function renderToImage(code, options = {}) {
  const timings = {};
  const startTime = Date.now();
  
  const { 
    width: requestedWidth, 
    height: requestedHeight, 
    format = 'png', 
    scale = 2,
    quality = 90 
  } = options;

  console.log('[Renderer] Starting image render');
  console.log('[Renderer] Format:', format);
  if (requestedWidth && requestedHeight) {
    console.log('[Renderer] Requested dimensions:', { width: requestedWidth, height: requestedHeight, scale });
  } else {
    console.log('[Renderer] Auto-detecting dimensions from artboard');
  }

  const t1 = Date.now();
  const browser = await getBrowser();
  const page = await browser.newPage();
  timings.pageCreation = Date.now() - t1;

  // Listen to console messages from the page
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[Browser ${type}]`, text);
  });

  // Listen to page errors
  page.on('pageerror', error => {
    console.error('[Browser Error]', error.message);
  });

  try {
    // Get static server port (already running from initialization)
    const serverPort = staticServerPort;
    
    // Use large initial viewport if dimensions not specified
    const initialWidth = requestedWidth || 2000;
    const initialHeight = requestedHeight || 2000;
    
    const t2 = Date.now();
    await page.setViewport({ 
      width: initialWidth, 
      height: initialHeight,
      deviceScaleFactor: scale 
    });
    timings.viewport = Date.now() - t2;

    // Create HTML content
    const html = createRenderPage(code, initialWidth, initialHeight, serverPort);
    
    const t3 = Date.now();
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded', // Changed from 'networkidle0' for speed
      timeout: MAX_RENDER_TIME 
    });
    timings.contentLoad = Date.now() - t3;

    // Wait for rendering to complete
    const t4 = Date.now();
    await page.waitForFunction(
      () => window.renderComplete || window.renderError,
      { timeout: MAX_RENDER_TIME }
    );
    timings.rendering = Date.now() - t4;

    // Check for render errors
    const renderError = await page.evaluate(() => window.renderError);
    if (renderError) {
      console.error('[Renderer] Render error from page:', renderError);
      throw new Error(`Render error: ${renderError}`);
    }

    // Get the actual SVG dimensions from the rendered content
    const svgDimensions = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (svg) {
        return {
          width: parseFloat(svg.getAttribute('width')),
          height: parseFloat(svg.getAttribute('height'))
        };
      }
      return null;
    });

    if (!svgDimensions) {
      throw new Error('Could not determine SVG dimensions');
    }
    
    console.log('[Renderer] Artboard dimensions:', svgDimensions);
    
    // Validate dimensions
    const scaledWidth = svgDimensions.width * scale;
    const scaledHeight = svgDimensions.height * scale;
    if (scaledWidth > MAX_WIDTH || scaledHeight > MAX_HEIGHT) {
      throw new Error(`Scaled dimensions exceed maximum allowed (${MAX_WIDTH}x${MAX_HEIGHT})`);
    }

    // Take screenshot of just the SVG element (exact content size)
    const t5 = Date.now();
    const svg = await page.$('svg');
    
    if (!svg) {
      throw new Error('SVG element not found');
    }
    
    const screenshot = await svg.screenshot({
      type: format,
      quality: format === 'jpeg' ? quality : undefined,
      omitBackground: format === 'png',
    });
    timings.screenshot = Date.now() - t5;

    timings.total = Date.now() - startTime;
    
    // Print timing summary in cyan
    console.log('\x1b[36m%s\x1b[0m', `[Timing] Page: ${timings.pageCreation}ms | Viewport: ${timings.viewport}ms | Load: ${timings.contentLoad}ms | Render: ${timings.rendering}ms | Screenshot: ${timings.screenshot}ms | Total: ${timings.total}ms`);
    
    return screenshot;

  } finally {
    await page.close();
    console.log('[Renderer] Page closed');
  }
}

