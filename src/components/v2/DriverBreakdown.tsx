import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

interface DriverBreakdownProps {
  totalCDL: number
  within100mi: number
  beyond100mi: number
}

export default function DriverBreakdown({ totalCDL, within100mi, beyond100mi }: DriverBreakdownProps) {
  const total = within100mi + beyond100mi
  const within100Pct = total > 0 ? (within100mi / total) * 100 : 0
  const beyond100Pct = total > 0 ? (beyond100mi / total) * 100 : 0

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-indigo-500" />
        <h4 className="text-sm font-semibold text-gray-900">CDL Driver Distribution</h4>
      </div>

      {/* Total CDL */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-black text-gray-900">{totalCDL}</span>
        <span className="text-sm text-gray-400">CDL Drivers Total</span>
      </div>

      {/* Split bar */}
      <div className="h-4 rounded-full overflow-hidden flex mb-3">
        <motion.div
          className="bg-indigo-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${within100Pct}%` }}
          transition={{ duration: 0.7 }}
        />
        <motion.div
          className="bg-cyan-400 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${beyond100Pct}%` }}
          transition={{ duration: 0.7, delay: 0.1 }}
        />
      </div>

      {/* Legend */}
      <div className="flex justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-gray-600">Within 100mi ({within100mi})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-gray-600">Beyond 100mi ({beyond100mi})</span>
        </div>
      </div>
    </div>
  )
}
