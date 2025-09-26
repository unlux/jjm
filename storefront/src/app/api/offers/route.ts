import { NextResponse } from "next/server"
import { listOffersCached } from "@/lib/repos/offers"

export const dynamic = "force-dynamic"
export const revalidate = 86400 // 24 hours

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const isActiveParam = searchParams.get("isActive")
    const isActive =
      isActiveParam === null
        ? undefined
        : isActiveParam === "true"
        ? true
        : isActiveParam === "false"
        ? false
        : undefined
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined

    const offers = await listOffersCached({ isActive, limit })
    return NextResponse.json({ offers })
  } catch (e: any) {
    console.error("GET /api/offers error", e)
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    )
  }
}
