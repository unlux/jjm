"use client"

import { use, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import posthog from "posthog-js"

export default function IdentifyUser({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) {
  useEffect(() => {
    if (!customer?.id) return
    try {
      posthog.identify(customer.id, {
        email: customer.email,
        first_name: (customer as any).first_name,
        last_name: (customer as any).last_name,
      })
    } catch {}
  }, [customer?.id])

  return null
}
