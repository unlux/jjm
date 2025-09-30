import { listBlogsCached } from "@/lib/repos/blogs"

import BlogSectionClient from "./BlogSectionClient"

export const revalidate = 3600

export default async function BlogCarousel() {
  const rows = await listBlogsCached({ limit: 10 })
  const blogs = rows.map((b) => ({
    ...b,
    date: new Date(b.publishedAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }))
  if (blogs.length === 0) return null
  return <BlogSectionClient blogs={blogs} />
}
