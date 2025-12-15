import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  CheckCircle,
  Clock,
  CreditCard
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'

const SellerEarningsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month')

  const earnings = {
    total: 129000,
    pending: 45000,
    completed: 84000,
    thisMonth: 45000,
    lastMonth: 39000
  }

  const transactions = [
    {
      id: '1',
      mcNumber: '345678',
      listingTitle: 'Long Haul Authority - Amazon Approved',
      amount: 52000,
      status: 'completed',
      buyerName: 'National Carriers LLC',
      completedDate: '2024-01-08',
      paymentMethod: 'Wire Transfer'
    },
    {
      id: '2',
      mcNumber: '567890',
      listingTitle: 'Regional Freight Authority',
      amount: 32000,
      status: 'completed',
      buyerName: 'Regional Express Inc',
      completedDate: '2023-12-20',
      paymentMethod: 'Wire Transfer'
    },
    {
      id: '3',
      mcNumber: '123456',
      listingTitle: 'Established Interstate Authority',
      amount: 45000,
      status: 'pending',
      buyerName: 'Express Freight Corp',
      completedDate: null,
      paymentMethod: 'Wire Transfer'
    }
  ]

  const monthlyData = [
    { month: 'Jul', amount: 28000 },
    { month: 'Aug', amount: 0 },
    { month: 'Sep', amount: 32000 },
    { month: 'Oct', amount: 0 },
    { month: 'Nov', amount: 0 },
    { month: 'Dec', amount: 24000 },
    { month: 'Jan', amount: 45000 }
  ]

  const maxAmount = Math.max(...monthlyData.map(d => d.amount))

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: `$${earnings.total.toLocaleString()}`,
      change: '+15.3% vs last month',
      color: 'text-trust-high'
    },
    {
      icon: CheckCircle,
      label: 'Completed Sales',
      value: `$${earnings.completed.toLocaleString()}`,
      change: '2 transactions',
      color: 'text-primary-400'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: `$${earnings.pending.toLocaleString()}`,
      change: '1 in escrow',
      color: 'text-yellow-400'
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: `$${earnings.thisMonth.toLocaleString()}`,
      change: `+${Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100)}% growth`,
      color: 'text-trust-high'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Earnings</h2>
            <p className="text-white/60">Track your sales and revenue</p>
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

        {/* Monthly Chart */}
        <GlassCard className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Revenue Overview</h3>
            <div className="flex gap-2">
              {(['week', 'month', 'year', 'all'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                    selectedPeriod === period
                      ? 'bg-primary-500 text-white'
                      : 'glass-subtle text-white/80 hover:bg-white/15'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.amount / maxAmount) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg mb-2 min-h-[4px]"
                  style={{
                    opacity: data.amount === 0 ? 0.2 : 1
                  }}
                />
                <div className="text-xs text-white/60 mb-1">{data.month}</div>
                <div className="text-xs font-semibold">
                  {data.amount > 0 ? `$${(data.amount / 1000).toFixed(0)}K` : '-'}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Transactions */}
        <GlassCard>
          <h3 className="text-xl font-bold mb-4">Transaction History</h3>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="glass-subtle rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">MC #{transaction.mcNumber}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        transaction.status === 'completed'
                          ? 'bg-trust-high/20 text-trust-high'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {transaction.status === 'completed' ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-white/80 mb-2">{transaction.listingTitle}</p>
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <span>Buyer: {transaction.buyerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        <span>{transaction.paymentMethod}</span>
                      </div>
                      {transaction.completedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(transaction.completedDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-trust-high mb-1">
                      ${transaction.amount.toLocaleString()}
                    </div>
                    {transaction.status === 'completed' && (
                      <Button variant="ghost" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

export default SellerEarningsPage
