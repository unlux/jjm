import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core"

export const heroSlides = pgTable("hero_slides", {
  id: text("id").primaryKey(),
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  href: text("href"),
  isForMobile: boolean("is_for_mobile").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull(),
})

export type HeroSlideRow = typeof heroSlides.$inferSelect
export type NewHeroSlideRow = typeof heroSlides.$inferInsert
