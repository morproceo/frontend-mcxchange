import { motion } from 'framer-motion'

interface SparklineChartProps {
  data: { label: string; value: number }[]
  color?: string
  height?: number
  showArea?: boolean
  label?: string
  currentValue?: number
  suffix?: string
}

export default function SparklineChart({
  data, color = '#6366f1', height = 60, showArea = true, label, currentValue, suffix = '',
}: SparklineChartProps) {
  if (data.length < 2) return null

  const values = data.map(d => d.value)
  const min = Math.min(...values) * 0.9
  const max = Math.max(...values) * 1.05
  const range = max - min || 1

  const w = 280
  const h = height
  const step = w / (data.length - 1)

  const points = data.map((d, i) => ({
    x: i * step,
    y: h - ((d.value - min) / range) * h,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h} L 0 ${h} Z`

  // Trend
  const first = values[0]
  const last = values[values.length - 1]
  const trending = last > first ? 'up' : last < first ? 'down' : 'flat'

  return (
    <div>
      {(label || currentValue !== undefined) && (
        <div className="flex items-baseline justify-between mb-2">
          {label && <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>}
          {currentValue !== undefined && (
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-gray-900">{currentValue}{suffix}</span>
              <span className={`text-[10px] font-bold ${trending === 'up' ? 'text-emerald-500' : trending === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                {trending === 'up' ? '+' : ''}{((last - first) / first * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      )}
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`sparkGrad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showArea && (
          <motion.path
            d={areaPath}
            fill={`url(#sparkGrad-${label})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        )}
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* Current value dot */}
        <motion.circle
          cx={points[points.length - 1].x}
          cy={points[points.length - 1].y}
          r={3.5}
          fill={color}
          stroke="white"
          strokeWidth={2}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        />
      </svg>
      {/* X-axis labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-gray-400">{data[0].label}</span>
        <span className="text-[9px] text-gray-400">{data[data.length - 1].label}</span>
      </div>
    </div>
  )
}
