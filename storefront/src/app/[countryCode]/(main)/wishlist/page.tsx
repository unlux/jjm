"use client"

import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@medusajs/ui"
import { useWishlist } from "../../../../apna-context/WishlistContext"
import { addToCart as serverAddToCart } from "@/lib/data/cart"
import { useParams, useRouter } from "next/navigation"

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isLoading } = useWishlist()
  const params = useParams()
  const router = useRouter()
  const countryCode = params.countryCode as string
  const [itemStates, setItemStates] = React.useState<
    Record<string, "idle" | "adding" | "added">
  >({})

  // Format price to rupees (₹)
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toFixed(2)}`
  }

  const handleAddToCart = async (productId: number) => {
    const product = wishlistItems.find((item) => item.id === productId)
    if (!product) return

    // If we don't know the variant, send user to product page to select
    if (!product.variantId) {
      const to = product.url || `/products/${product.id}`
      router.push(to)
      return
    }

    const key = String(productId)
    setItemStates((prev) => ({ ...prev, [key]: "adding" }))
    try {
      await serverAddToCart({
        variantId: product.variantId,
        quantity: 1,
        countryCode,
      })
      // Show 'added' state briefly before removal
      setItemStates((prev) => ({ ...prev, [key]: "added" }))
      setTimeout(() => {
        removeFromWishlist(productId)
        setItemStates((prev) => {
          const next = { ...prev }
          delete next[key]
          return next
        })
      }, 1200)
    } finally {
      // no-op; state handled above
    }
  }

  return (
    <div className="flex flex-col">
      {/* Branded header */}
      <div className="bg-[#181D4E] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">My Wishlist</h1>
          <p className="mt-3 text-white/80 text-lg md:text-xl">Items you've saved for later</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#F6F7FB] w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
          {isLoading ? (
            /* Skeleton grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="rounded-xl bg-white/90 ring-1 ring-gray-100 p-4">
                  <div className="h-60 w-full bg-gray-200 animate-pulse rounded-lg" />
                  <div className="mt-4 h-5 w-3/4 bg-gray-200 animate-pulse rounded" />
                  <div className="mt-2 h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-10 w-28 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 w-10 bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl bg-white/90 backdrop-blur shadow-sm ring-1 ring-gray-100 p-10 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#1e1e3f] mb-2">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-8 text-lg">Found something you like? Add it to your wishlist by clicking the heart icon.</p>
                <LocalizedClientLink href="/store">
                  <Button variant="primary" className="inline-flex items-center gap-2 h-12 px-6 text-base">
                    Explore Products <ArrowRight size={16} />
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          ) : (
            /* Wishlist grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl shadow-sm ring-1 ring-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <LocalizedClientLink href={item.url || `/products/${item.id}`}>
                    <div className="h-60 relative">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {item.discount && item.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                          {item.discount}% OFF
                        </div>
                      )}
                    </div>
                  </LocalizedClientLink>
                  <div className="p-4">
                    <h3 className="font-semibold text-[#1e1e3f] mb-1 line-clamp-1 text-lg md:text-xl">{item.name}</h3>
                    {item.category && (
                      <p className="text-base text-gray-500 mb-2 line-clamp-1">{item.category}</p>
                    )}
                    {typeof item.price === "number" && (
                      <div className="flex items-center gap-2 mt-2">
                        {item.discount && item.discount > 0 ? (
                          <>
                            <span className="text-sm text-gray-500 line-through">{formatPrice(item.price)}</span>
                            <span className="text-2xl font-bold text-[#181D4E]">
                              {formatPrice(Math.round(item.price * (1 - (item.discount || 0) / 100)))}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-[#181D4E]">{formatPrice(item.price)}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-5 flex items-center gap-3">
                      {(() => {
                        const state = itemStates[String(item.id)] ?? "idle"
                        const isAdding = state === "adding"
                        const isAdded = state === "added"
                        return (
                          <Button
                            onClick={() => handleAddToCart(item.id as number)}
                            variant={isAdded ? "secondary" : "primary"}
                            className={(isAdded ? "border-green-500 text-green-600 " : "") + "h-11 px-5 text-sm"}
                            aria-label="Add to cart"
                            isLoading={isAdding}
                            disabled={isAdding}
                          >
                            {isAdded ? (
                              "Added!"
                            ) : isAdding ? (
                              "Adding..."
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <ShoppingCart size={14} />
                                Add
                              </span>
                            )}
                          </Button>
                        )
                      })()}
                      <Button
                        onClick={() => removeFromWishlist(item.id)}
                        variant="transparent"
                        className="text-gray-400 hover:text-red-500 h-11 w-11 p-0"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
