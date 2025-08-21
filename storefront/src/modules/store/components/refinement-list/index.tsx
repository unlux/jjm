"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo, useEffect, useState } from "react"
import { createPortal } from "react-dom"
// simplified UI; no chip name hydration

import SortProducts, { SortOptions } from "./sort-products"
import CategoryFilter from "./category-filter"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileTriggerTarget, setMobileTriggerTarget] =
    useState<HTMLElement | null>(null)
  const selectedCategoryIds = useMemo(() => {
    const all = searchParams.getAll("categoryId")
    const single = searchParams.get("categoryId")
    return all.length ? all : single ? [single] : []
  }, [searchParams])
  const selectedAges = useMemo(() => {
    const all = searchParams.getAll("age")
    const single = searchParams.get("age")
    return all.length ? all : single ? [single] : []
  }, [searchParams])
  const activeCount = selectedCategoryIds.length + selectedAges.length

  // removed categoryId->name state for minimal UI

  const setQueryParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (name === "categoryId" || name === "age") {
      const values = params.getAll(name)
      if (values.includes(value)) {
        // toggle off
        const next = values.filter((v) => v !== value)
        params.delete(name)
        next.forEach((v) => params.append(name, v))
      } else {
        // append
        params.append(name, value)
      }
      router.push(`${pathname}?${params.toString()}`)
      return
    }
    // default: single-set behavior
    params.set(name, value)
    router.push(`${pathname}?${params.toString()}`)
  }

  // no name hydration effect

  const clearCategory = (id?: string) => {
    const params = new URLSearchParams(searchParams)
    if (id) {
      const list = params.getAll("categoryId").filter((v) => v !== id)
      params.delete("categoryId")
      list.forEach((v) => params.append("categoryId", v))
    } else {
      params.delete("categoryId")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearAge = (value?: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      const list = params.getAll("age").filter((v) => v !== value)
      params.delete("age")
      list.forEach((v) => params.append("age", v))
    } else {
      params.delete("age")
    }
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

  // Lock body scroll when mobile filter is open and close on ESC
  useEffect(() => {
    if (typeof document === "undefined") return
    const original = document.body.style.overflow
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = original
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = original
      document.removeEventListener("keydown", onKey)
    }
  }, [mobileOpen])

  return (
    <>
      {/* Mobile trigger: portal into heading area if target exists; fallback below */}
      {mobileTriggerTarget ? (
        createPortal(
          <button
            aria-label="Open filters"
            aria-expanded={mobileOpen}
            aria-controls="mobile-filters-panel"
            className="inline-flex items-center gap-2 rounded-md bg-ui-bg-base px-3 py-2 ring-1 ring-ui-border-base hover:text-ui-fg-base hover:bg-ui-bg-subtle"
            onClick={() => setMobileOpen(true)}
          >
            <span className="">Filters</span>
            {activeCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[11px] px-1.5 py-0.5">
                {activeCount}
              </span>
            )}
          </button>,
          mobileTriggerTarget
        )
      ) : (
        <div className="small:hidden mb-4 flex justify-center">
          <button
            aria-label="Open filters"
            aria-expanded={mobileOpen}
            aria-controls="mobile-filters-panel"
            className="inline-flex items-center gap-2 rounded-md bg-ui-bg-base px-3 py-2 text-ui-fg-subtle ring-1 ring-ui-border-base hover:text-ui-fg-base hover:bg-ui-bg-subtle"
            onClick={() => setMobileOpen(true)}
          >
            <span className="">Filters</span>
            {activeCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-[11px] px-1.5 py-0.5">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className="hidden small:flex small:flex-col gap-6 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem] small:mr-10 small:sticky small:top-24"
        data-testid="test-list"
      >
        {(selectedCategoryIds.length || selectedAges.length) && (
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategoryIds.map((cid) => (
              <button
                key={cid}
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-800 text-xs px-3 py-1 ring-1 ring-blue-200 hover:bg-blue-100"
                onClick={() => clearCategory(cid)}
                title={cid}
              >
                <span className="truncate max-w-[160px]">Category: {cid}</span>
                <span aria-hidden>×</span>
              </button>
            ))}
            {selectedAges.map((a) => (
              <button
                key={a}
                className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-800 text-xs px-3 py-1 ring-1 ring-blue-200 hover:bg-blue-100"
                onClick={() => clearAge(a)}
              >
                <span>Age: {a}</span>
                <span aria-hidden>×</span>
              </button>
            ))}
            <div className="ml-auto">
              <button
                className="text-xs text-ui-fg-interactive hover:text-ui-fg-interactive-hover underline"
                onClick={clearAll}
              >
                Clear all
              </button>
            </div>
          </div>
        )}
        <SortProducts
          sortBy={sortBy}
          setQueryParams={setQueryParams}
          data-testid={dataTestId}
        />
        <CategoryFilter
          setQueryParams={setQueryParams}
          selectedCategoryIds={selectedCategoryIds}
          selectedAges={selectedAges}
          clearAll={clearAll}
          clearCategory={clearCategory}
          clearAge={clearAge}
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
          <div
            id="mobile-filters-panel"
            role="dialog"
            aria-modal="true"
            className="h-full w-4/5 max-w-xs bg-white shadow-2xl pl-6 pr-4 py-4 overflow-y-auto transform transition-transform duration-300 translate-x-0"
          >
            <div className="flex justify-between items-center mb-3">
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
            {(selectedCategoryIds.length || selectedAges.length) && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {selectedCategoryIds.map((cid) => (
                  <button
                    key={cid}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-800 text-xs px-3 py-1 ring-1 ring-blue-200 hover:bg-blue-100"
                    onClick={() => clearCategory(cid)}
                  >
                    <span className="truncate max-w-[140px]">
                      Category: {cid}
                    </span>
                    <span aria-hidden>×</span>
                  </button>
                ))}
                {selectedAges.map((a) => (
                  <button
                    key={a}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-800 text-xs px-3 py-1 ring-1 ring-blue-200 hover:bg-blue-100"
                    onClick={() => clearAge(a)}
                  >
                    <span>Age: {a}</span>
                    <span aria-hidden>×</span>
                  </button>
                ))}
                <button
                  className="ml-auto text-xs text-ui-fg-interactive hover:text-ui-fg-interactive-hover underline"
                  onClick={clearAll}
                >
                  Clear all
                </button>
              </div>
            )}
            <div className="flex flex-col gap-6">
              <SortProducts
                sortBy={sortBy}
                setQueryParams={setQueryParams}
                data-testid={dataTestId}
              />
              <CategoryFilter
                setQueryParams={setQueryParams}
                selectedCategoryIds={selectedCategoryIds}
                selectedAges={selectedAges}
                clearAll={clearAll}
                clearCategory={clearCategory}
                clearAge={clearAge}
              />
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur pt-3 mt-4">
              <button
                className="w-full rounded-md bg-blue-600 text-white py-2 font-medium hover:bg-blue-700"
                onClick={() => setMobileOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default RefinementList
