"use client"

import { Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import React from "react"

import { useWishlist } from "@/lib/context/WishlistContext"
import { addToCart as serverAddToCart } from "@/lib/data/cart"

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
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            My Wishlist
          </h1>
          <p className="mt-3 text-lg text-white/80 md:text-xl">
            Items you&apos;ve saved for later
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-[#F6F7FB]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
          {isLoading ? (
            /* Skeleton grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-white/90 p-4 ring-1 ring-gray-100"
                >
                  <div className="h-60 w-full animate-pulse rounded-lg bg-gray-200" />
                  <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="mt-4 flex gap-2">
                    <div className="h-10 w-28 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-10 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            /* Empty state */
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl bg-white/90 p-10 text-center shadow-sm ring-1 ring-gray-100 backdrop-blur md:p-12">
                <div className="mb-6 flex justify-center">
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
                <h2 className="mb-2 text-3xl font-bold text-[#1e1e3f]">
                  Your wishlist is empty
                </h2>
                <p className="mb-8 text-lg text-gray-600">
                  Found something you like? Add it to your wishlist by clicking
                  the heart icon.
                </p>
                <LocalizedClientLink href="/store">
                  <Button
                    variant="primary"
                    className="inline-flex h-12 items-center gap-2 px-6 text-base"
                  >
                    Explore Products <ArrowRight size={16} />
                  </Button>
                </LocalizedClientLink>
              </div>
            </div>
          ) : (
            /* Wishlist grid */
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <LocalizedClientLink
                    href={item.url || `/products/${item.id}`}
                  >
                    <div className="relative h-60">
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      {item.discount && item.discount > 0 && (
                        <div className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white">
                          {item.discount}% OFF
                        </div>
                      )}
                    </div>
                  </LocalizedClientLink>
                  <div className="p-4">
                    <h3 className="mb-1 line-clamp-1 text-lg font-semibold text-[#1e1e3f] md:text-xl">
                      {item.name}
                    </h3>
                    {item.category && (
                      <p className="mb-2 line-clamp-1 text-base text-gray-500">
                        {item.category}
                      </p>
                    )}
                    {typeof item.price === "number" && (
                      <div className="mt-2 flex items-center gap-2">
                        {item.discount && item.discount > 0 ? (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.price)}
                            </span>
                            <span className="text-2xl font-bold text-[#181D4E]">
                              {formatPrice(
                                Math.round(
                                  item.price * (1 - (item.discount || 0) / 100)
                                )
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-[#181D4E]">
                            {formatPrice(item.price)}
                          </span>
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
                            className={
                              (isAdded
                                ? "border-green-500 text-green-600 "
                                : "") + "h-11 px-5 text-sm"
                            }
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
                        className="h-11 w-11 p-0 text-gray-400 hover:text-red-500"
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
