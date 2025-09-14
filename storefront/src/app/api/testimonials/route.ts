import { NextResponse } from "next/server"
import { listTestimonials } from "@/lib/repos/testimonials"

export const revalidate = 3600 // 1 hour

type Params = {
  isFeatured?: string
  limit?: string
  orderBy?: 'newest' | 'rating' | 'sortOrder'
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const params: Params = Object.fromEntries(searchParams.entries())
    
    const isFeatured = params.isFeatured ? params.isFeatured === 'true' : undefined
    const limit = params.limit ? parseInt(params.limit, 10) : undefined
    
    const testimonials = await listTestimonials({
      isFeatured,
      limit,
      orderBy: params.orderBy
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
