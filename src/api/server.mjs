import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadAssets, saveAssets } from './store.mjs';

const CATEGORIES = ['server', 'network', 'storage', 'application'];
const STATUSES = ['active', 'retired', 'unknown'];
const webDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'web');

function json(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}
function serveStatic(res, file, type) {
  const p = join(webDir, file);
  if (!existsSync(p)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': type });
  res.end(readFileSync(p, 'utf8'));
}

export function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const p = url.pathname;
    try {
      if (req.method === 'GET' && p === '/healthz') return json(res, 200, { status: 'ok' });
      if (req.method === 'GET' && p === '/') return serveStatic(res, 'index.html', 'text/html; charset=utf-8');
      if (req.method === 'GET' && p === '/app.js') return serveStatic(res, 'app.js', 'text/javascript; charset=utf-8');
      if (p === '/assets') {
        if (req.method === 'GET') return json(res, 200, loadAssets());
        if (req.method === 'POST') {
          const input = await readBody(req);
          if (!input || typeof input.name !== 'string' || !input.name.trim() || !CATEGORIES.includes(input.category)) {
            return json(res, 400, { error: 'invalid input: name required, category must be one of ' + CATEGORIES.join(',') });
          }
          const asset = {
            id: randomUUID(),
            createdAt: new Date().toISOString(),
            name: input.name.trim(),
            category: input.category,
            owner: typeof input.owner === 'string' ? input.owner : '',
            status: STATUSES.includes(input.status) ? input.status : 'unknown'
          };
          const assets = loadAssets();
          assets.push(asset);
          saveAssets(assets);
          return json(res, 201, asset);
        }
      }
      const m = p.match(/^\/assets\/([^/]+)$/);
      if (req.method === 'GET' && m) {
        const asset = loadAssets().find((a) => a.id === decodeURIComponent(m[1]));
        return asset ? json(res, 200, asset) : json(res, 404, { error: 'not found' });
      }
      json(res, 404, { error: 'not found' });
    } catch (e) {
      json(res, 500, { error: String((e && e.message) || e) });
    }
  });
}
