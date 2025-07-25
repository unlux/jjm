"use client"

import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heart, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { useWishlist } from "../../../../apna-context/WishlistContext"
import { useCart } from "../../../../apna-context/CartContext"
import Image from "next/image"
import { toast } from "react-hot-toast"

type ClientProductPreviewProps = {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  price: {
    calculated_price: string
    original_price?: string
    price_type?: "sale" | "default"
    percentage_diff?: string
  }
}

export default function ClientProductPreview({
  product,
  isFeatured,
  price,
}: ClientProductPreviewProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } =
    useWishlist()
  const { addToCart } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Convert product ID to number for compatibility with our custom wishlist
  const productId = parseInt(product.id || "0")
  const isLiked = isInWishlist(productId)

  // Debug: Log wishlist items when component mounts or wishlist changes
  useEffect(() => {
    console.log("Client Preview - Wishlist items:", wishlistItems)
    console.log("Client Preview - Current product ID:", productId)
    console.log("Client Preview - Is product in wishlist:", isLiked)
  }, [wishlistItems, productId, isLiked])

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Stop event bubbling

    console.log(
      "Client Preview - Toggle wishlist clicked for product:",
      productId
    )
    console.log("Client Preview - Is product currently in wishlist:", isLiked)

    if (isLiked) {
      console.log("Client Preview - Removing from wishlist:", productId)
      removeFromWishlist(productId)
      toast.success(`Product removed from wishlist!`)
    } else {
      // Convert to the format expected by addToWishlist
      const wishlistProduct = {
        id: productId,
        name: product.title || "",
        category: product.collection?.title || "Unknown",
        ageGroup: "All", // Default value
        price: parseInt(price.calculated_price.replace(/[^0-9.-]+/g, "")) * 100, // Convert to cents
        discount: price.percentage_diff ? parseInt(price.percentage_diff) : 0,
        image: product.thumbnail || "/images/products/sample-product.txt",
      }
      console.log("Client Preview - Adding to wishlist:", wishlistProduct)
      addToWishlist(wishlistProduct)
      toast.success(`Product added to wishlist!`)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Stop event bubbling

    setIsAddingToCart(true)

    try {
      // Convert to the format expected by addToCart
      const cartProduct = {
        id: productId,
        name: product.title || "",
        category: product.collection?.title || "Unknown",
        ageGroup: "All", // Default value
        price: parseInt(price.calculated_price.replace(/[^0-9.-]+/g, "")) * 100, // Convert to cents
        discount: price.percentage_diff ? parseInt(price.percentage_diff) : 0,
        image: product.thumbnail || "/images/products/sample-product.txt",
      }

      addToCart(cartProduct)
      toast.success(`Added to cart!`)
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast.error("Failed to add to cart")
    } finally {
      setTimeout(() => setIsAddingToCart(false), 1500)
    }
  }

  return (
    <div className="group relative">
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="block"
      >
        <div data-testid="product-wrapper">
          <div className="relative aspect-[9/16] w-full overflow-hidden bg-ui-bg-subtle rounded-lg">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title || "Product image"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}

            {/* Hover actions */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={handleAddToCart}
                className={`p-2 rounded-full ${
                  isAddingToCart
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-800 hover:bg-blue-500 hover:text-white"
                } transition-colors`}
                aria-label="Add to cart"
              >
                <ShoppingCart size={18} />
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-2 rounded-full ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-800 hover:bg-red-500 hover:text-white"
                } transition-colors`}
                aria-label={
                  isLiked ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Sale badge */}
            {price.price_type === "sale" && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                {price.percentage_diff}% OFF
              </div>
            )}
          </div>

          <div className="flex flex-col mt-4">
            <Text
              className="text-ui-fg-subtle line-clamp-1"
              data-testid="product-title"
            >
              {product.title}
            </Text>
            <div className="flex items-center gap-x-2 mt-1">
              {price.price_type === "sale" ? (
                <div className="flex items-center gap-x-2">
                  <Text className="text-ui-fg-muted line-through text-sm">
                    {price.original_price}
                  </Text>
                  <Text className="text-ui-fg-interactive font-semibold">
                    {price.calculated_price}
                  </Text>
                </div>
              ) : (
                <Text className="text-ui-fg-base">
                  {price.calculated_price}
                </Text>
              )}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </div>
  )
}
