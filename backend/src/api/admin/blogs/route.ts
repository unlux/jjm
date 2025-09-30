import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { db } from "../../../lib/drizzle"
import { blogs } from "../../../db/schema/blogs"
import { desc, eq, like, or } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id, search, category, limit = 50, offset = 0 } = (req.query || {}) as {
    id?: string
    search?: string
    category?: string
    limit?: string | number
    offset?: string | number
  }

  let where: any = undefined

  if (id) {
    where = eq(blogs.id, String(id).trim())
  } else if (search) {
    const searchTerm = `%${search}%`
    where = or(
      like(blogs.title, searchTerm),
      like(blogs.excerpt, searchTerm),
      like(blogs.content, searchTerm)
    )
  } else if (category) {
    where = eq(blogs.category, String(category).trim())
  }

  const take = Math.min(Number(limit) || 50, 200)
  const skip = Number(offset) || 0

  const rows = await db
    .select()
    .from(blogs)
    .where(where)
    .orderBy(desc(blogs.publishedAt))
    .limit(take)
    .offset(skip)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(blogs)
    .where(where)

  res.json({
    data: rows,
    count,
    limit: take,
    offset: skip,
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const body = (req.body || {}) as {
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

  if (!body.id || !body.title || !body.category) {
    res.status(400).json({ message: "id, title, and category are required" })
    return
  }

  const [row] = await db
    .insert(blogs)
    .values({
      id: body.id.trim(),
      title: body.title,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      category: body.category,
      image: body.image || "",
      excerpt: body.excerpt || "",
      content: body.content || "",
      author: body.author || "",
      authorImage: body.authorImage || "",
    })
    .returning()

  res.status(201).json({ data: row })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { id } = (req.query || {}) as { id?: string }
  const body = (req.body || {}) as Partial<{
    title: string
    publishedAt: string
    category: string
    image: string
    excerpt: string
    content: string
    author: string
    authorImage: string
  }>

  if (!id) {
    res.status(400).json({ message: "id is required" })
    return
  }

  const updateData: any = {}
  if (body.title !== undefined) updateData.title = body.title
  if (body.publishedAt !== undefined) updateData.publishedAt = new Date(body.publishedAt)
  if (body.category !== undefined) updateData.category = body.category
  if (body.image !== undefined) updateData.image = body.image
  if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
  if (body.content !== undefined) updateData.content = body.content
  if (body.author !== undefined) updateData.author = body.author
  if (body.authorImage !== undefined) updateData.authorImage = body.authorImage

  const [row] = await db
    .update(blogs)
    .set(updateData)
    .where(eq(blogs.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Blog not found" })
    return
  }

  res.json({ data: row })
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = (req.query || {}) as { id?: string }

  if (!id) {
    res.status(400).json({ message: "id is required" })
    return
  }

  const [row] = await db
    .delete(blogs)
    .where(eq(blogs.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Blog not found" })
    return
  }

  res.json({ data: row, message: "Blog deleted successfully" })
}
