import { motion } from 'framer-motion'
import type { V2ViolationBreakdown, V2BasicAlerts } from './mockData'

interface ViolationBreakdownChartProps {
  violations: V2ViolationBreakdown
  alerts: V2BasicAlerts
}

const categories = [
  { key: 'unsafeDriving', label: 'Unsafe Driving', alertKey: 'unsafeDrivingAlert' },
  { key: 'hoursOfService', label: 'Hours of Service', alertKey: 'hoursOfServiceAlert' },
  { key: 'driverFitness', label: 'Driver Fitness', alertKey: 'driverFitnessAlert' },
  { key: 'controlledSubstance', label: 'Controlled Substances', alertKey: 'controlledSubstanceAlert' },
  { key: 'vehicleMaintenance', label: 'Vehicle Maintenance', alertKey: 'vehicleMaintenanceAlert' },
  { key: 'hazardousMaterials', label: 'Hazmat Compliance', alertKey: 'hazmatAlert' },
] as const

export default function ViolationBreakdownChart({ violations, alerts }: ViolationBreakdownChartProps) {
  const maxVal = Math.max(...Object.values(violations), 1)
  return (
    <div className="space-y-3">
      {categories.map((cat, i) => {
        const count = violations[cat.key as keyof V2ViolationBreakdown]
        const hasAlert = alerts[cat.alertKey as keyof V2BasicAlerts]
        const pct = (count / maxVal) * 100
        return (
          <div key={cat.key}>
            <div className="flex justify-between text-xs mb-1">
              <span className={`font-medium ${hasAlert ? 'text-red-600' : 'text-gray-700'}`}>
                {hasAlert && '⚠ '}{cat.label}
              </span>
              <span className="font-bold text-gray-900">{count}</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${hasAlert ? 'bg-red-500' : count > 0 ? 'bg-indigo-500' : 'bg-gray-200'}`}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
