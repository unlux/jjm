import type { SubscriberArgs } from "@medusajs/framework"

// Simple throttle/cooldown to avoid spamming the storefront during bursts
const WINDOW_MS = parseInt(process.env.REVALIDATE_COOLDOWN_MS || "7000", 10)
let lastRun = 0
let scheduled: NodeJS.Timeout | null = null

async function callStorefrontRevalidate() {
  const base = process.env.STOREFRONT_URL || process.env.NEXT_PUBLIC_BASE_URL
  if (!base) {
    console.warn("[subscriber:revalidate-products] Missing STOREFRONT_URL")
    return
  }
  const secret = process.env.REVALIDATE_SECRET || ""
  const url = `${base.replace(/\/$/, "")}/api/revalidate?tag=products`
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: secret ? { "x-revalidate-secret": secret } : undefined,
    })
    if (!res.ok) {
      console.warn(
        `[subscriber:revalidate-products] Revalidate failed: ${res.status}`
      )
    }
  } catch (e) {
    console.error("[subscriber:revalidate-products] Revalidate error", e)
  }
}

export async function revalidateProductsWithCooldown(_args?: SubscriberArgs) {
  const now = Date.now()
  const delta = now - lastRun
  if (delta >= WINDOW_MS && !scheduled) {
    // Run immediately
    lastRun = now
    await callStorefrontRevalidate()
    return
  }

  // Schedule a trailing call if not already scheduled
  if (!scheduled) {
    const wait = Math.max(WINDOW_MS - delta, 0)
    scheduled = setTimeout(async () => {
      scheduled = null
      lastRun = Date.now()
      await callStorefrontRevalidate()
    }, wait)
  }
}
