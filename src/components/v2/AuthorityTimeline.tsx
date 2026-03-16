import type { V2AuthorityEvent } from './mockData'

interface AuthorityTimelineProps {
  events: V2AuthorityEvent[]
}

const eventColors: Record<string, string> = {
  granted: 'bg-emerald-500', approved: 'bg-emerald-500', renewed: 'bg-blue-500',
  filed: 'bg-gray-400', new: 'bg-blue-500', changed: 'bg-yellow-500',
  cancelled: 'bg-red-500', revoked: 'bg-red-600', warning: 'bg-yellow-500',
}

export default function AuthorityTimeline({ events }: AuthorityTimelineProps) {
  if (events.length === 0) return <p className="text-sm text-gray-400 text-center py-4">No authority events on record</p>
  return (
    <div className="relative pl-6 space-y-4">
      <div className="absolute left-2.5 top-1 bottom-1 w-px bg-gray-200" />
      {events.map((e, i) => (
        <div key={i} className="relative">
          <div className={`absolute -left-[14px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ${eventColors[e.type] || 'bg-gray-400'}`} />
          <div>
            <p className="text-sm font-medium text-gray-900">{e.event}</p>
            <p className="text-xs text-gray-400">{e.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
