import { motion } from 'framer-motion'
import clsx from 'clsx'
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

interface CoverageBarProps {
  label: string
  actual: number
  required: number
  className?: string
}

export default function CoverageBar({ label, actual, required, className }: CoverageBarProps) {
  const percentage = Math.round((actual / required) * 100)
  const isAbove = percentage >= 100
  const isClose = percentage >= 75

  // Ring gauge config
  const size = 88
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(percentage / 150, 1) // visual cap at 150%
  const offset = circumference * (1 - progress)

  const strokeColor = isAbove ? '#10b981' : isClose ? '#eab308' : '#ef4444'
  const bgRing = isAbove ? '#d1fae5' : isClose ? '#fef9c3' : '#fee2e2'
  const badgeBg = isAbove ? 'bg-emerald-50' : isClose ? 'bg-yellow-50' : 'bg-red-50'
  const badgeBorder = isAbove ? 'border-emerald-200' : isClose ? 'border-yellow-200' : 'border-red-200'
  const badgeText = isAbove ? 'text-emerald-700' : isClose ? 'text-yellow-700' : 'text-red-700'
  const pctText = isAbove ? 'text-emerald-600' : isClose ? 'text-yellow-600' : 'text-red-600'
  const Icon = isAbove ? ShieldCheck : isClose ? ShieldAlert : ShieldX

  const formatCurrency = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
    return `$${n}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'flex items-center gap-5 rounded-2xl border p-5',
        badgeBg,
        badgeBorder,
        className,
      )}
    >
      {/* Ring gauge */}
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={bgRing} strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={strokeColor} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={clsx('text-lg font-extrabold', pctText)}>{percentage}%</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className={clsx('w-4.5 h-4.5', badgeText)} />
          <span className="text-sm font-bold text-gray-900">{label}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div>
            <span className="text-xs text-gray-400 block">Coverage</span>
            <span className="font-semibold text-gray-800">{formatCurrency(actual)}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block">Required</span>
            <span className="font-semibold text-gray-500">{formatCurrency(required)}</span>
          </div>
        </div>

        {isAbove && (
          <p className="text-xs text-emerald-600 font-medium mt-1.5">
            Exceeds minimum by {formatCurrency(actual - required)}
          </p>
        )}
        {!isAbove && (
          <p className="text-xs text-red-600 font-medium mt-1.5">
            Short by {formatCurrency(required - actual)}
          </p>
        )}
      </div>
    </motion.div>
  )
}
