import { motion } from 'framer-motion'

interface HealthCategory {
  name: string
  weight: number
  score: number
  color: string
}

interface CarrierHealthScoreProps {
  score: number
  categories?: HealthCategory[]
}

export default function CarrierHealthScore({ score, categories }: CarrierHealthScoreProps) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const size = 120
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const cats = categories && categories.length > 0 ? categories : null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Carrier Health Score</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
            <motion.circle
              cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
              strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black" style={{ color }}>{score}</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Health</span>
          </div>
        </div>

        {cats && (
          <div className="flex-1 w-full space-y-3">
            {cats.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className="text-[10px] text-gray-400">{cat.weight}%</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: cat.color }}>{cat.score}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
