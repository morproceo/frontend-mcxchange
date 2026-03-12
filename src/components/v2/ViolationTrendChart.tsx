import { motion } from 'framer-motion'
import { V2ViolationTrend } from './mockData'

interface ViolationTrendChartProps {
  data: V2ViolationTrend[]
  height?: number
}

export default function ViolationTrendChart({ data, height = 120 }: ViolationTrendChartProps) {
  if (data.length < 2) return null

  const w = 500
  const h = height
  const pad = { top: 10, bottom: 20, left: 0, right: 0 }
  const plotW = w - pad.left - pad.right
  const plotH = h - pad.top - pad.bottom

  const maxV = Math.max(...data.map(d => d.violations), 1)
  const step = plotW / (data.length - 1)

  const violationPoints = data.map((d, i) => ({
    x: pad.left + i * step,
    y: pad.top + plotH - (d.violations / maxV) * plotH,
  }))

  const oosPoints = data.map((d, i) => ({
    x: pad.left + i * step,
    y: pad.top + plotH - (d.oosEvents / maxV) * plotH,
  }))

  const makePath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  const makeArea = (pts: { x: number; y: number }[]) =>
    `${makePath(pts)} L ${pts[pts.length - 1].x} ${pad.top + plotH} L ${pts[0].x} ${pad.top + plotH} Z`

  // Month labels (show every 3rd)
  const labels = data.map((d, i) => {
    const [y, m] = d.month.split('-')
    return { idx: i, label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(m) - 1] + ' ' + y.slice(2) }
  }).filter((_, i) => i % 4 === 0 || i === data.length - 1)

  return (
    <div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="violGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="oosGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(pct => (
          <line key={pct} x1={pad.left} y1={pad.top + plotH * (1 - pct)} x2={w} y2={pad.top + plotH * (1 - pct)} stroke="#f3f4f6" strokeWidth={1} />
        ))}

        {/* Violation area + line */}
        <motion.path d={makeArea(violationPoints)} fill="url(#violGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
        <motion.path d={makePath(violationPoints)} fill="none" stroke="#6366f1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />

        {/* OOS area + line */}
        <motion.path d={makeArea(oosPoints)} fill="url(#oosGrad)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
        <motion.path d={makePath(oosPoints)} fill="none" stroke="#ef4444" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: 0.2 }} />

        {/* OOS dots */}
        {data.map((d, i) => d.oosEvents > 0 && (
          <motion.circle key={i} cx={oosPoints[i].x} cy={oosPoints[i].y} r={3} fill="#ef4444" stroke="white" strokeWidth={1.5} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.02 }} />
        ))}

        {/* X-axis labels */}
        {labels.map(l => (
          <text key={l.idx} x={pad.left + l.idx * step} y={h - 2} textAnchor="middle" fill="#9ca3af" fontSize={8} fontWeight={500}>
            {l.label}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-indigo-500 rounded" />
          <span className="text-[10px] text-gray-500">Violations</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-red-500 rounded" style={{ borderBottom: '1px dashed #ef4444' }} />
          <span className="text-[10px] text-gray-500">OOS Events</span>
        </div>
      </div>
    </div>
  )
}
