#!/usr/bin/env node
/**
 * DMI Games Dev Server
 * - Serves static files
 * - Hot reload on file changes
 * - Open browser automatically
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, '..');

// MIME types
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

// Hot reload script injected into HTML
const HOT_RELOAD_SCRIPT = `
<script>
(function() {
  const ws = new WebSocket('ws://' + location.host + '/__reload');
  ws.onmessage = () => location.reload();
  ws.onclose = () => setTimeout(() => location.reload(), 1000);
})();
</script>
</body>`;

// Create HTTP server
const server = http.createServer((req, res) => {
  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
  
  // Handle directory requests
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('Server Error');
      }
      return;
    }

    // Inject hot reload into HTML
    if (ext === '.html') {
      content = content.toString().replace('</body>', HOT_RELOAD_SCRIPT);
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

// WebSocket for hot reload
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server, path: '/__reload' });

// Watch for file changes
const chokidar = require('chokidar');
const watcher = chokidar.watch([
  path.join(ROOT, 'games'),
  path.join(ROOT, 'templates'),
  path.join(ROOT, 'index.html'),
], { ignoreInitial: true });

watcher.on('all', (event, filePath) => {
  console.log(`[${event}] ${path.relative(ROOT, filePath)}`);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('reload');
    }
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`
╔══════════════════════════════════════════╗
║     🎮 DMI Games Dev Server             ║
╠══════════════════════════════════════════╣
║  Local:    ${url.padEnd(28)}║
║  Games:    ${(url + '/games/').padEnd(28)}║
║  Templates: ${(url + '/templates/').padEnd(27)}║
╠══════════════════════════════════════════╣
║  Hot reload enabled - edit & save!       ║
╚══════════════════════════════════════════╝
  `);
  
  // Try to open browser
  const openCmd = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${openCmd} ${url}`);
});
