"use client"

import React, { useCallback, useEffect, useRef } from "react"

type Spark = {
  x: number
  y: number
  angle: number
  startTime: number
  color: string
}

const COLORS = [
  "#FF7F00", // orange
  "#FF0000", // red
  "#00FF00", // green
  "#FFFF00", // yellow
  "#8B00FF", // violet
  "#4B0082", // indigo
  "#0000FF", // blue
]

const ClickSparkOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sparksRef = useRef<Spark[]>([])
  const rafRef = useRef<number | null>(null)
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 })

  // Tunables (kept subtle and slightly smaller by 10 percent)
  const DURATION = 420 // ms
  const RAY_COUNT = 7 // one ray per rainbow color
  const BASE_SPREAD = 25 * 0.9 // was 25, 10% smaller
  const BASE_LINE_LEN = 14 * 0.9 // was 14, 10% smaller
  const RAY_WIDTH = 2.0 // thicker rays
  const BORDER_EXTRA = 0.2 // border width over the ray width

  const easeOut = useCallback((t: number) => t * (2 - t), [])

  // Resize and DPR handling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const w = window.innerWidth
      const h = window.innerHeight
      dimsRef.current = { w, h, dpr }

      // set actual pixel size and keep CSS size in px
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      // set transform so we draw in CSS pixels (easier math)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = "round"
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = (now: number) => {
      const { w, h } = dimsRef.current
      // clear in CSS pixel space
      ctx.clearRect(0, 0, w, h)

      const next: Spark[] = []
      for (let i = 0; i < sparksRef.current.length; i++) {
        const s = sparksRef.current[i]
        const elapsed = now - s.startTime
        if (elapsed >= DURATION) {
          continue // drop
        }

        const progress = Math.max(0, Math.min(1, elapsed / DURATION))
        const eased = easeOut(progress)

        const distance = eased * BASE_SPREAD
        const lineLength = BASE_LINE_LEN * (1 - eased)

        const x1 = s.x + distance * Math.cos(s.angle)
        const y1 = s.y + distance * Math.sin(s.angle)
        const x2 = s.x + (distance + lineLength) * Math.cos(s.angle)
        const y2 = s.y + (distance + lineLength) * Math.sin(s.angle)

        // subtle fade
        ctx.globalAlpha = 1 - progress * 0.95

        // black border
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = "rgba(0,0,0,0.75)"
        ctx.lineWidth = RAY_WIDTH + BORDER_EXTRA
        ctx.stroke()

        // colored ray with small glow
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = s.color
        ctx.lineWidth = RAY_WIDTH
        ctx.shadowColor = s.color
        ctx.shadowBlur = 4
        ctx.stroke()

        // reset shadow and alpha for safety
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1

        next.push(s)
      }

      sparksRef.current = next
      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [easeOut])

  // Global click listener that spawns a 7-color ray set with random rotation
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const now = performance.now()

      const rotation = Math.random() * Math.PI * 2
      const jitterRange = 0.15 // small angle jitter so it's not perfectly rigid
      const newSparks: Spark[] = Array.from({ length: RAY_COUNT }, (_, i) => {
        const jitter = Math.random() * jitterRange * 2 - jitterRange
        const angle = rotation + (i * Math.PI * 2) / RAY_COUNT + jitter
        return {
          x,
          y,
          angle,
          startTime: now,
          color: COLORS[i % COLORS.length],
        }
      })

      sparksRef.current.push(...newSparks)
    }

    document.addEventListener("click", handleClick, { passive: true })
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
    />
  )
}

export default ClickSparkOverlay
