"use client"

import { HttpTypes } from "@medusajs/types"

import { track } from "@/lib/analytics"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"

export default function ProductClickLink({
  product,
  href,
  children,
  position,
  list_id,
}: {
  product: HttpTypes.StoreProduct
  href: string
  children: React.ReactNode
  position?: number
  list_id?: string
}) {
  return (
    <LocalizedClientLink
      href={href}
      onClick={() => {
        try {
          track("product_clicked", {
            product_id: product.id,
            handle: product.handle,
            title: product.title,
            category: product.collection_id,
            position,
            list_id,
          })
        } catch (_) {}
      }}
    >
      {children}
    </LocalizedClientLink>
  )
}
