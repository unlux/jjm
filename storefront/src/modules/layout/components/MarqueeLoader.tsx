"use client"

import React, { useEffect, useState } from "react"
import Marquee from "./Marquee"

export default function MarqueeLoader() {
  const [messages, setMessages] = useState<string[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/offers?isActive=true&limit=10", { next: { revalidate: 3600 } })
        if (!res.ok) throw new Error("Failed to fetch offers")
        const data = await res.json()
        const msgs: string[] = (data?.offers ?? [])
          .filter((o: any) => !!o?.message)
          .map((o: any) => o.message as string)
        setMessages(msgs)
      } catch (e) {
        setError("Failed to load offers")
        setMessages([])
      }
    }
    fetchOffers()
  }, [])

  if (!messages || messages.length === 0) return null
  return <Marquee messages={messages} />
}
