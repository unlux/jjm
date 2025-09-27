import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { db } from "../../lib/drizzle"
import { affiliateCoupons } from "../../db/schema/affiliate-coupons"
import { sql, eq } from "drizzle-orm"

export type IncrementCouponsStepInput = {
  codes: string[]
}

export type IncrementCouponsStepOutput = {
  updated: { code: string; timesUsed: number }[]
}

export const incrementCouponsStep = createStep(
  "increment-coupons",
  async ({ codes }: IncrementCouponsStepInput) => {
    const normalized = Array.from(
      new Set(
        (codes || [])
          .filter(Boolean)
          .map((c) => c.trim().toLowerCase())
          .filter((c) => c.length > 0)
      )
    )

    if (normalized.length === 0) {
      return new StepResponse<IncrementCouponsStepOutput>({ updated: [] })
    }

    const results: { code: string; timesUsed: number }[] = []

    await db.transaction(async (tx) => {
      for (const code of normalized) {
        await tx
          .insert(affiliateCoupons)
          .values({ code, timesUsed: 1 })
          .onConflictDoUpdate({
            target: affiliateCoupons.code,
            set: {
              timesUsed: sql`${affiliateCoupons.timesUsed} + 1`,
              updatedAt: new Date(),
            },
          })

        // fetch current value
        const row = await tx
          .select({ code: affiliateCoupons.code, timesUsed: affiliateCoupons.timesUsed })
          .from(affiliateCoupons)
          .where(eq(affiliateCoupons.code, code))
          .limit(1)

        if (row[0]) {
          results.push(row[0])
        }
      }
    })

    return new StepResponse<IncrementCouponsStepOutput>({ updated: results })
  }
)
