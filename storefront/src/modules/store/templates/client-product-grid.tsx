"use client"

import { HttpTypes } from "@medusajs/types"
import ClientProductPreview from "@modules/products/components/product-preview/client-product-preview"
import { getProductPrice } from "@lib/util/get-product-price"
import { useWishlist } from "../../../apna-context/WishlistContext"
import { useEffect } from "react"

type ClientProductGridProps = {
  products: HttpTypes.StoreProduct[]
}

export default function ClientProductGrid({
  products,
}: ClientProductGridProps) {
  const { wishlistItems } = useWishlist()

  // Debug: Log wishlist items when component mounts or wishlist changes
  useEffect(() => {
    console.log("ClientProductGrid - Wishlist items:", wishlistItems)
  }, [wishlistItems])

  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
      data-testid="products-list"
    >
      {products.map((product) => {
        const { cheapestPrice } = getProductPrice({
          product,
        })

        console.log(`ClientProductGrid - Rendering product: ${product.id}`)

        return (
          <li key={product.id}>
            <ClientProductPreview
              product={product}
              price={
                cheapestPrice || {
                  calculated_price: "N/A",
                  price_type: "default",
                }
              }
            />
          </li>
        )
      })}
    </ul>
  )
}
