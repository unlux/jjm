import AboutUsTemplate from "@modules/about-us/templates"
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

  const canonicalPath = `/${countryCode}/about-us`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/about-us`)

  return {
    title: "About Us",
    description:
      "Learn about our mission to create fun learning activities that focus on skills beyond academics.",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "About Us",
      description:
        "Learn about our mission to create fun learning activities that focus on skills beyond academics.",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "About Us",
      description:
        "Learn about our mission to create fun learning activities that focus on skills beyond academics.",
    },
  }
}

export default function AboutUsPage() {
  return <AboutUsTemplate />
}
