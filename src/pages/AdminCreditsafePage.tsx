import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Phone,
  Globe,
  FileText,
  CreditCard,
  Activity,
  Loader2,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  Shield,
  Scale,
  Briefcase,
  PieChart,
  BarChart3,
  Clock,
  AlertOctagon,
  FileWarning,
  Banknote,
  Building,
  User,
  Mail,
  Hash,
  Landmark,
  CircleDollarSign,
  BadgeCheck,
  BadgeAlert,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Sparkles
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import api from '../services/api'
import toast from 'react-hot-toast'

// US States for dropdown
const US_STATES = [
  { value: '', label: 'All States' },
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' }, { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' }, { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' }, { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
]

interface CompanySearchResult {
  id: string
  connectId?: string
  name: string
  regNo?: string
  vatNo?: string
  address?: {
    simpleValue?: string
    street?: string
    city?: string
    postCode?: string
    province?: string
    country?: string
  }
  status?: string
  type?: string
  safeNumber?: string
}

// Expandable Section Component
const ExpandableSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
  badge,
  badgeColor = 'bg-gray-100 text-gray-600'
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
    <motion.div
      className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
      initial={false}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
          {badge !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Stat Card Component
const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'blue'
}: {
  label: string
  value: string | number
  icon: any
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600'
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> :
               trend === 'down' ? <ArrowDownRight className="w-4 h-4" /> :
               <Minus className="w-4 h-4" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}

