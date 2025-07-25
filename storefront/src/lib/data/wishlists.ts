"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"

// Type definitions based on API specs
export type WishlistItem = {
  id: string
  quantity: number
  productId: string
  productVariantId: string
  created_at: string
}

export type Wishlist = {
  id: string
  created_at: string
  items: WishlistItem[]
}

/**
 * Retrieves the customer's wishlist
 */
export const retrieveWishlist = async (): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!headers.authorization) {
    return null
  }

  const next = {
    ...(await getCacheOptions("wishlists")),
  }

  try {
    const { wishlist } = await sdk.client.fetch<{ wishlist: Wishlist }>(
      `/store/customers/me/wishlist`,
      {
        method: "GET",
        headers,
        next,
        cache: "force-cache",
      }
    )
    return wishlist
  } catch (error) {
    console.error("Error retrieving wishlist:", error)
    return null
  }
}

/**
 * Add an item to the wishlist
 */
export const addWishlistItem = async (
  productId: string,
  productVariantId: string,
  quantity: number = 1
): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!headers.authorization) {
    return null
  }

  try {
    const response = await sdk.client.fetch<Wishlist>(
      `/store/customers/me/wishlist/items`,
      {
        method: "POST",
        headers,
        body: {
          productId,
          productVariantId,
          quantity,
        },
      }
    )

    const wishlistCacheTag = await getCacheTag("wishlists")
    revalidateTag(wishlistCacheTag)

    return response
  } catch (error) {
    console.error("Error adding wishlist item:", error)
    return null
  }
}

/**
 * Remove an item from the wishlist
 */
export const removeWishlistItem = async (
  productId: string,
  productVariantId: string
): Promise<Wishlist | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!headers.authorization) {
    return null
  }

  try {
    const response = await sdk.client.fetch<Wishlist>(
      `/store/customers/me/wishlist/items/${productId}/${productVariantId}`,
      {
        method: "DELETE",
        headers,
      }
    )

    const wishlistCacheTag = await getCacheTag("wishlists")
    revalidateTag(wishlistCacheTag)

    return response
  } catch (error) {
    console.error("Error removing wishlist item:", error)
    return null
  }
}

/**
 * Get a sharing token for the wishlist
 */
export const getWishlistShareToken = async (): Promise<string | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!headers.authorization) {
    return null
  }

  try {
    const { shared_token } = await sdk.client.fetch<{ shared_token: string }>(
      `/store/customers/me/wishlist/share-token`,
      {
        method: "POST",
        headers,
      }
    )
    return shared_token
  } catch (error) {
    console.error("Error getting wishlist share token:", error)
    return null
  }
}

/**
 * Retrieve a shared wishlist using a token
 */
export const retrieveSharedWishlist = async (
  token: string
): Promise<Wishlist | null> => {
  try {
    const { wishlist } = await sdk.client.fetch<{ wishlist: Wishlist }>(
      `/store/wishlists/${token}`,
      {
        method: "GET",
      }
    )
    return wishlist
  } catch (error) {
    console.error("Error retrieving shared wishlist:", error)
    return null
  }
}
