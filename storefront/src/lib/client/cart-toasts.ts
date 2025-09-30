"use client"

import { toast } from "sonner"

import { addToCart, deleteLineItem } from "@/lib/data/cart"

export async function addToCartWithToast(params: {
  variantId: string
  quantity: number
  countryCode: string
  productTitle?: string
}): Promise<boolean> {
  const { variantId, quantity, countryCode, productTitle } = params

  try {
    await addToCart({ variantId, quantity, countryCode })

    const emojis = ["🧸", "🎉", "🎈", "✨", "🚀", "🦄"]
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]

    toast.success(`${emoji} Added to cart!`, {
      description: productTitle
        ? `${productTitle} is now in your cart.`
        : undefined,
      action: {
        label: "View cart",
        onClick: () => {
          try {
            const target = countryCode ? `/${countryCode}/cart` : "/cart"
            window.location.href = target
          } catch {
            window.location.href = "/cart"
          }
        },
      },
      duration: 2200,
    })

    return true
  } catch (e) {
    toast.error("Uh‑oh! The toy cart got stuck 😅", {
      description: "Couldn't add to cart. Please try again.",
    })
    return false
  }
}

export async function deleteLineItemWithToast(
  lineId: string
): Promise<boolean> {
  try {
    await deleteLineItem(lineId)
    const emojis = ["🧹", "🗑️", "✨", "🎈"]
    const emoji = emojis[Math.floor(Math.random() * emojis.length)]
    toast.success(`${emoji} Removed from cart`, {
      duration: 1800,
    })
    return true
  } catch (e) {
    toast.error("Couldn't remove item", {
      description: "Please try again.",
    })
    return false
  }
}
