"use client"

import posthog from "posthog-js"

// Event naming: lower_snake_case
export type AnalyticsEventName =
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "cart_quantity_updated"
  | "checkout_started"
  | "order_completed"
  | "product_clicked"

// Basic UTM + page context enrichment
function getPageContext() {
  if (typeof window === "undefined") return {}
  const url = new URL(window.location.href)

  // Current UTM
  const utm = {
    utm_source: url.searchParams.get("utm_source") || undefined,
    utm_medium: url.searchParams.get("utm_medium") || undefined,
    utm_campaign: url.searchParams.get("utm_campaign") || undefined,
    utm_term: url.searchParams.get("utm_term") || undefined,
    utm_content: url.searchParams.get("utm_content") || undefined,
  }

  // Persist initial UTM
  try {
    const LS_KEY = "ph_initial_utm"
    const existing = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null
    if (!existing) {
      const initial = {
        ...utm,
        initial_referrer: document.referrer || undefined,
        initial_landing_page: window.location.pathname,
      }
      localStorage.setItem(LS_KEY, JSON.stringify(initial))
    }
    const parsed = existing ? JSON.parse(existing) : {}
    return {
      page_path: window.location.pathname,
      page_title: document.title,
      referrer: document.referrer || undefined,
      ...utm,
      ...parsed,
    }
  } catch {
    return {
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      page_title: typeof document !== "undefined" ? document.title : undefined,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      ...utm,
    }
  }
}

export function track(name: AnalyticsEventName, props?: Record<string, any>) {
  try {
    posthog.capture(name, { ...getPageContext(), ...props })
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("[analytics.track] failed", e)
    }
  }
}

export function identify(id: string, traits?: Record<string, any>) {
  try {
    posthog.identify(id, traits)
  } catch {}
}

export function reset() {
  try {
    posthog.reset()
  } catch {}
}
