import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core"

export const offers = pgTable("offers", {
  id: text("id").primaryKey(),
  message: text("message").notNull(),
  href: text("href"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull(),
})

export type OfferRow = typeof offers.$inferSelect
export type NewOfferRow = typeof offers.$inferInsert
