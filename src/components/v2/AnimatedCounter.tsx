import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export default function AnimatedCounter({ value, duration = 1.2, suffix = '', prefix = '', decimals = 0, className = '' }: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const start = 0
    const end = value
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (end - start) * eased)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <motion.span ref={ref} className={className} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </motion.span>
  )
}
