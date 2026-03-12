import { motion } from 'framer-motion'
import { statusColors, StatusLevel } from './mockData'

interface CircularGaugeProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  level: StatusLevel
  label: string
  sublabel?: string
}

export default function CircularGauge({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  level,
  label,
  sublabel,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(value / max, 1)
  const offset = circumference * (1 - progress)
  const colors = statusColors[level]

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {/* Animated progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.fill}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {value}
          </motion.span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
      {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
    </div>
  )
}
