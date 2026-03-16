import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { StatusLevel, statusColors } from './mockData'

interface ScoreCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  level: StatusLevel
  subtitle?: string
  className?: string
}

export default function ScoreCard({ icon: Icon, label, value, level, subtitle, className }: ScoreCardProps) {
  const colors = statusColors[level]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'rounded-xl border p-4',
        colors.bg,
        colors.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={clsx('p-2 rounded-lg', colors.bg)}>
          <Icon className={clsx('w-5 h-5', colors.text)} />
        </div>
      </div>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={clsx('text-2xl font-bold', colors.text)}>{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </motion.div>
  )
}
