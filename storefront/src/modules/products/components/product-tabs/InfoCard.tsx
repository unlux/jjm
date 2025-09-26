import React from "react"
import { Comic_Neue } from "next/font/google"

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
    className={`p-6 rounded-3xl shadow-md hover:shadow-xl
                hover:scale-[1.02] hover:rotate-[0.5deg]
                transition-transform duration-300 ease-out ${bg}`}
  >
    <div className="flex items-center mb-4">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full bg-${color}-100 text-${color}-600 shadow-sm mr-3`}
      >
        {icon}
      </div>
      <h3 className={`text-lg font-semibold text-${color}-700`}>{title}</h3>
    </div>
    <div className={`text-gray-700 leading-relaxed ${comicNeue.className}`}>
      {children}
    </div>
  </div>
)

export default InfoCard
