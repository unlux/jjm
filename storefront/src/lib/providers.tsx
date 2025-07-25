"use client"

import { ReactNode } from "react"
import { CartProvider } from "../apna-context/CartContext"
import { WishlistProvider } from "../apna-context/WishlistContext"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  )
}
