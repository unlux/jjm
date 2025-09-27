import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core"

export const affiliateCoupons = pgTable("affiliate_coupons", {
  code: text("code").primaryKey(),
  timesUsed: integer("times_used").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
