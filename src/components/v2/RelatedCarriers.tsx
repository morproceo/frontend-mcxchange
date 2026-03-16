import { Link2 } from 'lucide-react'
import type { V2RelatedCarrier } from './mockData'

interface RelatedCarriersProps {
  carriers: V2RelatedCarrier[]
}

export default function RelatedCarriers({ carriers }: RelatedCarriersProps) {
  if (!carriers || carriers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900">Related Carriers</h3>
        </div>
        <p className="text-sm text-gray-400 text-center py-4">No related carriers found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-gray-900">Related Carriers</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{carriers.length}</span>
      </div>
      <div className="space-y-2">
        {carriers.map((c, i) => {
          const isActive = c.status === 'active' || c.status === 'A' || (c.status as string) === 'Y'
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.legalName}</p>
                  <p className="text-xs text-gray-400">
                    DOT {c.dotNumber}
                    {c.mcNumber ? ` \u00b7 ${c.mcNumber}` : ''}
                    {c.powerUnits > 0 ? ` \u00b7 ${c.powerUnits} units` : ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isActive ? 'Active' : c.status === 'revoked' ? 'Revoked' : 'Inactive'}
                </span>
                <p className="text-[10px] text-gray-400 mt-0.5">Shared: {c.sharedField}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
