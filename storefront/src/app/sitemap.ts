import type { MetadataRoute } from "next"

import { listCategories } from "@/lib/data/categories"
import { listCollections } from "@/lib/data/collections"
import { listProducts } from "@/lib/data/products"
import { listRegions } from "@/lib/data/regions"
import { listBlogsCached } from "@/lib/repos/blogs"
import { getBaseURL } from "@/lib/util/env"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseURL()

  // Determine supported country codes
  const countryCodes = await listRegions()
    .then(
      (regions) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )
    .catch(() => ["us"]) // fallback

  const now = new Date()

  const urls: MetadataRoute.Sitemap = []

  for (const cc of countryCodes) {
    // Static important pages per country
    const staticPaths = [
      `/${cc}`,
      `/${cc}/store`,
      `/${cc}/about-us`,
      `/${cc}/contact`,
      `/${cc}/tnc`,
      `/${cc}/privacy-policy`,
      `/${cc}/blogs`,
    ]
    for (const path of staticPaths) {
      urls.push({ url: new URL(path, base).toString(), lastModified: now })
    }

    // Collections
    try {
      const { collections } = await listCollections({
        fields: "handle",
        limit: "200",
      })
      for (const col of collections || []) {
        if (!col?.handle) continue
        const path = `/${cc}/collections/${col.handle}`
        urls.push({ url: new URL(path, base).toString(), lastModified: now })
      }
    } catch {}

    // Categories (handles may be nested via slashes)
    try {
      const cats = await listCategories({ limit: 200, fields: "handle" })
      for (const cat of cats || []) {
        if (!cat?.handle) continue
        const path = `/${cc}/categories/${cat.handle}`
        urls.push({ url: new URL(path, base).toString(), lastModified: now })
      }
    } catch {}

    // Products (limit to 200 per country to avoid huge sitemap)
    try {
      const { response } = await listProducts({
        countryCode: cc,
        queryParams: { limit: 200, fields: "handle" },
      })
      for (const p of response.products || []) {
        if (!p?.handle) continue
        const path = `/${cc}/products/${p.handle}`
        urls.push({ url: new URL(path, base).toString(), lastModified: now })
      }
    } catch {}

    // Blogs (same list for all countries as content is global)
    try {
      const blogs = await listBlogsCached({ limit: 200 })
      for (const b of blogs || []) {
        const path = `/${cc}/blogs/${b.id}`
        urls.push({
          url: new URL(path, base).toString(),
          lastModified: new Date(b.publishedAt || now),
        })
      }
    } catch {}
  }

  return urls
}
