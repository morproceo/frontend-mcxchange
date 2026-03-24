import { motion } from 'framer-motion'
import { useState } from 'react'

interface HealthCategory {
  name: string
  weight: number
  score: number
  color: string
}

interface CarrierHealthScoreProps {
  score: number
  categories?: HealthCategory[]
}

const CATEGORY_DETAILS: Record<string, { what: string; factors: string }> = {
  Safety: {
    what: 'How safely this carrier operates based on federal data',
    factors: 'BASIC percentile scores, crash history, OOS rates, FMCSA safety rating',
  },
  Compliance: {
    what: 'How well the carrier maintains required federal filings and authority',
    factors: 'Operating authority status, MCS-150 filing recency, BOC-3 on file, revocation history',
  },
  Insurance: {
    what: 'Whether the carrier has adequate and active insurance coverage',
    factors: 'Active BIPD and cargo policies, coverage amounts vs. requirements, coverage gaps',
  },
  Fleet: {
    what: 'Condition and reliability of the carrier\'s equipment',
    factors: 'Fleet size, average vehicle age, vehicle OOS rate, shared equipment flags',
  },
  History: {
    what: 'Track record and operating experience over time',
    factors: 'Years in business, clean inspection rate, authority age',
  },
}

const SCORE_RANGES = [
  { min: 80, label: 'Excellent', color: '#10b981', desc: 'Low risk — strong across all categories' },
  { min: 60, label: 'Good', color: '#f59e0b', desc: 'Moderate risk — some areas need attention' },
  { min: 0, label: 'Needs Attention', color: '#ef4444', desc: 'Higher risk — review flagged categories' },
]

export default function CarrierHealthScore({ score, categories }: CarrierHealthScoreProps) {
  const [showDetails, setShowDetails] = useState(false)
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const range = SCORE_RANGES.find(r => score >= r.min) || SCORE_RANGES[2]
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const cats = categories && categories.length > 0 ? categories : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-gray-900">Carrier Health Score</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {showDetails ? 'Hide details' : 'How is this calculated?'}
        </button>
      </div>

      {/* Explanation banner */}
      {showDetails && (
        <div className="mb-4 bg-blue-50 rounded-lg border border-blue-200 p-3">
          <p className="text-xs text-blue-800 mb-2">
            The Health Score is a <strong>0–100 composite rating</strong> we calculate from public FMCSA data.
            It combines 5 categories, each weighted by importance, to give you a single measure of carrier reliability.
          </p>
          <div className="flex flex-wrap gap-2 mb-2">
            {SCORE_RANGES.map(r => (
              <span key={r.min} className="inline-flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <strong>{r.label}</strong> ({r.min}+) — {r.desc}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-blue-600">
            This is not an official FMCSA rating. It is our own assessment based on publicly available data to help you evaluate carriers at a glance.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-400 mb-4">
        <span className="font-semibold" style={{ color }}>{range.label}</span> — {range.desc}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
            <motion.circle
              cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black" style={{ color }}>{score}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">/100</span>
          </div>
        </div>

        {cats && (
          <div className="flex-1 w-full space-y-3">
            {cats.map((cat, i) => {
              const detail = CATEGORY_DETAILS[cat.name]
              const catRange = SCORE_RANGES.find(r => cat.score >= r.min) || SCORE_RANGES[2]
              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className="text-[10px] text-gray-400">{cat.weight}% weight</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium" style={{ color: catRange.color }}>{catRange.label}</span>
                      <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.score}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.score}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.08 }}
                    />
                  </div>
                  {showDetails && detail && (
                    <div className="mt-1 ml-4">
                      <p className="text-[10px] text-gray-500">{detail.what}</p>
                      <p className="text-[10px] text-gray-400">Based on: {detail.factors}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
