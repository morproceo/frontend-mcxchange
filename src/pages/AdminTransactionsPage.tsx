import { useEffect, useMemo, useState } from 'react'
import {
  DollarSign,
  Search,
  RefreshCw,
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Receipt
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import api from '../services/api'

interface Transaction {
  id: string
  status: string
  agreedPrice?: number | string
  depositAmount?: number | string
  platformFee?: number | string | null
  finalPaymentAmount?: number | string | null
  depositPaidAt?: string | null
  finalPaidAt?: string | null
  depositPaymentMethod?: string | null
  finalPaymentMethod?: string | null
  createdAt: string
  updatedAt: string
  listing?: {
    id: string
    mcNumber: string
    title: string
  }
  buyer?: {
    id: string
    name: string
    email: string
  }
  seller?: {
    id: string
    name: string
    email: string
  }
}

const formatMoney = (value?: number | string | null) => {
  const amount = Number(value || 0)
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').toLowerCase()
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-trust-high/20 text-trust-high">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      )
    case 'CANCELLED':
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      )
    case 'DISPUTED':
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
          <AlertTriangle className="w-3 h-3" />
          Disputed
        </span>
      )
    default:
      return (
        <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-400/20 text-yellow-400">
          <Clock className="w-3 h-3" />
          {formatStatus(status)}
        </span>
      )
  }
}

const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month')
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.getAdminTransactions({ limit: 200 })
        setTransactions(response.data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  const filteredTransactions = useMemo(() => {
    const now = new Date()
    const rangeStart = (() => {
      switch (dateRange) {
        case 'today':
          return new Date(now.getFullYear(), now.getMonth(), now.getDate())
        case 'week': {
          const start = new Date(now)
          start.setDate(now.getDate() - 7)
          return start
        }
        case 'month':
          return new Date(now.getFullYear(), now.getMonth(), 1)
        case 'year':
          return new Date(now.getFullYear(), 0, 1)
        default:
          return null
      }
    })()

    return transactions.filter((txn) => {
      const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
      const search = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !search ||
        txn.id.toLowerCase().includes(search) ||
        (txn.listing?.mcNumber || '').toLowerCase().includes(search) ||
        (txn.listing?.title || '').toLowerCase().includes(search) ||
        (txn.buyer?.name || '').toLowerCase().includes(search) ||
        (txn.buyer?.email || '').toLowerCase().includes(search) ||
        (txn.seller?.name || '').toLowerCase().includes(search)

      if (!rangeStart) {
        return matchesStatus && matchesSearch
      }

      const createdAt = new Date(txn.createdAt)
      return createdAt >= rangeStart && matchesStatus && matchesSearch
    })
  }, [transactions, searchQuery, statusFilter, dateRange])

  const stats = useMemo(() => {
    const completed = transactions.filter((txn) => txn.status === 'COMPLETED')
    const pending = transactions.filter((txn) => txn.status !== 'COMPLETED' && txn.status !== 'CANCELLED')
    const totalVolume = completed.reduce((sum, txn) => sum + Number(txn.agreedPrice || 0), 0)
    const totalFees = completed.reduce((sum, txn) => sum + Number(txn.platformFee || 0), 0)
    return {
      totalVolume,
      totalFees,
      completedCount: completed.length,
      pendingCount: pending.length,
    }
  }, [transactions])

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Transactions</h1>
            <p className="text-gray-500">All marketplace transactions</p>
          </div>
          <Button variant="secondary" disabled>
            <RefreshCw className="w-4 h-4 mr-2" />
            Stripe integration coming soon
          </Button>
        </div>

        <Card className="mb-6 !p-4 border border-yellow-200 bg-yellow-50">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div className="text-sm text-yellow-700">
              Stripe account sync is not connected yet. This view shows platform transactions only. Stripe history integration is coming soon.
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-trust-high" />
            </div>
            <div className="text-2xl font-bold text-trust-high">${stats.totalVolume.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Completed Volume</div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">${stats.totalFees.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Platform Fees</div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-500">{stats.completedCount}</div>
            <div className="text-xs text-gray-500">Completed Deals</div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-400">{stats.pendingCount}</div>
            <div className="text-xs text-gray-500">Open Deals</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by MC#, buyer, seller, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500"
            >
              <option value="all">All Statuses</option>
              <option value="AWAITING_DEPOSIT">Awaiting Deposit</option>
              <option value="DEPOSIT_RECEIVED">Deposit Received</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="BUYER_APPROVED">Buyer Approved</option>
              <option value="SELLER_APPROVED">Seller Approved</option>
              <option value="BOTH_APPROVED">Both Approved</option>
              <option value="ADMIN_FINAL_REVIEW">Admin Final Review</option>
              <option value="PAYMENT_PENDING">Payment Pending</option>
              <option value="PAYMENT_RECEIVED">Payment Received</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DISPUTED">Disputed</option>
            </select>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </Card>

        {/* Transactions List */}
        {loading ? (
          <Card>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Loading transactions...</h3>
              <p className="text-gray-500">Fetching the latest data</p>
            </div>
          </Card>
        ) : error ? (
          <Card>
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Unable to load transactions</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((txn) => (
              <Card key={txn.id} hover className="cursor-pointer">
                <div
                  className="flex items-center gap-4"
                  onClick={() => setSelectedTransaction(selectedTransaction === txn.id ? null : txn.id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Package className="w-4 h-4 text-primary-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">
                        {txn.listing?.title || `Transaction ${txn.id}`}
                      </span>
                      {getStatusBadge(txn.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="font-mono text-xs">{txn.id}</span>
                      <span>•</span>
                      <span>{txn.buyer?.name || 'Buyer'}</span>
                      <span>•</span>
                      <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-bold text-trust-high">
                      ${formatMoney(txn.agreedPrice)}
                    </div>
                    <div className="text-xs text-gray-400">
                      Fee: ${formatMoney(txn.platformFee)}
                    </div>
                  </div>
                </div>

                {selectedTransaction === txn.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary-400" />
                          Buyer
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-900">{txn.buyer?.name || 'Unknown buyer'}</div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{txn.buyer?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary-400" />
                          Seller
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="text-gray-900">{txn.seller?.name || 'Unknown seller'}</div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{txn.seller?.email || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-primary-400" />
                          Amounts
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Agreed:</span>
                            <span className="text-gray-900">${formatMoney(txn.agreedPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Deposit:</span>
                            <span className="text-gray-900">${formatMoney(txn.depositAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Final:</span>
                            <span className="text-gray-900">${formatMoney(txn.finalPaymentAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {txn.listing && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary-400" />
                            Listing
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="text-gray-900 font-semibold">MC #{txn.listing.mcNumber}</div>
                            <div className="text-gray-500">{txn.listing.title}</div>
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary-400" />
                          Payment Status
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Deposit:</span>
                            <span className="text-gray-900">
                              {txn.depositPaidAt ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Final:</span>
                            <span className="text-gray-900">
                              {txn.finalPaidAt ? 'Paid' : 'Pending'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Deposit Method:</span>
                            <span className="text-gray-900">{txn.depositPaymentMethod || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Final Method:</span>
                            <span className="text-gray-900">{txn.finalPaymentMethod || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created: {new Date(txn.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Updated: {new Date(txn.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {filteredTransactions.length === 0 && (
              <Card>
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-900/20 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Transactions Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              </Card>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminTransactionsPage
