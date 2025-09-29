// components/RefundPolicy.tsx
// Server component: static content only
export const dynamic = "force-static"
import type { Metadata } from "next"
import { listRegions } from "@/lib/data/regions"
import { buildHreflangMap } from "@/lib/seo/config"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const countryCodes = await listRegions()
    .then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat().filter(Boolean) as string[]
    )
    .catch(() => [countryCode])

  const canonicalPath = `/${countryCode}/refund`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/refund`)

  return {
    title: "Refund & Returns Policy",
    description: "Refund and returns policy for The Joy Junction.",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "Refund & Returns Policy",
      description: "Refund and returns policy for The Joy Junction.",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "Refund & Returns Policy",
      description: "Refund and returns policy for The Joy Junction.",
    },
  }
}

const RefundPolicy = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-gray-800">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Refund & Returns Policy
      </h1>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">1. Return Window</h2>
        <p>
          You can request a return within <strong>7 days of delivery</strong>{" "}
          for most items if they are unused and in original packaging.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">
          2. Eligibility for Returns
        </h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>Product must be unused and in original condition</li>
          <li>Must include all original tags, labels, and accessories</li>
          <li>Proof of purchase (order ID or receipt) is required</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">3. Non-returnable Items</h2>
        <p>
          Items like personalized toys, gift cards, or clearance-sale items are
          non-returnable unless defective or damaged.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">4. Refund Process</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Once we receive and inspect the item, we’ll notify you via email
          </li>
          <li>
            If approved, refund will be issued to your original payment method
            within 5-7 business days
          </li>
          <li>
            Shipping charges are non-refundable unless the item is defective or
            damaged
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">5. Contact</h2>
        <p>
          For return-related issues, contact us at{" "}
          <a
            href="mailto:support@joyjunction.com"
            className="text-blue-600 hover:underline"
          >
            support@joyjunction.com
          </a>
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-gray-500">
        Last updated: July 17, 2025
      </p>
    </div>
  )
}

export default RefundPolicy
