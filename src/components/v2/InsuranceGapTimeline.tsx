import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import type { V2InsuranceGap } from './mockData'

interface InsuranceGapTimelineProps {
  gaps: V2InsuranceGap[]
}

export default function InsuranceGapTimeline({ gaps }: InsuranceGapTimelineProps) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Insurance Gap Detection</h3>
        </div>
        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">No Coverage Gaps Detected</p>
            <p className="text-xs text-emerald-600">Continuous insurance coverage maintained</p>
          </div>
        </div>
      </div>
    )
  }

  const activeGaps = gaps.filter(g => g.status === 'active')
  const resolvedGaps = gaps.filter(g => g.status === 'resolved')

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Insurance Gap Detection</h3>
        {activeGaps.length > 0 && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
            {activeGaps.length} Active
          </span>
        )}
      </div>

      <div className="space-y-3">
        {gaps.map((gap, i) => {
          const isActive = gap.status === 'active'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                isActive
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200 opacity-70'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-red-500' : 'text-gray-400'}`} />
              <div>
                <p className={`text-sm font-medium ${isActive ? 'text-red-800' : 'text-gray-700'}`}>
                  {gap.policyType} \u2014 {gap.daysGap} day gap
                </p>
                <p className={`text-xs ${isActive ? 'text-red-600' : 'text-gray-500'}`}>
                  {gap.gapStart} to {gap.gapEnd || 'present'}
                </p>
                {!isActive && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded mt-1 inline-block">
                    Resolved
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
