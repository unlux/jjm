"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"

type RotatingBadgeProps = {
  href: string
  centerIconSrc: string
  centerIconAlt?: string
  text?: string
  className?: string
  diameterClassName?: string // Tailwind width/height classes for responsiveness
  spinDurationSec?: number // default 12s
  nudgeClassName?: string // optional translate-x/y utilities for fine nudging
}

/**
 * RotatingBadge combines circular text and a centered icon into a single, overflow-safe unit.
 * - Uses SVG textPath for crisp circular text at any size.
 * - Container clips overflow to avoid causing horizontal scroll on mobile.
 * - Rotation speed matches previous design (default 12s) and is adjustable.
 */
export default function RotatingBadge({
  href,
  centerIconSrc,
  centerIconAlt = "",
  text = "ABOUT US",
  className = "",
  diameterClassName = "w-[110px] h-[110px] md:w-[128px] md:h-[128px] lg:w-[148px] lg:h-[148px]",
  spinDurationSec = 12,
  nudgeClassName = "",
}: RotatingBadgeProps) {
  // Repeat text with separators to fill circle nicely
  const repeated = Array(8).fill(`${text} • `).join("")

  // Smooth rotation using rAF to avoid animation restart on hover speed changes
  const svgGroupRef = useRef<SVGGElement | null>(null)

  // start rotation loop
  useSmoothRotation(svgGroupRef, spinDurationSec)

  return (
    <Link
      href={href}
      className={clsx(
        "pointer-events-auto select-none block",
        "relative isolate rounded-full",
        "[contain:layout_paint] [will-change:transform]",
        "overflow-hidden", // prevents any overflow from circular letters
        diameterClassName,
        nudgeClassName,
        className
      )}
      aria-label={text}
    >
      {/* SVG Circular Text */}
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx("absolute inset-0 w-full h-full")}
        role="img"
        aria-hidden="true"
      >
        <defs>
          <path
            id="rb-circle-path"
            d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0"
            pathLength="251.2"
          />
        </defs>
        <g ref={svgGroupRef}>
          <text
            fill="#181D4E"
            fontSize="9"
            fontWeight={600}
            lengthAdjust="spacingAndGlyphs"
          >
            <textPath
              href="#rb-circle-path"
              startOffset="0"
              textAnchor="start"
              alignmentBaseline="middle"
              textLength="251.2"
            >
              {repeated}
            </textPath>
          </text>
        </g>
      </svg>

      {/* Center Icon */}
      <span className="absolute inset-0 grid place-items-center">
        <Image
          src={centerIconSrc}
          alt={centerIconAlt}
          width={120}
          height={120}
          className="w-[50%] h-[50%] object-contain"
          priority={false}
        />
      </span>

      {/* End of badge */}
    </Link>
  )
}

// Run rotation loop at constant speed
function useSmoothRotation(
  ref: React.RefObject<SVGGElement>,
  baseDurationSec: number
) {
  useEffect(() => {
    let rafId = 0
    let last = performance.now()
    let angle = 0
    const baseSpeedDegPerMs = 360 / (baseDurationSec * 1000) // deg/ms

    const loop = (now: number) => {
      const dt = now - last
      last = now
      angle = (angle + dt * baseSpeedDegPerMs) % 360
      if (ref.current) {
        ref.current.setAttribute("transform", `rotate(${angle} 50 50)`) // rotate around center
      }
      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [ref, baseDurationSec])
}
