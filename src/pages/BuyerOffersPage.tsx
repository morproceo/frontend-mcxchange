import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'
import { formatDistanceToNow } from 'date-fns'

const BuyerOffersPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'countered'>('all')

  const myOffers = [
    {
      id: '1',
      listingId: '1',
      mcNumber: '123456',
      listingTitle: 'Established Interstate Authority - Clean Record',
      askingPrice: 45000,
      offerAmount: 44000,
      status: 'pending',
      seller: {
        name: 'TransportPro LLC',
        trustScore: 85,
        verified: true
      },
      submittedAt: new Date('2024-01-11T14:20:00'),
      message: 'Looking to expand our operations. Can close within 48 hours if accepted.'
    },
    {
      id: '2',
      listingId: '4',
      mcNumber: '901234',
      listingTitle: 'Expedited Freight Authority',
      askingPrice: 38000,
      offerAmount: 36000,
      status: 'countered',
      counterAmount: 37500,
      seller: {
        name: 'Fast Freight Inc',
        trustScore: 81,
        verified: true
      },
      submittedAt: new Date('2024-01-10T09:15:00'),
      message: 'Great fit for our business model. Ready to proceed immediately.'
    },
    {
      id: '3',
      listingId: '2',
      mcNumber: '789012',
      listingTitle: 'Regional Carrier Authority - Excellent Safety',
      askingPrice: 32000,
      offerAmount: 32000,
      status: 'accepted',
      seller: {
        name: 'Regional Routes LLC',
        trustScore: 78,
        verified: true
      },
      submittedAt: new Date('2024-01-09T11:30:00'),
      message: 'Willing to pay full price for quick closing.'
    },
    {
      id: '4',
      listingId: '5',
      mcNumber: '456789',
      listingTitle: 'Specialized Hauling Authority',
      askingPrice: 48000,
      offerAmount: 42000,
      status: 'rejected',
      seller: {
        name: 'Specialty Transport',
        trustScore: 88,
        verified: true
      },
      submittedAt: new Date('2024-01-08T16:45:00'),
      message: 'Initial offer based on market analysis.'
    }
  ]

  const filteredOffers = myOffers.filter(offer =>
    activeFilter === 'all' || offer.status === activeFilter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400'
      case 'accepted':
        return 'text-trust-high'
      case 'rejected':
        return 'text-red-400'
      case 'countered':
        return 'text-blue-400'
      default:
        return 'text-white/60'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'countered':
        return <MessageSquare className="w-4 h-4" />
      default:
        return null
    }
  }

  const stats = [
    {
      label: 'Total Offers',
      value: myOffers.length,
      color: 'text-primary-400'
    },
    {
      label: 'Pending',
      value: myOffers.filter(o => o.status === 'pending').length,
      color: 'text-yellow-400'
    },
    {
      label: 'Accepted',
      value: myOffers.filter(o => o.status === 'accepted').length,
      color: 'text-trust-high'
    },
    {
      label: 'Counter Offers',
      value: myOffers.filter(o => o.status === 'countered').length,
      color: 'text-blue-400'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">My Offers</h2>
          <p className="text-white/60">Track and manage your submitted offers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="text-sm text-white/60 mb-1">{stat.label}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'accepted', 'countered', 'rejected'] as const).map((filter) => (
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

        {/* Offers List */}
        <div className="space-y-4">
          {filteredOffers.map((offer) => (
            <GlassCard key={offer.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">MC #{offer.mcNumber}</h3>
                    <span className={`glass-subtle px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${getStatusColor(offer.status)}`}>
                      {getStatusIcon(offer.status)}
                      <span className="capitalize">{offer.status}</span>
                    </span>
                  </div>
                  <p className="text-sm text-white/80 mb-2">{offer.listingTitle}</p>
                  <div className="text-xs text-white/60">
                    Submitted {formatDistanceToNow(offer.submittedAt, { addSuffix: true })}
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-sm text-white/60 mb-1">Asking Price</div>
                  <div className="text-lg font-semibold text-white/80 mb-2">
                    ${offer.askingPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/60 mb-1">Your Offer</div>
                  <div className="text-2xl font-bold text-primary-400">
                    ${offer.offerAmount.toLocaleString()}
                  </div>
                  {offer.status === 'countered' && offer.counterAmount && (
                    <>
                      <div className="text-sm text-white/60 mt-2 mb-1">Counter Offer</div>
                      <div className="text-xl font-bold text-blue-400">
                        ${offer.counterAmount.toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Seller</div>
                <div className="flex items-center justify-between glass-subtle rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="font-bold text-primary-400">
                        {offer.seller.name.charAt(0)}
                      </span>
                    </div>
                    <div className="font-semibold">{offer.seller.name}</div>
                  </div>
                  <TrustBadge
                    score={offer.seller.trustScore}
                    level={getTrustLevel(offer.seller.trustScore)}
                    verified={offer.seller.verified}
                    size="sm"
                  />
                </div>
              </div>

              {/* Message */}
              {offer.message && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Your Message</div>
                  <div className="glass-subtle rounded-lg p-3">
                    <p className="text-sm text-white/80">{offer.message}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button fullWidth variant="secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  View Listing
                </Button>
                {offer.status === 'pending' && (
                  <Button fullWidth variant="ghost">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Withdraw Offer
                  </Button>
                )}
                {offer.status === 'countered' && (
                  <>
                    <Button fullWidth>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept Counter
                    </Button>
                    <Button fullWidth variant="secondary">
                      <DollarSign className="w-4 h-4 mr-2" />
                      New Offer
                    </Button>
                  </>
                )}
                {offer.status === 'accepted' && (
                  <Button fullWidth>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Proceed to Purchase
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

export default BuyerOffersPage
