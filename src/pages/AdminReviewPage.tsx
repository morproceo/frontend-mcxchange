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
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import Textarea from '../components/ui/Textarea'
import api from '../services/api'
import { getTrustLevel, formatPrice } from '../utils/helpers'
import { MCListing } from '../types'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchError, setSearchError] = useState('')

  // API data state
  const [listing, setListing] = useState<MCListing | null>(null)
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
            sellerId: data.sellerId || data.seller?.id || '',
            title: data.title || `MC Authority #${data.mcNumber}`,
            description: data.description || '',
            price: data.askingPrice || 0,
            yearsActive: data.yearsActive || 0,
            fleetSize: data.fleetSize || 0,
            operationType: data.operationType || [],
            safetyRating: data.safetyRating || 'satisfactory',
            insuranceStatus: data.insuranceStatus || 'active',
            verified: data.verified || false,
            isPremium: data.isPremium || false,
            trustScore: data.trustScore || 70,
            trustLevel: getTrustLevel(data.trustScore || 70),
            verificationBadges: data.verificationBadges || [],
            state: data.state || '',
            amazonStatus: data.amazonStatus || 'none',
            amazonRelayScore: data.amazonRelayScore || null,
            highwaySetup: data.highwaySetup || false,
            sellingWithEmail: data.sellingWithEmail || false,
            sellingWithPhone: data.sellingWithPhone || false,
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
          } as MCListing
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

  // Extended listing data matching CreateListingPage fields
  const listingDetails = {
    // Basic Info
    mcNumber: listing?.mcNumber || '123456',
    dotNumber: '1234567',
    state: 'TX',

    // FMCSA Data
    legalName: 'Transport Pro Logistics LLC',
    dbaName: 'TransportPro',
    physicalAddress: '1234 Trucking Way, Dallas, TX 75201',
    mailingAddress: '1234 Trucking Way, Dallas, TX 75201',
    phone: '(555) 123-4567',
    powerUnits: '15',
    drivers: '18',
    mcs150Date: '2024-06-15',
    operatingStatus: 'AUTHORIZED',
    entityType: 'CARRIER',
    cargoCarried: ['General Freight', 'Household Goods', 'Metal: sheets, coils, rolls'],

    // Entry Audit
    entryAuditCompleted: 'yes',

    // Amazon & Highway
    amazonStatus: 'active',
    amazonRelayScore: 'A',
    highwaySetup: 'yes',

    // Selling with Email/Phone
    sellingWithEmail: 'yes',
    sellingWithPhone: 'yes',

    // Factoring
    hasFactoring: 'yes',
    factoringCompany: 'RTS Financial',
    factoringRate: '3.5',

    // Payment Info
    invoiceNumber: 'INV-87654321',
    paymentAmount: 35,
    paymentDate: new Date('2024-01-10'),
    paymentStatus: 'paid'
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
    if (activeTab === 'creditsafe' && !creditSafeReport && !isSearching) {
      runAutomaticCreditCheck()
    }
  }, [activeTab])

  const runAutomaticCreditCheck = async () => {
    setIsSearching(true)
    setSearchError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    setCreditSafeReport(generateCreditSafeReport())
    setIsSearching(false)
  }

  // Manual refresh function
  const handleRefreshCreditSafe = async () => {
    setIsSearching(true)
    setCreditSafeReport(null)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    setCreditSafeReport(generateCreditSafeReport())
    setIsSearching(false)
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-low':
        return 'text-trust-high'
      case 'low':
        return 'text-green-400'
      case 'moderate':
        return 'text-yellow-400'
      case 'high':
        return 'text-orange-400'
      case 'very-high':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  const getRiskLevelBg = (riskLevel: string) => {
    switch (riskLevel) {
      case 'very-low':
        return 'bg-trust-high/20 border-trust-high/30'
      case 'low':
        return 'bg-green-400/20 border-green-400/30'
      case 'moderate':
        return 'bg-yellow-400/20 border-yellow-400/30'
      case 'high':
        return 'bg-orange-400/20 border-orange-400/30'
      case 'very-high':
        return 'bg-red-400/20 border-red-400/30'
      default:
        return 'bg-white/10 border-white/20'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-trust-high'
    if (score >= 60) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    if (score >= 20) return 'text-orange-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <GlassCard>
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-white/40 mx-auto mb-4 animate-spin" />
              <h2 className="text-2xl font-bold mb-4">Loading Listing...</h2>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }

  if (fetchError || !listing) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <GlassCard>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">{fetchError || 'Listing Not Found'}</h2>
              <Button onClick={() => navigate('/admin/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </GlassCard>
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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex gap-3">
            <Button variant="danger" onClick={handleReject}>
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 glass rounded-xl p-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'details'
                    ? 'bg-primary-500 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Listing Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'documents'
                    ? 'bg-primary-500 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Documents ({Object.keys(documents).length})
              </button>
              <button
                onClick={() => setActiveTab('creditsafe')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center justify-center gap-2 ${
                  activeTab === 'creditsafe'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <Building2 className="w-4 h-4" />
                CreditSafe Check
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'bg-primary-500 text-white'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                Chat with Seller
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
                <GlassCard className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 -m-6 mb-6 p-6 border-b border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h1 className="text-3xl font-bold">MC #{listingDetails.mcNumber}</h1>
                          <span className="glass-subtle px-3 py-1.5 rounded-full text-xs text-yellow-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        </div>
                        <p className="text-xl text-white/80">{listing?.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-trust-high">
                          ${listing?.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/60 mt-1">Asking Price</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="glass-subtle rounded-lg p-3 text-center">
                      <Hash className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                      <div className="text-xs text-white/60">MC Number</div>
                      <div className="font-bold">{listingDetails.mcNumber}</div>
                    </div>
                    <div className="glass-subtle rounded-lg p-3 text-center">
                      <Hash className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <div className="text-xs text-white/60">DOT Number</div>
                      <div className="font-bold">{listingDetails.dotNumber}</div>
                    </div>
                    <div className="glass-subtle rounded-lg p-3 text-center">
                      <MapPin className="w-5 h-5 text-pink-400 mx-auto mb-1" />
                      <div className="text-xs text-white/60">State</div>
                      <div className="font-bold">{listingDetails.state}</div>
                    </div>
                    <div className="glass-subtle rounded-lg p-3 text-center">
                      <Shield className="w-5 h-5 text-trust-high mx-auto mb-1" />
                      <div className="text-xs text-white/60">Status</div>
                      <div className="font-bold text-trust-high">{listingDetails.operatingStatus}</div>
                    </div>
                  </div>
                </GlassCard>

                {/* FMCSA Information */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                      <Building2 className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">FMCSA Information</h2>
                      <p className="text-sm text-white/60">Data from official FMCSA records</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                          <Building2 className="w-4 h-4" />
                          Legal Name
                        </div>
                        <div className="font-semibold">{listingDetails.legalName}</div>
                      </div>
                      {listingDetails.dbaName && (
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                            DBA Name
                          </div>
                          <div className="font-semibold">{listingDetails.dbaName}</div>
                        </div>
                      )}
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                          <MapPin className="w-4 h-4" />
                          Physical Address
                        </div>
                        <div className="font-semibold">{listingDetails.physicalAddress}</div>
                      </div>
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                          <Phone className="w-4 h-4" />
                          Phone
                        </div>
                        <div className="font-semibold">{listingDetails.phone}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                            <TruckIcon className="w-4 h-4" />
                            Power Units
                          </div>
                          <div className="text-2xl font-bold">{listingDetails.powerUnits}</div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                            <Users className="w-4 h-4" />
                            Drivers
                          </div>
                          <div className="text-2xl font-bold">{listingDetails.drivers}</div>
                        </div>
                      </div>
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="flex items-center gap-2 text-white/60 text-sm mb-1">
                          <Calendar className="w-4 h-4" />
                          MCS-150 Date
                        </div>
                        <div className="font-semibold">{listingDetails.mcs150Date}</div>
                      </div>
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-2">Cargo Carried</div>
                        <div className="flex flex-wrap gap-2">
                          {listingDetails.cargoCarried.map((cargo, i) => (
                            <span key={i} className="px-2 py-1 rounded-full bg-white/10 text-xs">
                              {cargo}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Entry Audit Status */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-yellow-500/20">
                      <ClipboardCheck className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Entry Audit Status</h2>
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 border ${listingDetails.entryAuditCompleted === 'yes' ? 'bg-trust-high/10 border-trust-high/30' : 'bg-yellow-400/10 border-yellow-400/30'}`}>
                    <div className="flex items-center gap-3">
                      {listingDetails.entryAuditCompleted === 'yes' ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-trust-high" />
                          <div>
                            <div className="font-bold text-trust-high">Entry Audit Completed</div>
                            <div className="text-sm text-white/60">This authority has passed the entry audit</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-6 h-6 text-yellow-400" />
                          <div>
                            <div className="font-bold text-yellow-400">Entry Audit Pending</div>
                            <div className="text-sm text-white/60">Entry audit has not been completed yet</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Platform Integrations */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Platform Integrations</h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="glass-subtle rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📦</span>
                        <span className="font-semibold">Amazon Relay</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/60">Status</span>
                          <span className={`font-bold ${listingDetails.amazonStatus === 'active' ? 'text-trust-high' : 'text-yellow-400'}`}>
                            {listingDetails.amazonStatus === 'active' ? '✅ Active' : listingDetails.amazonStatus}
                          </span>
                        </div>
                        {listingDetails.amazonStatus === 'active' && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Relay Score</span>
                            <span className="font-bold text-trust-high">{listingDetails.amazonRelayScore}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="glass-subtle rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🛣️</span>
                        <span className="font-semibold">Highway Setup</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Status</span>
                        <span className={`font-bold ${listingDetails.highwaySetup === 'yes' ? 'text-trust-high' : 'text-yellow-400'}`}>
                          {listingDetails.highwaySetup === 'yes' ? '✅ Setup Complete' : 'Not Setup'}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* What's Included in Sale */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20">
                      <Package className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">What's Included in Sale</h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`rounded-xl p-4 border flex items-center gap-4 ${listingDetails.sellingWithEmail === 'yes' ? 'bg-trust-high/10 border-trust-high/30' : 'bg-white/5 border-white/10'}`}>
                      <Mail className={`w-6 h-6 ${listingDetails.sellingWithEmail === 'yes' ? 'text-trust-high' : 'text-white/40'}`} />
                      <div>
                        <div className="font-semibold">Business Email</div>
                        <div className="text-sm text-white/60">
                          {listingDetails.sellingWithEmail === 'yes' ? 'Included with sale' : 'Not included'}
                        </div>
                      </div>
                      {listingDetails.sellingWithEmail === 'yes' && <CheckCircle className="w-5 h-5 text-trust-high ml-auto" />}
                    </div>

                    <div className={`rounded-xl p-4 border flex items-center gap-4 ${listingDetails.sellingWithPhone === 'yes' ? 'bg-trust-high/10 border-trust-high/30' : 'bg-white/5 border-white/10'}`}>
                      <Phone className={`w-6 h-6 ${listingDetails.sellingWithPhone === 'yes' ? 'text-trust-high' : 'text-white/40'}`} />
                      <div>
                        <div className="font-semibold">Business Phone</div>
                        <div className="text-sm text-white/60">
                          {listingDetails.sellingWithPhone === 'yes' ? 'Included with sale' : 'Not included'}
                        </div>
                      </div>
                      {listingDetails.sellingWithPhone === 'yes' && <CheckCircle className="w-5 h-5 text-trust-high ml-auto" />}
                    </div>
                  </div>
                </GlassCard>

                {/* Factoring Information */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                      <Percent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Factoring Information</h2>
                    </div>
                  </div>

                  {listingDetails.hasFactoring === 'yes' ? (
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-1">Has Factoring</div>
                        <div className="font-bold text-trust-high flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          Yes
                        </div>
                      </div>
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-1">Factoring Company</div>
                        <div className="font-bold">{listingDetails.factoringCompany}</div>
                      </div>
                      <div className="glass-subtle rounded-lg p-4">
                        <div className="text-white/60 text-sm mb-1">Factoring Rate</div>
                        <div className="font-bold">{listingDetails.factoringRate}%</div>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-subtle rounded-lg p-4 text-center">
                      <XCircle className="w-8 h-8 text-white/40 mx-auto mb-2" />
                      <div className="text-white/60">No factoring agreement</div>
                    </div>
                  )}
                </GlassCard>

                {/* Authority Details */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                      <TruckIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Authority Details</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="glass-subtle rounded-lg p-4">
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>Years Active</span>
                      </div>
                      <div className="text-2xl font-bold">{listing?.yearsActive} years</div>
                    </div>

                    <div className="glass-subtle rounded-lg p-4">
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                        <TruckIcon className="w-4 h-4" />
                        <span>Fleet Size</span>
                      </div>
                      <div className="text-2xl font-bold">{listing?.fleetSize} trucks</div>
                    </div>

                    <div className="glass-subtle rounded-lg p-4">
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Safety Rating</span>
                      </div>
                      <div className="text-lg font-bold capitalize text-trust-high">
                        {listing?.safetyRating.replace('-', ' ')}
                      </div>
                    </div>

                    <div className="glass-subtle rounded-lg p-4">
                      <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                        <Shield className="w-4 h-4" />
                        <span>Insurance</span>
                      </div>
                      <div className="text-lg font-bold capitalize text-trust-high">{listing?.insuranceStatus}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-white/60 text-sm mb-2">Operation Types</div>
                    <div className="flex flex-wrap gap-2">
                      {listing?.operationType.map((type) => (
                        <span
                          key={type}
                          className="glass-subtle px-3 py-1.5 rounded-full text-sm"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                {/* Payment Information */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                      <Receipt className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Payment Information</h2>
                      <p className="text-sm text-white/60">Listing activation fee</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-white/60 text-sm">Invoice Number</div>
                        <div className="font-bold">{listingDetails.invoiceNumber}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-white/60 text-sm">Payment Date</div>
                        <div className="font-semibold">{listingDetails.paymentDate.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <div>
                        <div className="text-white/60 text-sm">Amount Paid</div>
                        <div className="text-2xl font-bold text-trust-high">${listingDetails.paymentAmount}.00</div>
                      </div>
                      <div className={`px-4 py-2 rounded-full ${listingDetails.paymentStatus === 'paid' ? 'bg-trust-high/20 text-trust-high' : 'bg-yellow-400/20 text-yellow-400'}`}>
                        <div className="flex items-center gap-2 font-semibold">
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
                </GlassCard>

                {/* Description */}
                <GlassCard>
                  <h2 className="text-xl font-bold mb-4">Listing Description</h2>
                  <p className="text-white/80 leading-relaxed">{listing?.description}</p>
                </GlassCard>
              </motion.div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard className="overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 -m-6 mb-6 p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">Required Documents</h2>
                        <p className="text-white/60">
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
                              className={`rounded-xl p-4 flex items-center justify-between transition-colors border ${
                                doc.verified
                                  ? 'bg-trust-high/5 border-trust-high/20 hover:bg-trust-high/10'
                                  : 'glass-subtle border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  doc.verified ? 'bg-trust-high/20' : 'bg-primary-500/20'
                                }`}>
                                  <IconComponent className={`w-6 h-6 ${doc.verified ? 'text-trust-high' : 'text-primary-400'}`} />
                                </div>
                                <div>
                                  <div className="font-semibold mb-1">{doc.name}</div>
                                  <div className="text-sm text-white/60 flex items-center gap-3">
                                    <span>{reqDoc.label}</span>
                                    <span>•</span>
                                    <span>{doc.size}</span>
                                    <span>•</span>
                                    <span>Uploaded {doc.uploadedAt.toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {doc.verified ? (
                                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-trust-high/20 text-trust-high text-sm font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    Verified
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400/20 text-yellow-400 text-sm font-medium">
                                    <Clock className="w-4 h-4" />
                                    Pending Review
                                  </span>
                                )}
                                <Button size="sm" variant="secondary">
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                                <button
                                  onClick={() => handleRemoveDocument(reqDoc.type)}
                                  className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                                  title="Remove document"
                                >
                                  <XCircle className="w-5 h-5" />
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
                              <div className="p-6 flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  isDragOver ? 'bg-primary-500/20' : 'bg-red-500/20'
                                }`}>
                                  <IconComponent className={`w-6 h-6 ${isDragOver ? 'text-primary-400' : 'text-red-400'}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">{reqDoc.label}</span>
                                    {reqDoc.required && (
                                      <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 font-medium">
                                        Required
                                      </span>
                                    )}
                                    {!reqDoc.required && (
                                      <span className="px-2 py-0.5 rounded text-xs bg-white/10 text-white/60 font-medium">
                                        Optional
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-white/60">
                                    {isDragOver ? 'Drop file here...' : 'Drag & drop file here or click to upload'}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm font-medium">
                                    <AlertTriangle className="w-4 h-4" />
                                    Missing
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleFileUpload(reqDoc.type)}
                                    className={isDragOver ? 'bg-primary-500' : ''}
                                  >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload
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
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {/* Missing documents warning */}
                    {Object.values(documents).some(d => d === null) && (
                      <div className="mb-4 p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-400 mb-1">Missing Documents</p>
                          <p className="text-sm text-white/70">
                            Some required documents are missing. You can upload them on behalf of the seller or request them to re-upload.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-white/60">
                        <span className="text-trust-high font-medium">
                          {Object.values(documents).filter(d => d?.verified).length}
                        </span> verified •
                        <span className="text-yellow-400 font-medium ml-1">
                          {Object.values(documents).filter(d => d && !d.verified).length}
                        </span> pending •
                        <span className="text-red-400 font-medium ml-1">
                          {Object.values(documents).filter(d => d === null).length}
                        </span> missing
                      </div>
                      <div className="flex gap-3">
                        <Button variant="secondary">
                          <Mail className="w-4 h-4 mr-2" />
                          Request Re-upload
                        </Button>
                        <Button>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify All Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
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
                  <GlassCard className="py-16">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 rounded-full border-4 border-primary-500/30 border-t-primary-500 mx-auto mb-6"
                      />
                      <h3 className="text-xl font-bold mb-2">Running CreditSafe Check...</h3>
                      <p className="text-white/60 mb-4">Analyzing business health for {listingDetails.legalName}</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-white/40">
                        <Building2 className="w-4 h-4" />
                        <span>DOT #{listingDetails.dotNumber}</span>
                        <span>•</span>
                        <span>MC #{listingDetails.mcNumber}</span>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {/* CreditSafe Report */}
                {creditSafeReport && (
                  <>
                    {/* Header with Refresh */}
                    <GlassCard className="overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 -m-6 mb-0 p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                              <Building2 className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold">CreditSafe Business Report</h2>
                              <div className="flex items-center gap-2 text-sm text-white/60">
                                <CheckCircle className="w-4 h-4 text-trust-high" />
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
                    </GlassCard>

                    {/* Credit Score Overview */}
                    <GlassCard>
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">{creditSafeReport.companyName}</h3>
                          <p className="text-white/60">{creditSafeReport.tradingName}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="glass-subtle px-2 py-1 rounded text-xs text-trust-high">
                              {creditSafeReport.companyStatus}
                            </span>
                            <span className="glass-subtle px-2 py-1 rounded text-xs">
                              {creditSafeReport.companyType}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/40 mb-1">Last Updated</div>
                          <div className="text-sm text-white/60">
                            {new Date(creditSafeReport.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Credit Score Card */}
                      <div className={`rounded-xl p-6 border ${getRiskLevelBg(creditSafeReport.creditScore.riskLevel)}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-white/60 mb-2">Business Health Score</div>
                            <div className="flex items-baseline gap-3">
                              <span className={`text-5xl font-bold ${getScoreColor(creditSafeReport.creditScore.score)}`}>
                                {creditSafeReport.creditScore.score}
                              </span>
                              <span className="text-xl text-white/40">/ {creditSafeReport.creditScore.maxScore}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`text-lg font-semibold ${getScoreColor(creditSafeReport.creditScore.score)}`}>
                                Rating: {creditSafeReport.creditScore.rating}
                              </span>
                              {creditSafeReport.creditScore.trend === 'up' && (
                                <TrendingUp className="w-5 h-5 text-trust-high" />
                              )}
                              {creditSafeReport.creditScore.trend === 'down' && (
                                <TrendingDown className="w-5 h-5 text-red-400" />
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-white/60 mb-2">Risk Level</div>
                            <div className={`text-2xl font-bold capitalize ${getRiskLevelColor(creditSafeReport.creditScore.riskLevel)}`}>
                              {creditSafeReport.creditScore.riskLevel.replace('-', ' ')}
                            </div>
                          </div>
                        </div>

                        {/* Score Bar */}
                        <div className="mt-6">
                          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${creditSafeReport.creditScore.score}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className={`h-full rounded-full ${
                                creditSafeReport.creditScore.score >= 80 ? 'bg-trust-high' :
                                creditSafeReport.creditScore.score >= 60 ? 'bg-green-400' :
                                creditSafeReport.creditScore.score >= 40 ? 'bg-yellow-400' :
                                creditSafeReport.creditScore.score >= 20 ? 'bg-orange-400' : 'bg-red-400'
                              }`}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-xs text-white/40">
                            <span>Very High Risk</span>
                            <span>Very Low Risk</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Financial Summary */}
                    <GlassCard>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary-400" />
                        Financial Summary
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Annual Revenue</span>
                          </div>
                          <div className="text-xl font-bold text-trust-high">
                            {formatPrice(creditSafeReport.financialSummary.annualRevenue)}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Net Worth</span>
                          </div>
                          <div className="text-xl font-bold">
                            {formatPrice(creditSafeReport.financialSummary.netWorth)}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <Activity className="w-4 h-4" />
                            <span>Total Assets</span>
                          </div>
                          <div className="text-xl font-bold">
                            {formatPrice(creditSafeReport.financialSummary.totalAssets)}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <TrendingDown className="w-4 h-4" />
                            <span>Total Liabilities</span>
                          </div>
                          <div className="text-xl font-bold text-orange-400">
                            {formatPrice(creditSafeReport.financialSummary.totalLiabilities)}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <Users className="w-4 h-4" />
                            <span>Employees</span>
                          </div>
                          <div className="text-xl font-bold">
                            {creditSafeReport.financialSummary.employeeCount}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                            <Calendar className="w-4 h-4" />
                            <span>Year Established</span>
                          </div>
                          <div className="text-xl font-bold">
                            {creditSafeReport.financialSummary.yearEstablished}
                          </div>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Payment Behavior */}
                    <GlassCard>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-primary-400" />
                        Payment Behavior
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="glass-subtle rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-trust-high mb-1">
                            {creditSafeReport.paymentBehavior.onTimePayments}%
                          </div>
                          <div className="text-xs text-white/60">On-Time Payments</div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-yellow-400 mb-1">
                            {creditSafeReport.paymentBehavior.latePayments}%
                          </div>
                          <div className="text-xs text-white/60">Late Payments</div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold text-red-400 mb-1">
                            {creditSafeReport.paymentBehavior.severelyLate}%
                          </div>
                          <div className="text-xs text-white/60">Severely Late</div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4 text-center">
                          <div className="text-3xl font-bold mb-1">
                            {creditSafeReport.paymentBehavior.dbtScore}
                          </div>
                          <div className="text-xs text-white/60">Days Beyond Terms</div>
                        </div>
                      </div>

                      <div className="glass-subtle rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60">Payment Index</span>
                          <span className="font-bold">{creditSafeReport.paymentBehavior.paymentIndex}/100</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${creditSafeReport.paymentBehavior.paymentIndex}%` }}
                          />
                        </div>
                      </div>
                    </GlassCard>

                    {/* Legal & Industry */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Legal Filings */}
                      <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-primary-400" />
                          Legal Filings
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between glass-subtle rounded-lg p-3">
                            <span className="text-white/80">Bankruptcies</span>
                            <span className={`font-bold ${creditSafeReport.legalFilings.bankruptcies === 0 ? 'text-trust-high' : 'text-red-400'}`}>
                              {creditSafeReport.legalFilings.bankruptcies}
                            </span>
                          </div>
                          <div className="flex items-center justify-between glass-subtle rounded-lg p-3">
                            <span className="text-white/80">Liens</span>
                            <span className={`font-bold ${creditSafeReport.legalFilings.liens === 0 ? 'text-trust-high' : 'text-yellow-400'}`}>
                              {creditSafeReport.legalFilings.liens}
                            </span>
                          </div>
                          <div className="flex items-center justify-between glass-subtle rounded-lg p-3">
                            <span className="text-white/80">Judgments</span>
                            <span className={`font-bold ${creditSafeReport.legalFilings.judgments === 0 ? 'text-trust-high' : 'text-red-400'}`}>
                              {creditSafeReport.legalFilings.judgments}
                            </span>
                          </div>
                          <div className="flex items-center justify-between glass-subtle rounded-lg p-3">
                            <span className="text-white/80">UCC Filings</span>
                            <span className="font-bold">{creditSafeReport.legalFilings.uccFilings}</span>
                          </div>
                        </div>
                      </GlassCard>

                      {/* Industry Comparison */}
                      <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary-400" />
                          Industry Comparison
                        </h3>
                        <div className="text-center mb-4">
                          <div className="text-sm text-white/60 mb-2">
                            {creditSafeReport.industryComparison.industryName}
                          </div>
                          <div className="text-4xl font-bold text-primary-400">
                            Top {100 - creditSafeReport.industryComparison.percentile}%
                          </div>
                          <div className="text-sm text-white/60 mt-1">
                            Better than {creditSafeReport.industryComparison.percentile}% of peers
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white/60">This Company</span>
                            <span className="font-bold text-primary-400">{creditSafeReport.creditScore.score}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-white/60">Industry Average</span>
                            <span className="font-bold">{creditSafeReport.industryComparison.industryAverage}</span>
                          </div>
                        </div>
                      </GlassCard>
                    </div>

                    {/* Company Details & Directors */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Company Contact */}
                      <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary-400" />
                          Company Details
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-white/40 mt-1 flex-shrink-0" />
                            <div className="text-white/80">
                              {creditSafeReport.address.street}<br />
                              {creditSafeReport.address.city}, {creditSafeReport.address.state} {creditSafeReport.address.zip}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-white/40" />
                            <span className="text-white/80">{creditSafeReport.contact.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-white/40" />
                            <a href={`https://${creditSafeReport.contact.website}`} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline flex items-center gap-1">
                              {creditSafeReport.contact.website}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-white/40" />
                            <span className="text-white/80">{creditSafeReport.contact.email}</span>
                          </div>
                          <div className="pt-3 border-t border-white/10 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/60">Registration #</span>
                              <span>{creditSafeReport.registrationNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Incorporated</span>
                              <span>{new Date(creditSafeReport.incorporationDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>

                      {/* Directors */}
                      <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary-400" />
                          Directors & Officers
                        </h3>
                        <div className="space-y-3">
                          {creditSafeReport.directors.map((director, index) => (
                            <div key={index} className="glass-subtle rounded-lg p-3">
                              <div className="font-semibold">{director.name}</div>
                              <div className="text-sm text-white/60">{director.title}</div>
                              <div className="text-xs text-white/40 mt-1">
                                Appointed: {new Date(director.appointedDate).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
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
                <GlassCard className="h-[600px] flex flex-col">
                  <h2 className="text-xl font-bold mb-4">Chat with {listing.seller.name}</h2>

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
                              : 'glass-subtle text-white/90'
                          }`}
                        >
                          <div className="font-semibold text-sm mb-1">{msg.sender}</div>
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
                </GlassCard>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <GlassCard>
              <h3 className="text-lg font-bold mb-4">Seller Information</h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-400">
                    {listing.seller.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-lg">{listing.seller.name}</div>
                  <div className="text-sm text-white/60">Member ID: #{listing.seller.id}</div>
                </div>
              </div>

              <TrustBadge
                score={listing.seller.trustScore}
                level={getTrustLevel(listing.seller.trustScore)}
                verified={listing.seller.verified}
              />

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <Mail className="w-4 h-4" />
                  <span>{listing.seller.email}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {listing.seller.memberSince.getFullYear()}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/10">
                  <span className="text-white/60">Completed Deals</span>
                  <span className="font-semibold">{listing.seller.completedDeals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Total Listings</span>
                  <span className="font-semibold">3</span>
                </div>
              </div>
            </GlassCard>

            {/* Review Checklist */}
            <GlassCard>
              <h3 className="text-lg font-bold mb-4">Review Checklist</h3>
              <div className="space-y-3">
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
            </GlassCard>

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
