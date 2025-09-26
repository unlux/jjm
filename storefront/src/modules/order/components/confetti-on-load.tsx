"use client"

import { useEffect } from "react"

export default function ConfettiOnLoad() {
  useEffect(() => {
    let raf = 0
    let stopped = false

    const run = async () => {
      try {
        const { default: confetti } = await import("canvas-confetti")
        const end = Date.now() + 3 * 1000 // 3 seconds
        const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"]

        const frame = () => {
          if (stopped || Date.now() > end) return

          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            startVelocity: 60,
            origin: { x: 0, y: 0.5 },
            colors,
          })
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            startVelocity: 60,
            origin: { x: 1, y: 0.5 },
            colors,
          })

          raf = requestAnimationFrame(frame)
        }

        raf = requestAnimationFrame(frame)
      } catch (e) {
        // swallow errors in case of SSR/hydration edge cases
        console.error("Confetti failed to load:", e)
      }
    }

    // Respect prefers-reduced-motion
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!media.matches) run()

    return () => {
      stopped = true
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
