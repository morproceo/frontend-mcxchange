import { motion } from 'framer-motion'
import { statusColors, getStatusLevel } from './mockData'

interface SpeedometerGaugeProps {
  name: string
  score: number
  threshold: number
  max?: number
  alert?: boolean
}

export default function SpeedometerGauge({ name, score, threshold, max = 100, alert }: SpeedometerGaugeProps) {
  const level = getStatusLevel('basic', score)
  const colors = statusColors[level]
  const aboveThreshold = score >= threshold

  // Arc geometry
  const size = 160
  const strokeWidth = 14
  const cx = size / 2
  const cy = size / 2 + 10
  const radius = (size - strokeWidth) / 2 - 5

  // Semi-circle: 180 degrees from left (-180) to right (0)
  const startAngle = -180
  const endAngle = 0
  const totalAngle = endAngle - startAngle

  // Score angle
  const scoreAngle = startAngle + (score / max) * totalAngle
  const thresholdAngle = startAngle + (threshold / max) * totalAngle

  // Needle endpoint
  const needleLength = radius - 10
  const needleRad = (scoreAngle * Math.PI) / 180
  const needleX = cx + needleLength * Math.cos(needleRad)
  const needleY = cy + needleLength * Math.sin(needleRad)

  // Helper for arc path
  function arcPath(r: number, start: number, end: number) {
    const startRad = (start * Math.PI) / 180
    const endRad = (end * Math.PI) / 180
    const x1 = cx + r * Math.cos(startRad)
    const y1 = cy + r * Math.sin(startRad)
    const x2 = cx + r * Math.cos(endRad)
    const y2 = cy + r * Math.sin(endRad)
    const largeArc = end - start > 180 ? 1 : 0
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  // Threshold marker position
  const thresholdRad = (thresholdAngle * Math.PI) / 180
  const thresholdX1 = cx + (radius - strokeWidth / 2 - 2) * Math.cos(thresholdRad)
  const thresholdY1 = cy + (radius - strokeWidth / 2 - 2) * Math.sin(thresholdRad)
  const thresholdX2 = cx + (radius + strokeWidth / 2 + 2) * Math.cos(thresholdRad)
  const thresholdY2 = cy + (radius + strokeWidth / 2 + 2) * Math.sin(thresholdRad)

  return (
    <div className={`rounded-xl border-2 p-4 text-center relative ${alert ? 'border-red-400 bg-red-50/50 ring-2 ring-red-300 animate-pulse' : aboveThreshold ? 'border-red-200 bg-red-50/50' : 'border-gray-100 bg-white'}`}>
      {alert && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow">!</span>
      )}
      <p className="text-sm font-semibold text-gray-700 mb-1">{name}</p>
      <div className="relative mx-auto" style={{ width: size, height: size / 2 + 25 }}>
        <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${cy + 20}`}>
          {/* Background arc - gray */}
          <path
            d={arcPath(radius, startAngle, endAngle)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Green zone (below threshold) */}
          <path
            d={arcPath(radius, startAngle, thresholdAngle)}
            fill="none"
            stroke="#86efac"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.5}
          />
          {/* Red zone (above threshold) */}
          <path
            d={arcPath(radius, thresholdAngle, endAngle)}
            fill="none"
            stroke="#fca5a5"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            opacity={0.5}
          />
          {/* Threshold marker line */}
          <line
            x1={thresholdX1} y1={thresholdY1}
            x2={thresholdX2} y2={thresholdY2}
            stroke="#374151"
            strokeWidth={2.5}
          />
          {/* Needle */}
          <motion.line
            x1={cx} y1={cy}
            initial={{ x2: cx + needleLength * Math.cos(Math.PI), y2: cy + needleLength * Math.sin(Math.PI) }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            stroke="#1f2937"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          {/* Needle center dot */}
          <circle cx={cx} cy={cy} r={5} fill="#1f2937" />
        </svg>
      </div>
      <div className="flex items-center justify-center gap-2 -mt-2">
        <span className={`text-2xl font-bold ${colors.text}`}>{score}</span>
        <span className="text-xs text-gray-400">/ {max}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1">Threshold: {threshold}</p>
    </div>
  )
}
