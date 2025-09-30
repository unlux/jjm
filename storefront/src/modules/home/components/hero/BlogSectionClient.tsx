"use client"

import "keen-slider/keen-slider.min.css"

import { useKeenSlider } from "keen-slider/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function BlogSectionClient({ blogs }: { blogs: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 3,
        spacing: 24,
      },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 2, spacing: 20 },
        },
        "(max-width: 640px)": {
          slides: { perView: 1, spacing: 16 },
        },
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>
        let mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 5000)
        }

        slider.on("created", () => {
          nextTimeout()
        })

        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)

        slider.on("slideChanged", () => {
          setCurrentSlide(slider.track.details.rel)
        })

        const sliderContainer = slider.container
        sliderContainer.addEventListener("mouseover", () => {
          mouseOver = true
          clearNextTimeout()
        })
        sliderContainer.addEventListener("mouseout", () => {
          mouseOver = false
          nextTimeout()
        })
      },
    ]
  )

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="font-fredoka mb-2 text-center text-sm font-semibold uppercase tracking-widest text-[#262b5f]">
          Our Blog
        </p>
        <h2 className="font-baloo mb-4 text-center text-4xl font-bold text-[#1e1e3f]">
          Latest Updates
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
          Discover insights and ideas to make playtime more educational and fun
          for your children
        </p>

        <div ref={sliderRef} className="keen-slider">
          {blogs.map((blog: any, i: number) => (
            <div key={i} className="keen-slider__slide">
              <Link href={`/blogs/${blog.id}`} className="block h-full">
                <div className="group flex h-[400px] flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300">
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
                      {blog.date}
                    </p>
                    <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-snug text-[#1e1e3f] transition-colors group-hover:text-[#262b5f]">
                      {blog.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#262b5f] text-[#262b5f] transition-colors hover:bg-[#262b5f] hover:text-white"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {[...Array(Math.min(5, blogs.length))].map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  currentSlide === idx
                    ? "w-8 bg-[#262b5f]"
                    : "bg-[#cfcfcf] hover:bg-[#262b5f]/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => instanceRef.current?.next()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#262b5f] text-[#262b5f] transition-colors hover:bg-[#262b5f] hover:text-white"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        {/* View All Blogs Button */}
        <div className="mt-10 text-center">
          <Link
            href="/blogs"
            className="inline-block rounded-lg bg-[#262b5f] px-6 py-3 text-white transition-colors hover:bg-opacity-90"
          >
            View All Blogs
          </Link>
        </div>
      </div>
    </section>
  )
}
