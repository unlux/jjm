"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
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
  Home,
  Store,
  Info,
  Newspaper,
  HelpCircle,
} from "lucide-react"
import Image from "next/image"
import { useWishlist } from "@/apna-context/WishlistContext" // Assuming this path is correct
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MarqueeLoader from "./MarqueeLoader"
import SearchOverlay from "@modules/search/components/search-overlay"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import { StoreCart } from "@medusajs/types"
import ShopCategoriesAccordion, {
  type Category as FooterCategory,
} from "../templates/footer/shop-categories-accordion"
import { sdk } from "@/lib/config"

// The Navbar now accepts the cart as a prop
const Navbar = ({
  cart,
}: {
  cart: Omit<StoreCart, "refundable_amount" | "refunded_total"> | null
}) => {
  const router = useRouter()
  const { wishlistCount } = useWishlist()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<FooterCategory[] | null>(null)
  const [isLoadingCats, setIsLoadingCats] = useState(false)

  const toggleBodyClass = (className: string, force?: boolean) => {
    document.body.classList.toggle(className, force)
  }

  const totalItems =
    cart?.items?.reduce(
      (acc: number, item: { quantity: number }) => acc + item.quantity,
      0
    ) || 0

  // Lazy-load categories when opening the sidebar
  useEffect(() => {
    if (!isMenuOpen || categories || isLoadingCats) return
    const load = async () => {
      try {
        setIsLoadingCats(true)
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
        setCategories(tops as FooterCategory[])
      } catch (e) {
        // no-op; keep menu working even if categories fail
      } finally {
        setIsLoadingCats(false)
      }
    }
    load()
  }, [isMenuOpen, categories, isLoadingCats])
  return (
    <>
      <MarqueeLoader />
      <nav id="main-nav" className="bg-[#181D4E] text-white">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between px-4 py-3 md:h-32">
          <div className="flex-1 flex justify-start">
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
          <div className="flex items-center space-x-6 relative">
            <LocalizedClientLink
              href="/"
              className="hover:text-blue-300 transition-colors font-semibold"
            >
              Home
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store"
              className="hover:text-blue-300 transition-colors font-semibold"
            >
              Store
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/customkit"
              className="hover:text-blue-300 transition-colors font-semibold"
            >
              Custom Kit
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/contact"
              className="hover:text-blue-300 transition-colors font-semibold"
            >
              Contact Us
            </LocalizedClientLink>
          </div>
          <div className="flex-1 flex justify-end items-center space-x-5">
            <CartDropdown cart={cart as StoreCart} />
            <LocalizedClientLink
              href="/wishlist"
              className="relative cursor-pointer hover:text-blue-300 transition-colors"
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
              onClick={() => toggleBodyClass("search-open", true)}
            >
              <Search size={22} />
            </div>
            <LocalizedClientLink href="/account">
              <div className="cursor-pointer hover:text-blue-300 transition-colors">
                <User size={22} />
              </div>
            </LocalizedClientLink>
            <div
              className="bg-white text-[#1E2A4A] rounded-full p-1.5 cursor-pointer hover:bg-blue-300 transition-colors"
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
          <div className="flex justify-center items-center gap-5 pb-4">
            <LocalizedClientLink
              href="/store"
              className="cursor-pointer hover:text-blue-300 transition-colors"
              aria-label="Shop"
            >
              <Store size={24} />
            </LocalizedClientLink>

            <button
              className="cursor-pointer hover:text-blue-300 transition-colors"
              aria-label="Search"
              onClick={() => toggleBodyClass("search-open", true)}
            >
              <Search size={24} />
            </button>

            <LocalizedClientLink
              href="/cart"
              className="relative cursor-pointer hover:text-blue-300 transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/wishlist"
              className="relative cursor-pointer hover:text-blue-300 transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </LocalizedClientLink>

            <LocalizedClientLink href="/account" aria-label="Account">
              <div className="cursor-pointer hover:text-blue-300 transition-colors">
                <User size={24} />
              </div>
            </LocalizedClientLink>

            <button
              className="bg-white text-[#1E2A4A] rounded-full p-1.5 cursor-pointer hover:bg-blue-300 transition-colors"
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
          className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 p-2 md:p-4 ${
            isMenuOpen
              ? "opacity-100 visible backdrop-blur-md bg-black/30"
              : "opacity-0 invisible"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsMenuOpen(false)
            }
          }}
        >
          <div
            className={`bg-white text-gray-800 h-full w-full max-w-sm flex flex-col min-h-0 shadow-2xl rounded-xl ring-1 ring-black/5 overflow-hidden transform transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header with Logo and Close button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <LocalizedClientLink href="/" className="block w-28">
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={100}
                  height={50}
                  className="w-full h-auto"
                />
              </LocalizedClientLink>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Navigation Content (scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 py-5 md:p-6">
              {/* Search */}
              <div
                className="w-full py-3 px-4 bg-gray-100 border-0 rounded-lg flex items-center cursor-pointer text-gray-600 hover:bg-gray-200 transition-colors"
                onClick={() => {
                  toggleBodyClass("search-open", true)
                  setIsMenuOpen(false)
                }}
              >
                <Search size={20} className="text-gray-500" />
                <span className="ml-3 text-sm md:text-base font-medium">
                  Search products...
                </span>
              </div>

              {/* Main Navigation */}
              <div className="mt-4 md:mt-6 flex flex-col gap-4 md:gap-4">
                <LocalizedClientLink
                  href="/"
                  className="text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2.5 md:gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={18} className="md:h-5 md:w-5" />
                  Home
                </LocalizedClientLink>
                {/* Replace Products link with flush accordion */}
                {categories && categories.length > 0 ? (
                  <ShopCategoriesAccordion
                    categories={categories}
                    appearance="light"
                    variant="list"
                    className="w-full"
                  />
                ) : (
                  <div className="text-xs md:text-sm text-gray-500">
                    {isLoadingCats ? "Loading..." : ""}
                  </div>
                )}
                <LocalizedClientLink
                  href="/cart"
                  className="text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2.5 md:gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart size={18} className="md:h-5 md:w-5" />
                  <span>Cart</span>
                  {totalItems > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-[10px] md:text-xs font-bold rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/wishlist"
                  className="text-base md:text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-2.5 md:gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={18} className="md:h-5 md:w-5" />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-pink-500 text-white text-[10px] md:text-xs font-bold rounded-full h-5 w-5 md:h-6 md:w-6 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </LocalizedClientLink>
              </div>

              {/* Divider */}
              <hr className="my-4 md:my-5 border-gray-200" />

              {/* Special Program */}
              <div className="relative inline-flex items-center justify-center my-2 md:my-2 group w-full">
                <div className="absolute inset-0 duration-1000 opacity-60 transition-all bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 rounded-xl blur-lg filter group-hover:opacity-100 group-hover:duration-200"></div>
                <LocalizedClientLink
                  href="/partnership-program"
                  className="group w-full relative inline-flex items-center justify-center text-sm md:text-base rounded-xl bg-white px-3.5 md:px-4 py-2 font-semibold text-blue-900 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:shadow-gray-600/30"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  Preschool Partnership Program
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 10 10"
                    height="10"
                    width="10"
                    fill="none"
                    className="mt-0.5 ml-2 -mr-1 stroke-blue-900 stroke-2"
                  >
                    <path
                      d="M0 5h7"
                      className="transition opacity-0 group-hover:opacity-100"
                    ></path>
                    <path
                      d="M1 1l4 4-4 4"
                      className="transition group-hover:translate-x-[3px]"
                    ></path>
                  </svg>
                </LocalizedClientLink>
              </div>

              {/* Secondary Navigation */}
              <div className="mt-6 md:mt-8 flex flex-col gap-4 md:gap-5">
                <LocalizedClientLink
                  href="/account"
                  className="text-sm md:text-base text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2.5 md:gap-3"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <User size={18} className="md:h-5 md:w-5" />
                  My Account
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/about-us"
                  className="text-sm md:text-base text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2.5 md:gap-3"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <Info size={18} className="md:h-5 md:w-5" />
                  About Us
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/blogs"
                  className="text-sm md:text-base text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2.5 md:gap-3"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <Newspaper size={18} className="md:h-5 md:w-5" />
                  Blogs
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/faq"
                  className="text-sm md:text-base text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2.5 md:gap-3"
                  onClick={() => toggleBodyClass("menu-open", false)}
                >
                  <HelpCircle size={18} className="md:h-5 md:w-5" />
                  FAQ
                </LocalizedClientLink>
              </div>
            </div>

            {/* Footer (pinned) */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col gap-3 text-center">
                <a
                  href="tel:+919321791644"
                  className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  <span>+91 9321791644</span>
                </a>
                <a
                  href="mailto:support@thejoyjunction.com"
                  className="text-base font-medium text-gray-800 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  <span>support@thejoyjunction.com</span>
                </a>
                <a
                  href="https://wa.me/919321791644"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-4 py-2 text-white font-semibold shadow-md transition-colors hover:bg-green-600"
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
