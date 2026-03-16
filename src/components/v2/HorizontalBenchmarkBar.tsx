import { motion } from 'framer-motion'

interface HorizontalBenchmarkBarProps {
  metric: string
  carrierValue: number
  industryAvg: number
  unit: string
  lowerIsBetter: boolean
}

export default function HorizontalBenchmarkBar({ metric, carrierValue, industryAvg, unit, lowerIsBetter }: HorizontalBenchmarkBarProps) {
  const maxVal = Math.max(carrierValue, industryAvg) * 1.3 || 1
  const carrierPct = (carrierValue / maxVal) * 100
  const avgPct = (industryAvg / maxVal) * 100
  const isBetter = lowerIsBetter ? carrierValue <= industryAvg : carrierValue >= industryAvg
  const barColor = isBetter ? '#10b981' : '#ef4444'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-gray-700">{metric}</span>
        <span className={`font-bold ${isBetter ? 'text-emerald-600' : 'text-red-600'}`}>{carrierValue}{unit}</span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className="absolute h-full rounded-full" style={{ backgroundColor: barColor }}
          initial={{ width: 0 }} animate={{ width: `${carrierPct}%` }} transition={{ duration: 0.8 }} />
        <div className="absolute top-0 bottom-0 w-0.5 bg-gray-500" style={{ left: `${avgPct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400">Industry avg: {industryAvg}{unit}</p>
    </div>
  )
}
