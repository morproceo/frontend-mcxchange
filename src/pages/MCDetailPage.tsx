import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  Calendar,
  TruckIcon,
  ShieldCheck,
  FileText,
  Lock,
  Unlock,
  MessageSquare,
  Eye,
  Heart,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Building2,
  Package,
  Zap,
  Percent,
  ClipboardCheck,
  Hash,
  XCircle,
  Coins,
  CreditCard,
  Sparkles,
  Crown,
  X,
  Send,
  AlertTriangle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import Textarea from '../components/ui/Textarea'
import Input from '../components/ui/Input'
import { mockListings } from '../utils/mockData'
import { formatDistanceToNow } from 'date-fns'
import { getPartialMCNumber, getTrustLevel } from '../utils/helpers'

const MCDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const listing = mockListings.find(l => l.id === id)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [userCredits, setUserCredits] = useState(4) // Mock user credits
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [premiumRequestSent, setPremiumRequestSent] = useState(false)
  const [premiumMessage, setPremiumMessage] = useState('')
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [messageSent, setMessageSent] = useState(false)

  // Check if listing is premium (mock - in real app would come from listing data)
  const isPremiumListing = listing?.price && listing.price > 50000 // Mock: listings over $50k are premium

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
    phone: '(555) 123-4567',
    powerUnits: '15',
    drivers: '18',
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

    // Safety Record (FMCSA)
    safetyRecord: {
      saferScore: 'Satisfactory',
      totalInspections: 47,
      outOfServiceRate: 4.2,
      totalCrashes: 0,
      basicScores: {
        unsafeDriving: 12,
        hoursOfService: 8,
        driverFitness: 0,
        controlledSubstances: 0,
        vehicleMaintenance: 15,
        hazmat: 0,
        crashIndicator: 5
      }
    }
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Listing Not Found</h2>
            <Button onClick={() => navigate('/marketplace')}>
              Back to Marketplace
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const handleUnlockWithCredit = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (userCredits < 1) {
      navigate('/buyer/subscription')
      return
    }
    setUserCredits(prev => prev - 1)
    setIsUnlocked(true)
  }

  const handlePremiumRequest = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setShowPremiumModal(true)
  }

  const handleSubmitPremiumRequest = async () => {
    // Simulate sending request to admin
    await new Promise(resolve => setTimeout(resolve, 1000))
    setPremiumRequestSent(true)
    setShowPremiumModal(false)
    setPremiumMessage('')
  }

  const handleContactClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setShowContactModal(true)
  }

  const handleSubmitContact = async () => {
    // Simulate sending message to admin
    await new Promise(resolve => setTimeout(resolve, 1000))
    setMessageSent(true)
    setShowContactModal(false)
    setContactMessage('')
    setContactPhone('')
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 via-indigo-50 to-purple-50 -m-6 mb-6 p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        MC #{isUnlocked ? listing.mcNumber : getPartialMCNumber(listing.mcNumber)}
                      </h1>
                      {isPremiumListing && (
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300">
                          <Crown className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs font-bold text-yellow-600">PREMIUM</span>
                        </div>
                      )}
                      {!isUnlocked && !isPremiumListing && (
                        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Lock className="w-3 h-3 text-yellow-600" />
                          <span className="text-xs text-yellow-600">Locked</span>
                        </div>
                      )}
                    </div>
                    <p className="text-xl text-gray-700">{listing.title}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-600">
                      ${listing.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">Asking Price</div>
                  </div>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Hash className="w-5 h-5 text-indigo-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">MC Number</div>
                  <div className="font-bold text-gray-900">{isUnlocked ? listingDetails.mcNumber : '••••••'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Hash className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">DOT Number</div>
                  <div className="font-bold text-gray-900">{isUnlocked ? listingDetails.dotNumber : '••••••'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <MapPin className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">State</div>
                  <div className="font-bold text-gray-900">{listingDetails.state}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <Shield className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <div className="text-xs text-gray-500">Status</div>
                  <div className="font-bold text-emerald-600 text-sm">{listingDetails.operatingStatus}</div>
                </div>
              </div>

              <TrustBadge
                score={listing.trustScore}
                level={getTrustLevel(listing.trustScore)}
                verified={listing.verified}
                size="lg"
              />

              <div className="mt-6 flex flex-wrap gap-2">
                {listing.verificationBadges.map((badge) => (
                  <div key={badge} className="bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-indigo-500" />
                    <span className="text-xs text-gray-700">{badge}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{listing.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{listing.saves} saves</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Listed {formatDistanceToNow(listing.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Description</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </Card>

            {/* Key Details */}
            <Card>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Key Details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Years Active</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{listing.yearsActive} years</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <TruckIcon className="w-4 h-4" />
                    <span>Fleet Size</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{listing.fleetSize} trucks</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Safety Rating</span>
                  </div>
                  <div className="text-lg font-bold capitalize text-gray-900">
                    {listing.safetyRating.replace('-', ' ')}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                    <Shield className="w-4 h-4" />
                    <span>Insurance</span>
                  </div>
                  <div className="text-lg font-bold capitalize text-gray-900">{listing.insuranceStatus}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-gray-500 text-sm mb-2">Operation Types</div>
                <div className="flex flex-wrap gap-2">
                  {listing.operationType.map((type) => (
                    <span
                      key={type}
                      className="bg-gray-100 px-3 py-1.5 rounded-full text-sm text-gray-700"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            {/* Platform Integrations - Amazon & Highway */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20">
                  <Zap className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Platform Integrations</h2>
                  <p className="text-sm text-gray-500">Load board and carrier network status</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Amazon Relay */}
                <div className={`rounded-xl p-4 border ${listingDetails.amazonStatus === 'active' ? 'bg-trust-high/5 border-trust-high/20' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">📦</span>
                    <div className="flex-1">
                      <span className="font-semibold text-lg">Amazon Relay</span>
                      <div className={`text-sm ${listingDetails.amazonStatus === 'active' ? 'text-trust-high' : 'text-yellow-400'}`}>
                        {listingDetails.amazonStatus === 'active' ? '✅ Active' : listingDetails.amazonStatus === 'suspended' ? '⚠️ Suspended' : '⏳ Pending'}
                      </div>
                    </div>
                  </div>
                  {listingDetails.amazonStatus === 'active' && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Relay Score</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${
                            listingDetails.amazonRelayScore === 'A' ? 'text-trust-high' :
                            listingDetails.amazonRelayScore === 'B' ? 'text-green-400' :
                            listingDetails.amazonRelayScore === 'C' ? 'text-yellow-400' :
                            listingDetails.amazonRelayScore === 'D' ? 'text-orange-400' : 'text-red-400'
                          }`}>
                            {listingDetails.amazonRelayScore}
                          </span>
                          {listingDetails.amazonRelayScore === 'A' && (
                            <span className="px-2 py-0.5 rounded text-xs bg-trust-high/20 text-trust-high font-medium">Excellent</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Highway Setup */}
                <div className={`rounded-xl p-4 border ${listingDetails.highwaySetup === 'yes' ? 'bg-trust-high/5 border-trust-high/20' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🛣️</span>
                    <div className="flex-1">
                      <span className="font-semibold text-lg">Highway</span>
                      <div className={`text-sm ${listingDetails.highwaySetup === 'yes' ? 'text-trust-high' : 'text-gray-500'}`}>
                        {listingDetails.highwaySetup === 'yes' ? '✅ Setup Complete' : '❌ Not Setup'}
                      </div>
                    </div>
                  </div>
                  {listingDetails.highwaySetup === 'yes' && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                        <span>Verified carrier profile</span>
                      </div>
                    </div>
                  )}
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
                  <h2 className="text-xl font-bold">What's Included in Sale</h2>
                  <p className="text-sm text-gray-500">Assets transferring with this authority</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-xl p-4 border flex items-center gap-4 ${listingDetails.sellingWithEmail === 'yes' ? 'bg-trust-high/10 border-trust-high/30' : 'bg-white/5 border-white/10'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${listingDetails.sellingWithEmail === 'yes' ? 'bg-trust-high/20' : 'bg-white/10'}`}>
                    <Mail className={`w-6 h-6 ${listingDetails.sellingWithEmail === 'yes' ? 'text-trust-high' : 'text-white/40'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Business Email</div>
                    <div className="text-sm text-gray-500">
                      {listingDetails.sellingWithEmail === 'yes' ? 'Included with sale' : 'Not included'}
                    </div>
                  </div>
                  {listingDetails.sellingWithEmail === 'yes' ? (
                    <CheckCircle className="w-6 h-6 text-trust-high" />
                  ) : (
                    <XCircle className="w-6 h-6 text-white/30" />
                  )}
                </div>

                <div className={`rounded-xl p-4 border flex items-center gap-4 ${listingDetails.sellingWithPhone === 'yes' ? 'bg-trust-high/10 border-trust-high/30' : 'bg-white/5 border-white/10'}`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${listingDetails.sellingWithPhone === 'yes' ? 'bg-trust-high/20' : 'bg-white/10'}`}>
                    <Phone className={`w-6 h-6 ${listingDetails.sellingWithPhone === 'yes' ? 'text-trust-high' : 'text-white/40'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Business Phone</div>
                    <div className="text-sm text-gray-500">
                      {listingDetails.sellingWithPhone === 'yes' ? 'Included with sale' : 'Not included'}
                    </div>
                  </div>
                  {listingDetails.sellingWithPhone === 'yes' ? (
                    <CheckCircle className="w-6 h-6 text-trust-high" />
                  ) : (
                    <XCircle className="w-6 h-6 text-white/30" />
                  )}
                </div>
              </div>
            </Card>

            {/* Entry Audit & Factoring */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
                  <ClipboardCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Compliance & Financials</h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Entry Audit */}
                <div className={`rounded-xl p-4 border ${listingDetails.entryAuditCompleted === 'yes' ? 'bg-trust-high/10 border-trust-high/30' : 'bg-yellow-400/10 border-yellow-400/30'}`}>
                  <div className="flex items-center gap-3">
                    {listingDetails.entryAuditCompleted === 'yes' ? (
                      <CheckCircle className="w-8 h-8 text-trust-high" />
                    ) : (
                      <ClipboardCheck className="w-8 h-8 text-yellow-400" />
                    )}
                    <div>
                      <div className={`font-bold ${listingDetails.entryAuditCompleted === 'yes' ? 'text-trust-high' : 'text-yellow-400'}`}>
                        Entry Audit {listingDetails.entryAuditCompleted === 'yes' ? 'Completed' : 'Pending'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {listingDetails.entryAuditCompleted === 'yes' ? 'Authority passed audit' : 'Audit not completed'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Factoring */}
                <div className={`rounded-xl p-4 border ${listingDetails.hasFactoring === 'yes' ? 'bg-cyan-400/10 border-cyan-400/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Percent className={`w-8 h-8 ${listingDetails.hasFactoring === 'yes' ? 'text-cyan-400' : 'text-white/40'}`} />
                    <div>
                      <div className="font-bold">
                        {listingDetails.hasFactoring === 'yes' ? 'Active Factoring' : 'No Factoring'}
                      </div>
                      {listingDetails.hasFactoring === 'yes' && (
                        <div className="text-sm text-gray-500">
                          {listingDetails.factoringCompany} • {listingDetails.factoringRate}% rate
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Safety Record (FMCSA) */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Safety Record (FMCSA)</h2>
                    <p className="text-sm text-gray-500">Federal Motor Carrier Safety Administration</p>
                  </div>
                </div>
                {!isUnlocked && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-300">
                    <Lock className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-medium text-yellow-700">Unlock for full details</span>
                  </div>
                )}
              </div>

              {/* Always visible summary */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl mb-4">
                <span className="font-medium text-gray-900">SAFER Rating</span>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-lg">
                  {listingDetails.safetyRecord.saferScore}
                </span>
              </div>

              {isUnlocked ? (
                // Full safety record when unlocked
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{listingDetails.safetyRecord.totalInspections}</p>
                      <p className="text-sm text-gray-500">Inspections</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{listingDetails.safetyRecord.outOfServiceRate}%</p>
                      <p className="text-sm text-gray-500">OOS Rate</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{listingDetails.safetyRecord.totalCrashes}</p>
                      <p className="text-sm text-gray-500">Crashes</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-3">BASIC Scores</p>
                    <div className="space-y-2">
                      {Object.entries(listingDetails.safetyRecord.basicScores).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-40 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                value <= 25 ? 'bg-green-500' :
                                value <= 50 ? 'bg-yellow-500' :
                                value <= 75 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(value, 100)}%` }}
                            />
                          </div>
                          <span className={`text-sm font-medium w-12 text-right ${
                            value <= 25 ? 'text-green-600' :
                            value <= 50 ? 'text-yellow-600' :
                            value <= 75 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {value}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      * Lower BASIC scores are better. Scores above 75% may trigger FMCSA intervention.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">Safety Summary</p>
                        <p className="text-sm text-blue-700 mt-1">
                          This carrier has a {listingDetails.safetyRecord.saferScore.toLowerCase()} safety rating with
                          {listingDetails.safetyRecord.totalCrashes === 0 ? ' no recorded crashes' : ` ${listingDetails.safetyRecord.totalCrashes} recorded crashes`} and
                          a {listingDetails.safetyRecord.outOfServiceRate}% out-of-service rate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Locked state - show teaser
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-300">--</p>
                      <p className="text-sm text-gray-400">Inspections</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-300">--%</p>
                      <p className="text-sm text-gray-400">OOS Rate</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex items-center justify-center">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-300">--</p>
                      <p className="text-sm text-gray-400">Crashes</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <Lock className="w-4 h-4" />
                      <span className="font-medium">BASIC Scores Locked</span>
                    </div>
                    <div className="space-y-2">
                      {['Unsafe Driving', 'Hours of Service', 'Vehicle Maintenance'].map((label) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 w-40">{label}</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full" />
                          <span className="text-sm text-gray-400 w-12 text-right">--%</span>
                        </div>
                      ))}
                      <p className="text-xs text-gray-400 mt-2 italic">+ 4 more categories</p>
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                    <Coins className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-yellow-700 font-medium">Unlock to view full safety record</p>
                    <p className="text-xs text-yellow-600 mt-1">Includes detailed BASIC scores, inspection history & crash data</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Compliance & Status Checks */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Verification Checks</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-trust-high/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                      </div>
                      <span className="font-semibold">Carrier 411</span>
                    </div>
                  </div>
                  <p className="text-sm text-trust-high">No Issues Found</p>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-trust-high/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                      </div>
                      <span className="font-semibold">UCC Liens</span>
                    </div>
                  </div>
                  <p className="text-sm text-trust-high">No Active Liens</p>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-trust-high/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                      </div>
                      <span className="font-semibold">SAFER/FMCSA</span>
                    </div>
                  </div>
                  <p className="text-sm text-trust-high">Active Authority</p>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-trust-high/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                      </div>
                      <span className="font-semibold">Insurance</span>
                    </div>
                  </div>
                  <p className="text-sm text-trust-high">Current & Valid</p>
                </div>
              </div>
            </Card>

            {/* Full Details - Locked/Unlocked */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Complete Documentation</h2>
                {isUnlocked ? (
                  <div className="flex items-center gap-2 text-trust-high">
                    <Unlock className="w-5 h-5" />
                    <span className="text-sm font-medium">Unlocked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Lock className="w-5 h-5" />
                    <span className="text-sm font-medium">Locked</span>
                  </div>
                )}
              </div>

              {isUnlocked ? (
                <div className="space-y-4">
                  {/* FMCSA Details */}
                  <div className="glass-subtle rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary-400" />
                      FMCSA Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Legal Name</div>
                        <div className="font-semibold">{listingDetails.legalName}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">DBA Name</div>
                        <div className="font-semibold">{listingDetails.dbaName}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">MC Number</div>
                        <div className="font-semibold">{listingDetails.mcNumber}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">DOT Number</div>
                        <div className="font-semibold">{listingDetails.dotNumber}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Physical Address</div>
                        <div className="font-semibold">{listingDetails.physicalAddress}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Phone</div>
                        <div className="font-semibold">{listingDetails.phone}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Power Units</div>
                        <div className="font-semibold">{listingDetails.powerUnits}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Drivers</div>
                        <div className="font-semibold">{listingDetails.drivers}</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-gray-500 mb-2 text-sm">Cargo Carried</div>
                      <div className="flex flex-wrap gap-2">
                        {listingDetails.cargoCarried.map((cargo, i) => (
                          <span key={i} className="px-2 py-1 rounded-full bg-white/10 text-xs">
                            {cargo}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="glass-subtle rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-400" />
                      Available Documents
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-white/80">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                        Article of Incorporation
                      </li>
                      <li className="flex items-center gap-2 text-white/80">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                        EIN Letter
                      </li>
                      <li className="flex items-center gap-2 text-white/80">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                        Driver License
                      </li>
                      <li className="flex items-center gap-2 text-white/80">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                        Certificate of Insurance (COI)
                      </li>
                      <li className="flex items-center gap-2 text-white/80">
                        <CheckCircle className="w-4 h-4 text-trust-high" />
                        Loss Run Report
                      </li>
                      {listingDetails.hasFactoring === 'yes' && (
                        <li className="flex items-center gap-2 text-white/80">
                          <CheckCircle className="w-4 h-4 text-trust-high" />
                          Factoring Letter of Release (LOR)
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Detailed information is locked</h3>
                  <p className="text-gray-500 mb-4">
                    Unlock to view complete MC details, documents, and contact seller
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-yellow-400 font-medium">Use 1 credit to unlock</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Domilea Representative Card */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Contact Representative</h3>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">D</span>
                </div>
                <div>
                  <div className="font-semibold">Domilea Representative</div>
                  <div className="text-sm text-gray-500">Domilea Team</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-emerald-600 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified Team Member</span>
                </div>
                <p className="text-sm text-gray-600">
                  Our team will assist you with all inquiries about this MC authority, including pricing, documentation, and transfer process.
                </p>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Response Time</span>
                  <span className="font-semibold">Within 24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Availability</span>
                  <span className="font-semibold">Mon-Fri 9am-6pm</span>
                </div>
              </div>

              {messageSent ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="font-semibold text-emerald-700">Message Sent!</div>
                  <div className="text-sm text-emerald-600">We'll get back to you soon.</div>
                </div>
              ) : (
                <Button fullWidth onClick={handleContactClick}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              )}

              {!isAuthenticated && (
                <p className="text-xs text-center text-gray-500 mt-3">
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Sign in
                  </Link>{' '}
                  to contact our team
                </p>
              )}
            </Card>

            {/* Credits Card / Premium Card */}
            <Card className="overflow-hidden">
              {isPremiumListing ? (
                // Premium Listing - Contact Admin
                <>
                  <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 -m-6 mb-4 p-4 border-b border-yellow-500/30">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-yellow-400" />
                      <span className="font-bold text-yellow-400">Premium Listing</span>
                    </div>
                  </div>

                  {premiumRequestSent ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-trust-high/10 border border-trust-high/30 text-center">
                        <CheckCircle className="w-10 h-10 text-trust-high mx-auto mb-3" />
                        <div className="font-bold text-trust-high text-lg mb-1">Request Submitted!</div>
                        <div className="text-sm text-gray-500">
                          Our admin team will review your request and contact you within 24-48 hours.
                        </div>
                      </div>

                      <Button fullWidth variant="secondary">
                        <Heart className="w-4 h-4 mr-2" />
                        Save to My List
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                        <div className="text-center">
                          <Crown className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
                          <div className="font-bold text-lg mb-1">Premium MC Authority</div>
                          <div className="text-sm text-gray-500 mb-4">
                            This is a premium listing. Contact our admin team for pricing and details.
                          </div>
                          <div className="text-2xl font-bold text-yellow-400">Contact for Price</div>
                        </div>
                      </div>

                      <Button
                        fullWidth
                        onClick={handlePremiumRequest}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Admin for Pricing
                      </Button>

                      <Button fullWidth variant="secondary">
                        <Heart className="w-4 h-4 mr-2" />
                        Save Listing
                      </Button>

                      {!isAuthenticated && (
                        <p className="text-xs text-center text-gray-500">
                          <Link to="/login" className="text-primary-400 hover:text-primary-300">
                            Sign in
                          </Link>{' '}
                          to contact admin about this listing
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                // Regular Listing - Credit Unlock
                <>
                  <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 -m-6 mb-4 p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold">Your Credits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-yellow-400">{userCredits}</span>
                        <span className="text-sm text-gray-500">remaining</span>
                      </div>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-trust-high/10 border border-trust-high/30 text-center">
                        <Unlock className="w-8 h-8 text-trust-high mx-auto mb-2" />
                        <div className="font-bold text-trust-high">MC Unlocked!</div>
                        <div className="text-sm text-gray-500">Full details are now visible</div>
                      </div>

                      <Button fullWidth variant="secondary">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Seller
                      </Button>

                      <Button fullWidth variant="secondary">
                        <Heart className="w-4 h-4 mr-2" />
                        Save to My List
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        fullWidth
                        onClick={handleUnlockWithCredit}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        disabled={userCredits < 1}
                      >
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock Full MC with 1 Credit
                      </Button>

                      {userCredits < 1 && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                          <p className="text-sm text-red-400 mb-2">You're out of credits!</p>
                          <Link to="/buyer/subscription">
                            <Button size="sm" variant="secondary">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Get More Credits
                            </Button>
                          </Link>
                        </div>
                      )}

                      <Button fullWidth variant="secondary">
                        <Heart className="w-4 h-4 mr-2" />
                        Save Listing
                      </Button>

                      <div className="text-center">
                        <Link
                          to="/buyer/subscription"
                          className="text-sm text-primary-400 hover:text-primary-300 flex items-center justify-center gap-1"
                        >
                          <Sparkles className="w-4 h-4" />
                          Upgrade for more credits
                        </Link>
                      </div>

                      {!isAuthenticated && (
                        <p className="text-xs text-center text-gray-500">
                          <Link to="/login" className="text-primary-400 hover:text-primary-300">
                            Sign in
                          </Link>{' '}
                          to unlock this listing
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </Card>

            {/* Safety Card */}
            <Card>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Buyer Protection</h4>
                  <p className="text-sm text-gray-500">
                    All transactions are protected by our secure escrow system. Your funds are safe
                    until the transfer is complete.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Premium Request Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 -m-6 mb-6 p-6 border-b border-yellow-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Premium MC Request</h3>
                        <p className="text-sm text-gray-500">MC #{listing?.mcNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPremiumModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="space-y-4">
                  <p className="text-white/80">
                    You're requesting information about a premium MC Authority. Our admin team will review your request and provide pricing details.
                  </p>

                  <Textarea
                    label="Message to Admin (Optional)"
                    placeholder="Tell us about your business needs, timeline, or any specific questions..."
                    value={premiumMessage}
                    onChange={(e) => setPremiumMessage(e.target.value)}
                    rows={4}
                  />

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-semibold mb-2">What happens next?</h4>
                    <ul className="space-y-2 text-sm text-gray-500">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-400" />
                        Admin reviews your request
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-400" />
                        We'll contact you within 24-48 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-400" />
                        Receive custom pricing and details
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      fullWidth
                      variant="secondary"
                      onClick={() => setShowPremiumModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      onClick={handleSubmitPremiumRequest}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Request
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Representative Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 -m-6 mb-6 p-6 border-b border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Contact Us</h3>
                        <p className="text-sm text-gray-500">MC #{listing?.mcNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Send a message to our team about this MC authority. We'll respond within 24 hours.
                  </p>

                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                  />

                  <Textarea
                    label="Your Message"
                    placeholder="I'm interested in this MC authority. Please provide more information about pricing, documentation requirements, and the transfer process..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={4}
                    required
                  />

                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <h4 className="font-semibold mb-2 text-gray-900">What happens next?</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-500" />
                        Our team reviews your inquiry
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-500" />
                        We'll contact you within 24 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-indigo-500" />
                        Get all your questions answered
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      fullWidth
                      variant="outline"
                      onClick={() => setShowContactModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      fullWidth
                      onClick={handleSubmitContact}
                      disabled={!contactMessage.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MCDetailPage
