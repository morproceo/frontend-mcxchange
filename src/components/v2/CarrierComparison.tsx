import { motion } from 'framer-motion'
import { V2CarrierPercentile } from './mockData'

interface CarrierComparisonProps {
  percentiles: V2CarrierPercentile[]
}

const categoryColors: Record<string, { bar: string; bg: string; text: string }> = {
  safety: { bar: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  compliance: { bar: 'bg-indigo-500', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
  fleet: { bar: 'bg-cyan-500', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  financial: { bar: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
}

function getPercentileLabel(p: number) {
  if (p >= 90) return 'Top 10%'
  if (p >= 75) return 'Top 25%'
  if (p >= 50) return 'Above Avg'
  if (p >= 25) return 'Below Avg'
  return 'Bottom 25%'
}

export default function CarrierComparison({ percentiles }: CarrierComparisonProps) {
  // Group by category
  const groups: Record<string, V2CarrierPercentile[]> = {}
  percentiles.forEach(p => {
    groups[p.category] = groups[p.category] || []
    groups[p.category].push(p)
  })

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }}>
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-bold text-white">Industry Percentile Ranking</h3>
        <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">How this carrier compares nationally</p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {Object.entries(groups).map(([category, items]) => {
          const colors = categoryColors[category] || categoryColors.safety
          return (
            <div key={category}>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-2">
                {category}
              </p>
              <div className="space-y-2.5">
                {items.map((item, i) => {
                  const label = getPercentileLabel(item.percentile)
                  return (
                    <div key={item.metric}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">{item.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold ${colors.text}`}>{label}</span>
                          <span className="text-xs font-bold text-white/80">{item.percentile}th</span>
                        </div>
                      </div>
                      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden relative">
                        {/* 50th percentile marker */}
                        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 z-10" />
                        <motion.div
                          className={`h-full rounded-full ${colors.bar}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentile}%` }}
                          transition={{ duration: 0.7, delay: i * 0.08 }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Average score */}
      <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[10px] text-white/30 uppercase tracking-wider">Overall Percentile</span>
        <span className="text-lg font-black text-white">
          {Math.round(percentiles.reduce((s, p) => s + p.percentile, 0) / percentiles.length)}th
        </span>
      </div>
    </div>
  )
}
