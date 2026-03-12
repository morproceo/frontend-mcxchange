import { motion } from 'framer-motion'
import { Link2, AlertTriangle } from 'lucide-react'
import { V2RelatedCarrier } from './mockData'

interface RelatedCarriersProps {
  carriers: V2RelatedCarrier[]
}

const sharedFieldLabels: Record<string, string> = {
  address: 'Same Address',
  phone: 'Same Phone',
  ein: 'Same EIN',
  contact: 'Same Contact',
  vin: 'Shared VIN',
}

export default function RelatedCarriers({ carriers }: RelatedCarriersProps) {
  if (carriers.length === 0) return null

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Link2 className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Related Carriers</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Shared identifiers detected</p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
          {carriers.length} Found
        </span>
      </div>

      {/* Carrier rows */}
      <div className="divide-y divide-white/[0.04]">
        {carriers.map((carrier, i) => (
          <motion.div
            key={carrier.mcNumber}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
          >
            {/* Status dot */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              carrier.status === 'active' ? 'bg-emerald-400' : carrier.status === 'inactive' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white/90 truncate">{carrier.legalName}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-[10px] text-white/40 font-mono">{carrier.mcNumber}</span>
                <span className="text-[10px] text-white/30">{carrier.dotNumber}</span>
              </div>
            </div>

            {/* Shared field badge */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                carrier.sharedField === 'vin' || carrier.sharedField === 'ein'
                  ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              }`}>
                {sharedFieldLabels[carrier.sharedField]}
              </span>
              <span className="text-[10px] text-white/30">{carrier.powerUnits} PU</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Warning footer */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-2">
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        <p className="text-[10px] text-white/30">Related carriers may indicate shared ownership, leasing, or entity restructuring.</p>
      </div>
    </div>
  )
}
