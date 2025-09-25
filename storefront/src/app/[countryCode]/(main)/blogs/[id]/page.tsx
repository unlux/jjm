import React from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getBlogByIdCached, listBlogsCached } from "@/lib/repos/blogs"
import ShareButtons from "./ShareButtons.client"
import { markdownToHtml } from "@/lib/markdown"
export const revalidate = 86400 // 24 hours

export default async function BlogDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const id = await params.id
  const blog = await getBlogByIdCached(id)
  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-6">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <h1 className="text-3xl font-bold text-[#1e1e3f] mb-4">
            Blog Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The blog post you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <LocalizedClientLink
            href="/blogs"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#262b5f] text-white rounded-lg hover:bg-opacity-90 transition-colors"
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
    <div className="bg-[#f9f9f9] min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#262b5f] opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-white text-center z-10">
          <div className="inline-block bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full mb-6">
            <span className="text-sm font-semibold text-[#262b5f]">
              {blog.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-baloo">
            {blog.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-sm opacity-90">
              {formatDate(blog.publishedAt)}
            </span>
            <span className="w-1 h-1 bg-white rounded-full opacity-60"></span>
            <span className="text-sm opacity-90">By {blog.author}</span>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-12">
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
              className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#1e1e3f] prose-p:text-gray-700 prose-a:text-[#1e4ed8] hover:prose-a:underline prose-hr:my-8 prose-strong:text-[#1e1e3f] prose-blockquote:border-l-[#262b5f] prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#262b5f] prose-h1:text-4xl md:prose-h1:text-5xl prose-h2:text-3xl md:prose-h2:text-4xl prose-h3:text-2xl"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />{" "}
            {/* Author Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden relative mr-4">
                <Image
                  src={blog.authorImage}
                  alt={blog.author}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[#262b5f] font-medium">{blog.author}</p>
                <p className="text-sm text-gray-600">
                  Toy Education Specialist
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <h3 className="text-lg font-bold text-[#1e1e3f] mb-4">
            Share This Article
          </h3>
          <ShareButtons title={blog.title} />
        </div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1e1e3f] mb-8 font-baloo">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <LocalizedClientLink
                  href={`/blogs/${relatedBlog.id}`}
                  key={relatedBlog.id}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                    <div className="relative overflow-hidden h-48">
                      <Image
                        src={relatedBlog.image}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(relatedBlog.publishedAt)}
                      </p>
                      <h3 className="text-lg font-bold text-[#1e1e3f] leading-snug group-hover:text-[#262b5f] transition-colors line-clamp-2 mb-3">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
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
            className="inline-flex items-center justify-center px-6 py-3 border border-[#262b5f] text-[#262b5f] rounded-lg hover:bg-[#262b5f] hover:text-white transition-colors"
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
