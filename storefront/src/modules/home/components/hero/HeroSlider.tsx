"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

type SlideItem = {
  src: string
  alt: string
  href?: string
  duration?: number // seconds
  isForMobile?: boolean
}

const slides: SlideItem[] = [
  { src: "/hero1.mp4", alt: "Hero video 1", href: "/in/custom-kit" },
  { src: "/hero2.mp4", alt: "Hero video 2", href: "/in/contact" },
  { src: "/hero3.mp4", alt: "Hero video 3", href: "/in/partnership-program" },
]

// Helper to detect if a slide is a video based on file extension
const isVideoSrc = (src: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(src)

function VideoSwiper({
  slides,
  navId,
  aspectRatioClass = "aspect-[4/5] sm:aspect-video",
}: {
  slides: SlideItem[]
  navId: string
  aspectRatioClass?: string
}) {
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const swiperRef = useRef<SwiperType | null>(null)
  const lastActiveRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const DEFAULT_IMAGE_DURATION = 5 // seconds

  const clearSlideTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const startSlideTimer = (index: number) => {
    clearSlideTimer()
    const item = slides[index]
    if (!item) return
    const isVid = isVideoSrc(item.src)
    // If image: use provided duration or default 5s. If video: only use duration when explicitly provided.
    const d = isVid ? item.duration : item.duration ?? DEFAULT_IMAGE_DURATION
    if (typeof d === "number" && d > 0) {
      timerRef.current = setTimeout(() => {
        const swiper = swiperRef.current
        if (swiper && swiper.realIndex === index) swiper.slideNext()
      }, d * 1000)
    }
  }

  const playWhenReady = (v: HTMLVideoElement) => {
    if (!v) return
    if (v.readyState >= 2) v.play().catch(() => {})
    else
      v.addEventListener("canplay", () => v.play().catch(() => {}), {
        once: true,
      })
  }

  useEffect(() => () => clearSlideTimer(), [])

  return (
    <div className={`relative w-full ${aspectRatioClass}`}>
      <div className="absolute inset-0">
        <Swiper
          modules={[Pagination, Navigation]}
          rewind
          pagination={{ clickable: true }}
          navigation={{
            prevEl: `.hero-prev-${navId}`,
            nextEl: `.hero-next-${navId}`,
          }}
          speed={0}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          onInit={(swiper) => {
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
          className="w-full h-full"
        >
          {slides.map((s, i) => {
            const isVid = isVideoSrc(s.src)
            const media = isVid ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current[i] = el
                }}
                src={s.src}
                aria-label={s.alt}
                className="w-full h-full object-cover"
                muted
                playsInline
                autoPlay
                preload="auto"
                onEnded={() => {
                  const swiper = swiperRef.current
                  if (!swiper) return
                  // Advance on end only when no explicit duration override is set
                  if (s.duration == null && swiper.realIndex === i)
                    swiper.slideNext()
                }}
              />
            ) : (
              <img
                src={s.src}
                alt={s.alt}
                className="w-full h-full object-cover"
                loading="eager"
              />
            )

            return (
              <SwiperSlide key={`${s.src}-${i}`} className="w-full h-full">
                {s.href ? (
                  s.href.startsWith("http") ? (
                    <a
                      href={s.href}
                      aria-label={s.alt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      {media}
                    </a>
                  ) : (
                    <Link
                      href={s.href}
                      aria-label={s.alt}
                      className="block w-full h-full"
                    >
                      {media}
                    </Link>
                  )
                ) : (
                  media
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      {/* Navigation buttons for this instance */}
      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-40 flex items-center justify-between px-2 sm:px-4">
        <button
          aria-label="Previous slide"
          className={`hero-prev-${navId} pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 sm:h-12 sm:w-12`}
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
          className={`hero-next-${navId} pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70 sm:h-12 sm:w-12`}
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

export default function HeroSlider() {
  const mobileSlides = slides.filter((s) => s.isForMobile)
  const desktopSlides = slides.filter((s) => !s.isForMobile)

  // Distinct aspect ratios per breakpoint; adjust as needed
  const MOBILE_ASPECT = "aspect-[3/4]" // Taller on mobile
  const DESKTOP_ASPECT = "aspect-[8/3]" // 16:9 on desktop

  if (mobileSlides.length > 0) {
    return (
      <>
        <div className="sm:hidden">
          <VideoSwiper
            slides={mobileSlides}
            navId="mobile"
            aspectRatioClass={MOBILE_ASPECT}
          />
        </div>
        <div className="hidden sm:block">
          <VideoSwiper
            slides={desktopSlides}
            navId="desktop"
            aspectRatioClass={DESKTOP_ASPECT}
          />
        </div>
      </>
    )
  }

  return (
    <VideoSwiper
      slides={desktopSlides}
      navId="all"
      aspectRatioClass={`${MOBILE_ASPECT} sm:${DESKTOP_ASPECT}`}
    />
  )
}
