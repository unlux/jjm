// components/PartnershipProgram.tsx
// Server component: static content only
export const dynamic = "force-static"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Clock, Megaphone, Pencil, ShoppingBag } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"

import { listRegions } from "@/lib/data/regions"
import { buildHreflangMap } from "@/lib/seo/config"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const countryCodes = await listRegions()
    .then(
      (regions) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )
    .catch(() => [countryCode])

  const canonicalPath = `/${countryCode}/partnership-program`
  const languages = buildHreflangMap(
    countryCodes,
    (cc) => `/${cc}/partnership-program`
  )

  return {
    title: "Preschool Partnership Program",
    description:
      "Special pricing and exclusive benefits for preschools and educational institutions",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "Preschool Partnership Program",
      description:
        "Special pricing and exclusive benefits for preschools and educational institutions",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "Preschool Partnership Program",
      description:
        "Special pricing and exclusive benefits for preschools and educational institutions",
    },
  }
}

export default function PartnershipProgramPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div className="relative h-[400px] overflow-hidden rounded-lg shadow-lg">
            <Image
              src="/partner-pic.jpg"
              alt="Children doing creative activities"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Preschool Partnership Program
            </h1>

            <p className="text-lg text-gray-700">
              Welcome to our Preschool Partnership Program! We understand the
              importance of providing high-quality, educational activities to
              young learners. That&apos;s why we offer{" "}
              <span className="font-medium">special pricing</span> and{" "}
              <span className="font-medium">exclusive benefits</span> to
              preschools.
            </p>

            <div className="pt-4">
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                Special Pricing
              </h2>
              <p className="text-gray-700">
                – As a valued partner, preschools receive significant discounts
                on bulk orders. Our pricing is designed to make it affordable
                for educational institutions to provide the best toys for their
                students. Contact us for a custom quote tailored to your needs.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                Exclusive Products
              </h2>
              <p className="text-gray-700">
                – We offer a range of toys specifically selected for educational
                purposes. We specialize in flash card-based learning.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-gray-800">
                Benefits
              </h2>
              <p className="text-gray-700">
                – Partnering with us comes with numerous benefits:
              </p>
            </div>
          </div>
        </div>

        {/* Benefits cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
            <div className="mb-4 rounded-full bg-blue-50 p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Free shipping on orders over a certain amount
            </h3>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
            <div className="mb-4 rounded-full bg-blue-50 p-3">
              <Pencil className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Customizable orders to suit your curriculum needs
            </h3>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
            <div className="mb-4 rounded-full bg-blue-50 p-3">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Priority access to new products
            </h3>
          </div>

          <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md">
            <div className="mb-4 rounded-full bg-blue-50 p-3">
              <Megaphone className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Special promotions
            </h3>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 rounded-lg bg-blue-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Ready to Join Our Partnership Program?
          </h2>
          <p className="mb-6 text-lg text-gray-700">
            Contact us today to learn more about how your preschool can benefit
            from our partnership program.
          </p>
          <LocalizedClientLink
            href="/contact"
            className="inline-block rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get in Touch
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
