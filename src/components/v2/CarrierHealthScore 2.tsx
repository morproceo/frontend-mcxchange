import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface HealthCategory {
  name: string
  weight: number
  score: number
  color: string
}

interface CarrierHealthScoreProps {
  score: number
  size?: number
  categories?: HealthCategory[]
}

const DEFAULT_CATEGORIES: HealthCategory[] = [
  { name: 'Safety', weight: 25, score: 88, color: '#10b981' },
  { name: 'Compliance', weight: 25, score: 92, color: '#6366f1' },
  { name: 'Insurance', weight: 20, score: 95, color: '#06b6d4' },
  { name: 'Fleet', weight: 15, score: 70, color: '#f59e0b' },
  { name: 'History', weight: 15, score: 65, color: '#8b5cf6' },
]

function getScoreColor(score: number) {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#22c55e'
  if (score >= 40) return '#eab308'
  if (score >= 20) return '#f97316'
  return '#ef4444'
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  if (score >= 20) return 'At Risk'
  return 'Critical'
}

export default function CarrierHealthScore({ score, size = 200, categories = DEFAULT_CATEGORIES }: CarrierHealthScoreProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayScore, setDisplayScore] = useState(0)

  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = score / 100
  const dashOffset = circumference * (1 - progress)
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  useEffect(() => {
    if (!isInView) return
    const dur = 1200
    const start = performance.now()
    const animate = (now: number) => {
      const elapsed = now - start
      const p = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplayScore(Math.round(score * eased))
      if (p < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, score])

  return (
    <div ref={ref}>
      {/* Dark gradient header */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-800 rounded-t-xl px-6 py-4">
        <h3 className="text-base font-bold text-white">Carrier Health Score</h3>
        <p className="text-xs text-indigo-300 mt-0.5">Composite rating across 5 categories</p>
      </div>
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Score ring */}
          <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
              {/* Background ring */}
              <circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth}
              />
              {/* Score ring */}
              <motion.circle
                cx={size / 2} cy={size / 2} r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference}
                animate={isInView ? { strokeDashoffset: dashOffset } : {}}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black" style={{ color }}>{displayScore}</span>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="flex-1 space-y-2.5 w-full">
            {categories.map((cat, i) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">{cat.name} <span className="text-gray-400 text-xs">({cat.weight}%)</span></span>
                  <span className="font-bold" style={{ color: cat.color }}>{cat.score}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${cat.score}%` } : {}}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
