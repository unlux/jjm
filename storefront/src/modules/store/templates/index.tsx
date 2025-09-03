import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  categoryId,
  age,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryId?: string
  age?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start p-6 "
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full large:mx-10">
        <div className="mb-8 flex items-end justify-between small:justify-start border-gray-900">
          <h1
            data-testid="store-page-title"
            className="text-2xl-semi small:text-2xl-semi"
          >
            All of our toys
          </h1>
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
