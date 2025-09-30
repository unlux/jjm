// components/TermsAndConditions.tsx
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
    .then(
      (regions) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )
    .catch(() => [countryCode])

  const canonicalPath = `/${countryCode}/tnc`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/tnc`)

  return {
    title: "Terms & Conditions",
    description: "Terms and conditions for using The Joy Junction website.",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "Terms & Conditions",
      description: "Terms and conditions for using The Joy Junction website.",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "Terms & Conditions",
      description: "Terms and conditions for using The Joy Junction website.",
    },
  }
}

const TermsAndConditions = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 text-gray-800">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Terms & Conditions
      </h1>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By using our website, you agree to be bound by these Terms and
          Conditions. If you do not agree, please do not use our services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">2. Use of Website</h2>
        <ul className="list-disc space-y-1 pl-6">
          <li>You must be at least 13 years old to use this site</li>
          <li>Do not misuse or attempt to hack our website</li>
          <li>All content is for personal use only</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">3. Product Information</h2>
        <p>
          We strive to ensure accurate product descriptions, but we do not
          guarantee that all information is error-free. Prices and availability
          are subject to change.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">4. Intellectual Property</h2>
        <p>
          All images, logos, and content on this site are the property of Joy
          Junction and may not be used without permission.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">
          5. Limitation of Liability
        </h2>
        <p>
          Joy Junction is not liable for any direct or indirect damages from
          using our website or products, including data loss or injury.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 text-xl font-semibold">6. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Any disputes will be
          subject to the jurisdiction of the courts of [Your City, India].
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">7. Contact</h2>
        <p>
          For any queries regarding these terms, please contact us at{" "}
          <a
            href="mailto:legal@joyjunction.com"
            className="text-blue-600 hover:underline"
          >
            legal@joyjunction.com
          </a>
        </p>
      </section>

      <p className="mt-10 text-center text-sm text-gray-500">
        Last updated: July 17, 2025
      </p>
    </div>
  )
}

export default TermsAndConditions
