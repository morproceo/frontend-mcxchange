import { motion } from 'framer-motion'

interface DonutSegment {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  title?: string
  size?: number
  // Legacy compat
  data?: DonutSegment[]
}

export default function DonutChart({ segments, title, size = 120, data }: DonutChartProps) {
  const items = segments || data || []
  const total = items.reduce((s, d) => s + d.value, 0) || 1
  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  let cumulativeOffset = 0

  return (
    <div>
      {title && <h4 className="text-sm font-semibold text-gray-900 mb-3">{title}</h4>}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />
            {items.map((d, i) => {
              const pct = d.value / total
              const dashLength = pct * circumference
              const rotation = (cumulativeOffset / total) * 360
              cumulativeOffset += d.value
              return (
                <motion.circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{total}</span>
            <span className="text-[9px] text-gray-400 uppercase">Total</span>
          </div>
        </div>

        <div className="flex-1 space-y-1.5">
          {items.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-gray-600 truncate">{d.label}</span>
              </div>
              <span className="font-semibold text-gray-900 ml-2">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
