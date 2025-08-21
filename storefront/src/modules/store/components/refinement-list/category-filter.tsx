"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/config"
import { HttpTypes } from "@medusajs/types"

export default function CategoryFilter({
  setQueryParams,
}: {
  setQueryParams: (name: string, value: string) => void
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

  if (loading || categories.length === 0) {
    return null
  }

  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <span className="txt-compact-small-plus text-ui-fg-muted">Filter by</span>
      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            className="text-left text-ui-fg-subtle hover:text-ui-fg-base"
            onClick={() => setQueryParams("categoryId", c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  )
}
