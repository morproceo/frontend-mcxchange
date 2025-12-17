import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  User,
  Eye,
  MessageSquare,
  CreditCard,
  ArrowRight,
  X,
  AlertCircle,
  Check,
  FileText,
  ShoppingCart,
  Loader2,
  RefreshCw
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import api from '../services/api'

interface Offer {
  id: string
  amount: number
  message?: string
  status: string
  isBuyNow?: boolean
  counterAmount?: number
  counterMessage?: string
  counterAt?: string
  expiresAt?: string
  respondedAt?: string
  adminReviewedBy?: string
  adminReviewedAt?: string
  adminNotes?: string
  listingId: string
  buyerId: string
  sellerId: string
  createdAt: string
  updatedAt: string
  listing?: {
    id: string
    mcNumber: string
    title: string
    price: number
    status: string
  }
  buyer?: {
    id: string
    name: string
    email: string
    phone?: string
    verified: boolean
    trustScore: number
  }
  seller?: {
    id: string
    name: string
    email: string
    phone?: string
    verified: boolean
  }
}

type FilterStatus = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACCEPTED'

const AdminOffersPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState(false)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  const fetchOffers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: { page?: number; limit?: number; status?: string } = {
        page: pagination.page,
        limit: pagination.limit,
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }
      const response = await api.getAdminOffers(params)
      setOffers(response.data || [])
      if (response.pagination) {
        setPagination(response.pagination)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load offers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [statusFilter, pagination.page])

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string; icon: any }> = {
      'PENDING': { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      'APPROVED': { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      'REJECTED': { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
      'ACCEPTED': { label: 'Accepted', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      'COUNTERED': { label: 'Countered', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
      'EXPIRED': { label: 'Expired', color: 'bg-gray-100 text-gray-700', icon: Clock },
      'WITHDRAWN': { label: 'Withdrawn', color: 'bg-gray-100 text-gray-700', icon: X }
    }
    return config[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: Clock }
  }

  const filteredOffers = offers.filter(offer => {
    const matchesSearch =
      offer.listing?.mcNumber?.includes(searchQuery) ||
      offer.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const stats = {
    pending: offers.filter(o => o.status === 'PENDING').length,
    approved: offers.filter(o => o.status === 'APPROVED').length,
    accepted: offers.filter(o => o.status === 'ACCEPTED').length,
    buyNow: offers.filter(o => o.isBuyNow).length
  }

  const handleApprove = async () => {
    if (!selectedOffer) return
    setProcessing(true)
    try {
      await api.approveOffer(selectedOffer.id, adminNotes || undefined)
      setShowDetailModal(false)
      setAdminNotes('')
      fetchOffers()
    } catch (err: any) {
      alert(err.message || 'Failed to approve offer')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!selectedOffer) return
    if (!adminNotes.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    setProcessing(true)
    try {
      await api.rejectOffer(selectedOffer.id, adminNotes)
      setShowDetailModal(false)
      setAdminNotes('')
      fetchOffers()
    } catch (err: any) {
      alert(err.message || 'Failed to reject offer')
    } finally {
      setProcessing(false)
    }
  }

  if (loading && offers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
          <p className="text-gray-500">Review and manage buyer offers and buy now requests</p>
        </div>
        <Button variant="outline" onClick={fetchOffers} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-700">{stats.approved}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-600">Accepted</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.accepted}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Buy Now Requests</p>
              <p className="text-2xl font-bold text-purple-700">{stats.buyNow}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by MC#, buyer, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ACCEPTED">Accepted</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Offers Found</h3>
              <p className="text-gray-500">No offers match your current filters</p>
            </div>
          </Card>
        ) : (
          filteredOffers.map((offer, index) => {
            const statusConfig = getStatusBadge(offer.status)
            const StatusIcon = statusConfig.icon

            return (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="cursor-pointer" onClick={() => {
                  setSelectedOffer(offer)
                  setAdminNotes(offer.adminNotes || '')
                  setShowDetailModal(true)
                }}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* MC Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">MC #{offer.listing?.mcNumber || 'N/A'}</h3>
                            {offer.isBuyNow && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <ShoppingCart className="w-3 h-3" />
                                Buy Now
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{offer.listing?.title || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Buyer</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {offer.buyer?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Seller</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {offer.seller?.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col items-start lg:items-end gap-2">
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig.label}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Offer Amount</p>
                        <p className="text-xl font-bold text-gray-900">${Number(offer.amount).toLocaleString()}</p>
                        <p className="text-xs text-gray-400">
                          Asking: ${Number(offer.listing?.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      {offer.status === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOffer(offer)
                            setAdminNotes('')
                            setShowDetailModal(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Submitted: {new Date(offer.createdAt).toLocaleDateString()} at {new Date(offer.createdAt).toLocaleTimeString()}</span>
                    {offer.adminReviewedAt && (
                      <span className="flex items-center gap-1 text-gray-500">
                        Reviewed: {new Date(offer.adminReviewedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">Offer Details</h2>
                    {selectedOffer.isBuyNow && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        Buy Now Request
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                {/* MC & Pricing */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">MC #{selectedOffer.listing?.mcNumber || 'N/A'}</h3>
                        <p className="text-sm text-gray-500">{selectedOffer.listing?.title || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Asking Price</p>
                      <p className="text-lg font-bold text-gray-900">${Number(selectedOffer.listing?.price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Offer Amount</span>
                    <span className="text-2xl font-bold text-green-600">${Number(selectedOffer.amount).toLocaleString()}</span>
                  </div>
                </div>

                {/* Buyer & Seller Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">Buyer</h4>
                    <p className="font-semibold text-gray-900">{selectedOffer.buyer?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{selectedOffer.buyer?.email || 'N/A'}</p>
                    {selectedOffer.buyer?.phone && (
                      <p className="text-sm text-gray-500">{selectedOffer.buyer.phone}</p>
                    )}
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <span className="text-gray-500">Trust Score:</span>
                      <span className="font-medium text-gray-900">{selectedOffer.buyer?.trustScore || 0}%</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-purple-800 mb-3">Seller</h4>
                    <p className="font-semibold text-gray-900">{selectedOffer.seller?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-500">{selectedOffer.seller?.email || 'N/A'}</p>
                    {selectedOffer.seller?.phone && (
                      <p className="text-sm text-gray-500">{selectedOffer.seller.phone}</p>
                    )}
                  </div>
                </div>

                {/* Buyer Message */}
                {selectedOffer.message && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Buyer's Message</h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-gray-700">{selectedOffer.message}</p>
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                {selectedOffer.status === 'PENDING' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Notes (required for rejection)</h4>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 resize-none"
                      placeholder="Add internal notes about this offer..."
                    />
                  </div>
                )}

                {selectedOffer.adminNotes && selectedOffer.status !== 'PENDING' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Notes</h4>
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <p className="text-gray-700">{selectedOffer.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Info Box */}
                {selectedOffer.status === 'PENDING' && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Approval Flow</p>
                        <p className="text-blue-700">
                          Upon approval, the buyer will be notified and prompted to pay a deposit.
                          Once paid, a transaction room will be created for both parties.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3">
                {selectedOffer.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleReject}
                      loading={processing}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Offer
                    </Button>
                    <Button
                      fullWidth
                      onClick={handleApprove}
                      loading={processing}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Approve Offer
                    </Button>
                  </>
                )}
                {selectedOffer.status !== 'PENDING' && (
                  <Button
                    fullWidth
                    variant="outline"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Close
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminOffersPage
