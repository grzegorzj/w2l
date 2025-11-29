import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Read and bundle the w2l library from dist folder
 * This creates a browser-ready bundle that can be injected into pages
 */
export async function createW2LBundle() {
  const distPath = path.resolve(__dirname, '../dist');
  
  // Read the main index file and all dependencies
  const indexPath = path.join(distPath, 'index.js');
  
  if (!fs.existsSync(indexPath)) {
    throw new Error('w2l library not built. Please run: npm run build (or tsc) in the parent directory');
  }
  
  // For now, we'll use a dynamic import approach with a local server
  // This is simpler than trying to bundle everything
  const distFiles = getAllJSFiles(distPath);
  
  return { distPath, distFiles };
}

function getAllJSFiles(dir) {
  const files = [];
  
  function walk(directory) {
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.js') && !item.endsWith('.map')) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

