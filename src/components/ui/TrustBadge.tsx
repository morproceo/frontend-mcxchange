import { Shield, CheckCircle } from 'lucide-react'
import { TrustLevel } from '../../types'
import clsx from 'clsx'

interface TrustBadgeProps {
  score: number
  level: TrustLevel
  verified?: boolean
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
}

const TrustBadge = ({ score, level, verified, size = 'md', showScore = true }: TrustBadgeProps) => {
  const levelConfig = {
    high: {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      label: 'High Trust',
    },
    medium: {
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      label: 'Medium Trust',
    },
    low: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      label: 'Low Trust',
    },
  }

  const sizeConfig = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5',
    },
  }

  const config = levelConfig[level]
  const sizeStyles = sizeConfig[size]

  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          'flex items-center gap-1.5 rounded-full border',
          config.bg,
          config.border,
          sizeStyles.padding
        )}
      >
        <Shield className={clsx(config.color, sizeStyles.icon)} />
        <span className={clsx('font-semibold', config.color, sizeStyles.text)}>
          {showScore ? score : config.label}
        </span>
      </div>

      {verified && (
        <div className="flex items-center gap-1 bg-secondary-50 border border-secondary-200 px-2 py-1 rounded-full">
          <CheckCircle className="w-3 h-3 text-secondary-600" />
          <span className="text-xs text-secondary-600 font-medium">Verified</span>
        </div>
      )}
    </div>
  )
}

export default TrustBadge
