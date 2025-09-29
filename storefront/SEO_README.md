# Storefront SEO Guide

This document explains the SEO improvements added to the Next.js App Router storefront, how they work, how to configure them, and how to verify everything after deployment.

## What was added

- Global metadata defaults in `src/app/layout.tsx`
  - Title template (site-wide), Open Graph + Twitter defaults, icons, theme color
  - Organization JSON‑LD injected globally
- Dynamic robots and sitemap
  - `src/app/robots.ts` respects staging/noindex and links to your sitemap
  - `src/app/sitemap.ts` generates a comprehensive sitemap for all regions
- Route-level canonical + hreflang
  - Implemented via `generateMetadata` on Home, Store, Product, Category, Collection, Blog, and static pages
- Structured data (JSON‑LD) components
  - `src/lib/seo/jsonld.tsx`: Organization, Website, Product, BreadcrumbList, ItemList, BlogPosting
- Noindex for sensitive/private pages
  - Account, Checkout, Cart, Wishlist, Order token/confirmation, and Revalidate
- Web App Manifest
  - `src/app/manifest.ts` with icons served from `public/`

## Files and directories

- `src/app/layout.tsx`
  - Adds global SEO defaults and `<OrganizationJsonLd />`
- `src/app/robots.ts`
  - Dynamic robots rules with staging toggle
- `src/app/sitemap.ts`
  - Generates URLs for static pages, products, categories, collections, blogs, across all supported `countryCode`s
- `src/lib/seo/config.ts`
  - Site config helper and `buildHreflangMap()`
- `src/lib/seo/jsonld.tsx`
  - Reusable JSON‑LD components
- Pages updated for SEO
  - Home: `src/app/[countryCode]/(main)/page.tsx`
  - Store: `src/app/[countryCode]/(main)/store/page.tsx`
  - Product: `src/app/[countryCode]/(main)/products/[handle]/page.tsx`
  - Category: `src/app/[countryCode]/(main)/categories/[...category]/page.tsx`
  - Collection: `src/app/[countryCode]/(main)/collections/[handle]/page.tsx`
  - Blogs list: `src/app/[countryCode]/(main)/blogs/page.tsx`
  - Blog detail: `src/app/[countryCode]/(main)/blogs/[id]/page.tsx`
  - Static pages: `about-us`, `privacy-policy`, `tnc`, `refund`, `partnership-program`, `contact`, `customkit` via page/layout metadata
- Noindex routes (via `metadata.robots`)
  - `account/layout.tsx`, `cart/page.tsx`, `checkout/layout.tsx`, `wishlist/layout.tsx`, order transfer pages, order confirmed, `revalidate/page.tsx`
- Manifest
  - `src/app/manifest.ts` (uses `public/logo.png` and favicon)

## Environment variables

- `NEXT_PUBLIC_BASE_URL` (required)
  - Used by `metadataBase`, sitemaps, absolute URLs in schema
  - Example: `https://www.thejoyjunction.com`
- `NEXT_PUBLIC_NOINDEX` (optional)
  - When `true`, robots disallow indexing even in production
  - Useful for staging/preview

## How canonical and hreflang work

- Each route generates a canonical path for the current `countryCode`
- `hreflang` alternates are built for all supported regions (from `listRegions()`)
- Next.js resolves relative canonicals using `metadataBase`

## Structured data (JSON‑LD)

- Organization: global on every page
- Website: rendered on Home per country
- Product: rendered on product detail page
- ItemList + BreadcrumbList: on listing/detail pages where relevant
- BlogPosting: on blog detail page

## Robots and sitemap behavior

- Robots
  - In production with a valid `NEXT_PUBLIC_BASE_URL` and `NEXT_PUBLIC_NOINDEX` not true: allow all except `/api`.
  - In non‑prod or `NEXT_PUBLIC_NOINDEX=true`: disallow all.
- Sitemap
  - Available at `/sitemap.xml`
  - Includes static pages, product, category, collection, and blog links for each `countryCode`

## Verifying locally

1. Start the app: `yarn dev`
2. Open:
   - `http://localhost:8000/robots.txt`
   - `http://localhost:8000/sitemap.xml`
3. Visit key pages and view source to check:
   - `<link rel="canonical" href="...">`
   - `<link rel="alternate" hreflang="...">`
   - JSON‑LD `<script type="application/ld+json">` blocks
4. Use Google’s Rich Results Test for product and blog pages.

## Deployment checklist

- Set `NEXT_PUBLIC_BASE_URL` to your production origin (no trailing slash)
- Keep `NEXT_PUBLIC_NOINDEX` unset/false for production; set true on staging
- Confirm sitemap is reachable at `https://<domain>/sitemap.xml`
- Submit sitemap in Google Search Console/Bing Webmaster Tools

## Performance impact

- These changes are designed to have negligible impact on runtime performance:
  - `generateMetadata` is very lightweight and computes URLs/strings
  - JSON‑LD is small inline `<script>` tags
  - Robots and sitemap are server functions executed on request; typical microseconds–milliseconds
  - No additional client‑side bundles were introduced for SEO (except existing client pages)
- Net result: No noticeable impact on page speed or Core Web Vitals is expected.

## Common tweaks

- Update default OG/Twitter images and icons in `src/app/layout.tsx`
- Adjust which pages appear in `sitemap.ts` (e.g., add/exclude custom routes)
- Add dynamic OG images via `opengraph-image.tsx` for product/category/blog (optional)
- Add Blog RSS feed (`app/rss.xml/route.ts`) and Google Merchant Center product feed (optional)

## Troubleshooting

- Wrong absolute URLs in JSON‑LD or alternates
  - Ensure `NEXT_PUBLIC_BASE_URL` is set correctly
- Missing hreflang for a market
  - Confirm `listRegions()` returns that country; otherwise, add handling or a fallback list
- Staging appears in search
  - Set `NEXT_PUBLIC_NOINDEX=true` and redeploy; verify `/robots.txt`

---
If you need dynamic OG images, RSS feeds, or Google Merchant Center feeds, see the Optional section and open a task to implement them.
