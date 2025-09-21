# Storefront Revalidation (Products)

This document explains the backend (Medusa v2 Framework) subscribers that trigger cache revalidation in the Next.js storefront.

## What we did

- __Centralized helper__: Implemented a shared function `revalidateProductsWithCooldown()` in `src/subscribers/_shared/revalidate-products.ts` that calls the storefront endpoint `GET /api/revalidate?tag=products`.
- __Cooldown/throttling__: Added a small cooldown window to avoid spamming revalidation during bursts (bulk edits). Window length is configurable via `REVALIDATE_COOLDOWN_MS` (defaults to `7000` ms).
- __Subscribers per event__: Added tiny subscribers for product-, variant-, price-list-, and inventory-related events. Each subscriber calls the shared helper.
- __Optional security__: If `REVALIDATE_SECRET` is set, the request includes `x-revalidate-secret` to authenticate against the storefront’s revalidation endpoint.

## Why we did it

- __Global cache invalidation__: The storefront uses per-user tags internally (via the Medusa SDK). To invalidate caches for all users, we revalidate route paths (`revalidatePath`) on the storefront rather than per-user tags.
- __Medusa guidance__: This follows the Medusa Next.js Starter guide: handle an event on the backend, call a storefront endpoint, and revalidate relevant paths.
- __Reliability__: Product and variant update events are canonical and documented. Price-list and inventory flows can vary; the helper approach with a cooldown provides robust, idempotent revalidation.

## What paths are revalidated (on the storefront)

The storefront endpoint `GET /api/revalidate?tag=products` revalidates:

- `"/[countryCode]/(main)/store"` (store listing page)
- `"/[countryCode]/(main)/products/[handle]"` (product detail pages)

This ensures product titles, descriptions, pricing, and availability updates show on the next request across all users.

## Files added/updated (backend only)

- __Shared helper__
  - `src/subscribers/_shared/revalidate-products.ts`
    - Uses `NEXT_PUBLIC_MEDUSA_STOREFRONT_URL` as the storefront base URL
    - Sends `x-revalidate-secret` header if `REVALIDATE_SECRET` is set
    - Cooldown via `REVALIDATE_COOLDOWN_MS`

- __Subscribers__ (all call the shared helper)
  - `src/subscribers/product-updated-revalidate.ts` → event: `product.updated`
  - `src/subscribers/product-deleted-revalidate.ts` → event: `product.deleted`
  - `src/subscribers/product-variant-updated-revalidate.ts` → event: `product-variant.updated`
  - `src/subscribers/product-variant-deleted-revalidate.ts` → event: `product-variant.deleted`
  - `src/subscribers/price-list-created-revalidate.ts` → event: `price-list.created`
  - `src/subscribers/price-list-updated-revalidate.ts` → event: `price-list.updated`
  - `src/subscribers/price-list-deleted-revalidate.ts` → event: `price-list.deleted`
  - `src/subscribers/price-list-prices-updated-revalidate.ts` → event: `price-list.prices-updated` (best-effort; may vary by version)
  - `src/subscribers/inventory-level-updated-revalidate.ts` → event: `inventory-level.updated`

> Note: Product/variant events are the most reliable, documented hooks in v2. Price-list/inventory events can vary depending on modules/versions.

## Common function behavior (`revalidateProductsWithCooldown`)

- Reads base URL from `NEXT_PUBLIC_MEDUSA_STOREFRONT_URL`.
- Builds URL: `${base}/api/revalidate?tag=products`.
- Adds header `x-revalidate-secret` if `REVALIDATE_SECRET` is set.
- Cooldown logic:
  - Runs immediately if last run was more than `REVALIDATE_COOLDOWN_MS` ago.
  - Otherwise schedules one trailing run after the remaining cooldown time.
- Handles fetch errors and logs non-2xx responses.

## Environment variables (backend)

- __NEXT_PUBLIC_MEDUSA_STOREFRONT_URL__ (required)
  - Example: `http://localhost:8000`
- __REVALIDATE_SECRET__ (optional but recommended in production)
  - Must match the storefront’s `REVALIDATE_SECRET` if the endpoint requires it
- __REVALIDATE_COOLDOWN_MS__ (optional; default `7000`)

## Testing the flow

1. Ensure env variables are set and backend + storefront are running.
2. Manually test the endpoint:
   - Without secret: `curl "${NEXT_PUBLIC_MEDUSA_STOREFRONT_URL}/api/revalidate?tag=products"`
   - With secret: `curl -H "x-revalidate-secret: $REVALIDATE_SECRET" "${NEXT_PUBLIC_MEDUSA_STOREFRONT_URL}/api/revalidate?tag=products"`
3. Perform an action in the Admin (e.g., update product title or price)
4. Verify backend logs (subscriber triggers) and storefront logs `[revalidate]` indicate products path revalidation.
5. Visit the store/product page and confirm updated data appears on the next request.

## Notes

- Dev mode can be noisy; production will show clearer ISR behavior.
- If you see bursts of updates, adjust `REVALIDATE_COOLDOWN_MS` to tune the load.
- If your setup uses different pricing or inventory modules, adjust/add subscribers accordingly.
