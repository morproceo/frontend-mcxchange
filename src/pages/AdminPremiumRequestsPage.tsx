import { useState } from 'react'
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
  DollarSign,
  Send,
  ArrowLeft,
  Filter,
  Search,
  X,
  Building2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'

interface PremiumRequest {
  id: string
  mcNumber: string
  listingTitle: string
  listingPrice: number
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  buyerCompany: string
  message: string
  requestedAt: Date
  status: 'pending' | 'contacted' | 'completed' | 'declined'
  adminNotes?: string
  quotedPrice?: number
}

// Mock premium requests data
const mockPremiumRequests: PremiumRequest[] = [
  {
    id: '1',
    mcNumber: '789012',
    listingTitle: 'Premium 5-Year Texas MC Authority with Amazon Relay',
    listingPrice: 85000,
    buyerName: 'Michael Johnson',
    buyerEmail: 'michael@trucking.com',
    buyerPhone: '(555) 234-5678',
    buyerCompany: 'Johnson Logistics LLC',
    message: 'Very interested in this authority. I have an established trucking business and looking to expand. What is your best price?',
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'pending'
  },
  {
    id: '2',
    mcNumber: '456789',
    listingTitle: 'Premium CA Authority with Established Contracts',
    listingPrice: 120000,
    buyerName: 'Sarah Williams',
    buyerEmail: 'sarah@williamsfreight.com',
    buyerPhone: '(555) 345-6789',
    buyerCompany: 'Williams Freight Inc',
    message: 'Looking to acquire this authority for our west coast expansion. Can you provide more details about the Amazon contracts?',
    requestedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'contacted',
    adminNotes: 'Called buyer, sent pricing info. Waiting for response.',
    quotedPrice: 115000
  },
  {
    id: '3',
    mcNumber: '234567',
    listingTitle: 'Premium FL Authority with Full Insurance',
    listingPrice: 75000,
    buyerName: 'Robert Chen',
    buyerEmail: 'robert@chentrucking.com',
    buyerPhone: '(555) 456-7890',
    buyerCompany: 'Chen Trucking Services',
    message: 'Need more information about this MC. Is the seller flexible on price?',
    requestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'completed',
    adminNotes: 'Deal closed at $72,000. Transfer in progress.',
    quotedPrice: 72000
  },
  {
    id: '4',
    mcNumber: '567890',
    listingTitle: 'Premium Multi-State Authority',
    listingPrice: 95000,
    buyerName: 'David Martinez',
    buyerEmail: 'david@martinezlogistics.com',
    buyerPhone: '(555) 567-8901',
    buyerCompany: 'Martinez Logistics Group',
    message: 'What are the terms for this premium listing?',
    requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'declined',
    adminNotes: 'Buyer not qualified. No operating history.'
  }
]

const AdminPremiumRequestsPage = () => {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<PremiumRequest[]>(mockPremiumRequests)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<PremiumRequest | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [responseMessage, setResponseMessage] = useState('')
  const [quotedPrice, setQuotedPrice] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus
    const matchesSearch =
      req.mcNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'contacted': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'completed': return 'text-trust-high bg-trust-high/10 border-trust-high/30'
      case 'declined': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-500 bg-gray-100 border-white/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'contacted': return <MessageSquare className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'declined': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return 'Just now'
  }

  const handleUpdateStatus = (requestId: string, newStatus: PremiumRequest['status']) => {
    setRequests(prev => prev.map(req =>
      req.id === requestId ? { ...req, status: newStatus, adminNotes: adminNotes || req.adminNotes, quotedPrice: quotedPrice ? Number(quotedPrice) : req.quotedPrice } : req
    ))
    setShowResponseModal(false)
    setSelectedRequest(null)
    setResponseMessage('')
    setQuotedPrice('')
    setAdminNotes('')
  }

  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    completed: requests.filter(r => r.status === 'completed').length,
    declined: requests.filter(r => r.status === 'declined').length
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
            <p className="text-gray-500">Manage buyer inquiries for premium MC listings</p>
          </div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400">{stats.pending}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-400">{stats.contacted}</div>
              <div className="text-sm text-gray-500">Contacted</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-trust-high/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-trust-high" />
              </div>
              <div className="text-3xl font-bold text-trust-high">{stats.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center">
              <div className="w-12 h-12 rounded-xl bg-red-400/10 flex items-center justify-center mx-auto mb-3">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400">{stats.declined}</div>
              <div className="text-sm text-gray-500">Declined</div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by MC#, buyer name, or company..."
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
                <option value="completed">Completed</option>
                <option value="declined">Declined</option>
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
                          <span className="text-xl font-bold">MC #{request.mcNumber}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{request.listingTitle}</p>
                      <div className="text-2xl font-bold text-yellow-400">
                        ${request.listingPrice.toLocaleString()}
                        {request.quotedPrice && request.quotedPrice !== request.listingPrice && (
                          <span className="text-sm text-gray-500 ml-2">
                            (Quoted: ${request.quotedPrice.toLocaleString()})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Buyer Info */}
                    <div className="w-64 bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-primary-400" />
                        Buyer Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-gray-400" />
                          <span>{request.buyerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500">{request.buyerCompany}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <a href={`mailto:${request.buyerEmail}`} className="text-primary-400 hover:text-primary-300">
                            {request.buyerEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a href={`tel:${request.buyerPhone}`} className="text-primary-400 hover:text-primary-300">
                            {request.buyerPhone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        {formatTimeAgo(request.requestedAt)}
                      </div>
                    </div>
                  </div>

                  {/* Buyer Message */}
                  <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-primary-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Buyer Message:</div>
                        <p className="text-gray-700">{request.message}</p>
                      </div>
                    </div>
                  </div>

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
                      onClick={() => navigate(`/mc/${request.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Listing
                    </Button>

                    {request.status === 'pending' && (
                      <>
                        <Button
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowResponseModal(true)
                          }}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Respond to Buyer
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleUpdateStatus(request.id, 'declined')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                      </>
                    )}

                    {request.status === 'contacted' && (
                      <>
                        <Button
                          onClick={() => handleUpdateStatus(request.id, 'completed')}
                          className="bg-gradient-to-r from-trust-high to-green-500"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Completed
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setSelectedRequest(request)
                            setAdminNotes(request.adminNotes || '')
                            setQuotedPrice(request.quotedPrice?.toString() || '')
                            setShowResponseModal(true)
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Add Notes
                        </Button>
                      </>
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
                      <h3 className="text-xl font-bold">Respond to Request</h3>
                      <p className="text-sm text-gray-500">MC #{selectedRequest.mcNumber}</p>
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
                    <span className="font-semibold">{selectedRequest.buyerName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500">Company:</span>
                    <span>{selectedRequest.buyerCompany}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Listing Price:</span>
                    <span className="font-bold text-yellow-400">${selectedRequest.listingPrice.toLocaleString()}</span>
                  </div>
                </div>

                <Input
                  label="Quoted Price"
                  type="number"
                  placeholder="Enter quoted price..."
                  icon={<DollarSign className="w-4 h-4" />}
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                />

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
                    onClick={() => handleUpdateStatus(selectedRequest.id, 'contacted')}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
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
