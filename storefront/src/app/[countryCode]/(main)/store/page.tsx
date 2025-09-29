import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { Metadata } from "next"
import { redirect } from "next/navigation"

import { listCategories } from "@/lib/data/categories"
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

  const canonicalPath = `/${countryCode}/store`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/store`)

  return {
    title: "Store",
    description: "Explore all of our products.",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "Store",
      description: "Explore all of our products.",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "Store",
      description: "Explore all of our products.",
    },
  }
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    categoryId?: string
    age?: string
    category?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page, categoryId, age, category } = searchParams

  let resolvedCategoryId = categoryId
  if (!resolvedCategoryId && category) {
    // Resolve a category name (or handle-like string) to its ID
    try {
      // Try handle equality first using a slugified variant of the input
      const slugified = category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      const byHandle = await listCategories({
        handle: slugified,
        limit: 1,
        fields: "id,name,handle",
      })
      if (byHandle?.length) {
        resolvedCategoryId = byHandle[0].id
      } else {
        // Fallback to a name/description search via q and try exact name match
        const cats = await listCategories({
          q: category,
          limit: 50,
          fields: "id,name,handle",
        })
        if (cats?.length) {
          const lower = category.toLowerCase()
          const exactByName = cats.find(
            (c) => (c.name || "").toLowerCase() === lower
          )
          const exactByHandle = cats.find(
            (c) => (c.handle || "").toLowerCase() === lower
          )
          resolvedCategoryId = (exactByName || exactByHandle || cats[0]).id
        }
      }
    } catch {
      // ignore resolution errors; will show all products
    }
  }

  // Normalize URL to use categoryId when we resolved from category handle/name
  if (category && !categoryId && resolvedCategoryId) {
    const current = new URLSearchParams(searchParams as any)
    current.delete("category")
    current.set("categoryId", resolvedCategoryId)
    const countryCode = params.countryCode
    redirect(`/${countryCode}/store?${current.toString()}`)
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      categoryId={resolvedCategoryId}
      age={age}
      countryCode={params.countryCode}
    />
  )
}
