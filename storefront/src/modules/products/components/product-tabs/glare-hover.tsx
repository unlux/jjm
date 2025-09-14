import React, { useRef } from "react"

interface GlareEffectProps {
  children: React.ReactNode
  glareColor?: string
  glareOpacity?: number
  glareAngle?: number
  glareSize?: number
  transitionDuration?: number
  playOnce?: boolean
  className?: string
}

const GlareEffect: React.FC<GlareEffectProps> = ({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = "",
}) => {
  const hex = glareColor.replace("#", "")
  let rgba = glareColor

  if (/^[\dA-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`
  } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16)
    const g = parseInt(hex[1] + hex[1], 16)
    const b = parseInt(hex[2] + hex[2], 16)
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`
  }

  const overlayRef = useRef<HTMLDivElement>(null)

  const animateIn = () => {
    const el = overlayRef.current
    if (!el) return

    el.style.transition = "none"
    el.style.backgroundPosition = "-100% -100%, 0 0"
    el.style.transition = `${transitionDuration}ms ease`
    el.style.backgroundPosition = "100% 100%, 0 0"
  }

  const animateOut = () => {
    const el = overlayRef.current
    if (!el) return

    if (playOnce) {
      el.style.transition = "none"
      el.style.backgroundPosition = "-100% -100%, 0 0"
    } else {
      el.style.transition = `${transitionDuration}ms ease`
      el.style.backgroundPosition = "-100% -100%, 0 0"
    }
  }

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background: `linear-gradient(${glareAngle}deg,
        hsla(0,0%,0%,0) 60%,
        ${rgba} 70%,
        hsla(0,0%,0%,0) 100%)`,
    backgroundSize: `${glareSize}% ${glareSize}%, 100% 100%`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-100% -100%, 0 0",
    pointerEvents: "none",
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={animateIn}
      onMouseLeave={animateOut}
    >
      {children}
      <div ref={overlayRef} style={overlayStyle} />
    </div>
  )
}

export default GlareEffect
