import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core"

export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role"),
  image: text("image"),
  rating: integer("rating").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull(),
})

export type TestimonialRow = typeof testimonials.$inferSelect
export type NewTestimonialRow = typeof testimonials.$inferInsert
