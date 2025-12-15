import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  Calendar,
  Truck,
  Hash,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Banknote,
  CircleDollarSign,
  Handshake,
  Target,
  UserCheck,
  ShieldCheck,
  ScrollText,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

// Transaction workflow steps
type TransactionStep =
  | 'confirm-intent'
  | 'terms-agreement'
  | 'deposit-payment'
  | 'awaiting-admin'
  | 'bill-of-sale'
  | 'final-payment'
  | 'completed'

interface ActiveTransaction {
  id: string
  mcNumber: string
  mcName: string
  askingPrice: number
  depositAmount: number
  platformFee: number
  buyer: {
    id: string
    name: string
    email: string
    phone: string
    verified: boolean
  }
  seller: {
    id: string
    name: string
    email: string
    phone: string
    verified: boolean
  }
  currentStep: TransactionStep
  status: 'active' | 'pending_admin' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  depositPaid: boolean
  depositPaidAt?: Date
  depositPaymentMethod?: 'card' | 'zelle'
  depositZellePending?: boolean
  finalPaymentPaid: boolean
  finalPaymentPaidAt?: Date
  finalPaymentMethod?: 'card' | 'zelle'
  finalPaymentZellePending?: boolean
  termsAccepted: boolean
  termsAcceptedAt?: Date
  billOfSaleGenerated: boolean
  billOfSaleApprovedByBuyer: boolean
  billOfSaleApprovedBySeller: boolean
  documentsVerified: boolean
  adminNotes: string[]
}

const AdminActiveClosingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stepFilter, setStepFilter] = useState<string>('all')
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<ActiveTransaction | null>(null)
  const [showRoundTable, setShowRoundTable] = useState(false)

  // Mock active transactions data
  const [transactions] = useState<ActiveTransaction[]>([
    {
      id: 'TXN-001',
      mcNumber: 'MC-784521',
      mcName: 'Swift Logistics LLC',
      askingPrice: 45000,
      depositAmount: 500,
      platformFee: 2250,
      buyer: {
        id: 'buyer-1',
        name: 'John Martinez',
        email: 'john.martinez@email.com',
        phone: '(555) 123-4567',
        verified: true
      },
      seller: {
        id: 'seller-1',
        name: 'Mike Johnson',
        email: 'mike.j@swiftlogistics.com',
        phone: '(555) 987-6543',
        verified: true
      },
      currentStep: 'awaiting-admin',
      status: 'pending_admin',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      depositPaid: true,
      depositPaidAt: new Date('2024-01-16'),
      depositPaymentMethod: 'zelle',
      depositZellePending: false,
      finalPaymentPaid: false,
      termsAccepted: true,
      termsAcceptedAt: new Date('2024-01-15'),
      billOfSaleGenerated: false,
      billOfSaleApprovedByBuyer: false,
      billOfSaleApprovedBySeller: false,
      documentsVerified: false,
      adminNotes: ['Deposit confirmed via Zelle', 'Awaiting document verification']
    },
    {
      id: 'TXN-002',
      mcNumber: 'MC-965432',
      mcName: 'Highway Express Inc',
      askingPrice: 62000,
      depositAmount: 500,
      platformFee: 3100,
      buyer: {
        id: 'buyer-2',
        name: 'Sarah Williams',
        email: 'sarah.w@email.com',
        phone: '(555) 234-5678',
        verified: true
      },
      seller: {
        id: 'seller-2',
        name: 'Robert Chen',
        email: 'robert@highwayexpress.com',
        phone: '(555) 876-5432',
        verified: true
      },
      currentStep: 'bill-of-sale',
      status: 'active',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date(),
      depositPaid: true,
      depositPaidAt: new Date('2024-01-11'),
      depositPaymentMethod: 'card',
      finalPaymentPaid: false,
      termsAccepted: true,
      termsAcceptedAt: new Date('2024-01-10'),
      billOfSaleGenerated: true,
      billOfSaleApprovedByBuyer: true,
      billOfSaleApprovedBySeller: false,
      documentsVerified: true,
      adminNotes: ['Documents verified', 'Bill of sale sent to parties', 'Awaiting seller signature']
    },
    {
      id: 'TXN-003',
      mcNumber: 'MC-123789',
      mcName: 'Prime Freight Solutions',
      askingPrice: 38500,
      depositAmount: 500,
      platformFee: 1925,
      buyer: {
        id: 'buyer-3',
        name: 'David Thompson',
        email: 'david.t@email.com',
        phone: '(555) 345-6789',
        verified: true
      },
      seller: {
        id: 'seller-3',
        name: 'Lisa Anderson',
        email: 'lisa@primefreight.com',
        phone: '(555) 765-4321',
        verified: true
      },
      currentStep: 'final-payment',
      status: 'active',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date(),
      depositPaid: true,
      depositPaidAt: new Date('2024-01-06'),
      depositPaymentMethod: 'card',
      finalPaymentPaid: false,
      finalPaymentZellePending: true,
      termsAccepted: true,
      termsAcceptedAt: new Date('2024-01-05'),
      billOfSaleGenerated: true,
      billOfSaleApprovedByBuyer: true,
      billOfSaleApprovedBySeller: true,
      documentsVerified: true,
      adminNotes: ['All documents verified', 'Bill of sale signed by both parties', 'Awaiting final payment - Zelle pending verification']
    },
    {
      id: 'TXN-004',
      mcNumber: 'MC-456123',
      mcName: 'Reliable Transport Co',
      askingPrice: 55000,
      depositAmount: 500,
      platformFee: 2750,
      buyer: {
        id: 'buyer-4',
        name: 'Emily Davis',
        email: 'emily.d@email.com',
        phone: '(555) 456-7890',
        verified: true
      },
      seller: {
        id: 'seller-4',
        name: 'James Wilson',
        email: 'james@reliabletransport.com',
        phone: '(555) 654-3210',
        verified: true
      },
      currentStep: 'deposit-payment',
      status: 'active',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date(),
      depositPaid: false,
      depositZellePending: true,
      finalPaymentPaid: false,
      termsAccepted: true,
      termsAcceptedAt: new Date('2024-01-18'),
      billOfSaleGenerated: false,
      billOfSaleApprovedByBuyer: false,
      billOfSaleApprovedBySeller: false,
      documentsVerified: false,
      adminNotes: ['Terms accepted', 'Deposit payment pending - Zelle claimed sent']
    }
  ])

  const steps = [
    { id: 'confirm-intent', label: 'Intent', short: '1' },
    { id: 'terms-agreement', label: 'Terms', short: '2' },
    { id: 'deposit-payment', label: 'Deposit', short: '3' },
    { id: 'awaiting-admin', label: 'Admin Review', short: '4' },
    { id: 'bill-of-sale', label: 'Bill of Sale', short: '5' },
    { id: 'final-payment', label: 'Final Payment', short: '6' },
    { id: 'completed', label: 'Complete', short: '7' }
  ]

  const getStepIndex = (step: TransactionStep) => {
    return steps.findIndex(s => s.id === step)
  }

  const getStepStatus = (currentStep: TransactionStep, stepId: string) => {
    const currentIndex = getStepIndex(currentStep)
    const stepIndex = steps.findIndex(s => s.id === stepId)

    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  const getStatusBadge = (status: string, step: TransactionStep) => {
    if (status === 'pending_admin') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Needs Action
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
    const matchesSearch = txn.mcNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.mcName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.seller.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
    const matchesStep = stepFilter === 'all' || txn.currentStep === stepFilter

    return matchesSearch && matchesStatus && matchesStep
  })

  const pendingAdminCount = transactions.filter(t => t.status === 'pending_admin').length
  const zelleVerificationCount = transactions.filter(t => t.depositZellePending || t.finalPaymentZellePending).length

  const openRoundTable = (txn: ActiveTransaction) => {
    setSelectedTransaction(txn)
    setShowRoundTable(true)
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
          {pendingAdminCount > 0 && (
            <div className="px-4 py-2 bg-amber-100 border border-amber-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-800">{pendingAdminCount} Pending Your Action</span>
            </div>
          )}
          {zelleVerificationCount > 0 && (
            <div className="px-4 py-2 bg-purple-100 border border-purple-200 rounded-xl flex items-center gap-2">
              <Banknote className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">{zelleVerificationCount} Zelle Pending</span>
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
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{pendingAdminCount}</p>
              <p className="text-sm text-gray-500">Needs Action</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Banknote className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{zelleVerificationCount}</p>
              <p className="text-sm text-gray-500">Zelle Pending</p>
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
                ${transactions.reduce((sum, t) => sum + (t.depositPaid ? t.depositAmount : 0), 0).toLocaleString()}
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
                ${transactions.reduce((sum, t) => sum + t.askingPrice, 0).toLocaleString()}
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
              <option value="pending_admin">Needs Action</option>
              <option value="active">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={stepFilter}
              onChange={(e) => setStepFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Steps</option>
              <option value="deposit-payment">Deposit Payment</option>
              <option value="awaiting-admin">Admin Review</option>
              <option value="bill-of-sale">Bill of Sale</option>
              <option value="final-payment">Final Payment</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((txn) => (
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
                    <Truck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{txn.mcNumber}</h3>
                      {getStatusBadge(txn.status, txn.currentStep)}
                      {(txn.depositZellePending || txn.finalPaymentZellePending) && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          Zelle Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{txn.mcName}</p>
                  </div>
                </div>

                {/* Parties Quick View */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Buyer</p>
                    <p className="text-sm font-medium text-gray-900">{txn.buyer.name}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Seller</p>
                    <p className="text-sm font-medium text-gray-900">{txn.seller.name}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">${txn.askingPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Fee: ${txn.platformFee.toLocaleString()}</p>
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
                    Round Table
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
                    const status = getStepStatus(txn.currentStep, step.id)
                    return (
                      <div key={step.id} className="flex-1 flex items-center">
                        <div
                          className={`flex-1 h-2 rounded-full ${
                            status === 'completed' ? 'bg-green-500' :
                            status === 'current' ? 'bg-indigo-500' :
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
                    const status = getStepStatus(txn.currentStep, step.id)
                    return (
                      <span
                        key={step.id}
                        className={`text-xs ${
                          status === 'current' ? 'text-indigo-600 font-medium' :
                          status === 'completed' ? 'text-green-600' :
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
                          <p className="font-medium text-gray-900">{txn.buyer.name}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {txn.buyer.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {txn.buyer.phone}
                          </p>
                          {txn.buyer.verified && (
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
                          <p className="font-medium text-gray-900">{txn.seller.name}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> {txn.seller.email}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {txn.seller.phone}
                          </p>
                          {txn.seller.verified && (
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
                            <span className="text-gray-600">Terms Accepted</span>
                            {txn.termsAccepted ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Deposit Paid</span>
                            {txn.depositPaid ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : txn.depositZellePending ? (
                              <Clock className="w-4 h-4 text-amber-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Documents Verified</span>
                            {txn.documentsVerified ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Bill of Sale</span>
                            {txn.billOfSaleApprovedByBuyer && txn.billOfSaleApprovedBySeller ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : txn.billOfSaleGenerated ? (
                              <Clock className="w-4 h-4 text-amber-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Final Payment</span>
                            {txn.finalPaymentPaid ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : txn.finalPaymentZellePending ? (
                              <Clock className="w-4 h-4 text-amber-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-gray-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    {txn.adminNotes.length > 0 && (
                      <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Admin Notes</h4>
                        <ul className="space-y-1">
                          {txn.adminNotes.map((note, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {txn.depositZellePending && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4 mr-1" />
                          Verify Deposit Zelle
                        </Button>
                      )}
                      {txn.finalPaymentZellePending && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Check className="w-4 h-4 mr-1" />
                          Verify Final Payment Zelle
                        </Button>
                      )}
                      {txn.currentStep === 'awaiting-admin' && !txn.documentsVerified && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <ShieldCheck className="w-4 h-4 mr-1" />
                          Verify Documents
                        </Button>
                      )}
                      {txn.documentsVerified && !txn.billOfSaleGenerated && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <ScrollText className="w-4 h-4 mr-1" />
                          Generate Bill of Sale
                        </Button>
                      )}
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
        ))}

        {filteredTransactions.length === 0 && (
          <Card className="p-12 text-center">
            <Handshake className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </Card>
        )}
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
                      Round Table - {selectedTransaction.mcNumber}
                    </h2>
                    <p className="text-indigo-200 mt-1">{selectedTransaction.mcName}</p>
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
                          <p className="font-semibold text-gray-900">{selectedTransaction.buyer.name}</p>
                        </div>
                        {selectedTransaction.buyer.verified && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" /> {selectedTransaction.buyer.email}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" /> {selectedTransaction.buyer.phone}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-xs text-blue-600 mb-2">Buyer Status</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.termsAccepted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Terms {selectedTransaction.termsAccepted ? '✓' : '○'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.depositPaid ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Deposit {selectedTransaction.depositPaid ? '✓' : '○'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.billOfSaleApprovedByBuyer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            BoS {selectedTransaction.billOfSaleApprovedByBuyer ? '✓' : '○'}
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
                        <p className="text-xs text-amber-600 mb-2">Admin Actions</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.documentsVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            Docs {selectedTransaction.documentsVerified ? '✓' : '○'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.billOfSaleGenerated ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            BoS Gen {selectedTransaction.billOfSaleGenerated ? '✓' : '○'}
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
                          <p className="font-semibold text-gray-900">{selectedTransaction.seller.name}</p>
                        </div>
                        {selectedTransaction.seller.verified && (
                          <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" /> {selectedTransaction.seller.email}
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" /> {selectedTransaction.seller.phone}
                        </p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <p className="text-xs text-green-600 mb-2">Seller Status</p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${selectedTransaction.billOfSaleApprovedBySeller ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            BoS {selectedTransaction.billOfSaleApprovedBySeller ? '✓' : '○'}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Sale Price</p>
                      <p className="text-2xl font-bold text-gray-900">${selectedTransaction.askingPrice.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Deposit</p>
                      <p className="text-2xl font-bold text-green-600">${selectedTransaction.depositAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{selectedTransaction.depositPaid ? 'Paid' : 'Pending'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Platform Fee (5%)</p>
                      <p className="text-2xl font-bold text-indigo-600">${selectedTransaction.platformFee.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-500">Remaining Balance</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(selectedTransaction.askingPrice - selectedTransaction.depositAmount).toLocaleString()}
                      </p>
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
                      const status = getStepStatus(selectedTransaction.currentStep, step.id)
                      return (
                        <div key={step.id} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              status === 'completed' ? 'bg-green-500 text-white' :
                              status === 'current' ? 'bg-indigo-600 text-white' :
                              'bg-gray-200 text-gray-500'
                            }`}
                          >
                            {status === 'completed' ? <Check className="w-5 h-5" /> : index + 1}
                          </div>
                          <p className={`text-xs mt-2 text-center ${
                            status === 'current' ? 'text-indigo-600 font-medium' :
                            status === 'completed' ? 'text-green-600' :
                            'text-gray-400'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    Admin Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedTransaction.depositZellePending && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-2" />
                        Confirm Deposit Zelle Payment
                      </Button>
                    )}
                    {selectedTransaction.finalPaymentZellePending && (
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4 mr-2" />
                        Confirm Final Zelle Payment
                      </Button>
                    )}
                    {!selectedTransaction.documentsVerified && (
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Verify All Documents
                      </Button>
                    )}
                    {selectedTransaction.documentsVerified && !selectedTransaction.billOfSaleGenerated && (
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <ScrollText className="w-4 h-4 mr-2" />
                        Generate Bill of Sale
                      </Button>
                    )}
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message All Parties
                    </Button>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Link to={`/transaction/${selectedTransaction.id}`}>
                      <Button variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Full Transaction Room
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminActiveClosingsPage
