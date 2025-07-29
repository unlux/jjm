"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import {
  Menu,
  Heart,
  Search,
  User,
  X,
  Phone,
  Mail,
  ArrowRight,
  ShoppingCart,
} from "lucide-react"
import Image from "next/image"
import { useWishlist } from "@/apna-context/WishlistContext" // Assuming this path is correct
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Marquee from "./Marquee"
import SearchOverlay from "@modules/search/components/search-overlay"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import { Cart } from "@medusajs/medusa"

// The Navbar now accepts the cart as a prop
const Navbar = ({
  cart,
}: {
  cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null
}) => {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { wishlistCount } = useWishlist()

  // state for mobile search
  const [mobileSearchTerm, setMobileSearchTerm] = useState("")
  const handleMobileSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (mobileSearchTerm.trim()) {
      router.push(
        `/store?search=${encodeURIComponent(mobileSearchTerm.trim())}`
      )
      setMobileMenuOpen(false)
      setMobileSearchTerm("")
    }
  }

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <>
      <Marquee />
      <nav className="bg-[#1E2A4A] text-white p-4 flex items-center justify-between">
        <LocalizedClientLink href="/">
          <Image src="/logo.png" alt="logo" width={100} height={50} />
        </LocalizedClientLink>

        <div className="hidden md:flex items-center space-x-6 relative ">
          <LocalizedClientLink
            href="/"
            className="hover:text-blue-300 transition-colors"
          >
            Home
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/store"
            className="hover:text-blue-300 transition-colors"
          >
            Store
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/customkit"
            className="hover:text-blue-300 transition-colors"
          >
            Custom Kit
          </LocalizedClientLink>

          <LocalizedClientLink
            href="/contact"
            className="hover:text-blue-300 transition-colors"
          >
            Contact Us
          </LocalizedClientLink>
        </div>

        <div className="flex items-center space-x-5">
          {/* Replaced the simple cart link with the CartDropdown component */}
          <div className="hidden sm:block">
            <CartDropdown cart={cart} />
          </div>

          <LocalizedClientLink
            href="/wishlist"
            className="hidden sm:block relative cursor-pointer hover:text-blue-300 transition-colors"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </LocalizedClientLink>
          <div
            className="cursor-pointer hover:text-blue-300 transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={22} />
          </div>
          <LocalizedClientLink href="/account">
            <div className="hidden sm:block cursor-pointer hover:text-blue-300 transition-colors">
              <User size={22} />
            </div>
          </LocalizedClientLink>

          <div
            className="bg-white text-[#1E2A4A] rounded-full p-1.5 cursor-pointer hover:bg-blue-300 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </div>
        </div>

        <SearchOverlay
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 backdrop-blur-md bg-white/30 z-50 flex justify-end transition-all duration-300"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <div className="bg-white text-gray-800 h-full w-full max-w-xs md:max-w-md p-4 flex flex-col animate-slide-left">
              {/* ... existing mobile menu header ... */}
              <div className="flex justify-between items-center mb-4">
                <Image src="/logo.png" alt="logo" width={100} height={50} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-700" />
                </button>
              </div>

              {/* ... existing mobile search ... */}
              <div className="mb-4">
                <form onSubmit={handleMobileSearch} className="relative">
                  <input
                    type="text"
                    value={mobileSearchTerm}
                    onChange={(e) => setMobileSearchTerm(e.target.value)}
                    placeholder="Search products..."
                    className="w-full py-2 px-4 pl-10 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#262b5f] text-white p-1.5 rounded-md"
                  >
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-4">
                  {/* ... existing mobile nav links ... */}
                  <LocalizedClientLink
                    href="/"
                    className="block text-base font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </LocalizedClientLink>

                  <LocalizedClientLink
                    href="/store"
                    className="block text-base font-medium hover:text-blue-600 transition-colors py-2 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </LocalizedClientLink>

                  {/* ... other links ... */}

                  <div className="flex justify-between pt-2">
                    {/* Mobile cart link now uses totalItems from the cart prop */}
                    <LocalizedClientLink
                      href="/cart"
                      className="flex items-center gap-1 text-base font-medium hover:text-blue-600 transition-colors py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingCart size={16} />
                      <span>Cart</span>
                      {totalItems > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </LocalizedClientLink>

                    <LocalizedClientLink
                      href="/wishlist"
                      className="flex items-center gap-1 text-base font-medium hover:text-blue-600 transition-colors py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart size={16} />
                      <span>Wishlist</span>
                      {wishlistCount > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>

              {/* ... existing mobile menu footer ... */}
              <div className="mt-4 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Phone size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Call us</p>
                      <p className="text-sm font-medium">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium">
                        hello@thejoyjunction.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
