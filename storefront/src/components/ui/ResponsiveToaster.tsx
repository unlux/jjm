"use client"

import { useEffect, useState } from "react"
import { Toaster } from "sonner"

export default function ResponsiveToaster() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)")
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in e ? e.matches : (e as MediaQueryList).matches)
    }

    // Initialize
    handler(query)

    // Listen for changes (support older Safari without addEventListener)
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", handler)
      return () => query.removeEventListener("change", handler)
    } else if (typeof (query as any).addListener === "function") {
      ;(query as any).addListener(handler)
      return () => (query as any).removeListener(handler)
    }
  }, [])

  return (
    <Toaster
      position={isMobile ? "top-center" : "bottom-right"}
      richColors
      closeButton
      toastOptions={{
        duration: 2500,
      }}
    />
  )
}
