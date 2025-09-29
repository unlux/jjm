import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { buildHreflangMap } from "@/lib/seo/config"
import { BreadcrumbJsonLd, ItemListJsonLd } from "@/lib/seo/jsonld"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)

    const title = productCategory.name
    const description =
      productCategory.description ?? `${title} category.`

    const countryCodes = await listRegions()
      .then((regions: StoreRegion[]) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
      )
      .catch(() => [params.countryCode])

    const canonicalPath = `/${params.countryCode}/categories/${params.category.join("/")}`
    const languages = buildHreflangMap(
      countryCodes,
      (cc) => `/${cc}/categories/${params.category.join("/")}`
    )

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
        languages,
      },
      openGraph: {
        title,
        description,
        url: canonicalPath,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `/${params.countryCode}` },
          { name: "Categories", url: `/${params.countryCode}/categories` },
          {
            name: productCategory.name,
            url: `/${params.countryCode}/categories/${params.category.join("/")}`,
          },
        ]}
      />
      {Array.isArray(productCategory.products) && productCategory.products.length > 0 && (
        <ItemListJsonLd
          items={productCategory.products
            .filter((p: any) => p?.handle)
            .map((p: any) => ({
              name: p.title || p.handle,
              url: `/${params.countryCode}/products/${p.handle}`,
            }))}
        />
      )}
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
