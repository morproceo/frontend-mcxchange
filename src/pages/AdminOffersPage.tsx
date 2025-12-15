import { useState } from 'react'
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
  FileText
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { TransactionOffer, OfferStatus } from '../types'

const AdminOffersPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'all'>('all')
  const [selectedOffer, setSelectedOffer] = useState<TransactionOffer | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  // Mock offers data
  const offers: TransactionOffer[] = [
    {
      id: 'offer-1',
      listingId: 'listing-1',
      listing: {
        id: 'listing-1',
        mcNumber: '789012',
        title: 'Established 5-Year MC Authority',
        price: 15000
      } as any,
      buyerId: 'buyer-1',
      buyer: {
        id: 'buyer-1',
        name: 'John Smith',
        email: 'john@example.com',
        trustScore: 85
      } as any,
      sellerId: 'seller-1',
      seller: {
        id: 'seller-1',
        name: 'Transport Co',
        email: 'transport@example.com',
        trustScore: 92
      } as any,
      offerAmount: 14000,
      message: 'I am very interested in this MC authority. Ready to proceed quickly.',
      status: 'pending',
      depositAmount: 1000,
      depositPaid: false,
      createdAt: new Date('2024-01-18T10:30:00'),
      updatedAt: new Date('2024-01-18T10:30:00')
    },
    {
      id: 'offer-2',
      listingId: 'listing-2',
      listing: {
        id: 'listing-2',
        mcNumber: '456789',
        title: '3-Year MC with Highway Setup',
        price: 12000
      } as any,
      buyerId: 'buyer-2',
      buyer: {
        id: 'buyer-2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        trustScore: 78
      } as any,
      sellerId: 'seller-2',
      seller: {
        id: 'seller-2',
        name: 'Freight Masters',
        email: 'freight@example.com',
        trustScore: 88
      } as any,
      offerAmount: 11500,
      message: 'Looking to expand my business. This MC fits my needs perfectly.',
      status: 'pending',
      depositAmount: 1000,
      depositPaid: false,
      createdAt: new Date('2024-01-17T14:15:00'),
      updatedAt: new Date('2024-01-17T14:15:00')
    },
    {
      id: 'offer-3',
      listingId: 'listing-3',
      listing: {
        id: 'listing-3',
        mcNumber: '123456',
        title: '7-Year Premium MC Authority',
        price: 22000
      } as any,
      buyerId: 'buyer-3',
      buyer: {
        id: 'buyer-3',
        name: 'Mike Davis',
        email: 'mike@example.com',
        trustScore: 92
      } as any,
      sellerId: 'seller-3',
      seller: {
        id: 'seller-3',
        name: 'Quick Haul LLC',
        email: 'quickhaul@example.com',
        trustScore: 95
      } as any,
      offerAmount: 20000,
      message: 'Willing to pay deposit immediately upon approval.',
      status: 'admin-approved',
      adminNotes: 'Verified buyer with good history. Proceed with deposit.',
      depositAmount: 1000,
      depositPaid: false,
      createdAt: new Date('2024-01-16T09:00:00'),
      updatedAt: new Date('2024-01-17T11:00:00')
    },
    {
      id: 'offer-4',
      listingId: 'listing-4',
      listing: {
        id: 'listing-4',
        mcNumber: '987654',
        title: '2-Year MC Fresh Start',
        price: 8000
      } as any,
      buyerId: 'buyer-4',
      buyer: {
        id: 'buyer-4',
        name: 'Lisa Chen',
        email: 'lisa@example.com',
        trustScore: 70
      } as any,
      sellerId: 'seller-4',
      seller: {
        id: 'seller-4',
        name: 'New Roads Inc',
        email: 'newroads@example.com',
        trustScore: 82
      } as any,
      offerAmount: 7000,
      message: 'First time buyer, eager to get started.',
      status: 'deposit-paid',
      adminNotes: 'Deposit received and verified.',
      depositAmount: 1000,
      depositPaid: true,
      depositPaidAt: new Date('2024-01-15T16:00:00'),
      transactionId: 'txn-123',
      createdAt: new Date('2024-01-14T08:00:00'),
      updatedAt: new Date('2024-01-15T16:00:00')
    }
  ]

  const getStatusBadge = (status: OfferStatus) => {
    const config = {
      'pending': { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      'admin-approved': { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      'admin-rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
      'deposit-pending': { label: 'Awaiting Deposit', color: 'bg-blue-100 text-blue-700', icon: CreditCard },
      'deposit-paid': { label: 'Deposit Received', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      'in-transaction': { label: 'In Transaction', color: 'bg-purple-100 text-purple-700', icon: FileText },
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      'cancelled': { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: X }
    }
    return config[status]
  }

  const filteredOffers = offers.filter(offer => {
    const matchesSearch =
      offer.listing.mcNumber.includes(searchQuery) ||
      offer.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.seller.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || offer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    pending: offers.filter(o => o.status === 'pending').length,
    approved: offers.filter(o => o.status === 'admin-approved').length,
    depositPaid: offers.filter(o => o.status === 'deposit-paid').length,
    inTransaction: offers.filter(o => o.status === 'in-transaction').length
  }

  const handleApprove = async () => {
    if (!selectedOffer) return
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setProcessing(false)
    setShowDetailModal(false)
    alert('Offer approved! Buyer will be notified to pay deposit.')
  }

  const handleReject = async () => {
    if (!selectedOffer) return
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setProcessing(false)
    setShowDetailModal(false)
    alert('Offer rejected. Buyer will be notified.')
  }

  const handleCreateTransaction = async () => {
    if (!selectedOffer) return
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setProcessing(false)
    setShowDetailModal(false)
    alert('Transaction room created! Both parties will be notified.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Offer Management</h1>
        <p className="text-gray-500">Review and manage buyer offers</p>
      </div>

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
              <p className="text-sm text-emerald-600">Deposit Paid</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.depositPaid}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">In Transaction</p>
              <p className="text-2xl font-bold text-purple-700">{stats.inTransaction}</p>
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
              onChange={(e) => setStatusFilter(e.target.value as OfferStatus | 'all')}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Review</option>
              <option value="admin-approved">Approved</option>
              <option value="admin-rejected">Rejected</option>
              <option value="deposit-paid">Deposit Paid</option>
              <option value="in-transaction">In Transaction</option>
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
                          <h3 className="font-semibold text-gray-900">MC #{offer.listing.mcNumber}</h3>
                          <p className="text-sm text-gray-500">{offer.listing.title}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Buyer</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {offer.buyer.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Seller</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {offer.seller.name}
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
                        <p className="text-xl font-bold text-gray-900">${offer.offerAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">
                          Asking: ${offer.listing.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      {offer.status === 'pending' && (
                        <>
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
                        </>
                      )}
                      {offer.status === 'deposit-paid' && !offer.transactionId && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedOffer(offer)
                            handleCreateTransaction()
                          }}
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Create Transaction
                        </Button>
                      )}
                      {offer.transactionId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.location.href = `/transaction/${offer.transactionId}`
                          }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View Transaction
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                    <span>Submitted: {offer.createdAt.toLocaleDateString()} at {offer.createdAt.toLocaleTimeString()}</span>
                    {offer.depositPaid && (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        Deposit Paid
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

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
                  <h2 className="text-xl font-bold text-gray-900">Offer Details</h2>
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
                        <h3 className="font-semibold text-gray-900">MC #{selectedOffer.listing.mcNumber}</h3>
                        <p className="text-sm text-gray-500">{selectedOffer.listing.title}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Asking Price</p>
                      <p className="text-lg font-bold text-gray-900">${selectedOffer.listing.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Offer Amount</span>
                    <span className="text-2xl font-bold text-green-600">${selectedOffer.offerAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Buyer & Seller Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">Buyer</h4>
                    <p className="font-semibold text-gray-900">{selectedOffer.buyer.name}</p>
                    <p className="text-sm text-gray-500">{selectedOffer.buyer.email}</p>
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <span className="text-gray-500">Trust Score:</span>
                      <span className="font-medium text-gray-900">{selectedOffer.buyer.trustScore}%</span>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <h4 className="text-sm font-medium text-purple-800 mb-3">Seller</h4>
                    <p className="font-semibold text-gray-900">{selectedOffer.seller.name}</p>
                    <p className="text-sm text-gray-500">{selectedOffer.seller.email}</p>
                    <div className="mt-2 flex items-center gap-1 text-sm">
                      <span className="text-gray-500">Trust Score:</span>
                      <span className="font-medium text-gray-900">{selectedOffer.seller.trustScore}%</span>
                    </div>
                  </div>
                </div>

                {/* Buyer Message */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Buyer's Message</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">{selectedOffer.message}</p>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedOffer.status === 'pending' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Notes</h4>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 resize-none"
                      placeholder="Add internal notes about this offer..."
                    />
                  </div>
                )}

                {selectedOffer.adminNotes && selectedOffer.status !== 'pending' && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Notes</h4>
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <p className="text-gray-700">{selectedOffer.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Info Box */}
                {selectedOffer.status === 'pending' && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Approval Flow</p>
                        <p className="text-blue-700">
                          Upon approval, the buyer will be prompted to pay a $1,000 refundable deposit.
                          Once paid, a transaction room will be created for both parties.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedOffer.status === 'deposit-paid' && !selectedOffer.transactionId && (
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-emerald-800">
                        <p className="font-medium mb-1">Ready for Transaction</p>
                        <p className="text-emerald-700">
                          Deposit has been received. Click "Create Transaction Room" to open the shared
                          transaction space where both parties can review and approve the deal.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3">
                {selectedOffer.status === 'pending' && (
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
                {selectedOffer.status === 'deposit-paid' && !selectedOffer.transactionId && (
                  <Button
                    fullWidth
                    onClick={handleCreateTransaction}
                    loading={processing}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Create Transaction Room
                  </Button>
                )}
                {selectedOffer.transactionId && (
                  <Button
                    fullWidth
                    onClick={() => window.location.href = `/transaction/${selectedOffer.transactionId}`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Transaction Room
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
