import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Crown,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Mail,
  Phone,
  User,
  Calendar,
  ArrowLeft,
  Filter,
  Search,
  X,
  CreditCard,
  Loader2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import api from '../services/api'

interface PremiumRequest {
  id: string
  status: 'PENDING' | 'CONTACTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  message?: string
  adminNotes?: string
  contactedAt?: string
  contactedBy?: string
  buyerId: string
  listingId: string
  createdAt: string
  updatedAt: string
  buyer: {
    id: string
    name: string
    email: string
    phone?: string
    trustScore: number
    totalCredits?: number
    usedCredits?: number
  }
  listing: {
    id: string
    mcNumber: string
    title: string
    price: string
    seller?: {
      id: string
      name: string
      email: string
    }
  }
}

const AdminPremiumRequestsPage = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<PremiumRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<PremiumRequest | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)

  // Fetch premium requests from API
  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/premium-requests')
      if (response.success) {
        setRequests(response.data || [])
      } else {
        setError(response.error || 'Failed to fetch premium requests')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch premium requests')
    } finally {
      setLoading(false)
    }
  }

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status.toLowerCase() === filterStatus
    const matchesSearch =
      req.listing?.mcNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.buyer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'CONTACTED': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'IN_PROGRESS': return 'text-purple-400 bg-purple-400/10 border-purple-400/30'
      case 'COMPLETED': return 'text-trust-high bg-trust-high/10 border-trust-high/30'
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-500 bg-gray-100 border-white/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'CONTACTED': return <MessageSquare className="w-4 h-4" />
      case 'IN_PROGRESS': return <Loader2 className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const handleUpdateStatus = async (requestId: string, newStatus: string) => {
    try {
      setUpdating(true)
      const response = await api.put(`/admin/premium-requests/${requestId}`, {
        status: newStatus,
        notes: adminNotes || undefined
      })

      if (response.success) {
        // Refresh the list
        await fetchRequests()
        setShowResponseModal(false)
        setSelectedRequest(null)
        setAdminNotes('')

        // Show success message based on action
        if (newStatus === 'COMPLETED') {
          alert('Request approved! Buyer now has access to the listing and 1 credit has been deducted.')
        }
      } else {
        alert(response.error || 'Failed to update request')
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update request')
    } finally {
      setUpdating(false)
    }
  }

  const stats = {
    pending: requests.filter(r => r.status === 'PENDING').length,
    contacted: requests.filter(r => r.status === 'CONTACTED').length,
    inProgress: requests.filter(r => r.status === 'IN_PROGRESS').length,
    completed: requests.filter(r => r.status === 'COMPLETED').length,
    cancelled: requests.filter(r => r.status === 'CANCELLED').length
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <Crown className="w-5 h-5 text-gray-900" />
              </div>
              <h1 className="text-2xl font-bold">Premium MC Requests</h1>
            </div>
            <p className="text-gray-500">Approve buyer requests to access premium MC listings</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-400">{stats.contacted}</div>
              <div className="text-sm text-gray-500">Contacted</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center mx-auto mb-3">
                <Loader2 className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-purple-400">{stats.inProgress}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-trust-high/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-trust-high" />
              </div>
              <div className="text-3xl font-bold text-trust-high">{stats.completed}</div>
              <div className="text-sm text-gray-500">Approved</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-red-400/10 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400">{stats.cancelled}</div>
              <div className="text-sm text-gray-500">Cancelled</div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by MC#, buyer name, or email..."
                icon={<Search className="w-4 h-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Approved</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Requests Found</h3>
              <p className="text-gray-500">
                {searchQuery || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'No premium MC requests yet'}
              </p>
            </Card>
          ) : (
            filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-6">
                    {/* MC Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Crown className="w-5 h-5 text-yellow-400" />
                          <span className="text-xl font-bold">MC #{request.listing?.mcNumber}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{request.listing?.title}</p>
                      <div className="text-lg font-bold text-primary-400">
                        ${parseFloat(request.listing?.price || '0').toLocaleString()}
                      </div>
                    </div>

                    {/* Buyer Info */}
                    <div className="w-72 bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-400" />
                        Buyer Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">{request.buyer?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <a href={`mailto:${request.buyer?.email}`} className="text-primary-400 hover:text-primary-300">
                            {request.buyer?.email}
                          </a>
                        </div>
                        {request.buyer?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <a href={`tel:${request.buyer?.phone}`} className="text-primary-400 hover:text-primary-300">
                              {request.buyer?.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                          <CreditCard className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500">Credits: </span>
                          <span className="font-bold text-trust-high">
                            {(request.buyer?.totalCredits || 0) - (request.buyer?.usedCredits || 0)} available
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        {formatTimeAgo(request.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Buyer Message */}
                  {request.message && (
                    <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-primary-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">Buyer Message:</div>
                          <p className="text-gray-700">{request.message}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  {request.adminNotes && (
                    <div className="mt-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/30">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-400 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-primary-400 mb-1">Admin Notes:</div>
                          <p className="text-gray-700">{request.adminNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/mc/${request.listing?.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Listing
                    </Button>

                    {request.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                          disabled={updating}
                          className="bg-gradient-to-r from-trust-high to-green-500"
                        >
                          {updating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve & Unlock
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowResponseModal(true)
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contact Buyer
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleUpdateStatus(request.id, 'CANCELLED')}
                          disabled={updating}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    )}

                    {request.status === 'CONTACTED' && (
                      <>
                        <Button
                          onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                          disabled={updating}
                          className="bg-gradient-to-r from-trust-high to-green-500"
                        >
                          {updating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4 mr-2" />
                          )}
                          Approve & Unlock
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedRequest(request)
                            setAdminNotes(request.adminNotes || '')
                            setShowResponseModal(true)
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Update Notes
                        </Button>
                      </>
                    )}

                    {request.status === 'IN_PROGRESS' && (
                      <Button
                        onClick={() => handleUpdateStatus(request.id, 'COMPLETED')}
                        disabled={updating}
                        className="bg-gradient-to-r from-trust-high to-green-500"
                      >
                        {updating ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Approve & Unlock
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowResponseModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 -m-6 mb-6 p-6 border-b border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Update Request</h3>
                      <p className="text-sm text-gray-500">MC #{selectedRequest.listing?.mcNumber}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500">Buyer:</span>
                    <span className="font-semibold">{selectedRequest.buyer?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span>{selectedRequest.buyer?.email}</span>
                  </div>
                </div>

                <Textarea
                  label="Admin Notes"
                  placeholder="Add internal notes about this request..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />

                <div className="flex gap-3 pt-2">
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => setShowResponseModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'CONTACTED')}
                    disabled={updating}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MessageSquare className="w-4 h-4 mr-2" />
                    )}
                    Mark as Contacted
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default AdminPremiumRequestsPage
