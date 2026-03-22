import { useState } from 'react'
import { AlertTriangle, ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react'
import type { V2ChameleonAnalysis, ChameleonSeverity } from './mockData'

interface ChameleonAlertProps {
  analysis: V2ChameleonAnalysis
}

const severityConfig: Record<ChameleonSeverity, { bg: string; border: string; text: string; badge: string; dot: string }> = {
  critical: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-800', badge: 'bg-red-600 text-white', dot: 'bg-red-500' },
  high: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800', badge: 'bg-orange-500 text-white', dot: 'bg-orange-500' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-800', badge: 'bg-yellow-500 text-white', dot: 'bg-yellow-500' },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-500 text-white', dot: 'bg-blue-400' },
}

const riskLevelConfig: Record<V2ChameleonAnalysis['riskLevel'], { bg: string; border: string; icon: string; headerBg: string; headerText: string }> = {
  none: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', headerBg: 'bg-emerald-500', headerText: 'text-white' },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', headerBg: 'bg-blue-500', headerText: 'text-white' },
  moderate: { bg: 'bg-yellow-50', border: 'border-yellow-300', icon: 'text-yellow-600', headerBg: 'bg-yellow-500', headerText: 'text-white' },
  high: { bg: 'bg-orange-50', border: 'border-orange-300', icon: 'text-orange-600', headerBg: 'bg-orange-500', headerText: 'text-white' },
  critical: { bg: 'bg-red-50', border: 'border-red-300', icon: 'text-red-600', headerBg: 'bg-red-600', headerText: 'text-white' },
}

export default function ChameleonAlert({ analysis }: ChameleonAlertProps) {
  const [expanded, setExpanded] = useState(analysis.riskLevel === 'critical' || analysis.riskLevel === 'high')
  const [expandedFlags, setExpandedFlags] = useState<Set<number>>(new Set())

  const config = riskLevelConfig[analysis.riskLevel]
  const Icon = analysis.riskLevel === 'none' ? ShieldCheck : ShieldAlert

  const toggleFlag = (idx: number) => {
    setExpandedFlags(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className={`rounded-xl border-2 ${config.border} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center justify-between px-4 py-3 ${config.bg} hover:brightness-95 transition-all`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${analysis.riskLevel === 'none' ? 'bg-emerald-100' : analysis.riskLevel === 'critical' ? 'bg-red-100' : analysis.riskLevel === 'high' ? 'bg-orange-100' : 'bg-yellow-100'}`}>
            <Icon className={`w-5 h-5 ${config.icon}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Chameleon Carrier Analysis</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.headerBg} ${config.headerText}`}>
                {analysis.riskLevel === 'none' ? 'Clear' : analysis.riskLevel}
              </span>
              {analysis.flags.length > 0 && (
                <span className="text-xs text-gray-500">{analysis.flags.length} signal{analysis.flags.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{analysis.summary}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Risk score gauge */}
          {analysis.riskScore > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    analysis.riskScore >= 70 ? 'bg-red-500' : analysis.riskScore >= 45 ? 'bg-orange-500' : analysis.riskScore >= 25 ? 'bg-yellow-500' : 'bg-blue-400'
                  }`}
                  style={{ width: `${analysis.riskScore}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-600">{analysis.riskScore}/100</span>
            </div>
          )}
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-4 bg-white space-y-4">
          {/* Summary */}
          <div className={`rounded-lg px-4 py-3 ${config.bg} border ${config.border}`}>
            <div className="flex items-start gap-2">
              <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${config.icon}`} />
              <p className="text-sm text-gray-700">{analysis.summary}</p>
            </div>
          </div>

          {/* Risk score bar (mobile) */}
          {analysis.riskScore > 0 && (
            <div className="sm:hidden">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500">Risk Score</span>
                <span className="text-sm font-bold text-gray-700">{analysis.riskScore}/100</span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    analysis.riskScore >= 70 ? 'bg-red-500' : analysis.riskScore >= 45 ? 'bg-orange-500' : analysis.riskScore >= 25 ? 'bg-yellow-500' : 'bg-blue-400'
                  }`}
                  style={{ width: `${analysis.riskScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Flags list */}
          {analysis.flags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Detection Signals</h4>
              {analysis.flags.map((flag, i) => {
                const sev = severityConfig[flag.severity]
                const isOpen = expandedFlags.has(i)
                return (
                  <div key={i} className={`rounded-lg border ${sev.border} overflow-hidden`}>
                    <button
                      onClick={() => toggleFlag(i)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 ${sev.bg} hover:brightness-95 transition-all text-left`}
                    >
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${sev.text}`}>{flag.signal}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${sev.badge}`}>{flag.severity}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{flag.evidence}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium text-gray-400">+{flag.points}pts</span>
                        {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 py-3 bg-white border-t border-gray-100">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${sev.text}`} />
                          <p className="text-sm text-gray-700 leading-relaxed">{flag.detail}</p>
                        </div>
                        <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 font-medium">Evidence</p>
                          <p className="text-xs text-gray-700 mt-0.5 font-mono">{flag.evidence}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Related revoked carriers */}
          {analysis.relatedRevokedCarriers.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Linked Revoked / Inactive Carriers</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Carrier</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">DOT</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Connection</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.relatedRevokedCarriers.map((rc, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-3 text-gray-700 font-medium">{rc.legalName}</td>
                        <td className="py-2 px-3 font-mono text-xs text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            {rc.dotNumber}
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{rc.sharedField}</span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full uppercase ${
                            rc.status === 'revoked' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                          }`}>{rc.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No flags — clean state */}
          {analysis.flags.length === 0 && (
            <div className="text-center py-4">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No chameleon carrier signals detected</p>
              <p className="text-xs text-gray-400 mt-1">This carrier shows no signs of reincarnated authority</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
