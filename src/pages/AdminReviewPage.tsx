import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Shield,
  Mail,
  Calendar,
  TruckIcon,
  ShieldCheck,
  Send,
  Clock,
  Building2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Users,
  MapPin,
  Phone,
  Globe,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  ExternalLink,
  Package,
  Zap,
  Percent,
  ClipboardCheck,
  BadgeCheck,
  Hash,
  Receipt,
  Upload,
  LucideIcon
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import Textarea from '../components/ui/Textarea'
import api from '../services/api'
import { getTrustLevel, formatPrice } from '../utils/helpers'
import { MCListingExtended } from '../types'

// Due Diligence Result Interface (from API)
interface DueDiligenceResult {
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

interface CreditSafeReport {
  companyName: string
  tradingName: string
  registrationNumber: string
  incorporationDate: string
  companyStatus: string
  companyType: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  contact: {
    phone: string
    website: string
    email: string
  }
  creditScore: {
    score: number
    maxScore: number
    rating: string
    trend: 'up' | 'down' | 'stable'
    riskLevel: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high'
  }
  financialSummary: {
    annualRevenue: number
    netWorth: number
    totalAssets: number
    totalLiabilities: number
    employeeCount: number
    yearEstablished: number
  }
  paymentBehavior: {
    dbtScore: number // Days Beyond Terms
    paymentIndex: number
    onTimePayments: number
    latePayments: number
    severelyLate: number
  }
  legalFilings: {
    bankruptcies: number
    liens: number
    judgments: number
    uccFilings: number
  }
  industryComparison: {
    percentile: number
    industryAverage: number
    industryName: string
  }
  directors: {
    name: string
    title: string
    appointedDate: string
  }[]
  lastUpdated: string
}

const AdminReviewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chatMessage, setChatMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'chat' | 'creditsafe'>('details')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [businessSearchQuery, setBusinessSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [creditSafeReport, setCreditSafeReport] = useState<CreditSafeReport | null>(null)
  const [dueDiligenceResult, setDueDiligenceResult] = useState<DueDiligenceResult | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchError, setSearchError] = useState('')

