import { motion } from 'framer-motion'
import { statusColors } from './mockData'
import type { StatusLevel } from './mockData'

interface SpeedometerGaugeProps {
  name: string
  score: number | null
  threshold: number
  max?: number
  alert?: boolean
}

/** Determine status level relative to THIS basic's threshold, not hardcoded breakpoints */
function getBasicLevel(score: number, threshold: number): StatusLevel {
  if (score >= threshold) return 'danger'
  if (score >= threshold * 0.85) return 'warning'
  if (score >= threshold * 0.6) return 'good'
  return 'excellent'
}

export default function SpeedometerGauge({ name, score, threshold, max = 100, alert }: SpeedometerGaugeProps) {
  if (score == null) {
    return (
      <div className="rounded-xl border-2 border-gray-100 bg-white p-4 text-center">
        <p className="text-sm font-semibold text-gray-700 mb-1">{name}</p>
        <div className="relative mx-auto flex items-center justify-center" style={{ width: 160, height: 105 }}>
          <div className="text-center">
            <p className="text-gray-400 text-sm font-medium">Not Scored</p>
            <p className="text-[10px] text-gray-300 mt-1">Insufficient data</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 -mt-2">
          <span className="text-lg font-bold text-gray-300">—</span>
          <span className="text-xs text-gray-300">/ {max}</span>
        </div>
        <p className="text-xs text-gray-300 mt-1">Threshold: {threshold}</p>
      </div>
    )
  }

  const aboveThreshold = score >= threshold
  // Use the actual threshold to determine status — not hardcoded breakpoints
  const level = getBasicLevel(score, threshold)
  const colors = statusColors[level]
  // Only flash red when score is actually at or above the threshold
  const shouldFlash = aboveThreshold
  const size = 160
  const strokeWidth = 14
  const cx = size / 2
  const cy = size / 2 + 10
  const radius = (size - strokeWidth) / 2 - 5
  const startAngle = -180
  const endAngle = 0
  const totalAngle = endAngle - startAngle
  const scoreAngle = startAngle + (score / max) * totalAngle
  const thresholdAngle = startAngle + (threshold / max) * totalAngle
  const needleLength = radius - 10
  const needleRad = (scoreAngle * Math.PI) / 180
  const needleX = cx + needleLength * Math.cos(needleRad)
  const needleY = cy + needleLength * Math.sin(needleRad)

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

  const thresholdRad = (thresholdAngle * Math.PI) / 180
  const thresholdX1 = cx + (radius - strokeWidth / 2 - 2) * Math.cos(thresholdRad)
  const thresholdY1 = cy + (radius - strokeWidth / 2 - 2) * Math.sin(thresholdRad)
  const thresholdX2 = cx + (radius + strokeWidth / 2 + 2) * Math.cos(thresholdRad)
  const thresholdY2 = cy + (radius + strokeWidth / 2 + 2) * Math.sin(thresholdRad)

  return (
    <div className={`rounded-xl border-2 p-4 text-center relative ${shouldFlash ? 'border-red-400 bg-red-50/50 ring-2 ring-red-300 animate-pulse' : aboveThreshold ? 'border-red-200 bg-red-50/50' : `${colors.border} bg-white`}`}>
      {shouldFlash && (
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow">!</span>
      )}
      <p className="text-sm font-semibold text-gray-700 mb-1">{name}</p>
      <div className="relative mx-auto" style={{ width: size, height: size / 2 + 25 }}>
        <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${cy + 20}`}>
          <path d={arcPath(radius, startAngle, endAngle)} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={arcPath(radius, startAngle, thresholdAngle)} fill="none" stroke="#86efac" strokeWidth={strokeWidth} strokeLinecap="round" opacity={0.5} />
          <path d={arcPath(radius, thresholdAngle, endAngle)} fill="none" stroke="#fca5a5" strokeWidth={strokeWidth} strokeLinecap="round" opacity={0.5} />
          <line x1={thresholdX1} y1={thresholdY1} x2={thresholdX2} y2={thresholdY2} stroke="#374151" strokeWidth={2.5} />
          <motion.line
            x1={cx} y1={cy}
            initial={{ x2: cx + needleLength * Math.cos(Math.PI), y2: cy + needleLength * Math.sin(Math.PI) }}
            animate={{ x2: needleX, y2: needleY }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
            stroke="#1f2937" strokeWidth={2.5} strokeLinecap="round"
          />
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
