import { createServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function log(message, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

export async function setupVite(app, server) {
  // Create Vite server
  const vite = await createServer({
    middlewareMode: true,
    hmr: {
      server
    },
    appType: 'spa',
    allowedHosts: true
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  const template = fs.readFileSync(
    path.resolve(__dirname, '../client/index.html'),
    'utf-8'
  );

  // Serve index.html for all routes (SPA behavior)
  app.get('*', (req, res, next) => {
    // API routes should be handled by API router
    if (req.path.startsWith('/api')) {
      return next();
    }

    // Send HTML for any other route (SPA routing)
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  });
}

export function serveStatic(app) {
  const clientDist = path.resolve(__dirname, '../dist/client');
  
  // In production, serve the built files from the dist directory
  app.use(express.static(clientDist));
  
  // In production, serve index.html for all routes (SPA behavior)
  app.get('*', (req, res, next) => {
    // API routes should be handled by API router
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Send HTML for any other route (SPA routing)
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}