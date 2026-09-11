import type { APIRoute } from 'astro';

/**
 * One page site, so the sitemap is written here rather than pulled from a
 * plugin that would have to be told what to leave out. The single entry is
 * derived from the configured site origin, so it cannot drift from the
 * canonical tag, and review material, previews, assets and local addresses
 * have no way of appearing.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('astro.config.mjs must set `site` for the sitemap to be absolute.');
  // Listed explicitly rather than discovered, so review material, previews and
  // assets have no way of appearing, and every entry matches its canonical tag.
  const pages = ['/', '/privacy'];
  const urls = pages
    .map((path) => `  <url>\n    <loc>${new URL(path, site).href}</loc>\n  </url>`)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
