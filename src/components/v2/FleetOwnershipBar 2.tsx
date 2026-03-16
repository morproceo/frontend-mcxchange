import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'

interface FleetOwnershipBarProps {
  owned: number
  leased: number
}

export default function FleetOwnershipBar({ owned, leased }: FleetOwnershipBarProps) {
  const total = owned + leased
  if (total === 0) return null
  const ownedPct = (owned / total) * 100
  const leasedPct = (leased / total) * 100

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-indigo-500" />
        <h4 className="text-sm font-semibold text-gray-900">Fleet Ownership</h4>
      </div>

      {/* Numbers row */}
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-emerald-600">{owned}</p>
          <p className="text-xs text-gray-400">Owned</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-amber-500">{leased}</p>
          <p className="text-xs text-gray-400">Leased</p>
        </div>
      </div>

      {/* Split bar */}
      <div className="h-4 rounded-full overflow-hidden flex">
        <motion.div
          className="bg-emerald-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${ownedPct}%` }}
          transition={{ duration: 0.7 }}
        />
        <motion.div
          className="bg-amber-400 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${leasedPct}%` }}
          transition={{ duration: 0.7, delay: 0.1 }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400 mt-1.5">
        <span>{ownedPct.toFixed(0)}% Owned</span>
        <span>{leasedPct.toFixed(0)}% Leased</span>
      </div>
    </div>
  )
}
