import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TruckIcon,
  Calendar,
  ShieldCheck,
  FileText,
  Loader2,
  ChevronDown,
  ChevronRight,
  Building2,
  CreditCard,
  Users,
  MapPin,
  Phone,
  DollarSign,
  Scale,
  AlertOctagon,
  FileWarning,
  TrendingUp,
  TrendingDown,
  Clock,
  BadgeCheck,
  BadgeAlert,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Activity,
  Briefcase,
  CircleDollarSign,
  Star,
  Zap,
  Eye,
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import api from '../services/api'
import toast from 'react-hot-toast'

// Type for analysis result
type AnalysisResult = {
  mcNumber: string
  dotNumber?: string
  recommendationScore: number
  recommendationStatus: 'approved' | 'review' | 'rejected'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  summary: string
  fmcsa: {
    carrier: any
    authority: any
    insurance: any[]
    score: number
    factors: Array<{
      name: string
      points: number
      maxPoints: number
      status: 'pass' | 'fail' | 'warning' | 'na'
      detail?: string
    }>
  }
  creditsafe: {
    companyFound: boolean
    companyName?: string
    connectId?: string
    creditScore?: number
    creditRating?: string
    creditLimit?: number
    riskDescription?: string
    legalFilings: {
      judgments: number
      taxLiens: number
      uccFilings: number
      cautionaryUCC: number
      bankruptcy: boolean
      suits: number
    }
    negativeInformation?: {
      possibleOfac?: boolean
      uccFilings?: Array<{
        filedDate?: string
        filingType?: string
        filingNumber?: string
        jurisdiction?: string
        filingOffice?: string
        debtorName?: string
        debtorAddress?: {
          simpleValue?: string
          street?: string
          city?: string
          postalCode?: string
          province?: string
        }
        relatedDocumentNumber?: string
        status?: string
        securedParty?: {
          name?: string
          address?: string
        }
        collateralDescription?: string
      }>
      legalFilingSummary?: {
        bankruptcy?: boolean
        taxLienFilings?: number
        judgmentFilings?: number
        uccFilings?: number
        cautionaryUccFilings?: number
        suits?: number
        sum?: {
          currency?: string
          value?: number
        }
      }
      legalFilingGroupSummary?: {
        bankruptcy?: boolean
        taxLienFilings?: number
        judgmentFilings?: number
        uccFilings?: number
        cautionaryUccFilings?: number
        suits?: number
        sum?: {
          currency?: string
          value?: number
        }
      }
      legalFilingBranchSummary?: {
        bankruptcy?: boolean
        taxLienFilings?: number
        judgmentFilings?: number
        uccFilings?: number
        cautionaryUccFilings?: number
        suits?: number
        sum?: {
          currency?: string
          value?: number
        }
      }
    }
    yearsInBusiness?: string
    employees?: string
    score: number
    factors: Array<{
      name: string
      points: number
      maxPoints: number
      status: 'pass' | 'fail' | 'warning' | 'na'
      detail?: string
    }>
    fullReport?: any
  }
  riskFactors: Array<{
    severity: 'low' | 'medium' | 'high' | 'critical'
    category: 'fmcsa' | 'credit' | 'compliance'
    message: string
  }>
  positiveFactors: string[]
  analyzedAt: string
}

