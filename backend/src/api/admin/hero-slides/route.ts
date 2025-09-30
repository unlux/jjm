import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { db } from "../../../lib/drizzle"
import { heroSlides } from "../../../db/schema/hero-slides"
import { asc, eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id, isForMobile, limit = 50, offset = 0 } = (req.query || {}) as {
    id?: string
    isForMobile?: string
    limit?: string | number
    offset?: string | number
  }

  let where: any = undefined

  if (id) {
    where = eq(heroSlides.id, String(id).trim())
  } else if (isForMobile !== undefined) {
    where = eq(heroSlides.isForMobile, isForMobile === "true")
  }

  const take = Math.min(Number(limit) || 50, 200)
  const skip = Number(offset) || 0

  const rows = await db
    .select()
    .from(heroSlides)
    .where(where)
    .orderBy(asc(heroSlides.sortOrder))
    .limit(take)
    .offset(skip)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(heroSlides)
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
    src: string
    alt: string
    href?: string
    isForMobile?: boolean
    sortOrder?: number
    duration?: number
  }

  if (!body.id || !body.src || !body.alt) {
    res.status(400).json({ message: "id, src, and alt are required" })
    return
  }

  const [row] = await db
    .insert(heroSlides)
    .values({
      id: body.id.trim(),
      src: body.src,
      alt: body.alt,
      href: body.href || null,
      isForMobile: body.isForMobile || false,
      sortOrder: body.sortOrder || 0,
      duration: body.duration || null,
      createdAt: new Date(),
    })
    .returning()

  res.status(201).json({ data: row })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { id } = (req.query || {}) as { id?: string }
  const body = (req.body || {}) as Partial<{
    src: string
    alt: string
    href: string | null
    isForMobile: boolean
    sortOrder: number
    duration: number | null
  }>

  if (!id) {
    res.status(400).json({ message: "id is required" })
    return
  }

  const updateData: any = {}
  if (body.src !== undefined) updateData.src = body.src
  if (body.alt !== undefined) updateData.alt = body.alt
  if (body.href !== undefined) updateData.href = body.href
  if (body.isForMobile !== undefined) updateData.isForMobile = body.isForMobile
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder
  if (body.duration !== undefined) updateData.duration = body.duration

  const [row] = await db
    .update(heroSlides)
    .set(updateData)
    .where(eq(heroSlides.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Hero slide not found" })
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
    .delete(heroSlides)
    .where(eq(heroSlides.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Hero slide not found" })
    return
  }

  res.json({ data: row, message: "Hero slide deleted successfully" })
}
