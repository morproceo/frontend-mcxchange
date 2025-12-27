import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Building2,
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  AlertCircle,
  User,
  Crown,
  Eye,
  ArrowRight,
  Check,
  XCircle,
  Loader2,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Banknote,
  CircleDollarSign,
  Handshake,
  Target,
  ShieldCheck,
  ScrollText,
  RefreshCw,
  Plus,
  X,
  Truck
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import api from '../services/api'
import toast from 'react-hot-toast'

// Types for create transaction modal
interface AvailableBuyer {
  id: string
  name: string
  email: string
  verified: boolean
  trustScore: number
}

interface AvailableListing {
  id: string
  mcNumber: string
  dotNumber: string
  legalName: string
  title: string
  askingPrice: number | null
  listingPrice: number | null
  sellerId: string
  seller: {
    id: string
    name: string
    email: string
  }
}

// Transaction status mapping from backend to frontend workflow steps
type TransactionStep =
  | 'terms-agreement'
  | 'awaiting-deposit'
  | 'deposit-received'
  | 'in-review'
  | 'approved'
  | 'awaiting-final'
  | 'payment-received'
  | 'completed'
  | 'cancelled'
  | 'disputed'

interface TransactionData {
  id: string
  status: string
  agreedPrice: number
  depositAmount: number | null
  platformFee: number
  finalPaymentAmount: number | null
  buyerApproved: boolean
  buyerApprovedAt: string | null
  sellerApproved: boolean
  sellerApprovedAt: string | null
  adminApproved: boolean
  adminApprovedAt: string | null
  buyerAcceptedTerms: boolean
  buyerAcceptedTermsAt: string | null
  sellerAcceptedTerms: boolean
  sellerAcceptedTermsAt: string | null
  depositPaidAt: string | null
  depositPaymentMethod: string | null
  depositPaymentRef: string | null
  finalPaidAt: string | null
  finalPaymentMethod: string | null
  finalPaymentRef: string | null
  escrowStatus: string | null
  escrowReleaseAt: string | null
  disputeReason: string | null
  disputeOpenedAt: string | null
  disputeResolvedAt: string | null
  disputeResolution: string | null
  buyerNotes: string | null
  sellerNotes: string | null
  adminNotes: string | null
  completedAt: string | null
  cancelledAt: string | null
  createdAt: string
  updatedAt: string
  listing: {
    id: string
    mcNumber: string
    dotNumber: string
    legalName: string
    dbaName: string | null
    title: string
    price: number
    city: string
    state: string
  }
  buyer: {
    id: string
    name: string
    email: string
    phone: string | null
    verified: boolean
    companyName: string | null
  }
  seller: {
    id: string
    name: string
    email: string
    phone: string | null
    verified: boolean
    companyName: string | null
  }
  payments?: {
    id: string
    type: string
    amount: number
    status: string
    method: string
    verifiedAt: string | null
    createdAt: string
  }[]
}

const AdminActiveClosingsPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null)
  const [showRoundTable, setShowRoundTable] = useState(false)
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState<string | null>(null)

  // Create Transaction Modal State
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [buyerSearch, setBuyerSearch] = useState('')
  const [listingSearch, setListingSearch] = useState('')
  const [availableBuyers, setAvailableBuyers] = useState<AvailableBuyer[]>([])
  const [availableListings, setAvailableListings] = useState<AvailableListing[]>([])
  const [selectedBuyer, setSelectedBuyer] = useState<AvailableBuyer | null>(null)
  const [selectedListing, setSelectedListing] = useState<AvailableListing | null>(null)
  const [agreedPrice, setAgreedPrice] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [createNotes, setCreateNotes] = useState('')
  const [buyersLoading, setBuyersLoading] = useState(false)
  const [listingsLoading, setListingsLoading] = useState(false)

  const steps = [
    { id: 'terms-agreement', label: 'Terms', short: '1' },
    { id: 'awaiting-deposit', label: 'Deposit', short: '2' },
    { id: 'deposit-received', label: 'Received', short: '3' },
    { id: 'in-review', label: 'Review', short: '4' },
    { id: 'approved', label: 'Approved', short: '5' },
    { id: 'awaiting-final', label: 'Final', short: '6' },
    { id: 'payment-received', label: 'Verify', short: '7' },
    { id: 'completed', label: 'Complete', short: '8' }
  ]

  // Map backend status to frontend step
  const mapStatusToStep = (status: string): TransactionStep => {
    const statusMap: Record<string, TransactionStep> = {
      'TERMS_PENDING': 'terms-agreement',
      'AWAITING_DEPOSIT': 'awaiting-deposit',
      'DEPOSIT_RECEIVED': 'deposit-received',
      'IN_REVIEW': 'in-review',
      'APPROVED': 'approved',
      'AWAITING_FINAL_PAYMENT': 'awaiting-final',
      'PAYMENT_RECEIVED': 'payment-received',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'DISPUTED': 'disputed'
    }
    return statusMap[status] || 'terms-agreement'
  }

  // Verify final payment
  const handleVerifyFinalPayment = async (transactionId: string, paymentId: string) => {
    setVerifyingPayment(transactionId)
    try {
      await api.adminVerifyFinalPayment(transactionId, paymentId)
      toast.success('Final payment verified! Transaction completed.')
      fetchTransactions(false)
      setShowRoundTable(false)
    } catch (err: any) {
      console.error('Error verifying payment:', err)
      toast.error(err.message || 'Failed to verify payment')
    } finally {
      setVerifyingPayment(null)
    }
  }

  const fetchTransactions = async (showToast = false) => {
    try {
      if (showToast) setRefreshing(true)
      else setLoading(true)

      const response = await api.getAdminTransactions({ limit: 100 })
      if (response.success && response.data) {
        setTransactions(response.data)
      }
      if (showToast) toast.success('Transactions refreshed')
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Fetch available buyers for create transaction modal
  const fetchBuyers = async (search?: string) => {
    setBuyersLoading(true)
    try {
      const response = await api.getAvailableBuyers(search)
      if (response.success && response.data) {
        setAvailableBuyers(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch buyers:', error)
    } finally {
      setBuyersLoading(false)
    }
  }

  // Fetch available listings for create transaction modal
  const fetchListings = async (search?: string) => {
    setListingsLoading(true)
    try {
      const response = await api.getAvailableListings(search)
      if (response.success && response.data) {
        setAvailableListings(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setListingsLoading(false)
    }
  }

  // Load initial data when modal opens
  useEffect(() => {
    if (showCreateModal) {
      fetchBuyers()
      fetchListings()
    }
  }, [showCreateModal])

  // Search buyers with debounce
  useEffect(() => {
    if (showCreateModal) {
      const timer = setTimeout(() => {
        fetchBuyers(buyerSearch || undefined)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [buyerSearch, showCreateModal])

  // Search listings with debounce
  useEffect(() => {
    if (showCreateModal) {
      const timer = setTimeout(() => {
        fetchListings(listingSearch || undefined)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [listingSearch, showCreateModal])

  // Pre-fill price when listing is selected
  useEffect(() => {
    if (selectedListing && !agreedPrice) {
      const price = selectedListing.listingPrice || selectedListing.askingPrice
      if (price) {
        setAgreedPrice(price.toString())
      }
    }
  }, [selectedListing])

  // Reset create modal state
  const resetCreateModal = () => {
    setSelectedBuyer(null)
    setSelectedListing(null)
    setAgreedPrice('')
    setDepositAmount('')
    setCreateNotes('')
    setBuyerSearch('')
    setListingSearch('')
  }

  // Create transaction
  const handleCreateTransaction = async () => {
    if (!selectedBuyer || !selectedListing || !agreedPrice) {
      toast.error('Please select a buyer, listing, and enter the agreed price')
      return
    }

    const priceNum = parseFloat(agreedPrice)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid agreed price')
      return
    }

    setCreateLoading(true)
    try {
      const response = await api.adminCreateTransaction({
        listingId: selectedListing.id,
        buyerId: selectedBuyer.id,
        agreedPrice: priceNum,
        depositAmount: depositAmount ? parseFloat(depositAmount) : undefined,
        notes: createNotes || undefined,
      })

      if (response.success && response.data) {
        toast.success('Transaction created successfully!')
        setShowCreateModal(false)
        resetCreateModal()
        fetchTransactions()
        // Navigate to the transaction room
        navigate(`/transaction/${response.data.id}`)
      }
    } catch (error: any) {
      console.error('Failed to create transaction:', error)
      toast.error(error.message || 'Failed to create transaction')
    } finally {
      setCreateLoading(false)
    }
  }

  const getStepIndex = (step: TransactionStep) => {
    return steps.findIndex(s => s.id === step)
  }

  const getStepStatus = (currentStep: TransactionStep, stepId: string) => {
    const currentIndex = getStepIndex(currentStep)
    const stepIndex = steps.findIndex(s => s.id === stepId)

    if (currentStep === 'cancelled' || currentStep === 'disputed') {
      return stepIndex <= currentIndex ? 'error' : 'pending'
    }
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  const getStatusBadge = (status: string) => {
    const step = mapStatusToStep(status)

    if (status === 'CANCELLED') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Cancelled
        </span>
      )
    }
    if (status === 'DISPUTED') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Disputed
        </span>
      )
    }
    if (status === 'DEPOSIT_RECEIVED' || status === 'IN_REVIEW') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Needs Review
        </span>
      )
    }
    if (status === 'PAYMENT_RECEIVED') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex items-center gap-1">
          <CircleDollarSign className="w-3 h-3" />
          Verify Payment
        </span>
      )
    }
    if (step === 'completed') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Completed
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        In Progress
      </span>
    )
  }

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch =
      txn.listing?.mcNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.listing?.legalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.seller?.name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const activeCount = transactions.filter(t =>
    !['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(t.status)
  ).length

  const needsReviewCount = transactions.filter(t =>
    ['DEPOSIT_RECEIVED', 'IN_REVIEW', 'PAYMENT_RECEIVED'].includes(t.status)
  ).length

  const depositsPaidCount = transactions.filter(t =>
    t.depositPaidAt !== null
  ).length

  const totalDeposits = transactions
    .filter(t => t.depositPaidAt !== null)
    .reduce((sum, t) => sum + (t.depositAmount || 1000), 0)

  const totalPipeline = transactions
    .filter(t => !['COMPLETED', 'CANCELLED'].includes(t.status))
    .reduce((sum, t) => sum + t.agreedPrice, 0)

  const openRoundTable = (txn: TransactionData) => {
    setSelectedTransaction(txn)
    setShowRoundTable(true)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Active Closings</h1>
          <p className="text-gray-600 mt-1">Manage and oversee all active MC authority transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchTransactions(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Transaction
          </Button>
          {needsReviewCount > 0 && (
            <div className="px-4 py-2 bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">{needsReviewCount} Needs Review</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Handshake className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
              <p className="text-sm text-gray-500">Active Transactions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{needsReviewCount}</p>
              <p className="text-sm text-gray-500">Needs Review</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Banknote className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{depositsPaidCount}</p>
              <p className="text-sm text-gray-500">Deposits Paid</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalDeposits.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Deposits Collected</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100">
              <CircleDollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${totalPipeline.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Pipeline</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by MC number, company name, buyer, or seller..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="TERMS_PENDING">Terms Pending</option>
              <option value="AWAITING_DEPOSIT">Awaiting Deposit</option>
              <option value="DEPOSIT_RECEIVED">Deposit Received</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="AWAITING_FINAL_PAYMENT">Awaiting Final</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="DISPUTED">Disputed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 && (
          <Card className="p-12 text-center">
            <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-500">
              {transactions.length === 0
                ? 'No transactions have been created yet'
                : 'Try adjusting your search or filters'}
            </p>
          </Card>
        )}

        {filteredTransactions.map((txn) => {
          const currentStep = mapStatusToStep(txn.status)
          return (
            <Card key={txn.id} className="overflow-hidden">
              {/* Transaction Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedTransaction(expandedTransaction === txn.id ? null : txn.id)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* MC Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          MC-{txn.listing?.mcNumber}
                        </h3>
                        {getStatusBadge(txn.status)}
                      </div>
                      <p className="text-sm text-gray-600">{txn.listing?.legalName}</p>
                    </div>
                  </div>

                  {/* Parties Quick View */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Buyer</p>
                      <p className="text-sm font-medium text-gray-900">{txn.buyer?.name}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Seller</p>
                      <p className="text-sm font-medium text-gray-900">{txn.seller?.name}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${txn.agreedPrice.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Asking: ${(txn.listing?.price || txn.agreedPrice).toLocaleString()} | Margin: ${(txn.agreedPrice - (txn.listing?.price || txn.agreedPrice)).toLocaleString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        openRoundTable(txn)
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    <Link to={`/transaction/${txn.id}`} onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    {expandedTransaction === txn.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center gap-1">
                    {steps.map((step, index) => {
                      const status = getStepStatus(currentStep, step.id)
                      return (
                        <div key={step.id} className="flex-1 flex items-center">
                          <div
                            className={`flex-1 h-2 rounded-full ${
                              status === 'completed' ? 'bg-green-500' :
                              status === 'current' ? 'bg-indigo-500' :
                              status === 'error' ? 'bg-red-500' :
                              'bg-gray-200'
                            }`}
                          />
                          {index < steps.length - 1 && <div className="w-1" />}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {steps.map((step) => {
                      const status = getStepStatus(currentStep, step.id)
                      return (
                        <span
                          key={step.id}
                          className={`text-xs ${
                            status === 'current' ? 'text-indigo-600 font-medium' :
                            status === 'completed' ? 'text-green-600' :
                            status === 'error' ? 'text-red-600' :
                            'text-gray-400'
                          }`}
                        >
                          {step.short}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {expandedTransaction === txn.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-4 bg-gray-50">
                      <div className="grid lg:grid-cols-3 gap-6">
                        {/* Buyer Info */}
                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Buyer
                          </h4>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{txn.buyer?.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="w-4 h-4" /> {txn.buyer?.email}
                            </p>
                            {txn.buyer?.phone && (
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> {txn.buyer?.phone}
                              </p>
                            )}
                            {txn.buyer?.companyName && (
                              <p className="text-sm text-gray-600">{txn.buyer.companyName}</p>
                            )}
                            {txn.buyer?.verified && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Seller Info */}
                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-green-600" />
                            Seller
                          </h4>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">{txn.seller?.name}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="w-4 h-4" /> {txn.seller?.email}
                            </p>
                            {txn.seller?.phone && (
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Phone className="w-4 h-4" /> {txn.seller?.phone}
                              </p>
                            )}
                            {txn.seller?.companyName && (
                              <p className="text-sm text-gray-600">{txn.seller.companyName}</p>
                            )}
                            {txn.seller?.verified && (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Transaction Status */}
                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-purple-600" />
                            Status Checklist
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Buyer Terms</span>
                              {txn.buyerAcceptedTerms ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Seller Terms</span>
                              {txn.sellerAcceptedTerms ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Deposit Paid</span>
                              {txn.depositPaidAt ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Admin Approved</span>
                              {txn.adminApproved ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Buyer Approved</span>
                              {txn.buyerApproved ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Seller Approved</span>
                              {txn.sellerApproved ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Final Payment</span>
                              {txn.finalPaidAt ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-gray-300" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Admin Notes */}
                      {txn.adminNotes && (
                        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                          <p className="text-sm text-gray-600">{txn.adminNotes}</p>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link to={`/transaction/${txn.id}`}>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Open Transaction Room
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message Parties
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          )
        })}
      </div>

      {/* Round Table Modal */}
      <AnimatePresence>
        {showRoundTable && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRoundTable(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Crown className="w-7 h-7 text-amber-400" />
                      Transaction Details - MC-{selectedTransaction.listing?.mcNumber}
                    </h2>
                    <p className="text-indigo-200 mt-1">{selectedTransaction.listing?.legalName}</p>
                  </div>
                  <button
                    onClick={() => setShowRoundTable(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Parties - Round Table View */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Transaction Parties
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Buyer Card */}
                    <div className="p-5 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-blue-600 font-medium uppercase">Buyer</p>
                          <p className="font-semibold text-gray-900">{selectedTransaction.buyer?.name}</p>
                        </div>
                        {selectedTransaction.buyer?.verified && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" /> {selectedTransaction.buyer?.email}
                        </p>
                        {selectedTransaction.buyer?.phone && (
                          <p className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" /> {selectedTransaction.buyer?.phone}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-xs text-blue-600 mb-2">Buyer Status</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.buyerAcceptedTerms ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Terms {selectedTransaction.buyerAcceptedTerms ? '✓' : '○'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.depositPaidAt ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Deposit {selectedTransaction.depositPaidAt ? '✓' : '○'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.buyerApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Approved {selectedTransaction.buyerApproved ? '✓' : '○'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Domilea/Admin Card */}
                    <div className="p-5 rounded-xl bg-amber-50 border border-amber-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                          <Crown className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-amber-600 font-medium uppercase">Facilitator</p>
                          <p className="font-semibold text-gray-900">Domilea</p>
                        </div>
                        <Shield className="w-5 h-5 text-amber-500 ml-auto" />
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Transaction Coordinator</p>
                        <p>Escrow & Compliance</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <p className="text-xs text-amber-600 mb-2">Admin Status</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.adminApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Approved {selectedTransaction.adminApproved ? '✓' : '○'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Seller Card */}
                    <div className="p-5 rounded-xl bg-green-50 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-green-600 font-medium uppercase">Seller</p>
                          <p className="font-semibold text-gray-900">{selectedTransaction.seller?.name}</p>
                        </div>
                        {selectedTransaction.seller?.verified && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" /> {selectedTransaction.seller?.email}
                        </p>
                        {selectedTransaction.seller?.phone && (
                          <p className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" /> {selectedTransaction.seller?.phone}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-xs text-green-600 mb-2">Seller Status</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.sellerAcceptedTerms ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Terms {selectedTransaction.sellerAcceptedTerms ? '✓' : '○'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.sellerApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Approved {selectedTransaction.sellerApproved ? '✓' : '○'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    Financial Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Seller's Asking Price</p>
                      <p className="text-2xl font-bold text-gray-700">${(selectedTransaction.listing?.price || selectedTransaction.agreedPrice).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">What seller receives</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-xl text-center border border-green-200">
                      <p className="text-sm text-green-600">Listing Price (Buyer Pays)</p>
                      <p className="text-2xl font-bold text-green-700">${selectedTransaction.agreedPrice.toLocaleString()}</p>
                      <p className="text-xs text-green-500">Total transaction value</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl text-center border border-amber-200">
                      <p className="text-sm text-amber-600">Broker Margin</p>
                      <p className="text-2xl font-bold text-amber-700">${(selectedTransaction.agreedPrice - (selectedTransaction.listing?.price || selectedTransaction.agreedPrice)).toLocaleString()}</p>
                      <p className="text-xs text-amber-500">MC Exchange earnings</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Deposit</p>
                      <p className="text-2xl font-bold text-green-600">${(selectedTransaction.depositAmount || 1000).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{selectedTransaction.depositPaidAt ? 'Paid' : 'Pending'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Remaining Balance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(selectedTransaction.agreedPrice - (selectedTransaction.depositAmount || 1000)).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">Due from buyer</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-xl text-center border border-indigo-200">
                      <p className="text-sm text-indigo-600">Platform Fee (5%)</p>
                      <p className="text-2xl font-bold text-indigo-600">${selectedTransaction.platformFee.toLocaleString()}</p>
                      <p className="text-xs text-indigo-400">Processing fee</p>
                    </div>
                  </div>
                </div>

                {/* Workflow Progress */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Transaction Progress
                  </h3>
                  <div className="flex items-center gap-2">
                    {steps.map((step, index) => {
                      const status = getStepStatus(mapStatusToStep(selectedTransaction.status), step.id)
                      return (
                        <div key={step.id} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              status === 'completed' ? 'bg-green-500 text-white' :
                              status === 'current' ? 'bg-indigo-600 text-white' :
                              status === 'error' ? 'bg-red-500 text-white' :
                              'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {status === 'completed' ? <Check className="w-5 h-5" /> : index + 1}
                          </div>
                          <p className={`text-xs mt-2 text-center ${
                            status === 'current' ? 'text-indigo-600 font-medium' :
                            status === 'completed' ? 'text-green-600' :
                            status === 'error' ? 'text-red-600' :
                            'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Final Payment Verification (when status is PAYMENT_RECEIVED) */}
                {selectedTransaction.status === 'PAYMENT_RECEIVED' && (
                  <div className="mb-8 p-5 bg-purple-50 rounded-xl border-2 border-purple-300">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CircleDollarSign className="w-5 h-5 text-purple-600" />
                      Final Payment Verification Required
                    </h3>

                    <div className="bg-white rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Amount</p>
                          <p className="text-xl font-bold text-gray-900">
                            ${(selectedTransaction.agreedPrice - (selectedTransaction.depositAmount || 1000)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment Method</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {selectedTransaction.finalPaymentMethod || 'Pending'}
                          </p>
                        </div>
                        {selectedTransaction.finalPaymentRef && (
                          <div className="col-span-2">
                            <p className="text-sm text-gray-500">Reference Number</p>
                            <p className="text-lg font-mono text-gray-900">
                              {selectedTransaction.finalPaymentRef}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payments List */}
                    {selectedTransaction.payments && selectedTransaction.payments.length > 0 && (
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-900 mb-3">Submitted Payments</h4>
                        <div className="space-y-3">
                          {selectedTransaction.payments
                            .filter(p => p.type === 'FINAL_PAYMENT')
                            .map(payment => (
                              <div
                                key={payment.id}
                                className={`p-3 border rounded-lg ${
                                  payment.status === 'PENDING'
                                    ? 'border-amber-300 bg-amber-50'
                                    : payment.status === 'COMPLETED'
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      ${payment.amount.toLocaleString()} via {payment.method}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Submitted: {new Date(payment.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {payment.status === 'PENDING' ? (
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        loading={verifyingPayment === selectedTransaction.id}
                                        onClick={() => handleVerifyFinalPayment(selectedTransaction.id, payment.id)}
                                      >
                                        <Check className="w-4 h-4 mr-1" />
                                        Verify & Complete
                                      </Button>
                                    ) : payment.verifiedAt ? (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified {new Date(payment.verifiedAt).toLocaleDateString()}
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                        {payment.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        <strong>Important:</strong> Verify that the payment has been received in your account before clicking "Verify & Complete".
                        This action will complete the transaction and release all documents to the buyer.
                      </p>
                    </div>
                  </div>
                )}

                {/* Admin Actions */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    Admin Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/transaction/${selectedTransaction.id}`}>
                      <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Full Transaction Room
                      </Button>
                    </Link>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message All Parties
                    </Button>
                    <Button variant="outline" onClick={() => fetchTransactions(true)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Transaction Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateModal(false)
              resetCreateModal()
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create Transaction</h2>
                  <p className="text-sm text-gray-600 mt-1">Manually create a transaction between a buyer and seller</p>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetCreateModal()
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Step 1: Select Listing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Truck className="w-4 h-4 inline mr-2" />
                    Select MC Listing
                  </label>
                  {selectedListing ? (
                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-indigo-900">MC-{selectedListing.mcNumber}</div>
                        <div className="text-sm text-gray-600">{selectedListing.legalName}</div>
                        <div className="text-xs text-gray-500">Seller: {selectedListing.seller.name}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedListing(null)}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Input
                        placeholder="Search by MC#, name..."
                        value={listingSearch}
                        onChange={(e) => setListingSearch(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                      />
                      <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
                        {listingsLoading ? (
                          <div className="p-4 text-center text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                          </div>
                        ) : availableListings.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No listings found</div>
                        ) : (
                          availableListings.map((listing) => (
                            <div
                              key={listing.id}
                              onClick={() => setSelectedListing(listing)}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">MC-{listing.mcNumber}</div>
                                  <div className="text-sm text-gray-600">{listing.legalName}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium text-green-600">
                                    ${(listing.listingPrice || listing.askingPrice || 0).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-gray-500">{listing.seller.name}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 2: Select Buyer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Select Buyer
                  </label>
                  {selectedBuyer ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-green-900">{selectedBuyer.name}</div>
                        <div className="text-sm text-gray-600">{selectedBuyer.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {selectedBuyer.verified && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Verified</span>
                          )}
                          <span className="text-xs text-gray-500">Trust Score: {selectedBuyer.trustScore}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBuyer(null)}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Input
                        placeholder="Search by name or email..."
                        value={buyerSearch}
                        onChange={(e) => setBuyerSearch(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                      />
                      <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl">
                        {buyersLoading ? (
                          <div className="p-4 text-center text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                          </div>
                        ) : availableBuyers.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">No buyers found</div>
                        ) : (
                          availableBuyers.map((buyer) => (
                            <div
                              key={buyer.id}
                              onClick={() => setSelectedBuyer(buyer)}
                              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{buyer.name}</div>
                                  <div className="text-sm text-gray-600">{buyer.email}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {buyer.verified && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Transaction Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-2" />
                      Agreed Price *
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter agreed price"
                      value={agreedPrice}
                      onChange={(e) => setAgreedPrice(e.target.value)}
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Banknote className="w-4 h-4 inline mr-2" />
                      Deposit Amount (optional)
                    </label>
                    <Input
                      type="number"
                      placeholder="Auto-calculated if empty"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      icon={<DollarSign className="w-4 h-4" />}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Admin Notes (optional)
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Add any notes about this transaction..."
                    value={createNotes}
                    onChange={(e) => setCreateNotes(e.target.value)}
                  />
                </div>

                {/* Summary */}
                {selectedListing && selectedBuyer && agreedPrice && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Transaction Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Listing:</span>
                        <span className="ml-2 font-medium">MC-{selectedListing.mcNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Seller:</span>
                        <span className="ml-2 font-medium">{selectedListing.seller.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Buyer:</span>
                        <span className="ml-2 font-medium">{selectedBuyer.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Agreed Price:</span>
                        <span className="ml-2 font-medium text-green-600">${parseFloat(agreedPrice).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false)
                    resetCreateModal()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTransaction}
                  loading={createLoading}
                  disabled={!selectedBuyer || !selectedListing || !agreedPrice}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Transaction
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminActiveClosingsPage
