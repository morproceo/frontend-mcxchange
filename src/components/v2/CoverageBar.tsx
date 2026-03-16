import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

interface CoverageBarProps {
  label: string
  actual: number
  required: number
}

function fmtCoverage(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toLocaleString()}`
}

export default function CoverageBar({ label, actual, required }: CoverageBarProps) {
  // Handle required = 0 or missing — avoid Infinity
  const hasRequired = required > 0
  const pct = hasRequired ? Math.min((actual / required) * 100, 100) : (actual > 0 ? 100 : 0)
  const exceeds = hasRequired && actual >= required
  const shortfall = hasRequired && actual < required

  // SVG ring
  const size = 80
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  const ringColor = shortfall ? '#ef4444' : '#10b981'
  const bgColor = '#e5e7eb'

  return (
    <div className={`rounded-xl border p-4 ${exceeds ? 'bg-emerald-50/50 border-emerald-200' : shortfall ? 'bg-red-50/50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
            <motion.circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke={ringColor} strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-bold ${shortfall ? 'text-red-600' : 'text-emerald-600'}`}>
              {hasRequired ? `${Math.round(pct)}%` : actual > 0 ? '✓' : '—'}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className={`w-4 h-4 ${exceeds ? 'text-emerald-500' : shortfall ? 'text-red-500' : 'text-gray-400'}`} />
            <p className="text-sm font-semibold text-gray-900 truncate">{label}</p>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <div>
              <span className="block text-gray-400">Coverage</span>
              <span className="font-semibold text-gray-700">{fmtCoverage(actual)}</span>
            </div>
            <div>
              <span className="block text-gray-400">Required</span>
              <span className="font-semibold text-gray-700">{hasRequired ? fmtCoverage(required) : 'N/A'}</span>
            </div>
          </div>
          {exceeds && (
            <p className="text-[10px] text-emerald-600 mt-1">Exceeds minimum by {fmtCoverage(actual - required)}</p>
          )}
          {shortfall && (
            <p className="text-[10px] text-red-600 mt-1">Below minimum by {fmtCoverage(required - actual)}</p>
          )}
          {!hasRequired && actual > 0 && (
            <p className="text-[10px] text-emerald-600 mt-1">Coverage on file</p>
          )}
        </div>
      </div>
    </div>
  )
}
