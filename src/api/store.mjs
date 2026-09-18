import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dataFile = join(dirname(fileURLToPath(import.meta.url)), 'data', 'assets.json');

export function loadAssets() {
  if (!existsSync(dataFile)) return [];
  try { return JSON.parse(readFileSync(dataFile, 'utf8')); } catch { return []; }
}
export function saveAssets(assets) {
  mkdirSync(dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, JSON.stringify(assets, null, 2));
}
