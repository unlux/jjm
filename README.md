# Analytics & PostHog – Project Overview

This repository uses PostHog for product analytics in the `storefront/` (Next.js 15 App Router). The backend is intentionally untouched for analytics (source of truth events can be added later if needed, but are currently out of scope).

## What’s Implemented (storefront)

- **Instrumentation client**
  - `storefront/instrumentation-client.ts` initializes PostHog (EU) with first‑party proxy via `/ingest`, pageviews and exception capture enabled.
  - Wired via `src/app/posthog-init.tsx` and rendered in `src/app/layout.tsx` so it loads on every page.

- **Standard analytics helper**
  - `storefront/src/lib/analytics.ts` provides:
    - `track(name, props)` – adds page context, referrer, and UTM params (initial + current).
    - `identify(id, traits)` and `reset()` for auth flows (not yet wired to auth).
  - Event naming is lower_snake_case.

- **Core events (client)**
  - `product_view` – on product detail page load.
    - `src/modules/products/components/ProductViewTrack.tsx` rendered from `src/modules/products/templates/index.tsx`.
  - `add_to_cart` – after successful add in PDP actions.
    - `src/modules/products/components/product-actions/index.tsx` (inside `handleAddToCart`).
  - `remove_from_cart` – when removing a line item.
    - `src/modules/cart/components/item/index.tsx` via `onDelete` hook on `DeleteButton`.
  - `cart_quantity_updated` – after quantity change on cart items.
    - `src/modules/cart/components/item/index.tsx` after `updateLineItem`.
  - `checkout_started` – on entering checkout with items.
    - `src/modules/checkout/components/CheckoutStartedTrack.tsx` rendered in `src/app/[countryCode]/(checkout)/checkout/page.tsx`.
  - `order_completed` – on thank‑you page after order placement.
    - `src/modules/order/components/OrderCompletedTrack.tsx` rendered in `src/modules/order/templates/order-completed-template.tsx`.
  - `product_clicked` – list/grid product tile clicks with position + list attribution.
    - `src/modules/products/components/ProductClickLink.tsx` used in `src/modules/products/components/product-preview/index.tsx`.
  - Product list view context
    - `src/modules/products/components/ProductListViewTrack.tsx` rendered in `src/modules/store/templates/paginated-products.tsx`.

## Key Files (storefront)

- Init & layout
  - `storefront/instrumentation-client.ts`
  - `storefront/src/app/posthog-init.tsx`
  - `storefront/src/app/layout.tsx`
- Helper
  - `storefront/src/lib/analytics.ts`
- Product view
  - `storefront/src/modules/products/components/ProductViewTrack.tsx`
  - `storefront/src/modules/products/templates/index.tsx`
- Add to cart
  - `storefront/src/modules/products/components/product-actions/index.tsx`
- Cart interactions
  - `storefront/src/modules/common/components/delete-button/index.tsx` (added `onDelete`)
  - `storefront/src/modules/cart/components/item/index.tsx`
- Checkout
  - `storefront/src/modules/checkout/components/CheckoutStartedTrack.tsx`
  - `storefront/src/app/[countryCode]/(checkout)/checkout/page.tsx`
- Order complete
  - `storefront/src/modules/order/components/OrderCompletedTrack.tsx`
  - `storefront/src/modules/order/templates/order-completed-template.tsx`
- Product lists
  - `storefront/src/modules/products/components/ProductClickLink.tsx`
  - `storefront/src/modules/products/components/ProductListViewTrack.tsx`
  - `storefront/src/modules/store/templates/paginated-products.tsx`

## Environment & Config

- `.env` / platform vars (storefront):
  - `NEXT_PUBLIC_POSTHOG_KEY=phc_...`
- First‑party proxy and EU host in `storefront/next.config.ts`:
  - `/ingest/:path* → https://eu.i.posthog.com/:path*`
  - `/ingest/static/:path* → https://eu-assets.i.posthog.com/static/:path*`
- Build-time env validation in `storefront/check-env-variables.js` includes `NEXT_PUBLIC_POSTHOG_KEY`.

## Event Naming & Schema (guidelines)

- Names: lower_snake_case.
- Common properties to include when applicable:
  - Identity: `user_id` (when identified), `customer_id` (order), `country_code`.
  - Product: `product_id`, `variant_id`, `title`, `category`, `collection_id`.
  - Commerce: `cart_id`, `item_count`, `cart_value`, `currency`, `coupon`.
  - Order: `order_id`, `revenue`, `subtotal`, `tax`, `shipping`, `discount`, `items[]`.
  - Lists: `list_id`, `position`, `event_scope` (e.g., `list`).
  - Page/UTM context is auto‑attached by `track()`.
- Avoid PII (emails, addresses) in event props.

## How to Test

1. Start the storefront with `NEXT_PUBLIC_POSTHOG_KEY` set.
2. Open DevTools → Network and watch `/ingest/capture/` and `/ingest/decide/` requests.
3. Exercise flows:
   - Visit product detail → `product_view`.
   - Add to cart → `add_to_cart` (and see mini cart open behavior).
   - Cart page: change quantity → `cart_quantity_updated`; remove → `remove_from_cart`.
   - Go to checkout → `checkout_started`.
   - Place order and land on thank‑you page → `order_completed`.
   - Browse product listing/collections → list view and `product_clicked` on taps.
4. Confirm in PostHog Live Events (EU: https://eu.posthog.com).

## What Else Can Be Added (next steps)

- **Auth identity & lifecycle**
  - Call `identify(id, traits)` after login/signup; `reset()` on logout.
  - Add `alias` on signup to connect pre‑login actions.

- **Session replay & error tracking**
  - Enable replay with privacy masking in `instrumentation-client.ts` (e.g., `session_recording` options).
  - Tag sensitive DOM with `data-ph-no-capture` / `data-ph-mask`.

- **Checkout step analytics**
  - Capture `checkout_step_view` across addresses, shipping, payment, and review components.

- **Attribution enhancements**
  - Persist marketing attribution server-side or as order metadata displayed on the thank‑you page.

- **Experiments & feature flags**
  - Use PostHog flags for UI tests (e.g., checkout redesign) with `purchase` as the primary metric.

- **Dashboards and alerts**
  - Funnels: `product_view → add_to_cart → checkout_started → order_completed`.
  - Revenue/AOV dashboards; alert on conversion drops or JS error spikes.

- **Data contracts**
  - Maintain a tracking plan (YAML/JSON) with event/property schemas in the repo.

## Branch & Changelog

- Working branch: `feat/posthog`
- Highlights:
  - Added client init, helper, and event wiring for PDP, cart, checkout, order, and lists.
  - Introduced first‑party proxy for EU PostHog.
  - Zero backend code changes for analytics.
