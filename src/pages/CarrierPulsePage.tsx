import { useState, useEffect, createContext, useContext, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, isValid } from 'date-fns'

function safeFmtDate(dateStr: string | null | undefined, fmt: string = 'MMM d, yyyy'): string {
  if (!dateStr) return 'N/A';
  try {
    const d = parseISO(dateStr);
    return isValid(d) ? format(d, fmt) : 'N/A';
  } catch {
    return 'N/A';
  }
}

import {
  LayoutDashboard, Shield, Activity, Umbrella, Truck, FileText,
  CheckCircle, XCircle, AlertTriangle, ArrowLeft, MapPin,
  Calendar, Users, Hash, Phone, Building2, Package, DollarSign,
  TrendingUp, TrendingDown, Clock, ExternalLink, Mail,
  BarChart3, Eye, Zap, ChevronRight, ChevronDown, ChevronUp, MapPinned,
  Coins, Search, Loader2, AlertCircle,
} from 'lucide-react'
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

import TabNav, { TabItem } from '../components/v2/TabNav'
import CircularGauge from '../components/v2/CircularGauge'
import SpeedometerGauge from '../components/v2/SpeedometerGauge'
import CoverageBar from '../components/v2/CoverageBar'
import StatusBadge from '../components/v2/StatusBadge'
import ScoreCard from '../components/v2/ScoreCard'
import AuthorityTimeline from '../components/v2/AuthorityTimeline'
import CarrierHealthScore from '../components/v2/CarrierHealthScore'
import CertificationBadges from '../components/v2/CertificationBadges'
import ViolationBreakdownChart from '../components/v2/ViolationBreakdownChart'
import SharedEquipmentAlert from '../components/v2/SharedEquipmentAlert'
import DriverBreakdown from '../components/v2/DriverBreakdown'
import FleetOwnershipBar from '../components/v2/FleetOwnershipBar'
import DonutChart from '../components/v2/DonutChart'
import InfoGrid from '../components/v2/InfoGrid'
import MonitoringAlerts from '../components/v2/MonitoringAlerts'
import SparklineChart from '../components/v2/SparklineChart'
import InsuranceGapTimeline from '../components/v2/InsuranceGapTimeline'
import FleetAgeHistogram from '../components/v2/FleetAgeHistogram'
import ViolationTrendChart from '../components/v2/ViolationTrendChart'
import RelatedCarriers from '../components/v2/RelatedCarriers'
import CarrierComparison from '../components/v2/CarrierComparison'

import {
  mockCarrier as fallbackCarrier, mockAuthority as fallbackAuthority,
  mockAuthorityHistory as fallbackAuthorityHistory, mockBasicScores as fallbackBasicScores,
  mockInspections as fallbackInspections, mockCrashes as fallbackCrashes,
  mockInsurancePolicies as fallbackInsurancePolicies, mockRenewalTimeline as fallbackRenewalTimeline,
  mockPolicyHistory as fallbackPolicyHistory, mockTrucks as fallbackTrucks,
  mockTrailers as fallbackTrailers, mockVinInspections as fallbackVinInspections,
  mockNetworkSignals as fallbackNetworkSignals, mockBenchmarks as fallbackBenchmarks,
  mockDocuments as fallbackDocuments, mockVerificationChecks as fallbackVerificationChecks,
  mockOperations as fallbackOperations, mockViolationBreakdown as fallbackViolationBreakdown,
  mockBasicAlerts as fallbackBasicAlerts, mockSharedEquipment as fallbackSharedEquipment,
  mockAuthorityPending as fallbackAuthorityPending, mockContactHistory as fallbackContactHistory,
  mockCargoCapabilities as fallbackCargoCapabilities,
  mockComplianceFinancials as fallbackComplianceFinancials, mockAvailableDocuments as fallbackAvailableDocuments,
  mockMonitoringAlerts as fallbackMonitoringAlerts, mockRiskScoreTrend as fallbackRiskScoreTrend,
  mockInsuranceGaps as fallbackInsuranceGaps,
  mockViolationTrend as fallbackViolationTrend, mockRelatedCarriers as fallbackRelatedCarriers,
  mockCarrierPercentiles as fallbackCarrierPercentiles,
  mockISSData as fallbackISSData, mockInspectionRecords as fallbackInspectionRecords,
  mockCrashRecords as fallbackCrashRecords,
  getStatusLevel, statusColors, StatusLevel,
  V2CarrierData, V2AuthorityData, V2AuthorityEvent, V2BasicScore,
  V2InspectionSummary, V2CrashData, V2InsurancePolicy, V2RenewalEvent,
  V2PolicyEvent, V2TruckData, V2TrailerData, V2VinInspection,
  V2InspectionRecord, V2CrashRecord, V2ISSData, V2OperationsSummary,
  V2ViolationBreakdown, V2SharedEquipment, V2AuthorityPending, V2BasicAlerts,
  V2ContactHistory, V2CargoCapabilities, V2ComplianceFinancials,
  V2AvailableDocument, V2MonitoringAlert, V2RiskScoreTrend,
  V2InsuranceGap, V2ViolationTrend, V2RelatedCarrier, V2CarrierPercentile,
  V2NetworkSignal, V2BenchmarkData, V2DocumentItem,
} from '../components/v2/mockData'

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
  mapToV2ComplianceFinancials,
  calculateCarrierHealthScore,
  HealthCategory,
} from '../utils/carrierDataMapper'

// ============================================================
// CARRIER DATA CONTEXT
// ============================================================
interface CarrierDataContextType {
  carrier: V2CarrierData
  authority: V2AuthorityData
  authorityHistory: V2AuthorityEvent[]
  authorityPending: V2AuthorityPending
  basicScores: V2BasicScore[]
  basicAlerts: V2BasicAlerts
  violationBreakdown: V2ViolationBreakdown
  issData: V2ISSData
  inspections: V2InspectionSummary
  inspectionRecords: V2InspectionRecord[]
  operations: V2OperationsSummary
  violationTrend: V2ViolationTrend[]
  crashes: V2CrashData
  crashRecords: V2CrashRecord[]
  insurancePolicies: V2InsurancePolicy[]
  renewalTimeline: V2RenewalEvent[]
  policyHistory: V2PolicyEvent[]
  insuranceGaps: V2InsuranceGap[]
  trucks: V2TruckData[]
  trailers: V2TrailerData[]
  sharedEquipment: V2SharedEquipment
  cargoCapabilities: V2CargoCapabilities
  documents: V2DocumentItem[]
  verificationChecks: any[]
  availableDocuments: V2AvailableDocument[]
  complianceFinancials: V2ComplianceFinancials
  relatedCarriers: V2RelatedCarrier[]
  percentiles: V2CarrierPercentile[]
  monitoringAlerts: V2MonitoringAlert[]
  riskScoreTrend: V2RiskScoreTrend[]
  contactHistory: V2ContactHistory
  vinInspections: V2VinInspection[]
  networkSignals: V2NetworkSignal[]
  benchmarks: V2BenchmarkData[]
  healthCategories: HealthCategory[]
  carrierLoading: boolean
  carrierError: string | null
}

const CarrierDataContext = createContext<CarrierDataContextType | null>(null)

function useCarrierDataContext(): CarrierDataContextType {
  const ctx = useContext(CarrierDataContext)
  if (!ctx) throw new Error('useCarrierDataContext must be used within CarrierDataContext.Provider')
  return ctx
}

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'authority', label: 'Authority & Compliance', icon: Shield },
  { id: 'safety', label: 'Safety & Inspections', icon: Activity },
  { id: 'insurance', label: 'Insurance', icon: Umbrella },
  { id: 'fleet', label: 'Fleet & Drivers', icon: Truck },
  { id: 'documents', label: 'Documents & Verification', icon: FileText },
  { id: 'full-report', label: 'Full Report', icon: BarChart3 },
]

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function fmtNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n)
}

// ============================================================
// RECENT SEARCHES — localStorage
// ============================================================
interface RecentSearch {
  dotNumber: string
  carrierName: string
  timestamp: number
}

const RECENT_SEARCHES_KEY = 'carrierPulse_recentSearches'

function getRecentSearches(): RecentSearch[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function addRecentSearch(dotNumber: string, carrierName: string) {
  const existing = getRecentSearches().filter(s => s.dotNumber !== dotNumber)
  const updated = [{ dotNumber, carrierName, timestamp: Date.now() }, ...existing].slice(0, 10)
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
}

// ============================================================
// LOADING SKELETON
// ============================================================
function CarrierLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-full" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-28" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center pt-2 text-sm text-gray-400">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading carrier intelligence data...
      </div>
    </div>
  )
}

