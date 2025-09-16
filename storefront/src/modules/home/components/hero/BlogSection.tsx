"use client"

import "keen-slider/keen-slider.min.css"
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react"
import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useState, FC, useRef } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react"

// --- User's CometCard Component ---
export function CometCard({
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  children,
}: {
  rotateDepth?: number
  translateDepth?: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`-${rotateDepth}deg`, `${rotateDepth}deg`]
  )
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`${rotateDepth}deg`, `-${rotateDepth}deg`]
  )
  const translateX = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    [`-${translateDepth}px`, `${translateDepth}px`]
  )
  const translateY = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    [`${translateDepth}px`, `-${translateDepth}px`]
  )

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100])
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.75) 20%, rgba(255, 255, 255, 0) 80%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className={`[perspective:1000px] transform-gpu ${className}`}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          boxShadow:
            "rgba(0, 0, 0, 0.01) 0px 520px 146px 0px, rgba(0, 0, 0, 0.04) 0px 333px 133px 0px, rgba(0, 0, 0, 0.26) 0px 83px 83px 0px, rgba(0, 0, 0, 0.29) 0px 21px 46px 0px",
        }}
        initial={{ scale: 1, z: 0 }}
        whileHover={{ scale: 1.03, z: 50, transition: { duration: 0.2 } }}
        className="relative rounded-2xl will-change-transform"
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 z-50 h-full w-full rounded-[16px] mix-blend-overlay"
          style={{ background: glareBackground, opacity: 0.6 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  )
}

// --- Blog Carousel Code ---

type Blog = {
  id: string
  title: string
  excerpt?: string
  image: string
  category?: string
  tags?: string[]
  publishedAt?: string
  date?: string
  author?: string
  authorImage?: string
}

const formatDate = (iso?: string) =>
  new Date(iso || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
const categoryColor = (name: string = "") => {
  const colors = [
    "bg-blue-50 text-blue-800",
    "bg-green-50 text-green-800",
    "bg-orange-50 text-orange-800",
    "bg-purple-50 text-purple-800",
    "bg-pink-50 text-pink-800",
  ]
  const idx =
    Math.abs(name.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) %
    colors.length
  return colors[idx]
}
const readTime = (blog: Pick<Blog, "title" | "excerpt">) => {
  const text = `${blog?.title || ""} ${blog?.excerpt || ""}`
  const words = Math.max(50, text.trim().split(/\s+/).length)
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

const SkeletonCard: FC = () => (
  <div className="h-full rounded-2xl bg-white p-1 shadow-md">
    <div className="h-full rounded-[15px] bg-white overflow-hidden animate-pulse">
      <div className="h-[240px] w-full bg-gray-200" />
      <div className="p-5 space-y-4">
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-5 w-full bg-gray-200 rounded" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gray-200 rounded-full" />
            <div className="w-20 h-4 bg-gray-200 rounded" />
          </div>
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
)

const BlogCard: FC<{ blog: Blog; isNew: boolean }> = ({ blog, isNew }) => (
  // Increased padding here gives the card more margin inside the slide
  <div className="keen-slider__slide h-full p-3 sm:p-4">
    <Link href={`/blogs/${blog.id}`} className="block h-full group">
      <CometCard className="h-full">
        <div className="relative z-10 flex flex-col h-full rounded-2xl bg-white overflow-hidden">
          <div className="relative">
            <Image
              src={blog.image}
              alt={blog.title}
              width={500}
              height={300}
              className="w-full h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              {blog.category && (
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${categoryColor(
                    blog.category
                  )}`}
                >
                  {blog.category}
                </span>
              )}
              {isNew && (
                <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-white shadow-lg">
                  New
                </span>
              )}
            </div>
          </div>
          <div className="p-5 flex flex-col flex-grow">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <p>{formatDate(blog.publishedAt || blog.date)}</p>
              <span>{readTime(blog)}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              {blog.title}
            </h3>
            {blog.excerpt && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-3 flex-grow">
                {blog.excerpt}
              </p>
            )}
            <div className="mt-auto pt-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {blog.authorImage ? (
                  <Image
                    src={blog.authorImage}
                    alt={blog.author || "Author"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">
                    {(blog.author || "?").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {blog.author || "Joy Junction Team"}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Read
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </CometCard>
    </Link>
  </div>
)

export default function BlogCarousel() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slideCount, setSlideCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function loadBlogs() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/blogs?limit=9`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`We couldn't fetch the latest stories.`)
        const data = await res.json()
        setBlogs(data.blogs || [])
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadBlogs()
    return () => controller.abort()
  }, [])

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      slides: {
        perView: 3,
        spacing: 0,
      },
      breakpoints: {
        "(max-width: 1024px)": {
          slides: { perView: 2, spacing: 0 },
        },
        "(max-width: 640px)": {
          slides: { perView: 1, spacing: 0 },
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
          const total = (slider.track?.details?.maxIdx ?? 0) + 1
          setSlideCount(total)
          nextTimeout()
        })

        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", () => {
          const total = (slider.track?.details?.maxIdx ?? 0) + 1
          setSlideCount(total)
          nextTimeout()
        })

        slider.on("slideChanged", () => {
          setCurrentSlide(slider.track.details.rel)
        })

        // Add mouse events to pause autoplay on hover
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
    <section className="bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <p className="uppercase text-sm tracking-widest text-[#262b5f] font-semibold mb-2 text-center font-fredoka">
          Our Blog
        </p>
        <h2 className="text-4xl font-bold text-center text-[#1e1e3f] mb-4 font-baloo">
          Latest Updates
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Discover insights and ideas to make playtime more educational and fun
          for your children
        </p>

        {loading && <div className="text-center text-gray-600">Loading…</div>}
        {!loading && error && (
          <div className="text-center text-red-600">{error}</div>
        )}
        {!loading && !error && (
          <div ref={sliderRef} className="keen-slider">
            {blogs.map((blog: any, i: number) => (
              <div key={i} className="keen-slider__slide h-full">
                <Link href={`/blogs/${blog.id}`} className="block h-full group">
                  {/* Internal spacing and fixed-size card container */}
                  <div className="h-[480px] p-4 sm:p-5">
                    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 group h-full flex flex-col">
                      <div className="relative overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          width={500}
                          height={300}
                          className="w-full h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold text-[#262b5f]">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <p className="text-xs text-gray-500 mb-2 flex items-center">
                          <span className="inline-block w-4 h-[2px] bg-[#262b5f] mr-2"></span>
                          {blog.date}
                        </p>
                        <h3 className="text-lg font-bold text-[#1e1e3f] leading-snug group-hover:text-[#262b5f] transition-colors line-clamp-2 min-h-[3.5rem]">
                          {blog.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-center mt-10 gap-6">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="w-10 h-10 rounded-full border border-[#262b5f] flex items-center justify-center text-[#262b5f] hover:bg-[#262b5f] hover:text-white transition-colors"
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
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === idx
                    ? "bg-[#262b5f] w-8"
                    : "bg-[#cfcfcf] hover:bg-[#262b5f]/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => instanceRef.current?.next()}
            className="w-10 h-10 rounded-full border border-[#262b5f] flex items-center justify-center text-[#262b5f] hover:bg-[#262b5f] hover:text-white transition-colors"
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
        <div className="mt-16 text-center">
          <Link
            href="/blogs"
            className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-transform hover:scale-105"
          >
            View All Our Stories
          </Link>
        </div>
      </div>
    </section>
  )
}
