import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Shield, AlertTriangle, Truck, FileWarning, Phone, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { format, parseISO, isValid } from 'date-fns'

function safeFmtDate(dateStr: string | null | undefined, fmt = 'MMM d, yyyy'): string {
  if (!dateStr) return 'N/A'
  try { const d = parseISO(dateStr); return isValid(d) ? format(d, fmt) : 'N/A' } catch { return 'N/A' }
}
import { V2MonitoringAlert } from './mockData'

interface MonitoringAlertsProps {
  alerts: V2MonitoringAlert[]
}

const typeIcons = {
  authority: Shield,
  insurance: FileWarning,
  violation: AlertTriangle,
  oos: Truck,
  crash: AlertTriangle,
  contact: Phone,
}

const severityStyles = {
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-500', text: 'text-red-400' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-500', text: 'text-amber-400' },
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-500', text: 'text-blue-400' },
}

export default function MonitoringAlerts({ alerts }: MonitoringAlertsProps) {
  const [expanded, setExpanded] = useState(false)
  const unresolvedCount = alerts.filter(a => !a.resolved).length
  const shown = expanded ? alerts : alerts.slice(0, 3)

  return (
    <div className="rounded-xl overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Carrier Monitoring</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Real-time alerts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unresolvedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
              {unresolvedCount} Active
            </span>
          )}
          <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-white/50 text-[10px] font-bold">
            {alerts.length} Total
          </span>
        </div>
      </div>

      {/* Alerts */}
      <div className="px-5 py-3 space-y-2">
        <AnimatePresence>
          {shown.map((alert, i) => {
            const Icon = typeIcons[alert.type]
            const styles = severityStyles[alert.severity]
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-3 p-3 rounded-lg border ${styles.bg} ${styles.border}`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${styles.bg}`}>
                  <Icon className={`w-3.5 h-3.5 ${styles.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-white/90">{alert.title}</p>
                    {alert.resolved && (
                      <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">{alert.detail}</p>
                  <p className="text-[10px] text-white/25 mt-1">{safeFmtDate(alert.date)}</p>
                </div>
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2 ${alert.resolved ? 'bg-emerald-500' : styles.dot} ${!alert.resolved ? 'animate-pulse' : ''}`} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Toggle */}
      {alerts.length > 3 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2.5 flex items-center justify-center gap-1 text-[11px] font-semibold text-white/40 hover:text-white/60 border-t border-white/[0.06] transition-colors"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show All {alerts.length} Alerts</>}
        </button>
      )}
    </div>
  )
}
