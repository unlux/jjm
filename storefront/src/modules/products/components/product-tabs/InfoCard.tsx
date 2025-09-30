import { Comic_Neue } from "next/font/google"
import React from "react"

const comicNeue = Comic_Neue({ subsets: ["latin"], weight: ["400"] })

interface InfoCardProps {
  icon: React.ReactNode
  title: string
  color: string
  bg: string
  children: React.ReactNode
}

export const InfoCard = ({
  icon,
  title,
  color,
  bg,
  children,
}: InfoCardProps) => (
  <div
    className={`rounded-3xl p-6 shadow-md transition-transform duration-300 ease-out hover:rotate-[0.5deg] hover:scale-[1.02] hover:shadow-xl ${bg}`}
  >
    <div className="mb-4 flex items-center">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-${color}-100 text-${color}-600 mr-3 shadow-sm`}
      >
        {icon}
      </div>
      <h3 className={`text-lg font-semibold text-${color}-700`}>{title}</h3>
    </div>
    <div className={`leading-relaxed text-gray-700 ${comicNeue.className}`}>
      {children}
    </div>
  </div>
)

export default InfoCard
