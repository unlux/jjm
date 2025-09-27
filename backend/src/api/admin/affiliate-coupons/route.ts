import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { db } from "../../../lib/drizzle"
import { affiliateCoupons } from "../../../db/schema/affiliate-coupons"
import { desc, eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { code, limit = 50, offset = 0 } = (req.query || {}) as {
    code?: string
    limit?: string | number
    offset?: string | number
  }

  const where = code
    ? eq(affiliateCoupons.code, String(code).trim().toLowerCase())
    : undefined

  const take = Math.min(Number(limit) || 50, 200)
  const skip = Number(offset) || 0

  const rows = await db
    .select()
    .from(affiliateCoupons)
    .where(where as any)
    .orderBy(desc(affiliateCoupons.timesUsed))
    .limit(take)
    .offset(skip)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(affiliateCoupons)
    .where(where as any)

  res.json({
    data: rows,
    count,
    limit: take,
    offset: skip,
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body || {}) as { code?: string; delta?: number }
  const raw = (body.code || "").trim().toLowerCase()
  const delta = Math.max(1, Number(body.delta) || 1)

  if (!raw) {
    res.status(400).json({ message: "code is required" })
    return
  }

  await db
    .insert(affiliateCoupons)
    .values({ code: raw, timesUsed: delta })
    .onConflictDoUpdate({
      target: affiliateCoupons.code,
      set: {
        timesUsed: sql`${affiliateCoupons.timesUsed} + ${delta}`,
        updatedAt: new Date(),
      },
    })

  const [row] = await db
    .select()
    .from(affiliateCoupons)
    .where(eq(affiliateCoupons.code, raw))
    .limit(1)

  res.json({ data: row })
}
