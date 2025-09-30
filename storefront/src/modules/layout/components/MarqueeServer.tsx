import { listOffersCached } from "@/lib/repos/offers"

import Marquee from "./Marquee"

// Static server-rendered marquee with ISR matching offers cache window
export const revalidate = 3600
export const dynamic = "force-static"

export default async function MarqueeServer() {
  const offers = await listOffersCached({ isActive: true, limit: 10 })
  const messages = offers.map((o) => o.message).filter(Boolean)
  if (messages.length === 0) return null
  return <Marquee messages={messages} />
}
