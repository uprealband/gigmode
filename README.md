# GIG MODE Universe

Independent editorial frontend for GIG MODE Universe.

This repository contains the custom website frontend for GIG MODE Universe. Blogger remains the publishing CMS, while Cloudflare Pages serves the independent frontend.

## Project

- Project: GIG MODE Universe
- Repository: uprealband/gigmode
- Production branch: main
- Hosting: Cloudflare Pages
- CMS: Blogger
- Website: https://gigmode.uprealband.com

## Deployment

Platform: Cloudflare Pages

Configuration:

- Framework preset: None
- Build command: None
- Deploy command: `npx wrangler pages deploy . --project-name gigmode`
- Preview command: `npx wrangler pages dev .`
- Root directory: `/`
- Production branch: `main`

## Architecture

### Frontend
- Static HTML
- CSS
- Vanilla JavaScript
- Hosted on Cloudflare Pages

### Content Management
- Blogger remains the content publishing platform.
- Public Blogger JSON feed supplies website content.
- Frontend retrieves content client-side.

### Content Sections

- Foundation
  - Editorial concept articles.
  - Blogger label: `CONCEPT`.

- Latest Transmission
  - Latest published public posts.

- Explore the Universe
  - Entry point to explore the GIG MODE Universe.

## Editorial Structure

GIG MODE Universe is designed as an independent editorial platform.

The frontend separates presentation and navigation from the Blogger publishing interface.

Content remains managed through Blogger.

## Development Notes

- Keep the frontend lightweight.
- Avoid unnecessary dependencies.
- Preserve responsive desktop and mobile layouts.
- Keep content retrieval independent from frontend styling.
- Do not expose API tokens or private credentials in repository files.
- Use GitHub commits to trigger Cloudflare deployments.

## SEO and Domain Strategy

This release is a prototype.

Before moving the production subdomain, verify:

- Blogger feed accessibility.
- Article detail page behavior.
- Canonical URLs.
- Search engine indexing.
- Sitemap strategy.
- Redirect behavior.
- Metadata and social sharing previews.

Do not change production DNS until these checks have been completed.

## Project Status

Initial frontend prototype.

The separation between Blogger CMS and the custom Cloudflare Pages frontend is the foundation for future GIG MODE Universe development.
