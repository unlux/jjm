// components/TopMarquee.tsx

"use client"

import React from "react"

type MarqueeProps = {
  messages: string[]
}

export default function TopMarquee({ messages }: MarqueeProps) {
  // Return null if there are no messages to prevent rendering an empty bar.
  if (!messages || messages.length === 0) {
    return null
  }

  return (
    <div className="group relative flex w-full overflow-x-hidden bg-blue-500 py-2 text-white">
      <div className="flex min-w-full shrink-0 animate-marquee items-center justify-around whitespace-nowrap text-xs font-medium motion-reduce:animate-none group-hover:[animation-play-state:paused] sm:text-sm">
        {/* Render each message as a span */}
        {messages.map((message, index) => (
          <span key={index} className="mx-8 opacity-90">
            {message}
          </span>
        ))}
      </div>

      {/* This is an identical, decorative block used to create the seamless loop effect */}
      <div
        aria-hidden="true"
        className="absolute top-0 flex min-w-full shrink-0 animate-marquee items-center justify-around whitespace-nowrap py-2 text-xs font-medium motion-reduce:animate-none group-hover:[animation-play-state:paused] sm:text-sm"
      >
        {messages.map((message, index) => (
          <span key={index} className="mx-8 opacity-90">
            {message}
          </span>
        ))}
      </div>
    </div>
  )
}
