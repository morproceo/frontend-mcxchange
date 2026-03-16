import { motion } from 'framer-motion'
import type { StatusLevel } from './mockData'

interface ScoreCardProps {
  icon?: any
  label: string
  value: string | number
  level?: StatusLevel | string
  description?: string
  color?: string
  subtitle?: string
}

const levelBg: Record<string, string> = {
  excellent: 'bg-emerald-50 border-emerald-200',
  good: 'bg-blue-50 border-blue-200',
  fair: 'bg-yellow-50 border-yellow-200',
  warning: 'bg-orange-50 border-orange-200',
  danger: 'bg-red-50 border-red-200',
  neutral: 'bg-gray-50 border-gray-200',
}

const levelText: Record<string, string> = {
  excellent: 'text-emerald-700',
  good: 'text-blue-700',
  fair: 'text-yellow-700',
  warning: 'text-orange-700',
  danger: 'text-red-700',
  neutral: 'text-gray-700',
}

const levelIcon: Record<string, string> = {
  excellent: 'text-emerald-500',
  good: 'text-blue-500',
  fair: 'text-yellow-500',
  warning: 'text-orange-500',
  danger: 'text-red-500',
  neutral: 'text-gray-500',
}

export default function ScoreCard({ icon: Icon, label, value, level = 'good', description, color, subtitle }: ScoreCardProps) {
  const bgClass = levelBg[level] || levelBg.neutral
  const textClass = color || levelText[level] || levelText.neutral
  const iconClass = levelIcon[level] || levelIcon.neutral

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-4 ${bgClass}`}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        {Icon && <Icon className={`w-4 h-4 ${iconClass}`} />}
      </div>
      <p className={`text-xl font-bold ${textClass}`}>{value}</p>
      {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </motion.div>
  )
}
