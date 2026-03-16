import { motion } from 'framer-motion'
import type { V2TruckData, V2TrailerData } from './mockData'

interface FleetAgeHistogramProps {
  trucks: V2TruckData[]
  trailers?: V2TrailerData[]
}

export default function FleetAgeHistogram({ trucks, trailers }: FleetAgeHistogramProps) {
  const allVehicles = [
    ...trucks.map(t => ({ year: t.year, type: 'truck' as const })),
    ...(trailers || []).map(t => ({ year: t.year, type: 'trailer' as const })),
  ]

  if (allVehicles.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">No fleet data available</p>
  }

  const currentYear = new Date().getFullYear()
  const buckets: Record<string, { trucks: number; trailers: number }> = {
    '0-3y': { trucks: 0, trailers: 0 },
    '4-6y': { trucks: 0, trailers: 0 },
    '7-10y': { trucks: 0, trailers: 0 },
    '10+y': { trucks: 0, trailers: 0 },
  }

  allVehicles.forEach(v => {
    if (!v.year) return
    const age = currentYear - v.year
    let bucket: string
    if (age <= 3) bucket = '0-3y'
    else if (age <= 6) bucket = '4-6y'
    else if (age <= 10) bucket = '7-10y'
    else bucket = '10+y'
    if (v.type === 'truck') buckets[bucket].trucks++
    else buckets[bucket].trailers++
  })

  const maxVal = Math.max(
    ...Object.values(buckets).map(b => b.trucks + b.trailers),
    1
  )
  const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444']

  return (
    <div className="flex items-end gap-3 h-32">
      {Object.entries(buckets).map(([label, data], i) => {
        const total = data.trucks + data.trailers
        return (
          <div key={label} className="flex-1 flex flex-col items-center">
            <span className="text-xs font-bold text-gray-700 mb-1">{total}</span>
            <motion.div
              className="w-full rounded-t-md"
              style={{ backgroundColor: colors[i] }}
              initial={{ height: 0 }}
              animate={{ height: `${(total / maxVal) * 90}px` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
            <span className="text-[10px] text-gray-500 mt-1">{label}</span>
            {data.trucks > 0 && data.trailers > 0 && (
              <span className="text-[9px] text-gray-400">
                {data.trucks}T / {data.trailers}Tr
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
