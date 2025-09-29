import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import React from "react"
import type { Metadata } from "next"

import { listBlogsCached } from "@/lib/repos/blogs"
import { listRegions } from "@/lib/data/regions"
import { buildHreflangMap } from "@/lib/seo/config"

export const revalidate = 86400 // 24 hours
export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const countryCodes = await listRegions()
    .then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat().filter(Boolean) as string[]
    )
    .catch(() => [countryCode])

  const canonicalPath = `/${countryCode}/blogs`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/blogs`)

  return {
    title: "Blogs",
    description: "Insights and ideas to make playtime more educational and fun.",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: "Blogs",
      description:
        "Discover insights and ideas to make playtime more educational and fun.",
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: "Blogs",
      description:
        "Discover insights and ideas to make playtime more educational and fun.",
    },
  }
}
export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const selectedCategory = (searchParams?.category as string) || null
  const blogs = await listBlogsCached({
    category: selectedCategory || undefined,
    limit: 500,
  })
  const categories = Array.from(new Set(blogs.map((blog) => blog.category)))
  const filteredBlogs = blogs
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Hero Section */}
      <div className="bg-[#262b5f] px-6 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-baloo mb-6 text-5xl font-bold">Our Blog</h1>
          <p className="mx-auto max-w-2xl text-lg opacity-90">
            Discover insights and ideas to make playtime more educational and
            fun for your children
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-white py-6 shadow-sm">
        <div className="mx-auto max-w-7xl px-6">
          <div className="scrollbar-hide flex items-center gap-4 overflow-x-auto pb-2">
            <LocalizedClientLink
              href={`/blogs`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? "bg-[#262b5f] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Posts
            </LocalizedClientLink>
            {categories.map((category) => {
              const href = `/blogs?category=${encodeURIComponent(category)}`
              const isActive = selectedCategory === category
              return (
                <LocalizedClientLink
                  key={category}
                  href={href}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#262b5f] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </LocalizedClientLink>
              )
            })}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {filteredBlogs.length === 0 && (
          <div className="text-center text-gray-600">No blogs found.</div>
        )}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <LocalizedClientLink href={`/blogs/${blog.id}`} key={blog.id}>
              <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="relative overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={500}
                    height={300}
                    className="h-[220px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
                    <span className="text-xs font-semibold text-[#262b5f]">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-grow flex-col p-5">
                  <p className="mb-2 flex items-center text-xs text-gray-500">
                    <span className="mr-2 inline-block h-[2px] w-4 bg-[#262b5f]"></span>
                    {formatDate(blog.publishedAt)}
                  </p>
                  <h3 className="mb-3 text-xl font-bold leading-snug text-[#1e1e3f] transition-colors group-hover:text-[#262b5f]">
                    {blog.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                    {blog.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-xs font-medium text-[#262b5f]">
                      Read more
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2f2f7] transition-colors group-hover:bg-[#262b5f]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-[#262b5f] transition-colors group-hover:text-white"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-[#262b5f] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-baloo mb-4 text-3xl font-bold">Stay Updated</h2>
          <p className="mb-8 text-white/80">
            Subscribe to our newsletter for the latest toy trends, parenting
            tips, and exclusive offers
          </p>
          <div className="mx-auto flex max-w-xl flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <button className="rounded-lg bg-white px-6 py-3 font-medium text-[#262b5f] transition-colors hover:bg-opacity-90">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
