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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderLoaded, setSliderLoaded] = useState(false)

  const slidePlugin: KeenSliderPlugin = (slider) => {
    slider.on("created", () => setSliderLoaded(true))
    slider.on("slideChanged", () => setCurrentSlide(slider.track.details.rel))
  }

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      renderMode: "performance",
      drag: false,
      // Stick cards together (no spacing between slides)
      breakpoints: {
        "(min-width: 768px)": { slides: { perView: 2, spacing: 0 } },
        "(min-width: 1024px)": { slides: { perView: 3, spacing: 0 } },
      },
      slides: { perView: 1, spacing: 0 },
    },
    [slidePlugin]
  )

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

  const slideCount = instanceRef.current?.track.details.slides.length ?? 0

  return (
    <section className="bg-slate-50 py-20 sm:py-24 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider font-fredoka">
            <span>✨</span> Our Blog
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-3 font-baloo">
            Fresh & Fun Reads
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover ideas and inspiration to make playtime more educational and
            joyful.
          </p>
        </div>
        <div className="relative">
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          )}
          {!loading && error && (
            <div
              className="text-center bg-red-50 text-red-700 p-8 rounded-lg"
              aria-live="polite"
            >
              <p className="font-semibold mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
            </div>
          )}
          {!loading && !error && (
            <>
              <div ref={sliderRef} className="keen-slider">
                {blogs.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} isNew={i < 3} />
                ))}
              </div>
              {sliderLoaded && instanceRef.current && (
                <>
                  <button
                    onClick={() => instanceRef.current?.prev()}
                    className="absolute top-1/2 -translate-y-1/2 -left-0 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-white transition-colors hidden lg:flex"
                    aria-label="Previous slide"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => instanceRef.current?.next()}
                    className="absolute top-1/2 -translate-y-1/2 -right-0 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-primary hover:bg-white transition-colors hidden lg:flex"
                    aria-label="Next slide"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                  {/* Dots with animated active pill and progress bar */}
                  <div className="mt-12 flex justify-center">
                    <div className="relative bg-white/70 backdrop-blur-sm rounded-full px-3 py-2 flex items-center gap-2 shadow-inner">
                      {/* progress bar */}
                      <div className="absolute left-0 top-0 h-full w-full rounded-full overflow-hidden pointer-events-none">
                        <div
                          className="h-full bg-primary/10 transition-[width] duration-500"
                          style={{ width: `${((currentSlide + 1) / Math.max(1, slideCount)) * 100}%` }}
                        />
                      </div>
                      {Array.from({ length: slideCount }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => instanceRef.current?.moveToIdx(idx)}
                          className={`relative z-10 h-2.5 rounded-full transition-all ${
                            currentSlide === idx
                              ? "bg-primary w-8"
                              : "bg-gray-300 hover:bg-primary/50 w-2.5"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
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