// Expandable Section Component
const ExpandableSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
  badgeColor = 'bg-primary-500/20 text-primary-600',
}: {
  title: string
  icon: any
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string | number
  badgeColor?: string
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-primary-600" />
          <span className="font-semibold text-lg text-gray-900">{title}</span>
          {badge !== undefined && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Score Gauge Component
const ScoreGauge = ({
  score,
  status,
  size = 'large',
}: {
  score: number
  status: 'approved' | 'review' | 'rejected'
  size?: 'large' | 'small'
}) => {
  const getColor = () => {
    if (status === 'approved') return '#10b981'
    if (status === 'review') return '#f59e0b'
    return '#ef4444'
  }

  const dimensions = size === 'large' ? { width: 200, radius: 85 } : { width: 120, radius: 50 }
  const strokeWidth = size === 'large' ? 14 : 8
  const circumference = 2 * Math.PI * dimensions.radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="relative" style={{ width: dimensions.width, height: dimensions.width }}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx={dimensions.width / 2}
          cy={dimensions.width / 2}
          r={dimensions.radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={dimensions.width / 2}
          cy={dimensions.width / 2}
          r={dimensions.radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className={`font-bold ${size === 'large' ? 'text-5xl' : 'text-2xl'}`}
            style={{ color: getColor() }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.div>
          <div className={`text-gray-500 ${size === 'large' ? 'text-sm' : 'text-xs'}`}>
            out of 100
          </div>
        </div>
      </div>
    </div>
  )
}

// Factor Progress Bar
const FactorBar = ({
  name,
  points,
  maxPoints,
  status,
  detail,
}: {
  name: string
  points: number
  maxPoints: number
  status: 'pass' | 'fail' | 'warning' | 'na'
  detail?: string
}) => {
  const percentage = (points / maxPoints) * 100

  const getStatusColor = () => {
    switch (status) {
      case 'pass':
        return 'bg-emerald-500'
      case 'fail':
        return 'bg-red-500'
      case 'warning':
        return 'bg-amber-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-800">{name}</span>
        </div>
        <span className="text-xs text-gray-500">
          {points}/{maxPoints} pts
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getStatusColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {detail && <p className="text-xs text-gray-500">{detail}</p>}
    </div>
  )
}

const AdminAIDueDiligence = () => {
  const [mcNumber, setMcNumber] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!mcNumber.trim()) {
      toast.error('Please enter an MC number')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await api.runDueDiligence(mcNumber)
      if (response.success && response.data) {
        setResult(response.data)
        toast.success('Analysis complete!')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err: any) {
      console.error('Due diligence error:', err)
      setError(err.message || 'Failed to run analysis')
      toast.error(err.message || 'Failed to run analysis')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: 'approved' | 'review' | 'rejected') => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">APPROVED</span>
          </span>
        )
      case 'review':
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400">
            <Eye className="w-5 h-5" />
            <span className="font-semibold">NEEDS REVIEW</span>
          </span>
        )
      case 'rejected':
        return (
          <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400">
            <XCircle className="w-5 h-5" />
            <span className="font-semibold">REJECTED</span>
          </span>
        )
    }
  }

  const getRiskBadge = (level: 'low' | 'medium' | 'high' | 'critical') => {
    const colors = {
      low: 'bg-emerald-500/20 text-emerald-400',
      medium: 'bg-amber-500/20 text-amber-400',
      high: 'bg-orange-500/20 text-orange-400',
      critical: 'bg-red-500/20 text-red-400',
    }
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${colors[level]}`}>
        {level} Risk
      </span>
    )
  }

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Due Diligence</h2>
              <p className="text-gray-600">
                Comprehensive analysis combining FMCSA & Creditsafe data
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  label="MC Number"
                  placeholder="Enter MC number (e.g., 123456)"
                  value={mcNumber}
                  onChange={(e) => setMcNumber(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={isLoading || !mcNumber.trim()}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Run AI Analysis
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Loading Animation */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-6 bg-gray-100 rounded-xl border border-gray-200"
              >
                <div className="flex items-center justify-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                  <div>
                    <p className="font-medium text-gray-900">Running comprehensive analysis...</p>
                    <p className="text-sm text-gray-600">
                      Checking FMCSA database and Creditsafe reports
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <TruckIcon className="w-4 h-4" />
                    <span>FMCSA Data...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Report...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Safety Check...</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Scale className="w-4 h-4" />
                    <span>Legal Filings...</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Display */}
            {error && !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3"
              >
                <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400">{error}</p>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Overall Assessment */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Score Section */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50">
                  <ScoreGauge score={result.recommendationScore} status={result.recommendationStatus} />
                  <div className="mt-4 text-center">
                    {getStatusBadge(result.recommendationStatus)}
                    <div className="mt-2">{getRiskBadge(result.riskLevel)}</div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 p-6 lg:p-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">AI Assessment Summary</h3>
                  <p className="text-gray-600 mb-6">{result.summary}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">FMCSA Score</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {result.fmcsa.score}/100
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">Credit Score</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {result.creditsafe.score}/100
                      </div>
                    </div>
                  </div>

                  {/* Positive Factors */}
                  {result.positiveFactors.length > 0 && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-500 mb-2">Key Strengths</div>
                      <div className="flex flex-wrap gap-2">
                        {result.positiveFactors.slice(0, 4).map((factor, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200"
                          >
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Factors Alert */}
            {result.riskFactors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 border-l-4 border-l-amber-500 p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Risk Factors Identified ({result.riskFactors.length})
                  </h3>
                  <div className="space-y-3">
                    {result.riskFactors.map((risk, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          risk.severity === 'critical'
                            ? 'bg-red-50 border border-red-200'
                            : risk.severity === 'high'
                            ? 'bg-orange-50 border border-orange-200'
                            : risk.severity === 'medium'
                            ? 'bg-amber-50 border border-amber-200'
                            : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <AlertOctagon
                          className={`w-5 h-5 flex-shrink-0 ${
                            risk.severity === 'critical'
                              ? 'text-red-600'
                              : risk.severity === 'high'
                              ? 'text-orange-600'
                              : risk.severity === 'medium'
                              ? 'text-amber-600'
                              : 'text-gray-500'
                          }`}
                        />
                        <div>
                          <span
                            className={`text-xs font-medium uppercase ${
                              risk.severity === 'critical'
                                ? 'text-red-700'
                                : risk.severity === 'high'
                                ? 'text-orange-700'
                                : risk.severity === 'medium'
                                ? 'text-amber-700'
                                : 'text-gray-600'
                            }`}
                          >
                            {risk.severity} • {risk.category}
                          </span>
                          <p className="text-gray-800 mt-1">{risk.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* FMCSA Data Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ExpandableSection
                title="FMCSA Data"
                icon={TruckIcon}
                defaultOpen={true}
                badge={`${result.fmcsa.score}/100`}
                badgeColor={
                  result.fmcsa.score >= 70
                    ? 'bg-emerald-100 text-emerald-700'
                    : result.fmcsa.score >= 50
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }
              >
                {result.fmcsa.carrier ? (
                  <div className="space-y-6">
                    {/* Carrier Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Legal Name</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {result.fmcsa.carrier.legalName}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">MC Number</div>
                            <div className="font-semibold text-gray-900">MC-{result.mcNumber}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-1">DOT Number</div>
                            <div className="font-semibold text-gray-900">{result.dotNumber || 'N/A'}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 mb-1">Address</div>
                          <div className="font-medium text-gray-800">
                            {result.fmcsa.carrier.physicalAddress}, {result.fmcsa.carrier.hqCity},{' '}
                            {result.fmcsa.carrier.hqState}
                          </div>
                        </div>
                        {result.fmcsa.carrier.phone && (
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Phone</div>
                            <div className="font-medium text-gray-800">{result.fmcsa.carrier.phone}</div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-200">
                            <TruckIcon className="w-6 h-6 mx-auto mb-2 text-primary-600" />
                            <div className="text-2xl font-bold text-gray-900">
                              {result.fmcsa.carrier.totalPowerUnits}
                            </div>
                            <div className="text-xs text-gray-500">Power Units</div>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-4 text-center border border-gray-200">
                            <Users className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                            <div className="text-2xl font-bold text-gray-900">
                              {result.fmcsa.carrier.totalDrivers}
                            </div>
                            <div className="text-xs text-gray-500">Drivers</div>
                          </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Operating Status</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.fmcsa.carrier.allowedToOperate === 'Y'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-red-100 text-red-700 border border-red-200'
                              }`}
                            >
                              {result.fmcsa.carrier.allowedToOperate === 'Y'
                                ? 'AUTHORIZED'
                                : 'NOT AUTHORIZED'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Safety Rating</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                result.fmcsa.carrier.safetyRating === 'Satisfactory'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : result.fmcsa.carrier.safetyRating === 'Conditional'
                                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {result.fmcsa.carrier.safetyRating || 'NOT RATED'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <div className="text-sm text-gray-600 mb-2">Insurance on File</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">BIPD:</span>{' '}
                              <span className="font-medium text-gray-900">
                                {formatCurrency(result.fmcsa.carrier.bipdOnFile)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Cargo:</span>{' '}
                              <span className="font-medium text-gray-900">
                                {formatCurrency(result.fmcsa.carrier.cargoOnFile)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scoring Factors */}
                    <div>
                      <h4 className="font-semibold mb-4 text-gray-900">Scoring Breakdown</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {result.fmcsa.factors.map((factor, i) => (
                          <FactorBar key={i} {...factor} />
                        ))}
                      </div>
                    </div>

                    {/* Authority Info */}
                    {result.fmcsa.authority && (
                      <div>
                        <h4 className="font-semibold mb-4 text-gray-900">Authority Status</h4>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1">Common Authority</div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                result.fmcsa.authority.commonAuthorityStatus === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {result.fmcsa.authority.commonAuthorityStatus}
                            </span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1">Contract Authority</div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                result.fmcsa.authority.contractAuthorityStatus === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {result.fmcsa.authority.contractAuthorityStatus}
                            </span>
                          </div>
                          <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                            <div className="text-sm text-gray-500 mb-1">Broker Authority</div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                result.fmcsa.authority.brokerAuthorityStatus === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {result.fmcsa.authority.brokerAuthorityStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
                    <p className="text-lg font-semibold text-red-600">MC Number Not Found</p>
                    <p className="text-sm text-gray-500">
                      This MC number was not found in the FMCSA database
                    </p>
                  </div>
                )}
              </ExpandableSection>
            </motion.div>

            {/* Credit Data Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ExpandableSection
                title="Creditsafe Report"
                icon={CreditCard}
                defaultOpen={true}
                badge={result.creditsafe.companyFound ? `${result.creditsafe.score}/100` : 'N/A'}
                badgeColor={
                  result.creditsafe.score >= 70
                    ? 'bg-emerald-100 text-emerald-700'
                    : result.creditsafe.score >= 50
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }
              >
                {result.creditsafe.companyFound ? (
                  <div className="space-y-6">
                    {/* Credit Overview */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-100 rounded-xl p-6 text-center border border-gray-200">
                        <div className="text-4xl font-bold text-purple-600 mb-1">
                          {result.creditsafe.creditScore || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">Credit Score</div>
                        <div
                          className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                            result.creditsafe.creditRating === 'A'
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : result.creditsafe.creditRating === 'B'
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : result.creditsafe.creditRating === 'C'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}
                        >
                          Rating: {result.creditsafe.creditRating || 'N/A'}
                        </div>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-6 text-center border border-gray-200">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">
                          {formatCurrency(result.creditsafe.creditLimit)}
                        </div>
                        <div className="text-sm text-gray-500">Credit Limit</div>
                      </div>
                      <div className="bg-gray-100 rounded-xl p-6 text-center border border-gray-200">
                        <div className="text-lg font-semibold text-gray-800 mb-1">
                          {result.creditsafe.riskDescription || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">Risk Level</div>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Company Name</div>
                        <div className="font-semibold text-gray-900">{result.creditsafe.companyName}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <div className="text-sm text-gray-500 mb-1">Years in Business</div>
                          <div className="font-semibold text-gray-900">
                            {result.creditsafe.yearsInBusiness || 'N/A'}
                          </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <div className="text-sm text-gray-500 mb-1">Employees</div>
                          <div className="font-semibold text-gray-900">{result.creditsafe.employees || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Legal Filings */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-900">
                        <Scale className="w-5 h-5 text-amber-600" />
                        Legal Filings Summary
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div
                          className={`rounded-lg p-4 text-center border ${
                            result.creditsafe.legalFilings.judgments > 0
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              result.creditsafe.legalFilings.judgments > 0
                                ? 'text-red-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {result.creditsafe.legalFilings.judgments}
                          </div>
                          <div className="text-xs text-gray-500">Judgments</div>
                        </div>
                        <div
                          className={`rounded-lg p-4 text-center border ${
                            result.creditsafe.legalFilings.taxLiens > 0
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              result.creditsafe.legalFilings.taxLiens > 0
                                ? 'text-orange-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {result.creditsafe.legalFilings.taxLiens}
                          </div>
                          <div className="text-xs text-gray-500">Tax Liens</div>
                        </div>
                        <div
                          className={`rounded-lg p-4 text-center border ${
                            result.creditsafe.legalFilings.uccFilings > 0
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              result.creditsafe.legalFilings.uccFilings > 0
                                ? 'text-blue-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {result.creditsafe.legalFilings.uccFilings}
                          </div>
                          <div className="text-xs text-gray-500">UCC Filings</div>
                        </div>
                        <div
                          className={`rounded-lg p-4 text-center border ${
                            result.creditsafe.legalFilings.cautionaryUCC > 0
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              result.creditsafe.legalFilings.cautionaryUCC > 0
                                ? 'text-amber-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {result.creditsafe.legalFilings.cautionaryUCC}
                          </div>
                          <div className="text-xs text-gray-500">Cautionary UCC</div>
                        </div>
                        <div
                          className={`rounded-lg p-4 text-center border ${
                            result.creditsafe.legalFilings.suits > 0
                              ? 'bg-purple-50 border-purple-200'
                              : 'bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              result.creditsafe.legalFilings.suits > 0
                                ? 'text-purple-600'
                                : 'text-gray-400'
                            }`}
                          >
                            {result.creditsafe.legalFilings.suits}
                          </div>
                          <div className="text-xs text-gray-500">Suits</div>
                        </div>
                        <div
                          className={`rounded-lg p-4 text-center border ${
                            result.creditsafe.legalFilings.bankruptcy
                              ? 'bg-red-50 border-red-200'
                              : 'bg-gray-100 border-gray-200'
                          }`}
                        >
                          <div
                            className={`text-2xl font-bold ${
                              result.creditsafe.legalFilings.bankruptcy
                                ? 'text-red-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {result.creditsafe.legalFilings.bankruptcy ? 'YES' : 'NO'}
                          </div>
                          <div className="text-xs text-gray-500">Bankruptcy</div>
                        </div>
                      </div>
                    </div>

                    {/* OFAC Check */}
                    {result.creditsafe.negativeInformation?.possibleOfac !== undefined && (
                      <div className="mt-4">
                        <div
                          className={`rounded-lg p-4 border flex items-center gap-3 ${
                            result.creditsafe.negativeInformation.possibleOfac
                              ? 'bg-red-50 border-red-200'
                              : 'bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          {result.creditsafe.negativeInformation.possibleOfac ? (
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                          ) : (
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">OFAC Check</div>
                            <div className={`text-sm ${result.creditsafe.negativeInformation.possibleOfac ? 'text-red-600' : 'text-emerald-600'}`}>
                              {result.creditsafe.negativeInformation.possibleOfac ? 'Possible OFAC Match - Review Required' : 'No OFAC Matches Found'}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UCC Filing Details */}
                    {result.creditsafe.negativeInformation?.uccFilings && result.creditsafe.negativeInformation.uccFilings.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                          <FileWarning className="w-5 h-5 text-blue-600" />
                          UCC Filing Details ({result.creditsafe.negativeInformation.uccFilings.length})
                        </h4>
                        <div className="space-y-4">
                          {result.creditsafe.negativeInformation.uccFilings.map((ucc, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-gray-900">UCC Filing #{index + 1}</span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  ucc.status === 'AMENDED' ? 'bg-blue-100 text-blue-700' :
                                  ucc.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                  ucc.status === 'TERMINATED' ? 'bg-gray-100 text-gray-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {ucc.status || 'Unknown'}
                                </span>
                              </div>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <div className="text-gray-500">Filed Date</div>
                                  <div className="font-medium text-gray-900">
                                    {ucc.filedDate ? new Date(ucc.filedDate).toLocaleDateString() : 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Filing Type</div>
                                  <div className="font-medium text-gray-900">{ucc.filingType || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Filing Number</div>
                                  <div className="font-medium text-gray-900">{ucc.filingNumber || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Jurisdiction</div>
                                  <div className="font-medium text-gray-900">{ucc.jurisdiction || 'N/A'}</div>
                                </div>
                                <div className="md:col-span-2">
                                  <div className="text-gray-500">Filing Office</div>
                                  <div className="font-medium text-gray-900">{ucc.filingOffice || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Debtor Name</div>
                                  <div className="font-medium text-gray-900">{ucc.debtorName || 'N/A'}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Debtor Address</div>
                                  <div className="font-medium text-gray-900">
                                    {ucc.debtorAddress?.simpleValue ||
                                     (ucc.debtorAddress ? `${ucc.debtorAddress.street || ''}, ${ucc.debtorAddress.city || ''}, ${ucc.debtorAddress.province || ''} ${ucc.debtorAddress.postalCode || ''}` : 'N/A')}
                                  </div>
                                </div>
                                {ucc.relatedDocumentNumber && (
                                  <div>
                                    <div className="text-gray-500">Related Document</div>
                                    <div className="font-medium text-gray-900">{ucc.relatedDocumentNumber}</div>
                                  </div>
                                )}
                                {ucc.securedParty?.name && (
                                  <div>
                                    <div className="text-gray-500">Secured Party</div>
                                    <div className="font-medium text-gray-900">{ucc.securedParty.name}</div>
                                  </div>
                                )}
                                {ucc.collateralDescription && (
                                  <div className="md:col-span-2">
                                    <div className="text-gray-500">Collateral</div>
                                    <div className="font-medium text-gray-900">{ucc.collateralDescription}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Legal Filing Summaries */}
                    {(result.creditsafe.negativeInformation?.legalFilingSummary ||
                      result.creditsafe.negativeInformation?.legalFilingGroupSummary ||
                      result.creditsafe.negativeInformation?.legalFilingBranchSummary) && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
                          <Scale className="w-5 h-5 text-purple-600" />
                          Legal Filing Summaries
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {result.creditsafe.negativeInformation?.legalFilingSummary && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="font-semibold text-gray-900 mb-3 text-sm">Filing Summary</div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Bankruptcy</span>
                                  <span className={`font-medium ${result.creditsafe.negativeInformation.legalFilingSummary.bankruptcy ? 'text-red-600' : 'text-gray-900'}`}>
                                    {result.creditsafe.negativeInformation.legalFilingSummary.bankruptcy ? 'Yes' : 'No'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Tax Liens</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingSummary.taxLienFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Judgments</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingSummary.judgmentFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">UCC Filings</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingSummary.uccFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Cautionary UCC</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingSummary.cautionaryUccFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Suits</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingSummary.suits ?? 0}</span>
                                </div>
                                {result.creditsafe.negativeInformation.legalFilingSummary.sum && (
                                  <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-500">Total Value</span>
                                    <span className="font-medium text-gray-900">
                                      {result.creditsafe.negativeInformation.legalFilingSummary.sum.currency} ${(result.creditsafe.negativeInformation.legalFilingSummary.sum.value || 0).toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {result.creditsafe.negativeInformation?.legalFilingGroupSummary && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="font-semibold text-gray-900 mb-3 text-sm">Group Summary</div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Bankruptcy</span>
                                  <span className={`font-medium ${result.creditsafe.negativeInformation.legalFilingGroupSummary.bankruptcy ? 'text-red-600' : 'text-gray-900'}`}>
                                    {result.creditsafe.negativeInformation.legalFilingGroupSummary.bankruptcy ? 'Yes' : 'No'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Tax Liens</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingGroupSummary.taxLienFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Judgments</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingGroupSummary.judgmentFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">UCC Filings</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingGroupSummary.uccFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Cautionary UCC</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingGroupSummary.cautionaryUccFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Suits</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingGroupSummary.suits ?? 0}</span>
                                </div>
                                {result.creditsafe.negativeInformation.legalFilingGroupSummary.sum && (
                                  <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-500">Total Value</span>
                                    <span className="font-medium text-gray-900">
                                      {result.creditsafe.negativeInformation.legalFilingGroupSummary.sum.currency} ${(result.creditsafe.negativeInformation.legalFilingGroupSummary.sum.value || 0).toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          {result.creditsafe.negativeInformation?.legalFilingBranchSummary && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="font-semibold text-gray-900 mb-3 text-sm">Branch Summary</div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Bankruptcy</span>
                                  <span className={`font-medium ${result.creditsafe.negativeInformation.legalFilingBranchSummary.bankruptcy ? 'text-red-600' : 'text-gray-900'}`}>
                                    {result.creditsafe.negativeInformation.legalFilingBranchSummary.bankruptcy ? 'Yes' : 'No'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Tax Liens</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingBranchSummary.taxLienFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Judgments</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingBranchSummary.judgmentFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">UCC Filings</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingBranchSummary.uccFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Cautionary UCC</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingBranchSummary.cautionaryUccFilings ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Suits</span>
                                  <span className="font-medium text-gray-900">{result.creditsafe.negativeInformation.legalFilingBranchSummary.suits ?? 0}</span>
                                </div>
                                {result.creditsafe.negativeInformation.legalFilingBranchSummary.sum && (
                                  <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-500">Total Value</span>
                                    <span className="font-medium text-gray-900">
                                      {result.creditsafe.negativeInformation.legalFilingBranchSummary.sum.currency} ${(result.creditsafe.negativeInformation.legalFilingBranchSummary.sum.value || 0).toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Scoring Factors */}
                    <div>
                      <h4 className="font-semibold mb-4 text-gray-900">Scoring Breakdown</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {result.creditsafe.factors.map((factor, i) => (
                          <FactorBar key={i} {...factor} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                    <p className="text-lg font-semibold text-amber-600">Company Not Found</p>
                    <p className="text-sm text-gray-500">
                      Unable to locate this company in Creditsafe database
                    </p>
                  </div>
                )}
              </ExpandableSection>
            </motion.div>

            {/* Analysis Timestamp */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-4"
            >
              <p className="text-sm text-gray-500">
                <Sparkles className="w-4 h-4 inline mr-1" />
                Analysis completed at {new Date(result.analyzedAt).toLocaleString()}
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminAIDueDiligence
