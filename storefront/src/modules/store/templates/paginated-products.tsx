import { listProductsWithSort } from "@lib/data/products"
import { getAuthHeaders, getCacheOptions } from "@/lib/data/cookies"
import { sdk } from "@/lib/config"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  tag_id?: string[]
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryIds,
  ages,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryIds?: string[]
  ages?: string[]
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryIds && categoryIds.length) {
    queryParams["category_id"] = categoryIds
  }

  // Server-side age filtering: resolve age tag value -> tag id(s); fallback to client filter if not found
  let agesForClientFilter: string[] = []
  if (ages && ages.length) {
    try {
      const headers = {
        ...(await getAuthHeaders()),
      }
      const next = {
        ...(await getCacheOptions("product-tags")),
      }
      // Resolve all age values to tag ids
      const allIds: string[] = []
      for (const age of ages) {
        const tagResp = await sdk.client.fetch<any>(`/store/product-tags`, {
          method: "GET",
          query: { value: age, limit: 10 },
          headers,
          next,
          cache: "force-cache",
        })
        const tagsArr: any[] =
          tagResp?.product_tags || tagResp?.tags || tagResp?.data || []
        const ids = tagsArr
          .filter(
            (t) => String(t?.value ?? "").toLowerCase() === age.toLowerCase()
          )
          .map((t) => t.id)
          .filter(Boolean)
        if (ids.length > 0) {
          allIds.push(...(ids as string[]))
        } else {
          agesForClientFilter.push(age)
        }
      }
      if (allIds.length) {
        queryParams["tag_id"] = allIds
      }
    } catch (_) {
      agesForClientFilter = ages
    }
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  // Enforce AND semantics for ages (client-side guard only for unresolved values)
  if (agesForClientFilter.length) {
    const lowered = agesForClientFilter.map((a) => a.toLowerCase())
    const filtered = products.filter((p) => {
      const values = (p.tags || []).map((t) => (t.value || "").toLowerCase())
      return lowered.every((v) => values.includes(v))
    })
    count = filtered.length
    products = filtered
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 gap-x-6 gap-y-8 w-full"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} size="square" />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
