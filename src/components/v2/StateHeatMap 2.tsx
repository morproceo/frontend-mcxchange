import { motion } from 'framer-motion'
import { V2StateInspection } from './mockData'

interface StateHeatMapProps {
  states: V2StateInspection[]
}

export default function StateHeatMap({ states }: StateHeatMapProps) {
  const maxInsp = Math.max(...states.map(s => s.inspections))
  const sorted = [...states].sort((a, b) => b.inspections - a.inspections)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sorted.map((state, i) => {
          const intensity = state.inspections / maxInsp
          const oosHigh = state.oosRate > 12.9
          return (
            <motion.div
              key={state.stateCode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl overflow-hidden border border-white/[0.06]"
              style={{
                background: `linear-gradient(135deg, ${
                  oosHigh
                    ? `rgba(239,68,68,${0.05 + intensity * 0.15})`
                    : `rgba(99,102,241,${0.03 + intensity * 0.12})`
                } 0%, rgba(15,23,42,0.95) 100%)`,
              }}
            >
              {/* Intensity bar at top */}
              <div className="h-1 w-full">
                <motion.div
                  className={`h-full ${oosHigh ? 'bg-red-500' : 'bg-indigo-500'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${intensity * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
              </div>
              <div className="px-3 py-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-black text-white">{state.stateCode}</span>
                  <span className="text-[10px] text-white/30 font-medium">{state.state}</span>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <div>
                    <p className="text-sm font-bold text-white/80">{state.inspections}</p>
                    <p className="text-[9px] text-white/30 uppercase">Insp.</p>
                  </div>
                  <div className="w-px h-6 bg-white/[0.06]" />
                  <div>
                    <p className={`text-sm font-bold ${oosHigh ? 'text-red-400' : 'text-emerald-400'}`}>{state.oosRate}%</p>
                    <p className="text-[9px] text-white/30 uppercase">OOS</p>
                  </div>
                  <div className="w-px h-6 bg-white/[0.06]" />
                  <div>
                    <p className={`text-sm font-bold ${state.oosCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{state.oosCount}</p>
                    <p className="text-[9px] text-white/30 uppercase">OOS #</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
