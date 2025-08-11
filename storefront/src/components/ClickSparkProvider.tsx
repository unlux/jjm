"use client"

import React from "react"
import { ClickSpark } from "@appletosolutions/reactbits"

interface ClickSparkProviderProps {
  children: React.ReactNode
}

export default function ClickSparkProvider({ children }: ClickSparkProviderProps) {
  return (
    <ClickSpark
      sparkColor="#F97316"
      sparkSize={10}
      sparkRadius={18}
      sparkCount={12}
      duration={500}
      easing="ease-out"
    >
      {children}
    </ClickSpark>
  )
}