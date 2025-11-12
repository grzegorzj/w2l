import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdir, writeFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SAVE_DIR = join(__dirname, 'saved');

// Ensure save directory exists
await mkdir(SAVE_DIR, { recursive: true });

// Create Vite server
const server = await createServer({
  configFile: join(__dirname, 'vite.config.ts'),
  server: {
    port: 3000,
  },
  plugins: [
    {
      name: 'w2l-playground-api',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Handle save SVG endpoint
          if (req.url === '/api/save-svg' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const { svg } = JSON.parse(body);
                const filename = `w2l-output-${Date.now()}.svg`;
                const filepath = join(SAVE_DIR, filename);
                
                await writeFile(filepath, svg, 'utf-8');
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, filename }));
              } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: error.message }));
              }
            });
            return;
          }
          
          // Handle save code endpoint
          if (req.url === '/api/save-code' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const { code } = JSON.parse(body);
                const filename = `w2l-code-${Date.now()}.ts`;
                const filepath = join(SAVE_DIR, filename);
                
                await writeFile(filepath, code, 'utf-8');
                
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, filename }));
              } catch (error) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: error.message }));
              }
            });
            return;
          }
          
          next();
        });
      },
    },
  ],
});

await server.listen();

console.log(`
🎨 W2L Playground is running!

  Local:   http://localhost:3000
  
  Saved files will be stored in: ${SAVE_DIR}
`);

