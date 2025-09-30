"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

import { getAuthHeaders, getCacheOptions } from "./cookies"

export async function listStoreCategoriesCached(
  params?: Record<string, any>
): Promise<{
  categories: HttpTypes.StoreProductCategory[]
  count: number
}> {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("product-categories")),
  }

  return sdk.client
    .fetch<{
      product_categories: HttpTypes.StoreProductCategory[]
      count: number
    }>(`/store/product-categories`, {
      method: "GET",
      query: { limit: 50, ...params },
      headers,
      next: { ...next, revalidate: 3600 },
      cache: "force-cache",
    })
    .then(({ product_categories, count }) => ({
      categories: product_categories || [],
      count,
    }))
}

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next: { ...next, revalidate: 3600 },
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next: { ...next, revalidate: 3600 },
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}
