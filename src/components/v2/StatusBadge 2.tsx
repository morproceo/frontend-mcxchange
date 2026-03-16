import clsx from 'clsx'
import { StatusLevel, statusColors } from './mockData'

interface StatusBadgeProps {
  level: StatusLevel
  label: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export default function StatusBadge({ level, label, size = 'md', className }: StatusBadgeProps) {
  const colors = statusColors[level]
  return (
    <span
      className={clsx(
        'inline-flex items-center font-semibold rounded-full border',
        colors.bg,
        colors.text,
        colors.border,
        sizeConfig[size],
        className
      )}
    >
      {label}
    </span>
  )
}
