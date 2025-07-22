"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  StarHalf,
  Check,
  MinusCircle,
  PlusCircle,
  Loader2,
} from "lucide-react"
import { useCart } from "../../context/CartContext"
import { useWishlist } from "../../context/WishlistContext"
import {
  getProductById,
  getProductPrice,
  getProductDiscount,
  getProductCategory,
  getProductAgeGroup,
  getProducts,
} from "../../lib/products"
import { Product } from "../../lib/sdk"

// Define a local ProductData type that matches our UI needs
type ProductData = {
  id: string
  name: string
  price: number
  discount: number
  category: string
  ageGroup: string
  image: string
  images: string[]
  description: string
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [similarProducts, setSimilarProducts] = useState<ProductData[]>([])

  // Formatted product data for our UI
  const [productData, setProductData] = useState<ProductData>({
    id: "",
    name: "",
    price: 0,
    discount: 0,
    category: "",
    ageGroup: "",
    image: "",
    images: [],
    description: "",
  })

  useEffect(() => {
    async function loadProduct() {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        // Get the product from Medusa
        const medusaProduct = await getProductById(String(id))

        if (medusaProduct) {
          // Format the product data for our UI
          // Type assertion to make TypeScript happy - Medusa returns PricedProduct type
          const discount = getProductDiscount(medusaProduct as any)
          const category = getProductCategory(medusaProduct as any)
          const ageGroup = getProductAgeGroup(medusaProduct as any)

          // Handle the case when images might not be included due to expand parameter removal
          let mainImage = "/placeholder.jpg" // Default placeholder
          if (medusaProduct.thumbnail) {
            mainImage = medusaProduct.thumbnail
          } else if (
            medusaProduct.images &&
            medusaProduct.images.length > 0 &&
            medusaProduct.images[0].url
          ) {
            mainImage = medusaProduct.images[0].url
          }
          // Handle the case when images might not be included in the API response
          let imageList: string[] = [mainImage]
          if (
            medusaProduct.images &&
            Array.isArray(medusaProduct.images) &&
            medusaProduct.images.length > 0
          ) {
            const validImages = medusaProduct.images
              .filter((img) => img && img.url)
              .map((img) => img.url)

            if (validImages.length > 0) {
              imageList = validImages
            }
          }

          // Try to extract price data with proper logging
          let price = 0
          if (medusaProduct.variants && medusaProduct.variants.length > 0) {
            const variant = medusaProduct.variants[0]
            if (variant.prices && variant.prices.length > 0) {
              price = variant.prices[0].amount || 0
              console.log("Found variant price:", price)
            } else {
              console.log("No prices found in variant:", variant)
            }
          } else {
            console.log("No variants found for product:", medusaProduct.id)
          }

          // Extract description or use a default
          const description =
            medusaProduct.description ||
            `The ${medusaProduct.title} is a perfect toy for children. This high-quality toy helps develop fine motor skills, problem-solving abilities, and creative thinking. Made from safe, durable materials, it provides hours of fun and educational play.`

          // Set the formatted product data
          setProductData({
            id: medusaProduct.id || "",
            name: medusaProduct.title || "",
            price,
            discount,
            category,
            ageGroup,
            image: mainImage,
            images: imageList,
            description,
          })

          // Load similar products in the same category
          loadSimilarProducts(category)
        }
      } catch (err) {
        console.error("Error loading product:", err)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    // Helper function to load similar products
    async function loadSimilarProducts(category: string) {
      try {
        const response = await getProducts({
          limit: 4,
          category_id: undefined, // We'll filter by category name after getting results
        })

        if (response && response.products) {
          // Convert Medusa products to our UI product format
          const formattedProducts = response.products
            .filter(
              (p) =>
                // Filter to only include products in the same category
                getProductCategory(p as any) === category &&
                // Exclude the current product
                p.id !== String(id)
            )
            .map((p) => {
              const discount = getProductDiscount(p as any)

              // Handle the case when images might not be included in the API response
              let mainImage = "/placeholder.jpg" // Default placeholder
              if (p.thumbnail) {
                mainImage = p.thumbnail
              } else if (p.images && p.images.length > 0 && p.images[0].url) {
                mainImage = p.images[0].url
              }

              // Handle case when variants/prices might not be included in the response
              let price = 0
              if (
                p.variants &&
                p.variants.length > 0 &&
                p.variants[0].prices &&
                p.variants[0].prices.length > 0
              ) {
                price = p.variants[0].prices[0].amount || 0
                console.log("Similar product price:", p.title, price)
              } else {
                console.log("No price found for similar product:", p.title)
              }

              return {
                id: p.id || "",
                name: p.title || "",
                price,
                discount,
                category: getProductCategory(p as any),
                ageGroup: getProductAgeGroup(p as any),
                image: mainImage,
                images:
                  p.images && Array.isArray(p.images) && p.images.length > 0
                    ? p.images
                        .filter((img) => img && img.url)
                        .map((img) => img.url)
                    : [mainImage],
                description: p.description || "",
              }
            })
            .slice(0, 4) // Limit to 4 similar products

          setSimilarProducts(formattedProducts)
        }
      } catch (err) {
        console.error("Error loading similar products:", err)
      }
    }

    loadProduct()
  }, [id])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
          <h1 className="text-2xl font-bold text-[#1e1e3f] mb-2">
            Loading Product...
          </h1>
          <p className="text-gray-600">
            Please wait while we fetch the product details.
          </p>
        </div>
      </div>
    )
  }

  // If there was an error or product not found, show a message
  if (error || !productData.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <h1 className="text-3xl font-bold text-[#1e1e3f] mb-4">
            {error ? "Error" : "Product Not Found"}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Sorry, we couldn't find the product you're looking for."}
          </p>
          <LocalizedClientLink
            href="/store"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            View All Products
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  // Check if product is in wishlist
  const isLiked = isInWishlist(parseInt(productData.id))

  // Handle wishlist toggle
  const handleToggleWishlist = () => {
    if (isLiked) {
      removeFromWishlist(parseInt(productData.id))
    } else {
      // Convert our UI product back to the format expected by addToWishlist
      const wishlistProduct = {
        id: parseInt(productData.id),
        name: productData.name,
        category: productData.category,
        ageGroup: productData.ageGroup,
        price: productData.price,
        discount: productData.discount,
        image: productData.image,
      }
      addToWishlist(wishlistProduct)
    }
  }

  // Calculate the discounted price
  const originalPrice = productData.price
  const discountedPrice =
    productData.discount > 0
      ? Math.round(originalPrice * (1 - productData.discount / 100))
      : originalPrice

  // Format price to rupees (₹)
  const formatPrice = (price: number) => {
    // If price is 0 or invalid, show N/A
    if (!price) return "N/A"

    // Divide by 100 because prices are stored in cents in Medusa
    return `₹${(price / 100).toFixed(2)}`
  }

  // Handle adding to cart
  const handleAddToCart = () => {
    // Convert our UI product back to the format expected by addToCart
    const cartProduct = {
      id: parseInt(productData.id),
      name: productData.name,
      category: productData.category,
      ageGroup: productData.ageGroup,
      price: productData.price,
      discount: productData.discount,
      image: productData.image,
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(cartProduct)
    }

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  // Handle quantity change
  const increaseQuantity = () => setQuantity((q) => q + 1)
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1))

  return (
    <div className="bg-[#f9f9f9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <LocalizedClientLink href="/" className="hover:text-[#262b5f]">
              Home
            </LocalizedClientLink>
            <span className="mx-2">/</span>
            <LocalizedClientLink href="/store" className="hover:text-[#262b5f]">
              Products
            </LocalizedClientLink>
            <span className="mx-2">/</span>
            <LocalizedClientLink
              href={`/products?category=${productData.category}`}
              className="hover:text-[#262b5f]"
            >
              {productData.category}
            </LocalizedClientLink>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {productData.name}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="relative h-[400px] mb-4 rounded-lg overflow-hidden">
                <Image
                  src={productData.images[selectedImage] || productData.image}
                  alt={productData.name}
                  fill
                  className="object-cover"
                />
                {productData.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-md">
                    {productData.discount}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex space-x-3">
                {productData.images.length > 0 ? (
                  productData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`relative w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer ${
                        selectedImage === idx
                          ? "border-[#262b5f]"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <Image
                        src={img}
                        alt={`${productData.name} view ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border-2 cursor-pointer border-[#262b5f]">
                    <Image
                      src={productData.image}
                      alt={productData.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6 md:p-8 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {productData.ageGroup}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  {productData.category}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 font-baloo">
                {productData.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <StarHalf size={18} fill="currentColor" />
                </div>
                <span className="text-sm text-gray-600">4.5 (24 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {originalPrice > 0 ? (
                  productData.discount > 0 ? (
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(discountedPrice)}
                      </span>
                      <span className="ml-2 text-xl line-through font-medium text-gray-500">
                        {formatPrice(originalPrice)}
                      </span>
                      <span className="ml-2 text-sm text-red-600 font-medium">
                        Save {productData.discount}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(originalPrice)}
                    </span>
                  )
                ) : (
                  <span className="text-3xl font-bold text-gray-900">N/A</span>
                )}

                <p className="text-sm text-green-600 mt-1">
                  ✓ In stock and ready to ship
                </p>
              </div>

              {/* Product Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{productData.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <Check size={16} className="mr-2 text-green-600" />
                    Age-appropriate for {productData.ageGroup} years
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check size={16} className="mr-2 text-green-600" />
                    Helps develop fine motor skills
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check size={16} className="mr-2 text-green-600" />
                    Safe, non-toxic materials
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Check size={16} className="mr-2 text-green-600" />
                    Durable construction for long-lasting play
                  </li>
                </ul>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="text-gray-500 hover:text-gray-600"
                    aria-label="Decrease quantity"
                  >
                    <MinusCircle size={24} />
                  </button>
                  <span className="mx-4 text-xl w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="text-gray-500 hover:text-gray-600"
                    aria-label="Increase quantity"
                  >
                    <PlusCircle size={24} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-grow py-3 px-8 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-all ${
                    addedToCart
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-[#262b5f] hover:bg-opacity-90"
                  }`}
                >
                  <ShoppingCart size={18} />
                  {addedToCart ? "Added to Cart" : "Add to Cart"}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`py-3 px-4 rounded-lg border flex items-center justify-center transition-colors ${
                    isLiked
                      ? "bg-red-500 text-white border-red-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label={
                    isLiked ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button
                  className="py-3 px-4 rounded-lg border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50"
                  aria-label="Share product"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Free shipping notice */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-4h4a1 1 0 001-1v-4a1 1 0 00-.293-.707L14 3.293A1 1 0 0013.707 3H4a1 1 0 00-1 1z" />
                  </svg>
                  Free shipping on orders over ₹1,000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 font-baloo">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((prod) => {
                const isProdLiked = isInWishlist(parseInt(prod.id || "0"))

                const handleSimilarProductWishlist = (e: React.MouseEvent) => {
                  e.preventDefault() // Prevent navigation
                  if (isProdLiked) {
                    removeFromWishlist(parseInt(prod.id || "0"))
                  } else {
                    // Convert to the format expected by addToWishlist
                    const wishlistProduct = {
                      id: parseInt(prod.id),
                      name: prod.name,
                      category: prod.category,
                      ageGroup: prod.ageGroup,
                      price: prod.price,
                      discount: prod.discount,
                      image: prod.image,
                    }
                    addToWishlist(wishlistProduct)
                  }
                }

                const handleSimilarProductAddToCart = (e: React.MouseEvent) => {
                  e.preventDefault() // Prevent navigation
                  // Convert to the format expected by addToCart
                  const cartProduct = {
                    id: parseInt(prod.id),
                    name: prod.name,
                    category: prod.category,
                    ageGroup: prod.ageGroup,
                    price: prod.price,
                    discount: prod.discount,
                    image: prod.image,
                  }
                  addToCart(cartProduct)
                }

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group relative"
                  >
                    <LocalizedClientLink href={`/products/${prod.id}`}>
                      <div className="h-48 relative">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                        {prod.discount > 0 && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {prod.discount}% OFF
                          </div>
                        )}

                        <div className="absolute inset-0 backdrop-blur-0 group-hover:backdrop-blur-sm bg-white/0 group-hover:bg-white/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <button
                              onClick={handleSimilarProductAddToCart}
                              className="bg-white p-2 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                              aria-label="Add to cart"
                            >
                              <ShoppingCart size={18} />
                            </button>
                            <button
                              onClick={handleSimilarProductWishlist}
                              className={`${
                                isProdLiked
                                  ? "bg-red-500 text-white"
                                  : "bg-white hover:bg-red-500 hover:text-white"
                              } p-2 rounded-full transition-colors`}
                              aria-label={
                                isProdLiked
                                  ? "Remove from wishlist"
                                  : "Add to wishlist"
                              }
                            >
                              <Heart
                                size={18}
                                fill={isProdLiked ? "currentColor" : "none"}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-[#1e1e3f] line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {prod.category}
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            {prod.price > 0 ? (
                              prod.discount > 0 ? (
                                <div className="flex items-baseline">
                                  <span className="font-semibold text-[#262b5f]">
                                    {formatPrice(
                                      Math.round(
                                        prod.price * (1 - prod.discount / 100)
                                      )
                                    )}
                                  </span>
                                  <span className="text-xs text-gray-500 line-through ml-1">
                                    {formatPrice(prod.price)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-semibold text-[#262b5f]">
                                  {formatPrice(prod.price)}
                                </span>
                              )
                            ) : (
                              <span className="font-semibold text-[#262b5f]">
                                N/A
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </LocalizedClientLink>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
