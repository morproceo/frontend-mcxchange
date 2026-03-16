import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { V2SharedEquipment } from './mockData'

interface SharedEquipmentAlertProps {
  data: V2SharedEquipment
}

export default function SharedEquipmentAlert({ data }: SharedEquipmentAlertProps) {
  const [expanded, setExpanded] = useState(false)

  if (data.countSharedVins === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">No Shared Equipment Detected</p>
          <p className="text-xs text-emerald-600">All VINs are unique to this carrier.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border-2 border-orange-300 bg-orange-50 overflow-hidden">
      {/* Banner */}
      <button
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-orange-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-800">
              {data.countSharedVins} Shared VIN{data.countSharedVins > 1 ? 's' : ''} Detected
            </p>
            <p className="text-xs text-orange-600">
              {data.countSharedPowerUnits} power unit{data.countSharedPowerUnits !== 1 ? 's' : ''}, {data.countSharedTrailers} trailer{data.countSharedTrailers !== 1 ? 's' : ''} shared with other carriers
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-orange-500" />}
      </button>

      {/* Expandable table */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-orange-200">
                    <th className="text-left py-2 text-xs font-semibold text-orange-700 uppercase">VIN</th>
                    <th className="text-left py-2 text-xs font-semibold text-orange-700 uppercase">Shared With</th>
                    <th className="text-left py-2 text-xs font-semibold text-orange-700 uppercase">DOT #</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sharedVins.map((sv, i) => (
                    <tr key={i} className="border-b border-orange-100">
                      <td className="py-2 font-mono text-xs text-gray-700">{sv.vin}</td>
                      <td className="py-2 text-gray-700">{sv.sharedWithName}</td>
                      <td className="py-2 text-gray-500 text-xs">{sv.sharedWithDot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
