interface SparklineDataPoint {
  label: string
  value: number
}

interface SparklineChartProps {
  data: SparklineDataPoint[] | number[]
  color?: string
  width?: number
  height?: number
  label?: string
  currentValue?: number
}

export default function SparklineChart({ data, color = '#6366f1', width = 300, height = 100, label, currentValue }: SparklineChartProps) {
  // Normalize data to number array
  const values: number[] = data.map((d: any) => (typeof d === 'number' ? d : d.value))
  const labels: string[] = data.map((d: any) => (typeof d === 'object' && d.label ? d.label : ''))

  if (values.length < 2) return null

  const max = Math.max(...values) || 1
  const min = Math.min(...values)
  const range = max - min || 1
  const padding = 4

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (v - min) / range) * (height - padding * 2 - 20) + 10
    return { x, y }
  })

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')

  // Area fill
  const areaPath = `M ${points[0].x},${height - padding} L ${polyline.replace(/,/g, ' ').split(' ').reduce((acc: string[], v, i) => {
    if (i % 2 === 0) acc.push(`L ${v}`)
    else acc[acc.length - 1] += `,${v}`
    return acc
  }, []).join(' ')} L ${points[points.length - 1].x},${height - padding} Z`

  return (
    <div>
      {(label || currentValue != null) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
          {currentValue != null && <span className="text-lg font-bold" style={{ color }}>{currentValue}</span>}
        </div>
      )}
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {/* Gradient fill */}
        <defs>
          <linearGradient id={`sparkline-gradient-${label || 'default'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Area */}
        <path
          d={`M ${points[0].x},${height - padding} ${points.map(p => `L ${p.x},${p.y}`).join(' ')} L ${points[points.length - 1].x},${height - padding} Z`}
          fill={`url(#sparkline-gradient-${label || 'default'})`}
        />

        {/* Line */}
        <polyline fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" points={polyline} />

        {/* End dot */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r={3} fill={color} />
      </svg>

      {/* X-axis labels */}
      {labels.some(l => l) && (
        <div className="flex justify-between mt-1">
          {labels.filter((_, i) => i === 0 || i === labels.length - 1 || i === Math.floor(labels.length / 2)).map((l, i) => (
            <span key={i} className="text-[9px] text-gray-400">{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}
