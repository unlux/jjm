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

  const canonicalPath = `/${countryCode}/customkit`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/customkit`)

  return {
    title: "Custom Learning Kits",
    description:
      "Create personalized game-based learning kits tailored to your child's interests.",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "Custom Learning Kits",
      description:
        "Create personalized game-based learning kits tailored to your child's interests.",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "Custom Learning Kits",
      description:
        "Create personalized game-based learning kits tailored to your child's interests.",
    },
  }
}

export default function CustomkitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
