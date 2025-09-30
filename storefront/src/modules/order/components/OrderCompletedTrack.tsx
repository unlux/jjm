"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"

import { track } from "@/lib/analytics"

export default function OrderCompletedTrack({
  order,
}: {
  order: HttpTypes.StoreOrder
}) {
  useEffect(() => {
    if (!order?.id) return
    const items = (order.items || []).map((it) => ({
      product_id: it.variant?.product_id,
      variant_id: it.variant_id,
      title: it.title,
      quantity: it.quantity,
      price: it.unit_price,
    }))
    track("order_completed", {
      order_id: order.id,
      revenue: order.total,
      subtotal: order.subtotal,
      tax: order.tax_total,
      shipping: order.shipping_total,
      discount: (order as any)?.discount_total,
      currency: order.currency_code,
      items,
      customer_id: order.customer_id,
      shipping_country: order.shipping_address?.country_code,
      delivery_method: order.shipping_methods?.[0]?.name,
    })
  }, [order?.id])

  return null
}
