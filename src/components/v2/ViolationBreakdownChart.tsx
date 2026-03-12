import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { V2ViolationBreakdown, V2BasicAlerts } from './mockData'

interface ViolationBreakdownChartProps {
  violations: V2ViolationBreakdown
  alerts?: V2BasicAlerts
}

const CATEGORIES: { key: keyof V2ViolationBreakdown; label: string; alertKey?: keyof V2BasicAlerts }[] = [
  { key: 'vehicleMaintenance', label: 'Vehicle Maintenance', alertKey: 'vehicleMaintenanceAlert' },
  { key: 'hoursOfService', label: 'Hours of Service', alertKey: 'hoursOfServiceAlert' },
  { key: 'unsafeDriving', label: 'Unsafe Driving', alertKey: 'unsafeDrivingAlert' },
  { key: 'driverFitness', label: 'Driver Fitness', alertKey: 'driverFitnessAlert' },
  { key: 'controlledSubstance', label: 'Controlled Substance', alertKey: 'controlledSubstanceAlert' },
  { key: 'hazardousMaterials', label: 'Hazardous Materials', alertKey: 'hazmatAlert' },
]

export default function ViolationBreakdownChart({ violations, alerts }: ViolationBreakdownChartProps) {
  const maxVal = Math.max(...Object.values(violations), 1)

  return (
    <div className="space-y-3">
      {CATEGORIES.map((cat, i) => {
        const count = violations[cat.key]
        const hasAlert = alerts && cat.alertKey ? alerts[cat.alertKey] : false
        const pct = (count / maxVal) * 100

        return (
          <div key={cat.key}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{cat.label}</span>
                {hasAlert && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold uppercase">
                    <AlertTriangle className="w-3 h-3" />
                    Alert
                  </span>
                )}
              </div>
              <span className={`text-sm font-bold ${count > 0 ? 'text-gray-900' : 'text-gray-400'}`}>{count}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  hasAlert ? 'bg-red-500' : count > 5 ? 'bg-orange-400' : count > 0 ? 'bg-indigo-400' : 'bg-gray-200'
                }`}
                initial={{ width: 0 }}
                animate={{ width: count > 0 ? `${Math.max(pct, 8)}%` : '0%' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
