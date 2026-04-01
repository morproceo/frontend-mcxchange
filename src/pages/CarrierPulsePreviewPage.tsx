/**
 * CarrierPulse Preview — public freemium page
 *
 * Lets anyone search a DOT/MC and see the Overview tab with real data.
 * All other tabs are rendered but blurred with a subscribe CTA overlay.
 */
import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Zap, Search, Hash, Loader2, AlertCircle, Lock, ArrowLeft,
  LayoutDashboard, Shield, Activity, Umbrella, Truck, DollarSign,
  ShieldAlert, CheckCircle, Crown,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { useCarrierData } from '../hooks/useCarrierData'
import {
  mapToV2CarrierData, mapToV2AuthorityData, mapToV2AuthorityHistory,
  mapToV2AuthorityPending, mapToV2BasicScores, mapToV2BasicAlerts,
  mapToV2ViolationBreakdown, mapToV2ISSData, mapToV2InspectionSummary,
  mapToV2InspectionRecords, mapToV2Operations, mapToV2ViolationTrend,
  mapToV2CrashData, mapToV2CrashRecords, mapToV2InsurancePolicies,
  mapToV2RenewalTimeline, mapToV2PolicyHistory, mapToV2InsuranceGaps,
  mapToV2Trucks, mapToV2Trailers, mapToV2SharedEquipment,
  mapToV2CargoCapabilities, mapToV2Documents, mapToV2VerificationChecks,
  mapToV2AvailableDocuments, mapToV2RelatedCarriers, mapToV2Percentiles,
  mapToV2MonitoringAlerts, mapToV2RiskScoreTrend, mapToV2ContactHistory,
  mapToV2ComplianceFinancials, mapToV2VinInspections, mapToV2NetworkSignals,
  mapToV2Benchmarks, detectChameleonCarrier,
  calculateCarrierHealthScore,
  mapSMSToV2BasicScores, mapSMSToV2BasicAlerts,
} from '../utils/carrierDataMapper'
import type { FMCSASMSData, FMCSAAuthorityHistory } from '../types'
import {
  mockCarrier as fallbackCarrier, mockAuthority as fallbackAuthority,
  mockAuthorityHistory as fallbackAuthorityHistory,
  mockAuthorityPending as fallbackAuthorityPending,
  mockBasicScores as fallbackBasicScores, mockBasicAlerts as fallbackBasicAlerts,
  mockViolationBreakdown as fallbackViolationBreakdown,
  mockISSData as fallbackISSData, mockInspections as fallbackInspections,
  mockInspectionRecords as fallbackInspectionRecords,
  mockOperations as fallbackOperations, mockViolationTrend as fallbackViolationTrend,
  mockCrashes as fallbackCrashes, mockCrashRecords as fallbackCrashRecords,
  mockInsurancePolicies as fallbackInsurancePolicies,
  mockRenewalTimeline as fallbackRenewalTimeline,
  mockPolicyHistory as fallbackPolicyHistory, mockInsuranceGaps as fallbackInsuranceGaps,
  mockTrucks as fallbackTrucks, mockTrailers as fallbackTrailers,
  mockSharedEquipment as fallbackSharedEquipment,
  mockCargoCapabilities as fallbackCargoCapabilities,
  mockDocuments as fallbackDocuments, mockVerificationChecks as fallbackVerificationChecks,
  mockAvailableDocuments as fallbackAvailableDocuments,
  mockComplianceFinancials as fallbackComplianceFinancials,
  mockRelatedCarriers as fallbackRelatedCarriers,
  mockCarrierPercentiles as fallbackCarrierPercentiles,
  mockMonitoringAlerts as fallbackMonitoringAlerts,
  mockRiskScoreTrend as fallbackRiskScoreTrend,
  mockContactHistory as fallbackContactHistory,
  mockVinInspections as fallbackVinInspections,
  mockNetworkSignals as fallbackNetworkSignals,
  mockBenchmarks as fallbackBenchmarks,
} from '../components/v2/mockData'

