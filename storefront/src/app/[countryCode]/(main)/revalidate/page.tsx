import React from "react"
import RevalidateButton from "@/components/RevalidateButton"

export const revalidate = 0 // always render latest UI; actions call API which triggers ISR

export default function RevalidatePage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-12">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-[#1e1e3f] mb-6 font-baloo">
          Revalidate Cached Pages
        </h1>
        <p className="text-gray-700 mb-8">
          Use these buttons to trigger revalidation of ISR pages instantly. This endpoint is public
          in this environment.
        </p>

        <div className="space-y-6 bg-white rounded-xl shadow p-6">
          <div>
            <h2 className="text-xl font-semibold text-[#1e1e3f] mb-2">Blogs</h2>
            <p className="text-gray-600 mb-3 text-sm">
              Revalidates blogs listing and individual blog detail pages.
            </p>
            <RevalidateButton tag="blogs" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1e1e3f] mb-2">Testimonials</h2>
            <p className="text-gray-600 mb-3 text-sm">
              Revalidates the home page testimonials section and the testimonials API cache.
            </p>
            <RevalidateButton tag="testimonials" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1e1e3f] mb-2">Hero Slider (Home)</h2>
            <p className="text-gray-600 mb-3 text-sm">Revalidates the home page that renders the hero slider.</p>
            <RevalidateButton tag="hero" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1e1e3f] mb-2">Products</h2>
            <p className="text-gray-600 mb-3 text-sm">
              Revalidates the store listing and all product detail pages.
            </p>
            <RevalidateButton tag="products" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#1e1e3f] mb-2">All Relevant</h2>
            <p className="text-gray-600 mb-3 text-sm">
              Revalidates home, blogs listing/detail, and product pages.
            </p>
            <RevalidateButton tag="all" />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-[#1e1e3f] mb-2">cURL examples</h3>
          <pre className="bg-[#0b1027] text-white p-4 rounded-lg overflow-auto text-sm">
{`curl "http://localhost:8000/api/revalidate?tag=blogs"
curl "http://localhost:8000/api/revalidate?tag=testimonials"
curl "http://localhost:8000/api/revalidate?tag=hero"
curl "http://localhost:8000/api/revalidate?tag=products"
curl "http://localhost:8000/api/revalidate?tag=all"`}
          </pre>
        </div>
      </div>
    </div>
  )
}
