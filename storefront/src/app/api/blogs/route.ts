import { NextRequest, NextResponse } from "next/server"

import { listBlogsCached } from "@/lib/repos/blogs"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category") || undefined
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined
    const excludeId = searchParams.get("excludeId") || undefined

    const rows = await listBlogsCached({ category, limit, excludeId })

    // Shape for UI compatibility: include a human readable date field
    const data = rows.map((b) => ({
      ...b,
      date: new Date(b.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }))

    return NextResponse.json({ blogs: data })
  } catch (e: any) {
    console.error("GET /api/blogs error", e)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}
