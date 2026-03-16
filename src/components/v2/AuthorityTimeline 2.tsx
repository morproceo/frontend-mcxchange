import { motion } from 'framer-motion'
import clsx from 'clsx'
import { format, parseISO, isValid } from 'date-fns'

function safeFmtDate(dateStr: string | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!dateStr) return 'N/A'
  try { const d = parseISO(dateStr); return isValid(d) ? format(d, fmt) : 'N/A' } catch { return 'N/A' }
}

interface TimelineEvent {
  date: string
  event: string
  type: string
}

interface AuthorityTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const typeColors: Record<string, { dot: string; line: string; bg: string; text: string }> = {
  filed: { dot: 'bg-blue-500', line: 'bg-blue-200', bg: 'bg-blue-50', text: 'text-blue-700' },
  approved: { dot: 'bg-indigo-500', line: 'bg-indigo-200', bg: 'bg-indigo-50', text: 'text-indigo-700' },
  granted: { dot: 'bg-emerald-500', line: 'bg-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  renewed: { dot: 'bg-green-500', line: 'bg-green-200', bg: 'bg-green-50', text: 'text-green-700' },
  changed: { dot: 'bg-yellow-500', line: 'bg-yellow-200', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  new: { dot: 'bg-blue-500', line: 'bg-blue-200', bg: 'bg-blue-50', text: 'text-blue-700' },
  warning: { dot: 'bg-orange-500', line: 'bg-orange-200', bg: 'bg-orange-50', text: 'text-orange-700' },
  revoked: { dot: 'bg-red-500', line: 'bg-red-200', bg: 'bg-red-50', text: 'text-red-700' },
  expired: { dot: 'bg-red-500', line: 'bg-red-200', bg: 'bg-red-50', text: 'text-red-700' },
  cancelled: { dot: 'bg-gray-500', line: 'bg-gray-200', bg: 'bg-gray-50', text: 'text-gray-700' },
}

export default function AuthorityTimeline({ events, className }: AuthorityTimelineProps) {
  return (
    <div className={clsx('relative', className)}>
      {events.map((event, i) => {
        const color = typeColors[event.type] || typeColors.filed
        const isLast = i === events.length - 1
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="relative flex gap-4 pb-6"
          >
            {/* Vertical line */}
            {!isLast && (
              <div className={clsx('absolute left-[11px] top-6 w-0.5 h-full', color.line)} />
            )}
            {/* Dot */}
            <div className={clsx('relative z-10 w-6 h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-0.5', color.dot)} />
            {/* Content */}
            <div className={clsx('flex-1 rounded-lg px-3 py-2', color.bg)}>
              <p className={clsx('text-sm font-medium', color.text)}>{event.event}</p>
              <p className="text-xs text-gray-400 mt-0.5">{safeFmtDate(event.date)}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
