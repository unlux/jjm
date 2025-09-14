import "server-only"
import { and, desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { blogs as blogsTable, type BlogRow } from "@/lib/schema"

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
  const filtered = excludeId ? rows.filter((r: BlogRow) => r.id !== excludeId) : rows
  return filtered.map(toBlog)
}

export async function getBlogById(id: string): Promise<Blog | null> {
  const rows = await db.select().from(blogsTable).where(eq(blogsTable.id, id)).limit(1)
  const row = rows[0]
  return row ? toBlog(row) : null
}
