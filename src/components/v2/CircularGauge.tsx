import { motion } from 'framer-motion'
import type { StatusLevel } from './mockData'

interface CircularGaugeProps {
  value: number
  max?: number
  label?: string
  color?: string
  size?: number
  level?: StatusLevel | string
}

const levelColors: Record<string, string> = {
  excellent: '#10b981',
  good: '#3b82f6',
  fair: '#f59e0b',
  warning: '#f97316',
  danger: '#ef4444',
  neutral: '#6b7280',
}

export default function CircularGauge({ value, max = 100, label, color, size = 80, level }: CircularGaugeProps) {
  const strokeColor = color || (level ? levelColors[level] || '#6366f1' : '#6366f1')
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = max > 0 ? Math.min(value / max, 1) : 0
  const offset = circumference - pct * circumference

  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={strokeColor} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black" style={{ color: strokeColor }}>{Math.round(value)}</span>
          {label && <span className="text-[8px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>}
        </div>
      </div>
    </div>
  )
}