// ============================================================
// HERO HEADER — simplified, no pricing
// ============================================================
function PulseHeroHeader({ onSearchAnother }: { onSearchAnother: () => void }) {
  const { carrier: c } = useCarrierDataContext()
  const healthColor = c.carrierHealthScore >= 80 ? '#34d399' : c.carrierHealthScore >= 60 ? '#fbbf24' : '#f87171'
  const healthRadius = 30
  const healthCirc = 2 * Math.PI * healthRadius

  return (
    <div className="w-full">
      <div className="relative rounded-2xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
      }}>
        {/* Ambient glow orbs */}
        <motion.div
          className="absolute rounded-full blur-[100px] opacity-40"
          style={{ width: 400, height: 400, top: '-30%', left: '-5%', background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute rounded-full blur-[100px] opacity-30"
          style={{ width: 350, height: 350, bottom: '-25%', right: '-5%', background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
          animate={{ x: [0, -25, 0], y: [0, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Shimmer */}
        <motion.div
          className="absolute h-[1px] top-0 left-0"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.6) 40%, rgba(6,182,212,0.6) 60%, transparent 100%)', width: '30%' }}
          animate={{ x: ['-30%', '400%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 4 }}
        />

        <div className="relative px-6 sm:px-8 py-7 sm:py-10">
          {/* Top row */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  {c.operatingStatus === 'authorized' ? 'Active Authority' : 'Not Authorized'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{c.legalName}</h1>
              {c.dbaName && <p className="text-white/40 text-sm mt-1 font-medium">DBA: {c.dbaName}</p>}
            </div>

            {/* Health Score Ring */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex-shrink-0 hidden sm:block">
              <div className="relative w-[80px] h-[80px]">
                <svg width={80} height={80} viewBox="0 0 80 80">
                  <circle cx={40} cy={40} r={healthRadius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={5} />
                  <motion.circle
                    cx={40} cy={40} r={healthRadius} fill="none"
                    stroke={healthColor} strokeWidth={5} strokeLinecap="round"
                    strokeDasharray={healthCirc}
                    initial={{ strokeDashoffset: healthCirc }}
                    animate={{ strokeDashoffset: healthCirc * (1 - c.carrierHealthScore / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-white">{c.carrierHealthScore}</span>
                  <span className="text-[8px] font-semibold uppercase tracking-widest text-white/40">Health</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Key metrics */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mt-6">
            {[
              { label: 'MC Number', value: c.mcNumber, accent: false },
              { label: 'DOT Number', value: c.dotNumber, accent: false },
              { label: 'Location', value: c.location, accent: false },
              { label: 'Authority Age', value: `${c.yearsActive} yrs`, accent: false },
              { label: 'Annual Miles', value: c.mcs150Mileage > 0 ? `${(c.mcs150Mileage / 1000000).toFixed(1)}M mi` : 'N/A', accent: true },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`rounded-xl px-4 py-3 border backdrop-blur-sm ${
                  stat.accent ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-white/[0.04] border-white/[0.06]'
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">{stat.label}</p>
                <p className={`text-lg sm:text-xl font-extrabold mt-0.5 ${stat.accent ? 'text-indigo-300' : 'text-white'}`}>{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Status ribbon */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 pt-5 border-t border-white/[0.06]"
          >
            {[
              { label: 'Safety', value: c.safetyRating === 'not-rated' ? 'Not Rated' : 'Satisfactory', color: c.safetyRating === 'satisfactory' ? 'emerald' as const : 'cyan' as const },
              { label: 'Insurance', value: c.insuranceStatus === 'current' ? 'Current' : c.insuranceStatus === 'pending' ? 'Pending' : 'Expired', color: c.insuranceStatus === 'current' ? 'emerald' as const : 'cyan' as const },
              { label: 'Fleet', value: `${c.powerUnits} Units`, color: 'cyan' as const },
              { label: 'Drivers', value: `${c.totalDriversCDL} CDL`, color: 'cyan' as const },
            ].map((chip) => (
              <div key={chip.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <div className={`w-1.5 h-1.5 rounded-full ${chip.color === 'emerald' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">{chip.label}</span>
                <span className="text-xs font-bold text-white/80">{chip.value}</span>
              </div>
            ))}

            {c.smartwayFlag && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">SmartWay</span>
              </div>
            )}

            <div className="flex-1" />

            {/* Search Another button */}
            <button
              onClick={onSearchAnother}
              className="px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-sm font-medium text-white/70 hover:text-white flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Another
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// TAB 1: OVERVIEW — stripped listing-specific sections
// ============================================================
function OverviewTab() {
  const ctx = useCarrierDataContext()
  const { carrier: c, complianceFinancials, cargoCapabilities, percentiles, healthCategories } = ctx
  const safetyLevel = getStatusLevel('safety', c.safetyRating)
  const insuranceLevel = getStatusLevel('insurance', c.insuranceStatus)
  const authorityLevel = getStatusLevel('authority', c.operatingStatus)
  const trustLevel = getStatusLevel('trust', c.trustScore)
  const riskLevel = getStatusLevel('risk', c.riskScore)

  return (
    <div className="space-y-6">
      <CarrierHealthScore score={c.carrierHealthScore} categories={healthCategories.length > 0 ? healthCategories : undefined} />

      {/* Quick Verdict */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-5 flex items-center gap-4"
      >
        <div className="p-3 bg-emerald-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-emerald-800">Good Standing</h3>
          <p className="text-sm text-emerald-600">This MC authority has a clean record with active insurance and no major violations.</p>
        </div>
      </motion.div>

      {/* Score Summary */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Score Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ScoreCard icon={Activity} label="Safety" value="Satisfactory" level={safetyLevel} />
          <ScoreCard icon={Umbrella} label="Insurance" value="Current" level={insuranceLevel} />
          <ScoreCard icon={Truck} label="Fleet Size" value={`${c.powerUnits} Units`} level="good" />
          <ScoreCard icon={CheckCircle} label="Authority" value="Active" level={authorityLevel} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Card padding="md" className="flex items-center gap-4">
            <CircularGauge value={c.trustScore} max={100} size={70} label="Trust" level={trustLevel} />
            <div>
              <p className="text-sm font-semibold text-gray-800">Trust Score</p>
              <p className="text-xs text-gray-400">Composite carrier reliability</p>
            </div>
          </Card>
          <Card padding="md" className="flex items-center gap-4">
            <CircularGauge value={c.riskScore} max={100} size={70} label="Risk" level={riskLevel} />
            <div>
              <p className="text-sm font-semibold text-gray-800">Risk Score</p>
              <p className="text-xs text-gray-400">Lower is better</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Certifications */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
        <CertificationBadges smartway={c.smartwayFlag} carbtru={c.carbtruFlag} phmsa={c.phmsaFlag} />
      </Card>

      {/* Compliance & Financials */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-indigo-500" />
          Compliance & Financials
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className={`rounded-lg p-4 border ${complianceFinancials.entryAuditCompleted ? 'bg-emerald-50 border-emerald-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              {complianceFinancials.entryAuditCompleted ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-yellow-600" />}
              <p className="text-sm font-semibold text-gray-800">New Entrant Audit</p>
            </div>
            <p className="text-xs text-gray-500">{complianceFinancials.entryAuditCompleted ? 'Completed — carrier passed entry audit' : 'Pending — audit not yet completed'}</p>
          </div>
          <div className={`rounded-lg p-4 border ${complianceFinancials.hasFactoring ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-semibold text-gray-800">Factoring</p>
            </div>
            {complianceFinancials.hasFactoring ? (
              <p className="text-xs text-gray-500">{complianceFinancials.factoringCompany} — {complianceFinancials.factoringRate}% rate</p>
            ) : (
              <p className="text-xs text-gray-500">No factoring company on file</p>
            )}
          </div>
        </div>
      </Card>

      {/* Industry Percentile Ranking — full access */}
      {percentiles.length > 0 && <CarrierComparison percentiles={percentiles} />}
    </div>
  )
}

// ============================================================
// TAB 2: AUTHORITY & COMPLIANCE
// ============================================================
function AuthorityTab() {
  const { carrier: c, authority, authorityHistory, authorityPending, cargoCapabilities } = useCarrierDataContext()
  const opLevel = getStatusLevel('authority', c.operatingStatus)

  const cargoGroups = [
    { title: 'General', items: [
      { name: 'General Freight', active: cargoCapabilities.generalFreight },
      { name: 'Household Goods', active: cargoCapabilities.householdGoods },
      { name: 'Building Materials', active: cargoCapabilities.buildingMaterials },
      { name: 'Paper Products', active: cargoCapabilities.paperProducts },
      { name: 'Beverages', active: cargoCapabilities.beverages },
      { name: 'Intermodal Containers', active: cargoCapabilities.intermodalContainers },
      { name: 'Construction', active: cargoCapabilities.construction },
    ]},
    { title: 'Specialized', items: [
      { name: 'Metal: Sheets/Coils', active: cargoCapabilities.metalSheets },
      { name: 'Motor Vehicles', active: cargoCapabilities.motorVehicles },
      { name: 'Machinery/Large Objects', active: cargoCapabilities.machineryLargeObjects },
      { name: 'Oil Field Equipment', active: cargoCapabilities.oilFieldEquipment },
      { name: 'Mobile Homes', active: cargoCapabilities.mobileHomes },
      { name: 'Driveway/Towaway', active: cargoCapabilities.drivewayTowaway },
    ]},
    { title: 'Temperature Controlled', items: [
      { name: 'Fresh Produce', active: cargoCapabilities.freshProduce },
      { name: 'Refrigerated Food', active: cargoCapabilities.refrigeratedFood },
      { name: 'Meat', active: cargoCapabilities.meat },
    ]},
    { title: 'Bulk & Hazardous', items: [
      { name: 'Liquids', active: cargoCapabilities.liquids },
      { name: 'Chemicals', active: cargoCapabilities.chemicals },
      { name: 'Dry Bulk', active: cargoCapabilities.commoditiesDryBulk },
      { name: 'Livestock', active: cargoCapabilities.livestock },
      { name: 'Coal/Coke', active: cargoCapabilities.coalCoke },
    ]},
  ]

  const pendingKeys: { key: keyof typeof authority; pendingKey: keyof typeof authorityPending; reviewKey: keyof typeof authorityPending }[] = [
    { key: 'common', pendingKey: 'commonPending', reviewKey: 'commonReview' },
    { key: 'contract', pendingKey: 'contractPending', reviewKey: 'contractReview' },
    { key: 'broker', pendingKey: 'brokerPending', reviewKey: 'brokerReview' },
  ]

  return (
    <div className="space-y-6">
      {/* Operating Status Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border-2 p-6 text-center ${opLevel === 'excellent' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
      >
        <h2 className={`text-3xl font-black tracking-wide ${opLevel === 'excellent' ? 'text-emerald-700' : 'text-red-700'}`}>
          {c.operatingStatus === 'authorized' ? 'AUTHORIZED' : 'NOT AUTHORIZED'}
        </h2>
        <p className={`text-sm mt-1 ${opLevel === 'excellent' ? 'text-emerald-600' : 'text-red-600'}`}>
          Operating authority status with FMCSA
        </p>
      </motion.div>

      {/* Authority Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {([
          { key: 'common' as const, label: 'Common Authority', pIdx: 0 },
          { key: 'contract' as const, label: 'Contract Authority', pIdx: 1 },
          { key: 'broker' as const, label: 'Broker Authority', pIdx: 2 },
        ]).map(({ key, label, pIdx }) => {
          const auth = authority[key]
          const level = getStatusLevel('authority', auth.status)
          const pInfo = pendingKeys[pIdx]
          const isPending = authorityPending[pInfo.pendingKey]
          const isReview = authorityPending[pInfo.reviewKey]
          return (
            <Card key={key} padding="none" className="overflow-hidden">
              <div className={`h-1.5 ${auth.status === 'active' ? 'bg-emerald-500' : auth.status === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <div className="p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge level={level} label={auth.status.toUpperCase()} size="md" />
                  {isPending && <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">Pending</span>}
                  {isReview && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Review</span>}
                </div>
                {auth.grantedDate && <p className="text-xs text-gray-400 mt-2">Granted: {safeFmtDate(auth.grantedDate)}</p>}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Authority Risk Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`rounded-lg p-4 text-center border ${c.totalRevocations === 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-2xl font-bold ${c.totalRevocations === 0 ? 'text-emerald-600' : 'text-red-600'}`}>{c.totalRevocations}</p>
          <p className="text-xs text-gray-500">Total Revocations</p>
        </div>
        <div className="rounded-lg p-4 text-center border bg-gray-50 border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{c.daysSinceLastRevocation ?? 'N/A'}</p>
          <p className="text-xs text-gray-500">Days Since Last Revocation</p>
        </div>
        <div className="rounded-lg p-4 text-center border bg-gray-50 border-gray-100">
          <p className="text-2xl font-bold text-indigo-600">{Math.floor(c.authorityAgeDays / 365)}y {Math.floor((c.authorityAgeDays % 365) / 30)}m</p>
          <p className="text-xs text-gray-500">Authority Age</p>
        </div>
      </div>

      {/* Registration Details */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-indigo-500" />
          Registration Details
        </h3>
        <InfoGrid items={[
          { label: 'Legal Name', value: c.legalName },
          { label: 'DBA Name', value: c.dbaName || 'N/A' },
          { label: 'EIN', value: c.ein, blur: true },
          { label: 'Entity Type', value: c.entityType },
          { label: 'MC Number', value: c.mcNumber },
          { label: 'DOT Number', value: c.dotNumber },
          { label: 'Power Units', value: String(c.powerUnits) },
          { label: 'Drivers', value: String(c.drivers) },
          { label: 'MCS-150 Date', value: safeFmtDate(c.mcs150Date) },
          { label: 'MCS-150 Mileage', value: fmtNumber(c.mcs150Mileage) + ' mi' },
          { label: 'Registered', value: safeFmtDate(c.registrantDate) },
          { label: 'Years Active', value: `${c.yearsActive} years` },
        ]} />
      </Card>

      {/* Cargo Capabilities */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cargo Capabilities</h3>
        <div className="space-y-4">
          {cargoGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{group.title}</p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={item.name}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg border ${item.active ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-100 line-through'}`}
                  >{item.name}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Authority History Timeline */}
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          Authority History
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">CarrierOk</span>
        </h3>
        <AuthorityTimeline events={[...authorityHistory].reverse()} />
      </Card>
    </div>
  )
}

// ============================================================
// INSPECTION RECORDS PANEL
// ============================================================
function InspectionRecordsPanel() {
  const { inspectionRecords } = useCarrierDataContext()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [resultFilter, setResultFilter] = useState<'all' | 'clean' | 'violations' | 'oos'>('all')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)

  const filtered = inspectionRecords.filter(rec => {
    if (resultFilter === 'clean' && rec.violations > 0) return false
    if (resultFilter === 'violations' && rec.violations === 0) return false
    if (resultFilter === 'oos' && !rec.oos) return false
    if (typeFilter && !rec.level.toLowerCase().includes(typeFilter.toLowerCase())) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return rec.reportNumber.toLowerCase().includes(q) || rec.state.toLowerCase().includes(q) || rec.type.toLowerCase().includes(q) ||
        rec.violationDetails.some(v => v.category.toLowerCase().includes(q) || v.group.toLowerCase().includes(q) || v.description.toLowerCase().includes(q))
    }
    return true
  })

  const totalInspections = inspectionRecords.length
  const cleanCount = inspectionRecords.filter(r => r.violations === 0).length
  const oosCount = inspectionRecords.filter(r => r.oos).length
  const cleanRate = totalInspections > 0 ? Math.round((cleanCount / totalInspections) * 100) : 0

  const severityColor = (severity: number) => severity >= 8 ? 'bg-red-500' : severity >= 5 ? 'bg-yellow-500' : 'bg-blue-500'

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
      <div className="px-5 pt-5 pb-4">
        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-500" />
          Inspection Records
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">CarrierOk</span>
        </h4>
      </div>

      <div className="px-5 pb-4">
        <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Inspections</span>
              <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-gray-400" /> Clean <span className="font-semibold text-gray-700">{cleanCount}</span></span>
              <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-yellow-500" /> Violations <span className="font-semibold text-gray-700">{totalInspections - cleanCount - oosCount}</span></span>
              <span className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-red-500" /> OOS <span className="font-semibold text-gray-700">{oosCount}</span></span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center"><p className="text-lg font-bold text-indigo-600">{totalInspections}</p><p className="text-[9px] text-gray-400 uppercase">Total</p></div>
            <div className="text-center"><p className="text-lg font-bold text-emerald-600">{cleanRate}%</p><p className="text-[9px] text-gray-400 uppercase">Clean Rate</p></div>
            <div className="text-center"><p className="text-lg font-bold text-red-600">{oosCount}</p><p className="text-[9px] text-gray-400 uppercase">OOS</p></div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-4 flex flex-wrap items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="text" placeholder="Enter violation code, catego..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 pl-8 pr-3 py-2 w-52 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400" />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Result</p>
          <div className="flex gap-1.5">
            {(['clean', 'violations', 'oos'] as const).map(f => (
              <button key={f} onClick={() => setResultFilter(resultFilter === f ? 'all' : f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  resultFilter === f
                    ? f === 'clean' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : f === 'violations' ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' : 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-50 text-gray-500 border border-gray-200 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >{f === 'clean' ? 'Clean' : f === 'violations' ? 'Violations' : 'OOS'}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Type</p>
          <div className="flex gap-1.5">
            {['Level 1', 'Level 2', 'Level 3'].map(lvl => (
              <button key={lvl} onClick={() => setTypeFilter(typeFilter === lvl ? null : lvl)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${typeFilter === lvl ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:text-gray-700 hover:bg-gray-100'}`}
              >{lvl}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-5 pb-3"><p className="text-xs text-gray-400">{filtered.length} inspection{filtered.length !== 1 ? 's' : ''}</p></div>

      <div className="px-5 pb-5 space-y-3">
        {filtered.map(rec => {
          const isExpanded = expandedId === rec.id
          const hasViolations = rec.violations > 0
          return (
            <div key={rec.id} className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <button onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4 text-left flex-wrap">
                  <span className="text-sm font-bold text-gray-900 min-w-[100px]">{safeFmtDate(rec.date)}</span>
                  <span className="text-sm font-medium text-gray-500">{rec.state}</span>
                  <span className="text-sm text-gray-700">{rec.level}</span>
                  <a href={`https://ai.fmcsa.dot.gov/SMS/Event/Inspection/${rec.fmcsaId}.aspx`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 hover:border-indigo-300 transition-colors"
                  >{rec.reportNumber}<ExternalLink className="w-3 h-3" /></a>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!hasViolations && <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium">Clean</span>}
                  {rec.violations > 0 && <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 font-medium">{rec.violations} Violation{rec.violations > 1 ? 's' : ''}</span>}
                  {rec.oosViolations > 0 && <span className="text-xs px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 font-medium">{rec.oosViolations} OOS</span>}
                  {hasViolations ? (isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />) : <div className="w-4" />}
                </div>
              </button>
              <AnimatePresence>
                {isExpanded && hasViolations && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="border-t border-gray-200">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 bg-white">
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Violation</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Group</th>
                            <th className="text-left py-2.5 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                            <th className="text-center py-2.5 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Severity</th>
                            <th className="text-center py-2.5 px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">OOS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rec.violationDetails.map((v, vi) => (
                            <tr key={vi} className="border-b border-gray-100 last:border-b-0 hover:bg-white bg-gray-50/50">
                              <td className="py-3 px-4"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${v.oos ? 'bg-red-500' : 'bg-indigo-500'}`} /><span className="text-gray-800 font-medium">{v.category}</span></div></td>
                              <td className="py-3 px-4 text-gray-500">{v.group}</td>
                              <td className="py-3 px-4 text-gray-600 max-w-xs">{v.description}</td>
                              <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 text-xs font-bold text-gray-800"><span className={`w-2 h-2 rounded-full ${severityColor(v.severity)}`} />{v.severity}</span></td>
                              <td className="py-3 px-4 text-center">{v.oos ? <span className="text-[10px] px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 font-bold">OOS</span> : <span className="text-gray-300">—</span>}</td>
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
        })}
        {filtered.length === 0 && <div className="text-center py-8"><p className="text-sm text-gray-400">No inspections match your filters</p></div>}
      </div>
    </div>
  )
}

// ============================================================
// TAB 3: SAFETY & INSPECTIONS
// ============================================================
function SafetyTab() {
  const { carrier: c, basicScores, basicAlerts, violationBreakdown, issData, inspections, inspectionRecords, operations, crashes, crashRecords, violationTrend } = useCarrierDataContext()
  const [safetySub, setSafetySub] = useState<'overview' | 'basics' | 'inspections' | 'crashes'>('overview')
  const safetyLevel = getStatusLevel('safety', c.safetyRating)

  const alertMap: Record<string, boolean> = {
    'Unsafe Driving': basicAlerts.unsafeDrivingAlert,
    'Hours-of-Service': basicAlerts.hoursOfServiceAlert,
    'Driver Fitness': basicAlerts.driverFitnessAlert,
    'Controlled Substances': basicAlerts.controlledSubstanceAlert,
    'Vehicle Maintenance': basicAlerts.vehicleMaintenanceAlert,
    'HM Compliance': basicAlerts.hazmatAlert,
    'Hazmat Compliance': basicAlerts.hazmatAlert,
    'Crash Indicator': basicAlerts.crashIndicatorAlert,
  }

  const violationMap: Record<string, number> = {
    'Unsafe Driving': violationBreakdown.unsafeDriving,
    'Hours-of-Service': violationBreakdown.hoursOfService,
    'Driver Fitness': violationBreakdown.driverFitness,
    'Controlled Substances': violationBreakdown.controlledSubstance,
    'Vehicle Maintenance': violationBreakdown.vehicleMaintenance,
    'HM Compliance': violationBreakdown.hazardousMaterials,
    'Hazmat Compliance': violationBreakdown.hazardousMaterials,
    'Crash Indicator': 0,
  }

  const totalViolations = Object.values(violationMap).reduce((a, b) => a + b, 0)
  const totalInspections = operations.totalInspections
  const activeAlertCount = Object.values(alertMap).filter(Boolean).length
  const exceedingBasics = basicScores.filter(b => b.score != null && b.score >= b.threshold)

  const safetySubTabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'basics' as const, label: 'BASICs' },
    { id: 'inspections' as const, label: 'Inspections' },
    { id: 'crashes' as const, label: 'Crashes' },
  ]

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-gray-900">Safety Performance</h2>
          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">CarrierOk</span>
        </div>
        <p className="text-xs text-gray-500">FMCSA safety data, BASICs, inspections & crash analysis</p>
      </div>

      <div className="px-6 pb-4">
        <div className="flex flex-wrap gap-2">
          {safetySubTabs.map(tab => (
            <button key={tab.id} onClick={() => setSafetySub(tab.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${safetySub === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-6">
        <AnimatePresence mode="wait">
          {safetySub === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">FMCSA Safety Rating</p>
                  <h3 className={`text-3xl font-black tracking-wide uppercase ${safetyLevel === 'excellent' ? 'text-emerald-600' : safetyLevel === 'fair' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {c.safetyRating === 'not-rated' ? 'Not Rated' : c.safetyRating}
                  </h3>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Operating Status</p>
                  <h3 className={`text-3xl font-black tracking-wide uppercase ${c.operatingStatus === 'authorized' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {c.operatingStatus === 'authorized' ? 'Authorized' : c.operatingStatus === 'not-authorized' ? 'Not Authorized' : c.operatingStatus}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2">
                    {c.powerUnits > 0 ? `${c.powerUnits} power unit${c.powerUnits !== 1 ? 's' : ''}` : ''}
                    {c.powerUnits > 0 && c.totalDriversCDL > 0 ? ' · ' : ''}
                    {c.totalDriversCDL > 0 ? `${c.totalDriversCDL} driver${c.totalDriversCDL !== 1 ? 's' : ''}` : ''}
                  </p>
                </div>
              </div>

              {/* Inspections table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900">US Inspection Results for 24 months</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Total Inspections: <strong className="text-gray-700">{inspections.totalInspections}</strong></p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-blue-50/50">
                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Inspection Type</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">Vehicle</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">Driver</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">Hazmat</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">IEP</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-medium text-gray-700">Inspections</td>
                        <td className="py-2.5 px-4 text-center text-blue-600 font-semibold">{inspections.vehicleInspections}</td>
                        <td className="py-2.5 px-4 text-center text-blue-600 font-semibold">{inspections.driverInspections}</td>
                        <td className="py-2.5 px-4 text-center text-blue-600 font-semibold">{inspections.hazmatInspections}</td>
                        <td className="py-2.5 px-4 text-center text-blue-600 font-semibold">{inspections.iepInspections}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-medium text-gray-700">Out of Service</td>
                        <td className={`py-2.5 px-4 text-center font-semibold ${inspections.vehicleOOS > 0 ? 'text-red-600' : 'text-blue-600'}`}>{inspections.vehicleOOS}</td>
                        <td className={`py-2.5 px-4 text-center font-semibold ${inspections.driverOOS > 0 ? 'text-red-600' : 'text-blue-600'}`}>{inspections.driverOOS}</td>
                        <td className={`py-2.5 px-4 text-center font-semibold ${inspections.hazmatOOS > 0 ? 'text-red-600' : 'text-blue-600'}`}>{inspections.hazmatOOS}</td>
                        <td className="py-2.5 px-4 text-center text-blue-600 font-semibold">{inspections.iepOOS}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2.5 px-4 font-medium text-gray-700">Out of Service %</td>
                        <td className={`py-2.5 px-4 text-center font-bold ${inspections.vehicleInspections > 0 && inspections.vehicleOOSRate > inspections.nationalVehicleOOSRate ? 'text-red-600' : 'text-blue-600'}`}>{inspections.vehicleInspections > 0 ? `${inspections.vehicleOOSRate}%` : '%'}</td>
                        <td className={`py-2.5 px-4 text-center font-bold ${inspections.driverInspections > 0 && inspections.driverOOSRate > inspections.nationalDriverOOSRate ? 'text-red-600' : 'text-blue-600'}`}>{inspections.driverInspections > 0 ? `${inspections.driverOOSRate}%` : '%'}</td>
                        <td className="py-2.5 px-4 text-center text-blue-600 font-bold">{inspections.hazmatInspections > 0 ? `${inspections.hazmatOOSRate}%` : '%'}</td>
                        <td className="py-2.5 px-4 text-center text-blue-600 font-bold">{inspections.iepInspections > 0 ? `${inspections.iepOOSRate}%` : '0%'}</td>
                      </tr>
                      <tr className="bg-blue-50/50">
                        <td className="py-2.5 px-4 font-medium text-red-600 text-xs">Nat'l Average %</td>
                        <td className="py-2.5 px-4 text-center text-gray-700 font-medium">{inspections.nationalVehicleOOSRate}%</td>
                        <td className="py-2.5 px-4 text-center text-gray-700 font-medium">{inspections.nationalDriverOOSRate}%</td>
                        <td className="py-2.5 px-4 text-center text-gray-700 font-medium">{inspections.nationalHazmatOOSRate}%</td>
                        <td className="py-2.5 px-4 text-center text-gray-400">N/A</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-red-500 px-4 py-2 border-t border-gray-100">*OOS rates calculated based on the most recent 24 months of inspection data per the latest monthly SAFER Snapshot.</p>
              </div>

              {/* Crashes table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900">Crashes reported to FMCSA for 24 months</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-blue-50/50">
                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-600">Crash Type</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">Fatal</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">Injury</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">Tow</th>
                        <th className="text-center py-2.5 px-4 text-xs font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2.5 px-4 font-medium text-gray-700">Crashes</td>
                        <td className={`py-2.5 px-4 text-center font-bold ${crashes.fatal > 0 ? 'text-red-600' : 'text-blue-600'}`}>{crashes.fatal}</td>
                        <td className={`py-2.5 px-4 text-center font-bold ${crashes.injury > 0 ? 'text-yellow-600' : 'text-blue-600'}`}>{crashes.injury}</td>
                        <td className={`py-2.5 px-4 text-center font-bold ${crashes.towaway > 0 ? 'text-orange-600' : 'text-blue-600'}`}>{crashes.towaway}</td>
                        <td className={`py-2.5 px-4 text-center font-black ${crashes.total > 0 ? 'text-gray-900' : 'text-blue-600'}`}>{crashes.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {safetySub === 'basics' && (
            <motion.div key="basics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <p className="text-sm text-blue-800"><strong>What are BASICs?</strong> FMCSA's SMS scores carriers in 7 categories. Each score is a percentile (0–100) — higher means worse. When a score crosses the threshold, FMCSA may intervene.</p>
              </div>

              {activeAlertCount > 0 && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-700">{activeAlertCount} of 7 BASICs flagged for alert</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-500" />BASIC Scores</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Description</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Percentile</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Threshold</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Violations</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {basicScores.map((basic, i) => {
                        const isScored = basic.score != null
                        const ratio = isScored ? basic.score! / basic.threshold : 0
                        const hasAlert = alertMap[basic.name] || false
                        const violations = violationMap[basic.name] ?? 0
                        return (
                          <tr key={i} className={`border-b border-gray-50 hover:bg-gray-50 ${hasAlert ? 'bg-yellow-50/50' : ''}`}>
                            <td className="py-2.5 px-4 font-medium text-gray-900">{basic.name}{hasAlert && <span className="ml-1.5 inline-flex w-2 h-2 rounded-full bg-yellow-400" />}</td>
                            <td className="py-2.5 px-4 text-xs text-gray-500 hidden sm:table-cell">{basic.description}</td>
                            <td className="py-2.5 px-4 text-right">{isScored ? <span className={`font-bold ${ratio >= 1 ? 'text-red-600' : ratio >= 0.75 ? 'text-yellow-600' : 'text-emerald-600'}`}>{basic.score}%</span> : <span className="text-gray-400 text-xs">Not Scored</span>}</td>
                            <td className="py-2.5 px-4 text-right text-gray-400">{basic.threshold}%</td>
                            <td className="py-2.5 px-4 text-right text-gray-700">{violations}</td>
                            <td className="py-2.5 px-4 text-right">
                              {hasAlert ? <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">Alert</span>
                                : isScored && basic.score! >= basic.threshold ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">Exceeding</span>
                                : isScored ? <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">OK</span>
                                : violations > 0 ? <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">{violations} viol.</span>
                                : <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">No Data</span>}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">BASIC Percentile Gauges <span className="text-[10px] text-gray-400 font-normal">Higher = worse. Red zone = above threshold.</span></h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {basicScores.map((basic, i) => (
                    <motion.div key={basic.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                      <SpeedometerGauge name={basic.name} score={basic.score} threshold={basic.threshold} alert={alertMap[basic.name] || false} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {totalViolations > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" />Violation Breakdown by BASIC</h4>
                  <p className="text-xs text-gray-500 mb-4">{totalViolations} total violations across {totalInspections} inspections</p>
                  <ViolationBreakdownChart violations={violationBreakdown} alerts={basicAlerts} />
                </div>
              )}

              {violationTrend.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-indigo-500" />Violation Trend</h4>
                  <ViolationTrendChart data={violationTrend} />
                </div>
              )}
            </motion.div>
          )}

          {safetySub === 'inspections' && (
            <motion.div key="inspections" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{operations.cleanInspectionRate}%</p><p className="text-xs text-gray-500 mt-1">Clean Rate</p>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                  {inspections.vehicleInspections > 0 ? <p className={`text-2xl font-bold ${inspections.vehicleOOSRate <= inspections.nationalVehicleOOSRate ? 'text-emerald-600' : 'text-red-600'}`}>{inspections.vehicleOOSRate}%</p> : <p className="text-2xl font-bold text-gray-300">—</p>}
                  <p className="text-xs text-gray-500 mt-1">Vehicle OOS Rate</p>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                  {inspections.driverInspections > 0 ? <p className={`text-2xl font-bold ${inspections.driverOOSRate <= inspections.nationalDriverOOSRate ? 'text-emerald-600' : 'text-red-600'}`}>{inspections.driverOOSRate}%</p> : <p className="text-2xl font-bold text-gray-300">—</p>}
                  <p className="text-xs text-gray-500 mt-1">Driver OOS Rate</p>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{safeFmtDate(operations.lastInspectionDate)}</p><p className="text-xs text-gray-500 mt-1">Last Inspection</p>
                </div>
              </div>

              {/* OOS Summary Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900">Out-of-Service Summary</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Inspections</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">OOS</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">OOS %</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Nat'l Avg %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { type: 'Vehicle', insp: inspections.vehicleInspections, oos: inspections.vehicleOOS, rate: inspections.vehicleOOSRate, natl: inspections.nationalVehicleOOSRate },
                        { type: 'Driver', insp: inspections.driverInspections, oos: inspections.driverOOS, rate: inspections.driverOOSRate, natl: inspections.nationalDriverOOSRate },
                        { type: 'Hazmat', insp: inspections.hazmatInspections, oos: inspections.hazmatOOS, rate: inspections.hazmatOOSRate, natl: inspections.nationalHazmatOOSRate },
                        { type: 'IEP', insp: inspections.iepInspections, oos: inspections.iepOOS, rate: inspections.iepOOSRate, natl: null as number | null },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2.5 px-4 font-medium text-gray-900">{row.type}</td>
                          <td className="py-2.5 px-4 text-right text-gray-700">{row.insp}</td>
                          <td className="py-2.5 px-4 text-right"><span className={`font-semibold ${row.oos > 0 ? 'text-red-600' : 'text-gray-700'}`}>{row.oos}</span></td>
                          <td className="py-2.5 px-4 text-right"><span className={`font-bold ${row.insp > 0 && row.natl != null && row.rate <= row.natl ? 'text-emerald-600' : row.insp > 0 && row.natl != null ? 'text-red-600' : 'text-gray-400'}`}>{row.insp > 0 ? `${row.rate}%` : '0%'}</span></td>
                          <td className="py-2.5 px-4 text-right text-gray-400">{row.natl != null ? `${row.natl}%` : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Inspections by State */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50"><h4 className="text-sm font-semibold text-gray-900">Inspections by State</h4></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">State</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">Inspections</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">OOS</th>
                        <th className="text-right py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase">OOS Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {operations.operatingStates.map((s, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="py-2.5 px-4"><span className="font-medium text-gray-900">{s.state}</span> <span className="text-gray-400 text-xs">({s.stateCode})</span></td>
                          <td className="py-2.5 px-4 text-right text-gray-700">{s.inspections}</td>
                          <td className="py-2.5 px-4 text-right"><span className={`font-semibold ${s.oosCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{s.oosCount}</span></td>
                          <td className="py-2.5 px-4 text-right"><span className={`font-bold ${s.oosRate <= 12.9 ? 'text-emerald-600' : 'text-red-600'}`}>{s.oosRate}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <InspectionRecordsPanel />
            </motion.div>
          )}

          {safetySub === 'crashes' && (
            <motion.div key="crashes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Fatal', value: crashes.fatal, color: crashes.fatal > 0 ? 'text-red-600' : 'text-emerald-600', bg: crashes.fatal > 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200' },
                  { label: 'Injury', value: crashes.injury, color: crashes.injury > 0 ? 'text-yellow-600' : 'text-emerald-600', bg: crashes.injury > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200' },
                  { label: 'Towaway', value: crashes.towaway, color: crashes.towaway > 0 ? 'text-orange-600' : 'text-emerald-600', bg: crashes.towaway > 0 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200' },
                  { label: 'Total', value: crashes.total, color: 'text-gray-900', bg: 'bg-gray-50 border-gray-200' },
                ].map((cr, i) => (
                  <div key={i} className={`rounded-xl border ${cr.bg} p-4 text-center`}>
                    <p className={`text-3xl font-bold ${cr.color}`}>{cr.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{cr.label}</p>
                    <p className="text-[10px] text-gray-400">24 months</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50"><h4 className="text-sm font-semibold text-gray-900">Crash Records</h4></div>
                {crashRecords.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {crashRecords.map((crash) => (
                      <div key={crash.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${crash.severity === 'Injury' ? 'bg-yellow-500' : crash.severity === 'Towaway' ? 'bg-orange-500' : 'bg-red-500'}`} />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{crash.severity} Crash</p>
                            <p className="text-xs text-gray-500">{safeFmtDate(crash.date)} · {crash.state}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div className="text-xs space-y-0.5">
                            <p className={`font-medium ${crash.fatalities > 0 ? 'text-red-600' : 'text-gray-400'}`}>{crash.fatalities} fatal</p>
                            <p className={`font-medium ${crash.injuries > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>{crash.injuries} injury</p>
                          </div>
                          <div>
                            {crash.hazmatRelease && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">HazMat</span>}
                            <p className="text-[10px] text-gray-400 mt-0.5">{crash.reportNumber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center"><CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" /><p className="text-sm text-emerald-600">No crashes on record</p></div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================
// TAB 4: INSURANCE
// ============================================================
function InsuranceTab() {
  const { carrier: c, insurancePolicies, renewalTimeline, policyHistory, insuranceGaps } = useCarrierDataContext()
  const insLevel = getStatusLevel('insurance', c.insuranceStatus)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border-2 p-6 text-center ${insLevel === 'excellent' ? 'bg-emerald-50 border-emerald-200' : insLevel === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}
      >
        <p className="text-sm text-gray-500 mb-1">Insurance Status</p>
        <h2 className={`text-3xl font-black tracking-wide uppercase ${statusColors[insLevel].text}`}>
          {c.insuranceStatus === 'pending' ? 'CANCELLATION PENDING' : c.insuranceStatus === 'expired' ? 'EXPIRED' : 'CURRENT'}
        </h2>
      </motion.div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Coverage Analysis</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {insurancePolicies.map((policy, i) => <CoverageBar key={i} label={`${policy.type} Coverage`} actual={policy.coverage} required={policy.required} />)}
        </div>
      </div>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Policies</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Insurer</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Policy #</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Coverage</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Effective</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Expires</th>
              </tr>
            </thead>
            <tbody>
              {insurancePolicies.map((policy, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{policy.insurer}</td>
                  <td className="py-2 px-3 font-mono text-xs text-gray-600">{policy.policyNumber}</td>
                  <td className="py-2 px-3"><span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">{policy.type}</span></td>
                  <td className="py-2 px-3 font-semibold">{fmtCurrency(policy.coverage)}</td>
                  <td className="py-2 px-3"><StatusBadge level={getStatusLevel('insurance', policy.status)} label={policy.status.toUpperCase()} size="sm" /></td>
                  <td className="py-2 px-3 text-gray-600">{safeFmtDate(policy.effectiveDate)}</td>
                  <td className="py-2 px-3 text-gray-600">{safeFmtDate(policy.expirationDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" />Renewal Timeline</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {renewalTimeline.map((renewal, i) => {
            const urgencyColors: Record<string, string> = { ok: 'bg-emerald-100 border-emerald-300 text-emerald-700', low: 'bg-emerald-100 border-emerald-300 text-emerald-700', medium: 'bg-yellow-100 border-yellow-300 text-yellow-700', warning: 'bg-yellow-100 border-yellow-300 text-yellow-700', high: 'bg-orange-100 border-orange-300 text-orange-700', expired: 'bg-gray-100 border-gray-300 text-gray-700', critical: 'bg-red-100 border-red-300 text-red-700' }
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex-1 min-w-[160px]">
                <div className={`rounded-xl border-2 p-4 text-center ${urgencyColors[renewal.urgency]}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider">{renewal.policyType}</p>
                  <p className="text-lg font-bold mt-1">{renewal.daysUntil} days</p>
                  <p className="text-xs mt-1">{safeFmtDate(renewal.date)}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" />Policy Event History</h3>
        <AuthorityTimeline events={policyHistory} />
      </Card>

      <InsuranceGapTimeline gaps={insuranceGaps} />
    </div>
  )
}

// ============================================================
// TAB 5: FLEET & DRIVERS
// ============================================================
function FleetTab() {
  const { carrier: c, trucks, trailers, sharedEquipment } = useCarrierDataContext()
  const avgYear = trucks.length > 0 ? Math.round(trucks.reduce((s, t) => s + t.year, 0) / trucks.length) : 0

  const makeCount: Record<string, number> = {}
  trucks.forEach((t) => { makeCount[t.make] = (makeCount[t.make] || 0) + 1 })
  const makeSegments = Object.entries(makeCount).sort((a, b) => b[1] - a[1]).map(([label, value], i) => ({ label, value, color: ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'][i % 5] }))

  const typeCount: Record<string, number> = {}
  trailers.forEach((t) => { typeCount[t.type] = (typeCount[t.type] || 0) + 1 })
  const typeSegments = Object.entries(typeCount).sort((a, b) => b[1] - a[1]).map(([label, value], i) => ({ label, value, color: ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i % 4] }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <ScoreCard icon={Truck} label="Trucks" value={trucks.length} level="good" />
        <ScoreCard icon={Package} label="Trailers" value={trailers.length} level="good" />
        <ScoreCard icon={Users} label="CDL Drivers" value={c.totalDriversCDL} level="good" />
        <ScoreCard icon={Calendar} label="Avg Fleet Year" value={avgYear} level="good" subtitle="model year" />
        <ScoreCard icon={MapPinned} label="Annual Miles" value={c.mcs150Mileage > 0 ? `${(c.mcs150Mileage / 1000000).toFixed(1)}M` : 'N/A'} level="good" subtitle="mi/yr" />
      </div>

      <FleetOwnershipBar owned={c.ownedTractors} leased={c.termLeasedTractors} />
      <DriverBreakdown totalCDL={c.totalDriversCDL} within100mi={c.driversInterstate100mi} beyond100mi={c.driversInterstateBeyond100mi} />

      <div className="grid sm:grid-cols-2 gap-4">
        <Card padding="md"><DonutChart segments={makeSegments} title="Fleet by Make" /></Card>
        <Card padding="md"><DonutChart segments={typeSegments} title="Trailers by Type" /></Card>
      </div>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-indigo-500" />Fleet Age Distribution</h3>
        <FleetAgeHistogram trucks={trucks} trailers={trailers} />
      </Card>

      <SharedEquipmentAlert data={sharedEquipment} />

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-indigo-500" />Truck Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">VIN</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Year</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Make</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Model</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Body Class</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">GVWR</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Inspections</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">OOS</th>
              </tr>
            </thead>
            <tbody>
              {trucks.map((truck, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-mono text-xs">{truck.vin}</td>
                  <td className="py-2 px-3">{truck.year}</td>
                  <td className="py-2 px-3 font-medium">{truck.make}</td>
                  <td className="py-2 px-3 text-gray-600">{truck.model}</td>
                  <td className="py-2 px-3 text-gray-600 text-xs">{truck.bodyClass}</td>
                  <td className="py-2 px-3 text-gray-600 text-xs">{truck.gvwr}</td>
                  <td className="py-2 px-3 text-center">{truck.inspections}</td>
                  <td className="py-2 px-3 text-center"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${truck.oosCount > 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{truck.oosCount}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-indigo-500" />Trailer Inventory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">VIN</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Year</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Make</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Model</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Length</th>
              </tr>
            </thead>
            <tbody>
              {trailers.map((trailer, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2 px-3 font-mono text-xs">{trailer.vin}</td>
                  <td className="py-2 px-3">{trailer.year}</td>
                  <td className="py-2 px-3 font-medium">{trailer.make}</td>
                  <td className="py-2 px-3 text-gray-600">{trailer.model}</td>
                  <td className="py-2 px-3"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${trailer.type === 'Reefer' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{trailer.type}</span></td>
                  <td className="py-2 px-3 text-gray-600">{trailer.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

// ============================================================
// TAB 6: DOCUMENTS — stripped "What's Included in Sale"
// ============================================================
function DocumentsTab() {
  const { documents, verificationChecks, availableDocuments } = useCarrierDataContext()
  const verifiedCount = documents.filter((d) => d.status === 'verified').length

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className={`rounded-xl border-2 p-5 text-center ${verifiedCount === documents.length ? 'bg-emerald-50 border-emerald-200' : 'bg-yellow-50 border-yellow-200'}`}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          <CheckCircle className={`w-6 h-6 ${verifiedCount === documents.length ? 'text-emerald-500' : 'text-yellow-500'}`} />
          <h3 className={`text-xl font-bold ${verifiedCount === documents.length ? 'text-emerald-700' : 'text-yellow-700'}`}>{verifiedCount} of {documents.length} Verified</h3>
        </div>
      </motion.div>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><Shield className="w-5 h-5 text-indigo-500" />Verification Checks</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {verificationChecks.map((check: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`rounded-lg border p-3 text-center ${check.status === 'clean' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
            >
              {check.status === 'clean' ? <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto mb-1" /> : <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />}
              <p className="text-sm font-semibold text-gray-800">{check.name}</p>
              <p className="text-xs text-gray-500">{check.detail}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid sm:grid-cols-2 gap-3">
        {documents.map((doc, i) => {
          const isVerified = doc.status === 'verified'
          const isPending = doc.status === 'pending'
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 rounded-xl border p-4 ${isVerified ? 'bg-white border-emerald-100' : isPending ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${isVerified ? 'bg-emerald-100' : isPending ? 'bg-yellow-100' : 'bg-red-100'}`}>
                {isVerified ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : isPending ? <Clock className="w-5 h-5 text-yellow-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">{doc.name}</p>
                  <StatusBadge level={isVerified ? 'excellent' : isPending ? 'fair' : 'danger'} label={doc.status.toUpperCase()} size="sm" />
                </div>
                <p className="text-xs text-gray-500 mt-1">{doc.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-500" />Available Documents Checklist</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {availableDocuments.map((doc, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${doc.available ? 'bg-emerald-50' : 'bg-gray-50'}`}>
              {doc.available ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
              <span className={`text-sm ${doc.available ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{doc.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ============================================================
// TAB 7: FULL REPORT
// ============================================================
function FullReportTab() {
  const { contactHistory, riskScoreTrend, vinInspections, monitoringAlerts, relatedCarriers, percentiles } = useCarrierDataContext()
  return (
    <div className="space-y-6">
      <Card padding="md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-indigo-500" />Contact & Entity History</h3>
        <AuthorityTimeline events={contactHistory.changes.map(c => ({ date: c.date, event: `${c.field}: "${c.oldValue}" → "${c.newValue}"`, type: 'changed' as const, policyType: c.changeType }))} />
      </Card>

      {riskScoreTrend.length > 0 && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-500" />Risk Score Trend <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">12 months</span></h3>
          <SparklineChart data={riskScoreTrend.map(d => ({ label: d.month, value: d.riskScore }))} height={100} color="#6366f1" label="Risk Score" currentValue={riskScoreTrend[riskScoreTrend.length - 1].riskScore} />
        </Card>
      )}

      {vinInspections.length > 0 && (
        <Card padding="md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-indigo-500" />VIN Inspection History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">VIN</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Result</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">Violations</th>
                </tr>
              </thead>
              <tbody>
                {vinInspections.map((insp, i) => {
                  const resultColors: Record<string, string> = { pass: 'bg-emerald-50 text-emerald-700', fail: 'bg-red-50 text-red-700', oos: 'bg-red-50 text-red-700', warning: 'bg-yellow-50 text-yellow-700' }
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 px-3 font-mono text-xs">{insp.vin}</td>
                      <td className="py-2 px-3 text-gray-600">{safeFmtDate(insp.date)}</td>
                      <td className="py-2 px-3 text-gray-600">{insp.location}</td>
                      <td className="py-2 px-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full capitalize">{insp.type}</span></td>
                      <td className="py-2 px-3"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full uppercase ${resultColors[insp.result]}`}>{insp.result}</span></td>
                      <td className="py-2 px-3 text-center">{insp.violations}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <MonitoringAlerts alerts={monitoringAlerts} />
      <RelatedCarriers carriers={relatedCarriers} />

      {percentiles.length > 0 && <CarrierComparison percentiles={percentiles} />}
    </div>
  )
}

// ============================================================
// MAIN PAGE COMPONENT
// ============================================================
export default function CarrierPulsePage() {
  const navigate = useNavigate()
  const { dotNumber: urlDotNumber } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [dotInput, setDotInput] = useState('')
  const [activeDot, setActiveDot] = useState<string | undefined>(urlDotNumber)
  const [activeTab, setActiveTab] = useState('overview')
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(getRecentSearches())

  // Access gating
  const [accessChecked, setAccessChecked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)
  const [accessReason, setAccessReason] = useState<string>('none')
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  // Check access on mount
  useEffect(() => {
    // Admin and seller always have access (no buyer subscription check needed)
    if (user?.role === 'admin' || user?.role === 'seller') {
      setHasAccess(true)
      setAccessReason('admin')
      setAccessChecked(true)
      return
    }

    async function checkAccess() {
      try {
        const res = await api.getCarrierPulseAccess()
        if (res.success && res.data) {
          setHasAccess(res.data.hasAccess)
          setAccessReason(res.data.reason)
          setCurrentPlan(res.data.currentPlan)
        }
      } catch {
        // If API fails (e.g. seller/admin role), allow access
        setHasAccess(true)
      } finally {
        setAccessChecked(true)
      }
    }
    checkAccess()
  }, [user?.role])

  // Handle purchase success return
  useEffect(() => {
    if (searchParams.get('purchase') === 'success') {
      setPurchaseSuccess(true)
      setHasAccess(true)
      setAccessReason('standalone')
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [searchParams])

  const handleCarrierPulseCheckout = async () => {
    setCheckoutLoading(true)
    try {
      const res = await api.createCarrierPulseCheckout()
      if (res.data?.url) {
        window.location.href = res.data.url
      }
    } catch (err: any) {
      console.error('CarrierPulse checkout error:', err)
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Sync URL param
  useEffect(() => {
    if (urlDotNumber && urlDotNumber !== activeDot) {
      setActiveDot(urlDotNumber)
    }
  }, [urlDotNumber])

  // Fetch carrier data
  const { carrierReport, loading: carrierLoading, error: carrierError } = useCarrierData(activeDot)

  // Save to recent searches when data loads
  useEffect(() => {
    if (carrierReport && activeDot) {
      const name = carrierReport?.carrier?.legalName || 'Unknown Carrier'
      addRecentSearch(activeDot, name)
      setRecentSearches(getRecentSearches())
    }
  }, [carrierReport, activeDot])

  const handleSearch = () => {
    const cleaned = dotInput.replace(/\D/g, '')
    if (!cleaned) return
    setActiveDot(cleaned)
    setActiveTab('overview')
    // Update URL without full navigation
    const basePath = window.location.pathname.replace(/\/carrier-pulse.*/, '/carrier-pulse')
    window.history.pushState(null, '', `${basePath}/${cleaned}`)
  }

  const handleSearchAnother = () => {
    setActiveDot(undefined)
    setDotInput('')
    const basePath = window.location.pathname.replace(/\/carrier-pulse.*/, '/carrier-pulse')
    window.history.pushState(null, '', basePath)
  }

  // Map API data
  const carrierDataCtx = useMemo<CarrierDataContextType>(() => {
    if (!carrierReport) {
      return {
        carrier: fallbackCarrier, authority: fallbackAuthority, authorityHistory: [],
        authorityPending: fallbackAuthorityPending, basicScores: [], basicAlerts: fallbackBasicAlerts,
        violationBreakdown: fallbackViolationBreakdown, issData: fallbackISSData,
        inspections: fallbackInspections, inspectionRecords: [], operations: fallbackOperations,
        violationTrend: [], crashes: fallbackCrashes, crashRecords: [],
        insurancePolicies: [], renewalTimeline: [], policyHistory: [], insuranceGaps: [],
        trucks: [], trailers: [], sharedEquipment: fallbackSharedEquipment,
        cargoCapabilities: fallbackCargoCapabilities, documents: [], verificationChecks: [],
        availableDocuments: [], complianceFinancials: fallbackComplianceFinancials,
        relatedCarriers: [], percentiles: [], monitoringAlerts: [], riskScoreTrend: [],
        contactHistory: fallbackContactHistory, vinInspections: [], networkSignals: [],
        benchmarks: [], healthCategories: [], carrierLoading, carrierError,
      }
    }

    const healthResult = calculateCarrierHealthScore(carrierReport)
    return {
      carrier: mapToV2CarrierData(carrierReport),
      authority: mapToV2AuthorityData(carrierReport),
      authorityHistory: mapToV2AuthorityHistory(carrierReport),
      authorityPending: mapToV2AuthorityPending(carrierReport),
      basicScores: mapToV2BasicScores(carrierReport),
      basicAlerts: mapToV2BasicAlerts(carrierReport),
      violationBreakdown: mapToV2ViolationBreakdown(carrierReport),
      issData: mapToV2ISSData(carrierReport),
      inspections: mapToV2InspectionSummary(carrierReport),
      inspectionRecords: mapToV2InspectionRecords(carrierReport),
      operations: mapToV2Operations(carrierReport),
      violationTrend: mapToV2ViolationTrend(carrierReport),
      crashes: mapToV2CrashData(carrierReport),
      crashRecords: mapToV2CrashRecords(carrierReport),
      insurancePolicies: mapToV2InsurancePolicies(carrierReport),
      renewalTimeline: mapToV2RenewalTimeline(carrierReport),
      policyHistory: mapToV2PolicyHistory(carrierReport),
      insuranceGaps: mapToV2InsuranceGaps(carrierReport),
      trucks: mapToV2Trucks(carrierReport),
      trailers: mapToV2Trailers(carrierReport),
      sharedEquipment: mapToV2SharedEquipment(carrierReport),
      cargoCapabilities: mapToV2CargoCapabilities(carrierReport),
      documents: mapToV2Documents(carrierReport),
      verificationChecks: mapToV2VerificationChecks(carrierReport),
      availableDocuments: mapToV2AvailableDocuments(carrierReport),
      complianceFinancials: mapToV2ComplianceFinancials(undefined, carrierReport),
      relatedCarriers: mapToV2RelatedCarriers(carrierReport),
      percentiles: mapToV2Percentiles(carrierReport),
      monitoringAlerts: mapToV2MonitoringAlerts(carrierReport),
      riskScoreTrend: mapToV2RiskScoreTrend(carrierReport),
      contactHistory: mapToV2ContactHistory(carrierReport),
      vinInspections: [],
      networkSignals: [],
      benchmarks: [],
      healthCategories: healthResult.categories,
      carrierLoading: false,
      carrierError: null,
    }
  }, [carrierReport, carrierLoading, carrierError])

  const showSkeleton = carrierLoading && !carrierReport

  // ==========================================
  // ACCESS CHECK — loading state
  // ==========================================
  if (!accessChecked) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    )
  }

  // ==========================================
  // PAYWALL — no access
  // ==========================================
  if (!hasAccess) {
    const isStarter = currentPlan === 'STARTER'
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">CarrierPulse</h1>
          <p className="text-gray-500 mt-2 mb-8">Instant carrier intelligence by DOT number</p>

          <Card padding="lg">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-4">
                <Zap className="w-4 h-4" />
                {isStarter ? 'Add to Your Plan' : 'Unlock CarrierPulse'}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {isStarter ? 'Add CarrierPulse to your Starter plan' : 'Get CarrierPulse access'}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Look up any carrier by DOT number. Get safety scores, authority history, insurance status, fleet details, and more — instantly.
              </p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-black text-gray-900">$12.99</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Cancel anytime</p>
              </div>

              <div className="space-y-2 text-left mb-6">
                {[
                  'Unlimited carrier lookups by DOT number',
                  'Full safety & inspection reports',
                  'Authority history & compliance data',
                  'Insurance coverage analysis',
                  'Fleet & equipment inventory',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <Button fullWidth size="lg" onClick={handleCarrierPulseCheckout} loading={checkoutLoading}>
                <Zap className="w-5 h-5 mr-2" />
                {isStarter ? 'Add CarrierPulse — $12.99/mo' : 'Get CarrierPulse — $12.99/mo'}
              </Button>

              {!currentPlan && (
                <p className="text-xs text-gray-400 mt-4">
                  Or <Link to="/buyer/subscription" className="text-indigo-600 hover:text-indigo-700 font-medium">upgrade to Professional</Link> to get CarrierPulse included
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ==========================================
  // SEARCH VIEW — no DOT entered
  // ==========================================
  if (!activeDot) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg text-center">
          {/* Purchase success banner */}
          {purchaseSuccess && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">CarrierPulse activated!</p>
                <p className="text-xs text-emerald-600">You now have unlimited carrier lookups. Start searching below.</p>
              </div>
            </motion.div>
          )}

          {/* Branding */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">CarrierPulse</h1>
            <p className="text-gray-500 mt-2">Instant carrier intelligence by DOT number</p>
          </div>

          {/* Search Box */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={dotInput}
                onChange={e => setDotInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Enter DOT number..."
                className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-lg font-medium transition-all outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!dotInput.replace(/\D/g, '')}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold transition-colors flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mt-8 text-left">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Searches</p>
              <div className="space-y-1.5">
                {recentSearches.map((s) => (
                  <button
                    key={s.dotNumber}
                    onClick={() => { setDotInput(s.dotNumber); setActiveDot(s.dotNumber); const basePath = window.location.pathname.replace(/\/carrier-pulse.*/, '/carrier-pulse'); window.history.pushState(null, '', `${basePath}/${s.dotNumber}`) }}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <Hash className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{s.carrierName}</p>
                        <p className="text-xs text-gray-400">DOT {s.dotNumber}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  // ==========================================
  // REPORT VIEW — DOT entered, data loading/loaded
  // ==========================================
  const tabContent: Record<string, JSX.Element> = {
    overview: showSkeleton ? <CarrierLoadingSkeleton /> : <OverviewTab />,
    authority: showSkeleton ? <CarrierLoadingSkeleton /> : <AuthorityTab />,
    safety: showSkeleton ? <CarrierLoadingSkeleton /> : <SafetyTab />,
    insurance: showSkeleton ? <CarrierLoadingSkeleton /> : <InsuranceTab />,
    fleet: showSkeleton ? <CarrierLoadingSkeleton /> : <FleetTab />,
    documents: showSkeleton ? <CarrierLoadingSkeleton /> : <DocumentsTab />,
    'full-report': showSkeleton ? <CarrierLoadingSkeleton /> : <FullReportTab />,
  }

  return (
    <CarrierDataContext.Provider value={carrierDataCtx}>
      <div className="space-y-6">
        {/* Error State */}
        {carrierError && !carrierReport && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Carrier Not Found</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              {carrierError.includes('not available') ? `No carrier data found for DOT ${activeDot}. Please check the number and try again.` : carrierError}
            </p>
            <button onClick={handleSearchAnother}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search Another
            </button>
          </div>
        )}

        {/* Loading + Hero + Tabs */}
        {(!carrierError || carrierReport) && (
          <>
            {/* Back to Search bar */}
            <button
              onClick={handleSearchAnother}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:-translate-x-0.5 transition-transform" />
              New Search
            </button>

            {/* Hero Header */}
            {carrierReport && <PulseHeroHeader onSearchAnother={handleSearchAnother} />}
            {showSkeleton && !carrierReport && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Loading carrier intelligence for DOT {activeDot}...</p>
                </div>
              </div>
            )}

            {/* Tabs + Content */}
            {carrierReport && (
              <>
                <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    {tabContent[activeTab]}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </>
        )}
      </div>
    </CarrierDataContext.Provider>
  )
}
