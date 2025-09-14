import "server-only"
import { asc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { heroSlides as heroSlidesTable, type HeroSlideRow } from "@/lib/schema"

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
  if (typeof isForMobile === "boolean") where.push(eq(heroSlidesTable.isForMobile, isForMobile))

  const rows: HeroSlideRow[] = await db
    .select()
    .from(heroSlidesTable)
    .where(where.length ? (where as any).reduce((acc: any, w: any) => (acc ? (acc as any).and(w) : w), undefined) : undefined)
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
