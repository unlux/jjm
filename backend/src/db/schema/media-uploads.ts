import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core"

export const mediaUploads = pgTable("media_uploads", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // in bytes
  url: text("url").notNull(),
  uploadedBy: text("uploaded_by"), // optional: user email or ID
  createdAt: timestamp("created_at", { withTimezone: false }).notNull().defaultNow(),
})

export type MediaUploadRow = typeof mediaUploads.$inferSelect
export type NewMediaUploadRow = typeof mediaUploads.$inferInsert
