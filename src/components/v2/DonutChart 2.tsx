import { motion } from 'framer-motion'

interface DonutSegment {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
  title?: string
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899']

export default function DonutChart({ segments, size = 180, strokeWidth = 28, title }: DonutChartProps) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) return null

  const radius = (size - strokeWidth) / 2
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  let cumulativePercent = 0

  return (
    <div className="flex flex-col items-center">
      {title && <p className="text-sm font-semibold text-gray-700 mb-3">{title}</p>}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
          {/* Segments */}
          {segments.map((seg, i) => {
            const pct = seg.value / total
            const offset = circumference * (1 - pct)
            const rotation = cumulativePercent * 360 - 90
            cumulativePercent += pct
            return (
              <motion.circle
                key={i}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={seg.color || COLORS[i % COLORS.length]}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="butt"
                transform={`rotate(${rotation} ${cx} ${cy})`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              />
            )
          })}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{total}</span>
          <span className="text-xs text-gray-400">Total</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color || COLORS[i % COLORS.length] }} />
            <span className="text-xs text-gray-600">{seg.label} ({seg.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
