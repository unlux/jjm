"use client"

import { useEffect, useState } from "react"
import { listStoreCategoriesCached } from "@/lib/data/categories"
import { HttpTypes } from "@medusajs/types"

export default function CategoryFilter({
  setQueryParams,
  selectedCategoryIds,
  selectedAges,
  clearAll,
  clearCategory,
  clearAge,
}: {
  setQueryParams: (name: string, value: string) => void
  selectedCategoryIds?: string[]
  selectedAges?: string[]
  clearAll?: () => void
  clearCategory?: (id?: string) => void
  clearAge?: (value?: string) => void
}) {
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    listStoreCategoriesCached()
      .then(({ categories: data }) => {
        if (!mounted) return
        setCategories(data || [])
      })
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const ageGroups = [
    { label: "2-4", value: "2-4" },
    { label: "4-6", value: "4-6" },
    { label: "6-8", value: "6-8" },
    { label: "8+", value: "8+" },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center pr-2">
        <span className="txt-compact-small-plus text-ui-fg-muted">Filters</span>
        {clearAll && (
          <button
            className="txt-compact-small text-ui-fg-interactive hover:text-ui-fg-interactive-hover rounded-md px-2 py-1 ring-1 ring-ui-border-base"
            onClick={clearAll}
          >
            Clear all
          </button>
        )}
      </div>

      {categories.length > 0 && (
        <div>
          <h4 className="txt-compact-small-plus text-ui-fg-muted mb-2">
            Categories
          </h4>
          <div className="flex flex-col gap-1">
            {categories.map((c) => {
              const isSelected = (selectedCategoryIds || []).includes(c.id)
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <button
                    className={`text-left py-2 px-2 rounded-md hover:bg-ui-bg-subtle transition ${
                      isSelected
                        ? "bg-blue-50 text-ui-fg-base ring-1 ring-blue-200"
                        : "text-ui-fg-subtle hover:text-ui-fg-base"
                    }`}
                    onClick={() =>
                      isSelected
                        ? clearCategory && clearCategory(c.id)
                        : setQueryParams("categoryId", c.id)
                    }
                  >
                    {c.name}
                  </button>
                  {isSelected && clearCategory && (
                    <button
                      className="txt-compact-small text-ui-fg-muted hover:text-ui-fg-base rounded px-2"
                      onClick={() => clearCategory(c.id)}
                      aria-label="Clear category"
                    >
                      ×
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="border-t border-ui-border-base pt-4">
        <h4 className="txt-compact-small-plus text-ui-fg-muted mb-2">
          Age Groups
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {ageGroups.map((a) => {
            const isSelected = (selectedAges || []).includes(a.value)
            return (
              <button
                key={a.value}
                className={`py-2 px-2 border rounded-md hover:bg-ui-bg-subtle transition ${
                  isSelected
                    ? "bg-blue-50 text-ui-fg-base border-blue-200 ring-1 ring-blue-200"
                    : "text-ui-fg-subtle border-ui-border-base hover:text-ui-fg-base"
                }`}
                onClick={() =>
                  isSelected
                    ? clearAge && clearAge(a.value)
                    : setQueryParams("age", a.value)
                }
              >
                {a.label}
              </button>
            )
          })}
        </div>
        {(selectedAges || []).length > 0 && clearAge && (
          <div className="mt-2">
            <button
              className="txt-compact-small text-ui-fg-muted hover:text-ui-fg-base"
              onClick={() => clearAge?.()}
            >
              Clear age
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
