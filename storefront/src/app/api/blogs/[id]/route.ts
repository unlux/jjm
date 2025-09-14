import { NextResponse } from "next/server"
import { getBlogById, listBlogs } from "@/lib/repos/blogs"

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await params.id
    const blog = await getBlogById(id)
    if (!blog) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const related = await listBlogs({
      category: blog.category,
      excludeId: id,
      limit: 3,
    })

    const format = (b: typeof blog) => ({
      ...b,
      date: new Date(b.publishedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    })

    return NextResponse.json({
      blog: format(blog),
      related: related.map(format),
    })
  } catch (e: any) {
    console.error("GET /api/blogs/[id] error", e)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}
