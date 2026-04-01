import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Search,
  Loader2,
  Building2,
  MapPin,
  Phone,
  Truck,
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  ArrowRight,
  MessageSquare,
  Mail,
  Calendar,
  Hash,
  Send,
} from 'lucide-react'
import GlassCard from './ui/GlassCard'
import Button from './ui/Button'
import Input from './ui/Input'
import api from '../services/api'
import { FMCSACarrierData } from '../types'

interface CarrierPulseOnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

const CarrierPulseOnboardingModal = ({ isOpen, onClose }: CarrierPulseOnboardingModalProps) => {
  const navigate = useNavigate()
  const [step, setStep] = useState<'search' | 'results'>('search')
  const [mcNumber, setMcNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [carrierData, setCarrierData] = useState<FMCSACarrierData | null>(null)
  const [morProData, setMorProData] = useState<any>(null)
  const [authorityData, setAuthorityData] = useState<any>(null)
  const [contactMessage, setContactMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleaned = mcNumber.replace(/[^0-9]/g, '')
    if (!cleaned) {
      setError('Please enter a valid MC number')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await api.fmcsaLookupByMC(cleaned)
      if (response.success && response.data) {
        setCarrierData(response.data)
        setStep('results')
        // Also fetch MorPro + authority data for richer details
        if (response.data.dotNumber) {
          api.getCarrierReport(response.data.dotNumber).then(res => {
            if (res.success && res.data) setMorProData(res.data)
          }).catch(() => {})
          api.fmcsaGetAuthorityHistory(response.data.dotNumber).then(res => {
            if (res.success && res.data) setAuthorityData(res.data)
          }).catch(() => {})
        }
      } else {
        setError('No carrier found with that MC number. Please check and try again.')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to look up carrier. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReadyToSell = () => {
    // They're listing — don't show again
    localStorage.setItem('mcx_carrier_pulse_dismiss_count', '99')
    onClose()
    navigate('/seller/create-listing')
  }

  const handleClose = () => {
    setStep('search')
    setMcNumber('')
    setError(null)
    setCarrierData(null)
    setMorProData(null)
    setAuthorityData(null)
    setContactMessage('')
    setMessageSent(false)
    onClose()
  }

  const handleBack = () => {
    setStep('search')
    setCarrierData(null)
    setMorProData(null)
    setAuthorityData(null)
    setError(null)
    setContactMessage('')
    setMessageSent(false)
  }

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) return
    setSendingMessage(true)
    try {
      await api.sendInquiryToAdmin(undefined, contactMessage.trim())
      setMessageSent(true)
      setContactMessage('')
    } catch {
      // Silently handle
    } finally {
      setSendingMessage(false)
    }
  }

  const getSafetyColor = (rating: string) => {
    const r = rating?.toLowerCase()
    if (r === 'satisfactory') return 'text-emerald-600'
    if (r === 'conditional') return 'text-amber-600'
    if (r === 'unsatisfactory') return 'text-red-600'
    return 'text-gray-500'
  }

  const getSafetyIcon = (rating: string) => {
    const r = rating?.toLowerCase()
    if (r === 'satisfactory') return ShieldCheck
    if (r === 'conditional') return ShieldAlert
    if (r === 'unsatisfactory') return AlertTriangle
    return Shield
  }

  const getOperatingStatusColor = (status: string) => {
    const s = status?.toUpperCase()
    if (s === 'Y' || s === 'YES' || s === 'AUTHORIZED') return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getOperatingStatusLabel = (status: string) => {
    const s = status?.toUpperCase()
    if (s === 'Y' || s === 'YES' || s === 'AUTHORIZED') return 'Authorized'
    return 'Not Authorized'
  }

  const getBasicScoreColor = (score: number) => {
    if (score === 0) return 'bg-gray-200'
    if (score <= 50) return 'bg-emerald-500'
    if (score <= 75) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <GlassCard hover={false}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary-500 to-primary-500 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Carrier Pulse</h2>
                      <p className="text-sm text-gray-500">
                        {step === 'search'
                          ? 'Look up your MC to see your company profile'
                          : 'Review your company details'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Search Step */}
                {step === 'search' && (
                  <>
                    <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-5 mb-6 border border-secondary-100">
                      <h3 className="font-bold text-gray-900 mb-2">Welcome to Domilea!</h3>
                      <p className="text-sm text-gray-600">
                        Before you start listing, let's pull up your carrier information from FMCSA.
                        Enter your MC number below and we'll show you exactly what buyers will see
                        about your authority.
                      </p>
                    </div>

                    <form onSubmit={handleLookup} className="space-y-4">
                      <Input
                        label="MC Number"
                        placeholder="Enter your MC number (e.g. 123456)"
                        value={mcNumber}
                        onChange={(e) => {
                          setMcNumber(e.target.value)
                          setError(null)
                        }}
                        icon={<Search className="w-4 h-4" />}
                        required
                      />

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                        >
                          {error}
                        </motion.div>
                      )}

                      <div className="flex gap-3">
                        <Button type="button" variant="ghost" fullWidth onClick={handleClose}>
                          Skip for Now
                        </Button>
                        <Button type="submit" fullWidth disabled={loading || !mcNumber.trim()}>
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Looking up...
                            </>
                          ) : (
                            <>
                              <Search className="w-4 h-4 mr-2" />
                              Look Up My MC
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </>
                )}

                {/* Results Step */}
                {step === 'results' && carrierData && (
                  <>
                    {/* Operating Status Banner */}
                    <div className={`rounded-xl p-4 mb-6 border flex items-center gap-3 ${getOperatingStatusColor(carrierData.allowedToOperate)}`}>
                      {carrierData.allowedToOperate?.toUpperCase() === 'Y' || carrierData.allowedToOperate?.toUpperCase() === 'YES' || carrierData.allowedToOperate?.toUpperCase() === 'AUTHORIZED' ? (
                        <CheckCircle className="w-6 h-6 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold">Operating Status: {getOperatingStatusLabel(carrierData.allowedToOperate)}</div>
                        <div className="text-sm opacity-80">
                          MC# {carrierData.mcNumber || mcNumber} &middot; DOT# {carrierData.dotNumber}
                        </div>
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-secondary-600" />
                        Company Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Legal Name</div>
                          <div className="font-semibold text-gray-900">{carrierData.legalName}</div>
                        </div>
                        {carrierData.dbaName && (
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">DBA Name</div>
                            <div className="font-semibold text-gray-900">{carrierData.dbaName}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Entity Type</div>
                          <div className="text-sm text-gray-900">{carrierData.carrierOperation || morProData?.carrier?.entityType || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">EIN</div>
                          <div className="text-sm text-gray-900">{morProData?.carrier?.ein || (carrierData as any).ein || 'N/A'}</div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</div>
                            <div className="text-sm text-gray-900">
                              {carrierData.physicalAddress ? `${carrierData.physicalAddress}, ${carrierData.hqCity}, ${carrierData.hqState}` : `${carrierData.hqCity}, ${carrierData.hqState}`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</div>
                            <div className="text-sm text-gray-900">{carrierData.phone || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email Domain</div>
                            <div className="text-sm text-gray-900">{morProData?.carrier?.emailDomain || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">MCS-150 Date</div>
                            <div className="text-sm text-gray-900">{carrierData.mcs150Date || morProData?.carrier?.mcs150Date || 'N/A'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Authority Details */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-secondary-600" />
                        Authority Details
                      </h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Common Authority</div>
                          <div className={`text-sm font-bold ${
                            authorityData?.commonAuthorityStatus === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-500'
                          }`}>
                            {authorityData?.commonAuthorityStatus || 'N/A'}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Contract Authority</div>
                          <div className={`text-sm font-bold ${
                            authorityData?.contractAuthorityStatus === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-500'
                          }`}>
                            {authorityData?.contractAuthorityStatus || 'N/A'}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Broker Authority</div>
                          <div className={`text-sm font-bold ${
                            authorityData?.brokerAuthorityStatus === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-500'
                          }`}>
                            {authorityData?.brokerAuthorityStatus || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fleet & Operations */}
                    <div className="grid md:grid-cols-3 gap-4 mb-5">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                        <Truck className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{carrierData.totalPowerUnits}</div>
                        <div className="text-xs text-gray-500">Power Units</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                        <Users className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900">{carrierData.totalDrivers}</div>
                        <div className="text-xs text-gray-500">Drivers</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
                        {(() => {
                          const SafetyIcon = getSafetyIcon(carrierData.safetyRating)
                          return <SafetyIcon className={`w-6 h-6 mx-auto mb-2 ${getSafetyColor(carrierData.safetyRating)}`} />
                        })()}
                        <div className={`text-lg font-bold capitalize ${getSafetyColor(carrierData.safetyRating)}`}>
                          {carrierData.safetyRating || 'Not Rated'}
                        </div>
                        <div className="text-xs text-gray-500">Safety Rating</div>
                      </div>
                    </div>

                    {/* Insurance Status */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-secondary-600" />
                        Insurance on File
                      </h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                          <span className="text-sm text-gray-600">BIPD</span>
                          <span className={`text-sm font-bold ${carrierData.bipdOnFile > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {carrierData.bipdOnFile > 0 ? `$${(carrierData.bipdOnFile / 1000).toFixed(0)}K` : 'None'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                          <span className="text-sm text-gray-600">Cargo</span>
                          <span className={`text-sm font-bold ${carrierData.cargoOnFile > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {carrierData.cargoOnFile > 0 ? `$${(carrierData.cargoOnFile / 1000).toFixed(0)}K` : 'None'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200">
                          <span className="text-sm text-gray-600">Bond</span>
                          <span className={`text-sm font-bold ${carrierData.bondOnFile > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {carrierData.bondOnFile > 0 ? `$${(carrierData.bondOnFile / 1000).toFixed(0)}K` : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BASIC Scores */}
                    {(carrierData.unsafeDrivingBasic > 0 ||
                      carrierData.hoursOfServiceBasic > 0 ||
                      carrierData.vehicleMaintenanceBasic > 0) && (
                      <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-secondary-600" />
                          BASIC Scores
                        </h3>
                        <div className="space-y-3">
                          {[
                            { label: 'Unsafe Driving', score: carrierData.unsafeDrivingBasic },
                            { label: 'Hours of Service', score: carrierData.hoursOfServiceBasic },
                            { label: 'Driver Fitness', score: carrierData.driverFitnessBasic },
                            { label: 'Vehicle Maintenance', score: carrierData.vehicleMaintenanceBasic },
                            { label: 'Controlled Substances', score: carrierData.controlledSubstancesBasic },
                            { label: 'Crash Indicator', score: carrierData.crashIndicatorBasic },
                          ].filter(b => b.score > 0).map((basic) => (
                            <div key={basic.label} className="flex items-center gap-3">
                              <div className="w-36 text-sm text-gray-600 flex-shrink-0">{basic.label}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${basic.score}%` }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                  className={`h-full rounded-full ${getBasicScoreColor(basic.score)}`}
                                />
                              </div>
                              <div className="w-12 text-right text-sm font-semibold text-gray-900">
                                {basic.score}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Inspection Summary */}
                    {(carrierData.driverInsp > 0 || carrierData.vehicleInsp > 0 || carrierData.crashTotal > 0) && (
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Inspections (24 months)</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Driver</span>
                              <span className="text-gray-900">{carrierData.driverInsp} ({carrierData.driverOosRate?.toFixed(1)}% OOS)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Vehicle</span>
                              <span className="text-gray-900">{carrierData.vehicleInsp} ({carrierData.vehicleOosRate?.toFixed(1)}% OOS)</span>
                            </div>
                            {carrierData.hazmatInsp > 0 && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">HazMat</span>
                                <span className="text-gray-900">{carrierData.hazmatInsp} ({carrierData.hazmatOosRate?.toFixed(1)}% OOS)</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div className="text-sm font-semibold text-gray-700 mb-2">Crash History (24 months)</div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Total Crashes</span>
                              <span className="text-gray-900">{carrierData.crashTotal}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Fatal</span>
                              <span className={carrierData.fatalCrash > 0 ? 'text-red-600 font-semibold' : 'text-gray-900'}>{carrierData.fatalCrash}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Injury</span>
                              <span className="text-gray-900">{carrierData.injuryCrash}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cargo Types */}
                    {carrierData.cargoTypes && carrierData.cargoTypes.length > 0 && (
                      <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-3">Cargo Types</h3>
                        <div className="flex flex-wrap gap-2">
                          {carrierData.cargoTypes.map((cargo, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-700"
                            >
                              {cargo}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ready to Sell */}
                    <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-5 mb-5 border border-secondary-100">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Ready to Sell Your Authority?</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Your MC details look good! Click below to create your listing and start receiving offers from verified buyers.
                      </p>
                      <Button fullWidth onClick={handleReadyToSell}>
                        Yes, List My Authority for Sale
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>

                    {/* Contact Domilea Team */}
                    <div className="bg-gray-50 rounded-xl p-5 mb-5 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-secondary-600" />
                        Have Questions About the Process?
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Not sure how selling works? Our team is here to help walk you through every step — from listing to closing.
                      </p>
                      {messageSent ? (
                        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
                          <CheckCircle className="w-4 h-4" />
                          Message sent! We'll get back to you shortly on your dashboard.
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                            placeholder="Type your question here..."
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
                            disabled={sendingMessage}
                          />
                          <Button onClick={handleSendMessage} disabled={sendingMessage || !contactMessage.trim()}>
                            {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Back button */}
                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" onClick={handleBack}>
                        Back
                      </Button>
                      <Button fullWidth variant="outline" onClick={handleClose}>
                        I'll Come Back Later
                      </Button>
                    </div>
                  </>
                )}
              </GlassCard>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CarrierPulseOnboardingModal
