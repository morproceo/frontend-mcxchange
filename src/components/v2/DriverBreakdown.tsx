import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

interface DriverBreakdownProps {
  totalCDL: number
  within100mi: number
  beyond100mi: number
}

export default function DriverBreakdown({ totalCDL, within100mi, beyond100mi }: DriverBreakdownProps) {
  const total = totalCDL || 1
  const segments = [
    { label: 'Interstate (<100mi)', value: within100mi, color: '#6366f1' },
    { label: 'Interstate (>100mi)', value: beyond100mi, color: '#06b6d4' },
  ].filter(s => s.value > 0)

  if (totalCDL === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Driver Breakdown</h3>
        </div>
        <p className="text-sm text-gray-400">No driver data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Driver Breakdown</h3>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">{totalCDL}</span>
          <span className="text-sm text-gray-500">CDL Drivers</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
          {segments.map((seg, i) => (
            <motion.div
              key={seg.label}
              className="h-full"
              style={{ backgroundColor: seg.color }}
              initial={{ width: 0 }}
              animate={{ width: `${(seg.value / total) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-1">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-gray-600">{seg.label}</span>
            </div>
            <span className="font-semibold text-gray-900">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
