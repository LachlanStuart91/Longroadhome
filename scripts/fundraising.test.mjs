import assert from 'node:assert/strict';
import test from 'node:test';
import { campaignTotals, fundraisingResponse, CAMPAIGN_API, CAMPAIGN_URL } from '../lib/fundraising.js';
import api from '../api/fundraising.js';

const campaign = {
  uuid: '1df241b0-c8ce-11f1-a25f-ed988c995bce', path: 'the-long-road-home',
  currency: 'AUD', grandTotal: 2000100, goal: 50000000,
  donorRecords: [{ private: 'never returned' }],
};
const request = (method = 'GET') => new Request('https://thelongroadhome.com.au/api/fundraising', { method });

test('Vercel handler accepts an execution context without treating it as fetch', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ data: campaign }));
  const response = await api.fetch(request(), { waitUntil() {} });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).raisedCents, 2000100);
});

test('returns only aggregate cents, the verified source and a timestamp', () => {
  assert.deepEqual(campaignTotals({ data: campaign }, new Date('2026-10-23T10:00:00Z')), {
    raisedCents: 2000100, goalCents: 50000000, currency: 'AUD',
    updatedAt: '2026-10-23T10:00:00.000Z', source: CAMPAIGN_URL,
  });
});

test('zero raised and totals above the goal are valid, not errors', () => {
  for (const grandTotal of [0, 60000000]) {
    assert.equal(campaignTotals({ data: { ...campaign, grandTotal } }).raisedCents, grandTotal);
  }
});

test('rejects wrong campaigns, currency, missing or invalid monetary data', () => {
  for (const changed of [
    { uuid: 'another' }, { path: 'another' }, { currency: 'USD' }, { grandTotal: null },
    { grandTotal: '2000100' }, { grandTotal: -1 }, { grandTotal: 12.5 },
    { grandTotal: Infinity }, { grandTotal: Number.MAX_SAFE_INTEGER + 1 },
    { goal: 0 }, { goal: -1 }, { goal: null }, { goal: 1.5 },
  ]) assert.throws(() => campaignTotals({ data: { ...campaign, ...changed } }));
  assert.throws(() => campaignTotals({}));
});

test('fetches only the fixed public endpoint with a timeout and caches success for 60 seconds', async () => {
  const response = await fundraisingResponse(request(), async (url, options) => {
    assert.equal(url, CAMPAIGN_API);
    assert.deepEqual(options.headers, { Accept: 'application/json' });
    assert.equal(options.redirect, 'error');
    assert(options.signal instanceof AbortSignal);
    return Response.json({ data: campaign });
  });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Cache-Control'), /s-maxage=60/);
  const body = await response.json();
  assert.equal(body.raisedCents / 100, 20001);
  assert.equal(body.goalCents / 100, 500000);
  assert.equal(Object.keys(body).length, 5);
  assert(!JSON.stringify(body).includes('donor'));
});

test('upstream, malformed JSON, invalid data and network/timeout failures return a non-cached 503', async () => {
  for (const upstream of [
    async () => new Response('upstream error', { status: 500 }),
    async () => new Response('not JSON'),
    async () => Response.json({ data: { ...campaign, currency: 'USD' } }),
    async () => { throw new Error('network details must stay private'); },
    async () => { throw new DOMException('timeout', 'TimeoutError'); },
  ]) {
    const response = await fundraisingResponse(request(), upstream);
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.deepEqual(await response.json(), { error: 'Fundraising total temporarily unavailable' });
  }
});

test('HEAD contains no body and write methods never contact Raisely', async () => {
  const head = await fundraisingResponse(request('HEAD'), async () => Response.json({ data: campaign }));
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  for (const method of ['POST', 'PUT', 'DELETE', 'PATCH']) {
    const response = await fundraisingResponse(request(method), () => { throw new Error('must not fetch'); });
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('Allow'), 'GET, HEAD');
  }
});
