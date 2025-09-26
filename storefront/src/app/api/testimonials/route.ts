import { NextResponse } from "next/server"

import { listTestimonialsCached } from "@/lib/repos/testimonials"

export const dynamic = "force-dynamic"
export const revalidate = 86400 // 24 hours

type Params = {
  isFeatured?: string
  limit?: string
  orderBy?: "newest" | "rating" | "sortOrder"
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const params: Params = Object.fromEntries(searchParams.entries())

    const isFeatured = params.isFeatured
      ? params.isFeatured === "true"
      : undefined
    const limit = params.limit ? parseInt(params.limit, 10) : undefined

    const testimonials = await listTestimonialsCached({
      isFeatured,
      limit,
      orderBy: params.orderBy,
    })

    return NextResponse.json({ testimonials })
  } catch (e: any) {
    console.error("GET /api/testimonials error", e)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}
