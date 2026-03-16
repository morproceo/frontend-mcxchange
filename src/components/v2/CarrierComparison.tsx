import { motion } from 'framer-motion'
import type { V2CarrierPercentile } from './mockData'

interface CarrierComparisonProps {
  percentiles: V2CarrierPercentile[]
}

const categoryColors: Record<string, string> = {
  safety: '#10b981',
  compliance: '#6366f1',
  fleet: '#f59e0b',
  financial: '#06b6d4',
  excellent: '#10b981',
  good: '#6366f1',
  average: '#f59e0b',
  below_average: '#f97316',
  poor: '#ef4444',
  unknown: '#9ca3af',
}

export default function CarrierComparison({ percentiles }: CarrierComparisonProps) {
  if (!percentiles || percentiles.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">No percentile data available</p>
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Industry Percentile Ranking</h3>
      <div className="space-y-4">
        {percentiles.map((p, i) => {
          const color = categoryColors[p.category] || '#9ca3af'
          const pctValue = p.percentile ?? 0

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{p.metric}</span>
                <div className="flex items-center gap-2">
                  {p.carrierValue != null && (
                    <span className="font-bold" style={{ color }}>
                      {p.carrierValue}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {pctValue}th percentile
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="absolute h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pctValue}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
                {/* 50th percentile marker */}
                <div className="absolute top-0 bottom-0 w-px bg-gray-300 left-1/2" />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{p.category}</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
