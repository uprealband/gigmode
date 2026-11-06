# GIG MODE Universe

Custom editorial frontend for GIG MODE Universe. Blogger remains the publishing CMS; this repository contains the independent website frontend for Cloudflare Pages.

## Deploy to Cloudflare Pages
- Framework preset: None
- Build command: leave empty
- Build output directory: `/`
- Root directory: `/`

## Architecture
- Static frontend: HTML, CSS, and JavaScript.
- Content source: public Blogger JSON feed at `https://gigmode.uprealband.com`.
- Foundation section: Blogger posts tagged `CONCEPT`.
- Latest Transmission: newest public posts.

## Important
This first release is a prototype. The Blogger feed is loaded client-side, so article detail SEO and canonical behavior must be verified before moving the production subdomain. Do not change DNS until the CMS origin, redirects, canonical URLs, and sitemap strategy are finalized.
