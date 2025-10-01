import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { db } from "../../../lib/drizzle"
import { mediaUploads } from "../../../db/schema/media-uploads"
import { desc, eq } from "drizzle-orm"
import { sql } from "drizzle-orm"
import { Modules } from "@medusajs/framework/utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id, limit = 50, offset = 0 } = (req.query || {}) as {
    id?: string
    limit?: string | number
    offset?: string | number
  }

  let where: any = undefined

  if (id) {
    where = eq(mediaUploads.id, String(id).trim())
  }

  const take = Math.min(Number(limit) || 50, 200)
  const skip = Number(offset) || 0

  const rows = await db
    .select()
    .from(mediaUploads)
    .where(where)
    .orderBy(desc(mediaUploads.createdAt))
    .limit(take)
    .offset(skip)

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(mediaUploads)
    .where(where)

  res.json({
    data: rows,
    count,
    limit: take,
    offset: skip,
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    const fileService = req.scope.resolve(Modules.FILE)
    
    // Get the uploaded file from the request
    const files = req.files as any[] | undefined
    
    if (!files || files.length === 0) {
      res.status(400).json({ error: "No file uploaded" })
      return
    }

    const file = files[0]
    
    // Upload to S3/R2 using Medusa's file service
    const uploadResult = await fileService.createFiles([{
      filename: file.originalname,
      mimeType: file.mimetype,
      content: file.buffer,
    }])

    const uploadedFile = uploadResult[0]

    // Generate a unique ID for the database entry
    const id = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Save metadata to database
    const [row] = await db
      .insert(mediaUploads)
      .values({
        id,
        filename: uploadedFile.id,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: uploadedFile.url,
        uploadedBy: null,
        createdAt: new Date(),
      })
      .returning()

    res.status(201).json({ data: row })
  } catch (error: any) {
    console.error("[media-upload] Error:", error)
    res.status(500).json({ error: error.message || "Failed to upload file" })
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = (req.query || {}) as { id?: string }

  if (!id) {
    res.status(400).json({ error: "id is required" })
    return
  }

  try {
    const fileService = req.scope.resolve(Modules.FILE)
    
    // Get the media record first
    const [media] = await db
      .select()
      .from(mediaUploads)
      .where(eq(mediaUploads.id, id.trim()))
      .limit(1)

    if (!media) {
      res.status(404).json({ error: "Media not found" })
      return
    }

    // Delete from S3/R2
    try {
      await fileService.deleteFiles([media.filename])
    } catch (error) {
      console.warn("[media-upload] Failed to delete from storage:", error)
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const [row] = await db
      .delete(mediaUploads)
      .where(eq(mediaUploads.id, id.trim()))
      .returning()

    res.json({ data: row, message: "Media deleted successfully" })
  } catch (error: any) {
    console.error("[media-upload] Delete error:", error)
    res.status(500).json({ error: error.message || "Failed to delete media" })
  }
}
