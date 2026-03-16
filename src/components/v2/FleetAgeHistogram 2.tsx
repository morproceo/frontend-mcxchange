import { motion } from 'framer-motion'

interface FleetAgeHistogramProps {
  trucks: { year: number }[]
  trailers: { year: number }[]
}

export default function FleetAgeHistogram({ trucks, trailers }: FleetAgeHistogramProps) {
  const all = [...trucks, ...trailers]
  const years: Record<number, { trucks: number; trailers: number }> = {}

  trucks.forEach(t => { years[t.year] = years[t.year] || { trucks: 0, trailers: 0 }; years[t.year].trucks++ })
  trailers.forEach(t => { years[t.year] = years[t.year] || { trucks: 0, trailers: 0 }; years[t.year].trailers++ })

  const sortedYears = Object.keys(years).map(Number).sort()
  const maxCount = Math.max(...Object.values(years).map(y => y.trucks + y.trailers))
  const currentYear = new Date().getFullYear()

  return (
    <div>
      <div className="flex items-end gap-1.5 h-[140px]">
        {sortedYears.map((year, i) => {
          const d = years[year]
          const total = d.trucks + d.trailers
          const truckPct = (d.trucks / maxCount) * 100
          const trailerPct = (d.trailers / maxCount) * 100
          const age = currentYear - year
          const isOld = age > 5

          return (
            <div key={year} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                {year}: {d.trucks}T + {d.trailers}Tr = {total}
              </div>
              {/* Stacked bar */}
              <motion.div
                className="w-full rounded-t flex flex-col justify-end overflow-hidden"
                style={{ height: `${((total / maxCount) * 100)}%` }}
                initial={{ height: 0 }}
                animate={{ height: `${((total / maxCount) * 100)}%` }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <div
                  className={`w-full ${isOld ? 'bg-amber-400' : 'bg-indigo-500'}`}
                  style={{ height: `${(d.trucks / total) * 100}%` }}
                />
                <div
                  className={`w-full ${isOld ? 'bg-amber-300' : 'bg-cyan-400'}`}
                  style={{ height: `${(d.trailers / total) * 100}%` }}
                />
              </motion.div>
              {/* Year label */}
              <span className={`text-[9px] mt-1 font-semibold ${isOld ? 'text-amber-600' : 'text-gray-500'}`}>
                {String(year).slice(2)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
          <span className="text-[10px] text-gray-500">Trucks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
          <span className="text-[10px] text-gray-500">Trailers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
          <span className="text-[10px] text-gray-500">5+ years old</span>
        </div>
      </div>
    </div>
  )
}
