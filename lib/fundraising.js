export const CAMPAIGN_API = 'https://api.raisely.com/v3/campaigns/the-long-road-home';
export const CAMPAIGN_URL = 'https://the-long-road-home.raiselysite.com/';
const CAMPAIGN_ID = '1df241b0-c8ce-11f1-a25f-ed988c995bce';

// Raisely reports monetary values in cents. Keep them as integers throughout.
export function campaignTotals(payload, now = new Date()) {
  const campaign = payload?.data;
  if (campaign?.uuid !== CAMPAIGN_ID || campaign.path !== 'the-long-road-home' ||
      campaign.currency !== 'AUD' || !Number.isSafeInteger(campaign.grandTotal) ||
      campaign.grandTotal < 0 || !Number.isSafeInteger(campaign.goal) || campaign.goal <= 0) {
    throw new Error('Invalid campaign totals');
  }
  return {
    raisedCents: campaign.grandTotal,
    goalCents: campaign.goal,
    currency: 'AUD',
    updatedAt: now.toISOString(),
    source: CAMPAIGN_URL,
  };
}

export async function fundraisingResponse(request, fetchImpl = fetch) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, { status: 405, headers: { Allow: 'GET, HEAD' } });
  }
  try {
    // Fixed, public, read-only endpoint. Never forward visitor headers or cookies.
    const upstream = await fetchImpl(CAMPAIGN_API, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
    });
    if (!upstream.ok) throw new Error('Campaign unavailable');
    const totals = campaignTotals(await upstream.json());
    return new Response(request.method === 'HEAD' ? null : JSON.stringify(totals), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=60',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return new Response(request.method === 'HEAD' ? null : JSON.stringify({ error: 'Fundraising total temporarily unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }
}
