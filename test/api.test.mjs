import { test, before, after } from 'node:test';
import assert from 'node:assert';
import { rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from '../src/api/server.mjs';

const dataFile = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'api', 'data', 'assets.json');
let server;
let base;
before(async () => {
  rmSync(dataFile, { force: true });
  server = createServer();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

async function call(method, path, body) {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

test('GET /healthz', async () => {
  assert.equal((await call('GET', '/healthz')).status, 200);
});

test('POST /assets -> 201, GET list + detail', async () => {
  const created = await call('POST', '/assets', { name: 'web-01', category: 'server', owner: 'ops', status: 'active' });
  assert.equal(created.status, 201);
  assert.ok(created.data.id);
  const list = await call('GET', '/assets');
  assert.equal(list.status, 200);
  assert.equal(list.data.length, 1);
  const detail = await call('GET', '/assets/' + created.data.id);
  assert.equal(detail.status, 200);
  assert.equal(detail.data.name, 'web-01');
});

test('POST invalid -> 400', async () => {
  assert.equal((await call('POST', '/assets', { name: '', category: 'bogus' })).status, 400);
});
