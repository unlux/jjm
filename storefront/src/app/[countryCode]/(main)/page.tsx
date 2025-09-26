import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Joy Junction",
  description: "The Joy Junction - A Sustainable and Eco-friendly Toy Store.",
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

  return <Hero region={region} />
}
