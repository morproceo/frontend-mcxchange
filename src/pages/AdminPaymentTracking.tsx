import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  Search
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'

const AdminPaymentTracking = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'received' | 'pending' | 'failed'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const payments = [
    {
      id: 'PAY-001',
      invoiceId: 'INV-001',
      userName: 'John Transport LLC',
      userEmail: 'john@transport.com',
      mcNumber: '123456',
      amount: 45000,
      status: 'received',
      paymentMethod: 'Wire Transfer',
      submittedDate: '2024-01-12T10:30:00',
      confirmedDate: '2024-01-12T14:45:00',
      transactionRef: 'WIRE-20240112-001',
      trustScore: 78
    },
    {
      id: 'PAY-002',
      invoiceId: 'INV-002',
      userName: 'Express Freight Corp',
      userEmail: 'billing@express.com',
      mcNumber: '789012',
      amount: 32000,
      status: 'pending',
      paymentMethod: 'Wire Transfer',
      submittedDate: '2024-01-11T16:20:00',
      confirmedDate: null,
      transactionRef: 'WIRE-20240111-002',
      trustScore: 92
    },
    {
      id: 'PAY-003',
      invoiceId: 'INV-003',
      userName: 'Regional Routes LLC',
      userEmail: 'finance@regional.com',
      mcNumber: '901234',
      amount: 38000,
      status: 'pending',
      paymentMethod: 'Wire Transfer',
      submittedDate: '2024-01-13T09:15:00',
      confirmedDate: null,
      transactionRef: 'WIRE-20240113-001',
      trustScore: 85
    },
    {
      id: 'PAY-004',
      invoiceId: 'INV-004',
      userName: 'Budget Transport',
      userEmail: 'payments@budget.com',
      mcNumber: '456789',
      amount: 28000,
      status: 'failed',
      paymentMethod: 'Wire Transfer',
      submittedDate: '2024-01-10T11:00:00',
      confirmedDate: null,
      transactionRef: 'WIRE-20240110-003',
      trustScore: 62,
      failReason: 'Insufficient funds'
    },
    {
      id: 'PAY-005',
      invoiceId: 'INV-005',
      userName: 'National Carriers LLC',
      userEmail: 'accounting@national.com',
      mcNumber: '234567',
      amount: 52000,
      status: 'received',
      paymentMethod: 'Wire Transfer',
      submittedDate: '2024-01-08T13:30:00',
      confirmedDate: '2024-01-08T16:20:00',
      transactionRef: 'WIRE-20240108-002',
      trustScore: 88
    }
  ]

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = activeFilter === 'all' || payment.status === activeFilter
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.mcNumber.includes(searchTerm) ||
                         payment.transactionRef.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Received',
      value: `$${(payments.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(0)}K`,
      change: 'This month',
      color: 'text-trust-high'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: payments.filter(p => p.status === 'pending').length,
      change: 'Awaiting confirmation',
      color: 'text-yellow-400'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: payments.filter(p => p.status === 'received').length,
      change: 'Successfully processed',
      color: 'text-trust-high'
    },
    {
      icon: XCircle,
      label: 'Failed',
      value: payments.filter(p => p.status === 'failed').length,
      change: 'Requires attention',
      color: 'text-red-400'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'text-trust-high'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleConfirmPayment = (paymentId: string) => {
    alert(`Payment ${paymentId} confirmed and marked as received.`)
  }

  const handleMarkAsFailed = (paymentId: string) => {
    alert(`Payment ${paymentId} marked as failed.`)
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Payment Tracking</h2>
            <p className="text-white/60">Monitor wire transfers and payment confirmations</p>
          </div>
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg glass-subtle ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm mb-1">{stat.label}</div>
                <div className="text-xs text-white/40">{stat.change}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search by user, MC number, or transaction ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'received', 'pending', 'failed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                  activeFilter === filter
                    ? 'bg-primary-500 text-white'
                    : 'glass-subtle text-white/80 hover:bg-white/15'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.map((payment) => (
            <GlassCard key={payment.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{payment.id}</h3>
                    <span className={`glass-subtle px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">{payment.status}</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-white/90 font-semibold">{payment.userName}</span>
                      <TrustBadge
                        score={payment.trustScore}
                        level={getTrustLevel(payment.trustScore)}
                        verified={true}
                        size="sm"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <div className="flex gap-2">
                        <span className="text-white/60">Invoice:</span>
                        <span className="text-white/90">{payment.invoiceId}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/60">MC Number:</span>
                        <span className="text-white/90">#{payment.mcNumber}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/60">Method:</span>
                        <span className="text-white/90">{payment.paymentMethod}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/60">Transaction Ref:</span>
                        <span className="text-white/90 font-mono text-xs">{payment.transactionRef}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/60">Submitted:</span>
                        <span className="text-white/90">
                          {new Date(payment.submittedDate).toLocaleString()}
                        </span>
                      </div>
                      {payment.confirmedDate && (
                        <div className="flex gap-2">
                          <span className="text-white/60">Confirmed:</span>
                          <span className="text-white/90">
                            {new Date(payment.confirmedDate).toLocaleString()}
                          </span>
                        </div>
                      )}
                      {payment.failReason && (
                        <div className="flex gap-2 col-span-2">
                          <span className="text-red-400">Reason:</span>
                          <span className="text-red-400">{payment.failReason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary-400 mb-1">
                    ${payment.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60">Payment Amount</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button fullWidth variant="secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {payment.status === 'pending' && (
                  <>
                    <Button fullWidth onClick={() => handleConfirmPayment(payment.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Receipt
                    </Button>
                    <Button fullWidth variant="ghost" onClick={() => handleMarkAsFailed(payment.id)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark Failed
                    </Button>
                  </>
                )}
                {payment.status === 'received' && (
                  <Button fullWidth variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminPaymentTracking
