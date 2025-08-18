"use client"
import { useRef, useEffect } from "react"

export default function HeroSlider() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Start playback
      video.play().catch((error) => {
        // Autoplay was prevented. This is common in some browsers.
        // The `muted` prop should handle most cases, but this is a fallback.
        console.error("Video autoplay was prevented:", error)
      })
    }
  }, [])

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    const video = e.currentTarget
    // Log more specific error details if available
    if (video && video.error) {
      console.error("Video Error Code:", video.error.code)
      console.error("Video Error Message:", video.error.message)

      // Simple retry logic: try to load and play again
      console.log("An error occurred. Attempting to reload video...")
      video.load()
      video.play().catch((playError) => {
        console.error("Failed to play video on retry:", playError)
      })
    } else {
      console.error("An unknown video error occurred", e)
    }
  }

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
        preload="auto"
        onError={handleVideoError}
        style={{ cursor: "pointer" }}
      />
      <div className="absolute inset-0 animate-fadeIn z-30" />
    </div>
  )
}
