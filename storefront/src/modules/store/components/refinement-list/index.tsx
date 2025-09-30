"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"

import CategoryFilter from "./category-filter"
import SortProducts, { SortOptions } from "./sort-products"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
  categories?: HttpTypes.StoreProductCategory[]
}

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
  categories,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileTriggerTarget, setMobileTriggerTarget] =
    useState<HTMLElement | null>(null)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      if (!value) {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const selectedCategoryId = useMemo(
    () => searchParams.get("categoryId") || "",
    [searchParams]
  )
  const selectedAge = useMemo(
    () => searchParams.get("age") || "",
    [searchParams]
  )

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("categoryId")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAge = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("age")
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams)
    params.delete("categoryId")
    params.delete("age")
    router.push(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    const el =
      typeof window !== "undefined"
        ? document.getElementById("mobile-filters-trigger")
        : null
    setMobileTriggerTarget(el as HTMLElement | null)
  }, [])

  return (
    <>
      {/* Mobile trigger: portal into heading area if target exists; fallback below */}
      {mobileTriggerTarget ? (
        createPortal(
          <button
            className="inline-flex items-center gap-2 rounded-md bg-ui-bg-base px-3 py-2 ring-1 ring-ui-border-base hover:bg-ui-bg-subtle hover:text-ui-fg-base"
            onClick={() => setMobileOpen(true)}
          >
            <span className="">Filters</span>
          </button>,
          mobileTriggerTarget
        )
      ) : (
        <div className="mb-4 flex justify-center small:hidden">
          <button
            className="inline-flex items-center gap-2 rounded-md bg-ui-bg-base px-3 py-2 text-ui-fg-subtle ring-1 ring-ui-border-base hover:bg-ui-bg-subtle hover:text-ui-fg-base"
            onClick={() => setMobileOpen(true)}
          >
            <span className="">Filters</span>
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className="mb-8 hidden gap-12 py-4 pl-6 small:sticky small:ml-[1.675rem] small:mr-10 small:flex small:min-w-[250px] small:flex-col small:px-0"
        data-testid="test-list"
      >
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />
        <CategoryFilter
          setQueryParams={setQueryParams}
          selectedCategoryId={selectedCategoryId}
          selectedAge={selectedAge}
          clearAll={clearAll}
          clearCategory={clearCategory}
          clearAge={clearAge}
          categories={categories}
        />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm small:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false)
          }}
        >
          <div className="h-full w-4/5 max-w-xs translate-x-0 transform overflow-y-auto bg-white p-4 pl-8 shadow-2xl transition-transform duration-300">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="txt-compact-small-plus text-ui-fg-subtle">
                Filters
              </h2>
              <button
                className="rounded-md px-2 py-1 text-ui-fg-subtle hover:bg-ui-bg-subtle"
                onClick={() => setMobileOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="flex flex-col gap-8">
              <SortProducts
                sortBy={sortBy}
                setQueryParams={setQueryParams}
                data-testid={dataTestId}
              />
              <CategoryFilter
                setQueryParams={setQueryParams}
                selectedCategoryId={selectedCategoryId}
                selectedAge={selectedAge}
                clearAll={() => {
                  clearAll()
                  setMobileOpen(false)
                }}
                clearCategory={clearCategory}
                clearAge={clearAge}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RefinementList
