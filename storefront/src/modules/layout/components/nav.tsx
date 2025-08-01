"use client"
import { useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import {
  Menu,
  ShoppingCart,
  Heart,
  Search,
  User,
  X,
  Phone,
  Mail,
  ArrowRight,
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
              // Close when clicking outside the menu
              if (e.target === e.currentTarget) {
                setMobileMenuOpen(false)
              }
            }}
          >
            <div className="bg-white text-gray-800 h-full w-full max-w-xs md:max-w-md p-4 flex flex-col animate-slide-left">
              {/* Header with Logo and Close button */}
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
              {/* Mobile Search Input */}
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
              {/* Navigation links - in a scrollable container */}
              <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center">
                <div className="flex flex-col gap-2 mt-4 items-center">
                  <LocalizedClientLink
                    href="/"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/store"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Products
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/cart"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-2"
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
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors flex items-center gap-2"
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
                  <LocalizedClientLink
                    href="/partnership-program"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Preschool Partnership Program
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/account"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My account
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/about-us"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About Us
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/blogs"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blogs
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    href="/faq"
                    className="text-base font-semibold text-blue-900 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    FAQ
                  </LocalizedClientLink>
                </div>
              </div>
              {/* Contact info in the footer - always visible */}
              <div className="mt-8 mb-8 pt-6 border-t border-gray-100">
                <div className="flex flex-col items-start gap-4">
                  <span className="text-2xl font-bold text-blue-900">
                    +91 9321791644
                  </span>
                  <span className="text-xl font-semibold text-blue-900">
                    support@thejoyjunction.com
                  </span>
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
