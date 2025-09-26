"use client"

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react"
import { toast } from "sonner"

// Lightweight item stored in wishlist (compatible across pages)
export type WishlistItem = {
  id: string | number
  name: string
  image?: string
  category?: string
  price?: number
  discount?: number
  url?: string // canonical product URL (e.g. /products/<handle>)
  variantId?: string // selected variant to enable add-to-cart from wishlist
}

// Define the shape of our context
interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (productId: string | number) => void
  isInWishlist: (productId: string | number) => boolean
  wishlistCount: number
  clearWishlist: () => void
  isLoading: boolean
}

// Create the context with a default value
const WishlistContext = createContext<WishlistContextType>({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  wishlistCount: 0,
  clearWishlist: () => {},
  isLoading: true,
})

// Custom hook to use the wishlist context
export const useWishlist = () => useContext(WishlistContext)

// Provider component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the wishlist items
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Total number of items in wishlist
  const wishlistCount = wishlistItems.length

  // Check if product is in wishlist
  const isInWishlist = (productId: string | number) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        try {
          const parsed = JSON.parse(savedWishlist)
          setWishlistItems(parsed)
        } catch {
          // ignore parse errors
        }
      }
      setIsLoading(false)
    }
  }, [])

  // Update localStorage when wishlist changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems])

  // Add a product to the wishlist
  const addToWishlist = (product: WishlistItem) => {
    // Compute next state first to avoid side-effects inside setState updater (StrictMode)
    const exists = wishlistItems.some((item) => item.id === product.id)
    if (exists) {
      try {
        toast("Already in wishlist", {
          description: `${product.name} is already on your wishlist.`,
          duration: 1500,
        })
      } catch {}
      return
    }

    const next = [...wishlistItems, product]
    setWishlistItems(next)

    try {
      const emojis = ["💖", "🧸", "⭐", "🎈", "✨", "🎁"]
      const emoji = emojis[Math.floor(Math.random() * emojis.length)]
      toast.success(`${emoji} Added to wishlist!`, {
        description: `${product.name} is now on your wishlist.`,
        action: {
          label: "View wishlist",
          onClick: () => {
            try {
              const path = window.location?.pathname || "/"
              const seg = path.split("/")[1]
              const target =
                seg && seg.length <= 5 ? `/${seg}/wishlist` : "/wishlist"
              window.location.href = target
            } catch {
              window.location.href = "/wishlist"
            }
          },
        },
        duration: 2200,
      })
    } catch {}
  }

  // Remove an item from the wishlist
  const removeFromWishlist = (productId: string | number) => {
    // Compute next state first
    const removed = wishlistItems.find((i) => i.id === productId)
    const next = wishlistItems.filter((item) => item.id !== productId)
    setWishlistItems(next)

    try {
      toast("Removed from wishlist", {
        description: removed?.name
          ? `${removed.name} was removed from your wishlist.`
          : "Item removed from your wishlist.",
        duration: 1600,
      })
    } catch {}
  }

  // Clear the entire wishlist
  const clearWishlist = () => {
    setWishlistItems([])
  }

  // Provide the wishlist context
  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
        clearWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
