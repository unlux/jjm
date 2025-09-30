"use client"
import { StoreCart } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import SearchOverlay from "@modules/search/components/search-overlay"
import {
  Heart,
  HelpCircle,
  Home,
  Info,
  Mail,
  Menu,
  Newspaper,
  Phone,
  Search,
  ShoppingCart,
  Store,
  User,
  X,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

import { sdk } from "@/lib/config"
import { useWishlist } from "@/lib/context/WishlistContext"

import ShopCategoriesAccordion, {
  type Category as FooterCategory,
} from "../templates/footer/shop-categories-accordion"

// The Navbar now accepts the cart as a prop
const Navbar = ({
  cart,
}: {
  cart: Omit<StoreCart, "refundable_amount" | "refunded_total"> | null
}) => {
  const { wishlistCount } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<FooterCategory[] | null>(null)

  const toggleBodyClass = (className: string, force?: boolean) => {
    document.body.classList.toggle(className, force)
  }

  const totalItems =
    cart?.items?.reduce(
      (acc: number, item: { quantity: number }) => acc + item.quantity,
      0
    ) || 0

  // Fetch categories on mount (eagerly), not tied to opening the sidebar
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const { product_categories } = await sdk.client.fetch<{
          product_categories: any[]
        }>("/store/product-categories", {
          method: "GET",
          query: {
            limit: 100,
            fields: "id,name,handle,parent_category,category_children",
          },
        })
        const tops = (product_categories || []).filter(
          (c: any) => !c?.parent_category
        )
        if (!cancelled) setCategories(tops as FooterCategory[])
      } catch (e) {
        // no-op; keep menu working even if categories fail
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  // Render
  return (
    <>
      <nav id="main-nav" className="bg-[#181D4E] text-white">
        {/* Desktop Layout */}
        <div className="hidden items-center justify-between px-4 py-3 md:flex md:h-32">
          <div className="flex flex-1 justify-start">
            <LocalizedClientLink href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={150}
                height={150}
                priority
                className="h-24 w-auto object-contain"
              />
            </LocalizedClientLink>
          </div>
          <div className="relative flex items-center space-x-6">
            <LocalizedClientLink
              href="/"
              className="font-semibold transition-colors hover:text-blue-300"
            >
              Home
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="font-semibold transition-colors hover:text-blue-300"
            >
              Store
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/customkit"
              className="font-semibold transition-colors hover:text-blue-300"
            >
              Custom Kit
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="font-semibold transition-colors hover:text-blue-300"
            >
              Contact Us
            </LocalizedClientLink>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-5">
            <CartDropdown cart={cart as StoreCart} />
            <LocalizedClientLink
              href="/wishlist"
              className="relative cursor-pointer transition-colors hover:text-blue-300"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </LocalizedClientLink>
            <div
              className="cursor-pointer transition-colors hover:text-blue-300"
              onClick={() => toggleBodyClass("search-open", true)}
            >
              <Search size={22} />
            </div>
            <LocalizedClientLink href="/account">
              <div className="cursor-pointer transition-colors hover:text-blue-300">
                <User size={22} />
              </div>
            </LocalizedClientLink>
            <div
              className="cursor-pointer rounded-full bg-white p-1.5 text-[#1E2A4A] transition-colors hover:bg-blue-300"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={20} />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Logo centered at top */}
          <div className="flex justify-center px-4 py-6">
            <LocalizedClientLink href="/">
              <Image
                src="/logo.png"
                alt="logo"
                width={180}
                height={120}
                priority
                className="h-24 w-auto object-contain"
              />
            </LocalizedClientLink>
          </div>

          {/* Navigation icons: Shop, Search, Cart, Wishlist, Account, Sidebar */}
          <div className="flex items-center justify-center gap-5 pb-4">
            <LocalizedClientLink
              href="/store"
              className="cursor-pointer transition-colors hover:text-blue-300"
              aria-label="Shop"
            >
              <Store size={24} />
            </LocalizedClientLink>

            <button
              className="cursor-pointer transition-colors hover:text-blue-300"
              aria-label="Search"
              onClick={() => toggleBodyClass("search-open", true)}
            >
              <Search size={24} />
            </button>

            <LocalizedClientLink
              href="/cart"
              className="relative cursor-pointer transition-colors hover:text-blue-300"
              aria-label="Cart"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/wishlist"
              className="relative cursor-pointer transition-colors hover:text-blue-300"
              aria-label="Wishlist"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
                  {wishlistCount}
                </span>
              )}
            </LocalizedClientLink>

            <LocalizedClientLink href="/account" aria-label="Account">
              <div className="cursor-pointer transition-colors hover:text-blue-300">
                <User size={24} />
              </div>
            </LocalizedClientLink>

            <button
              className="cursor-pointer rounded-full bg-white p-1.5 text-[#1E2A4A] transition-colors hover:bg-blue-300"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        <SearchOverlay onClose={() => toggleBodyClass("search-open", false)} />
        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 z-50 flex justify-end p-2 transition-all duration-300 md:p-4 ${
            isMenuOpen
              ? "visible bg-black/30 opacity-100 backdrop-blur-md"
              : "invisible opacity-0"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMenuOpen(false)
            }
          }}
        >
          <div
            className={`flex h-full min-h-0 w-full max-w-sm transform flex-col overflow-hidden rounded-xl bg-white text-gray-800 shadow-2xl ring-1 ring-black/5 transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header with Logo and Close button */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <LocalizedClientLink href="/" className="block w-28">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={100}
                  height={50}
                  className="h-auto w-full"
                />
              </LocalizedClientLink>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
                aria-label="Close menu"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Navigation Content (scrollable) */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5 md:p-6">
              {/* Search */}
              <div
                className="flex w-full cursor-pointer items-center rounded-lg border-0 bg-gray-100 px-4 py-3 text-gray-600 transition-colors hover:bg-gray-200"
                onClick={() => {
                  toggleBodyClass("search-open", true)
                  setIsMenuOpen(false)
                }}
              >
                <Search size={20} className="text-gray-500" />
                <span className="ml-3 text-sm font-medium md:text-base">
                  Search products...
                </span>
              </div>

              {/* Main Navigation */}
              <div className="mt-4 flex flex-col gap-4 md:mt-6 md:gap-4">
                <LocalizedClientLink
                  href="/"
                  className="flex items-center gap-2.5 text-base font-semibold text-gray-800 transition-colors hover:text-blue-600 md:gap-3 md:text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={18} className="md:h-5 md:w-5" />
                  Home
                </LocalizedClientLink>
                {/* Categories accordion (fetched on mount, rendered when ready) */}
                {categories && categories.length > 0 ? (
                  <ShopCategoriesAccordion
                    categories={categories}
                    appearance="light"
                    variant="list"
                    className="w-full"
                  />
                ) : (
                  <div className="text-xs text-gray-500 md:text-sm"></div>
                )}
                <LocalizedClientLink
                  href="/cart"
                  className="flex items-center gap-2.5 text-base font-semibold text-gray-800 transition-colors hover:text-blue-600 md:gap-3 md:text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart size={18} className="md:h-5 md:w-5" />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white md:h-6 md:w-6 md:text-xs">
                      {totalItems}
                    </span>
                  )}
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/wishlist"
                  className="flex items-center gap-2.5 text-base font-semibold text-gray-800 transition-colors hover:text-blue-600 md:gap-3 md:text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={18} className="md:h-5 md:w-5" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white md:h-6 md:w-6 md:text-xs">
                      {wishlistCount}
                    </span>
                  )}
                </LocalizedClientLink>
              </div>

              {/* Divider */}
              <hr className="my-4 border-gray-200 md:my-5" />

              {/* Special Program */}
              <div className="group relative my-2 inline-flex w-full items-center justify-center md:my-2">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 opacity-60 blur-lg filter transition-all duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
                <LocalizedClientLink
                  href="/partnership-program"
                  className="group relative inline-flex w-full items-center justify-center rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-blue-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-600/30 md:px-4 md:text-base"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  Preschool Partnership Program
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="10"
                    width="10"
                    fill="none"
                    className="-mr-1 ml-2 mt-0.5 stroke-blue-900 stroke-2"
                  >
                    <path
                      d="M0 5h7"
                      className="opacity-0 transition group-hover:opacity-100"
                    ></path>
                    <path
                      d="M1 1l4 4-4 4"
                      className="transition group-hover:translate-x-[3px]"
                    ></path>
                  </svg>
                </LocalizedClientLink>
              </div>

              {/* Secondary Navigation */}
              <div className="mt-6 flex flex-col gap-4 md:mt-8 md:gap-5">
                <LocalizedClientLink
                  href="/account"
                  className="flex items-center gap-2.5 text-sm text-gray-700 transition-colors hover:text-blue-600 md:gap-3 md:text-base"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <User size={18} className="md:h-5 md:w-5" />
                  My Account
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/about-us"
                  className="flex items-center gap-2.5 text-sm text-gray-700 transition-colors hover:text-blue-600 md:gap-3 md:text-base"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <Info size={18} className="md:h-5 md:w-5" />
                  About Us
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/blogs"
                  className="flex items-center gap-2.5 text-sm text-gray-700 transition-colors hover:text-blue-600 md:gap-3 md:text-base"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <Newspaper size={18} className="md:h-5 md:w-5" />
                  Blogs
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/faq"
                  className="flex items-center gap-2.5 text-sm text-gray-700 transition-colors hover:text-blue-600 md:gap-3 md:text-base"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <HelpCircle size={18} className="md:h-5 md:w-5" />
                  FAQ
                </LocalizedClientLink>
              </div>
            </div>

            {/* Footer (pinned) */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex flex-col gap-3 text-center">
                <a
                  href="tel:+919321791644"
                  className="flex items-center justify-center gap-2 text-base font-medium text-gray-800 transition-colors hover:text-blue-600"
                >
                  <Phone size={18} />
                  <span>+91 9321791644</span>
                </a>
                <a
                  href="mailto:support@thejoyjunction.com"
                  className="flex items-center justify-center gap-2 text-base font-medium text-gray-800 transition-colors hover:text-blue-600"
                >
                  <Mail size={18} />
                  <span>support@thejoyjunction.com</span>
                </a>
                <a
                  href="https://wa.me/919321791644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-2 font-semibold text-white shadow-md transition-colors hover:bg-green-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.479 5.422 5.57-.924zM12.001 5.805c-.136 0-.273.009-.409.026l-.003.001c-3.313.216-5.955 3.058-5.952 6.379.002 3.522 2.87 6.39 6.392 6.39.001 0 .002 0 .003 0h.001c.353 0 .701-.034 1.043-.101l.003-.001c.317-.062.627-.145.923-.25.295-.104.581-.227.857-.371.277-.144.542-.31.792-.497.25-.187.484-.395.698-.623.216-.227.415-.472.595-.734.18-.262.342-.54.484-.831s.261-.597.354-.907c.093-.31.16-.626.202-.945.042-.319.061-.641.061-.965.002-3.522-2.87-6.39-6.392-6.39z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
export default Navbar
