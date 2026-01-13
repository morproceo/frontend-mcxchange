import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Search,
  RefreshCw,
  Building2,
  MapPin,
  Calendar,
  TruckIcon,
  Shield,
  DollarSign,
  Zap,
  Package,
  Mail,
  Phone,
  Percent,
  Eye,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Star,
  ClipboardCheck,
  Globe,
  BadgeCheck
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import api from '../services/api'

const US_STATES = [
  { value: '', label: 'Select State' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
]

interface UploadedFile {
  id: string
  name: string
  size: string
  type: string
}

const stepInfo = [
  { num: 1, title: 'Authority Info', icon: Search, description: 'MC/DOT lookup & verification' },
  { num: 2, title: 'Listing Details', icon: Package, description: 'Pricing, platforms & features' },
  { num: 3, title: 'Authority Details', icon: TruckIcon, description: 'Fleet info & operations' },
  { num: 4, title: 'Documents', icon: FileText, description: 'Upload required files' },
  { num: 5, title: 'Payment', icon: DollarSign, description: 'Listing activation fee' },
  { num: 6, title: 'Confirmation', icon: CheckCircle, description: 'Review & submit' }
]

const CreateListingPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [invoiceNumber] = useState(`INV-${Date.now().toString().slice(-8)}`)

  const [listingCreated, setListingCreated] = useState(false)
  const [creatingListing, setCreatingListing] = useState(false)
  const [listingAttempted, setListingAttempted] = useState(false)

  // Handle return from Stripe checkout
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const mc = searchParams.get('mc')

    if (paymentStatus === 'success' && !listingCreated && !creatingListing && !listingAttempted) {
      // Payment was successful - create the listing
      const createListingAfterPayment = async () => {
        setCreatingListing(true)
        setListingAttempted(true) // Mark that we've attempted to create the listing

        // Retrieve form data from localStorage
        const savedFormData = localStorage.getItem('mcx_listing_form_data')
        if (!savedFormData) {
          setFmcsaError('Form data not found. Please try creating the listing again.')
          setStep(1)
          setCreatingListing(false)
          return
        }

        try {
          const parsedFormData = JSON.parse(savedFormData)

          // Update form state with saved data
          setFormData(parsedFormData)

          // Get city from physical address or use state
          const city = parsedFormData.physicalAddress?.split(',')[0] || 'Unknown'

          // Create the listing in database
          const response = await api.createListing({
            mcNumber: parsedFormData.mcNumber,
            dotNumber: parsedFormData.dotNumber,
            legalName: parsedFormData.legalName,
            dbaName: parsedFormData.dbaName || undefined,
            title: parsedFormData.title,
            description: parsedFormData.description || undefined,
            askingPrice: parseFloat(parsedFormData.price) || 0,
            city: city,
            state: parsedFormData.state,
            address: parsedFormData.physicalAddress || undefined,
            yearsActive: parseInt(parsedFormData.yearsActive) || 0,
            fleetSize: parseInt(parsedFormData.fleetSize) || parseInt(parsedFormData.powerUnits) || 0,
            totalDrivers: parseInt(parsedFormData.drivers) || 0,
            safetyRating: parsedFormData.safetyRating || 'NONE',
            insuranceOnFile: parsedFormData.insuranceStatus === 'active',
            amazonStatus: parsedFormData.amazonStatus?.toUpperCase() || 'NONE',
            amazonRelayScore: parsedFormData.amazonRelayScore || undefined,
            highwaySetup: parsedFormData.highwaySetup === 'yes',
            sellingWithEmail: parsedFormData.sellingWithEmail === 'yes',
            sellingWithPhone: parsedFormData.sellingWithPhone === 'yes',
            cargoTypes: parsedFormData.cargoCarried || [],
            submitForReview: true, // Set status to PENDING_REVIEW since payment was made
          })

          if (response.success) {
            // Clear saved form data
            localStorage.removeItem('mcx_listing_form_data')
            setListingCreated(true)
            setPaymentComplete(true)
            setStep(6)
          } else {
            throw new Error('Failed to create listing')
          }
        } catch (err: any) {
          console.error('Error creating listing:', err)
          // Clear saved form data to prevent retries with bad data
          localStorage.removeItem('mcx_listing_form_data')
          setFmcsaError(err.message || 'Failed to create listing. Please contact support.')
          setStep(6) // Still show confirmation but with error
        } finally {
          setCreatingListing(false)
        }
      }

      createListingAfterPayment()
    } else if (paymentStatus === 'cancelled') {
      // Payment was cancelled - stay on payment step and restore form data
      const savedFormData = localStorage.getItem('mcx_listing_form_data')
      if (savedFormData) {
        try {
          setFormData(JSON.parse(savedFormData))
        } catch (e) {
          // Ignore parse errors
        }
      }
      setStep(5)
    }
  }, [searchParams, listingCreated, creatingListing])

  const [formData, setFormData] = useState({
    // Basic Info
    mcNumber: '',
    dotNumber: '',
    state: '',
    title: '',
    description: '',
    price: '',
    visibility: 'public',

    // FMCSA Data (auto-filled)
    legalName: '',
    dbaName: '',
    physicalAddress: '',
    mailingAddress: '',
    phone: '',
    powerUnits: '',
    drivers: '',
    mcs150Date: '',
    operatingStatus: '',
    entityType: '',
    cargoCarried: [] as string[],

    // Entry Audit
    entryAuditCompleted: '',

    // Amazon & Highway
    amazonStatus: '',
    amazonRelayScore: '',
    highwaySetup: '',

    // Selling with Email/Phone
    sellingWithEmail: '',
    sellingWithPhone: '',

    // Factoring
    hasFactoring: '',
    factoringCompany: '',
    factoringRate: '',

    // Authority Details
    yearsActive: '',
    fleetSize: '',
    safetyRating: 'satisfactory',
    insuranceStatus: 'active',
    operationTypes: [] as string[]
  })

  // FMCSA lookup state
  const [isFetchingFMCSA, setIsFetchingFMCSA] = useState(false)
  const [fmcsaFetched, setFmcsaFetched] = useState(false)
  const [fmcsaError, setFmcsaError] = useState('')

  const [uploadedFiles, setUploadedFiles] = useState<{
    articleOfIncorporation: UploadedFile | null
    einLetter: UploadedFile | null
    driverLicense: UploadedFile | null
    coi: UploadedFile | null
    lossRun: UploadedFile | null
    additional: UploadedFile[]
    factoringLOR: UploadedFile | null
  }>({
    articleOfIncorporation: null,
    einLetter: null,
    driverLicense: null,
    coi: null,
    lossRun: null,
    additional: [],
    factoringLOR: null
  })

  // FMCSA lookup function - uses real API
  const handleFMCSALookup = async () => {
    if (!formData.mcNumber && !formData.dotNumber) {
      setFmcsaError('Please enter an MC or DOT number first')
      return
    }

    setIsFetchingFMCSA(true)
    setFmcsaError('')

    try {
      let response

      // Prefer MC number lookup, fall back to DOT
      if (formData.mcNumber) {
        response = await api.fmcsaLookupByMC(formData.mcNumber)
      } else if (formData.dotNumber) {
        response = await api.fmcsaLookupByDOT(formData.dotNumber)
      }

      if (!response || !response.data) {
        setFmcsaError('No carrier found with that number. Please check and try again.')
        setIsFetchingFMCSA(false)
        return
      }

      // The API returns carrier data directly in response.data (not nested under 'carrier')
      const carrier = response.data

      if (!carrier || !carrier.dotNumber) {
        setFmcsaError('No carrier data found. Please verify the number and try again.')
        setIsFetchingFMCSA(false)
        return
      }

      // Map the API response to our form fields
      const fullAddress = [carrier.physicalAddress, carrier.hqCity, carrier.hqState].filter(Boolean).join(', ')

      // Determine safety rating status
      let safetyRatingValue = 'not-rated'
      if (carrier.safetyRating) {
        const rating = carrier.safetyRating.toLowerCase()
        if (rating.includes('satisfactory')) safetyRatingValue = 'satisfactory'
        else if (rating.includes('conditional')) safetyRatingValue = 'conditional'
        else if (rating.includes('unsatisfactory')) safetyRatingValue = 'unsatisfactory'
      }

      // Determine operating status
      const operatingStatus = carrier.allowedToOperate === 'Y' ? 'AUTHORIZED' : 'NOT AUTHORIZED'

      // Determine insurance status
      const insuranceStatus = carrier.insuranceOnFile ? 'active' : 'expired'

      // Calculate years active from MCS-150 date if available
      let yearsActive = ''
      if (carrier.mcs150Date) {
        try {
          const mcsDate = new Date(carrier.mcs150Date)
          const now = new Date()
          const years = Math.floor((now.getTime() - mcsDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
          if (years > 0) yearsActive = String(years)
        } catch (e) {
          // Ignore date parsing errors
        }
      }

      // Auto-generate title from legal name and MC number
      const mcNum = formData.mcNumber || carrier.dotNumber
      const generatedTitle = `${carrier.legalName} - MC #${mcNum}`

      setFormData(prev => ({
        ...prev,
        dotNumber: carrier.dotNumber || prev.dotNumber,
        legalName: carrier.legalName || '',
        dbaName: carrier.dbaName || '',
        physicalAddress: fullAddress,
        mailingAddress: fullAddress,
        phone: carrier.phone || '',
        powerUnits: String(carrier.totalPowerUnits || 0),
        drivers: String(carrier.totalDrivers || 0),
        mcs150Date: carrier.mcs150Date || '',
        operatingStatus: operatingStatus,
        entityType: carrier.carrierOperation || 'CARRIER',
        state: carrier.hqState || prev.state,
        cargoCarried: carrier.cargoTypes || [],
        fleetSize: String(carrier.totalPowerUnits || 0),
        safetyRating: safetyRatingValue,
        insuranceStatus: insuranceStatus,
        yearsActive: yearsActive || prev.yearsActive,
        title: generatedTitle
      }))

      setFmcsaFetched(true)
    } catch (err: any) {
      console.error('FMCSA lookup error:', err)
      setFmcsaError(err.message || 'Failed to fetch FMCSA data. Please try again.')
    } finally {
      setIsFetchingFMCSA(false)
    }
  }

  const handlePayment = async () => {
    if (!formData.mcNumber) {
      setFmcsaError('MC number is required for payment')
      return
    }

    setPaymentProcessing(true)

    try {
      // Save form data to localStorage before redirecting to Stripe
      localStorage.setItem('mcx_listing_form_data', JSON.stringify(formData))

      // Create Stripe checkout session for listing fee
      const baseUrl = window.location.origin
      const successUrl = `${baseUrl}/seller/create-listing?payment=success&mc=${formData.mcNumber}`
      const cancelUrl = `${baseUrl}/seller/create-listing?payment=cancelled`

      const response = await api.createListingFeeCheckout(
        formData.mcNumber,
        successUrl,
        cancelUrl
      )

      if (response.success && response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      setFmcsaError(err.message || 'Failed to initiate payment. Please try again.')
      setPaymentProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLoading(false)
    navigate('/seller/dashboard')
  }

  const handleOperationTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      operationTypes: prev.operationTypes.includes(type)
        ? prev.operationTypes.filter(t => t !== type)
        : [...prev.operationTypes, type]
    }))
  }

  const simulateFileUpload = (fileType: 'articleOfIncorporation' | 'einLetter' | 'driverLicense' | 'coi' | 'lossRun' | 'additional' | 'factoringLOR') => {
    const fileNames: Record<string, string> = {
      articleOfIncorporation: 'Article_of_Incorporation.pdf',
      einLetter: 'EIN_Letter.pdf',
      driverLicense: 'Driver_License.pdf',
      coi: 'Certificate_of_Insurance.pdf',
      lossRun: 'Loss_Run_Report.pdf',
      factoringLOR: 'Factoring_LOR.pdf'
    }

    const mockFile: UploadedFile = {
      id: Date.now().toString(),
      name: fileNames[fileType] || `Document_${Date.now()}.pdf`,
      size: '2.4 MB',
      type: 'application/pdf'
    }

    if (fileType === 'additional') {
      setUploadedFiles(prev => ({
        ...prev,
        additional: [...prev.additional, mockFile]
      }))
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: mockFile
      }))
    }
  }

  const removeFile = (fileType: 'articleOfIncorporation' | 'einLetter' | 'driverLicense' | 'coi' | 'lossRun' | 'factoringLOR' | 'additional', fileId?: string) => {
    if (fileType === 'additional' && fileId) {
      setUploadedFiles(prev => ({
        ...prev,
        additional: prev.additional.filter(f => f.id !== fileId)
      }))
    } else {
      setUploadedFiles(prev => ({
        ...prev,
        [fileType]: null
      }))
    }
  }

  const operationTypeOptions = [
    { name: 'Dry Van', icon: '📦' },
    { name: 'Reefer', icon: '❄️' },
    { name: 'Flatbed', icon: '🪵' },
    { name: 'Tanker', icon: '🛢️' },
    { name: 'Heavy Haul', icon: '🏗️' },
    { name: 'Box Truck', icon: '🚚' },
    { name: 'LTL', icon: '📋' },
    { name: 'Oversized', icon: '🔩' },
    { name: 'Hazmat', icon: '☢️' },
    { name: 'Interstate', icon: '🛣️' },
    { name: 'Intrastate', icon: '🏙️' },
    { name: 'Regional', icon: '🗺️' },
    { name: 'Local', icon: '📍' }
  ]

  const calculateProgress = () => {
    let filled = 0
    let total = 10

    if (formData.mcNumber || formData.dotNumber) filled++
    if (fmcsaFetched) filled++
    if (formData.entryAuditCompleted) filled++
    if (formData.title) filled++
    if (formData.price) filled++
    if (formData.amazonStatus) filled++
    if (formData.sellingWithEmail && formData.sellingWithPhone) filled++
    if (formData.hasFactoring) filled++
    if (formData.operationTypes.length > 0) filled++
    if (uploadedFiles.articleOfIncorporation || uploadedFiles.einLetter || uploadedFiles.driverLicense || uploadedFiles.coi || uploadedFiles.lossRun) filled++

    return Math.round((filled / total) * 100)
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-600">List Your MC Authority</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
            Create Your Listing
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Reach thousands of verified buyers looking for quality MC authorities
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">{calculateProgress()}%</span>
                </div>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
              <div className="text-sm text-gray-400">Step {step} of 6</div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {stepInfo.map((s, index) => (
                <motion.button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`flex-1 min-w-[140px] p-3 rounded-xl transition-all relative group ${
                    step === s.num
                      ? 'bg-gradient-to-r from-primary-500/10 to-purple-500/10 border-2 border-primary-500/50'
                      : step > s.num
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      step === s.num
                        ? 'bg-primary-500 text-white'
                        : step > s.num
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > s.num ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <s.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className={`text-sm font-semibold ${step === s.num ? 'text-gray-900' : 'text-gray-700'}`}>
                        {s.title}
                      </div>
                      <div className="text-xs text-gray-400 hidden md:block">{s.description}</div>
                    </div>
                  </div>
                  {index < stepInfo.length - 1 && (
                    <ChevronRight className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 hidden md:block" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Authority Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* MC/DOT Lookup Card */}
                <GlassCard className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500/5 via-purple-500/5 to-pink-500/5 -m-6 mb-6 p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
                        <Search className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">FMCSA Lookup</h2>
                        <p className="text-gray-500">Enter your MC or DOT to auto-fill your information</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="relative">
                      <Input
                        label="MC Number"
                        placeholder="Enter MC number..."
                        value={formData.mcNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, mcNumber: e.target.value })
                          setFmcsaFetched(false)
                        }}
                        icon={<span className="text-primary-400 font-bold text-sm">MC</span>}
                      />
                    </div>
                    <div className="relative">
                      <Input
                        label="DOT Number"
                        placeholder="Enter DOT number..."
                        value={formData.dotNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, dotNumber: e.target.value })
                          setFmcsaFetched(false)
                        }}
                        icon={<span className="text-purple-400 font-bold text-sm">DOT</span>}
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleFMCSALookup}
                    disabled={isFetchingFMCSA || (!formData.mcNumber && !formData.dotNumber)}
                    fullWidth
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600"
                  >
                    {isFetchingFMCSA ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Searching FMCSA Database...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Auto-Fill from FMCSA
                      </>
                    )}
                  </Button>

                  {fmcsaError && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm mt-4 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {fmcsaError}
                    </motion.p>
                  )}

                  {/* FMCSA Data Display */}
                  <AnimatePresence>
                    {fmcsaFetched && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6"
                      >
                        <div className="rounded-xl bg-gradient-to-r from-trust-high/10 to-green-500/10 border border-trust-high/30 p-5">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-trust-high/20 flex items-center justify-center">
                              <BadgeCheck className="w-6 h-6 text-trust-high" />
                            </div>
                            <div>
                              <span className="font-bold text-trust-high">FMCSA Data Retrieved!</span>
                              <p className="text-xs text-gray-500">Information auto-filled from official records</p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                <Building2 className="w-5 h-5 text-primary-400 mt-0.5" />
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Legal Name</div>
                                  <div className="font-semibold text-gray-900">{formData.legalName}</div>
                                </div>
                              </div>
                              {formData.dbaName && (
                                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                  <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                                  <div>
                                    <div className="text-xs text-gray-400 mb-1">DBA Name</div>
                                    <div className="font-semibold text-gray-900">{formData.dbaName}</div>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                <MapPin className="w-5 h-5 text-pink-400 mt-0.5" />
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Address</div>
                                  <div className="text-sm">{formData.physicalAddress}</div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                <TruckIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Fleet Info</div>
                                  <div className="font-semibold text-gray-900">{formData.powerUnits} Power Units • {formData.drivers} Drivers</div>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                <Shield className="w-5 h-5 text-trust-high mt-0.5" />
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">Operating Status</div>
                                  <div className={`font-bold ${formData.operatingStatus === 'AUTHORIZED' ? 'text-trust-high' : 'text-yellow-400'}`}>
                                    {formData.operatingStatus}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                                <Calendar className="w-5 h-5 text-orange-400 mt-0.5" />
                                <div>
                                  <div className="text-xs text-gray-400 mb-1">MCS-150 Date</div>
                                  <div className="text-sm">{formData.mcs150Date}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {formData.cargoCarried.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="text-xs text-gray-400 mb-2">Cargo Types</div>
                              <div className="flex flex-wrap gap-2">
                                {formData.cargoCarried.map((cargo, index) => (
                                  <span key={index} className="px-3 py-1 rounded-full bg-gray-100 text-sm border border-gray-200">
                                    {cargo}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>

                {/* Entry Audit Card */}
                <GlassCard>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center">
                      <ClipboardCheck className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Entry Audit Status</h3>
                      <p className="text-sm text-gray-500">New authorities must complete an entry audit within 12-18 months</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'yes', label: 'Completed', icon: CheckCircle, color: 'trust-high' },
                      { value: 'no', label: 'Not Yet', icon: AlertCircle, color: 'yellow-400' },
                      { value: 'scheduled', label: 'Scheduled', icon: Calendar, color: 'blue-400' },
                      { value: 'not-required', label: 'Not Required', icon: Shield, color: 'purple-400' }
                    ].map((option) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, entryAuditCompleted: option.value })}
                        className={`p-4 rounded-xl border-2 transition-all text-center ${
                          formData.entryAuditCompleted === option.value
                            ? `border-${option.color} bg-${option.color}/10`
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                          formData.entryAuditCompleted === option.value ? `text-${option.color}` : 'text-gray-400'
                        }`} />
                        <div className={`text-sm font-medium ${
                          formData.entryAuditCompleted === option.value ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {option.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {formData.entryAuditCompleted === 'yes' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-lg bg-trust-high/10 border border-trust-high/30 flex items-center gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-trust-high" />
                      <span className="text-sm">Great! Completed audits are a major selling point for buyers.</span>
                    </motion.div>
                  )}

                  {formData.entryAuditCompleted === 'no' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-lg bg-yellow-400/10 border border-yellow-400/30 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm">Consider scheduling your audit soon - buyers prefer completed audits.</span>
                    </motion.div>
                  )}
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    size="lg"
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 px-8"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Listing Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                {/* Listing Info Card */}
                <GlassCard className="overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 -m-6 mb-6 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <DollarSign className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Listing Information</h2>
                        <p className="text-gray-500">Set your price and describe your authority</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <Select
                      label="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      options={US_STATES}
                      required
                    />
                    <Input
                      label="Asking Price"
                      type="number"
                      placeholder="50,000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      icon={<DollarSign className="w-4 h-4 text-green-400" />}
                      required
                    />
                  </div>

                  <div>
                    <Input
                      label="Listing Title"
                      placeholder="Auto-generated from FMCSA lookup"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                    {fmcsaFetched && formData.title && (
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-generated from FMCSA data. You can edit if needed.
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <Textarea
                      label="Description"
                      placeholder="Describe your MC authority, its history, achievements, and what makes it valuable to buyers..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                </GlassCard>

                {/* Platform Integrations */}
                <GlassCard>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Platform Integrations</h3>
                      <p className="text-sm text-gray-500">Do you have any load board or delivery platform setups?</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <span className="text-lg">📦</span>
                        </div>
                        <span className="font-semibold text-gray-900">Amazon Relay</span>
                      </div>
                      <Select
                        value={formData.amazonStatus}
                        onChange={(e) => setFormData({ ...formData, amazonStatus: e.target.value })}
                        options={[
                          { value: '', label: 'Select Status' },
                          { value: 'active', label: '✅ Yes - Active' },
                          { value: 'suspended', label: '⚠️ Yes - Suspended' },
                          { value: 'pending', label: '⏳ Yes - Pending' },
                          { value: 'no', label: '❌ No' }
                        ]}
                      />
                      {formData.amazonStatus === 'active' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-3"
                        >
                          <Select
                            label="Amazon Relay Score"
                            value={formData.amazonRelayScore}
                            onChange={(e) => setFormData({ ...formData, amazonRelayScore: e.target.value })}
                            options={[
                              { value: '', label: 'Select Score' },
                              { value: 'A', label: '🅰️ A - Excellent' },
                              { value: 'B', label: '🅱️ B - Good' },
                              { value: 'C', label: '©️ C - Average' },
                              { value: 'D', label: '🇩 D - Below Average' },
                              { value: 'F', label: '🇫 F - Poor' },
                              { value: 'no-score', label: '➖ No Score Yet' }
                            ]}
                          />
                        </motion.div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <span className="text-lg">🛣️</span>
                        </div>
                        <span className="font-semibold text-gray-900">Highway Setup</span>
                      </div>
                      <Select
                        value={formData.highwaySetup}
                        onChange={(e) => setFormData({ ...formData, highwaySetup: e.target.value })}
                        options={[
                          { value: '', label: 'Select Status' },
                          { value: 'yes', label: '✅ Yes - Setup Complete' },
                          { value: 'pending', label: '⏳ Pending Setup' },
                          { value: 'no', label: '❌ No' }
                        ]}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* What's Included */}
                <GlassCard>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">What's Included in Sale?</h3>
                      <p className="text-sm text-gray-500">Let buyers know what they're getting</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, sellingWithEmail: formData.sellingWithEmail === 'yes' ? 'no' : 'yes' })}
                      className={`p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        formData.sellingWithEmail === 'yes'
                          ? 'border-trust-high bg-trust-high/10'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        formData.sellingWithEmail === 'yes' ? 'bg-trust-high/20' : 'bg-gray-100'
                      }`}>
                        <Mail className={`w-6 h-6 ${formData.sellingWithEmail === 'yes' ? 'text-trust-high' : 'text-gray-400'}`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-gray-900">Business Email</div>
                        <div className="text-sm text-gray-500">Include email with sale</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.sellingWithEmail === 'yes' ? 'border-trust-high bg-trust-high' : 'border-gray-300'
                      }`}>
                        {formData.sellingWithEmail === 'yes' && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, sellingWithPhone: formData.sellingWithPhone === 'yes' ? 'no' : 'yes' })}
                      className={`p-5 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        formData.sellingWithPhone === 'yes'
                          ? 'border-trust-high bg-trust-high/10'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        formData.sellingWithPhone === 'yes' ? 'bg-trust-high/20' : 'bg-gray-100'
                      }`}>
                        <Phone className={`w-6 h-6 ${formData.sellingWithPhone === 'yes' ? 'text-trust-high' : 'text-gray-400'}`} />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-gray-900">Business Phone</div>
                        <div className="text-sm text-gray-500">Include phone with sale</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.sellingWithPhone === 'yes' ? 'border-trust-high bg-trust-high' : 'border-gray-300'
                      }`}>
                        {formData.sellingWithPhone === 'yes' && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </motion.button>
                  </div>
                </GlassCard>

                {/* Factoring Information */}
                <GlassCard>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Percent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Factoring Information</h3>
                      <p className="text-sm text-gray-500">Do you have an existing factoring agreement?</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasFactoring: 'yes' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.hasFactoring === 'yes'
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <CheckCircle className={`w-8 h-8 mx-auto mb-2 ${
                        formData.hasFactoring === 'yes' ? 'text-cyan-400' : 'text-gray-300'
                      }`} />
                      <div className="font-semibold text-gray-900">Yes, I have factoring</div>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, hasFactoring: 'no' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.hasFactoring === 'no'
                          ? 'border-gray-400 bg-gray-400/10'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <X className={`w-8 h-8 mx-auto mb-2 ${
                        formData.hasFactoring === 'no' ? 'text-gray-400' : 'text-gray-300'
                      }`} />
                      <div className="font-semibold text-gray-900">No factoring</div>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {formData.hasFactoring === 'yes' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid md:grid-cols-2 gap-4">
                          <Input
                            label="Factoring Company Name"
                            placeholder="Enter company name"
                            value={formData.factoringCompany}
                            onChange={(e) => setFormData({ ...formData, factoringCompany: e.target.value })}
                          />
                          <Input
                            label="Factoring Rate (%)"
                            type="number"
                            step="0.1"
                            placeholder="3.5"
                            value={formData.factoringRate}
                            onChange={(e) => setFormData({ ...formData, factoringRate: e.target.value })}
                            icon={<Percent className="w-4 h-4" />}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Letter of Release (LOR) <span className="text-gray-400">- Optional</span>
                          </label>
                          {uploadedFiles.factoringLOR ? (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                <div>
                                  <div className="font-medium text-sm">{uploadedFiles.factoringLOR.name}</div>
                                  <div className="text-xs text-gray-500">{uploadedFiles.factoringLOR.size}</div>
                                </div>
                              </div>
                              <button type="button" onClick={() => removeFile('factoringLOR')} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => simulateFileUpload('factoringLOR')}
                              className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-cyan-400/50 transition-colors text-center"
                            >
                              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                              <div className="text-sm text-gray-500">Click to upload LOR document</div>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)} size="lg">
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    size="lg"
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 px-8"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Authority Details */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <GlassCard className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 -m-6 mb-6 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <TruckIcon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Authority Details</h2>
                        <p className="text-gray-500">Tell buyers about your fleet and operations</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <Input
                      label="Years Active"
                      type="number"
                      placeholder="5"
                      value={formData.yearsActive}
                      onChange={(e) => setFormData({ ...formData, yearsActive: e.target.value })}
                      icon={<Calendar className="w-4 h-4 text-blue-400" />}
                    />
                    <Input
                      label="Fleet Size (Power Units)"
                      type="number"
                      placeholder="10"
                      value={formData.fleetSize}
                      onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                      icon={<TruckIcon className="w-4 h-4 text-indigo-400" />}
                    />
                    <Select
                      label="Safety Rating"
                      value={formData.safetyRating}
                      onChange={(e) => setFormData({ ...formData, safetyRating: e.target.value })}
                      options={[
                        { value: 'satisfactory', label: '✅ Satisfactory' },
                        { value: 'conditional', label: '⚠️ Conditional' },
                        { value: 'unsatisfactory', label: '❌ Unsatisfactory' },
                        { value: 'not-rated', label: '➖ Not Rated' }
                      ]}
                    />
                    <Select
                      label="Insurance Status"
                      value={formData.insuranceStatus}
                      onChange={(e) => setFormData({ ...formData, insuranceStatus: e.target.value })}
                      options={[
                        { value: 'active', label: '✅ Active' },
                        { value: 'expired', label: '❌ Expired' },
                        { value: 'pending', label: '⏳ Pending Renewal' }
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Operation Types <span className="text-gray-400">- Select all that apply</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {operationTypeOptions.map((type) => (
                        <motion.button
                          key={type.name}
                          type="button"
                          onClick={() => handleOperationTypeToggle(type.name)}
                          className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                            formData.operationTypes.includes(type.name)
                              ? 'border-primary-500 bg-primary-500/10'
                              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-lg">{type.icon}</span>
                          <span className={`text-sm font-medium ${
                            formData.operationTypes.includes(type.name) ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {type.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                {/* Summary Preview */}
                <GlassCard>
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg font-bold">Listing Preview</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'MC Number', value: formData.mcNumber || '-', color: 'primary' },
                      { label: 'DOT Number', value: formData.dotNumber || '-', color: 'purple' },
                      { label: 'State', value: formData.state || '-', color: 'blue' },
                      { label: 'Price', value: formData.price ? `$${Number(formData.price).toLocaleString()}` : '-', color: 'green' },
                      { label: 'Amazon Relay', value: formData.amazonStatus || '-', color: 'orange' },
                      { label: 'Highway', value: formData.highwaySetup || '-', color: 'cyan' },
                      { label: 'Entry Audit', value: formData.entryAuditCompleted === 'yes' ? 'Completed' : formData.entryAuditCompleted || '-', color: 'yellow' },
                      { label: 'Factoring', value: formData.hasFactoring || '-', color: 'pink' }
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                        <div className="font-semibold text-sm capitalize">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)} size="lg">
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(4)}
                    size="lg"
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 px-8"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Documents */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <GlassCard className="overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 -m-6 mb-6 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/25">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                        <p className="text-gray-500">Required documents for verification</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Article of Incorporation */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          uploadedFiles.articleOfIncorporation ? 'bg-trust-high/20' : 'bg-pink-500/20'
                        }`}>
                          {uploadedFiles.articleOfIncorporation ? (
                            <CheckCircle className="w-5 h-5 text-trust-high" />
                          ) : (
                            <Building2 className="w-5 h-5 text-pink-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Article of Incorporation</span>
                          <span className="text-red-400 ml-1">*</span>
                        </div>
                      </div>
                      {uploadedFiles.articleOfIncorporation ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-trust-high/10 border border-trust-high/30">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-trust-high" />
                            <span className="text-sm">{uploadedFiles.articleOfIncorporation.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile('articleOfIncorporation')} className="p-1 hover:bg-gray-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => simulateFileUpload('articleOfIncorporation')}
                          className="w-full p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-pink-400/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <div className="text-sm text-gray-500">Click to upload</div>
                        </button>
                      )}
                    </div>

                    {/* EIN Letter */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          uploadedFiles.einLetter ? 'bg-trust-high/20' : 'bg-rose-500/20'
                        }`}>
                          {uploadedFiles.einLetter ? (
                            <CheckCircle className="w-5 h-5 text-trust-high" />
                          ) : (
                            <FileText className="w-5 h-5 text-rose-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">EIN Letter</span>
                          <span className="text-red-400 ml-1">*</span>
                        </div>
                      </div>
                      {uploadedFiles.einLetter ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-trust-high/10 border border-trust-high/30">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-trust-high" />
                            <span className="text-sm">{uploadedFiles.einLetter.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile('einLetter')} className="p-1 hover:bg-gray-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => simulateFileUpload('einLetter')}
                          className="w-full p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-rose-400/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <div className="text-sm text-gray-500">Click to upload</div>
                        </button>
                      )}
                    </div>

                    {/* Driver License */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          uploadedFiles.driverLicense ? 'bg-trust-high/20' : 'bg-purple-500/20'
                        }`}>
                          {uploadedFiles.driverLicense ? (
                            <CheckCircle className="w-5 h-5 text-trust-high" />
                          ) : (
                            <BadgeCheck className="w-5 h-5 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Driver License</span>
                          <span className="text-red-400 ml-1">*</span>
                        </div>
                      </div>
                      {uploadedFiles.driverLicense ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-trust-high/10 border border-trust-high/30">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-trust-high" />
                            <span className="text-sm">{uploadedFiles.driverLicense.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile('driverLicense')} className="p-1 hover:bg-gray-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => simulateFileUpload('driverLicense')}
                          className="w-full p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-400/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <div className="text-sm text-gray-500">Click to upload</div>
                        </button>
                      )}
                    </div>

                    {/* COI - Certificate of Insurance */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          uploadedFiles.coi ? 'bg-trust-high/20' : 'bg-cyan-500/20'
                        }`}>
                          {uploadedFiles.coi ? (
                            <CheckCircle className="w-5 h-5 text-trust-high" />
                          ) : (
                            <Shield className="w-5 h-5 text-cyan-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">COI (Certificate of Insurance)</span>
                          <span className="text-red-400 ml-1">*</span>
                        </div>
                      </div>
                      {uploadedFiles.coi ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-trust-high/10 border border-trust-high/30">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-trust-high" />
                            <span className="text-sm">{uploadedFiles.coi.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile('coi')} className="p-1 hover:bg-gray-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => simulateFileUpload('coi')}
                          className="w-full p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-cyan-400/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <div className="text-sm text-gray-500">Click to upload</div>
                        </button>
                      )}
                    </div>

                    {/* Loss Run Report */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          uploadedFiles.lossRun ? 'bg-trust-high/20' : 'bg-orange-500/20'
                        }`}>
                          {uploadedFiles.lossRun ? (
                            <CheckCircle className="w-5 h-5 text-trust-high" />
                          ) : (
                            <ClipboardCheck className="w-5 h-5 text-orange-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-900">Copy of Loss Run</span>
                          <span className="text-red-400 ml-1">*</span>
                        </div>
                      </div>
                      {uploadedFiles.lossRun ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-trust-high/10 border border-trust-high/30">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-trust-high" />
                            <span className="text-sm">{uploadedFiles.lossRun.name}</span>
                          </div>
                          <button type="button" onClick={() => removeFile('lossRun')} className="p-1 hover:bg-gray-100 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => simulateFileUpload('lossRun')}
                          className="w-full p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400/50 transition-colors"
                        >
                          <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <div className="text-sm text-gray-500">Click to upload</div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Additional Documents */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Additional Documents <span className="text-gray-400">- Optional</span>
                    </label>

                    {uploadedFiles.additional.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {uploadedFiles.additional.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-primary-400" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <button type="button" onClick={() => removeFile('additional', file.id)} className="p-1 hover:bg-gray-100 rounded">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => simulateFileUpload('additional')}
                      className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400/50 transition-colors text-center"
                    >
                      <Upload className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                      <div className="text-sm text-gray-500">Safety records, UCC filings, etc.</div>
                    </button>
                  </div>
                </GlassCard>

                {/* Verification Notice */}
                <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/30 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-400 mb-1">Document Verification</p>
                    <p className="text-gray-600">Your documents will be reviewed by our team within 24-48 hours. You'll receive a notification once approved.</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(3)} size="lg">
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(5)}
                    size="lg"
                    className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 px-8"
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Payment/Invoice */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <GlassCard className="overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 -m-6 mb-6 p-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                        <DollarSign className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Listing Activation Fee</h2>
                        <p className="text-gray-500">One-time payment to activate your listing</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Details */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-primary-400">INVOICE</h3>
                        <p className="text-sm text-gray-500">{invoiceNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="border-t border-b border-gray-200 py-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <p className="font-medium text-gray-900">MC Authority Listing Activation</p>
                          <p className="text-sm text-gray-500">MC #{formData.mcNumber || 'N/A'} • {formData.state || 'N/A'}</p>
                        </div>
                        <p className="font-semibold text-gray-900">$35.00</p>
                      </div>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-trust-high" />
                          <span>30-day listing visibility</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-trust-high" />
                          <span>Verified seller badge</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-trust-high" />
                          <span>Priority review processing</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-trust-high" />
                          <span>Direct buyer messaging</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-lg">
                      <span className="font-bold">Total Due</span>
                      <span className="font-bold text-2xl text-trust-high">$35.00</span>
                    </div>
                  </div>

                  {/* Payment Method Info */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/30">
                      <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Secure Stripe Checkout</p>
                        <p className="text-sm text-gray-500">You'll be redirected to Stripe to complete your payment securely</p>
                      </div>
                    </div>
                  </div>

                  {/* Accepted Payment Methods */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Accepted Payment Methods</label>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-2xl">💳</span>
                      <span className="text-2xl">🅿️</span>
                      <span className="text-2xl">🍎</span>
                      <span className="text-sm text-gray-500 ml-auto">Credit Card, PayPal, Apple Pay & more</span>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="p-4 rounded-xl bg-trust-high/10 border border-trust-high/30 flex items-start gap-3 mb-6">
                    <Shield className="w-5 h-5 text-trust-high flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-trust-high mb-1">Secure Payment via Stripe</p>
                      <p className="text-gray-600">Your payment is processed securely by Stripe. We never see or store your payment details.</p>
                    </div>
                  </div>

                  {/* Error Display */}
                  {fmcsaError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 mb-6">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-red-600 mb-1">Payment Error</p>
                        <p className="text-red-600">{fmcsaError}</p>
                      </div>
                    </div>
                  )}
                </GlassCard>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button type="button" variant="secondary" onClick={() => setStep(4)} size="lg">
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePayment}
                    size="lg"
                    loading={paymentProcessing}
                    disabled={!formData.mcNumber}
                    className="bg-gradient-to-r from-trust-high to-green-500 hover:from-green-600 hover:to-emerald-600 px-8"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    {paymentProcessing ? 'Redirecting to Stripe...' : 'Pay $35.00 via Stripe'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Confirmation */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                {/* Loading State while creating listing */}
                {creatingListing && (
                  <GlassCard className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <RefreshCw className="w-12 h-12 text-primary-500 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Creating Your Listing...</h2>
                    <p className="text-gray-500">Please wait while we set up your listing.</p>
                  </GlassCard>
                )}

                {/* Error State */}
                {!creatingListing && fmcsaError && (
                  <GlassCard className="text-center py-12">
                    <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Something Went Wrong</h2>
                    <p className="text-red-500 mb-6">{fmcsaError}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                          setFmcsaError('')
                          setStep(1)
                        }}
                      >
                        Start Over
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        onClick={() => navigate('/seller/listings')}
                      >
                        View My Listings
                      </Button>
                    </div>
                  </GlassCard>
                )}

                {/* Success State */}
                {!creatingListing && !fmcsaError && listingCreated && (
                <GlassCard className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-trust-high to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-trust-high/30"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">Listing Created Successfully!</h2>
                    <p className="text-gray-500 mb-6">Your listing has been submitted for admin review</p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-trust-high/20 border border-trust-high/30 mb-8">
                      <CheckCircle className="w-4 h-4 text-trust-high" />
                      <span className="text-sm font-medium text-trust-high">Payment of $35.00 confirmed</span>
                    </div>
                  </motion.div>

                  {/* Listing Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-left max-w-md mx-auto mb-8"
                  >
                    <h3 className="font-semibold mb-4 text-center">Listing Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">MC Number</span>
                        <span className="font-medium text-gray-900">{formData.mcNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">DOT Number</span>
                        <span className="font-medium text-gray-900">{formData.dotNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">State</span>
                        <span className="font-medium text-gray-900">{formData.state || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Asking Price</span>
                        <span className="font-medium text-trust-high">${Number(formData.price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Invoice Number</span>
                        <span className="font-medium text-gray-900">{invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium text-yellow-400">Pending Review</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* What's Next */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-primary-500/10 rounded-xl p-6 border border-primary-500/30 text-left max-w-md mx-auto mb-8"
                  >
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary-400" />
                      What's Next?
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">1</div>
                        <div>
                          <p className="font-medium text-gray-900">Document Review</p>
                          <p className="text-gray-500">Our team will verify your documents within 24-48 hours</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">2</div>
                        <div>
                          <p className="font-medium text-gray-900">Listing Approval</p>
                          <p className="text-gray-500">Once approved, your listing goes live on the marketplace</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">3</div>
                        <div>
                          <p className="font-medium text-gray-900">Receive Offers</p>
                          <p className="text-gray-500">Verified buyers can view and make offers on your MC</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      size="lg"
                      onClick={() => navigate('/seller/listings')}
                    >
                      View My Listings
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => navigate('/seller/dashboard')}
                      className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </GlassCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  )
}

export default CreateListingPage
