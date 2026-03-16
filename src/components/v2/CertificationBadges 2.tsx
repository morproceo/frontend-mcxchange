import { motion } from 'framer-motion'
import { Leaf, Thermometer, Flame } from 'lucide-react'

interface CertificationBadgesProps {
  smartway: boolean
  carbtru: boolean
  phmsa: boolean
}

const badges = [
  { key: 'smartway' as const, label: 'SmartWay', icon: Leaf, activeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', desc: 'EPA SmartWay Certified' },
  { key: 'carbtru' as const, label: 'CARB TRU', icon: Thermometer, activeColor: 'bg-blue-100 text-blue-700 border-blue-200', desc: 'CARB TRU Compliant' },
  { key: 'phmsa' as const, label: 'PHMSA', icon: Flame, activeColor: 'bg-orange-100 text-orange-700 border-orange-200', desc: 'PHMSA Registered' },
]

export default function CertificationBadges({ smartway, carbtru, phmsa }: CertificationBadgesProps) {
  const flags = { smartway, carbtru, phmsa }

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, i) => {
        const active = flags[badge.key]
        const Icon = badge.icon
        return (
          <motion.div
            key={badge.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
              active ? badge.activeColor : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}
            title={badge.desc}
          >
            <Icon className="w-4 h-4" />
            {badge.label}
            {!active && <span className="text-[10px] font-normal ml-1">(N/A)</span>}
          </motion.div>
        )
      })}
    </div>
  )
}
