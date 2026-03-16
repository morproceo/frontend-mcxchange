import { motion } from 'framer-motion'

interface HorizontalBenchmarkBarProps {
  label: string
  carrierValue: number
  nationalAvg: number
  unit?: string
  lowerIsBetter?: boolean
  max?: number
}

export default function HorizontalBenchmarkBar({
  label, carrierValue, nationalAvg, unit = '%', lowerIsBetter = true, max,
}: HorizontalBenchmarkBarProps) {
  const computedMax = max || Math.max(carrierValue, nationalAvg) * 1.5
  const carrierPct = Math.min((carrierValue / computedMax) * 100, 100)
  const natlPct = Math.min((nationalAvg / computedMax) * 100, 100)
  const isBetter = lowerIsBetter ? carrierValue <= nationalAvg : carrierValue >= nationalAvg

  return (
    <div className="py-3">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-3 text-xs">
          <span className={`font-bold ${isBetter ? 'text-emerald-600' : 'text-red-600'}`}>
            {carrierValue}{unit}
          </span>
          <span className="text-gray-400">vs {nationalAvg}{unit} avg</span>
        </div>
      </div>
      <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
        {/* National avg marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
          style={{ left: `${natlPct}%` }}
        />
        <div
          className="absolute -top-4 text-[9px] text-gray-400 font-medium"
          style={{ left: `${natlPct}%`, transform: 'translateX(-50%)' }}
        >
          Avg
        </div>
        {/* Carrier bar */}
        <motion.div
          className={`absolute top-0 bottom-0 rounded-full ${isBetter ? 'bg-emerald-400' : 'bg-red-400'}`}
          initial={{ width: 0 }}
          animate={{ width: `${carrierPct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
