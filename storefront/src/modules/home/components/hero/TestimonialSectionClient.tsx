"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

export type Testimonial = {
  id: string
  quote: string
  author: string
  role?: string
  image?: string
  rating: number
  isFeatured?: boolean
}

// Helper function to get size classes based on card size
const getSizeClasses = (size: string) => {
  switch (size) {
    case "small":
      return "p-4 min-h-[180px]"
    case "large":
      return "p-6 min-h-[240px]"
    default: // normal
      return "p-5 min-h-[200px]"
  }
}

// Render stars based on rating
const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
}

export default function TestimonialSectionClient({ testimonials }: { testimonials: Testimonial[] }) {
  // Set up Embla Carousel with autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 2 },
      },
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )

  // Track the current slide for the dots indicator
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [slideCount, setSlideCount] = useState(0)

  useEffect(() => {
    if (!emblaApi) return

    // Update slide count
    setSlideCount(Math.ceil(testimonials.length / 2))

    // Subscribe to carousel events
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, testimonials.length])

  return (
    <section className="w-full">
      {/* Testimonial Hero Image */}
      <div className="relative w-full h-[38vh] md:h-[45vh] lg:h-[60vh] overflow-hidden">
        <Image
          src={"/testimonial-picture.webp"}
          alt="Happy children playing with toys"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#262b5f] via-[#262b5f]/60 to-transparent">
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 font-baloo">
              Our Happy Customers
            </h2>
            <p className="text-lg text-white/80 max-w-2xl">
              See what our customers have to say about our products and services
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#262b5f] pt-10 sm:pt-12 pb-14 sm:pb-16 px-4 sm:px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-6">
            {/* Left Title Block */}
            <div className="md:col-span-1">
              <p className="uppercase text-sm tracking-widest text-gray-300 font-semibold mb-2 font-fredoka">
                Testimonials
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight font-baloo">
                What Our Clients Say About Us
              </h2>
              <p className="text-gray-300 text-md">
                We appreciate your kind and honest feedback and invite you to
                our amazing store.
              </p>
            </div>

            {/* Carousel Navigation */}
            <div className="md:col-span-2 flex items-center justify-end gap-4">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                aria-label="Previous testimonials"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                aria-label="Next testimonials"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Embla Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className={`flex-[0_0_100%] md:flex-[0_0_50%] px-2`}
                >
                  <div
                    className={`bg-white text-[#1e1e3f] rounded-xl shadow-md flex flex-col gap-3
                                    transition-all duration-300 hover:bg-green-800 hover:shadow-xl group
                                    ${getSizeClasses("normal")}`}
                  >
                    <span className="text-green-600 text-3xl leading-none group-hover:text-white transition-colors">
                      ❝
                    </span>
                    {(() => {
                      const parts = (testimonial.quote || "")
                        .split("\n")
                        .map((s) => s.trim())
                        .filter(Boolean)
                      const title = parts[0] || ""
                      const body = parts.slice(1).join(" ")
                      return (
                        <div className="space-y-2">
                          {title && (
                            <h3 className="font-semibold text-lg group-hover:text-white transition-colors">
                              {title}
                            </h3>
                          )}
                          {body && (
                            <p className="text-sm text-gray-700 group-hover:text-white transition-colors flex-grow line-clamp-3 md:line-clamp-none">
                              {body}
                            </p>
                          )}
                        </div>
                      )
                    })()}

                    <div className="flex items-center gap-3 mt-auto pt-3">
                      {testimonial.image ? (
                        <Image
                          src={"/avatar.jpg"}
                          alt={testimonial.author}
                          width={40}
                          height={40}
                          className="rounded-full ring-2 ring-transparent group-hover:ring-white transition-all object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm group-hover:text-white transition-colors">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-gray-500 group-hover:text-gray-200 transition-colors">
                          {testimonial.role}
                        </p>
                        <div className="flex">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === selectedIndex
                    ? "bg-cyan-400 scale-110"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
