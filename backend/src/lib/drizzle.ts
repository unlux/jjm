import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../db/schema"

const connectionString = process.env.DRIZZLE_DATABASE_URL ?? process.env.DATABASE_URL

if (!connectionString) {
  // We don't throw to keep build-time happy; runtime operations will fail if DB isn't configured
  // eslint-disable-next-line no-console
  console.warn("[drizzle] DRIZZLE_DATABASE_URL (or DATABASE_URL) is not set. Database operations will fail.")
}

export const pool = new Pool({
  connectionString,
})

export const db = drizzle(pool, { schema })

export type DB = typeof db
export { schema }
