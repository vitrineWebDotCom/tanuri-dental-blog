"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade"
}

export function ScrollAnimation({ 
  children, 
  className, 
  delay = 0,
  direction = "up" 
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px",
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getInitialStyles = () => {
    switch (direction) {
      case "up":
        return "opacity-0 translate-y-8"
      case "down":
        return "opacity-0 -translate-y-8"
      case "left":
        return "opacity-0 translate-x-8"
      case "right":
        return "opacity-0 -translate-x-8"
      case "scale":
        return "opacity-0 scale-95"
      case "fade":
        return "opacity-0"
      default:
        return "opacity-0 translate-y-8"
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        getInitialStyles(),
        "transition-all duration-700 ease-out",
        isVisible && "opacity-100 translate-y-0 translate-x-0 scale-100",
        className
      )}
    >
      {children}
    </div>
  )
}
