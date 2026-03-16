import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'

interface FleetOwnershipBarProps {
  owned: number
  leased: number
}

export default function FleetOwnershipBar({ owned, leased }: FleetOwnershipBarProps) {
  const total = owned + leased || 1
  const ownedPct = (owned / total) * 100

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Truck className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Fleet Ownership</h3>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Owned: <strong className="text-gray-900">{owned}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-200" />
          <span>Leased: <strong className="text-gray-900">{leased}</strong></span>
        </div>
      </div>

      <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
        <motion.div
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${ownedPct}%` }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="h-full bg-indigo-200"
          initial={{ width: 0 }}
          animate={{ width: `${100 - ownedPct}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{Math.round(ownedPct)}% owned</span>
        <span>{Math.round(100 - ownedPct)}% leased</span>
      </div>
    </div>
  )
}
