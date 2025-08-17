"use client"
import { useRef } from "react"
import { useRouter } from "next/navigation"

export default function HeroSlider() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  return (
    <div className="relative w-full overflow-hidden">
      <video
        ref={videoRef}
        src="/outputx.mp4"
        className="w-full h-auto object-cover brightness-[0.9]"
        autoPlay
        loop
        muted
        playsInline
        style={{ cursor: "pointer" }}
      />
      <div className="absolute inset-0 animate-fadeIn z-30" />
    </div>
  )
}
