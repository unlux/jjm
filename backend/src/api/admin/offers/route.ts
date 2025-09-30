import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { db } from "../../../lib/drizzle"
import { offers } from "../../../db/schema/offers"
import { asc, eq } from "drizzle-orm"
import { sql } from "drizzle-orm"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id, isActive, limit = 50, offset = 0 } = (req.query || {}) as {
    id?: string
    isActive?: string
    limit?: string | number
    offset?: string | number
  }

  let where: any = undefined

  if (id) {
    where = eq(offers.id, String(id).trim())
  } else if (isActive !== undefined) {
    where = eq(offers.isActive, isActive === "true")
  }

  const take = Math.min(Number(limit) || 50, 200)
  const skip = Number(offset) || 0

  const rows = await db
    .select()
    .from(offers)
    .where(where)
    .orderBy(asc(offers.sortOrder))
    .limit(take)
    .offset(skip)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(offers)
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
    message: string
    href?: string
    isActive?: boolean
    sortOrder?: number
  }

  if (!body.id || !body.message) {
    res.status(400).json({ message: "id and message are required" })
    return
  }

  const [row] = await db
    .insert(offers)
    .values({
      id: body.id.trim(),
      message: body.message,
      href: body.href || null,
      isActive: body.isActive !== undefined ? body.isActive : true,
      sortOrder: body.sortOrder || 0,
      createdAt: new Date(),
    })
    .returning()

  res.status(201).json({ data: row })
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const { id } = (req.query || {}) as { id?: string }
  const body = (req.body || {}) as Partial<{
    message: string
    href: string | null
    isActive: boolean
    sortOrder: number
  }>

  if (!id) {
    res.status(400).json({ message: "id is required" })
    return
  }

  const updateData: any = {}
  if (body.message !== undefined) updateData.message = body.message
  if (body.href !== undefined) updateData.href = body.href
  if (body.isActive !== undefined) updateData.isActive = body.isActive
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder

  const [row] = await db
    .update(offers)
    .set(updateData)
    .where(eq(offers.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Offer not found" })
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
    .delete(offers)
    .where(eq(offers.id, id.trim()))
    .returning()

  if (!row) {
    res.status(404).json({ message: "Offer not found" })
    return
  }

  res.json({ data: row, message: "Offer deleted successfully" })
}
