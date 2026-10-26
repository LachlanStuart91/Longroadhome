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
  'running-desert.png': '503fac8a2a31c7ef0ed79eb08a88acba5940ad8f6381907625b5b8cab4cd1fd8',
  'running-woodland.png': '71ec6b66221b0082476f413f606dd08ab571418981e77d5a820efd0e31d5c284',
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
  assert(!/long[- ]lunch/i.test(html), `${route}: completed lunch is not published`);
  assert(!html.includes('https://www.trybooking.com/au/event/1636486'), `${route}: no completed-event ticket links`);
  assert(!html.includes('mja250876.pdf'), `${route}: no broken MJA PDF link`);
  assert(!/4,000\s*km|Scarborough Beach|Redcliffe Beach|Cottesloe|Manly|\$162,000/.test(html), `${route}: superseded campaign facts are not published`);
  assert(html.includes('Approximately 4,400 km (provisional)'), `${route}: distance remains approximate and provisional`);
  assert(html.includes('Planned start 22 March 2027'), `${route}: footer keeps the planned start date`);
  assert(!/\b(?:40|44)[- ]days?\b/i.test(html), `${route}: no inferred duration or finish date`);
  for (const [, json] of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(json);
    const nodes = [schema, ...(schema['@graph'] ?? [])];
    assert(!nodes.some(node => [node['@type']].flat().includes('Event')), `${route}: no completed Event structured data`);
  }
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
  console.log(`ok   ${route}: headings, anchors, assets, completed-event removal and punctuation`);
}
const home = pages.get('/');
assert(home.includes('$162,802 raised for Mental Awareness Foundation'), 'Exact 2025 fundraising total remains attributed to Mental Awareness Foundation');
assert(home.includes('$500,000 for Top Blokes Foundation'), 'Current fundraising goal remains separate from the 2025 total');
assert(home.includes('A goal of 100 km a day'), 'Daily distance remains a goal');
for (const route of ['/', '/capable-of-more']) {
  assert(pages.get(route).includes('The route, distance and exact start and finish points are still being finalised.'), `${route}: planning status is explicit`);
}
for (const name of ['description', 'og:description', 'twitter:description']) {
  const value = home.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]+)"`))?.[1];
  assert(value?.includes('4,400 km (provisional)'), `${name}: updated provisional distance`);
  assert(value?.includes('Scarborough, Western Australia to Redcliffe, Queensland'), `${name}: updated start and finish`);
  assert(value?.includes('Planned start: 22 March 2027'), `${name}: planned start date`);
}
assert(home.includes('href="https://www.mja.com.au/journal/2021/214/3/suicide-young-australians-2006-2015-cross-sectional-analysis-national-coronial"'), 'MJA citation links to the verified article');
assert(!/<iframe\b/i.test(home), 'Donations are a direct Raisely link, not an embedded form');
assert(!home.includes('data-donate-embed'), 'Removed donation loader must not be published');
assert(!home.includes('raiselysite.com/embed'), 'Only the campaign and signup Raisely destinations are published');
for (const [route, html] of pages) {
  for (const [, href, label] of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    if (/\bdonate\b/i.test(label.replace(/<[^>]*>/g, ''))) {
      assert.equal(href, 'https://the-long-road-home.raiselysite.com/', `${route}: donations go directly to the campaign on Raisely`);
    }
  }
  assert(html.includes('href="/#follow"'), `${route}: email signup remains available in the footer`);
}
assert(home.includes('preload="none"'), 'Video must not preload');
assert.equal((home.match(/<video\b/g) || []).length, 1, 'Homepage has one video player');
assert(home.indexOf('id="watch"') < home.indexOf('id="community-challenge"'), 'Video is in the opening chapter');
assert(home.indexOf('id="the-run"') < home.indexOf('id="community-challenge"'), 'Video and route are followed by the community challenge');
assert(home.indexOf('id="the-run"') < home.indexOf('id="proposed-route"') && home.indexOf('id="proposed-route"') < home.indexOf('id="community-challenge"'), 'Proposed route sits after the video and before the community challenge');
assert(home.includes('Route and exact endpoints subject to change.'), 'GPX overview is explicitly provisional');
assert(home.includes('route-map-description') && home.includes('route-elevation-description'), 'Map and elevation have accessible descriptions');
assert(home.includes('data-route-distance') && home.includes('Explore the route'), 'Elevation can be explored with a labelled native control');
assert(!home.includes('cdn.jsdelivr.net') && !home.includes('fonts.googleapis.com'), 'Route preview dependencies must not introduce external rendering services');
assert(!/Two minutes from me|1 minute 53 seconds/i.test(home), 'Video timing captions are removed');
assert(home.includes('data-fundraising') && home.includes('data-progress'), 'Public fundraising counter is published');
assert(home.includes('data-percentage') && home.includes('data-progress-wrap hidden'), 'Progress is only shown once a real total is available');
assert(!home.includes('A moment off my feet.'), 'Unwanted story caption is removed');
assert(/58 marathons\.<br\b[^>]*>58 states\.<br\b[^>]*>58 days\./.test(home), 'Approved track-record headline is retained');
const community = home.slice(home.indexOf('id="community-challenge"'), home.indexOf('id="why"'));
assert(community.indexOf('id="community-title"') < community.indexOf('<img'), 'Community invitation precedes its photograph on mobile');
assert(home.includes('Join my email list.'), 'Newsletter has an explicit, server-rendered invitation');
assert(home.indexOf('data-form="q8HCNv"') < home.indexOf('id="partner"'), 'Signup is not separated from its heading by partnership content');
const challenge = pages.get('/capable-of-more');
const copyIndex = challenge.indexOf('class="challenge-hero__copy"');
const photoIndex = challenge.indexOf('class="challenge-hero__photo"');
assert(copyIndex >= 0 && photoIndex > copyIndex, 'Challenge explanation and signup precede the photo in reading order');
console.log(`ok   all ${Object.keys(photos).length} original photographs are unchanged in source and build`);
