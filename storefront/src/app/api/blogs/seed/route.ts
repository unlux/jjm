import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { blogs as blogsTable } from "@/lib/schema"
import { blogs as staticBlogs } from "@/lib/data/blog-seed"

export async function POST() {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Disabled in production" },
        { status: 403 }
      )
    }

    const rows = staticBlogs.map((b) => ({
      id: b.id,
      title: b.title,
      publishedAt: new Date(b.date),
      category: b.category,
      image: b.image,
      excerpt: b.excerpt,
      content: b.content,
      author: b.author,
      authorImage: b.authorImage,
    }))

    // Upsert-like: ignore conflicts on id
    await db
      .insert(blogsTable)
      .values(rows as any)
      // @ts-ignore drizzle types for onConflict may lag; runtime is fine
      .onConflictDoNothing()

    return NextResponse.json({ ok: true, inserted: rows.length })
  } catch (e: any) {
    console.error("POST /api/blogs/seed error", e)
    return NextResponse.json({ error: "Failed to seed" }, { status: 500 })
  }
}
