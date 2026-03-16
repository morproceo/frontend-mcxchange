import type { StatusLevel } from './mockData'

interface StatusBadgeProps {
  level: StatusLevel | string
  label: string
  size?: 'sm' | 'md' | 'lg'
  // Legacy compat
  status?: string
  category?: string
}

const levelStyles: Record<string, { bg: string; text: string; border: string }> = {
  excellent: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  good: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  fair: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  warning: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  danger: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  neutral: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export default function StatusBadge({ level, label, size = 'md' }: StatusBadgeProps) {
  const style = levelStyles[level] || levelStyles.neutral
  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeStyles[size]}`}>
      {label}
    </span>
  )
}
