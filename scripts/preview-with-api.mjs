import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import api from '../api/fundraising.js';

// Run alongside Astro preview on 4321 to check the production function locally.
// Bound to loopback only. No authentication or donor data is involved.
createServer(async (req, res) => {
  try {
    const path = req.url ?? '/';
    const url = new URL(path, 'http://127.0.0.1:4322');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return;
    }
    const response = url.pathname === '/api/fundraising'
      ? await api.fetch(new Request(url, { method: req.method }))
      : await fetch(`http://127.0.0.1:4321${url.pathname}${url.search}`, { method: req.method, redirect: 'manual' });
    const headers = Object.fromEntries(response.headers);
    // Node fetch decodes compressed upstream bodies before exposing the stream.
    delete headers['content-encoding'];
    delete headers['content-length'];
    res.writeHead(response.status, headers);
    if (response.body) Readable.fromWeb(response.body).pipe(res);
    else res.end();
  } catch {
    res.writeHead(502);
    res.end('Preview unavailable. Start Astro preview on port 4321.');
  }
}).listen(4322, '127.0.0.1', () => console.log('Site and public fundraising API: http://127.0.0.1:4322'));
