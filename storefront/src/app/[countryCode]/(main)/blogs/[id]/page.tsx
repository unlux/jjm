import LocalizedClientLink from "@modules/common/components/localized-client-link"
import type { Metadata } from "next"
import Image from "next/image"
import React from "react"

import { listRegions } from "@/lib/data/regions"
import { markdownToHtml } from "@/lib/markdown"
import { getBlogByIdCached, listBlogsCached } from "@/lib/repos/blogs"
import { buildHreflangMap } from "@/lib/seo/config"
import { BlogPostingJsonLd } from "@/lib/seo/jsonld"
import { getBaseURL } from "@/lib/util/env"

import ShareButtons from "./ShareButtons.client"
export const revalidate = 86400 // 24 hours

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string; id: string }>
}): Promise<Metadata> {
  const { countryCode, id } = await props.params
  const blog = await getBlogByIdCached(id)
  if (!blog) {
    return { title: "Blog" }
  }

  const countryCodes = await listRegions()
    .then(
      (regions) =>
        regions
          ?.map((r) => r.countries?.map((c) => c.iso_2))
          .flat()
          .filter(Boolean) as string[]
    )
    .catch(() => [countryCode])

  const canonicalPath = `/${countryCode}/blogs/${id}`
  const languages = buildHreflangMap(countryCodes, (cc) => `/${cc}/blogs/${id}`)

  return {
    title: blog.title,
    description: blog.excerpt || blog.title,
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      url: canonicalPath,
      images: blog.image ? [blog.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: blog.image ? [blog.image] : [],
    },
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string; countryCode: string }
}) {
  const id = await params.id
  const countryCode = (params as any).countryCode
  const blog = await getBlogByIdCached(id)
  if (!blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9f9f9] px-6">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-md">
          <h1 className="mb-4 text-3xl font-bold text-[#1e1e3f]">
            Blog Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <LocalizedClientLink
            href="/blogs"
            className="inline-flex items-center justify-center rounded-lg bg-[#262b5f] px-6 py-3 text-white transition-colors hover:bg-opacity-90"
          >
            Back to Blogs
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  const relatedBlogs = await listBlogsCached({
    category: blog.category,
    excludeId: blog.id,
    limit: 3,
  })
  // Convert Markdown content to safe HTML (excerpt remains plain for cards)
  const contentHtml = await markdownToHtml(blog.content || "")
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <BlogPostingJsonLd
        blog={blog}
        url={new URL(
          `/${countryCode || ""}/blogs/${blog.id}`,
          getBaseURL()
        ).toString()}
      />
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#262b5f] opacity-70"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center text-white">
          <div className="mb-6 inline-block rounded-full bg-white/90 px-4 py-1 backdrop-blur-sm">
            <span className="text-sm font-semibold text-[#262b5f]">
              {blog.category}
            </span>
          </div>
          <h1 className="font-baloo mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-sm opacity-90">
              {formatDate(blog.publishedAt)}
            </span>
            <span className="h-1 w-1 rounded-full bg-white opacity-60"></span>
            <span className="text-sm opacity-90">By {blog.author}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12 overflow-hidden rounded-xl bg-white shadow-md">
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 md:p-10">
            <div
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1e1e3f] prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-gray-700 prose-a:text-[#1e4ed8] hover:prose-a:underline prose-blockquote:border-l-[#262b5f] prose-strong:text-[#1e1e3f] prose-ol:list-decimal prose-ul:list-disc prose-li:marker:text-[#262b5f] prose-hr:my-8 md:prose-h1:text-5xl md:prose-h2:text-4xl"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />{" "}
            {/* Author Section */}
            <div className="mt-12 flex items-center border-t border-gray-200 pt-8">
              <div className="relative mr-4 h-16 w-16 overflow-hidden rounded-full">
                <Image
                  src={blog.authorImage}
                  alt={blog.author}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-[#262b5f]">{blog.author}</p>
                <p className="text-sm text-gray-600">
                  Toy Education Specialist
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="mb-12 rounded-xl bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-bold text-[#1e1e3f]">
            Share This Article
          </h3>
          <ShareButtons title={blog.title} />
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="font-baloo mb-8 text-2xl font-bold text-[#1e1e3f]">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedBlogs.map((relatedBlog) => (
                <LocalizedClientLink
                  href={`/blogs/${relatedBlog.id}`}
                  key={relatedBlog.id}
                >
                  <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-grow flex-col p-5">
                      <p className="mb-2 text-xs text-gray-500">
                        {formatDate(relatedBlog.publishedAt)}
                      </p>
                      <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-[#1e1e3f] transition-colors group-hover:text-[#262b5f]">
                        {relatedBlog.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-gray-600">
                        {relatedBlog.excerpt}
                      </p>
                    </div>
                  </div>
                </LocalizedClientLink>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <LocalizedClientLink
            href="/blogs"
            className="inline-flex items-center justify-center rounded-lg border border-[#262b5f] px-6 py-3 text-[#262b5f] transition-colors hover:bg-[#262b5f] hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to All Blogs
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
