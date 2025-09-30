import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import Link from "next/link"

import NewsletterForm from "./NewsletterForm"
import ShopCategoriesAccordion from "./shop-categories-accordion"

export default async function Footer() {
  const productCategories = await listCategories()
  const topLevelCategories = (productCategories || []).filter(
    (c: any) => !c?.parent_category
  )

  return (
    <footer className="bg-[#181D4E] px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-5">
        {/* Logo */}
        <div className="col-span-1 flex flex-col items-center md:col-span-1 md:items-start">
          <Image
            src="/logo.png"
            alt="The Joy Junction"
            width={200}
            height={200}
          />
        </div>

        {/* Address */}
        <div>
          <h4 className="mb-2 font-semibold text-white">Address</h4>
          <p className="text-gray-300">Jaipur, Rajasthan</p>
        </div>

        {/* Useful links */}
        <div>
          <h4 className="mb-2 font-semibold text-white">Useful Links</h4>
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
          <h4 className="mb-2 font-semibold text-white">Other Links</h4>
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
          <h4 className="mb-2 font-semibold text-white">
            Subscribe to our newsletter
          </h4>
          <p className="text-sm leading-5 text-gray-300">
            for learning tips, product news and exclusive offers!
          </p>

          {/* Input */}
          <NewsletterForm />

          {/* Social Icons */}
          <div className="mt-4 flex items-center space-x-4">
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
