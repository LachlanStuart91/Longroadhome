# The Long Road Home

Campaign website for The Long Road Home. Static Astro site, no server runtime.

The build produces three public routes:

    /                  the campaign homepage
    /capable-of-more   the ongoing community challenge
    /privacy           the privacy page

## Runtime

The project requires **Node 24.x**. `package.json` declares `"node": "24.x"` in
`engines` and `.node-version` pins `24`, so the two agree.

The verified local runtime is **Node v24.20.0** (LTS "Krypton"), installed
project-scoped at `.tooling/node`. It was downloaded from nodejs.org and its
SHA-256 verified against the published SHASUMS256 file. Nothing is installed
globally, and `.tooling/` is not committed.

To use the project runtime in a shell:

    export PATH="$PWD/.tooling/node/bin:$PATH"

## Commands

    npm run dev       start the local dev server on port 4321
    npm run build     production build into dist/
    npm run preview   serve the built output
    npm run check     astro check, types and template diagnostics
    npm run generate:qr  regenerate the challenge signup QR asset
    npm run verify       decode and verify the QR, run astro check, then the
                         production build and built-output structural check

`npm run verify` is the gate. The structural check runs over every built page and
fails if anything appears between the doctype and `<html>`, or after `</html>`.
The editorial check verifies internal anchors and assets, sold-out ticket
actions, em-dash-free output, donation opt-in and original photograph hashes.

Use Astro's dev or preview server, not Python's plain HTTP server. The public
links use clean URLs such as `/capable-of-more`, while the static build contains
`.html` files. Astro preview and Vercel resolve these correctly; Python's server
does not. Use `npm run preview -- --host 127.0.0.1 --port 4321` for the built site.

## Structure

    src/data/campaign.ts   single source of truth for every campaign fact, link
                           and pending value. Content changes belong here, not
                           in markup.
    src/layouts            page shell, metadata, fonts
    src/components         header, footer, section shells, ticket action
    src/pages              index, privacy, sitemap
    src/styles             tokens then global styles
    public/fonts           self-hosted woff2 with licences retained
    scripts                built-output structural check
    review/                stage review material: prototypes, comparison
                           screenshots and audit captures. Never built, never
                           deployed and not committed.

## Hosting configuration

The site is hosted on Vercel.

The canonical production address is **https://thelongroadhome.com.au/**, the
non-www apex. `site` in `astro.config.mjs` is set to that origin, and every
canonical tag, `og:url`, social image URL, structured-data URL and sitemap entry
is derived from it. `public/robots.txt` points to
`https://thelongroadhome.com.au/sitemap.xml`.

The intended domain configuration, set in Vercel's Domains settings rather than
in this repository, is:

    thelongroadhome.com.au        Production
    www.thelongroadhome.com.au    permanent redirect to the apex
    thelongroadhome.run           permanent redirect to https://thelongroadhome.com.au
    www.thelongroadhome.run       permanent redirect to https://thelongroadhome.com.au

`thelongroadhome.run` was the original address. It stays owned and connected
only as a legacy redirect, so existing links and bookmarks keep working. It is
not a canonical address and the site does not reference it.

Whole-domain redirects live in Vercel's Domains settings, not in `vercel.json`.
Adding host redirects there as well would risk a redirect loop.

`vercel.json` sets `cleanUrls` to `true` and `trailingSlash` to `false`, which
matches `build.format: 'file'` and `trailingSlash: 'never'` in
`astro.config.mjs`.

Nothing else about the hosting setup is documented here, because nothing else
has been verified from this repository: there is no statement about deployment
automation, build hooks, analytics, monitoring or account access. The domain
configuration above describes the intended setup and should be confirmed by
request once it is live.

## What is not committed

    review/                  stage review material, roughly 135 MB
    dist/ and .astro/        build output
    node_modules/            dependencies
    .tooling/                the project-scoped Node runtime
    .claude/                 local development launcher, depends on .tooling/
    .vercel/                 the Vercel CLI's local project link
    .pnpm-store/             local package store
    CLAUDE_BUILD_PROMPT.md   local project-management material

## The event switch

`event.soldOut` in `src/data/campaign.ts` is true. The lunch is a compact sold-out
notice with expandable guest details, and both structured-data offers are marked
SoldOut. It is not the campaign's primary action. The header supports donations
on the homepage and registration on the community page.

Setting `event.active` to `false` replaces the lunch notice with the archive and
removes its footer link. Review the archive copy before making that change.

The switch is manual on purpose. It is not driven by the date, and it must not
be flipped until the archive copy has been reviewed after the lunch.

## Original photographs

The four photographs supplied on 22 October 2026 live in `public/images/`.
They are copied without editing, recompression, cropping or colour changes.
Plain image elements preserve their natural proportions, with no overlays or
filters. Three are lazy-loaded on the homepage; the opening image loads eagerly.
The originals total about 26 MB. Any smaller replacement exports need the
owner's approval, and the integrity hashes must then be updated deliberately.
Logo processing is separate from the photographic assets.
