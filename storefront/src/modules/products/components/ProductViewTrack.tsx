"use client"

import { useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { track } from "@/lib/analytics"

export default function ProductViewTrack({
  product,
  region,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}) {
  useEffect(() => {
    if (!product?.id) return
    const variantCount = product.variants?.length || 0
    track("product_view", {
      product_id: product.id,
      handle: product.handle,
      title: product.title,
      category: product.collection_id || undefined,
      collection_id: product.collection_id || undefined,
      currency: region?.currency_code,
      variant_count: variantCount,
      in_stock: product.variants?.some((v) => (v.manage_inventory ? (v.inventory_quantity || 0) > 0 : true)) ?? true,
      image_count: product.images?.length || 0,
      country_code: countryCode,
    })
  }, [product?.id])

  return null
}
