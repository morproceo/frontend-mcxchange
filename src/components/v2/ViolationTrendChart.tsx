import type { V2ViolationTrend } from './mockData'

interface ViolationTrendChartProps { data: V2ViolationTrend[] }

export default function ViolationTrendChart({ data }: ViolationTrendChartProps) {
  if (data.length === 0) return <p className="text-sm text-gray-400 text-center py-4">No trend data</p>
  const maxVal = Math.max(...data.map(d => d.violations), 1)
  const width = 600
  const height = 120
  const padding = 20

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = padding + (1 - d.violations / maxVal) * (height - padding * 2)
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 160 }}>
      <path d={linePath} fill="none" stroke="#6366f1" strokeWidth={2} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={p.oosEvents > 0 ? '#ef4444' : '#6366f1'} />
      ))}
    </svg>
  )
}
