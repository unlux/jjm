"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"

import { track } from "@/lib/analytics"

export default function ProductListViewTrack({
  products,
  list_id,
  page,
}: {
  products: HttpTypes.StoreProduct[]
  list_id?: string
  page?: number
}) {
  useEffect(() => {
    if (!products?.length) return
    track("product_view", {
      // This represents a list view; use a variant event name to avoid confusion
      event_scope: "list",
      list_id,
      page,
      product_ids: products.map((p) => p.id),
      count: products.length,
    })
  }, [list_id, page, products?.length])

  return null
}
