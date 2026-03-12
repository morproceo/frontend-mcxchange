import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'

function safeFmtDate(dateStr: string | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!dateStr) return 'N/A'
  try { const d = parseISO(dateStr); return isValid(d) ? format(d, fmt) : 'N/A' } catch { return 'N/A' }
}
import { V2InsuranceGap } from './mockData'

interface InsuranceGapTimelineProps {
  gaps: V2InsuranceGap[]
}

export default function InsuranceGapTimeline({ gaps }: InsuranceGapTimelineProps) {
  if (gaps.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">No Coverage Gaps Detected</p>
          <p className="text-xs text-emerald-600">Continuous insurance coverage maintained throughout authority history.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className={`rounded-xl border p-4 flex items-center gap-3 ${
        gaps.some(g => g.status === 'active')
          ? 'border-red-200 bg-red-50'
          : 'border-amber-200 bg-amber-50'
      }`}>
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
          gaps.some(g => g.status === 'active') ? 'text-red-500' : 'text-amber-500'
        }`} />
        <div>
          <p className="text-sm font-bold text-gray-800">
            {gaps.length} Coverage Gap{gaps.length > 1 ? 's' : ''} Found
          </p>
          <p className="text-xs text-gray-500">
            Total gap: {gaps.reduce((s, g) => s + g.daysGap, 0)} days across {gaps.length} incident{gaps.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Gap cards */}
      {gaps.map((gap, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`rounded-lg border p-4 ${
            gap.status === 'active'
              ? 'border-red-200 bg-red-50/50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">{gap.policyType}</span>
              {gap.status === 'resolved' ? (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                  <CheckCircle className="w-3 h-3" /> Resolved
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-600 animate-pulse">
                  <AlertTriangle className="w-3 h-3" /> Active Gap
                </span>
              )}
            </div>
            <span className={`text-sm font-bold ${gap.daysGap > 10 ? 'text-red-600' : 'text-amber-600'}`}>
              {gap.daysGap} days
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{safeFmtDate(gap.gapStart)}</span>
            <span className="text-gray-300">-</span>
            <span>{gap.gapEnd ? safeFmtDate(gap.gapEnd) : 'Present'}</span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
