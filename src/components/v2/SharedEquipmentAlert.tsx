import { AlertTriangle } from 'lucide-react'
import type { V2SharedEquipment } from './mockData'

interface SharedEquipmentAlertProps {
  data: V2SharedEquipment
}

export default function SharedEquipmentAlert({ data }: SharedEquipmentAlertProps) {
  if (!data || data.countSharedVins === 0) return null

  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-yellow-800">Shared Equipment Detected</p>
          <p className="text-xs text-yellow-700 mt-1">
            {data.countSharedVins} VIN(s) found registered with other carriers.
            This may indicate chameleon carrier risk.
          </p>
          {data.sharedVins && data.sharedVins.length > 0 && (
            <div className="mt-3 space-y-2">
              {data.sharedVins.slice(0, 5).map((sv, i) => (
                <div key={i} className="text-xs bg-yellow-100 rounded-lg px-3 py-2">
                  <code className="font-mono text-yellow-800">{sv.vin}</code>
                  <span className="text-yellow-700 ml-2">
                    shared with DOT {('sharedWithDot' in sv) ? (sv as any).sharedWithDot : ''}{' '}
                    {('sharedWithName' in sv) ? `(${(sv as any).sharedWithName})` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
