import "server-only"

import { asc, eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"

import { db } from "@/lib/db"
import {
  type NewOfferRow,
  type OfferRow,
  offers as offersTable,
} from "@/lib/schema"

export type OfferItem = {
  id: string
  message: string
  href?: string
  isActive: boolean
}

export async function listOffers(params?: {
  isActive?: boolean
  limit?: number
}): Promise<OfferItem[]> {
  const { isActive, limit = 50 } = params ?? {}
  const where: any[] = []
  if (typeof isActive === "boolean")
    where.push(eq(offersTable.isActive, isActive))

  const rows: OfferRow[] = await db
    .select()
    .from(offersTable)
    // drizzle's and reducer pattern used elsewhere; but with array empty, skip
    .where(
      where.length
        ? (where as any).reduce(
            (acc: any, w: any) => (acc ? ((acc as any).and?.(w) ?? w) : w),
            undefined
          )
        : undefined
    )
    .orderBy(asc(offersTable.sortOrder), asc(offersTable.createdAt))
    .limit(limit)

  return rows.map((r) => ({
    id: r.id,
    message: r.message,
    href: r.href ?? undefined,
    isActive: r.isActive,
  }))
}

// Cached variant with ISR and tag-based revalidation
export async function listOffersCached(params?: {
  isActive?: boolean
  limit?: number
}): Promise<OfferItem[]> {
  const isActiveKey =
    typeof params?.isActive === "undefined"
      ? "all"
      : params?.isActive
        ? "active:true"
        : "active:false"
  const limitKey = String(params?.limit ?? 50)
  const keyParts = ["offers", isActiveKey, limitKey]

  const tags = [
    "offers",
    typeof params?.isActive === "undefined"
      ? "offers:all"
      : params?.isActive
        ? "offers:active:true"
        : "offers:active:false",
  ]

  const cached = unstable_cache(
    async (p?: { isActive?: boolean; limit?: number }) => listOffers(p),
    keyParts,
    { revalidate: 3600, tags }
  )

  return cached(params)
}
