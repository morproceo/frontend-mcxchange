import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DollarSign,
  Search,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  ExternalLink,
  Receipt,
  TrendingUp,
  X
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

interface Transaction {
  id: string
  stripeId: string
  type: 'payment' | 'payout' | 'refund' | 'fee' | 'credit_purchase'
  description: string
  amount: number
  fee: number
  net: number
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'partially_refunded'
  refundable: boolean
  refundedAmount: number
  customer: {
    id: string
    name: string
    email: string
    phone: string
  }
  seller?: {
    id: string
    name: string
    email: string
  }
  listing?: {
    id: string
    mcNumber: string
    title: string
  }
  paymentMethod: {
    type: 'card' | 'bank' | 'ach'
    brand?: string
    last4: string
    expMonth?: number
    expYear?: number
  }
  metadata: {
    ip: string
    country: string
    riskScore: string
  }
  createdAt: string
  updatedAt: string
}

const AdminTransactionsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'payments' | 'refunds' | 'payouts' | 'credits'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed' | 'refunded'>('all')
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year' | 'all'>('month')
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [processingRefund, setProcessingRefund] = useState(false)

  // Mock transactions data
  const transactions: Transaction[] = [
    {
      id: 'txn_001',
      stripeId: 'pi_3OxKL2ABC123DEF456',
      type: 'payment',
      description: 'MC Authority Purchase - MC #789012',
      amount: 15000.00,
      fee: 465.00,
      net: 14535.00,
      status: 'completed',
      refundable: true,
      refundedAmount: 0,
      customer: {
        id: 'cus_001',
        name: 'John Smith',
        email: 'john.smith@trucking.com',
        phone: '(555) 123-4567'
      },
      seller: {
        id: 'sel_001',
        name: 'Premium Seller Inc',
        email: 'sales@premiumseller.com'
      },
      listing: {
        id: 'lst_001',
        mcNumber: '789012',
        title: '5-Year Amazon Active MC Authority'
      },
      paymentMethod: {
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025
      },
      metadata: {
        ip: '192.168.1.100',
        country: 'US',
        riskScore: 'low'
      },
      createdAt: '2024-01-15T14:32:00Z',
      updatedAt: '2024-01-15T14:32:05Z'
    },
    {
      id: 'txn_002',
      stripeId: 'pi_3OxKL2ABC123DEF457',
      type: 'payment',
      description: 'MC Authority Purchase - MC #345678',
      amount: 8500.00,
      fee: 276.50,
      net: 8223.50,
      status: 'completed',
      refundable: true,
      refundedAmount: 0,
      customer: {
        id: 'cus_002',
        name: 'Sarah Johnson',
        email: 'sarah.j@logistics.com',
        phone: '(555) 234-5678'
      },
      seller: {
        id: 'sel_002',
        name: 'Elite MC Authority',
        email: 'contact@elitemc.com'
      },
      listing: {
        id: 'lst_002',
        mcNumber: '345678',
        title: 'Highway Setup MC with Clean Record'
      },
      paymentMethod: {
        type: 'card',
        brand: 'Mastercard',
        last4: '5555',
        expMonth: 8,
        expYear: 2026
      },
      metadata: {
        ip: '192.168.1.101',
        country: 'US',
        riskScore: 'low'
      },
      createdAt: '2024-01-15T11:15:00Z',
      updatedAt: '2024-01-15T11:15:03Z'
    },
    {
      id: 'txn_003',
      stripeId: 'po_3OxKL2ABC123DEF458',
      type: 'payout',
      description: 'Payout to Bank Account ****4567',
      amount: 25000.00,
      fee: 0,
      net: 25000.00,
      status: 'completed',
      refundable: false,
      refundedAmount: 0,
      customer: {
        id: 'admin',
        name: 'Domilea LLC',
        email: 'finance@domilea.com',
        phone: '(555) 000-0000'
      },
      paymentMethod: {
        type: 'bank',
        last4: '4567'
      },
      metadata: {
        ip: 'N/A',
        country: 'US',
        riskScore: 'N/A'
      },
      createdAt: '2024-01-14T09:00:00Z',
      updatedAt: '2024-01-14T09:00:10Z'
    },
    {
      id: 'txn_004',
      stripeId: 'pi_3OxKL2ABC123DEF459',
      type: 'credit_purchase',
      description: 'Credit Package - 50 Credits',
      amount: 250.00,
      fee: 7.55,
      net: 242.45,
      status: 'completed',
      refundable: true,
      refundedAmount: 0,
      customer: {
        id: 'cus_003',
        name: 'Mike Wilson',
        email: 'mike.w@carrier.net',
        phone: '(555) 345-6789'
      },
      paymentMethod: {
        type: 'card',
        brand: 'Amex',
        last4: '1234',
        expMonth: 3,
        expYear: 2025
      },
      metadata: {
        ip: '192.168.1.102',
        country: 'US',
        riskScore: 'low'
      },
      createdAt: '2024-01-15T16:45:00Z',
      updatedAt: '2024-01-15T16:45:02Z'
    },
    {
      id: 'txn_005',
      stripeId: 're_3OxKL2ABC123DEF460',
      type: 'refund',
      description: 'Refund - MC #123456 (Cancelled Deal)',
      amount: 3500.00,
      fee: 0,
      net: 3500.00,
      status: 'completed',
      refundable: false,
      refundedAmount: 0,
      customer: {
        id: 'cus_004',
        name: 'Emily Davis',
        email: 'emily.davis@freight.com',
        phone: '(555) 456-7890'
      },
      listing: {
        id: 'lst_003',
        mcNumber: '123456',
        title: 'Local Operations MC Authority'
      },
      paymentMethod: {
        type: 'card',
        brand: 'Visa',
        last4: '9999',
        expMonth: 6,
        expYear: 2024
      },
      metadata: {
        ip: '192.168.1.103',
        country: 'US',
        riskScore: 'N/A'
      },
      createdAt: '2024-01-13T10:20:00Z',
      updatedAt: '2024-01-13T10:20:15Z'
    },
    {
      id: 'txn_006',
      stripeId: 'pi_3OxKL2ABC123DEF461',
      type: 'payment',
      description: 'MC Authority Purchase - MC #567890',
      amount: 12000.00,
      fee: 378.00,
      net: 11622.00,
      status: 'partially_refunded',
      refundable: true,
      refundedAmount: 2000.00,
      customer: {
        id: 'cus_005',
        name: 'Robert Brown',
        email: 'r.brown@transport.com',
        phone: '(555) 567-8901'
      },
      seller: {
        id: 'sel_003',
        name: 'Top Tier Transport',
        email: 'info@toptier.com'
      },
      listing: {
        id: 'lst_004',
        mcNumber: '567890',
        title: 'Premium MC with Amazon Relay'
      },
      paymentMethod: {
        type: 'card',
        brand: 'Visa',
        last4: '7777',
        expMonth: 11,
        expYear: 2026
      },
      metadata: {
        ip: '192.168.1.104',
        country: 'US',
        riskScore: 'medium'
      },
      createdAt: '2024-01-12T15:30:00Z',
      updatedAt: '2024-01-14T11:00:00Z'
    },
    {
      id: 'txn_007',
      stripeId: 'pi_3OxKL2ABC123DEF462',
      type: 'payment',
      description: 'Premium Listing Fee - MC #901234',
      amount: 500.00,
      fee: 14.80,
      net: 485.20,
      status: 'pending',
      refundable: false,
      refundedAmount: 0,
      customer: {
        id: 'cus_006',
        name: 'Lisa Anderson',
        email: 'lisa.a@mcauthority.com',
        phone: '(555) 678-9012'
      },
      paymentMethod: {
        type: 'card',
        brand: 'Discover',
        last4: '6789',
        expMonth: 9,
        expYear: 2025
      },
      metadata: {
        ip: '192.168.1.105',
        country: 'US',
        riskScore: 'low'
      },
      createdAt: '2024-01-15T18:00:00Z',
      updatedAt: '2024-01-15T18:00:00Z'
    },
    {
      id: 'txn_008',
      stripeId: 'pi_3OxKL2ABC123DEF463',
      type: 'payment',
      description: 'Credit Package - 100 Credits',
      amount: 450.00,
      fee: 13.35,
      net: 436.65,
      status: 'failed',
      refundable: false,
      refundedAmount: 0,
      customer: {
        id: 'cus_007',
        name: 'David Chen',
        email: 'david.chen@logistics.com',
        phone: '(555) 789-0123'
      },
      paymentMethod: {
        type: 'card',
        brand: 'Visa',
        last4: '1111',
        expMonth: 1,
        expYear: 2024
      },
      metadata: {
        ip: '192.168.1.106',
        country: 'US',
        riskScore: 'high'
      },
      createdAt: '2024-01-15T08:30:00Z',
      updatedAt: '2024-01-15T08:30:05Z'
    }
  ]

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    // Tab filter
    let matchesTab = true
    if (activeTab === 'payments') matchesTab = txn.type === 'payment'
    else if (activeTab === 'refunds') matchesTab = txn.type === 'refund'
    else if (activeTab === 'payouts') matchesTab = txn.type === 'payout'
    else if (activeTab === 'credits') matchesTab = txn.type === 'credit_purchase'

    // Status filter
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter

    // Search filter
    const matchesSearch = searchQuery === '' ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.stripeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesStatus && matchesSearch
  })

  // Calculate stats
  const stats = {
    totalEarnings: transactions
      .filter(t => t.type === 'payment' || t.type === 'credit_purchase')
      .filter(t => t.status === 'completed' || t.status === 'partially_refunded')
      .reduce((sum, t) => sum + t.net, 0),
    totalRefunds: transactions
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0) +
      transactions.reduce((sum, t) => sum + t.refundedAmount, 0),
    totalPayouts: transactions
      .filter(t => t.type === 'payout')
      .reduce((sum, t) => sum + t.amount, 0),
    totalFees: transactions
      .reduce((sum, t) => sum + t.fee, 0),
    pendingAmount: transactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-trust-high/20 text-trust-high">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-yellow-400/20 text-yellow-400">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        )
      case 'failed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        )
      case 'refunded':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-500/20 text-purple-400">
            <RotateCcw className="w-3 h-3" />
            Refunded
          </span>
        )
      case 'partially_refunded':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
            <RotateCcw className="w-3 h-3" />
            Partial Refund
          </span>
        )
    }
  }

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'payment':
        return <ArrowDownLeft className="w-4 h-4 text-trust-high" />
      case 'payout':
        return <ArrowUpRight className="w-4 h-4 text-blue-400" />
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-purple-400" />
      case 'credit_purchase':
        return <CreditCard className="w-4 h-4 text-primary-400" />
      case 'fee':
        return <Receipt className="w-4 h-4 text-gray-500" />
    }
  }

  const handleRefund = () => {
    setProcessingRefund(true)
    // Simulate refund processing
    setTimeout(() => {
      setProcessingRefund(false)
      setShowRefundModal(false)
      setRefundAmount('')
      setRefundReason('')
      // In real app, would update transaction status
    }, 2000)
  }

  const selectedTxn = transactions.find(t => t.id === selectedTransaction)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-1">Transactions</h1>
            <p className="text-gray-500">View and manage all Stripe transactions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync with Stripe
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-trust-high" />
            </div>
            <div className="text-2xl font-bold text-trust-high">${stats.totalEarnings.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Earnings</div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <RotateCcw className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400">${stats.totalRefunds.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Refunds</div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpRight className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400">${stats.totalPayouts.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Payouts</div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <Receipt className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-yellow-400">${stats.totalFees.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Processing Fees</div>
          </Card>

          <Card className="!p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-400">${stats.pendingAmount.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'all', label: 'All Transactions' },
            { id: 'payments', label: 'Payments' },
            { id: 'refunds', label: 'Refunds' },
            { id: 'payouts', label: 'Payouts' },
            { id: 'credits', label: 'Credit Purchases' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-gray-900'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID, customer, email, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {(['all', 'completed', 'pending', 'failed', 'refunded'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? 'bg-primary-500 text-gray-900'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </Card>

        {/* Transactions List */}
        <div className="space-y-3">
          {filteredTransactions.map((txn) => (
            <Card key={txn.id} hover className="cursor-pointer">
              <div
                className="flex items-center gap-4"
                onClick={() => setSelectedTransaction(selectedTransaction === txn.id ? null : txn.id)}
              >
                {/* Type Icon */}
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  {getTypeIcon(txn.type)}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold truncate">{txn.description}</span>
                    {getStatusBadge(txn.status)}
                    {txn.refundedAmount > 0 && txn.status !== 'refunded' && (
                      <span className="text-xs text-orange-400">
                        (${txn.refundedAmount.toLocaleString()} refunded)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-mono text-xs">{txn.stripeId}</span>
                    <span>•</span>
                    <span>{txn.customer.name}</span>
                    <span>•</span>
                    <span>{new Date(txn.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    txn.type === 'payout' || txn.type === 'refund'
                      ? 'text-red-400'
                      : txn.status === 'failed'
                      ? 'text-gray-400'
                      : 'text-trust-high'
                  }`}>
                    {txn.type === 'payout' || txn.type === 'refund' ? '-' : '+'}
                    ${txn.amount.toLocaleString()}
                  </div>
                  {txn.fee > 0 && (
                    <div className="text-xs text-gray-400">Fee: ${txn.fee.toLocaleString()}</div>
                  )}
                </div>

                {/* Expand Arrow */}
                <div className="text-gray-400">
                  {selectedTransaction === txn.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {/* Expanded Transaction Profile */}
              <AnimatePresence>
                {selectedTransaction === txn.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary-400" />
                          Customer
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900">{txn.customer.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{txn.customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{txn.customer.phone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary-400" />
                          Payment Method
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 capitalize">{txn.paymentMethod.type}</span>
                            {txn.paymentMethod.brand && (
                              <span className="text-gray-500">({txn.paymentMethod.brand})</span>
                            )}
                          </div>
                          <div className="text-gray-500">
                            •••• {txn.paymentMethod.last4}
                          </div>
                          {txn.paymentMethod.expMonth && (
                            <div className="text-gray-500">
                              Expires {txn.paymentMethod.expMonth}/{txn.paymentMethod.expYear}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Transaction Details */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-primary-400" />
                          Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Amount:</span>
                            <span className="text-gray-900">${txn.amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Fee:</span>
                            <span className="text-gray-900">-${txn.fee.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between border-t border-gray-200 pt-2">
                            <span className="text-gray-500">Net:</span>
                            <span className="text-gray-900 font-semibold">${txn.net.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Listing Info (if applicable) */}
                      {txn.listing && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary-400" />
                            Listing
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="text-gray-900 font-semibold">MC #{txn.listing.mcNumber}</div>
                            <div className="text-gray-500">{txn.listing.title}</div>
                            {txn.seller && (
                              <div className="text-gray-500">
                                Seller: {txn.seller.name}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-primary-400" />
                          Security Info
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">IP Address:</span>
                            <span className="text-gray-900 font-mono">{txn.metadata.ip}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Country:</span>
                            <span className="text-gray-900">{txn.metadata.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Risk Score:</span>
                            <span className={`capitalize ${
                              txn.metadata.riskScore === 'low' ? 'text-trust-high' :
                              txn.metadata.riskScore === 'medium' ? 'text-yellow-400' :
                              txn.metadata.riskScore === 'high' ? 'text-red-400' : 'text-gray-500'
                            }`}>
                              {txn.metadata.riskScore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center gap-6 text-xs text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Created: {new Date(txn.createdAt).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Updated: {new Date(txn.updatedAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button variant="secondary" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View in Stripe
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Receipt className="w-4 h-4 mr-1" />
                        Download Receipt
                      </Button>
                      {txn.refundable && txn.status === 'completed' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRefundAmount(String(txn.amount - txn.refundedAmount))
                            setShowRefundModal(true)
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Issue Refund
                        </Button>
                      )}
                      {txn.status === 'partially_refunded' && txn.refundable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-orange-400 hover:bg-orange-400/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRefundAmount(String(txn.amount - txn.refundedAmount))
                            setShowRefundModal(true)
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Refund Remaining (${(txn.amount - txn.refundedAmount).toLocaleString()})
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
      </div>

      {/* Refund Modal */}
      <AnimatePresence>
        {showRefundModal && selectedTxn && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowRefundModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            >
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Issue Refund</h3>
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Transaction</div>
                    <div className="font-semibold">{selectedTxn.description}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Original Amount: ${selectedTxn.amount.toLocaleString()}
                    </div>
                    {selectedTxn.refundedAmount > 0 && (
                      <div className="text-sm text-orange-400 mt-1">
                        Already Refunded: ${selectedTxn.refundedAmount.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Refund Amount ($)</label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      max={selectedTxn.amount - selectedTxn.refundedAmount}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500"
                    />
                    <div className="text-xs text-gray-400 mt-1">
                      Maximum: ${(selectedTxn.amount - selectedTxn.refundedAmount).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Reason for Refund</label>
                    <select
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-primary-500"
                    >
                      <option value="">Select a reason...</option>
                      <option value="requested_by_customer">Requested by customer</option>
                      <option value="duplicate">Duplicate payment</option>
                      <option value="fraudulent">Fraudulent transaction</option>
                      <option value="deal_cancelled">Deal cancelled</option>
                      <option value="listing_issue">Issue with listing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-400">
                        This action cannot be undone. The refund will be processed immediately through Stripe.
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="ghost"
                      fullWidth
                      onClick={() => setShowRefundModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      loading={processingRefund}
                      onClick={handleRefund}
                      disabled={!refundAmount || !refundReason || parseFloat(refundAmount) <= 0}
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Process Refund
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminTransactionsPage
