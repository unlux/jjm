# Affiliate Coupon Usage Tracking (Drizzle + Medusa v2)

This document explains the affiliate coupon tracking feature added to the backend, how to configure a separate Drizzle database, how to run migrations, and an idempotency plan you can implement later if needed.

## Overview

- When an order is placed, Medusa emits the `order.placed` event.
- A subscriber at `src/subscribers/order-placed-coupon-tracker.ts` listens to this event.
- The subscriber loads the order and expands `promotions.*` and `cart.promotions.*` to extract all applied promo codes.
- It triggers a workflow `increment-coupon-usage` which upserts each code into the Postgres table `affiliate_coupons` and increments `times_used`.

## Files

- Schema: `src/db/schema/affiliate-coupons.ts`
- Drizzle client: `src/lib/drizzle.ts`
- Workflow: `src/workflows/increment-coupon-usage.ts`
- Step: `src/workflows/steps/increment-coupons.ts`
- Subscriber: `src/subscribers/order-placed-coupon-tracker.ts`
- Admin Routes: `src/api/admin/affiliate-coupons/route.ts`
- Drizzle Config: `drizzle.config.ts`

## Environment Variables

You can use a separate database for Drizzle by setting `DRIZZLE_DATABASE_URL` in `backend/.env` (or your environment).

- `DRIZZLE_DATABASE_URL` — Postgres connection string for Drizzle (coupon tracking).
- Fallback: If `DRIZZLE_DATABASE_URL` is not set, `src/lib/drizzle.ts` falls back to `DATABASE_URL`.

Example `.env` entries:

```
DATABASE_URL=postgres://user:pass@host:5432/medusa_main
DRIZZLE_DATABASE_URL=postgres://user:pass@host:5432/medusa_affiliate
```

## Migrations

This project supports two ways to manage the `affiliate_coupons` table:

1. Drizzle Kit (recommended for ongoing work)
2. Manual SQL (one-off bootstrap)

### 1) Drizzle Kit workflow

Package.json scripts (in `backend/package.json`):

```
"drizzle:generate": "drizzle-kit generate --config=drizzle.config.ts",
"drizzle:migrate": "drizzle-kit migrate --config=drizzle.config.ts",
"drizzle:studio": "drizzle-kit studio --config=drizzle.config.ts"
```

Run migrations:

1. Ensure `DRIZZLE_DATABASE_URL` is set.
2. Generate migrations and meta journal:

```
yarn drizzle:generate
```

3. Apply migrations:

```
yarn drizzle:migrate
```

If you see `Error: Can't find meta/_journal.json file`, it means the meta folder hasn’t been created yet. Run `yarn drizzle:generate` first to create the migration files and the `drizzle/meta/_journal.json`.

Open Drizzle Studio (optional):

```
yarn drizzle:studio
```

Notes:
- There is a manual SQL file at `drizzle/0000_affiliate_coupons.sql`. The Drizzle migrator only executes migrations tracked in `drizzle/meta/_journal.json`. If you want to rely solely on the Drizzle migrator, you can ignore or move that manual file (it isn’t referenced by the journal).

### 2) Manual SQL workflow

If you prefer manual application, you can run:

```
psql "$DRIZZLE_DATABASE_URL" -f drizzle/0000_affiliate_coupons.sql
```

In this case, don’t run `drizzle:migrate` for the initial baseline unless you also create a matching journal/migration via `drizzle:generate` and handle potential duplicates.

## Admin API

- GET `/admin/affiliate-coupons` — list usage, ordered by highest `times_used`.
  - Query params: `code?`, `limit?`, `offset?`
- POST `/admin/affiliate-coupons` — create/increment usage.
  - Body: `{ code: string, delta?: number }` (default `delta` is 1)

## Idempotency Plan (Recommended for production)

Current behavior increments the counter every time `order.placed` is processed. If the same event is re-processed, counters could be incremented more than once. To make it idempotent per order and code, implement the following:

1. Add a new table to record processed pairs:

```sql
CREATE TABLE IF NOT EXISTS affiliate_coupon_usages (
  order_id text NOT NULL,
  code text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (order_id, code)
);
```

2. Update the step logic (`src/workflows/steps/increment-coupons.ts`) to:

- For each `{ orderId, code }` pair, attempt an insert into `affiliate_coupon_usages`.
- If the insert succeeds, then increment `affiliate_coupons.times_used` (insert on conflict do update).
- If the insert fails due to `PRIMARY KEY` conflict, skip incrementing (we’ve already counted this order/code).

3. Suggested TypeScript approach (pseudo):

```ts
await tx.insert(affiliateCouponUsages)
  .values({ orderId, code })
  .onConflictDoNothing();

const inserted = await tx.select(...).from(affiliateCouponUsages)
  .where(eq(affiliateCouponUsages.orderId, orderId), eq(affiliateCouponUsages.code, code));

if (inserted.length > 0) {
  await tx.insert(affiliateCoupons)
    .values({ code, timesUsed: 1 })
    .onConflictDoUpdate({
      target: affiliateCoupons.code,
      set: { timesUsed: sql`${affiliateCoupons.timesUsed} + 1`, updatedAt: new Date() },
    });
}
```

4. Pass `orderId` into the workflow from the subscriber:
- Extract `order.id` in `order-placed-coupon-tracker.ts` and send `{ orderId, codes }` to the workflow so the step has both values.

This ensures each order contributes **at most once** per code, even if the event is reprocessed.

## Testing

1. Ensure `DRIZZLE_DATABASE_URL` in `backend/.env`.
2. Generate & run migrations:
   - `yarn drizzle:generate`
   - `yarn drizzle:migrate`
3. Place an order with a promotion code.
4. Check usage via `GET /admin/affiliate-coupons`.

## Troubleshooting

- `Can't find meta/_journal.json file`:
  - Run `yarn drizzle:generate` before `yarn drizzle:migrate`.
- Duplicate relation errors during migrate:
  - You likely ran the manual SQL first. Either delete/adjust the generated migration to match the existing DB, or create a baseline in the journal (advanced), or stick with the manual SQL approach for initial bootstrap.
