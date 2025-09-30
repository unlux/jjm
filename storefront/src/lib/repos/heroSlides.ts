import "server-only"

import { asc, eq } from "drizzle-orm"
import { unstable_cache } from "next/cache"

import { db } from "@/lib/db"
import { type HeroSlideRow, heroSlides as heroSlidesTable } from "@/lib/schema"

export type SlideItem = {
  src: string
  alt: string
  href?: string
  duration?: number | null
  isForMobile?: boolean
}

export async function listHeroSlides(params?: {
  isForMobile?: boolean
  limit?: number
}): Promise<SlideItem[]> {
  const { isForMobile, limit = 50 } = params ?? {}
  const where = [] as any[]
  if (typeof isForMobile === "boolean")
    where.push(eq(heroSlidesTable.isForMobile, isForMobile))

  const rows: HeroSlideRow[] = await db
    .select()
    .from(heroSlidesTable)
    .where(
      where.length
        ? (where as any).reduce(
            (acc: any, w: any) => (acc ? (acc as any).and(w) : w),
            undefined
          )
        : undefined
    )
    .orderBy(asc(heroSlidesTable.sortOrder), asc(heroSlidesTable.createdAt))
    .limit(limit)

  return rows.map((r) => ({
    src: r.src,
    alt: r.alt,
    href: r.href ?? undefined,
    duration: r.duration ?? undefined,
    isForMobile: r.isForMobile,
  }))
}

// Cached variant with ISR and tag-based revalidation
export async function listHeroSlidesCached(params?: {
  isForMobile?: boolean
  limit?: number
}): Promise<SlideItem[]> {
  const isForMobileKey =
    typeof params?.isForMobile === "undefined"
      ? "all"
      : params?.isForMobile
        ? "mobile:true"
        : "mobile:false"
  const limitKey = String(params?.limit ?? 50)
  const keyParts = ["hero-slides", isForMobileKey, limitKey]

  const tags = [
    "hero-slides",
    typeof params?.isForMobile === "undefined"
      ? "hero-slides:all"
      : params?.isForMobile
        ? "hero-slides:mobile:true"
        : "hero-slides:mobile:false",
  ]

  const cached = unstable_cache(
    async (p?: { isForMobile?: boolean; limit?: number }) => listHeroSlides(p),
    keyParts,
    { revalidate: 86400, tags }
  )

  return cached(params)
}
