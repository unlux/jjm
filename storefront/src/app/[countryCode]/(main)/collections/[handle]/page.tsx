import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { StoreCollection, StoreRegion } from "@medusajs/types"
import CollectionTemplate from "@modules/collections/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { buildHreflangMap } from "@/lib/seo/config"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/lib/seo/jsonld"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<{
    page?: string
    sortBy?: SortOptions
  }>
}

export const PRODUCT_LIMIT = 12

export async function generateStaticParams() {
  const { collections } = await listCollections({
    fields: "*products",
  })

  if (!collections) {
    return []
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  )

  const collectionHandles = collections.map(
    (collection: StoreCollection) => collection.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string) =>
      collectionHandles.map((handle: string | undefined) => ({
        countryCode,
        handle,
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const countryCodes = await listRegions().then(
    (regions: StoreRegion[]) =>
      regions
        ?.map((r) => r.countries?.map((c) => c.iso_2))
        .flat()
        .filter(Boolean) as string[]
  ).catch(() => [params.countryCode])

  const canonicalPath = `/${params.countryCode}/collections/${params.handle}`
  const languages = buildHreflangMap(
    countryCodes,
    (cc) => `/${cc}/collections/${params.handle}`
  )

  const metadata: Metadata = {
    title: collection.title,
    description: `${collection.title} collection`,
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: collection.title,
      description: `${collection.title} collection`,
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: collection.title,
      description: `${collection.title} collection`,
    },
  }

  return metadata
}

export default async function CollectionPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const collection = await getCollectionByHandle(params.handle).then(
    (collection: StoreCollection) => collection
  )

  if (!collection) {
    notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `/${params.countryCode}` },
          { name: "Collections", url: `/${params.countryCode}/collections` },
          {
            name: collection.title,
            url: `/${params.countryCode}/collections/${params.handle}`,
          },
        ]}
      />
      {Array.isArray(collection.products) && collection.products.length > 0 && (
        <ItemListJsonLd
          items={(collection.products as any[])
            .filter((p: any) => p?.handle)
            .map((p: any) => ({
              name: p.title || p.handle,
              url: `/${params.countryCode}/products/${p.handle}`,
            }))}
        />
      )}
      <CollectionTemplate
        collection={collection}
        page={page}
        sortBy={sortBy}
        countryCode={params.countryCode}
      />
    </>
  )
}
