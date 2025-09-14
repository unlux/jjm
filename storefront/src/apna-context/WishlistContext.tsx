"use client"

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react"

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
    setWishlistItems((prev) => {
      // Check if the product is already in the wishlist
      if (prev.some((item) => item.id === product.id)) {
        return prev // Don't add duplicates
      } else {
        // Add the new product
        return [...prev, product]
      }
    })
  }

  // Remove an item from the wishlist
  const removeFromWishlist = (productId: string | number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
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
