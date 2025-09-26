import React from "react"

import RevalidateButton from "@/components/RevalidateButton"

export const revalidate = 0 // always render latest UI; actions call API which triggers ISR

export default function RevalidatePage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-12">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="font-baloo mb-6 text-3xl font-bold text-[#1e1e3f]">
          Revalidate Cached Pages
        </h1>
        <p className="mb-8 text-gray-700">
          Use these buttons to trigger revalidation of ISR pages instantly. This
          endpoint is public in this environment.
        </p>

        <div className="space-y-6 rounded-xl bg-white p-6 shadow">
          <div>
            <h2 className="mb-2 text-xl font-semibold text-[#1e1e3f]">Blogs</h2>
            <p className="mb-3 text-sm text-gray-600">
              Revalidates blogs listing and individual blog detail pages.
            </p>
            <RevalidateButton tag="blogs" />
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-[#1e1e3f]">
              Testimonials
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              Revalidates the home page testimonials section and the
              testimonials API cache.
            </p>
            <RevalidateButton tag="testimonials" />
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-[#1e1e3f]">
              Hero Slider (Home)
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              Revalidates the home page that renders the hero slider.
            </p>
            <RevalidateButton tag="hero" />
          </div>
          <div>
            <h2 className="mb-2 text-xl font-semibold text-[#1e1e3f]">
              Offers Marquee (Top Bar)
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              Revalidates the cached offers shown in the top marquee and the
              offers API cache.
            </p>
            <RevalidateButton tag="offers" />
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-[#1e1e3f]">
              Products
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              Revalidates the store listing and all product detail pages.
            </p>
            <RevalidateButton tag="products" />
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold text-[#1e1e3f]">
              All Relevant
            </h2>
            <p className="mb-3 text-sm text-gray-600">
              Revalidates home, blogs listing/detail, and product pages.
            </p>
            <RevalidateButton tag="all" />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="mb-2 text-lg font-semibold text-[#1e1e3f]">
            cURL examples
          </h3>
          <pre className="overflow-auto rounded-lg bg-[#0b1027] p-4 text-sm text-white">
            {`curl "http://localhost:8000/api/revalidate?tag=blogs"
curl "http://localhost:8000/api/revalidate?tag=testimonials"
curl "http://localhost:8000/api/revalidate?tag=hero"
curl "http://localhost:8000/api/revalidate?tag=offers"
curl "http://localhost:8000/api/revalidate?tag=products"
curl "http://localhost:8000/api/revalidate?tag=all"`}
          </pre>
        </div>
      </div>
    </div>
  )
}
