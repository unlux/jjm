"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect } from "react"

import { track } from "@/lib/analytics"

export default function CheckoutStartedTrack({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}) {
  useEffect(() => {
    if (!cart?.id) return
    const itemCount =
      cart.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0
    if (itemCount <= 0) return
    track("checkout_started", {
      cart_id: cart.id,
      item_count: itemCount,
      cart_value: cart.total,
      currency: cart.currency_code,
      coupon: cart?.promotions?.[0]?.code,
      shipping_country: cart?.shipping_address?.country_code,
      delivery_method_selected: cart.shipping_methods?.[0]?.name,
      payment_method_selected:
        cart.payment_collection?.payment_sessions?.[0]?.provider_id,
      logged_in: Boolean(customer?.id),
    })
  }, [cart?.id])

  return null
}
