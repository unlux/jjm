// Server component: no client-only APIs used

import Link from "next/link"
import React from "react"

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "919321791644", // Default phone number with country code (India)
  message = "Hello! I'm interested in your educational toys.",
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`

  return (
    <div className="fixed bottom-4 right-4 z-40 group-[.menu-open]/nav:hidden sm:bottom-6 sm:right-6">
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-green-600 sm:px-5 sm:py-3"
      >
        <span className="xs:inline-block hidden text-sm font-medium sm:text-base">
          Chat With Me
        </span>
        <div className="relative h-5 w-5 sm:h-6 sm:w-6">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="h-5 w-5 -rotate-12 transform sm:h-6 sm:w-6"
          >
            <path d="M17.6 6.32A7.85 7.85 0 0 0 12 4a8 8 0 0 0-8 8c0 1.42.37 2.79 1.08 4l-1.08 4 4.13-1.08A7.72 7.72 0 0 0 12 20a8 8 0 0 0 8-8c0-2.12-.84-4.16-2.4-5.68zM12 18.5c-1.29 0-2.55-.34-3.65-.98l-.26-.16-2.71.71.72-2.64-.16-.28A6.5 6.5 0 0 1 5.5 12a6.5 6.5 0 0 1 6.5-6.5 6.33 6.33 0 0 1 4.55 1.88 6.41 6.41 0 0 1 1.95 4.62A6.5 6.5 0 0 1 12 18.5zm3.57-4.88c-.19-.1-1.15-.57-1.33-.63s-.31-.1-.44.1-.5.63-.61.76-.23.14-.42.05a5.32 5.32 0 0 1-1.56-.96 5.78 5.78 0 0 1-1.08-1.35c-.11-.19-.01-.3.08-.39s.19-.23.28-.34.13-.19.19-.32.03-.29-.01-.4-.44-1.06-.61-1.44c-.16-.38-.32-.32-.44-.32s-.24-.02-.37-.02-.34.05-.52.25-.68.67-.68 1.63c0 .96.7 1.9.8 2.03s1.37 2.1 3.32 2.94c.47.2.83.32 1.11.41.47.15.89.13 1.23.08.38-.06 1.15-.47 1.31-.92s.16-.84.11-.92-.17-.13-.36-.23z" />
          </svg>
        </div>
      </Link>
    </div>
  )
}

export default WhatsAppButton