// Credit Score Gauge Component
const CreditScoreGauge = ({ score, maxScore = 100, description }: { score: number | null, maxScore?: number, description?: string }) => {
  const percentage = score !== null ? (score / maxScore) * 100 : 0
  const getColor = () => {
    if (score === null) return '#9CA3AF'
    if (percentage >= 70) return '#10B981'
    if (percentage >= 50) return '#F59E0B'
    if (percentage >= 30) return '#F97316'
    return '#EF4444'
  }

  const circumference = 2 * Math.PI * 80
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="16"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={getColor()}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-5xl font-bold"
            style={{ color: getColor() }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score !== null ? score : 'N/A'}
          </motion.span>
          <span className="text-sm text-gray-500 mt-1">out of {maxScore}</span>
        </div>
      </div>
      {description && (
        <motion.p
          className="mt-4 text-center font-medium text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}

// Risk Indicator Component
const RiskIndicator = ({ level, label }: { level: 'low' | 'medium' | 'high' | 'unknown', label: string }) => {
  const config = {
    low: { color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', icon: CheckCircle },
    medium: { color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700', icon: AlertTriangle },
    high: { color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700', icon: XCircle },
    unknown: { color: 'bg-gray-400', bgColor: 'bg-gray-50', textColor: 'text-gray-600', icon: Info }
  }

  const { color, bgColor, textColor, icon: Icon } = config[level]

  return (
    <div className={`${bgColor} rounded-xl p-4 flex items-center gap-3`}>
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className={`font-semibold ${textColor} capitalize`}>{level} Risk</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  )
}

const AdminCreditsafePage = () => {
  // Service health state
  const [serviceHealth, setServiceHealth] = useState<{
    configured: boolean
    authenticated: boolean
    error?: string
  } | null>(null)
  const [checkingHealth, setCheckingHealth] = useState(true)

  // Search state
  const [searchName, setSearchName] = useState('')
  const [searchRegNo, setSearchRegNo] = useState('')
  const [searchState, setSearchState] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([])
  const [totalResults, setTotalResults] = useState(0)

  // Selected company state
  const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [fullReport, setFullReport] = useState<any>(null)

  // Check service health on mount
  useEffect(() => {
    checkServiceHealth()
  }, [])

  const checkServiceHealth = async () => {
    setCheckingHealth(true)
    try {
      const response = await api.creditsafeHealthCheck()
      setServiceHealth(response.data)
    } catch (error) {
      setServiceHealth({
        configured: false,
        authenticated: false,
        error: error instanceof Error ? error.message : 'Failed to check service health'
      })
    } finally {
      setCheckingHealth(false)
    }
  }

  const handleSearch = async () => {
    if (!searchName && !searchRegNo) {
      toast.error('Please enter a company name or registration number')
      return
    }

    setIsSearching(true)
    setSearchResults([])
    setTotalResults(0)
    setSelectedCompany(null)
    setFullReport(null)

    try {
      const response = await api.creditsafeSearchCompanies({
        countries: 'US',
        name: searchName || undefined,
        regNo: searchRegNo || undefined,
        state: searchState || undefined,
        city: searchCity || undefined,
        pageSize: 25,
      })

      setSearchResults(response.data.companies)
      setTotalResults(response.data.totalResults)

      if (response.data.companies.length === 0) {
        toast('No companies found matching your search criteria', { icon: '🔍' })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Search failed')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectCompany = async (company: CompanySearchResult) => {
    const connectId = company.connectId || company.id
    if (!connectId) {
      toast.error('No connect ID available for this company')
      return
    }

    setSelectedCompany(company)
    setIsLoadingReport(true)
    setFullReport(null)

    try {
      const response = await api.creditsafeGetCreditReport(connectId, { includeIndicators: true })
      setFullReport(response.data)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load credit report')
    } finally {
      setIsLoadingReport(false)
    }
  }

  const formatCurrency = (value: number | null | undefined, currency = 'USD') => {
    if (value === null || value === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US').format(value)
  }

  // Extract data from the full report
  // Handles both UK (ccjSummary) and US (legalFilingSummary) formats
  const getReportData = () => {
    if (!fullReport) return null

    const basic = fullReport.companyIdentification?.basicInformation || {}
    const creditScore = fullReport.creditScore?.currentCreditRating || {}
    const previousScore = fullReport.creditScore?.previousCreditRating || {}
    const directors = fullReport.directors?.currentDirectors || []
    const financials = fullReport.financialStatements || []
    const latestFinancials = financials[0] || {}

    // Handle UK vs US negative information structure
    const ccjSummary = fullReport.negativeInformation?.ccjSummary || {}
    const legalFilingSummary = fullReport.negativeInformation?.legalFilingSummary || {}

    // Normalize CCJ/Legal filings data for both UK and US
    const ccj = {
      numberOfExact: ccjSummary.numberOfExact || legalFilingSummary.judgmentFilings || 0,
      numberOfPossible: ccjSummary.numberOfPossible || legalFilingSummary.taxLienFilings || 0,
      totalAmount: ccjSummary.totalAmount || legalFilingSummary.sum || null,
      // US-specific fields
      uccFilings: legalFilingSummary.uccFilings || 0,
      cautionaryUCCFilings: legalFilingSummary.cautionaryUCCFilings || 0,
      bankruptcy: legalFilingSummary.bankruptcy || false,
      suits: legalFilingSummary.suits || 0,
    }

    // Payment data - handle nested dbt structure
    const rawPaymentData = fullReport.paymentData || {}
    const paymentData = {
      // DBT can be at root level or nested under dbt object
      dbt: rawPaymentData.dbt?.dbt ?? rawPaymentData.dbt ?? undefined,
      industryDBT: rawPaymentData.dbt?.industryDBT ?? rawPaymentData.industryDBT ?? undefined,
      // Additional payment data
      tradePaymentSummary: rawPaymentData.tradePaymentSummary,
      tradeLinesInformation: rawPaymentData.tradeLinesInformation,
      dbtHistory: rawPaymentData.dbtHistory,
      // Payment trends
      paymentTrendIndicator: rawPaymentData.paymentTrendIndicator ?? rawPaymentData.dbt?.paymentTrendIndicator,
      paymentComparison: rawPaymentData.paymentComparison ?? rawPaymentData.dbt?.paymentComparison,
    }

    const additionalInfo = fullReport.additionalInformation || {}
    const shareCapital = fullReport.shareCapitalStructure || {}
    const otherInfo = fullReport.otherInformation || {}

    // Get employee count from various possible locations
    const employeeCount =
      additionalInfo.employeeInformation?.numberOfEmployees ||
      otherInfo.employeesInformation?.[0]?.numberOfEmployees ||
      additionalInfo.ratingCommentary?.estimatedNumberOfEmployees ||
      null

    // Contact info (US format has contactInformation)
    const contactInfo = fullReport.contactInformation || {}

    // Company summary (US format)
    const companySummary = fullReport.companySummary || {}

    // Get all legal filing summaries (branch and group - legalFilingSummary already declared above)
    const legalFilingBranchSummary = fullReport.negativeInformation?.legalFilingBranchSummary || {}
    const legalFilingGroupSummary = fullReport.negativeInformation?.legalFilingGroupSummary || {}

    // Rating commentary with detailed metrics
    const ratingCommentary = additionalInfo.ratingCommentary || {}

    // Commentaries (risk analysis text)
    const commentaries = additionalInfo.commentaries || []

    // Branch offices
    const branchOffices = additionalInfo.branchOffices || []

    // Credit rating history
    const creditRatingHistory = additionalInfo.creditRatingHistory || []

    // Rating percentiles
    const ratingPercentiles = additionalInfo.ratingPercentiles || {}

    // Misc business info
    const miscInfo = additionalInfo.misc || {}

    // Corporate records
    const primaryCorporateRecord = additionalInfo.primaryCorporateRecord || {}

    // Enquiries trend
    const enquiriesTrend = additionalInfo.enquiriesTrend || additionalInfo.inquiriesTrend || {}

    return {
      basic,
      creditScore,
      previousScore,
      directors,
      financials,
      latestFinancials,
      ccj,
      paymentData,
      additionalInfo,
      shareCapital,
      otherInfo,
      employeeCount,
      contactInfo,
      companySummary,
      // Rating commentary with DBT info
      ratingCommentary,
      // UCC filings from negative info
      negativeInfo: fullReport.negativeInformation || {},
      // Detailed legal filing summaries
      legalFilingSummary,
      legalFilingBranchSummary,
      legalFilingGroupSummary,
      // Additional business insights
      commentaries,
      branchOffices,
      creditRatingHistory,
      ratingPercentiles,
      miscInfo,
      primaryCorporateRecord,
      enquiriesTrend,
      // OFAC check
      possibleOfac: fullReport.negativeInformation?.possibleOfac || false,
    }
  }

  const reportData = getReportData()

  // Render service not configured state
  if (!checkingHealth && serviceHealth && !serviceHealth.configured) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1">Creditsafe Credit Reports</h2>
            <p className="text-gray-500">Access comprehensive business credit reports</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-12">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Not Configured</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Creditsafe API credentials are not configured. Please add your CREDITSAFE_USERNAME and
                CREDITSAFE_PASSWORD environment variables to enable this feature.
              </p>
              <Button variant="outline" onClick={checkServiceHealth}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Check Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="p-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Business Credit Intelligence
                    </h1>
                    <p className="text-gray-500">Comprehensive credit reports & risk assessment</p>
                  </div>
                </div>
              </div>

              {/* Service Status */}
              <div className="flex items-center gap-3">
                {checkingHealth ? (
                  <span className="flex items-center text-gray-400 bg-gray-100 px-4 py-2 rounded-full">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </span>
                ) : serviceHealth?.authenticated ? (
                  <span className="flex items-center text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    API Connected
                  </span>
                ) : (
                  <span className="flex items-center text-red-700 bg-red-50 px-4 py-2 rounded-full font-medium">
                    <XCircle className="w-4 h-4 mr-2" />
                    Disconnected
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Search Companies</h2>
                <p className="text-sm text-gray-500">Find businesses by name, registration number, or location</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="lg:col-span-2">
                <Input
                  label="Company Name"
                  placeholder="Enter company name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  icon={<Building2 className="w-4 h-4" />}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Input
                label="Registration / EIN"
                placeholder="EIN or reg number"
                value={searchRegNo}
                onChange={(e) => setSearchRegNo(e.target.value)}
                icon={<Hash className="w-4 h-4" />}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Select
                label="State"
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                options={US_STATES}
              />
              <Input
                label="City"
                placeholder="City (optional)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                icon={<MapPin className="w-4 h-4" />}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSearch}
                disabled={isSearching || (!searchName && !searchRegNo)}
                className="px-8"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Database
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Results Grid */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Search Results Sidebar */}
            <motion.div
              className="lg:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden sticky top-8">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Search Results</h3>
                    {totalResults > 0 && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {totalResults} found
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No results yet</p>
                      <p className="text-sm text-gray-400 mt-1">Search for a company to get started</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((company, index) => (
                        <motion.button
                          key={company.id}
                          onClick={() => handleSelectCompany(company)}
                          className={`w-full text-left p-5 hover:bg-gray-50 transition-all ${
                            selectedCompany?.id === company.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              selectedCompany?.id === company.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Building className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{company.name}</p>
                              {company.address?.simpleValue && (
                                <p className="text-sm text-gray-500 truncate mt-0.5 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {company.address.simpleValue}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                {company.regNo && (
                                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                                    #{company.regNo}
                                  </span>
                                )}
                                {company.status && (
                                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                    company.status.toLowerCase().includes('active')
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {company.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-colors ${
                              selectedCompany?.id === company.id ? 'text-blue-500' : 'text-gray-300'
                            }`} />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Report Content */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {isLoadingReport ? (
                  <motion.div
                    key="loading"
                    className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <motion.div
                          className="absolute inset-0 rounded-full border-4 border-blue-200"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                          className="absolute inset-2 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-blue-500" />
                        </div>
                      </div>
                      <p className="text-gray-600 font-medium">Loading Credit Report...</p>
                      <p className="text-sm text-gray-400 mt-1">Fetching comprehensive business data</p>
                    </div>
                  </motion.div>
                ) : reportData ? (
                  <motion.div
                    key="report"
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Company Header Card */}
                    <motion.div
                      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
                      </div>

                      <div className="relative">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">
                                {reportData.basic.businessName || reportData.basic.registeredCompanyName || 'N/A'}
                              </h2>
                              <p className="text-white/60 mt-1">
                                {reportData.basic.contactAddress?.simpleValue || 'Address not available'}
                              </p>
                            </div>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            reportData.basic.companyStatus?.status?.toLowerCase().includes('active')
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                          }`}>
                            {reportData.basic.companyStatus?.status || 'Unknown Status'}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {reportData.basic.companyRegistrationNumber && (
                            <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1 flex items-center gap-1">
                                <Hash className="w-3 h-3" /> Registration
                              </p>
                              <p className="font-semibold">{reportData.basic.companyRegistrationNumber}</p>
                            </div>
                          )}
                          {reportData.basic.vatRegistrationNumber && (
                            <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> VAT/Tax ID
                              </p>
                              <p className="font-semibold">{reportData.basic.vatRegistrationNumber}</p>
                            </div>
                          )}
                          {reportData.basic.contactTelephone && (
                            <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Phone
                              </p>
                              <p className="font-semibold">{reportData.basic.contactTelephone}</p>
                            </div>
                          )}
                          {reportData.basic.contactWebsite && (
                            <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                              <p className="text-white/50 text-xs mb-1 flex items-center gap-1">
                                <Globe className="w-3 h-3" /> Website
                              </p>
                              <a
                                href={reportData.basic.contactWebsite.startsWith('http') ? reportData.basic.contactWebsite : `https://${reportData.basic.contactWebsite}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-blue-300 hover:text-blue-200 flex items-center gap-1"
                              >
                                Visit <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {reportData.basic.principalActivity?.description && (
                          <div className="mt-4 bg-white/5 backdrop-blur rounded-xl p-4">
                            <p className="text-white/50 text-xs mb-1 flex items-center gap-1">
                              <Briefcase className="w-3 h-3" /> Principal Activity
                            </p>
                            <p className="font-medium">{reportData.basic.principalActivity.description}</p>
                            {reportData.basic.principalActivity.code && (
                              <span className="text-xs text-white/40 mt-1">SIC: {reportData.basic.principalActivity.code}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Credit Score Section */}
                    <motion.div
                      className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Credit Assessment</h3>
                          <p className="text-sm text-gray-500">Overall creditworthiness evaluation</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Credit Score Gauge */}
                        <div className="flex justify-center">
                          <CreditScoreGauge
                            score={
                              // Use providerValue.value for numeric score, fallback to parsing commonValue
                              parseInt(reportData.creditScore.providerValue?.value) ||
                              parseInt(reportData.creditScore.commonValue) ||
                              null
                            }
                            description={
                              reportData.creditScore.commonDescription ||
                              reportData.creditScore.providerDescription ||
                              (reportData.creditScore.commonValue ? `Rating: ${reportData.creditScore.commonValue}` : undefined)
                            }
                          />
                        </div>

                        {/* Credit Details */}
                        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                          <StatCard
                            label="Credit Limit"
                            value={formatCurrency(
                              typeof reportData.creditScore.creditLimit?.value === 'string'
                                ? parseFloat(reportData.creditScore.creditLimit.value)
                                : reportData.creditScore.creditLimit?.value,
                              reportData.creditScore.creditLimit?.currency
                            )}
                            icon={CircleDollarSign}
                            color="green"
                          />
                          <StatCard
                            label="Days Beyond Terms"
                            value={reportData.paymentData.dbt !== undefined ? `${reportData.paymentData.dbt} days` : 'N/A'}
                            icon={Clock}
                            trend={
                              reportData.paymentData.dbt === undefined ? undefined :
                              reportData.paymentData.dbt > 30 ? 'down' : reportData.paymentData.dbt > 0 ? 'neutral' : 'up'
                            }
                            trendValue={reportData.paymentData.industryDBT !== undefined ? `Industry avg: ${reportData.paymentData.industryDBT} days` : undefined}
                            color={
                              reportData.paymentData.dbt === undefined ? 'blue' :
                              reportData.paymentData.dbt > 30 ? 'red' : reportData.paymentData.dbt > 15 ? 'yellow' : 'blue'
                            }
                          />
                          <StatCard
                            label="Previous Rating"
                            value={reportData.previousScore.commonValue || 'N/A'}
                            icon={Activity}
                            color="purple"
                          />
                          <StatCard
                            label="Employees"
                            value={reportData.employeeCount || 'N/A'}
                            icon={Users}
                            color="blue"
                          />
                        </div>
                      </div>

                      {/* Risk Indicators */}
                      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <RiskIndicator
                          level={(() => {
                            const score = parseInt(reportData.creditScore.providerValue?.value) ||
                                         parseInt(reportData.creditScore.commonValue);
                            if (!score) return 'unknown';
                            if (score >= 60) return 'low';
                            if (score >= 40) return 'medium';
                            return 'high';
                          })()}
                          label="Credit Score Risk"
                        />
                        <RiskIndicator
                          level={
                            reportData.paymentData.dbt === undefined ? 'unknown' :
                            reportData.paymentData.dbt <= 15 ? 'low' :
                            reportData.paymentData.dbt <= 30 ? 'medium' : 'high'
                          }
                          label="Payment Behavior"
                        />
                        <RiskIndicator
                          level={
                            (reportData.ccj.numberOfExact || 0) + (reportData.ccj.numberOfPossible || 0) === 0 ? 'low' :
                            (reportData.ccj.numberOfExact || 0) + (reportData.ccj.numberOfPossible || 0) <= 2 ? 'medium' : 'high'
                          }
                          label="Legal Judgments"
                        />
                        <RiskIndicator
                          level={
                            reportData.latestFinancials.balanceSheet?.totalShareholdersEquity === undefined ? 'unknown' :
                            reportData.latestFinancials.balanceSheet.totalShareholdersEquity > 0 ? 'low' : 'high'
                          }
                          label="Financial Health"
                        />
                      </div>
                    </motion.div>

                    {/* Expandable Sections */}
                    <div className="space-y-4">
                      {/* Financial Statements */}
                      <ExpandableSection
                        title="Financial Statements"
                        icon={BarChart3}
                        defaultOpen={true}
                        badge={reportData.financials.length}
                        badgeColor="bg-blue-100 text-blue-700"
                      >
                        {reportData.financials.length > 0 ? (
                          <div className="space-y-6">
                            {reportData.financials.slice(0, 3).map((financial: any, index: number) => (
                              <div key={index} className={`${index > 0 ? 'pt-6 border-t border-gray-100' : ''}`}>
                                <div className="flex items-center gap-2 mb-4">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span className="font-semibold text-gray-900">
                                    Year Ending: {formatDate(financial.yearEndDate)}
                                  </span>
                                  {financial.numberOfWeeks && (
                                    <span className="text-xs text-gray-400">({financial.numberOfWeeks} weeks)</span>
                                  )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                  {/* Profit & Loss */}
                                  {financial.profitAndLoss && (
                                    <div className="bg-gray-50 rounded-xl p-5">
                                      <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        Profit & Loss
                                      </h5>
                                      <div className="space-y-3">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Revenue</span>
                                          <span className="font-semibold">{formatCurrency(financial.profitAndLoss.revenue)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Operating Profit</span>
                                          <span className={`font-semibold ${financial.profitAndLoss.operatingProfit < 0 ? 'text-red-600' : ''}`}>
                                            {formatCurrency(financial.profitAndLoss.operatingProfit)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Profit Before Tax</span>
                                          <span className={`font-semibold ${financial.profitAndLoss.profitBeforeTax < 0 ? 'text-red-600' : ''}`}>
                                            {formatCurrency(financial.profitAndLoss.profitBeforeTax)}
                                          </span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                          <span className="text-gray-900 font-medium">Net Profit</span>
                                          <span className={`font-bold ${financial.profitAndLoss.profitAfterTax < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {formatCurrency(financial.profitAndLoss.profitAfterTax)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Balance Sheet */}
                                  {financial.balanceSheet && (
                                    <div className="bg-gray-50 rounded-xl p-5">
                                      <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                        <PieChart className="w-4 h-4 text-blue-500" />
                                        Balance Sheet
                                      </h5>
                                      <div className="space-y-3">
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Total Assets</span>
                                          <span className="font-semibold">{formatCurrency(financial.balanceSheet.totalAssets)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Current Assets</span>
                                          <span className="font-semibold">{formatCurrency(financial.balanceSheet.totalCurrentAssets)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-gray-600">Total Liabilities</span>
                                          <span className="font-semibold">{formatCurrency(financial.balanceSheet.totalLiabilities)}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200">
                                          <span className="text-gray-900 font-medium">Shareholders' Equity</span>
                                          <span className={`font-bold ${financial.balanceSheet.totalShareholdersEquity < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {formatCurrency(financial.balanceSheet.totalShareholdersEquity)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">No financial statements available</p>
                        )}
                      </ExpandableSection>

                      {/* Directors */}
                      <ExpandableSection
                        title="Directors & Officers"
                        icon={Users}
                        badge={reportData.directors.length}
                        badgeColor="bg-purple-100 text-purple-700"
                      >
                        {reportData.directors.length > 0 ? (
                          <div className="grid sm:grid-cols-2 gap-4">
                            {reportData.directors.map((director: any, index: number) => (
                              <div key={index} className="bg-gray-50 rounded-xl p-5">
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                    {(director.name || director.firstName || '?').charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900">
                                      {director.name || `${director.firstName || ''} ${director.lastName || ''}`.trim() || 'Unknown'}
                                    </p>
                                    {director.positions?.map((pos: any, i: number) => (
                                      <p key={i} className="text-sm text-gray-600">
                                        {pos.positionName}
                                        {pos.dateAppointed && (
                                          <span className="text-gray-400 ml-2">since {formatDate(pos.dateAppointed)}</span>
                                        )}
                                      </p>
                                    ))}
                                    {director.dateOfBirth && (
                                      <p className="text-xs text-gray-400 mt-2">DOB: {formatDate(director.dateOfBirth)}</p>
                                    )}
                                    {director.address?.simpleValue && (
                                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {director.address.simpleValue}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-8">No director information available</p>
                        )}
                      </ExpandableSection>

                      {/* Legal & Negative Information */}
                      <ExpandableSection
                        title="Legal & Negative Information"
                        icon={Scale}
                        defaultOpen={true}
                        badge={
                          (reportData.legalFilingSummary.judgmentFilings || 0) +
                          (reportData.legalFilingSummary.taxLienFilings || 0) +
                          (reportData.legalFilingSummary.uccFilings || 0) +
                          (reportData.legalFilingBranchSummary.uccFilings || 0) +
                          (reportData.legalFilingSummary.suits || 0)
                        }
                        badgeColor={
                          (reportData.legalFilingSummary.judgmentFilings || 0) +
                          (reportData.legalFilingSummary.taxLienFilings || 0) +
                          (reportData.legalFilingBranchSummary.uccFilings || 0) > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }
                      >
                        <div className="space-y-6">
                          {/* OFAC Warning */}
                          {reportData.possibleOfac && (
                            <div className="bg-red-100 border-2 border-red-500 rounded-xl p-6 text-center">
                              <AlertOctagon className="w-12 h-12 text-red-600 mx-auto mb-3" />
                              <p className="font-bold text-red-700 text-lg">OFAC Warning</p>
                              <p className="text-sm text-red-600">Possible match on OFAC sanctions list</p>
                            </div>
                          )}

                          {/* UCC Filings - Detailed Breakdown */}
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <FileWarning className="w-4 h-4 text-blue-500" />
                              UCC Filings (Uniform Commercial Code)
                            </h5>
                            <p className="text-sm text-gray-500 mb-4">
                              UCC filings indicate secured interests in business assets. Creditors file UCCs when they lend money secured by collateral.
                            </p>

                            {/* UCC Summary Cards */}
                            <div className="grid sm:grid-cols-3 gap-4 mb-4">
                              {/* Company Level */}
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <Building className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Company</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-2xl font-bold text-blue-700">{reportData.legalFilingSummary.uccFilings || 0}</p>
                                    <p className="text-xs text-blue-600">UCC Filings</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-amber-600">{reportData.legalFilingSummary.cautionaryUCCFilings || 0}</p>
                                    <p className="text-xs text-amber-600">Cautionary</p>
                                  </div>
                                </div>
                              </div>

                              {/* Branch Level */}
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <Building2 className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Branches</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-2xl font-bold text-purple-700">{reportData.legalFilingBranchSummary.uccFilings || 0}</p>
                                    <p className="text-xs text-purple-600">UCC Filings</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-amber-600">{reportData.legalFilingBranchSummary.cautionaryUCCFilings || 0}</p>
                                    <p className="text-xs text-amber-600">Cautionary</p>
                                  </div>
                                </div>
                              </div>

                              {/* Group Level */}
                              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-center gap-2 mb-3">
                                  <Briefcase className="w-4 h-4 text-gray-600" />
                                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Group</span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-2xl font-bold text-gray-700">{reportData.legalFilingGroupSummary.uccFilings || 0}</p>
                                    <p className="text-xs text-gray-600">UCC Filings</p>
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold text-amber-600">{reportData.legalFilingGroupSummary.cautionaryUCCFilings || 0}</p>
                                    <p className="text-xs text-amber-600">Cautionary</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* UCC Indicator from Rating Commentary */}
                            {reportData.ratingCommentary.uccDataIndicator !== undefined && (
                              <div className="bg-gray-50 rounded-xl p-4 mt-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">UCC Data Indicator</p>
                                    <p className="text-xs text-gray-500">Overall UCC risk assessment score</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">{reportData.ratingCommentary.uccDataIndicator}</p>
                                    <p className="text-xs text-gray-500">
                                      Total: {reportData.ratingCommentary.totalUccCount || 0} | Cautionary: {reportData.ratingCommentary.cautionaryUccCount || 0}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Judgments / Tax Liens Summary */}
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <AlertOctagon className="w-4 h-4 text-amber-500" />
                              Judgments, Tax Liens & Suits
                            </h5>

                            <div className="grid sm:grid-cols-4 gap-4">
                              <div className={`rounded-xl p-4 text-center ${(reportData.legalFilingSummary.judgmentFilings || 0) > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
                                <p className={`text-3xl font-bold ${(reportData.legalFilingSummary.judgmentFilings || 0) > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                  {reportData.legalFilingSummary.judgmentFilings || 0}
                                </p>
                                <p className="text-sm text-gray-600">Judgments</p>
                              </div>
                              <div className={`rounded-xl p-4 text-center ${(reportData.legalFilingSummary.taxLienFilings || 0) > 0 ? 'bg-amber-50' : 'bg-gray-50'}`}>
                                <p className={`text-3xl font-bold ${(reportData.legalFilingSummary.taxLienFilings || 0) > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                                  {reportData.legalFilingSummary.taxLienFilings || 0}
                                </p>
                                <p className="text-sm text-gray-600">Tax Liens</p>
                              </div>
                              <div className={`rounded-xl p-4 text-center ${(reportData.legalFilingSummary.suits || 0) > 0 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                                <p className={`text-3xl font-bold ${(reportData.legalFilingSummary.suits || 0) > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
                                  {reportData.legalFilingSummary.suits || 0}
                                </p>
                                <p className="text-sm text-gray-600">Suits</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-3xl font-bold text-gray-900">
                                  {formatCurrency(reportData.legalFilingSummary.sum?.value, reportData.legalFilingSummary.sum?.currency)}
                                </p>
                                <p className="text-sm text-gray-600">Total Amount</p>
                              </div>
                            </div>
                          </div>

                          {/* Bankruptcy Status */}
                          <div>
                            <h5 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              Bankruptcy Status
                            </h5>
                            {reportData.legalFilingSummary.bankruptcy ? (
                              <div className="bg-red-50 rounded-xl p-6 text-center border border-red-200">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                <p className="font-semibold text-red-700">Bankruptcy on File</p>
                                <p className="text-sm text-red-600">This company has a bankruptcy filing</p>
                              </div>
                            ) : (
                              <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-200">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                                <p className="font-semibold text-emerald-700">No Bankruptcy</p>
                                <p className="text-sm text-emerald-600">No bankruptcy filings found</p>
                              </div>
                            )}
                          </div>

                          {/* Legal Filings Amount Summary */}
                          {reportData.ratingCommentary.legalFilingsCount > 0 && (
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-amber-800">Historical Legal Filings</p>
                                  <p className="text-xs text-amber-600">Total filings on record</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-amber-700">
                                    {reportData.ratingCommentary.legalFilingsCount} filings
                                  </p>
                                  <p className="text-sm text-amber-600">
                                    {formatCurrency(reportData.ratingCommentary.legalFilingsAmount)} total
                                  </p>
                                  {reportData.ratingCommentary.legalFilingsCountLast12M > 0 && (
                                    <p className="text-xs text-amber-500">
                                      ({reportData.ratingCommentary.legalFilingsCountLast12M} in last 12 months)
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </ExpandableSection>

                      {/* Payment Data */}
                      <ExpandableSection
                        title="Payment History & Trends"
                        icon={Banknote}
                      >
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-gray-50 rounded-xl p-5 text-center">
                            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">
                              {reportData.paymentData.dbt !== undefined ? `${reportData.paymentData.dbt}` : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">Days Beyond Terms</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-5 text-center">
                            <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">
                              {reportData.paymentData.industryDBT !== undefined ? `${reportData.paymentData.industryDBT}` : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">Industry Average DBT</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-5 text-center">
                            <TrendingUp className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">
                              {reportData.paymentData.paymentTrendIndicator || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">Payment Trend</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-5 text-center">
                            <BarChart3 className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900">
                              {reportData.paymentData.paymentComparison || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600">vs Industry</p>
                          </div>
                        </div>
                      </ExpandableSection>

                      {/* Company Structure */}
                      {(reportData.shareCapital.issuedShareCapital || reportData.shareCapital.shareholders) && (
                        <ExpandableSection
                          title="Company Structure & Shareholders"
                          icon={Landmark}
                        >
                          <div className="space-y-6">
                            {reportData.shareCapital.issuedShareCapital && (
                              <div className="bg-gray-50 rounded-xl p-5">
                                <h5 className="font-semibold text-gray-700 mb-3">Share Capital</h5>
                                <p className="text-2xl font-bold text-gray-900">
                                  {formatCurrency(reportData.shareCapital.issuedShareCapital.value, reportData.shareCapital.issuedShareCapital.currency)}
                                </p>
                                <p className="text-sm text-gray-500">Issued Share Capital</p>
                              </div>
                            )}
                            {reportData.shareCapital.shareholders && (
                              <div>
                                <h5 className="font-semibold text-gray-700 mb-3">Shareholders</h5>
                                <div className="space-y-2">
                                  {reportData.shareCapital.shareholders.map((holder: any, index: number) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                          <User className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <span className="font-medium">{holder.name}</span>
                                      </div>
                                      {holder.shareholding && (
                                        <span className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                                          {holder.shareholding}%
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </ExpandableSection>
                      )}

                      {/* Risk Insights & Commentaries */}
                      {reportData.commentaries && reportData.commentaries.length > 0 && (
                        <ExpandableSection
                          title="Risk Insights & Analysis"
                          icon={Activity}
                          defaultOpen={true}
                          badge={reportData.commentaries.length}
                          badgeColor="bg-indigo-100 text-indigo-700"
                        >
                          <div className="space-y-4">
                            <p className="text-sm text-gray-500 mb-4">
                              Automated risk analysis and insights based on company data.
                            </p>
                            {reportData.commentaries.map((comment: any, index: number) => (
                              <div
                                key={index}
                                className={`rounded-xl p-4 border ${
                                  comment.positiveOrNegative === 'Positive'
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : comment.positiveOrNegative === 'Negative'
                                    ? 'bg-red-50 border-red-200'
                                    : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    comment.positiveOrNegative === 'Positive'
                                      ? 'bg-emerald-500'
                                      : comment.positiveOrNegative === 'Negative'
                                      ? 'bg-red-500'
                                      : 'bg-gray-400'
                                  }`}>
                                    {comment.positiveOrNegative === 'Positive' ? (
                                      <TrendingUp className="w-4 h-4 text-white" />
                                    ) : comment.positiveOrNegative === 'Negative' ? (
                                      <TrendingDown className="w-4 h-4 text-white" />
                                    ) : (
                                      <Minus className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                  <div>
                                    <p className={`text-sm font-medium ${
                                      comment.positiveOrNegative === 'Positive'
                                        ? 'text-emerald-800'
                                        : comment.positiveOrNegative === 'Negative'
                                        ? 'text-red-800'
                                        : 'text-gray-700'
                                    }`}>
                                      {comment.commentaryText}
                                    </p>
                                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded ${
                                      comment.positiveOrNegative === 'Positive'
                                        ? 'bg-emerald-200 text-emerald-700'
                                        : comment.positiveOrNegative === 'Negative'
                                        ? 'bg-red-200 text-red-700'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {comment.positiveOrNegative}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {/* Rating Percentiles */}
                            {(reportData.ratingPercentiles.usPercentile || reportData.ratingPercentiles.industryPercentile) && (
                              <div className="mt-6 pt-4 border-t border-gray-200">
                                <h6 className="font-semibold text-gray-700 mb-3">Rating Percentiles</h6>
                                <div className="grid sm:grid-cols-2 gap-4">
                                  {reportData.ratingPercentiles.usPercentile && (
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                      <p className="text-xs text-blue-600 uppercase tracking-wide mb-1">US Percentile</p>
                                      <p className="text-2xl font-bold text-blue-700">
                                        {reportData.ratingPercentiles.usPercentile.percentile?.toFixed(2)}%
                                      </p>
                                      <p className="text-xs text-blue-500">Better than {reportData.ratingPercentiles.usPercentile.percentile?.toFixed(1)}% of US companies</p>
                                    </div>
                                  )}
                                  {reportData.ratingPercentiles.industryPercentile && (
                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                      <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">Industry Percentile</p>
                                      <p className="text-2xl font-bold text-purple-700">
                                        {reportData.ratingPercentiles.industryPercentile.percentile?.toFixed(2)}%
                                      </p>
                                      <p className="text-xs text-purple-500">
                                        SIC: {reportData.ratingPercentiles.industryPercentile.sicCode}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </ExpandableSection>
                      )}

                      {/* Branch Offices */}
                      {reportData.branchOffices && reportData.branchOffices.length > 0 && (
                        <ExpandableSection
                          title="Branch Offices & Registrations"
                          icon={Building2}
                          badge={reportData.branchOffices.length}
                          badgeColor="bg-purple-100 text-purple-700"
                        >
                          <div className="grid sm:grid-cols-2 gap-4">
                            {reportData.branchOffices.map((branch: any, index: number) => (
                              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-purple-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{branch.name}</p>
                                    <p className="text-sm text-gray-500">{branch.address?.simpleValue}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                        {branch.branchType}
                                      </span>
                                      {branch.safeNumber && (
                                        <span className="text-xs text-gray-400">ID: {branch.safeNumber}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ExpandableSection>
                      )}

                      {/* Additional Information */}
                      <ExpandableSection
                        title="Business Details"
                        icon={Info}
                      >
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {reportData.employeeCount && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <Users className="w-6 h-6 text-blue-500 mb-2" />
                              <p className="text-sm text-gray-500">Number of Employees</p>
                              <p className="text-xl font-bold text-gray-900">
                                {reportData.employeeCount}
                              </p>
                            </div>
                          )}
                          {(reportData.basic.companyRegistrationDate || reportData.miscInfo.establishmentDate) && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <Calendar className="w-6 h-6 text-purple-500 mb-2" />
                              <p className="text-sm text-gray-500">Established</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatDate(reportData.basic.companyRegistrationDate || reportData.miscInfo.establishmentDate)}
                              </p>
                            </div>
                          )}
                          {(reportData.basic.legalForm || reportData.miscInfo.locationType) && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <Building className="w-6 h-6 text-emerald-500 mb-2" />
                              <p className="text-sm text-gray-500">Legal Form / Location</p>
                              <p className="text-xl font-bold text-gray-900">
                                {reportData.basic.legalForm?.description || reportData.basic.legalForm || reportData.miscInfo.locationType || 'N/A'}
                              </p>
                            </div>
                          )}
                          {reportData.miscInfo.yearsInBusiness && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <Clock className="w-6 h-6 text-amber-500 mb-2" />
                              <p className="text-sm text-gray-500">Years in Business</p>
                              <p className="text-xl font-bold text-gray-900">
                                {reportData.miscInfo.yearsInBusiness}
                              </p>
                            </div>
                          )}
                          {reportData.miscInfo.salesRange && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <DollarSign className="w-6 h-6 text-green-500 mb-2" />
                              <p className="text-sm text-gray-500">Sales Range</p>
                              <p className="text-xl font-bold text-gray-900">
                                {reportData.miscInfo.salesRange}
                              </p>
                            </div>
                          )}
                          {reportData.ratingCommentary.yearBusinessStarted && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <Calendar className="w-6 h-6 text-indigo-500 mb-2" />
                              <p className="text-sm text-gray-500">Year Started</p>
                              <p className="text-xl font-bold text-gray-900">
                                {reportData.ratingCommentary.yearBusinessStarted}
                              </p>
                            </div>
                          )}
                          {reportData.otherInfo.bankers && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <Landmark className="w-6 h-6 text-amber-500 mb-2" />
                              <p className="text-sm text-gray-500">Bankers</p>
                              <p className="text-xl font-bold text-gray-900">
                                {Array.isArray(reportData.otherInfo.bankers)
                                  ? reportData.otherInfo.bankers.join(', ')
                                  : reportData.otherInfo.bankers}
                              </p>
                            </div>
                          )}
                          {reportData.contactInfo.websites && reportData.contactInfo.websites.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-5">
                              <Globe className="w-6 h-6 text-blue-500 mb-2" />
                              <p className="text-sm text-gray-500">Website</p>
                              <a
                                href={`https://${reportData.contactInfo.websites[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                              >
                                {reportData.contactInfo.websites[0]}
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Corporate Record Info */}
                        {reportData.primaryCorporateRecord.businessLegalName && (
                          <div className="mt-6 pt-4 border-t border-gray-200">
                            <h6 className="font-semibold text-gray-700 mb-3">Corporate Record</h6>
                            <div className="bg-gray-50 rounded-xl p-4">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Legal Name</p>
                                  <p className="font-medium text-gray-900">{reportData.primaryCorporateRecord.businessLegalName}</p>
                                </div>
                                {reportData.primaryCorporateRecord.sosCharterNumber && (
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">SOS Charter #</p>
                                    <p className="font-medium text-gray-900">{reportData.primaryCorporateRecord.sosCharterNumber}</p>
                                  </div>
                                )}
                                {reportData.primaryCorporateRecord.incorporatedState && (
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Incorporated State</p>
                                    <p className="font-medium text-gray-900">{reportData.primaryCorporateRecord.incorporatedState}</p>
                                  </div>
                                )}
                                {reportData.primaryCorporateRecord.status && (
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                                    <span className={`inline-block px-2 py-0.5 rounded text-sm font-medium ${
                                      reportData.primaryCorporateRecord.status === 'Active'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}>
                                      {reportData.primaryCorporateRecord.status}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </ExpandableSection>
                    </div>

                    {/* Report Footer */}
                    <motion.div
                      className="bg-gray-50 rounded-2xl p-6 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Report generated via Creditsafe Connect API</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Data is updated regularly. Last refresh: {new Date().toLocaleString()}
                      </p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-200/50 p-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Company</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Search for a company and select it from the results to view their comprehensive credit report including financials, directors, legal history, and more.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminCreditsafePage
