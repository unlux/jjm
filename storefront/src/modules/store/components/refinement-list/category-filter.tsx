"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"

export default function CategoryFilter({
  setQueryParams,
  selectedCategoryId,
  selectedAge,
  clearAll,
  clearCategory,
  clearAge,
}: {
  setQueryParams: (name: string, value: string) => void
  selectedCategoryId?: string
  selectedAge?: string
  clearAll?: () => void
  clearCategory?: () => void
  clearAge?: () => void
}) {
  const [categories, setCategories] = useState<
    HttpTypes.StoreProductCategory[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    sdk.store.category
      .list({ limit: 50 })
      .then(({ product_categories }) => {
        if (!isMounted) return
        setCategories(product_categories || [])
      })
      .finally(() => isMounted && setLoading(false))
    return () => {
      isMounted = false
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
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <button
                  className={`text-left py-2 px-2 rounded-md hover:bg-ui-bg-subtle transition ${
                    selectedCategoryId === c.id
                      ? "bg-blue-50 text-ui-fg-base ring-1 ring-blue-200"
                      : "text-ui-fg-subtle hover:text-ui-fg-base"
                  }`}
                  onClick={() => setQueryParams("categoryId", c.id)}
                >
                  {c.name}
                </button>
                {selectedCategoryId === c.id && clearCategory && (
                  <button
                    className="txt-compact-small text-ui-fg-muted hover:text-ui-fg-base rounded px-2"
                    onClick={clearCategory}
                    aria-label="Clear category"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-ui-border-base pt-4">
        <h4 className="txt-compact-small-plus text-ui-fg-muted mb-2">
          Age Groups
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {ageGroups.map((a) => (
            <button
              key={a.value}
              className={`py-2 px-2 border rounded-md hover:bg-ui-bg-subtle transition ${
                selectedAge === a.value
                  ? "bg-blue-50 text-ui-fg-base border-blue-200 ring-1 ring-blue-200"
                  : "text-ui-fg-subtle border-ui-border-base hover:text-ui-fg-base"
              }`}
              onClick={() => setQueryParams("age", a.value)}
            >
              {a.label}
            </button>
          ))}
        </div>
        {selectedAge && clearAge && (
          <div className="mt-2">
            <button
              className="txt-compact-small text-ui-fg-muted hover:text-ui-fg-base"
              onClick={clearAge}
            >
              Clear age
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
