import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Fuel,
  Shield,
  Users,
  Truck,
  FileText,
  ArrowRight,
  CheckCircle,
  Search,
  Loader2,
  Building2,
  MapPin,
  Phone,
  AlertTriangle,
  XCircle,
  Hash,
  ShieldCheck,
  TruckIcon,
  Clock,
  Mail,
  Globe,
  Calendar,
  Activity,
  BarChart3,
  AlertCircle,
  BadgeCheck,
  CircleDot,
  Boxes,
  Scale,
  FileWarning,
  Car,
  Gauge,
  ExternalLink,
  Download,
  Share2,
  Printer,
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
  Award,
  History,
  Bell,
  RefreshCw
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

// FMCSA API types - comprehensive
interface FMCSACarrier {
  legalName: string
  dbaName: string
  dotNumber: string
  mcNumber: string
  phyStreet: string
  phyCity: string
  phyState: string
  phyZipcode: string
  phyCountry: string
  phone: string
  fax: string
  emailAddress: string
  mailingStreet: string
  mailingCity: string
  mailingState: string
  mailingZipcode: string
  mailingCountry: string
  statusCode: string
  allowedToOperate: string
  commonAuthorityStatus: string
  contractAuthorityStatus: string
  brokerAuthorityStatus: string
  bipdInsuranceRequired: string
  bipdInsuranceOnFile: string
  cargoInsuranceRequired: string
  cargoInsuranceOnFile: string
  bondInsuranceRequired: string
  bondInsuranceOnFile: string
  bipdRequiredAmount: string
  cargoRequiredAmount: string
  bondRequiredAmount: string
  totalPowerUnits: number
  totalDrivers: number
  safetyRating: string
  safetyRatingDate: string
  safetyReviewDate: string
  safetyReviewType: string
  oosDate: string
  mcs150FormDate: string
  mcs150Mileage: number
  mcs150MileageYear: string
  addDate: string
  carrierOperation: string[]
  cargoCarried: string[]
  hazmatCarrier: string
  pcCarrier: string
  hhgCarrier: string
  passengerCarrier: string
  crashTotal: number
  fatalCrash: number
  injuryCrash: number
  towCrash: number
  driverInsp: number
  driverOosInsp: number
  driverOosRate: number
  vehicleInsp: number
  vehicleOosInsp: number
  vehicleOosRate: number
  hazmatInsp: number
  hazmatOosInsp: number
  hazmatOosRate: number
  unsafeDrivingBasic: number
  hoursOfServiceBasic: number
  driverFitnessBasic: number
  controlledSubstancesBasic: number
  vehicleMaintenanceBasic: number
  hazmatBasic: number
  crashIndicatorBasic: number
}

// Authority History types
interface AuthorityHistory {
  docketNumber: string
  prefix: string
  docketNumberId: number
  carrierOperationCode: string
  carrierOperationDesc: string
  commonAuthorityStatusDesc: string
  contractAuthorityStatusDesc: string
  brokerAuthorityStatusDesc: string
  commonAuthorityGrantDate: string
  commonAuthorityEffectiveDate: string
  contractAuthorityGrantDate: string
  contractAuthorityEffectiveDate: string
  brokerAuthorityGrantDate: string
  brokerAuthorityEffectiveDate: string
  commonAuthorityApplicationPendingText: string
  contractAuthorityApplicationPendingText: string
  brokerAuthorityApplicationPendingText: string
  commonAuthorityRevokedDate: string
  contractAuthorityRevokedDate: string
  brokerAuthorityRevokedDate: string
  commonAuthorityReinstatedDate: string
  contractAuthorityReinstatedDate: string
  brokerAuthorityReinstatedDate: string
}

// Insurance History types
interface InsuranceHistory {
  dotNumber: string
  insuranceType: string
  insuranceTypeDesc: string
  policyNumber: string
  insurerName: string
  postedDate: string
  effectiveDate: string
  cancellationDate: string
  coverageFrom: string
  coverageTo: string
  bipdCodeDesc: string
}

