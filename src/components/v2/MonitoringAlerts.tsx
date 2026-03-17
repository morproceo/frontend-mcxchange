import { AlertTriangle, Info, AlertCircle, Bell } from 'lucide-react'
import type { V2MonitoringAlert } from './mockData'

interface MonitoringAlertsProps {
  alerts: V2MonitoringAlert[]
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
}

const colors = {
  info: 'bg-blue-50 border-blue-200 text-blue-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
}

export default function MonitoringAlerts({ alerts }: MonitoringAlertsProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Carrier Monitoring</h3>
        </div>
        <div className="text-center py-6">
          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No monitoring alerts</p>
          <p className="text-xs text-gray-300 mt-1">This carrier has no recent alerts</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Carrier Monitoring</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{alerts.length}</span>
      </div>
      <div className="space-y-2">
        {alerts.map((a, i) => {
          const Icon = icons[a.severity] || Info
          const desc = (a as any).detail || (a as any).description || ''
          return (
            <div
              key={i}
              className={`rounded-lg border p-3 ${colors[a.severity] || colors.info} ${a.resolved ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  {desc && <p className="text-xs mt-0.5 opacity-80">{desc}</p>}
                  <p className="text-[10px] mt-1 opacity-60">
                    {a.date}
                    {a.resolved ? ' \u2014 Resolved' : ''}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
