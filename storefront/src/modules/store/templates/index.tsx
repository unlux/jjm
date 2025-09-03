import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { HttpTypes } from "@medusajs/types"
import { listCategories } from "@/lib/data/categories"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categoryId,
  age,
  categories,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryId?: string
  age?: string
  categories?: HttpTypes.StoreProductCategory[]
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  // If categories not provided, fetch here within modules layer
  // This keeps API and app pages untouched per user request
  const ensureCategories =
    categories ??
    (await listCategories({
      limit: 100,
      fields: "id,name,handle,parent_category,category_children",
    }))

  return (
    <div
      className="flex flex-col small:flex-row small:items-start p-6 "
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} categories={ensureCategories} />
      <div className="w-full large:mx-10">
        <div className="mb-8 flex items-end justify-between small:justify-start border-gray-900">
          <h1
            data-testid="store-page-title"
            className="text-2xl-semi small:text-2xl-semi"
          ></h1>
          <div id="mobile-filters-trigger" className="test-sm small:hidden" />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={categoryId}
            age={age}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
