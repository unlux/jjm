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

  const canonicalPath = `/${countryCode}/contact`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/contact`)

  return {
    title: "Contact",
    description: "Get in touch with The Joy Junction.",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "Contact",
      description: "Get in touch with The Joy Junction.",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "Contact",
      description: "Get in touch with The Joy Junction.",
    },
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
