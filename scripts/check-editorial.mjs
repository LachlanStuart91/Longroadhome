import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Original uploads, preserved byte for byte at the owner's request.
const photos = {
  'on-the-road.jpeg': 'c0689f172a5d53d178b80abb6d99a2f76e89d3182c0d91b9eb11374f47c95ef6',
  'behind-the-scenes.jpeg': '766971fab12a7354ba62cba5805e18a421c014f38ec7846b6edeaf5be1b272c4',
  'between-runs.png': '90c18af8bda0eb258a797d354ee2d3e55ed92e04966266b42340e3dbf2e940d3',
  'running-together.png': 'c5a8773f71a92ebb8287add5f497a83c952e86607290f0f2be06557b161633cc',
};
for (const [file, expected] of Object.entries(photos)) {
  for (const root of ['public', 'dist']) {
    const actual = createHash('sha256').update(readFileSync(join(root, 'images', file))).digest('hex');
    assert.equal(actual, expected, `${root}/images/${file} must remain unchanged`);
  }
}

const pages = new Map(['index', 'capable-of-more', 'privacy'].map(name =>
  [name === 'index' ? '/' : `/${name}`, readFileSync(`dist/${name}.html`, 'utf8')],
));
for (const [route, html] of pages) {
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route}: one H1`);
  assert(!/\u2014|&mdash;|&#8212;|&#x2014;/i.test(html), `${route}: no em dashes`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
  assert(!/<a\b[^>]*href="https:\/\/www\.trybooking\.com\/au\/event\/1636486"/i.test(html), `${route}: no sold-out ticket actions`);
  for (const [, href] of html.matchAll(/\bhref="([^"\s]+)"/g)) {
    if (!href.startsWith('/') && !href.startsWith('#')) continue;
    const [path, fragment] = href.split('#');
    const target = path || route;
    if (pages.has(target)) {
      if (fragment) assert(pages.get(target).includes(`id="${fragment}"`), `${route}: missing ${href}`);
    } else {
      assert(existsSync(join('dist', path)), `${route}: missing local link ${href}`);
    }
  }
  for (const [, src] of html.matchAll(/\b(?:src|poster)="(\/[^"\s]+)"/g)) {
    assert(existsSync(join('dist', src)), `${route}: missing asset ${src}`);
  }
  console.log(`ok   ${route}: headings, anchors, assets, ticket state and punctuation`);
}
const home = pages.get('/');
assert(home.includes('The Long Lunch is sold out.'), 'Sold-out notice is visible');
assert.equal((home.match(/https:\/\/schema.org\/SoldOut/g) || []).length, 2, 'Both ticket offers are sold out');
assert(!/<iframe\b/i.test(home), 'Donation iframe must not load before consent');
assert(home.includes('preload="none"'), 'Video must not preload');
console.log('ok   all four original photographs are unchanged in source and build');
