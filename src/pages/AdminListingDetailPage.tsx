import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Building2,
  User,
  Shield,
  Globe,
  Truck,
  DollarSign,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Eye,
  Heart,
  Crown,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Hash,
  FileText,
  ExternalLink,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'
import api from '../services/api'

interface Listing {
  id: string
  mcNumber: string
  dotNumber: string
  legalName: string
  dbaName: string | null
  title: string
  description: string | null
  askingPrice: string
  listingPrice: string | null
  price?: string
  status: string
  visibility: string
  isPremium: boolean
  city: string
  state: string
  address: string | null
  yearsActive: number
  fleetSize: number
  totalDrivers: number
  safetyRating: string
  saferScore: string | null
  insuranceOnFile: boolean
  bipdCoverage: number | null
  cargoCoverage: number | null
  bondAmount: number | null
  amazonStatus: string
  amazonRelayScore: string | null
  highwaySetup: boolean
  sellingWithEmail: boolean
  sellingWithPhone: boolean
  contactEmail: string | null
  contactPhone: string | null
  cargoTypes: string
  fmcsaData: string | null
  authorityHistory: string | null
  insuranceHistory: string | null
  reviewNotes: string | null
  views: number
  saves: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  reviewedAt: string | null
  rejectionReason: string | null
  soldAt: string | null
  seller: {
    id: string
    name: string
    email: string
    phone: string | null
    verified: boolean
    trustScore: number
    createdAt: string
    companyName: string | null
  }
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]

const AdminListingDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    mcNumber: '',
    dotNumber: '',
    legalName: '',
    dbaName: '',
    title: '',
    description: '',
    askingPrice: '',
    listingPrice: '',
    city: '',
    state: '',
    address: '',
    yearsActive: '',
    fleetSize: '',
    totalDrivers: '',
    safetyRating: 'NONE',
    saferScore: '',
    insuranceOnFile: false,
    bipdCoverage: '',
    cargoCoverage: '',
    bondAmount: '',
    amazonStatus: 'NONE',
    amazonRelayScore: '',
    highwaySetup: false,
    sellingWithEmail: false,
    sellingWithPhone: false,
    contactEmail: '',
    contactPhone: '',
    cargoTypes: '',
    reviewNotes: '',
    status: 'DRAFT',
    visibility: 'PUBLIC',
    isPremium: false,
  })

  useEffect(() => {
    if (id) {
      fetchListing()
    }
  }, [id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getAdminListing(id!)
      const data = response.data

      setListing(data)

      // Parse cargoTypes
      let cargoTypesStr = ''
      if (data.cargoTypes) {
        try {
          const parsed = JSON.parse(data.cargoTypes)
          cargoTypesStr = Array.isArray(parsed) ? parsed.join(', ') : ''
        } catch {
          cargoTypesStr = ''
        }
      }

      // Populate form
      setFormData({
        mcNumber: data.mcNumber || '',
        dotNumber: data.dotNumber || '',
        legalName: data.legalName || '',
        dbaName: data.dbaName || '',
        title: data.title || '',
        description: data.description || '',
        askingPrice: data.askingPrice ? parseFloat(data.askingPrice).toString() : (data.price ? parseFloat(data.price).toString() : ''),
        listingPrice: data.listingPrice ? parseFloat(data.listingPrice).toString() : '',
        city: data.city || '',
        state: data.state || '',
        address: data.address || '',
        yearsActive: data.yearsActive?.toString() || '',
        fleetSize: data.fleetSize?.toString() || '',
        totalDrivers: data.totalDrivers?.toString() || '',
        safetyRating: data.safetyRating || 'NONE',
        saferScore: data.saferScore || '',
        insuranceOnFile: data.insuranceOnFile || false,
        bipdCoverage: data.bipdCoverage?.toString() || '',
        cargoCoverage: data.cargoCoverage?.toString() || '',
        bondAmount: data.bondAmount?.toString() || '',
        amazonStatus: data.amazonStatus || 'NONE',
        amazonRelayScore: data.amazonRelayScore || '',
        highwaySetup: data.highwaySetup || false,
        sellingWithEmail: data.sellingWithEmail || false,
        sellingWithPhone: data.sellingWithPhone || false,
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        cargoTypes: cargoTypesStr,
        reviewNotes: data.reviewNotes || '',
        status: data.status || 'DRAFT',
        visibility: data.visibility || 'PUBLIC',
        isPremium: data.isPremium || false,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      // Build update data
      const updateData: any = {
        mcNumber: formData.mcNumber,
        dotNumber: formData.dotNumber,
        legalName: formData.legalName,
        dbaName: formData.dbaName || null,
        title: formData.title,
        description: formData.description || null,
        askingPrice: parseFloat(formData.askingPrice) || 0,
        listingPrice: formData.listingPrice ? parseFloat(formData.listingPrice) : null,
        city: formData.city,
        state: formData.state,
        address: formData.address || null,
        yearsActive: parseInt(formData.yearsActive) || 0,
        fleetSize: parseInt(formData.fleetSize) || 0,
        totalDrivers: parseInt(formData.totalDrivers) || 0,
        safetyRating: formData.safetyRating,
        saferScore: formData.saferScore || null,
        insuranceOnFile: formData.insuranceOnFile,
        bipdCoverage: formData.bipdCoverage ? parseFloat(formData.bipdCoverage) : null,
        cargoCoverage: formData.cargoCoverage ? parseFloat(formData.cargoCoverage) : null,
        bondAmount: formData.bondAmount ? parseFloat(formData.bondAmount) : null,
        amazonStatus: formData.amazonStatus,
        amazonRelayScore: formData.amazonRelayScore || null,
        highwaySetup: formData.highwaySetup,
        sellingWithEmail: formData.sellingWithEmail,
        sellingWithPhone: formData.sellingWithPhone,
        contactEmail: formData.contactEmail || null,
        contactPhone: formData.contactPhone || null,
        cargoTypes: formData.cargoTypes.split(',').map(t => t.trim()).filter(Boolean),
        reviewNotes: formData.reviewNotes || null,
        status: formData.status,
        visibility: formData.visibility,
        isPremium: formData.isPremium,
      }

      await api.updateAdminListing(id, updateData)
      setSuccessMessage('Listing updated successfully!')
      fetchListing() // Refresh data
    } catch (err: any) {
      setError(err.message || 'Failed to update listing')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-700',
      PENDING_REVIEW: 'bg-yellow-100 text-yellow-700',
      SOLD: 'bg-blue-100 text-blue-700',
      REJECTED: 'bg-red-100 text-red-700',
      DRAFT: 'bg-purple-100 text-purple-700',
      RESERVED: 'bg-orange-100 text-orange-700',
      SUSPENDED: 'bg-red-100 text-red-700',
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-gray-500">Loading listing details...</p>
        </div>
      </div>
    )
  }

  if (error && !listing) {
    return (
      <div className="p-4 lg:p-8">
        <button
          onClick={() => navigate('/admin/listings')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Listings
        </button>
        <Card className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Listing</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/admin/listings')}>Back to Listings</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/listings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              {formData.isPremium && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3" /> PREMIUM
                </span>
              )}
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(formData.status)}`}>
                {formData.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
              MC-{formData.mcNumber}
            </h1>
            <p className="text-gray-600">DOT-{formData.dotNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.open(`/mc/${id}`, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Public Page
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {successMessage && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Authority Numbers */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-600" />
                Authority Numbers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MC Number *</label>
                  <Input
                    value={formData.mcNumber}
                    onChange={(e) => handleInputChange('mcNumber', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DOT Number *</label>
                  <Input
                    value={formData.dotNumber}
                    onChange={(e) => handleInputChange('dotNumber', e.target.value)}
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Company Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Company Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Legal Name *</label>
                    <Input
                      value={formData.legalName}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DBA Name</label>
                    <Input
                      value={formData.dbaName}
                      onChange={(e) => handleInputChange('dbaName', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Select State</option>
                      {US_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Business Details
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years Active</label>
                  <Input
                    type="number"
                    value={formData.yearsActive}
                    onChange={(e) => handleInputChange('yearsActive', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Size</label>
                  <Input
                    type="number"
                    value={formData.fleetSize}
                    onChange={(e) => handleInputChange('fleetSize', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Drivers</label>
                  <Input
                    type="number"
                    value={formData.totalDrivers}
                    onChange={(e) => handleInputChange('totalDrivers', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Types (comma separated)</label>
                <Input
                  value={formData.cargoTypes}
                  onChange={(e) => handleInputChange('cargoTypes', e.target.value)}
                  placeholder="General Freight, Dry Van, Refrigerated"
                />
              </div>
            </Card>

            {/* Safety & Insurance */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                Safety & Insurance
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Safety Rating</label>
                    <select
                      value={formData.safetyRating}
                      onChange={(e) => handleInputChange('safetyRating', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="NONE">None</option>
                      <option value="SATISFACTORY">Satisfactory</option>
                      <option value="CONDITIONAL">Conditional</option>
                      <option value="UNSATISFACTORY">Unsatisfactory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SAFER Score</label>
                    <Input
                      value={formData.saferScore}
                      onChange={(e) => handleInputChange('saferScore', e.target.value)}
                      placeholder="e.g., 85"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.insuranceOnFile}
                        onChange={(e) => handleInputChange('insuranceOnFile', e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Insurance on File</span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BIPD Coverage ($)</label>
                    <Input
                      type="number"
                      value={formData.bipdCoverage}
                      onChange={(e) => handleInputChange('bipdCoverage', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Coverage ($)</label>
                    <Input
                      type="number"
                      value={formData.cargoCoverage}
                      onChange={(e) => handleInputChange('cargoCoverage', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bond Amount ($)</label>
                    <Input
                      type="number"
                      value={formData.bondAmount}
                      onChange={(e) => handleInputChange('bondAmount', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Platform Integrations */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-600" />
                Platform Integrations
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amazon Relay Status</label>
                    <select
                      value={formData.amazonStatus}
                      onChange={(e) => handleInputChange('amazonStatus', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="NONE">None</option>
                      <option value="PENDING">Pending</option>
                      <option value="ACTIVE">Active</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amazon Relay Score</label>
                    <Input
                      value={formData.amazonRelayScore}
                      onChange={(e) => handleInputChange('amazonRelayScore', e.target.value)}
                      placeholder="e.g., Fantastic"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.highwaySetup}
                      onChange={(e) => handleInputChange('highwaySetup', e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Highway Setup</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sellingWithEmail}
                      onChange={(e) => handleInputChange('sellingWithEmail', e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Selling with Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sellingWithPhone}
                      onChange={(e) => handleInputChange('sellingWithPhone', e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Selling with Phone</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                    <Input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Admin Notes */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Admin Review Notes
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (not visible to seller)</label>
                <Textarea
                  value={formData.reviewNotes}
                  onChange={(e) => handleInputChange('reviewNotes', e.target.value)}
                  rows={4}
                  placeholder="Add internal notes about this listing..."
                />
              </div>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Status & Pricing */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                Status & Pricing
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PENDING_REVIEW">Pending Review</option>
                    <option value="ACTIVE">Active</option>
                    <option value="RESERVED">Reserved</option>
                    <option value="SOLD">Sold</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                    <option value="UNLISTED">Unlisted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asking Price ($) *</label>
                  <Input
                    type="number"
                    value={formData.askingPrice}
                    onChange={(e) => handleInputChange('askingPrice', e.target.value)}
                    required
                    placeholder="Seller's requested price"
                  />
                  <p className="text-xs text-gray-500 mt-1">Price requested by seller</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Listing Price ($)</label>
                  <Input
                    type="number"
                    value={formData.listingPrice}
                    onChange={(e) => handleInputChange('listingPrice', e.target.value)}
                    placeholder="Published price (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Price shown to buyers (defaults to asking price if empty)</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Crown className="w-4 h-4 text-amber-500" /> Premium Listing
                  </span>
                </label>
              </div>
            </Card>

            {/* Statistics */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Eye className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{listing?.views || 0}</p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Heart className="w-4 h-4" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{listing?.saves || 0}</p>
                  <p className="text-xs text-gray-500">Saves</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">
                    {listing?.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span className="text-gray-900">
                    {listing?.updatedAt ? new Date(listing.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                {listing?.publishedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Published</span>
                    <span className="text-gray-900">
                      {new Date(listing.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Seller Info */}
            {listing?.seller && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Seller Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{listing.seller.name}</p>
                      {listing.seller.companyName && (
                        <p className="text-xs text-gray-500">{listing.seller.companyName}</p>
                      )}
                      <TrustBadge
                        score={listing.seller.trustScore}
                        level={getTrustLevel(listing.seller.trustScore)}
                        verified={listing.seller.verified}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {listing.seller.email}
                    </p>
                    {listing.seller.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {listing.seller.phone}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Member since {new Date(listing.seller.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => navigate(`/admin/users/${listing.seller.id}`)}
                  >
                    View Seller Profile
                  </Button>
                </div>
              </Card>
            )}

            {/* Rejection Info */}
            {listing?.rejectionReason && (
              <Card className="p-6 bg-red-50 border-red-200">
                <h2 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Rejection Reason
                </h2>
                <p className="text-red-700 text-sm">{listing.rejectionReason}</p>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminListingDetailPage
