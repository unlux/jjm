"use client"

import { HttpTypes } from "@medusajs/types"
import { useMemo } from "react"

export default function CategoryFilter({
  setQueryParams,
  selectedCategoryId,
  selectedAge,
  clearAll,
  clearCategory,
  clearAge,
  categories = [],
}: {
  setQueryParams: (name: string, value: string) => void
  selectedCategoryId?: string
  selectedAge?: string
  clearAll?: () => void
  clearCategory?: () => void
  clearAge?: () => void
  categories?: HttpTypes.StoreProductCategory[]
}) {
  // Use only top-level categories for clarity
  const topLevel = useMemo(
    () => (categories || []).filter((c: any) => !c?.parent_category),
    [categories]
  )

  const ageGroups = [
    { label: "2-4", value: "2-4" },
    { label: "4-6", value: "4-6" },
    { label: "6-8", value: "6-8" },
    { label: "8+", value: "8+" },
  ]

  const hasActiveFilters = Boolean(selectedCategoryId || selectedAge)

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between pr-2">
        <span className="text-base font-semibold text-ui-fg-base sm:text-lg">
          Filters
        </span>
        {hasActiveFilters && clearAll && (
          <button
            className="txt-compact-small rounded-md px-2 py-1 text-ui-fg-interactive ring-1 ring-ui-border-base hover:text-ui-fg-interactive-hover"
            onClick={clearAll}
          >
            Clear all
          </button>
        )}
      </div>

      {topLevel.length > 0 && (
        <div>
          <h4 className="txt-compact-small-plus mb-2 text-ui-fg-muted">
            Categories
          </h4>
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            {topLevel.map((c) => {
              const selected = selectedCategoryId === c.id
              return (
                <div key={c.id} className="flex items-center justify-between">
                  <button
                    className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ring-1 transition ${
                      selected
                        ? "bg-blue-50 text-ui-fg-base ring-blue-200"
                        : "bg-ui-bg-base/0 text-ui-fg-subtle ring-ui-border-base hover:bg-ui-bg-subtle hover:text-ui-fg-base"
                    }`}
                    aria-pressed={selected}
                    onClick={() => {
                      if (selected) {
                        if (clearCategory) {
                          clearCategory()
                        } else {
                          setQueryParams("categoryId", "")
                        }
                      } else {
                        setQueryParams("categoryId", c.id)
                      }
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="truncate">{c.name}</span>
                    </span>
                    {selected && (
                      <span className="txt-compact-small text-blue-600">✓</span>
                    )}
                  </button>
                  {selected && clearCategory && (
                    <button
                      className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-ui-fg-muted hover:bg-ui-bg-subtle hover:text-ui-fg-base"
                      onClick={clearCategory}
                      aria-label="Clear category"
                      title="Clear"
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
        <h4 className="txt-compact-small-plus mb-2 text-ui-fg-muted">
          Age Groups
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {ageGroups.map((a) => (
            <button
              key={a.value}
              className={`transform rounded-md border px-2 py-2 transition-all duration-200 ease-out ${
                selectedAge === a.value
                  ? "scale-[1.01] border-blue-200 bg-blue-50 text-ui-fg-base ring-1 ring-blue-200"
                  : "border-ui-border-base text-ui-fg-subtle hover:scale-[1.01] hover:text-ui-fg-base"
              }`}
              aria-pressed={selectedAge === a.value}
              onClick={() => {
                if (selectedAge === a.value) {
                  if (clearAge) {
                    clearAge()
                  } else {
                    setQueryParams("age", "")
                  }
                } else {
                  setQueryParams("age", a.value)
                }
              }}
            >
              <span className="flex w-full items-center justify-center gap-2">
                {selectedAge === a.value && (
                  <span className="txt-compact-small text-blue-600">✓</span>
                )}
                <span className="text-center">{a.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
