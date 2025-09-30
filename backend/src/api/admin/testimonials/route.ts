import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { db } from "../../../lib/drizzle"
import { testimonials } from "../../../db/schema/testimonials"
import { asc, eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id, isFeatured, limit = 50, offset = 0 } = (req.query || {}) as {
    id?: string
    isFeatured?: string
    limit?: string | number
    offset?: string | number
  }

  let where: any = undefined

  if (id) {
    where = eq(testimonials.id, String(id).trim())
  } else if (isFeatured !== undefined) {
    where = eq(testimonials.isFeatured, isFeatured === "true")
  }

  const take = Math.min(Number(limit) || 50, 200)
  const skip = Number(offset) || 0

  const rows = await db
    .select()
    .from(testimonials)
    .where(where)
    .orderBy(asc(testimonials.sortOrder))
    .limit(take)
    .offset(skip)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(testimonials)
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
    quote: string
    author: string
    role?: string
    image?: string
    rating: number
    isFeatured?: boolean
    sortOrder?: number
  }

  if (!body.id || !body.quote || !body.author || body.rating === undefined) {
    res.status(400).json({ message: "id, quote, author, and rating are required" })
    return
  }

  const [row] = await db
    .insert(testimonials)
    .values({
      id: body.id.trim(),
      quote: body.quote,
      author: body.author,
      role: body.role || null,
      image: body.image || null,
      rating: body.rating,
      isFeatured: body.isFeatured || false,
      sortOrder: body.sortOrder || 0,
      createdAt: new Date(),
    })
    .returning()

  res.status(201).json({ data: row })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { id } = (req.query || {}) as { id?: string }
  const body = (req.body || {}) as Partial<{
    quote: string
    author: string
    role: string | null
    image: string | null
    rating: number
    isFeatured: boolean
    sortOrder: number
  }>

  if (!id) {
    res.status(400).json({ message: "id is required" })
    return
  }

  const updateData: any = {}
  if (body.quote !== undefined) updateData.quote = body.quote
  if (body.author !== undefined) updateData.author = body.author
  if (body.role !== undefined) updateData.role = body.role
  if (body.image !== undefined) updateData.image = body.image
  if (body.rating !== undefined) updateData.rating = body.rating
  if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder

  const [row] = await db
    .update(testimonials)
    .set(updateData)
    .where(eq(testimonials.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Testimonial not found" })
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
    .delete(testimonials)
    .where(eq(testimonials.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Testimonial not found" })
    return
  }

  res.json({ data: row, message: "Testimonial deleted successfully" })
}