// We lazy-import the real CarrierPulse page components via dynamic import
// Instead, we'll render the page inline with blur overlays

const previewTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, locked: false },
  { id: 'authority', label: 'Authority', icon: Shield, locked: true },
  { id: 'safety', label: 'Safety', icon: Activity, locked: true },
  { id: 'insurance', label: 'Insurance', icon: Umbrella, locked: true },
  { id: 'fleet', label: 'Fleet', icon: Truck, locked: true },
  { id: 'credit', label: 'Credit', icon: DollarSign, locked: true },
  { id: 'chameleon', label: 'Chameleon', icon: ShieldAlert, locked: true },
]

function BlurredOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-md bg-white/60 rounded-2xl">
      <div className="text-center max-w-sm px-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Full Report</h3>
        <p className="text-gray-500 text-sm mb-6">
          Subscribe to CarrierPulse to access detailed safety data, insurance records, fleet info, credit reports, and more.
        </p>
        <Link to="/pricing">
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            <Crown className="w-4 h-4 mr-2" />
            View Plans
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Placeholder content for blurred tabs — uses mock data so there's something visible behind the blur
function MockTabContent({ tabId }: { tabId: string }) {
  const labels: Record<string, { title: string; items: string[] }> = {
    authority: {
      title: 'Authority & Compliance',
      items: ['Operating Authority Status', 'Authority History Timeline', 'Pending Applications', 'Cargo Classifications', 'FMCSA Compliance Score'],
    },
    safety: {
      title: 'Safety & Inspections',
      items: ['BASIC Scores (7 Categories)', 'Inspection Records', 'Violation Breakdown', 'Crash History', 'Out-of-Service Rates', 'ISS Prioritization Score'],
    },
    insurance: {
      title: 'Insurance Coverage',
      items: ['Active Policies', 'BIPD Coverage Amounts', 'Cargo Insurance', 'Policy Renewal Timeline', 'Coverage Gap Analysis', 'Insurance History'],
    },
    fleet: {
      title: 'Fleet & Drivers',
      items: ['Power Units Count', 'Fleet Age Distribution', 'Driver Count', 'Equipment Types', 'Shared Equipment Detection', 'Fleet Ownership Breakdown'],
    },
    credit: {
      title: 'Credit Report',
      items: ['Business Credit Score', 'Credit Limit', 'Payment History (DBT)', 'Legal Filings', 'UCC Filings', 'Judgments & Tax Liens', 'Trade Lines'],
    },
    chameleon: {
      title: 'Chameleon Check',
      items: ['Reincarnated Carrier Detection', 'Related Revoked Authorities', 'Address & Officer Matching', 'Risk Score Analysis', 'Flag Details'],
    },
  }

  const data = labels[tabId] || { title: tabId, items: [] }

  return (
    <div className="space-y-4 p-6">
      <h3 className="text-xl font-bold text-gray-900">{data.title}</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.items.map((item, i) => (
          <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-gray-700">{item}</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded-full w-3/4" />
              <div className="h-3 bg-gray-200 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CarrierPulsePreviewPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [dotInput, setDotInput] = useState('')
  const [searchMode, setSearchMode] = useState<'dot' | 'mc'>('mc')
  const [activeDot, setActiveDot] = useState<string | undefined>()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searching, setSearching] = useState(false)

  // If user is logged in with access, redirect to real CarrierPulse
  useEffect(() => {
    if (!isAuthenticated) return
    if (user?.role === 'admin' || user?.role === 'seller') {
      const basePath = user.role === 'admin' ? '/admin/carrier-pulse' : '/seller/carrier-pulse'
      navigate(basePath, { replace: true })
      return
    }
    // Check if buyer has CarrierPulse access
    api.getCarrierPulseAccess().then(res => {
      if (res.success && res.data?.hasAccess) {
        navigate('/buyer/carrier-pulse', { replace: true })
      }
    }).catch(() => {})
  }, [isAuthenticated, user?.role, navigate])

  // Carrier data
  const { carrierReport, loading: carrierLoading, error: carrierError } = useCarrierData(activeDot)

  // FMCSA data
  const [smsData, setSmsData] = useState<FMCSASMSData | null>(null)
  const fmcsaFetchedRef = useRef<string | null>(null)
  useEffect(() => {
    const dot = activeDot
    if (!dot) return
    if (fmcsaFetchedRef.current === dot) return
    fmcsaFetchedRef.current = dot
    api.fmcsaGetSMSData(dot).then(res => { if (res.success && res.data) setSmsData(res.data) }).catch(() => {})
  }, [activeDot])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = dotInput.replace(/\D/g, '')
    if (!cleaned) { setSearchError('Please enter a valid number'); return }

    setSearchError(null)
    setSearching(true)
    setActiveTab('overview')

    try {
      if (searchMode === 'mc') {
        const res = await api.fmcsaLookupByMC(cleaned)
        if (res.success && res.data?.dotNumber) {
          setActiveDot(res.data.dotNumber)
        } else {
          setSearchError('No carrier found with that MC number')
        }
      } else {
        setActiveDot(cleaned)
      }
    } catch (err: any) {
      setSearchError(err.message || 'Search failed')
    } finally {
      setSearching(false)
    }
  }

  // Build carrier context for Overview
  const carrierCtx = useMemo(() => {
    if (!carrierReport) return null
    const smsScores = smsData ? mapSMSToV2BasicScores(smsData) : null
    const smsAlerts = smsData ? mapSMSToV2BasicAlerts(smsData) : null
    const basicScores = smsScores || mapToV2BasicScores(carrierReport)
    const basicAlerts = smsAlerts || mapToV2BasicAlerts(carrierReport)
    const healthResult = calculateCarrierHealthScore(carrierReport, smsData as any)

    return {
      carrier: mapToV2CarrierData(carrierReport),
      authority: mapToV2AuthorityData(carrierReport),
      basicScores,
      basicAlerts,
      inspections: mapToV2InspectionSummary(carrierReport),
      crashes: mapToV2CrashData(carrierReport),
      insurancePolicies: mapToV2InsurancePolicies(carrierReport),
      insuranceGaps: mapToV2InsuranceGaps(carrierReport),
      trucks: mapToV2Trucks(carrierReport),
      healthCategories: healthResult.categories,
      healthScore: healthResult.score,
      complianceFinancials: mapToV2ComplianceFinancials(undefined, carrierReport),
      networkSignals: mapToV2NetworkSignals(carrierReport, undefined),
    }
  }, [carrierReport, smsData])

  // ==========================================
  // SEARCH VIEW
  // ==========================================
  if (!activeDot) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">CarrierPulse</h1>
            <p className="text-gray-500 mt-2">Try it free — enter any MC or DOT number</p>
          </div>

          {/* Search Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => { setSearchMode('dot'); setSearchError(null) }}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${searchMode === 'dot' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                DOT Number
              </button>
              <button
                onClick={() => { setSearchMode('mc'); setSearchError(null) }}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${searchMode === 'mc' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                MC Number
              </button>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder={searchMode === 'mc' ? 'Enter MC number...' : 'Enter DOT number...'}
                value={dotInput}
                onChange={(e) => setDotInput(e.target.value)}
                icon={<Hash className="w-4 h-4" />}
              />
            </div>
            <Button type="submit" disabled={searching}>
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </form>

          {searchError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {searchError}
            </div>
          )}

          {/* Feature Preview */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
            {previewTabs.map(tab => (
              <div key={tab.id} className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <tab.icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700">{tab.label}</span>
                {tab.locked && <Lock className="w-3 h-3 text-gray-300 ml-auto" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // ==========================================
  // REPORT VIEW
  // ==========================================
  const isLoading = carrierLoading && !carrierReport

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => { setActiveDot(undefined); setDotInput(''); setSmsData(null); fmcsaFetchedRef.current = null }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" />
        New Search
      </button>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-indigo-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Pulling carrier data...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {carrierError && !carrierReport && (
        <Card className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Carrier Not Found</h2>
          <p className="text-gray-500">No data found for DOT {activeDot}. Please check the number.</p>
        </Card>
      )}

      {/* Report */}
      {carrierCtx && (
        <>
          {/* Carrier Hero */}
          <motion.div
            className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 sm:p-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">{carrierCtx.carrier.legalName}</h2>
                {carrierCtx.carrier.dbaName && carrierCtx.carrier.dbaName !== carrierCtx.carrier.legalName && (
                  <p className="text-white/70 text-sm">DBA: {carrierCtx.carrier.dbaName}</p>
                )}
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-white/80">
                  <span>DOT: <strong className="text-white">{carrierCtx.carrier.dotNumber}</strong></span>
                  {carrierCtx.carrier.mcNumber && <span>MC: <strong className="text-white">{carrierCtx.carrier.mcNumber}</strong></span>}
                  <span>Drivers: <strong className="text-white">{carrierCtx.carrier.totalDriversCDL}</strong></span>
                  <span>Power Units: <strong className="text-white">{carrierCtx.carrier.powerUnits}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                  carrierCtx.carrier.operatingStatus === 'authorized'
                    ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30'
                    : 'bg-red-500/20 text-red-100 border border-red-400/30'
                }`}>
                  {carrierCtx.carrier.operatingStatus}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {previewTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.locked && <Lock className="w-3 h-3 opacity-50" />}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Health Score */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="text-center">
                  <div className={`text-4xl font-black mb-1 ${
                    carrierCtx.healthScore >= 70 ? 'text-emerald-600' :
                    carrierCtx.healthScore >= 50 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {carrierCtx.healthScore}
                  </div>
                  <p className="text-sm text-gray-500">Health Score</p>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-black text-gray-900">{carrierCtx.basicScores.length}</div>
                  <p className="text-sm text-gray-500">BASIC Categories</p>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-black text-gray-900">{carrierCtx.insurancePolicies.length}</div>
                  <p className="text-sm text-gray-500">Insurance Policies</p>
                </Card>
                <Card className="text-center">
                  <div className="text-4xl font-black text-gray-900">{carrierCtx.trucks.length}</div>
                  <p className="text-sm text-gray-500">Power Units</p>
                </Card>
              </div>

              {/* Health Categories */}
              {carrierCtx.healthCategories.length > 0 && (
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Health Breakdown</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {carrierCtx.healthCategories.map((cat: any) => (
                      <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                        <span className={`text-sm font-bold ${
                          cat.score >= 70 ? 'text-emerald-600' :
                          cat.score >= 50 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {cat.score}/100
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Network Signals */}
              {carrierCtx.networkSignals.length > 0 && (
                <Card>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Network Signals</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {carrierCtx.networkSignals.slice(0, 6).map((signal: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
                          signal.status === 'positive' ? 'text-emerald-500' :
                          signal.status === 'negative' ? 'text-red-500' : 'text-gray-400'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{signal.label}</p>
                          <p className="text-xs text-gray-500">{signal.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Upsell banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Want the full picture?</h3>
                <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                  Subscribe to unlock Safety Scores, Insurance Details, Fleet Data, Credit Reports, Chameleon Detection, and more.
                </p>
                <Link to="/pricing">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Crown className="w-4 h-4 mr-2" />
                    See Plans & Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Blurred locked tabs */
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative min-h-[400px] rounded-2xl overflow-hidden border border-gray-200"
            >
              <MockTabContent tabId={activeTab} />
              <BlurredOverlay />
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
