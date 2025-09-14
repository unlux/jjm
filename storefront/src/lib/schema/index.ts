import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core"

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

// Hero slides schema
export const heroSlides = pgTable("hero_slides", {
  id: text("id").primaryKey(), // slug or uuid string
  src: text("src").notNull(),
  alt: text("alt").notNull(),
  href: text("href"),
  isForMobile: boolean("is_for_mobile").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  duration: integer("duration"), // seconds; optional
  createdAt: timestamp("created_at", { withTimezone: false }).notNull(),
})

export type HeroSlideRow = typeof heroSlides.$inferSelect
export type NewHeroSlideRow = typeof heroSlides.$inferInsert

// Testimonials schema
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  role: text("role"),
  image: text("image"),
  rating: integer("rating").notNull(), // 1-5
  isFeatured: boolean("is_featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: false }).notNull(),
})

export type TestimonialRow = typeof testimonials.$inferSelect
export type NewTestimonialRow = typeof testimonials.$inferInsert
