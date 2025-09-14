import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { heroSlides as heroSlidesTable } from "@/lib/schema"

// Dev-only: seed a few default slides
export async function POST() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Disabled in production" }, { status: 403 })
    }

    const now = new Date()
    const rows = [
      {
        id: "hero1",
        src: "/hero1.mp4",
        alt: "Hero video 1",
        href: "/customkit",
        isForMobile: false,
        sortOrder: 1,
        duration: null,
        createdAt: now,
      },
      {
        id: "hero2",
        src: "/hero2.mp4",
        alt: "Hero video 2",
        href: "/contact",
        isForMobile: false,
        sortOrder: 2,
        duration: null,
        createdAt: now,
      },
      {
        id: "hero3",
        src: "/hero3.mp4",
        alt: "Hero video 3",
        href: "/partnership-program",
        isForMobile: false,
        sortOrder: 3,
        duration: null,
        createdAt: now,
      },
    ]

    // Insert, ignore duplicates by id
    await db
      .insert(heroSlidesTable)
      .values(rows as any)
      // @ts-ignore drizzle typing for onConflict may vary by version
      .onConflictDoNothing()

    return NextResponse.json({ ok: true, inserted: rows.length })
  } catch (e: any) {
    console.error("POST /api/hero-slides/seed error", e)
    return NextResponse.json({ error: "Failed to seed hero slides" }, { status: 500 })
  }
}
