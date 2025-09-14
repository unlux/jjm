import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Link from "next/link"
import { listCategories } from "@lib/data/categories"
import ShopCategoriesAccordion from "./shop-categories-accordion"
import NewsletterForm from "./NewsletterForm"

export default async function Footer() {
  const productCategories = await listCategories()
  const topLevelCategories = (productCategories || []).filter(
    (c: any) => !c?.parent_category
  )

  return (
    <footer className="bg-[#181D4E] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Logo */}
        <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
          <Image
            src="/logo.png"
            alt="The Joy Junction"
            width={200}
            height={200}
          />
        </div>

        {/* Address */}
        <div>
          <h4 className="text-white font-semibold mb-2">Address</h4>
          <p className="text-gray-300">Jaipur, Rajasthan</p>
        </div>

        {/* Useful links */}
        <div>
          <h4 className="text-white font-semibold mb-2">Useful Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <LocalizedClientLink href="/">Home</LocalizedClientLink>
            </li>
            <li>
              <ShopCategoriesAccordion categories={topLevelCategories as any} />
            </li>
            <li>
              <LocalizedClientLink href="/customkit">
                Custom Kit
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/contact">
                Contact Us
              </LocalizedClientLink>
            </li>
          </ul>
        </div>

        {/* Other links */}
        <div>
          <h4 className="text-white font-semibold mb-2">Other Links</h4>
          <ul className="space-y-2 text-gray-300">
            <li>
              <LocalizedClientLink href="/privacy-policy">
                Privacy Policy
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/refund">
                Refund and Returns Policy
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/tnc">
                Terms and Condition
              </LocalizedClientLink>
            </li>
          </ul>
        </div>

        {/* Newsletter & Socials */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold mb-2">
            Subscribe to our newsletter
          </h4>
          <p className="text-gray-300 text-sm leading-5">
            for learning tips, product news and exclusive offers!
          </p>

          {/* Input */}
          <NewsletterForm />

          {/* Social Icons */}
          <div className="flex items-center space-x-4 mt-4">
            <Link href="https://facebook.com" target="_blank">
              <i className="fab fa-facebook text-xl" />
            </Link>
            <Link href="https://youtube.com" target="_blank">
              <i className="fab fa-youtube text-xl" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <i className="fab fa-instagram text-xl" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <i className="fab fa-linkedin text-xl" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-12 text-center text-sm text-gray-400">
        © 2024 The Joy Junction | A Venture of VYOM COMMERCE | Made with ♥
      </div>
    </footer>
  )
}
