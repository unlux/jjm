"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

type SlideItem = { src: string; alt: string; href?: string; duration?: number } // duration in seconds

const slides: SlideItem[] = [
  { src: "/hero1.mp4", alt: "Hero video 1", href: "/in/custom-kit" },
  { src: "/hero2.mp4", alt: "Hero video 2", href: "/in/contact" },
  { src: "/hero3.mp4", alt: "Hero video 3", href: "/in/partnership-program" },
]

export default function HeroSlider() {
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const swiperRef = useRef<SwiperType | null>(null)
  const lastActiveRef = useRef<number>(0)

  // Start playback only when the video can play to avoid first-paint restart
  const playWhenReady = (v: HTMLVideoElement) => {
    if (!v) return
    if (v.readyState >= 2) {
      v.play().catch(() => {})
    } else {
      const onCanPlay = () => {
        v.play().catch(() => {})
      }
      v.addEventListener("canplay", onCanPlay, { once: true })
    }
  }
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearSlideTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const startSlideTimer = (index: number) => {
    clearSlideTimer()
    const d = slides[index]?.duration
    if (typeof d === "number" && d > 0) {
      timerRef.current = setTimeout(() => {
        const swiper = swiperRef.current
        if (swiper && swiper.realIndex === index) {
          swiper.slideNext()
        }
      }, d * 1000)
    }
  }

  useEffect(() => () => clearSlideTimer(), [])

  return (
    <div className="relative w-full overflow-hidden">
      <Swiper
        modules={[Pagination, Navigation]}
        // Use rewind to avoid DOM cloning on init that can cause restarts
        rewind
        pagination={{ clickable: true }}
        navigation={{ prevEl: ".hero-prev", nextEl: ".hero-next" }}
        speed={0}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onInit={(swiper) => {
          // Play only the active slide's video on init
          const active = swiper.realIndex
          lastActiveRef.current = active
          videoRefs.current.forEach((v, i) => {
            if (!v) return
            if (i === active) playWhenReady(v)
            else v.pause()
          })
          startSlideTimer(active)
        }}
        onSlideChange={(swiper) => {
          // Pause all, play the newly active slide
          const active = swiper.realIndex
          if (lastActiveRef.current === active) return
          lastActiveRef.current = active
          clearSlideTimer()
          videoRefs.current.forEach((v, i) => {
            if (!v) return
            if (i === active) {
              try {
                v.currentTime = 0
              } catch {}
              playWhenReady(v)
            } else {
              v.pause()
            }
          })
          startSlideTimer(active)
        }}
        className="w-full"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={s.src}>
            {s.href ? (
              s.href.startsWith("http") ? (
                <a
                  href={s.href}
                  aria-label={s.alt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[i] = el
                    }}
                    src={s.src}
                    aria-label={s.alt}
                    className="w-full h-auto object-cover"
                    muted
                    playsInline
                    preload="auto"
                    onEnded={() => {
                      const swiper = swiperRef.current
                      if (!swiper) return
                      // If a custom duration is set, we let the timer control the advance
                      if (slides[i]?.duration == null && swiper.realIndex === i)
                        swiper.slideNext()
                    }}
                  />
                </a>
              ) : (
                <Link href={s.href} aria-label={s.alt} className="block">
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[i] = el
                    }}
                    src={s.src}
                    aria-label={s.alt}
                    className="w-full h-auto object-cover"
                    muted
                    playsInline
                    preload="auto"
                    onEnded={() => {
                      const swiper = swiperRef.current
                      if (!swiper) return
                      if (slides[i]?.duration == null && swiper.realIndex === i)
                        swiper.slideNext()
                    }}
                  />
                </Link>
              )
            ) : (
              <video
                ref={(el) => {
                  if (el) videoRefs.current[i] = el
                }}
                src={s.src}
                aria-label={s.alt}
                className="w-full h-auto object-cover"
                muted
                playsInline
                preload="auto"
                onEnded={() => {
                  const swiper = swiperRef.current
                  if (!swiper) return
                  if (slides[i]?.duration == null && swiper.realIndex === i)
                    swiper.slideNext()
                }}
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Navigation buttons */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-40 flex items-center justify-between px-2 sm:px-4">
        <button
          aria-label="Previous slide"
          className="hero-prev pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 sm:h-12 sm:w-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 sm:h-6 sm:w-6"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          aria-label="Next slide"
          className="hero-next pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 sm:h-12 sm:w-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 sm:h-6 sm:w-6"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="absolute inset-0 animate-fadeIn pointer-events-none z-30" />
    </div>
  )
}
