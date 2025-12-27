import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  User,
  ArrowLeft,
  Search,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import api from '../services/api'
import { toast } from 'react-hot-toast'

interface Consultation {
  id: string
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  message: string
  status: string
  amount: number
  stripeSessionId?: string
  stripePaymentIntentId?: string
  paidAt?: string
  scheduledAt?: string
  completedAt?: string
  adminNotes?: string
  contactedBy?: string
  contactedAt?: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  pending: number
  paid: number
  scheduled: number
  completed: number
  totalRevenue: number
}

const AdminConsultationsPage = () => {
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const [refunding, setRefunding] = useState(false)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<{ total: number; pages: number }>({ total: 0, pages: 0 })

  useEffect(() => {
    fetchData()
  }, [page, filterStatus])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [consultationsRes, statsRes] = await Promise.all([
        api.getAdminConsultations({
          page,
          limit: 20,
          status: filterStatus !== 'all' ? filterStatus : undefined,
          search: searchQuery || undefined,
        }),
        api.getConsultationStats(),
      ])
      setConsultations(consultationsRes.consultations)
      setPagination({ total: consultationsRes.pagination.total, pages: consultationsRes.pagination.pages })
      setStats(statsRes)
    } catch (error: any) {
      console.error('Failed to fetch consultations:', error)
      toast.error('Failed to load consultations')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchData()
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedConsultation) return

    setUpdating(true)
    try {
      await api.updateConsultationStatus(selectedConsultation.id, newStatus, adminNotes)
      toast.success(`Status updated to ${newStatus}`)
      setShowDetailModal(false)
      fetchData()
    } catch (error: any) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const handleRefund = async () => {
    if (!selectedConsultation) return

    if (!window.confirm('Are you sure you want to refund this consultation? This action cannot be undone.')) {
      return
    }

    setRefunding(true)
    try {
      await api.refundConsultation(selectedConsultation.id)
      toast.success('Refund processed successfully')
      setShowDetailModal(false)
      fetchData()
    } catch (error: any) {
      console.error('Failed to process refund:', error)
      toast.error('Failed to process refund')
    } finally {
      setRefunding(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return 'text-gray-500 bg-gray-100 border-gray-300'
      case 'PAID':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'SCHEDULED':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'COMPLETED':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'REFUNDED':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-gray-500 bg-gray-100 border-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT':
        return <Clock className="w-4 h-4" />
      case 'PAID':
        return <DollarSign className="w-4 h-4" />
      case 'SCHEDULED':
        return <Calendar className="w-4 h-4" />
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED':
      case 'REFUNDED':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const openDetailModal = (consultation: Consultation) => {
    setSelectedConsultation(consultation)
    setAdminNotes(consultation.adminNotes || '')
    setShowDetailModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
            <p className="text-gray-500">Manage consultation bookings and payments</p>
          </div>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Pending Payment</div>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Paid</div>
            <div className="text-2xl font-bold text-blue-600">{stats.paid}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Scheduled</div>
            <div className="text-2xl font-bold text-purple-600">{stats.scheduled}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-bold text-secondary-600">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="Search"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="w-[180px]">
            <Select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="PENDING_PAYMENT">Pending Payment</option>
              <option value="PAID">Paid</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </Select>
          </div>
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Consultations Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-secondary-500" />
          </div>
        ) : consultations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
            <p className="text-gray-500">Consultations will appear here when users book them.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Preferred Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map((consultation) => (
                  <motion.tr
                    key={consultation.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-secondary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{consultation.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {consultation.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Phone className="w-3 h-3" />
                          {consultation.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {consultation.preferredDate} at {consultation.preferredTime}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          consultation.status
                        )}`}
                      >
                        {getStatusIcon(consultation.status)}
                        {consultation.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">
                        ${parseFloat(String(consultation.amount)).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(consultation.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost" onClick={() => openDetailModal(consultation)}>
                        View Details
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Page {page} of {pagination.pages} ({pagination.total} total)
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {showDetailModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Consultation Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                  <div className="text-gray-900 font-medium">{selectedConsultation.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <div className="text-gray-900">{selectedConsultation.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                  <div className="text-gray-900">{selectedConsultation.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Preferred Date/Time</label>
                  <div className="text-gray-900">
                    {selectedConsultation.preferredDate} at {selectedConsultation.preferredTime}
                  </div>
                </div>
              </div>

              {/* Message */}
              {selectedConsultation.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Message</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-gray-700">
                    {selectedConsultation.message}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-100">
                <h3 className="font-medium text-gray-900 mb-3">Payment Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      ${parseFloat(String(selectedConsultation.amount)).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        selectedConsultation.status
                      )}`}
                    >
                      {selectedConsultation.status.replace('_', ' ')}
                    </span>
                  </div>
                  {selectedConsultation.paidAt && (
                    <div>
                      <span className="text-gray-500">Paid At:</span>
                      <span className="ml-2 text-gray-900">
                        {formatDate(selectedConsultation.paidAt)}
                      </span>
                    </div>
                  )}
                  {selectedConsultation.stripePaymentIntentId && (
                    <div>
                      <span className="text-gray-500">Payment ID:</span>
                      <span className="ml-2 text-gray-600 font-mono text-xs">
                        {selectedConsultation.stripePaymentIntentId.slice(0, 20)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this consultation..."
                  rows={3}
                />
              </div>

              {/* Status Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {selectedConsultation.status === 'PAID' && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate('SCHEDULED')}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Calendar className="w-4 h-4 mr-2" />
                      )}
                      Mark Scheduled
                    </Button>
                  )}
                  {(selectedConsultation.status === 'PAID' ||
                    selectedConsultation.status === 'SCHEDULED') && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleStatusUpdate('COMPLETED')}
                      disabled={updating}
                    >
                      {updating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Mark Completed
                    </Button>
                  )}
                  {(selectedConsultation.status === 'PAID' ||
                    selectedConsultation.status === 'SCHEDULED') && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusUpdate('CANCELLED')}
                      disabled={updating}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                  {selectedConsultation.status === 'PAID' && selectedConsultation.stripePaymentIntentId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={handleRefund}
                      disabled={refunding}
                    >
                      {refunding ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <DollarSign className="w-4 h-4 mr-2" />
                      )}
                      Process Refund
                    </Button>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
                <div>Created: {formatDate(selectedConsultation.createdAt)}</div>
                {selectedConsultation.contactedAt && (
                  <div>Contacted: {formatDate(selectedConsultation.contactedAt)}</div>
                )}
                {selectedConsultation.scheduledAt && (
                  <div>Scheduled: {formatDate(selectedConsultation.scheduledAt)}</div>
                )}
                {selectedConsultation.completedAt && (
                  <div>Completed: {formatDate(selectedConsultation.completedAt)}</div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminConsultationsPage
