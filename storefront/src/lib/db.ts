// Ensure this file is only ever executed server-side
import "server-only"

import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  // It's better to throw early on server during boot if DB is required
  // Routes that import this will surface a clear error
  throw new Error(
    "DATABASE_URL is not set. Please define it in your environment."
  )
}

export const pool = new Pool({ connectionString })
export const db = drizzle(pool)