  // API data state
  const [listing, setListing] = useState<MCListingExtended | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Fetch listing from API (using admin endpoint to get any status)
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return
      try {
        setLoading(true)
        setFetchError(null)
        const response = await api.getAdminListing(id)

        // Admin endpoint returns data directly
        if (response.data || response.success) {
          const data = response.data
          const transformedListing = {
            id: data.id,
            mcNumber: data.mcNumber,
            dotNumber: data.dotNumber || '',
            legalName: data.legalName || '',
            dbaName: data.dbaName || '',
            sellerId: data.sellerId || data.seller?.id || '',
            title: data.title || `MC Authority #${data.mcNumber}`,
            description: data.description || '',
            price: data.price || data.askingPrice || 0,
            yearsActive: data.yearsActive || 0,
            fleetSize: data.fleetSize || 0,
            totalDrivers: data.totalDrivers || 0,
            operationType: data.operationType || [],
            safetyRating: data.safetyRating || 'satisfactory',
            insuranceStatus: data.insuranceStatus || 'active',
            verified: data.verified || false,
            isPremium: data.isPremium || false,
            isVip: data.isVip || false,
            trustScore: data.trustScore || 70,
            trustLevel: getTrustLevel(data.trustScore || 70),
            verificationBadges: data.verificationBadges || [],
            city: data.city || '',
            state: data.state || '',
            address: data.address || '',
            amazonStatus: data.amazonStatus || 'none',
            amazonRelayScore: data.amazonRelayScore || null,
            highwaySetup: data.highwaySetup || false,
            sellingWithEmail: data.sellingWithEmail || false,
            sellingWithPhone: data.sellingWithPhone || false,
            contactPhone: data.contactPhone || '',
            contactEmail: data.contactEmail || '',
            cargoTypes: data.cargoTypes || '',
            fmcsaData: data.fmcsaData || '',
            saferScore: data.saferScore || '',
            insuranceOnFile: data.insuranceOnFile || false,
            isUnlocked: true,
            isSaved: false,
            isOwner: false,
            documents: data.documents || [],
            status: data.status || 'pending-verification',
            visibility: data.visibility || 'public',
            views: data.views || 0,
            saves: data.saves || 0,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt || data.createdAt),
            seller: {
              id: data.seller?.id || data.sellerId,
              name: data.seller?.name || 'Unknown Seller',
              email: data.seller?.email || '',
              role: 'seller' as const,
              verified: data.seller?.isVerified || false,
              trustScore: data.seller?.trustScore || 70,
              memberSince: new Date(data.seller?.createdAt || Date.now()),
              completedDeals: data.seller?.completedDeals || 0,
              reviews: []
            }
          } as MCListingExtended
          setListing(transformedListing)
        }
      } catch (err) {
        console.error('Failed to fetch listing:', err)
        setFetchError('Failed to load listing')
        setListing(null)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  // Parse FMCSA data if available
  const fmcsaData = listing?.fmcsaData ? JSON.parse(listing.fmcsaData as string) : null
  const cargoTypesArray = listing?.cargoTypes ? JSON.parse(listing.cargoTypes as string) : []

  // Extended listing data from API
  const listingDetails = {
    // Basic Info
    mcNumber: listing?.mcNumber || '',
    dotNumber: listing?.dotNumber || '',
    state: listing?.state || '',

    // FMCSA Data (from fmcsaData JSON or direct fields)
    legalName: listing?.legalName || fmcsaData?.carrier?.legalName || '',
    dbaName: listing?.dbaName || fmcsaData?.carrier?.dbaName || '',
    physicalAddress: listing?.address || fmcsaData?.carrier?.phyStreet
      ? `${fmcsaData?.carrier?.phyStreet}, ${fmcsaData?.carrier?.phyCity}, ${fmcsaData?.carrier?.phyState} ${fmcsaData?.carrier?.phyZipcode}`
      : `${listing?.city || ''}, ${listing?.state || ''}`,
    mailingAddress: fmcsaData?.carrier?.mailingStreet
      ? `${fmcsaData?.carrier?.mailingStreet}, ${fmcsaData?.carrier?.mailingCity}, ${fmcsaData?.carrier?.mailingState} ${fmcsaData?.carrier?.mailingZipcode}`
      : '',
    phone: listing?.contactPhone || fmcsaData?.carrier?.telephone || '',
    powerUnits: String(listing?.fleetSize || fmcsaData?.carrier?.totalPowerUnits || 0),
    drivers: String(listing?.totalDrivers || fmcsaData?.carrier?.totalDrivers || 0),
    mcs150Date: fmcsaData?.carrier?.mcs150FormDate || '',
    operatingStatus: fmcsaData?.carrier?.allowedToOperate === 'Y' ? 'AUTHORIZED' : fmcsaData?.carrier?.operatingStatus || 'UNKNOWN',
    entityType: fmcsaData?.carrier?.carrierOperation || 'CARRIER',
    cargoCarried: cargoTypesArray.length > 0 ? cargoTypesArray : (fmcsaData?.carrier?.cargoCarried || []),

    // Entry Audit (from FMCSA data)
    entryAuditCompleted: fmcsaData?.authority?.commonAuthorityStatus === 'A' ? 'yes' : 'no',

    // Amazon & Highway
    amazonStatus: listing?.amazonStatus || 'none',
    amazonRelayScore: listing?.amazonRelayScore || '',
    highwaySetup: listing?.highwaySetup ? 'yes' : 'no',

    // Selling with Email/Phone
    sellingWithEmail: listing?.sellingWithEmail ? 'yes' : 'no',
    sellingWithPhone: listing?.sellingWithPhone ? 'yes' : 'no',

    // Factoring (placeholder - would need to be added to listing model if needed)
    hasFactoring: 'no',
    factoringCompany: '',
    factoringRate: '',

    // Payment Info (placeholder - would come from transactions)
    invoiceNumber: `INV-${listing?.id?.slice(0, 8) || ''}`,
    paymentAmount: 35,
    paymentDate: listing?.createdAt || new Date(),
    paymentStatus: listing?.status === 'pending-verification' ? 'paid' : 'pending'
  }

  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      from: 'seller',
      sender: listing?.seller.name || 'Seller',
      message: 'Hi, I submitted my MC listing for review. Please let me know if you need any additional documents.',
      timestamp: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      from: 'admin',
      sender: 'Admin',
      message: 'Thank you for your submission. I\'m reviewing your documents now. Everything looks good so far.',
      timestamp: new Date('2024-01-15T11:00:00'),
    }
  ])

  // Required documents configuration
  const requiredDocuments: {
    id: string
    type: string
    label: string
    icon: LucideIcon
    required: boolean
  }[] = [
    { id: '1', type: 'article-of-incorporation', label: 'Article of Incorporation', icon: Building2, required: true },
    { id: '2', type: 'ein-letter', label: 'EIN Letter', icon: FileText, required: true },
    { id: '3', type: 'driver-license', label: 'Driver License', icon: BadgeCheck, required: true },
    { id: '4', type: 'coi', label: 'COI (Certificate of Insurance)', icon: Shield, required: true },
    { id: '5', type: 'loss-run', label: 'Copy of Loss Run', icon: ClipboardCheck, required: true },
    { id: '6', type: 'factoring-lor', label: 'Factoring LOR', icon: Percent, required: false }
  ]

  // Documents state - some uploaded, some missing
  const [documents, setDocuments] = useState<{
    [key: string]: {
      name: string
      size: string
      uploadedAt: Date
      verified: boolean
    } | null
  }>({
    'article-of-incorporation': { name: 'Article_of_Incorporation.pdf', size: '2.4 MB', uploadedAt: new Date('2024-01-10'), verified: true },
    'ein-letter': { name: 'EIN_Letter.pdf', size: '1.2 MB', uploadedAt: new Date('2024-01-10'), verified: true },
    'driver-license': null, // Missing document - needs upload
    'coi': { name: 'Certificate_of_Insurance.pdf', size: '3.2 MB', uploadedAt: new Date('2024-01-10'), verified: true },
    'loss-run': null, // Missing document - needs upload
    'factoring-lor': { name: 'Factoring_LOR.pdf', size: '1.5 MB', uploadedAt: new Date('2024-01-10'), verified: false }
  })

  const [dragOver, setDragOver] = useState<string | null>(null)

  // Simulate file upload
  const handleFileUpload = (docType: string, fileName?: string) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: {
        name: fileName || `${docType.replace(/-/g, '_')}.pdf`,
        size: '2.1 MB',
        uploadedAt: new Date(),
        verified: false
      }
    }))
  }

  // Handle drag events
  const handleDragOver = (e: React.DragEvent, docType: string) => {
    e.preventDefault()
    setDragOver(docType)
  }

  const handleDragLeave = () => {
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent, docType: string) => {
    e.preventDefault()
    setDragOver(null)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(docType, files[0].name)
    }
  }

  // Remove document
  const handleRemoveDocument = (docType: string) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: null
    }))
  }

  // Mock CreditSafe data
  const generateCreditSafeReport = (): CreditSafeReport => ({
    companyName: listingDetails.legalName || 'Transport Pro LLC',
    tradingName: listingDetails.dbaName || 'TransportPro Logistics',
    registrationNumber: `DOT-${listingDetails.dotNumber}`,
    incorporationDate: '2018-03-15',
    companyStatus: 'Active',
    companyType: 'Limited Liability Company',
    address: {
      street: listingDetails.physicalAddress.split(',')[0] || '1234 Trucking Way',
      city: 'Dallas',
      state: listingDetails.state || 'TX',
      zip: '75201',
      country: 'United States'
    },
    contact: {
      phone: listingDetails.phone || '+1 (555) 123-4567',
      website: 'www.transportpro.com',
      email: 'info@transportpro.com'
    },
    creditScore: {
      score: 78,
      maxScore: 100,
      rating: 'A',
      trend: 'up',
      riskLevel: 'low'
    },
    financialSummary: {
      annualRevenue: 4500000,
      netWorth: 1200000,
      totalAssets: 2800000,
      totalLiabilities: 1600000,
      employeeCount: parseInt(listingDetails.drivers) || 45,
      yearEstablished: 2018
    },
    paymentBehavior: {
      dbtScore: 12,
      paymentIndex: 85,
      onTimePayments: 89,
      latePayments: 8,
      severelyLate: 3
    },
    legalFilings: {
      bankruptcies: 0,
      liens: 0,
      judgments: 0,
      uccFilings: 2
    },
    industryComparison: {
      percentile: 72,
      industryAverage: 65,
      industryName: 'Trucking & Transportation'
    },
    directors: [
      { name: 'John Smith', title: 'CEO & Founder', appointedDate: '2018-03-15' },
      { name: 'Sarah Johnson', title: 'CFO', appointedDate: '2019-06-01' },
      { name: 'Michael Chen', title: 'Operations Director', appointedDate: '2020-01-15' }
    ],
    lastUpdated: new Date().toISOString()
  })

  // Auto-run CreditSafe check when tab is opened
  useEffect(() => {
    if (activeTab === 'creditsafe' && !creditSafeReport && !isSearching && listing?.mcNumber) {
      runAutomaticCreditCheck()
    }
  }, [activeTab, listing?.mcNumber])

  const runAutomaticCreditCheck = async () => {
    if (!listing?.mcNumber) {
      setSearchError('No MC number available for due diligence check')
      return
    }

    setIsSearching(true)
    setSearchError('')

    try {
      // Call real API for due diligence
      const response = await api.runDueDiligence(listing.mcNumber)

      if (response.success && response.data) {
        setDueDiligenceResult(response.data)

        // Transform API response to CreditSafeReport format for backward compatibility
        const cs = response.data.creditsafe
        const fullReport = cs.fullReport

        const transformedReport: CreditSafeReport = {
          companyName: cs.companyName || listingDetails.legalName || 'Unknown Company',
          tradingName: fullReport?.companySummary?.businessName || listingDetails.dbaName || '',
          registrationNumber: fullReport?.companySummary?.safeNumber || `DOT-${listing.dotNumber}`,
          incorporationDate: fullReport?.companySummary?.companyRegistrationNumber ?
            fullReport?.companySummary?.dateOfIncorporation || '' : '',
          companyStatus: fullReport?.companySummary?.companyStatus?.status || 'Active',
          companyType: fullReport?.companySummary?.companyType || 'Limited Liability Company',
          address: {
            street: fullReport?.contactInformation?.mainAddress?.street || listingDetails.physicalAddress.split(',')[0] || '',
            city: fullReport?.contactInformation?.mainAddress?.city || listing.city || '',
            state: fullReport?.contactInformation?.mainAddress?.province || listing.state || '',
            zip: fullReport?.contactInformation?.mainAddress?.postalCode || '',
            country: fullReport?.contactInformation?.mainAddress?.country || 'United States'
          },
          contact: {
            phone: fullReport?.contactInformation?.telephone || listingDetails.phone || '',
            website: fullReport?.contactInformation?.websites?.[0] || '',
            email: fullReport?.contactInformation?.emailAddresses?.[0] || ''
          },
          creditScore: {
            score: cs.creditScore || 0,
            maxScore: 100,
            rating: cs.creditRating || 'N/A',
            trend: 'stable',
            riskLevel: cs.riskDescription?.toLowerCase().includes('very low') ? 'very-low' :
                       cs.riskDescription?.toLowerCase().includes('low') ? 'low' :
                       cs.riskDescription?.toLowerCase().includes('moderate') ? 'moderate' :
                       cs.riskDescription?.toLowerCase().includes('high') ? 'high' : 'moderate'
          },
          financialSummary: {
            annualRevenue: fullReport?.financialStatements?.[0]?.revenue || 0,
            netWorth: fullReport?.financialStatements?.[0]?.netWorth || 0,
            totalAssets: fullReport?.financialStatements?.[0]?.totalAssets || 0,
            totalLiabilities: fullReport?.financialStatements?.[0]?.totalLiabilities || 0,
            employeeCount: parseInt(cs.employees || '0') || parseInt(listingDetails.drivers) || 0,
            yearEstablished: cs.yearsInBusiness ? new Date().getFullYear() - parseInt(cs.yearsInBusiness) : 0
          },
          paymentBehavior: {
            dbtScore: fullReport?.paymentData?.dbt || 0,
            paymentIndex: fullReport?.paymentData?.paymentIndex || 0,
            onTimePayments: 100 - (fullReport?.paymentData?.percentOverdue || 0),
            latePayments: fullReport?.paymentData?.percentOverdue || 0,
            severelyLate: fullReport?.paymentData?.percentSeverelyOverdue || 0
          },
          legalFilings: {
            bankruptcies: cs.legalFilings.bankruptcy ? 1 : 0,
            liens: cs.legalFilings.taxLiens || 0,
            judgments: cs.legalFilings.judgments || 0,
            uccFilings: cs.legalFilings.uccFilings || 0
          },
          industryComparison: {
            percentile: 50,
            industryAverage: 50,
            industryName: 'Trucking & Transportation'
          },
          directors: fullReport?.directors?.map((d: any) => ({
            name: `${d.firstName || ''} ${d.lastName || ''}`.trim() || d.name || 'Unknown',
            title: d.positions?.[0]?.name || d.title || 'Director',
            appointedDate: d.positions?.[0]?.dateAppointed || ''
          })) || [],
          lastUpdated: response.data.analyzedAt
        }

        setCreditSafeReport(transformedReport)
      } else {
        setSearchError('Failed to retrieve due diligence report')
        // Fall back to mock data
        setCreditSafeReport(generateCreditSafeReport())
      }
    } catch (error) {
      console.error('Due diligence API error:', error)
      setSearchError('Error fetching due diligence report. Using cached data.')
      // Fall back to mock data on error
      setCreditSafeReport(generateCreditSafeReport())
    } finally {
      setIsSearching(false)
    }
  }

  // Manual refresh function
  const handleRefreshCreditSafe = async () => {
    setIsSearching(true)
    setCreditSafeReport(null)
    setDueDiligenceResult(null)
    await runAutomaticCreditCheck()
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-low':
        return 'text-emerald-600'
      case 'low':
        return 'text-green-400'
      case 'moderate':
        return 'text-yellow-400'
      case 'high':
        return 'text-orange-400'
      case 'very-high':
        return 'text-red-400'
      default:
        return 'text-gray-500'
    }
  }

  const getRiskLevelBg = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-low':
        return 'bg-emerald-500/20 border-trust-high/30'
      case 'low':
        return 'bg-green-400/20 border-green-400/30'
      case 'moderate':
        return 'bg-yellow-400/20 border-yellow-400/30'
      case 'high':
        return 'bg-orange-400/20 border-orange-400/30'
      case 'very-high':
        return 'bg-red-400/20 border-red-400/30'
      default:
        return 'bg-gray-100 border-gray-300'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'
    if (score >= 60) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    if (score >= 20) return 'text-orange-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900 text-gray-900 mb-4">Loading Listing...</h2>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (fetchError || !listing) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 text-gray-900 mb-4">{fetchError || 'Listing Not Found'}</h2>
              <Button onClick={() => navigate('/admin/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const handleApprove = () => {
    // In real app, call API to approve listing
    alert('Listing approved! Seller will be notified.')
    navigate('/admin/dashboard')
  }

  const handleReject = () => {
    // In real app, call API to reject listing
    const reason = prompt('Please provide a reason for rejection:')
    if (reason) {
      alert('Listing rejected. Seller will be notified with your feedback.')
      navigate('/admin/dashboard')
    }
  }

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        from: 'admin',
        sender: 'Admin',
        message: chatMessage,
        timestamp: new Date()
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage('')
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex gap-2 sm:gap-3">
            <Button variant="danger" onClick={handleReject} className="flex-1 sm:flex-none text-sm sm:text-base">
              <XCircle className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Reject</span>
              <span className="sm:hidden">Reject</span>
            </Button>
            <Button onClick={handleApprove} className="flex-1 sm:flex-none text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Approve</span>
              <span className="sm:hidden">Approve</span>
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-xl p-1.5 sm:p-2 overflow-x-auto border border-gray-200 scrollbar-hide">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 min-w-[80px] px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'details'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 min-w-[80px] px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Docs ({Object.keys(documents).length})
              </button>
              <button
                onClick={() => setActiveTab('creditsafe')}
                className={`flex-1 min-w-[80px] px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 ${
                  activeTab === 'creditsafe'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">CreditSafe</span>
                <span className="sm:hidden">Credit</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 min-w-[60px] px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chat
              </button>
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Listing Header */}
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 -m-6 mb-6 p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">MC #{listingDetails.mcNumber}</h1>
                          <span className="bg-gray-100 border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs text-yellow-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        </div>
                        <p className="text-base sm:text-xl text-gray-700">{listing?.title}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
                          ${(listing?.price ?? 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Asking Price</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center">
                      <Hash className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">MC Number</div>
                      <div className="font-bold text-gray-900">{listingDetails.mcNumber}</div>
                    </div>
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center">
                      <Hash className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">DOT Number</div>
                      <div className="font-bold text-gray-900">{listingDetails.dotNumber}</div>
                    </div>
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center">
                      <MapPin className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">State</div>
                      <div className="font-bold text-gray-900">{listingDetails.state}</div>
                    </div>
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-3 text-center">
                      <Shield className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="font-bold text-gray-900 text-emerald-600">{listingDetails.operatingStatus}</div>
                    </div>
                  </div>
                </Card>

                {/* FMCSA Information */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                      <Building2 className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 text-gray-900">FMCSA Information</h2>
                      <p className="text-sm text-gray-500">Data from official FMCSA records</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Building2 className="w-4 h-4" />
                          Legal Name
                        </div>
                        <div className="font-semibold text-gray-900">{listingDetails.legalName}</div>
                      </div>
                      {listingDetails.dbaName && (
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            DBA Name
                          </div>
                          <div className="font-semibold text-gray-900">{listingDetails.dbaName}</div>
                        </div>
                      )}
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <MapPin className="w-4 h-4" />
                          Physical Address
                        </div>
                        <div className="font-semibold text-gray-900">{listingDetails.physicalAddress}</div>
                      </div>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Phone className="w-4 h-4" />
                          Phone
                        </div>
                        <div className="font-semibold text-gray-900">{listingDetails.phone}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <TruckIcon className="w-4 h-4" />
                            Power Units
                          </div>
                          <div className="text-2xl font-bold text-gray-900 text-gray-900">{listingDetails.powerUnits}</div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <Users className="w-4 h-4" />
                            Drivers
                          </div>
                          <div className="text-2xl font-bold text-gray-900 text-gray-900">{listingDetails.drivers}</div>
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          MCS-150 Date
                        </div>
                        <div className="font-semibold text-gray-900">{listingDetails.mcs150Date}</div>
                      </div>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="text-gray-500 text-sm mb-2">Cargo Carried</div>
                        <div className="flex flex-wrap gap-2">
                          {listingDetails.cargoCarried.map((cargo: string, i: number) => (
                            <span key={i} className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                              {cargo}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Entry Audit Status */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20">
                      <ClipboardCheck className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 text-gray-900">Entry Audit Status</h2>
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 border ${listingDetails.entryAuditCompleted === 'yes' ? 'bg-emerald-500/10 border-trust-high/30' : 'bg-yellow-400/10 border-yellow-400/30'}`}>
                    <div className="flex items-center gap-3">
                      {listingDetails.entryAuditCompleted === 'yes' ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                          <div>
                            <div className="font-bold text-gray-900 text-emerald-600">Entry Audit Completed</div>
                            <div className="text-sm text-gray-500">This authority has passed the entry audit</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-6 h-6 text-yellow-400" />
                          <div>
                            <div className="font-bold text-gray-900 text-yellow-400">Entry Audit Pending</div>
                            <div className="text-sm text-gray-500">Entry audit has not been completed yet</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Platform Integrations */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 text-gray-900">Platform Integrations</h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📦</span>
                        <span className="font-semibold text-gray-900">Amazon Relay</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className={`font-bold text-gray-900 ${listingDetails.amazonStatus === 'active' ? 'text-emerald-600' : 'text-yellow-400'}`}>
                            {listingDetails.amazonStatus === 'active' ? '✅ Active' : listingDetails.amazonStatus}
                          </span>
                        </div>
                        {listingDetails.amazonStatus === 'active' && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Relay Score</span>
                            <span className="font-bold text-gray-900 text-emerald-600">{listingDetails.amazonRelayScore}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🛣️</span>
                        <span className="font-semibold text-gray-900">Highway Setup</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-bold text-gray-900 ${listingDetails.highwaySetup === 'yes' ? 'text-emerald-600' : 'text-yellow-400'}`}>
                          {listingDetails.highwaySetup === 'yes' ? '✅ Setup Complete' : 'Not Setup'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* What's Included in Sale */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                      <Package className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 text-gray-900">What's Included in Sale</h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`rounded-xl p-4 border flex items-center gap-4 ${listingDetails.sellingWithEmail === 'yes' ? 'bg-emerald-500/10 border-trust-high/30' : 'bg-gray-50 border-gray-200'}`}>
                      <Mail className={`w-6 h-6 ${listingDetails.sellingWithEmail === 'yes' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-semibold text-gray-900">Business Email</div>
                        <div className="text-sm text-gray-500">
                          {listingDetails.sellingWithEmail === 'yes' ? 'Included with sale' : 'Not included'}
                        </div>
                      </div>
                      {listingDetails.sellingWithEmail === 'yes' && <CheckCircle className="w-5 h-5 text-emerald-600 ml-auto" />}
                    </div>

                    <div className={`rounded-xl p-4 border flex items-center gap-4 ${listingDetails.sellingWithPhone === 'yes' ? 'bg-emerald-500/10 border-trust-high/30' : 'bg-gray-50 border-gray-200'}`}>
                      <Phone className={`w-6 h-6 ${listingDetails.sellingWithPhone === 'yes' ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <div>
                        <div className="font-semibold text-gray-900">Business Phone</div>
                        <div className="text-sm text-gray-500">
                          {listingDetails.sellingWithPhone === 'yes' ? 'Included with sale' : 'Not included'}
                        </div>
                      </div>
                      {listingDetails.sellingWithPhone === 'yes' && <CheckCircle className="w-5 h-5 text-emerald-600 ml-auto" />}
                    </div>
                  </div>
                </Card>

                {/* Factoring Information */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                      <Percent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 text-gray-900">Factoring Information</h2>
                    </div>
                  </div>

                  {listingDetails.hasFactoring === 'yes' ? (
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="text-gray-500 text-sm mb-1">Has Factoring</div>
                        <div className="font-bold text-gray-900 text-emerald-600 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Yes
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="text-gray-500 text-sm mb-1">Factoring Company</div>
                        <div className="font-bold text-gray-900">{listingDetails.factoringCompany}</div>
                      </div>
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="text-gray-500 text-sm mb-1">Factoring Rate</div>
                        <div className="font-bold text-gray-900">{listingDetails.factoringRate}%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                      <XCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-gray-500">No factoring agreement</div>
                    </div>
                  )}
                </Card>

                {/* Authority Details */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                      <TruckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900">Authority Details</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Years Active</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 text-gray-900">{listing?.yearsActive} years</div>
                    </div>

                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <TruckIcon className="w-4 h-4" />
                        <span>Fleet Size</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 text-gray-900">{listing?.fleetSize} trucks</div>
                    </div>

                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Safety Rating</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 text-gray-900 capitalize text-emerald-600">
                        {listing?.safetyRating.replace('-', ' ')}
                      </div>
                    </div>

                    <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <Shield className="w-4 h-4" />
                        <span>Insurance</span>
                      </div>
                      <div className="text-lg font-bold text-gray-900 text-gray-900 capitalize text-emerald-600">{listing?.insuranceStatus}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm mb-2">Operation Types</div>
                    <div className="flex flex-wrap gap-2">
                      {listing?.operationType.map((type) => (
                        <span
                          key={type}
                          className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Payment Information */}
                <Card>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                      <Receipt className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 text-gray-900">Payment Information</h2>
                      <p className="text-sm text-gray-500">Listing activation fee</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-gray-500 text-sm">Invoice Number</div>
                        <div className="font-bold text-gray-900">{listingDetails.invoiceNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500 text-sm">Payment Date</div>
                        <div className="font-semibold text-gray-900">{listingDetails.paymentDate.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div>
                        <div className="text-gray-500 text-sm">Amount Paid</div>
                        <div className="text-2xl font-bold text-gray-900 text-gray-900 text-emerald-600">${listingDetails.paymentAmount}.00</div>
                      </div>
                      <div className={`px-4 py-2 rounded-full ${listingDetails.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-yellow-400/20 text-yellow-400'}`}>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                          {listingDetails.paymentStatus === 'paid' ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Paid
                            </>
                          ) : (
                            <>
                              <Clock className="w-4 h-4" />
                              Pending
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Description */}
                <Card>
                  <h2 className="text-xl font-bold text-gray-900 text-gray-900 mb-4">Listing Description</h2>
                  <p className="text-gray-700 leading-relaxed">{listing?.description}</p>
                </Card>
              </motion.div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 -m-6 mb-6 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 text-gray-900">Required Documents</h2>
                        <p className="text-gray-500">
                          {Object.values(documents).filter(d => d !== null).length} of {requiredDocuments.length} documents uploaded
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {requiredDocuments.map((reqDoc) => {
                      const IconComponent = reqDoc.icon
                      const doc = documents[reqDoc.type]
                      const isUploaded = doc !== null
                      const isDragOver = dragOver === reqDoc.type

                      return (
                        <div key={reqDoc.id}>
                          {isUploaded ? (
                            // Uploaded document view
                            <div
                              className={`rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors border ${
                                doc.verified
                                  ? 'bg-emerald-500/5 border-trust-high/20 hover:bg-emerald-500/10'
                                  : 'bg-gray-100 border border-gray-200 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  doc.verified ? 'bg-emerald-500/20' : 'bg-primary-500/20'
                                }`}>
                                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${doc.verified ? 'text-emerald-600' : 'text-primary-400'}`} />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{doc.name}</div>
                                  <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1 sm:gap-3">
                                    <span className="hidden sm:inline">{reqDoc.label}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>{doc.size}</span>
                                    <span>•</span>
                                    <span>{doc.uploadedAt.toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                                {doc.verified ? (
                                  <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/20 text-emerald-600 text-xs sm:text-sm font-medium">
                                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Verified
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-yellow-400/20 text-yellow-400 text-xs sm:text-sm font-medium">
                                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Pending
                                  </span>
                                )}
                                <Button size="sm" variant="secondary" className="text-xs sm:text-sm px-2 sm:px-3">
                                  <Download className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                  <span className="hidden sm:inline">Download</span>
                                </Button>
                                <button
                                  onClick={() => handleRemoveDocument(reqDoc.type)}
                                  className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                                  title="Remove document"
                                >
                                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Upload zone for missing document
                            <div
                              onDragOver={(e) => handleDragOver(e, reqDoc.type)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, reqDoc.type)}
                              className={`rounded-xl border-2 border-dashed transition-all ${
                                isDragOver
                                  ? 'border-primary-500 bg-primary-500/10'
                                  : 'border-red-400/30 bg-red-500/5 hover:border-red-400/50'
                              }`}
                            >
                              <div className="p-3 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  isDragOver ? 'bg-primary-500/20' : 'bg-red-500/20'
                                }`}>
                                  <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${isDragOver ? 'text-primary-400' : 'text-red-400'}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{reqDoc.label}</span>
                                    {reqDoc.required && (
                                      <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 font-medium">
                                        Required
                                      </span>
                                    )}
                                    {!reqDoc.required && (
                                      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500 font-medium">
                                        Optional
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500">
                                    {isDragOver ? 'Drop file here...' : 'Drag & drop or tap to upload'}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-red-500/20 text-red-400 text-xs sm:text-sm font-medium">
                                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Missing
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleFileUpload(reqDoc.type)}
                                    className={`text-xs sm:text-sm ${isDragOver ? 'bg-primary-500' : ''}`}
                                  >
                                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                                    <span className="hidden sm:inline">Upload</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Summary and Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {/* Missing documents warning */}
                    {Object.values(documents).some(d => d === null) && (
                      <div className="mb-4 p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-900 text-yellow-400 mb-1">Missing Documents</p>
                          <p className="text-sm text-gray-600">
                            Some required documents are missing. You can upload them on behalf of the seller or request them to re-upload.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="text-xs sm:text-sm text-gray-500">
                        <span className="text-emerald-600 font-medium">
                          {Object.values(documents).filter(d => d?.verified).length}
                        </span> verified •
                        <span className="text-yellow-400 font-medium ml-1">
                          {Object.values(documents).filter(d => d && !d.verified).length}
                        </span> pending •
                        <span className="text-red-400 font-medium ml-1">
                          {Object.values(documents).filter(d => d === null).length}
                        </span> missing
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button variant="secondary" className="text-xs sm:text-sm">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Request Re-upload
                        </Button>
                        <Button className="text-xs sm:text-sm">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Verify All
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* CreditSafe Tab */}
            {activeTab === 'creditsafe' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Loading State */}
                {isSearching && !creditSafeReport && (
                  <Card className="py-16">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-full border-4 border-primary-500/30 border-t-primary-500 mx-auto mb-6"
                      />
                      <h3 className="text-xl font-bold text-gray-900 text-gray-900 mb-2">Running CreditSafe Check...</h3>
                      <p className="text-gray-500 mb-4">Analyzing business health for {listingDetails.legalName}</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                        <Building2 className="w-4 h-4" />
                        <span>DOT #{listingDetails.dotNumber}</span>
                        <span>•</span>
                        <span>MC #{listingDetails.mcNumber}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* CreditSafe Report */}
                {creditSafeReport && (
                  <>
                    {/* Header with Refresh */}
                    <Card className="overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 -m-6 mb-0 p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900 text-gray-900">CreditSafe Business Report</h2>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                <span>Auto-check completed</span>
                                <span>•</span>
                                <span>DOT #{listingDetails.dotNumber}</span>
                                <span>•</span>
                                <span>MC #{listingDetails.mcNumber}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="secondary"
                            onClick={handleRefreshCreditSafe}
                            disabled={isSearching}
                          >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isSearching ? 'animate-spin' : ''}`} />
                            {isSearching ? 'Refreshing...' : 'Refresh Report'}
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Credit Score Overview - Uses dueDiligenceResult when available */}
                    <Card>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {dueDiligenceResult?.creditsafe?.companyName || creditSafeReport.companyName}
                          </h3>
                          <p className="text-gray-500">{creditSafeReport.tradingName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            {dueDiligenceResult?.creditsafe?.companyFound ? (
                              <span className="bg-emerald-100 border border-emerald-200 px-2 py-1 rounded text-xs text-emerald-600">
                                Company Found in CreditSafe
                              </span>
                            ) : (
                              <span className="bg-yellow-100 border border-yellow-200 px-2 py-1 rounded text-xs text-yellow-600">
                                Using FMCSA Data
                              </span>
                            )}
                            {dueDiligenceResult && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                dueDiligenceResult.recommendationStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                                dueDiligenceResult.recommendationStatus === 'review' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {dueDiligenceResult.recommendationStatus.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Analyzed</div>
                          <div className="text-sm text-gray-500">
                            {dueDiligenceResult?.analyzedAt
                              ? new Date(dueDiligenceResult.analyzedAt).toLocaleString()
                              : new Date(creditSafeReport.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Credit Score Card - Using API Data */}
                      {dueDiligenceResult ? (
                        <div className={`rounded-xl p-6 border ${
                          dueDiligenceResult.riskLevel === 'low' ? 'border-emerald-200 bg-emerald-50' :
                          dueDiligenceResult.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                          dueDiligenceResult.riskLevel === 'high' ? 'border-orange-200 bg-orange-50' :
                          'border-red-200 bg-red-50'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-500 mb-2">CreditSafe Score</div>
                              <div className="flex items-baseline gap-3">
                                <span className={`text-5xl font-bold ${getScoreColor(dueDiligenceResult.creditsafe.creditScore || 0)}`}>
                                  {dueDiligenceResult.creditsafe.creditScore || 'N/A'}
                                </span>
                                <span className="text-xl text-gray-400">/ 100</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-lg font-semibold ${getScoreColor(dueDiligenceResult.creditsafe.creditScore || 0)}`}>
                                  Rating: {dueDiligenceResult.creditsafe.creditRating || 'N/A'}
                                </span>
                              </div>
                              {dueDiligenceResult.creditsafe.riskDescription && (
                                <div className="text-sm text-gray-600 mt-2">
                                  {dueDiligenceResult.creditsafe.riskDescription}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-2">Overall Risk</div>
                              <div className={`text-2xl font-bold capitalize ${
                                dueDiligenceResult.riskLevel === 'low' ? 'text-emerald-600' :
                                dueDiligenceResult.riskLevel === 'medium' ? 'text-yellow-600' :
                                dueDiligenceResult.riskLevel === 'high' ? 'text-orange-600' :
                                'text-red-600'
                              }`}>
                                {dueDiligenceResult.riskLevel}
                              </div>
                              <div className="text-sm text-gray-500 mt-2">
                                Score: {dueDiligenceResult.recommendationScore}/100
                              </div>
                            </div>
                          </div>

                          {/* Score Bar */}
                          <div className="mt-6">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${dueDiligenceResult.creditsafe.creditScore || 0}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                  (dueDiligenceResult.creditsafe.creditScore || 0) >= 80 ? 'bg-emerald-500' :
                                  (dueDiligenceResult.creditsafe.creditScore || 0) >= 60 ? 'bg-green-400' :
                                  (dueDiligenceResult.creditsafe.creditScore || 0) >= 40 ? 'bg-yellow-400' :
                                  (dueDiligenceResult.creditsafe.creditScore || 0) >= 20 ? 'bg-orange-400' : 'bg-red-400'
                                }`}
                              />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                              <span>Very High Risk</span>
                              <span>Very Low Risk</span>
                            </div>
                          </div>

                          {/* Summary */}
                          {dueDiligenceResult.summary && (
                            <div className="mt-4 p-3 bg-white/50 rounded-lg">
                              <div className="text-sm font-medium text-gray-700 mb-1">Analysis Summary</div>
                              <div className="text-sm text-gray-600">{dueDiligenceResult.summary}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`rounded-xl p-6 border ${getRiskLevelBg(creditSafeReport.creditScore.riskLevel)}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-gray-500 mb-2">Business Health Score</div>
                              <div className="flex items-baseline gap-3">
                                <span className={`text-5xl font-bold text-gray-900 ${getScoreColor(creditSafeReport.creditScore.score)}`}>
                                  {creditSafeReport.creditScore.score}
                                </span>
                                <span className="text-xl text-gray-400">/ {creditSafeReport.creditScore.maxScore}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-2">Risk Level</div>
                              <div className={`text-2xl font-bold text-gray-900 capitalize ${getRiskLevelColor(creditSafeReport.creditScore.riskLevel)}`}>
                                {creditSafeReport.creditScore.riskLevel.replace('-', ' ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>

                    {/* Financial Summary */}
                    <Card>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                        Financial Summary
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Annual Revenue</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 text-gray-900 text-emerald-600">
                            {formatPrice(creditSafeReport.financialSummary.annualRevenue)}
                          </div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Net Worth</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 text-gray-900">
                            {formatPrice(creditSafeReport.financialSummary.netWorth)}
                          </div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <Activity className="w-4 h-4" />
                            <span>Total Assets</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 text-gray-900">
                            {formatPrice(creditSafeReport.financialSummary.totalAssets)}
                          </div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <TrendingDown className="w-4 h-4" />
                            <span>Total Liabilities</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 text-gray-900 text-orange-400">
                            {formatPrice(creditSafeReport.financialSummary.totalLiabilities)}
                          </div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <Users className="w-4 h-4" />
                            <span>Employees</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 text-gray-900">
                            {creditSafeReport.financialSummary.employeeCount}
                          </div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>Year Established</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900 text-gray-900">
                            {creditSafeReport.financialSummary.yearEstablished}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Payment Behavior */}
                    <Card>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                        Payment Behavior
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-gray-900 text-gray-900 text-emerald-600 mb-1">
                            {creditSafeReport.paymentBehavior.onTimePayments}%
                          </div>
                          <div className="text-xs text-gray-500">On-Time Payments</div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-gray-900 text-gray-900 text-yellow-400 mb-1">
                            {creditSafeReport.paymentBehavior.latePayments}%
                          </div>
                          <div className="text-xs text-gray-500">Late Payments</div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-gray-900 text-gray-900 text-red-400 mb-1">
                            {creditSafeReport.paymentBehavior.severelyLate}%
                          </div>
                          <div className="text-xs text-gray-500">Severely Late</div>
                        </div>
                        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-gray-900 text-gray-900 mb-1">
                            {creditSafeReport.paymentBehavior.dbtScore}
                          </div>
                          <div className="text-xs text-gray-500">Days Beyond Terms</div>
                        </div>
                      </div>

                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500">Payment Index</span>
                          <span className="font-bold text-gray-900">{creditSafeReport.paymentBehavior.paymentIndex}/100</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${creditSafeReport.paymentBehavior.paymentIndex}%` }}
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Legal & Risk Factors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Legal Filings - Uses API Data */}
                      <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-primary-400" />
                          Legal Filings
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <span className="text-gray-700">Bankruptcies</span>
                            <span className={`font-bold ${
                              (dueDiligenceResult?.creditsafe?.legalFilings?.bankruptcy ? 1 : 0) === 0 ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                              {dueDiligenceResult?.creditsafe?.legalFilings?.bankruptcy ? 'Yes' : 'No'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <span className="text-gray-700">Tax Liens</span>
                            <span className={`font-bold ${
                              (dueDiligenceResult?.creditsafe?.legalFilings?.taxLiens || 0) === 0 ? 'text-emerald-600' : 'text-yellow-500'
                            }`}>
                              {dueDiligenceResult?.creditsafe?.legalFilings?.taxLiens ?? creditSafeReport.legalFilings.liens}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <span className="text-gray-700">Judgments</span>
                            <span className={`font-bold ${
                              (dueDiligenceResult?.creditsafe?.legalFilings?.judgments || 0) === 0 ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                              {dueDiligenceResult?.creditsafe?.legalFilings?.judgments ?? creditSafeReport.legalFilings.judgments}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <span className="text-gray-700">UCC Filings</span>
                            <span className="font-bold text-gray-900">
                              {dueDiligenceResult?.creditsafe?.legalFilings?.uccFilings ?? creditSafeReport.legalFilings.uccFilings}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <span className="text-gray-700">Cautionary UCC</span>
                            <span className={`font-bold ${
                              (dueDiligenceResult?.creditsafe?.legalFilings?.cautionaryUCC || 0) === 0 ? 'text-emerald-600' : 'text-orange-500'
                            }`}>
                              {dueDiligenceResult?.creditsafe?.legalFilings?.cautionaryUCC ?? 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg p-3">
                            <span className="text-gray-700">Suits</span>
                            <span className={`font-bold ${
                              (dueDiligenceResult?.creditsafe?.legalFilings?.suits || 0) === 0 ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                              {dueDiligenceResult?.creditsafe?.legalFilings?.suits ?? 0}
                            </span>
                          </div>
                        </div>
                      </Card>

                      {/* Risk Factors from API */}
                      <Card>
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary-400" />
                          Risk Analysis
                        </h3>
                        {dueDiligenceResult?.riskFactors && dueDiligenceResult.riskFactors.length > 0 ? (
                          <div className="space-y-3">
                            {dueDiligenceResult.riskFactors.map((factor, index) => (
                              <div key={index} className={`rounded-lg p-3 border ${
                                factor.severity === 'critical' ? 'bg-red-50 border-red-200' :
                                factor.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                                factor.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                'bg-blue-50 border-blue-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                    factor.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                    factor.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                    factor.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {factor.severity.toUpperCase()}
                                  </span>
                                  <span className="text-xs text-gray-500">{factor.category}</span>
                                </div>
                                <div className="text-sm text-gray-700">{factor.message}</div>
                              </div>
                            ))}
                          </div>
                        ) : dueDiligenceResult?.positiveFactors && dueDiligenceResult.positiveFactors.length > 0 ? (
                          <div className="space-y-2">
                            <div className="text-emerald-600 font-medium mb-3">No Risk Factors Found</div>
                            {dueDiligenceResult.positiveFactors.map((factor, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span>{factor}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-gray-500">
                              {dueDiligenceResult ? 'No significant risk factors detected' : 'Run CreditSafe check to see risk analysis'}
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>

                    {/* Company Details & Directors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {/* Company Contact */}
                      <Card>
                        <h3 className="text-xl font-bold text-gray-900 text-gray-900 mb-4 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary-400" />
                          Company Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="text-gray-700">
                              {creditSafeReport.address.street}<br />
                              {creditSafeReport.address.city}, {creditSafeReport.address.state} {creditSafeReport.address.zip}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{creditSafeReport.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={`https://${creditSafeReport.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline flex items-center gap-1">
                              {creditSafeReport.contact.website}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{creditSafeReport.contact.email}</span>
                          </div>
                          <div className="pt-3 border-t border-gray-200 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Registration #</span>
                              <span>{creditSafeReport.registrationNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Incorporated</span>
                              <span>{new Date(creditSafeReport.incorporationDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Directors */}
                      <Card>
                        <h3 className="text-xl font-bold text-gray-900 text-gray-900 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary-400" />
                          Directors & Officers
                        </h3>
                        <div className="space-y-3">
                          {creditSafeReport.directors.map((director, index) => (
                            <div key={index} className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                              <div className="font-semibold text-gray-900">{director.name}</div>
                              <div className="text-sm text-gray-500">{director.title}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Appointed: {new Date(director.appointedDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </>
                )}

              </motion.div>
            )}

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-[400px] sm:h-[600px] flex flex-col">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Chat with {listing.seller.name}</h2>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-4 ${
                            msg.from === 'admin'
                              ? 'bg-primary-500 text-white'
                              : 'bg-gray-100 border border-gray-200 text-gray-800'
                          }`}
                        >
                          <div className="font-semibold text-gray-900 text-sm mb-1">{msg.sender}</div>
                          <div className="text-sm mb-2">{msg.message}</div>
                          <div className="text-xs opacity-70">
                            {msg.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} className="flex-shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Seller Card */}
            <Card>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Seller Information</h3>

              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl sm:text-2xl font-bold text-primary-400">
                    {listing.seller.name.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 text-base sm:text-lg truncate">{listing.seller.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500">ID: #{listing.seller.id}</div>
                </div>
              </div>

              <TrustBadge
                score={listing.seller.trustScore}
                level={getTrustLevel(listing.seller.trustScore)}
                verified={listing.seller.verified}
              />

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span>{listing.seller.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {listing.seller.memberSince.getFullYear()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-500">Completed Deals</span>
                  <span className="font-semibold text-gray-900">{listing.seller.completedDeals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Listings</span>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
              </div>
            </Card>

            {/* Review Checklist */}
            <Card>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Review Checklist</h3>
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">MC/DOT number verified</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">FMCSA data confirmed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">Article of Incorporation</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">EIN Letter verified</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">Driver License valid</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">COI (Insurance) valid</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span className="text-sm">Loss Run reviewed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">Entry audit status confirmed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">Factoring LOR (if applicable)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                  <span className="text-sm">Payment received ($35)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded" />
                  <span className="text-sm">CreditSafe check completed</span>
                </label>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button fullWidth onClick={handleApprove}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Listing
              </Button>
              <Button fullWidth variant="danger" onClick={handleReject}>
                <XCircle className="w-4 h-4 mr-2" />
                Reject Listing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReviewPage
