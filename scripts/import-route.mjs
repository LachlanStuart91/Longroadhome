import { readFileSync, writeFileSync } from 'node:fs';
import { importRoute } from './lib/route-data.mjs';

const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/import-route.mjs /absolute/path/to/approved-input.gpx');
const data = importRoute(readFileSync(input, 'utf8'));
writeFileSync(new URL('../src/data/proposed-route.json', import.meta.url), JSON.stringify(data) + '\n');
console.log(`Imported ${data.source.pointCount} points; ${data.stats.distanceKm.toFixed(1)} km. Source GPX unchanged.`);
