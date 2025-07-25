"use client"

import { Product } from "../apna-data/products"
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react"
import {
  retrieveWishlist,
  addWishlistItem,
  removeWishlistItem,
  Wishlist as ApiWishlist,
  WishlistItem as ApiWishlistItem,
} from "@lib/data/wishlists"

// Define the shape of our context
interface WishlistContextType {
  wishlistItems: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: number) => void
  isInWishlist: (productId: number) => boolean
  wishlistCount: number
  clearWishlist: () => void
  shareWishlist: () => Promise<string | null>
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
  shareWishlist: async () => null,
  isLoading: false,
})

// Custom hook to use the wishlist context
export const useWishlist = () => useContext(WishlistContext)

// Provider component
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  // State to hold the wishlist items
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { retrieveCustomer } = await import("@lib/data/customer")
        const customer = await retrieveCustomer()
        setIsLoggedIn(!!customer)
        console.log("WishlistContext - User logged in:", !!customer)
      } catch (error) {
        console.error("Error checking login status:", error)
        setIsLoggedIn(false)
      }
    }

    checkLoginStatus()
  }, [])

  // Total number of items in wishlist
  const wishlistCount = wishlistItems.length

  // Check if product is in wishlist
  const isInWishlist = (productId: number) => {
    console.log(
      "WishlistContext - Checking if product is in wishlist:",
      productId
    )
    console.log("WishlistContext - Current wishlist items:", wishlistItems)
    const isInList = wishlistItems.some((item) => item.id === productId)
    console.log("WishlistContext - Is product in wishlist:", isInList)
    return isInList
  }

  // Function to convert API wishlist items to the format our app expects
  const convertApiToUiWishlist = (
    apiWishlist: ApiWishlist | null
  ): Product[] => {
    if (!apiWishlist || !apiWishlist.items) return []

    // Extract the necessary information from the API wishlist items
    return apiWishlist.items.map((item) => {
      // This is a simplified mapping - in a real-world scenario you might need to fetch more product details
      return {
        id: parseInt(item.productId),
        name: `Product ${item.productId}`, // This is a placeholder
        category: "Unknown", // This is a placeholder
        ageGroup: "All", // This is a placeholder
        price: 0, // This is a placeholder
        discount: 0, // This is a placeholder
        image: "/images/products/sample-product.txt", // This is a placeholder
        quantity: item.quantity,
      }
    })
  }

  // Load wishlist from API if logged in, or localStorage if not
  useEffect(() => {
    const loadWishlist = async () => {
      setIsLoading(true)

      if (isLoggedIn) {
        // Try to load from API if logged in
        try {
          const apiWishlist = await retrieveWishlist()
          console.log("WishlistContext - API wishlist:", apiWishlist)
          if (apiWishlist) {
            // TODO: In a real implementation, we'd need to fetch full product details
            // for each item in the wishlist
            const convertedItems = convertApiToUiWishlist(apiWishlist)
            console.log("WishlistContext - Converted items:", convertedItems)
            setWishlistItems(convertedItems)
          }
        } catch (error) {
          console.error("Failed to load wishlist from API:", error)

          // Fall back to localStorage if API fails
          if (typeof window !== "undefined") {
            const savedWishlist = localStorage.getItem("wishlist")
            if (savedWishlist) {
              const parsedItems = JSON.parse(savedWishlist)
              console.log(
                "WishlistContext - Loaded from localStorage:",
                parsedItems
              )
              setWishlistItems(parsedItems)
            }
          }
        }
      } else {
        // Load from localStorage if not logged in
        if (typeof window !== "undefined") {
          const savedWishlist = localStorage.getItem("wishlist")
          if (savedWishlist) {
            const parsedItems = JSON.parse(savedWishlist)
            console.log(
              "WishlistContext - Loaded from localStorage:",
              parsedItems
            )
            setWishlistItems(parsedItems)
          }
        }
      }

      setIsLoading(false)
    }

    loadWishlist()
  }, [isLoggedIn])

  // Update localStorage when wishlist changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("WishlistContext - Saving to localStorage:", wishlistItems)
      localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems])

  // Add a product to the wishlist
  const addToWishlist = async (product: Product) => {
    console.log("WishlistContext - Adding to wishlist:", product)

    // Check if the product is already in the wishlist
    if (wishlistItems.some((item) => item.id === product.id)) {
      console.log("WishlistContext - Product already in wishlist")
      return // Don't add duplicates
    }

    if (isLoggedIn) {
      try {
        // Add to API if logged in
        const result = await addWishlistItem(
          product.id.toString(),
          product.id.toString(), // Using product ID as variant ID since we don't have variant info
          1
        )

        if (result) {
          // Update local state with new wishlist
          // In a real app, we'd fetch product details for each item
          console.log("WishlistContext - Added to API, updating local state")
          setWishlistItems((prev) => [...prev, product])
        }
      } catch (error) {
        console.error("Failed to add item to wishlist:", error)
      }
    } else {
      // Add to local state only if not logged in
      console.log("WishlistContext - Not logged in, updating local state only")
      setWishlistItems((prev) => [...prev, product])
    }
  }

  // Remove an item from the wishlist
  const removeFromWishlist = async (productId: number) => {
    console.log("WishlistContext - Removing from wishlist:", productId)

    if (isLoggedIn) {
      try {
        // Remove from API if logged in
        await removeWishlistItem(
          productId.toString(),
          productId.toString() // Using product ID as variant ID
        )
        console.log("WishlistContext - Removed from API")
      } catch (error) {
        console.error("Failed to remove item from wishlist:", error)
      }
    }

    // Always update local state
    console.log("WishlistContext - Updating local state after removal")
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
  }

  // Clear the entire wishlist
  const clearWishlist = () => {
    // Note: API doesn't have a clear wishlist endpoint, so we'd need to remove items one by one
    console.log("WishlistContext - Clearing wishlist")
    setWishlistItems([])
  }

  // Share wishlist (get a token for sharing)
  const shareWishlist = async (): Promise<string | null> => {
    if (!isLoggedIn) {
      console.error("User must be logged in to share wishlist")
      return null
    }

    try {
      const { getWishlistShareToken } = await import("@lib/data/wishlists")
      return await getWishlistShareToken()
    } catch (error) {
      console.error("Failed to get wishlist share token:", error)
      return null
    }
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
        shareWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
