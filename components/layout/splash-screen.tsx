"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      id="splash-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background text-white transition-opacity duration-500"
    >
      <div className="animate-pulse-scale">
        <Image
          src="/invest-smart.png"
          alt="Invest Smart Logo"
          className="w-40"
          width={160}
          height={160}
          style={{ aspectRatio: "1024 / 724" }}
        />
      </div>
    </div>
  )
}
