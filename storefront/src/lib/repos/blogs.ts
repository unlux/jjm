import "server-only"
import { and, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { blogs as blogsTable, type BlogRow } from "@/lib/schema"
import { unstable_cache } from "next/cache"

export type Blog = {
  id: string
  title: string
  publishedAt: string
  category: string
  image: string
  excerpt: string
  content: string
  author: string
  authorImage: string
}

function toBlog(row: typeof blogsTable.$inferSelect): Blog {
  return {
    id: row.id,
    title: row.title,
    publishedAt: row.publishedAt?.toISOString?.() ?? new Date().toISOString(),
    category: row.category,
    image: row.image,
    excerpt: row.excerpt,
    content: row.content,
    author: row.author,
    authorImage: row.authorImage,
  }
}

export async function listBlogs(params?: {
  category?: string
  limit?: number
  excludeId?: string
}): Promise<Blog[]> {
  const { category, limit = 50, excludeId } = params ?? {}

  const where: any[] = []
  if (category) where.push(eq(blogsTable.category, category))

  const rows: BlogRow[] = await db
    .select()
    .from(blogsTable)
    .where(where.length ? (and as any)(...where) : undefined)
    .orderBy(desc(blogsTable.publishedAt))
    .limit(limit)

  // If excludeId is provided, filter it out client-side because Drizzle where already used eq for include.
  const filtered = excludeId
    ? rows.filter((r: BlogRow) => r.id !== excludeId)
    : rows
  return filtered.map(toBlog)
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const rows = await db
    .select()
    .from(blogsTable)
    .where(eq(blogsTable.id, id))
    .limit(1)
  const row = rows[0]
  return row ? toBlog(row) : null
}

// Cached variants with ISR and tag-based revalidation
export async function listBlogsCached(params?: {
  category?: string
  limit?: number
  excludeId?: string
}): Promise<Blog[]> {
  const categoryKey = params?.category ?? "all"
  const limitKey = String(params?.limit ?? 50)
  const excludeKey = params?.excludeId ? `ex:${params.excludeId}` : "ex:none"
  const keyParts = ["blogs", categoryKey, limitKey, excludeKey]

  const tags = [
    "blogs",
    categoryKey === "all" ? "blogs:all" : `blogs:cat:${categoryKey}`,
  ]

  const cached = unstable_cache(
    async (p?: { category?: string; limit?: number; excludeId?: string }) =>
      listBlogs(p),
    keyParts,
    { revalidate: 3600, tags }
  )

  return cached(params)
}

export async function getBlogByIdCached(id: string): Promise<Blog | null> {
  const keyParts = ["blogs:by-id", id]
  const tags = ["blogs", `blogs:id:${id}`]
  const cached = unstable_cache(async (i: string) => getBlogById(i), keyParts, {
    revalidate: 3600,
    tags,
  })
  return cached(id)
}
