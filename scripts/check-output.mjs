/**
 * Structural regression check on the BUILT output.
 *
 * Added after a JSON-LD script was emitted between the doctype and the opening
 * html element, which browsers repair silently and which therefore will not
 * show up in any visual review. Runs over every built HTML page.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const pages = readdirSync(DIST).filter((f) => f.endsWith('.html'));
if (pages.length === 0) {
  console.error('check-output: no built HTML pages found in dist/');
  process.exit(1);
}

let failed = 0;
for (const page of pages) {
  const html = readFileSync(join(DIST, page), 'utf8');

  // The doctype must be followed by the opening html element and nothing else.
  const match = html.match(/^\s*<!DOCTYPE html>\s*([\s\S]{0,200})/i);
  if (!match) {
    console.error(`FAIL ${page}: does not start with a doctype`);
    failed++;
    continue;
  }
  const after = match[1].trimStart();
  if (!after.toLowerCase().startsWith('<html')) {
    const stray = after.slice(0, 120).replace(/\s+/g, ' ');
    console.error(`FAIL ${page}: content between the doctype and <html>: ${stray}`);
    failed++;
    continue;
  }

  // Nothing may sit outside the html element at the end either.
  const tail = html.slice(html.toLowerCase().lastIndexOf('</html>') + 7).trim();
  if (tail !== '') {
    console.error(`FAIL ${page}: content after </html>: ${tail.slice(0, 120)}`);
    failed++;
    continue;
  }

  console.log(`ok   ${page}: doctype is immediately followed by <html>, nothing after </html>`);
}

process.exit(failed === 0 ? 0 : 1);
