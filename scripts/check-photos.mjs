import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import sharp from 'sharp';
import { photographs, photoWidths, photoUrl } from '../lib/photographs.js';

let originalBytes = 0;
let mobileBytes = 0;
for (const [name, photo] of Object.entries(photographs)) {
  const original = await sharp(`public/images/${photo.file}`).metadata();
  assert.equal(original.width, photo.width);
  assert.equal(original.height, photo.height);
  assert(!original.orientation || original.orientation === 1, `${name}: review orientation before exporting`);
  originalBytes += (await stat(`public/images/${photo.file}`)).size;
  for (const width of photoWidths) {
    const path = `dist${photoUrl(name, width)}`;
    const exported = await sharp(path).metadata();
    assert.equal(exported.format, 'webp');
    assert.equal(exported.width, width);
    assert(Math.abs(exported.height - width * photo.height / photo.width) <= 1, `${name}: keep the complete frame`);
    const bytes = (await stat(path)).size;
    assert(bytes < (width <= 960 ? 300_000 : 1_500_000), `${path}: image delivery budget exceeded`);
    if (width === 960) mobileBytes += bytes;
  }
}

for (const page of ['index', 'capable-of-more']) {
  const html = await readFile(`dist/${page}.html`, 'utf8');
  const images = [...html.matchAll(/<img\b[^>]*src="\/images\/web\/[^>]+>/g)].map(match => match[0]);
  assert.equal(images.length, page === 'index' ? 4 : 1);
  for (const tag of images) {
    const name = Object.keys(photographs).find(name => tag.includes(`/web/${name}-`));
    assert(name);
    for (const width of photoWidths) assert(tag.includes(`${photoUrl(name, width)} ${width}w`), `${page}: complete srcset`);
    assert(/sizes="[^"]+"/.test(tag), `${page}: responsive slot sizes`);
    assert(/width="\d+" height="\d+"/.test(tag), `${page}: reserve natural aspect ratio`);
  }
  assert.equal(images.filter(tag => tag.includes('loading="eager"') && tag.includes('fetchpriority="high"')).length, 1);
  for (const { file } of Object.values(photographs)) assert(!html.includes(`src="/images/${file}"`), `${page}: no full-resolution photo downloads`);
  assert(html.includes('Start fundraising today and share your training as you build up.'), `${page}: fundraising can start now`);
  assert(html.includes('You can start your challenge alongside me on 22 March 2027.'), `${page}: optional March start is clear`);
}
console.log(`ok   responsive photographs: ${(originalBytes / 1e6).toFixed(2)} MB originals; ${(mobileBytes / 1e6).toFixed(2)} MB for all four 960px copies`);
console.log('ok   image dimensions, file budgets, responsive markup, priority and challenge timing');
