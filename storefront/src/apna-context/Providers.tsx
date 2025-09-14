"use client"

import React from "react"
import { WishlistProvider } from "./WishlistContext"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <WishlistProvider>{children}</WishlistProvider>
}
