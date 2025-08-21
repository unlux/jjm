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
  categoryId,
  age,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  age?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  // Server-side age filtering by resolving age tag value -> tag id(s), fallback to client filter if not found
  let ageForClientFilter: string | undefined = undefined
  if (age) {
    try {
      const headers = {
        ...(await getAuthHeaders()),
      }
      const next = {
        ...(await getCacheOptions("product-tags")),
      }
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
        queryParams["tag_id"] = ids as string[]
      } else {
        ageForClientFilter = age
      }
    } catch (_) {
      ageForClientFilter = age
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

  // Fallback client-side filtering if we couldn't resolve tag ids above
  if (ageForClientFilter) {
    const filtered = products.filter((p) =>
      (p.tags || []).some(
        (t) =>
          (t.value || "").toLowerCase() === ageForClientFilter!.toLowerCase()
      )
    )
    count = filtered.length
    products = filtered
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-10 gap-y-10"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
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
