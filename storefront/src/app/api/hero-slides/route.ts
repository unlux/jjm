import { NextResponse } from "next/server"
import { listHeroSlidesCached } from "@/lib/repos/heroSlides"

export const dynamic = "force-dynamic"
export const revalidate = 86400 // 24 hours

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const isForMobileParam = searchParams.get("isForMobile")
    const isForMobile =
      isForMobileParam === null
        ? undefined
        : isForMobileParam === "true"
        ? true
        : isForMobileParam === "false"
        ? false
        : undefined
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined

    const slides = await listHeroSlidesCached({ isForMobile, limit })
    return NextResponse.json({ slides })
  } catch (e: any) {
    console.error("GET /api/hero-slides error", e)
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 }
    )
  }
}
