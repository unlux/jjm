import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listRegions } from "@lib/data/regions"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { Metadata } from "next"

import { buildHreflangMap } from "@/lib/seo/config"
import { WebsiteJsonLd } from "@/lib/seo/jsonld"

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

  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}`)
  const defaultCc = countryCodes.includes("us") ? "us" : countryCodes[0]
  if (defaultCc) {
    ;(languages as any)["x-default"] = `/${defaultCc}`
  }

  return {
    title: "The Joy Junction",
    description: "The Joy Junction - A Sustainable and Eco-friendly Toy Store.",
    alternates: {
      canonical: `/${countryCode}`,
      languages,
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <WebsiteJsonLd countryCode={countryCode} />
      <Hero region={region} />
    </>
  )
}