const ServicesPage = () => {
  const [mcNumber, setMcNumber] = useState('')
  const [dotNumber, setDotNumber] = useState('')
  const [searchType, setSearchType] = useState<'mc' | 'dot'>('mc')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [carrierData, setCarrierData] = useState<FMCSACarrier | null>(null)
  const [authorityHistory, setAuthorityHistory] = useState<AuthorityHistory[]>([])
  const [insuranceHistory, setInsuranceHistory] = useState<InsuranceHistory[]>([])
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    authority: true,
    authorityHistory: true,
    operations: true,
    safety: true,
    insurance: true,
    insuranceHistory: false,
    inspections: true,
    crashes: true
  })

  const FMCSA_API_KEY = '7ac73313fb4ddad3948ebb1a0ef6ccebed130f8b'

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const fetchCarrierData = async () => {
    const searchValue = searchType === 'mc' ? mcNumber : dotNumber
    if (!searchValue.trim()) {
      setError(`Please enter a ${searchType === 'mc' ? 'MC' : 'DOT'} number`)
      return
    }

    setIsLoading(true)
    setError(null)
    setCarrierData(null)
    setAuthorityHistory([])
    setInsuranceHistory([])

    try {
      const cleanNumber = searchValue.replace(/^(MC|DOT)[-\s]*/i, '').trim()

      let url = ''
      if (searchType === 'mc') {
        url = `https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number/${cleanNumber}?webKey=${FMCSA_API_KEY}`
      } else {
        url = `https://mobile.fmcsa.dot.gov/qc/services/carriers/${cleanNumber}?webKey=${FMCSA_API_KEY}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Carrier not found')
      }

      const data = await response.json()

      if (data.content && data.content.length > 0) {
        const carrier = data.content[0].carrier
        setCarrierData(carrier)

        // Fetch authority history using DOT number
        const dotNum = carrier.dotNumber
        if (dotNum) {
          // Fetch Authority History (docket info)
          try {
            const authorityResponse = await fetch(
              `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dotNum}/authority?webKey=${FMCSA_API_KEY}`
            )
            if (authorityResponse.ok) {
              const authorityData = await authorityResponse.json()
              if (authorityData.content) {
                setAuthorityHistory(authorityData.content)
              }
            }
          } catch (e) {
            console.log('Could not fetch authority history')
          }

          // Fetch Insurance History
          try {
            const insuranceResponse = await fetch(
              `https://mobile.fmcsa.dot.gov/qc/services/carriers/${dotNum}/insurance?webKey=${FMCSA_API_KEY}`
            )
            if (insuranceResponse.ok) {
              const insuranceData = await insuranceResponse.json()
              if (insuranceData.content) {
                setInsuranceHistory(insuranceData.content)
              }
            }
          } catch (e) {
            console.log('Could not fetch insurance history')
          }
        }
      } else {
        setError(`No carrier found with this ${searchType === 'mc' ? 'MC' : 'DOT'} number`)
      }
    } catch (err) {
      setError('Unable to find carrier. Please check the number and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchCarrierData()
    }
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
          <CheckCircle className="w-4 h-4" />
          {status || 'Active'}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200">
        <XCircle className="w-4 h-4" />
        {status || 'Not Active'}
      </span>
    )
  }

  const getAuthorityBadge = (status: string) => {
    const isActive = status === 'A' || status === 'ACTIVE'
    if (isActive) {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">Active</span>
    }
    if (status === 'N' || status === 'NONE' || !status) {
      return <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">None</span>
    }
    return <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">{status}</span>
  }

  const getSafetyRatingBadge = (rating: string) => {
    if (!rating || rating === 'None' || rating === 'Not Rated') {
      return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">Not Rated</span>
    }
    if (rating === 'Satisfactory') {
      return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">Satisfactory</span>
    }
    if (rating === 'Conditional') {
      return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">Conditional</span>
    }
    if (rating === 'Unsatisfactory') {
      return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700">Unsatisfactory</span>
    }
    return <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600">{rating}</span>
  }

  const getOOSRateColor = (rate: number) => {
    if (rate <= 5) return 'text-green-600'
    if (rate <= 15) return 'text-yellow-600'
    if (rate <= 25) return 'text-orange-600'
    return 'text-red-600'
  }

  const getOOSRateBg = (rate: number) => {
    if (rate <= 5) return 'bg-green-500'
    if (rate <= 15) return 'bg-yellow-500'
    if (rate <= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getBASICScoreColor = (score: number) => {
    if (!score || score === 0) return { bg: 'bg-gray-200', text: 'text-gray-500', label: 'No Data' }
    if (score <= 25) return { bg: 'bg-green-500', text: 'text-green-700', label: 'Good' }
    if (score <= 50) return { bg: 'bg-yellow-500', text: 'text-yellow-700', label: 'Fair' }
    if (score <= 75) return { bg: 'bg-orange-500', text: 'text-orange-700', label: 'Poor' }
    return { bg: 'bg-red-500', text: 'text-red-700', label: 'Critical' }
  }

  const services = [
    {
      icon: Fuel,
      title: 'Fuel Program',
      description: 'Maximize your savings with our exclusive fuel discount network. Access discounts at all major truck stops nationwide.',
      link: '/services/fuel-program',
      features: ['Up to $0.75/gallon savings', 'All major truck stops', 'No fees or minimums']
    },
    {
      icon: Shield,
      title: 'Safety Services',
      description: 'Stay compliant and protect your business with comprehensive DOT safety compliance and risk management solutions.',
      link: '/services/safety',
      features: ['DOT compliance', 'Driver qualification files', 'Mock audits']
    },
    {
      icon: Users,
      title: 'Recruiting Services',
      description: 'Find qualified drivers faster with our full-service recruiting solutions designed for motor carriers.',
      link: '/services/recruiting',
      features: ['Driver sourcing', 'Screening & verification', 'Onboarding support']
    },
    {
      icon: Truck,
      title: 'Dispatch Services',
      description: 'Professional dispatch services to keep your trucks moving and your revenue growing.',
      link: '/services/dispatch',
      features: ['24/7 dispatch support', 'Load optimization', 'Rate negotiation']
    },
    {
      icon: FileText,
      title: 'Admin Services',
      description: 'Streamline your back office with our comprehensive administrative support services.',
      link: '/services/admin',
      features: ['Invoicing & billing', 'Document management', 'IFTA/IRP filing']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Carrier Search Focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              Free FMCSA Carrier Lookup Tool
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Carrier Snapshot
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Search Tool
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Instantly access comprehensive FMCSA carrier data including safety records,
              authority status, insurance, inspections, and more.
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <Card className="p-6 shadow-2xl">
                {/* Search Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSearchType('mc')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                      searchType === 'mc'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Hash className="w-4 h-4 inline mr-2" />
                    MC Number
                  </button>
                  <button
                    onClick={() => setSearchType('dot')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                      searchType === 'dot'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Hash className="w-4 h-4 inline mr-2" />
                    DOT Number
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder={searchType === 'mc' ? 'Enter MC Number (e.g., 123456)' : 'Enter DOT Number (e.g., 1234567)'}
                      value={searchType === 'mc' ? mcNumber : dotNumber}
                      onChange={(e) => searchType === 'mc' ? setMcNumber(e.target.value) : setDotNumber(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-lg pl-4 pr-4 py-3"
                    />
                  </div>
                  <Button
                    onClick={fetchCarrierData}
                    disabled={isLoading}
                    size="lg"
                    className="min-w-[160px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Examples */}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span>Try:</span>
                  <button
                    onClick={() => { setSearchType('mc'); setMcNumber('384859'); }}
                    className="text-indigo-600 hover:underline"
                  >
                    MC-384859
                  </button>
                  <button
                    onClick={() => { setSearchType('dot'); setDotNumber('2213110'); }}
                    className="text-indigo-600 hover:underline"
                  >
                    DOT-2213110
                  </button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carrier Results */}
        <AnimatePresence>
          {carrierData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Main Header Card */}
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 -m-6 mb-6 p-6 text-white">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                          <Building2 className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl lg:text-3xl font-bold">{carrierData.legalName}</h2>
                          {carrierData.dbaName && carrierData.dbaName !== carrierData.legalName && (
                            <p className="text-indigo-200">DBA: {carrierData.dbaName}</p>
                          )}
                        </div>
                      </div>

                      {/* ID Numbers */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                          <Hash className="w-4 h-4 text-indigo-200" />
                          <span className="text-indigo-200">MC:</span>
                          <span className="font-bold">{carrierData.mcNumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                          <Hash className="w-4 h-4 text-indigo-200" />
                          <span className="text-indigo-200">DOT:</span>
                          <span className="font-bold">{carrierData.dotNumber || 'N/A'}</span>
                        </div>
                        {carrierData.addDate && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                            <Calendar className="w-4 h-4 text-indigo-200" />
                            <span className="text-indigo-200">Since:</span>
                            <span className="font-bold">{carrierData.addDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      {getStatusBadge(carrierData.statusCode, carrierData.allowedToOperate === 'Y')}
                      {carrierData.oosDate && (
                        <span className="text-sm text-red-200">
                          OOS Date: {carrierData.oosDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-center">
                    <TruckIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{carrierData.totalPowerUnits || 0}</p>
                    <p className="text-sm text-gray-600">Power Units</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                    <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{carrierData.totalDrivers || 0}</p>
                    <p className="text-sm text-gray-600">Drivers</p>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 text-center">
                    <ShieldCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="mt-1">{getSafetyRatingBadge(carrierData.safetyRating)}</div>
                    <p className="text-sm text-gray-600 mt-1">Safety Rating</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{carrierData.crashTotal || 0}</p>
                    <p className="text-sm text-gray-600">Crashes (24mo)</p>
                  </div>
                  <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-100 text-center">
                    <FileText className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-gray-900">{(carrierData.driverInsp || 0) + (carrierData.vehicleInsp || 0)}</p>
                    <p className="text-sm text-gray-600">Inspections</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
                  <a
                    href={`https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${carrierData.dotNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on SAFER
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    Print Report
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </Card>

              {/* Two Column Layout */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Contact & Location */}
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      Contact & Location
                    </h3>

                    <div className="space-y-4">
                      {/* Physical Address */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500 mb-1">Physical Address</p>
                        <p className="font-medium text-gray-900">
                          {carrierData.phyStreet}<br />
                          {carrierData.phyCity}, {carrierData.phyState} {carrierData.phyZipcode}
                          {carrierData.phyCountry && carrierData.phyCountry !== 'US' && <>, {carrierData.phyCountry}</>}
                        </p>
                      </div>

                      {/* Mailing Address */}
                      {carrierData.mailingStreet && carrierData.mailingStreet !== carrierData.phyStreet && (
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">Mailing Address</p>
                          <p className="font-medium text-gray-900">
                            {carrierData.mailingStreet}<br />
                            {carrierData.mailingCity}, {carrierData.mailingState} {carrierData.mailingZipcode}
                          </p>
                        </div>
                      )}

                      {/* Contact Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {carrierData.phone && (
                          <a href={`tel:${carrierData.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="font-medium text-gray-900">{carrierData.phone}</p>
                            </div>
                          </a>
                        )}
                        {carrierData.fax && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Fax</p>
                              <p className="font-medium text-gray-900">{carrierData.fax}</p>
                            </div>
                          </div>
                        )}
                        {carrierData.emailAddress && (
                          <a href={`mailto:${carrierData.emailAddress}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors sm:col-span-2">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="font-medium text-gray-900">{carrierData.emailAddress}</p>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Operating Authority */}
                  <Card>
                    <button
                      onClick={() => toggleSection('authority')}
                      className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                    >
                      <span className="flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5 text-indigo-600" />
                        Operating Authority
                      </span>
                      {expandedSections.authority ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {expandedSections.authority && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Common Authority</span>
                          </div>
                          {getAuthorityBadge(carrierData.commonAuthorityStatus)}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Contract Authority</span>
                          </div>
                          {getAuthorityBadge(carrierData.contractAuthorityStatus)}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Scale className="w-5 h-5 text-gray-500" />
                            <span className="text-gray-700">Broker Authority</span>
                          </div>
                          {getAuthorityBadge(carrierData.brokerAuthorityStatus)}
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Authority History / Timeline */}
                  {authorityHistory.length > 0 && (
                    <Card>
                      <button
                        onClick={() => toggleSection('authorityHistory')}
                        className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                      >
                        <span className="flex items-center gap-2">
                          <History className="w-5 h-5 text-indigo-600" />
                          Authority Timeline
                        </span>
                        {expandedSections.authorityHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      {expandedSections.authorityHistory && (
                        <div className="space-y-4">
                          {authorityHistory.map((auth, index) => (
                            <div key={index} className="relative pl-6 border-l-2 border-indigo-200 pb-4 last:pb-0">
                              {/* Timeline dot */}
                              <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white" />

                              <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                    {auth.prefix}-{auth.docketNumber}
                                  </span>
                                  {auth.carrierOperationDesc && (
                                    <span className="text-sm text-gray-600">{auth.carrierOperationDesc}</span>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  {/* Common Authority */}
                                  {(auth.commonAuthorityGrantDate || auth.commonAuthorityStatusDesc) && (
                                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900 flex items-center gap-2">
                                          <Truck className="w-4 h-4 text-gray-500" />
                                          Common Authority
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                          auth.commonAuthorityStatusDesc?.includes('ACTIVE') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {auth.commonAuthorityStatusDesc || 'N/A'}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        {auth.commonAuthorityGrantDate && (
                                          <div>
                                            <span className="text-gray-500">Granted: </span>
                                            <span className="font-medium text-green-600">{auth.commonAuthorityGrantDate}</span>
                                          </div>
                                        )}
                                        {auth.commonAuthorityEffectiveDate && (
                                          <div>
                                            <span className="text-gray-500">Effective: </span>
                                            <span className="font-medium">{auth.commonAuthorityEffectiveDate}</span>
                                          </div>
                                        )}
                                        {auth.commonAuthorityReinstatedDate && (
                                          <div className="col-span-2">
                                            <span className="text-gray-500">Reinstated: </span>
                                            <span className="font-medium text-blue-600 flex items-center gap-1">
                                              <RefreshCw className="w-3 h-3" />
                                              {auth.commonAuthorityReinstatedDate}
                                            </span>
                                          </div>
                                        )}
                                        {auth.commonAuthorityRevokedDate && (
                                          <div className="col-span-2">
                                            <span className="text-gray-500">Revoked: </span>
                                            <span className="font-medium text-red-600">{auth.commonAuthorityRevokedDate}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Contract Authority */}
                                  {(auth.contractAuthorityGrantDate || auth.contractAuthorityStatusDesc) && (
                                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900 flex items-center gap-2">
                                          <FileText className="w-4 h-4 text-gray-500" />
                                          Contract Authority
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                          auth.contractAuthorityStatusDesc?.includes('ACTIVE') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {auth.contractAuthorityStatusDesc || 'N/A'}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        {auth.contractAuthorityGrantDate && (
                                          <div>
                                            <span className="text-gray-500">Granted: </span>
                                            <span className="font-medium text-green-600">{auth.contractAuthorityGrantDate}</span>
                                          </div>
                                        )}
                                        {auth.contractAuthorityEffectiveDate && (
                                          <div>
                                            <span className="text-gray-500">Effective: </span>
                                            <span className="font-medium">{auth.contractAuthorityEffectiveDate}</span>
                                          </div>
                                        )}
                                        {auth.contractAuthorityReinstatedDate && (
                                          <div className="col-span-2">
                                            <span className="text-gray-500">Reinstated: </span>
                                            <span className="font-medium text-blue-600 flex items-center gap-1">
                                              <RefreshCw className="w-3 h-3" />
                                              {auth.contractAuthorityReinstatedDate}
                                            </span>
                                          </div>
                                        )}
                                        {auth.contractAuthorityRevokedDate && (
                                          <div className="col-span-2">
                                            <span className="text-gray-500">Revoked: </span>
                                            <span className="font-medium text-red-600">{auth.contractAuthorityRevokedDate}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Broker Authority */}
                                  {(auth.brokerAuthorityGrantDate || auth.brokerAuthorityStatusDesc) && (
                                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900 flex items-center gap-2">
                                          <Scale className="w-4 h-4 text-gray-500" />
                                          Broker Authority
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                          auth.brokerAuthorityStatusDesc?.includes('ACTIVE') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          {auth.brokerAuthorityStatusDesc || 'N/A'}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        {auth.brokerAuthorityGrantDate && (
                                          <div>
                                            <span className="text-gray-500">Granted: </span>
                                            <span className="font-medium text-green-600">{auth.brokerAuthorityGrantDate}</span>
                                          </div>
                                        )}
                                        {auth.brokerAuthorityEffectiveDate && (
                                          <div>
                                            <span className="text-gray-500">Effective: </span>
                                            <span className="font-medium">{auth.brokerAuthorityEffectiveDate}</span>
                                          </div>
                                        )}
                                        {auth.brokerAuthorityReinstatedDate && (
                                          <div className="col-span-2">
                                            <span className="text-gray-500">Reinstated: </span>
                                            <span className="font-medium text-blue-600 flex items-center gap-1">
                                              <RefreshCw className="w-3 h-3" />
                                              {auth.brokerAuthorityReinstatedDate}
                                            </span>
                                          </div>
                                        )}
                                        {auth.brokerAuthorityRevokedDate && (
                                          <div className="col-span-2">
                                            <span className="text-gray-500">Revoked: </span>
                                            <span className="font-medium text-red-600">{auth.brokerAuthorityRevokedDate}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Insurance Coverage */}
                  <Card>
                    <button
                      onClick={() => toggleSection('insurance')}
                      className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-indigo-600" />
                        Insurance Coverage
                      </span>
                      {expandedSections.insurance ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {expandedSections.insurance && (
                      <div className="space-y-3">
                        {/* BIPD */}
                        <div className="p-4 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">BIPD Insurance</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              carrierData.bipdInsuranceOnFile === 'Y' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {carrierData.bipdInsuranceOnFile === 'Y' ? 'On File' : 'Not on File'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Required</span>
                            <span className="text-gray-700">
                              {carrierData.bipdInsuranceRequired === 'Y' ?
                                (carrierData.bipdRequiredAmount ? `$${parseInt(carrierData.bipdRequiredAmount).toLocaleString()}` : 'Yes')
                                : 'No'}
                            </span>
                          </div>
                        </div>

                        {/* Cargo */}
                        <div className="p-4 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Cargo Insurance</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              carrierData.cargoInsuranceOnFile === 'Y' ? 'bg-green-100 text-green-700' :
                              carrierData.cargoInsuranceRequired === 'Y' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {carrierData.cargoInsuranceOnFile === 'Y' ? 'On File' :
                               carrierData.cargoInsuranceRequired === 'Y' ? 'Required - Not on File' : 'Not Required'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Required</span>
                            <span className="text-gray-700">
                              {carrierData.cargoInsuranceRequired === 'Y' ?
                                (carrierData.cargoRequiredAmount ? `$${parseInt(carrierData.cargoRequiredAmount).toLocaleString()}` : 'Yes')
                                : 'No'}
                            </span>
                          </div>
                        </div>

                        {/* Bond */}
                        <div className="p-4 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">Bond/Trust</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              carrierData.bondInsuranceOnFile === 'Y' ? 'bg-green-100 text-green-700' :
                              carrierData.bondInsuranceRequired === 'Y' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {carrierData.bondInsuranceOnFile === 'Y' ? 'On File' :
                               carrierData.bondInsuranceRequired === 'Y' ? 'Required - Not on File' : 'Not Required'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Required</span>
                            <span className="text-gray-700">
                              {carrierData.bondInsuranceRequired === 'Y' ?
                                (carrierData.bondRequiredAmount ? `$${parseInt(carrierData.bondRequiredAmount).toLocaleString()}` : 'Yes')
                                : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Insurance History */}
                  {insuranceHistory.length > 0 && (
                    <Card>
                      <button
                        onClick={() => toggleSection('insuranceHistory')}
                        className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                      >
                        <span className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-indigo-600" />
                          Insurance History
                          {insuranceHistory.some(ins => ins.cancellationDate && new Date(ins.cancellationDate) > new Date()) && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full animate-pulse">
                              Pending Cancellation
                            </span>
                          )}
                        </span>
                        {expandedSections.insuranceHistory ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>

                      {expandedSections.insuranceHistory && (
                        <div className="space-y-3">
                          {/* Pending Cancellations Warning */}
                          {insuranceHistory.filter(ins => ins.cancellationDate && new Date(ins.cancellationDate) > new Date()).length > 0 && (
                            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-red-800">Insurance Pending Cancellation</p>
                                  <p className="text-sm text-red-600 mt-1">
                                    One or more insurance policies have pending cancellation dates. Review the details below.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Insurance Records */}
                          <div className="max-h-96 overflow-y-auto space-y-2">
                            {insuranceHistory.slice(0, 20).map((ins, index) => {
                              const hasPendingCancellation = ins.cancellationDate && new Date(ins.cancellationDate) > new Date()
                              const isCancelled = ins.cancellationDate && new Date(ins.cancellationDate) <= new Date()

                              return (
                                <div
                                  key={index}
                                  className={`p-3 rounded-lg border ${
                                    hasPendingCancellation
                                      ? 'bg-red-50 border-red-200'
                                      : isCancelled
                                        ? 'bg-gray-50 border-gray-200 opacity-75'
                                        : 'bg-green-50 border-green-200'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex-1">
                                      <span className="font-medium text-gray-900 text-sm">
                                        {ins.insurerName || 'Unknown Insurer'}
                                      </span>
                                      <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                                        hasPendingCancellation
                                          ? 'bg-red-100 text-red-700'
                                          : isCancelled
                                            ? 'bg-gray-200 text-gray-600'
                                            : 'bg-green-100 text-green-700'
                                      }`}>
                                        {hasPendingCancellation ? 'Pending Cancellation' : isCancelled ? 'Cancelled' : 'Active'}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {ins.insuranceTypeDesc || ins.insuranceType}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                    {ins.policyNumber && (
                                      <div>
                                        <span className="text-gray-500">Policy: </span>
                                        <span className="text-gray-700">{ins.policyNumber}</span>
                                      </div>
                                    )}
                                    {ins.effectiveDate && (
                                      <div>
                                        <span className="text-gray-500">Effective: </span>
                                        <span className="text-gray-700">{ins.effectiveDate}</span>
                                      </div>
                                    )}
                                    {ins.postedDate && (
                                      <div>
                                        <span className="text-gray-500">Posted: </span>
                                        <span className="text-gray-700">{ins.postedDate}</span>
                                      </div>
                                    )}
                                    {ins.cancellationDate && (
                                      <div>
                                        <span className="text-gray-500">Cancellation: </span>
                                        <span className={`font-medium ${hasPendingCancellation ? 'text-red-600' : 'text-gray-700'}`}>
                                          {ins.cancellationDate}
                                        </span>
                                      </div>
                                    )}
                                    {(ins.coverageFrom || ins.coverageTo) && (
                                      <div className="col-span-2">
                                        <span className="text-gray-500">Coverage: </span>
                                        <span className="text-gray-700">
                                          ${parseInt(ins.coverageFrom || '0').toLocaleString()} - ${parseInt(ins.coverageTo || '0').toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {insuranceHistory.length > 20 && (
                            <p className="text-xs text-gray-500 text-center mt-2">
                              Showing first 20 of {insuranceHistory.length} insurance records
                            </p>
                          )}
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Operation Classification */}
                  <Card>
                    <button
                      onClick={() => toggleSection('operations')}
                      className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                    >
                      <span className="flex items-center gap-2">
                        <Boxes className="w-5 h-5 text-indigo-600" />
                        Operation Classification
                      </span>
                      {expandedSections.operations ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {expandedSections.operations && (
                      <div className="space-y-4">
                        {/* Operation Types */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className={`p-3 rounded-xl border ${carrierData.hazmatCarrier === 'Y' ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className={`w-5 h-5 ${carrierData.hazmatCarrier === 'Y' ? 'text-orange-600' : 'text-gray-400'}`} />
                              <span className="text-sm font-medium text-gray-700">Hazmat</span>
                            </div>
                            <p className={`text-xs mt-1 ${carrierData.hazmatCarrier === 'Y' ? 'text-orange-600' : 'text-gray-500'}`}>
                              {carrierData.hazmatCarrier === 'Y' ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${carrierData.passengerCarrier === 'Y' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                              <Users className={`w-5 h-5 ${carrierData.passengerCarrier === 'Y' ? 'text-blue-600' : 'text-gray-400'}`} />
                              <span className="text-sm font-medium text-gray-700">Passenger</span>
                            </div>
                            <p className={`text-xs mt-1 ${carrierData.passengerCarrier === 'Y' ? 'text-blue-600' : 'text-gray-500'}`}>
                              {carrierData.passengerCarrier === 'Y' ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${carrierData.hhgCarrier === 'Y' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                              <Boxes className={`w-5 h-5 ${carrierData.hhgCarrier === 'Y' ? 'text-green-600' : 'text-gray-400'}`} />
                              <span className="text-sm font-medium text-gray-700">HHG</span>
                            </div>
                            <p className={`text-xs mt-1 ${carrierData.hhgCarrier === 'Y' ? 'text-green-600' : 'text-gray-500'}`}>
                              {carrierData.hhgCarrier === 'Y' ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div className={`p-3 rounded-xl border ${carrierData.pcCarrier === 'Y' ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center gap-2">
                              <Car className={`w-5 h-5 ${carrierData.pcCarrier === 'Y' ? 'text-purple-600' : 'text-gray-400'}`} />
                              <span className="text-sm font-medium text-gray-700">Private</span>
                            </div>
                            <p className={`text-xs mt-1 ${carrierData.pcCarrier === 'Y' ? 'text-purple-600' : 'text-gray-500'}`}>
                              {carrierData.pcCarrier === 'Y' ? 'Yes' : 'No'}
                            </p>
                          </div>
                        </div>

                        {/* Carrier Operations */}
                        {carrierData.carrierOperation && carrierData.carrierOperation.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Carrier Operations</p>
                            <div className="flex flex-wrap gap-2">
                              {carrierData.carrierOperation.map((op, i) => (
                                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100">
                                  {op}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Cargo Carried */}
                        {carrierData.cargoCarried && carrierData.cargoCarried.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Cargo Carried</p>
                            <div className="flex flex-wrap gap-2">
                              {carrierData.cargoCarried.map((cargo, i) => (
                                <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200">
                                  {cargo}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Safety Record */}
                  <Card>
                    <button
                      onClick={() => toggleSection('safety')}
                      className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-600" />
                        Safety Record
                      </span>
                      {expandedSections.safety ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {expandedSections.safety && (
                      <div className="space-y-4">
                        {/* Safety Rating */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Safety Rating</p>
                              <div className="mt-1">{getSafetyRatingBadge(carrierData.safetyRating)}</div>
                            </div>
                            {carrierData.safetyRatingDate && (
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Rating Date</p>
                                <p className="font-medium text-gray-900">{carrierData.safetyRatingDate}</p>
                              </div>
                            )}
                          </div>
                          {carrierData.safetyReviewDate && (
                            <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
                              <span className="text-gray-500">Last Review: {carrierData.safetyReviewDate}</span>
                              {carrierData.safetyReviewType && (
                                <span className="text-gray-500">Type: {carrierData.safetyReviewType}</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* BASIC Scores */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-medium text-gray-700">BASIC Scores</p>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Info className="w-3 h-3" />
                              Lower is better
                            </div>
                          </div>
                          <div className="space-y-3">
                            {[
                              { label: 'Unsafe Driving', value: carrierData.unsafeDrivingBasic, icon: Car },
                              { label: 'Hours of Service', value: carrierData.hoursOfServiceBasic, icon: Clock },
                              { label: 'Driver Fitness', value: carrierData.driverFitnessBasic, icon: Users },
                              { label: 'Controlled Substances', value: carrierData.controlledSubstancesBasic, icon: AlertCircle },
                              { label: 'Vehicle Maintenance', value: carrierData.vehicleMaintenanceBasic, icon: Truck },
                              { label: 'Hazmat Compliance', value: carrierData.hazmatBasic, icon: AlertTriangle },
                              { label: 'Crash Indicator', value: carrierData.crashIndicatorBasic, icon: Activity },
                            ].map((item) => {
                              const colors = getBASICScoreColor(item.value)
                              return (
                                <div key={item.label} className="flex items-center gap-3">
                                  <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  <span className="text-sm text-gray-600 w-36 flex-shrink-0">{item.label}</span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${colors.bg}`}
                                      style={{ width: `${Math.min(item.value || 0, 100)}%` }}
                                    />
                                  </div>
                                  <span className={`text-sm font-medium w-16 text-right ${colors.text}`}>
                                    {item.value ? `${item.value}%` : 'N/A'}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                          <p className="text-xs text-gray-400 mt-3">
                            * Scores above 75% may trigger FMCSA intervention
                          </p>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Crash History */}
                  <Card>
                    <button
                      onClick={() => toggleSection('crashes')}
                      className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                    >
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-indigo-600" />
                        Crash History (24 Months)
                      </span>
                      {expandedSections.crashes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {expandedSections.crashes && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center">
                          <p className="text-3xl font-bold text-gray-900">{carrierData.crashTotal || 0}</p>
                          <p className="text-sm text-gray-600">Total Crashes</p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                          <p className="text-3xl font-bold text-red-700">{carrierData.fatalCrash || 0}</p>
                          <p className="text-sm text-red-600">Fatal</p>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-center">
                          <p className="text-3xl font-bold text-orange-700">{carrierData.injuryCrash || 0}</p>
                          <p className="text-sm text-orange-600">Injury</p>
                        </div>
                        <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
                          <p className="text-3xl font-bold text-yellow-700">{carrierData.towCrash || 0}</p>
                          <p className="text-sm text-yellow-600">Tow Away</p>
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Inspection Summary */}
                  <Card>
                    <button
                      onClick={() => toggleSection('inspections')}
                      className="w-full flex items-center justify-between text-lg font-bold text-gray-900 mb-4"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Inspection Summary (24 Months)
                      </span>
                      {expandedSections.inspections ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>

                    {expandedSections.inspections && (
                      <div className="space-y-4">
                        {/* Driver Inspections */}
                        <div className="p-4 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-gray-900">Driver Inspections</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{carrierData.driverInsp || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-500">Out of Service</span>
                            <span className="font-medium text-gray-700">{carrierData.driverOosInsp || 0}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getOOSRateBg(carrierData.driverOosRate || 0)}`}
                                style={{ width: `${Math.min(carrierData.driverOosRate || 0, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getOOSRateColor(carrierData.driverOosRate || 0)}`}>
                              {carrierData.driverOosRate?.toFixed(1) || 0}% OOS
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">National Average: 5.51%</p>
                        </div>

                        {/* Vehicle Inspections */}
                        <div className="p-4 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Truck className="w-5 h-5 text-emerald-600" />
                              <span className="font-medium text-gray-900">Vehicle Inspections</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{carrierData.vehicleInsp || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-500">Out of Service</span>
                            <span className="font-medium text-gray-700">{carrierData.vehicleOosInsp || 0}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getOOSRateBg(carrierData.vehicleOosRate || 0)}`}
                                style={{ width: `${Math.min(carrierData.vehicleOosRate || 0, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${getOOSRateColor(carrierData.vehicleOosRate || 0)}`}>
                              {carrierData.vehicleOosRate?.toFixed(1) || 0}% OOS
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">National Average: 20.72%</p>
                        </div>

                        {/* Hazmat Inspections */}
                        {(carrierData.hazmatInsp > 0 || carrierData.hazmatCarrier === 'Y') && (
                          <div className="p-4 rounded-xl border border-orange-200 bg-orange-50">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                                <span className="font-medium text-gray-900">Hazmat Inspections</span>
                              </div>
                              <span className="text-2xl font-bold text-gray-900">{carrierData.hazmatInsp || 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Out of Service</span>
                              <span className="font-medium text-gray-700">{carrierData.hazmatOosInsp || 0}</span>
                            </div>
                            {carrierData.hazmatOosRate !== undefined && carrierData.hazmatOosRate > 0 && (
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex-1 h-2 bg-orange-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${getOOSRateBg(carrierData.hazmatOosRate)}`}
                                    style={{ width: `${Math.min(carrierData.hazmatOosRate, 100)}%` }}
                                  />
                                </div>
                                <span className={`text-sm font-medium ${getOOSRateColor(carrierData.hazmatOosRate)}`}>
                                  {carrierData.hazmatOosRate.toFixed(1)}% OOS
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Card>

                  {/* MCS-150 Information */}
                  <Card>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      MCS-150 Information
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium text-gray-900">{carrierData.mcs150FormDate || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-500">Mileage Year</p>
                        <p className="font-medium text-gray-900">{carrierData.mcs150MileageYear || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl col-span-2">
                        <p className="text-sm text-gray-500">Reported Mileage</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {carrierData.mcs150Mileage ? carrierData.mcs150Mileage.toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Footer Disclaimer */}
              <Card className="bg-gray-50 border-gray-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      <strong>Disclaimer:</strong> This data is provided by the Federal Motor Carrier Safety Administration (FMCSA) and is refreshed at the time of search.
                      For official records and the most up-to-date information, please visit the{' '}
                      <a
                        href={`https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${carrierData.dotNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        FMCSA SAFER System
                      </a>.
                    </p>
                    <p className="text-gray-500">
                      Data last retrieved: {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State - When No Search */}
        {!carrierData && !error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for a Carrier</h3>
              <p className="text-gray-600 mb-6">
                Enter an MC or DOT number above to view comprehensive carrier information including safety records, authority status, insurance, and more.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Operating Authority
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Safety Ratings
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Insurance Status
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Inspection History
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Crash Data
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  BASIC Scores
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              More Services for Motor Carriers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a successful trucking operation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={service.link}>
                  <Card hover className="h-full group cursor-pointer">
                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                        <service.icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                    <p className="text-gray-500 mb-6">{service.description}</p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          </div>
          <div className="relative text-center py-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Need Help with Compliance?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Our team of experts can help you maintain a clean safety record and stay compliant with FMCSA regulations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="min-w-[200px] bg-white text-indigo-600 hover:bg-gray-100">
                  Get a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <a href="tel:+18778141807">
                <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (877) 814-1807
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default ServicesPage
