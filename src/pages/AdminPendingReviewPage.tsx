import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  DollarSign,
  X,
  Crown,
  Shield,
  TruckIcon,
  Calendar,
  Package,
  RefreshCw,
  AlertCircle,
  User,
  Mail,
  MapPin,
  FileText,
  Loader2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel, formatPrice } from '../utils/helpers'
import { api } from '../services/api'

interface PendingListing {
  id: string
  mcNumber: string
  dotNumber?: string
  title: string
  description?: string
  askingPrice: number      // Seller's requested price
  listingPrice?: number    // Admin-set published price
  price?: number           // Legacy field
  isPremium: boolean
  seller: {
    id: string
    name: string
    email: string
    trustScore?: number
    verified?: boolean
  }
  yearsActive: number
  fleetSize: number
  safetyRating: string
  insuranceOnFile?: boolean
  city: string
  state: string
  cargoTypes?: string[]
  amazonStatus?: string
  createdAt: string
  updatedAt: string
}

const AdminPendingReviewPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [selectedListing, setSelectedListing] = useState<PendingListing | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [approvalNotes, setApprovalNotes] = useState('')
  const [listingPrice, setListingPrice] = useState('')
  const [processing, setProcessing] = useState(false)

  // Fetch pending listings from API
  const fetchPendingListings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.getAdminListings({ status: 'PENDING_REVIEW', limit: 100 })

      // Handle both direct data and wrapped response
      const listings = response?.data?.listings || response?.listings || response?.data || []
      setPendingListings(Array.isArray(listings) ? listings : [])
    } catch (err: any) {
      console.error('Failed to fetch pending listings:', err)
      setError(err.message || 'Failed to fetch pending listings')
      setPendingListings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingListings()
  }, [])

  const filteredListings = pendingListings.filter(listing => {
    const matchesSearch =
      listing.mcNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleApprove = async () => {
    if (!selectedListing) return

    setProcessing(true)
    try {
      // Parse listing price - if empty, use asking price
      const priceToSet = listingPrice ? parseFloat(listingPrice) : undefined
      await api.approveListing(selectedListing.id, approvalNotes || undefined, priceToSet)
      setPendingListings(prev => prev.filter(l => l.id !== selectedListing.id))
      setShowApproveModal(false)
      setApprovalNotes('')
      setListingPrice('')
      setSelectedListing(null)
    } catch (err: any) {
      console.error('Failed to approve listing:', err)
      alert(`Failed to approve listing: ${err.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedListing || !rejectionReason.trim()) return

    setProcessing(true)
    try {
      await api.rejectListing(selectedListing.id, rejectionReason)
      setPendingListings(prev => prev.filter(l => l.id !== selectedListing.id))
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedListing(null)
    } catch (err: any) {
      console.error('Failed to reject listing:', err)
      alert(`Failed to reject listing: ${err.message}`)
    } finally {
      setProcessing(false)
    }
  }

  const stats = [
    {
      icon: Clock,
      label: 'Total Pending',
      value: pendingListings.length,
      color: 'bg-yellow-100 text-yellow-700'
    },
    {
      icon: Crown,
      label: 'Premium Listings',
      value: pendingListings.filter(l => l.isPremium).length,
      color: 'bg-purple-100 text-purple-700'
    },
    {
      icon: CheckCircle,
      label: 'Ready to Review',
      value: pendingListings.length,
      color: 'bg-green-100 text-green-700'
    }
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      satisfactory: 'bg-green-100 text-green-700',
      conditional: 'bg-yellow-100 text-yellow-700',
      unsatisfactory: 'bg-red-100 text-red-700',
      'not-rated': 'bg-gray-100 text-gray-600'
    }
    return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-600'
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Safely parse cargo types which might be string, array, or undefined
  const parseCargoTypes = (cargoTypes: any): string[] => {
    if (!cargoTypes) return []
    if (Array.isArray(cargoTypes)) return cargoTypes
    if (typeof cargoTypes === 'string') {
      try {
        const parsed = JSON.parse(cargoTypes)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }
    return []
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pending Review</h1>
          <p className="text-gray-600 mt-1">Review and approve MC listings pending verification</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchPendingListings}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by MC number, title, or seller name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="p-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading pending listings...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="p-8 border-red-200 bg-red-50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Listings</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPendingListings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Pending Listings */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card hover className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    {/* Header Row */}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">MC #{listing.mcNumber}</h3>
                      {listing.dotNumber && (
                        <span className="text-sm text-gray-500">DOT #{listing.dotNumber}</span>
                      )}
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                      {listing.isPremium && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Premium
                        </span>
                      )}
                    </div>

                    <p className="text-gray-900 font-medium mb-2">{listing.title}</p>
                    {listing.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Years Active</div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          {listing.yearsActive || 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Fleet Size</div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                          <TruckIcon className="w-4 h-4 text-indigo-600" />
                          {listing.fleetSize || 0}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Safety Rating</div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${getStatusBadge(listing.safetyRating)}`}>
                          {listing.safetyRating?.replace('-', ' ') || 'Not Rated'}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Location</div>
                        <div className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-indigo-600" />
                          {listing.city}, {listing.state}
                        </div>
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{listing.seller?.name || 'Unknown Seller'}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {listing.seller?.email || 'No email'}
                        </div>
                      </div>
                      {listing.seller?.trustScore && (
                        <TrustBadge
                          score={listing.seller.trustScore}
                          level={getTrustLevel(listing.seller.trustScore)}
                          verified={listing.seller.verified || false}
                          size="sm"
                        />
                      )}
                    </div>

                    {/* Cargo Types */}
                    {parseCargoTypes(listing.cargoTypes).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {parseCargoTypes(listing.cargoTypes).map((type: string) => (
                          <span
                            key={type}
                            className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="lg:text-right lg:ml-6 lg:min-w-[160px]">
                    <div className="text-2xl font-bold text-indigo-600">
                      {formatPrice(listing.askingPrice || listing.price || 0)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Seller's Asking Price</div>
                    <div className="text-xs text-gray-400 mt-2">
                      Submitted {formatDate(listing.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 mt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/admin/review/${listing.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Details
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedListing(listing)
                      setShowApproveModal(true)
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>

                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setSelectedListing(listing)
                      setShowRejectModal(true)
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}

          {filteredListings.length === 0 && !loading && (
            <Card className="p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No pending listings</h3>
                <p className="text-gray-600">All listings have been reviewed</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowApproveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Approve Listing</h3>
                </div>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-500 mb-1">Listing</div>
                <div className="font-semibold text-gray-900">MC #{selectedListing.mcNumber}</div>
                <div className="text-gray-700 text-sm mt-1">{selectedListing.title}</div>
                <div className="text-indigo-600 font-bold mt-2">
                  Seller's Asking Price: {formatPrice(selectedListing.askingPrice || selectedListing.price || 0)}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Listing Price (What buyers will see)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder={`${selectedListing.askingPrice || selectedListing.price || 0}`}
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use seller's asking price
                </p>
              </div>

              <Textarea
                label="Approval Notes (Internal)"
                placeholder="Add any internal notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />

              <p className="text-sm text-gray-600 my-4 flex items-start gap-2">
                <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                This listing will be immediately visible on the marketplace after approval.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowApproveModal(false)}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleApprove}
                  disabled={processing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Approve Listing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Reject Listing</h3>
                </div>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-500 mb-1">Listing</div>
                <div className="font-semibold text-gray-900">MC #{selectedListing.mcNumber}</div>
                <div className="text-gray-700 text-sm mt-1">{selectedListing.title}</div>
                <div className="text-sm text-gray-500 mt-2">
                  Seller: {selectedListing.seller?.name}
                </div>
              </div>

              <Textarea
                label="Rejection Reason (Required)"
                placeholder="Explain why this listing is being rejected. This will be sent to the seller..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />

              <p className="text-sm text-red-600 my-4">
                The seller will be notified of this rejection with your explanation.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowRejectModal(false)}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleReject}
                  disabled={!rejectionReason.trim() || processing}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {processing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject Listing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPendingReviewPage
