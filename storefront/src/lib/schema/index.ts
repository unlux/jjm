import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const blogs = pgTable("blogs", {
  // Using slug as primary id
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  // Store publication date as timestamp; default now
  publishedAt: timestamp("published_at", { withTimezone: false }).notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  authorImage: text("author_image").notNull(),
})

export type BlogRow = typeof blogs.$inferSelect
export type NewBlogRow = typeof blogs.$inferInsert
