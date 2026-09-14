# The Long Road Home

Campaign website for The Long Road Home. Static Astro site, no server runtime.

The build produces two public routes:

    /            the campaign homepage
    /privacy     the privacy page

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
    npm run verify    astro check, then the production build, then the
                      built-output structural check in scripts/check-output.mjs

`npm run verify` is the gate. The structural check runs over every built page and
fails if anything appears between the doctype and `<html>`, or after `</html>`.

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

The site is live in production at **https://thelongroadhome.run/**, served by
Vercel. `https://www.thelongroadhome.run/` returns a 308 redirect to the apex
domain. The homepage and `/privacy` both return 200.

`vercel.json` sets `cleanUrls` to `true` and `trailingSlash` to `false`, which
matches `build.format: 'file'` and `trailingSlash: 'never'` in
`astro.config.mjs`.

Those four facts were verified by request against the live domain. Nothing else
about the hosting setup is documented here, because nothing else has been
verified from this repository: there is no statement about deployment
automation, build hooks, analytics, monitoring or account access.

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

`event.active` in `src/data/campaign.ts` drives the whole page. Setting it to
`false` removes every ticket action, drops the Long Lunch navigation item,
replaces the event section with its archive, and makes partnership the primary
campaign action.

The switch is manual on purpose. It is not driven by the date, and it must not
be flipped until the archive copy has been reviewed after the lunch.
