interface StateHeatMapProps {
  states: { state: string; stateCode: string; inspections: number; oosCount: number; oosRate: number }[]
}

export default function StateHeatMap({ states }: StateHeatMapProps) {
  if (states.length === 0) return <p className="text-sm text-gray-400 text-center py-4">No state data</p>
  const maxInsp = Math.max(...states.map(s => s.inspections)) || 1
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {states.map((s, i) => {
        const intensity = Math.min(s.inspections / maxInsp, 1)
        const bg = s.oosRate > 15 ? `rgba(239,68,68,${0.2 + intensity * 0.6})` : `rgba(99,102,241,${0.1 + intensity * 0.5})`
        return (
          <div key={i} className="rounded-lg p-2 text-center border border-gray-100" style={{ backgroundColor: bg }}>
            <p className="text-xs font-bold text-gray-900">{s.stateCode}</p>
            <p className="text-[10px] text-gray-600">{s.inspections} insp</p>
          </div>
        )
      })}
    </div>
  )
}
