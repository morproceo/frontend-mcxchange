import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'
import { formatDistanceToNow } from 'date-fns'

const SellerOffersPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  const offers = [
    {
      id: '1',
      listingId: '1',
      mcNumber: '123456',
      listingTitle: 'Established Interstate Authority - Clean Record',
      askingPrice: 45000,
      offerAmount: 42000,
      buyer: {
        name: 'John Transport LLC',
        trustScore: 78,
        verified: true,
        completedDeals: 2
      },
      message: 'Very interested in this authority. Have cash ready for quick closing.',
      status: 'pending',
      createdAt: new Date('2024-01-10T10:30:00')
    },
    {
      id: '2',
      listingId: '1',
      mcNumber: '123456',
      listingTitle: 'Established Interstate Authority - Clean Record',
      askingPrice: 45000,
      offerAmount: 44000,
      buyer: {
        name: 'Express Freight Corp',
        trustScore: 92,
        verified: true,
        completedDeals: 5
      },
      message: 'Looking to expand our operations. Can close within 48 hours if accepted.',
      status: 'pending',
      createdAt: new Date('2024-01-11T14:20:00')
    },
    {
      id: '3',
      listingId: '4',
      mcNumber: '901234',
      listingTitle: 'Expedited Freight Authority',
      askingPrice: 38000,
      offerAmount: 37000,
      buyer: {
        name: 'Quick Logistics Inc',
        trustScore: 85,
        verified: true,
        completedDeals: 3
      },
      message: 'Great fit for our business model. Ready to proceed immediately.',
      status: 'pending',
      createdAt: new Date('2024-01-09T16:45:00')
    },
    {
      id: '4',
      listingId: '3',
      mcNumber: '345678',
      listingTitle: 'Long Haul Authority - Amazon Approved',
      askingPrice: 52000,
      offerAmount: 52000,
      buyer: {
        name: 'National Carriers LLC',
        trustScore: 88,
        verified: true,
        completedDeals: 4
      },
      message: 'Willing to pay full asking price. Please consider.',
      status: 'accepted',
      createdAt: new Date('2024-01-08T09:15:00')
    },
    {
      id: '5',
      listingId: '1',
      mcNumber: '123456',
      listingTitle: 'Established Interstate Authority - Clean Record',
      askingPrice: 45000,
      offerAmount: 35000,
      buyer: {
        name: 'Budget Transport',
        trustScore: 62,
        verified: false,
        completedDeals: 0
      },
      message: 'Starting out, this is our budget.',
      status: 'rejected',
      createdAt: new Date('2024-01-07T11:30:00')
    }
  ]

  const filteredOffers = offers.filter(offer =>
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
      default:
        return null
    }
  }

  const stats = [
    {
      label: 'Pending Offers',
      value: offers.filter(o => o.status === 'pending').length,
      color: 'text-yellow-400'
    },
    {
      label: 'Accepted',
      value: offers.filter(o => o.status === 'accepted').length,
      color: 'text-trust-high'
    },
    {
      label: 'Rejected',
      value: offers.filter(o => o.status === 'rejected').length,
      color: 'text-red-400'
    },
    {
      label: 'Avg Offer',
      value: `$${Math.round(offers.reduce((sum, o) => sum + o.offerAmount, 0) / offers.length / 1000)}K`,
      color: 'text-primary-400'
    }
  ]

  const handleAcceptOffer = (offerId: string) => {
    alert(`Offer ${offerId} accepted! Buyer will be notified.`)
  }

  const handleRejectOffer = (offerId: string) => {
    alert(`Offer ${offerId} rejected.`)
  }

  const handleCounterOffer = (_offerId: string) => {
    const amount = prompt('Enter counter offer amount:')
    if (amount) {
      alert(`Counter offer of $${amount} sent to buyer.`)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Offers Received</h2>
          <p className="text-white/60">Review and manage offers on your listings</p>
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
          {(['all', 'pending', 'accepted', 'rejected'] as const).map((filter) => (
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
                  <p className="text-sm text-white/80 mb-1">{offer.listingTitle}</p>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDistanceToNow(offer.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-white/60 mb-1">Your Asking Price</div>
                  <div className="text-lg font-semibold text-white/80 mb-2">
                    ${offer.askingPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-white/60 mb-1">Offer Amount</div>
                  <div className="text-2xl font-bold text-primary-400">
                    ${offer.offerAmount.toLocaleString()}
                  </div>
                  <div className={`text-xs mt-1 ${offer.offerAmount >= offer.askingPrice ? 'text-trust-high' : 'text-yellow-400'}`}>
                    {offer.offerAmount >= offer.askingPrice ? 'Full price' : `${Math.round((offer.offerAmount / offer.askingPrice) * 100)}% of asking`}
                  </div>
                </div>
              </div>

              {/* Buyer Info */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Buyer Information</div>
                <div className="flex items-center justify-between glass-subtle rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="font-semibold">{offer.buyer.name}</div>
                      <div className="text-xs text-white/60">
                        {offer.buyer.completedDeals} completed deals
                      </div>
                    </div>
                  </div>
                  <TrustBadge
                    score={offer.buyer.trustScore}
                    level={getTrustLevel(offer.buyer.trustScore)}
                    verified={offer.buyer.verified}
                    size="sm"
                  />
                </div>
              </div>

              {/* Message */}
              {offer.message && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Buyer's Message</div>
                  <div className="glass-subtle rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-primary-400 mt-1 flex-shrink-0" />
                      <p className="text-sm text-white/80">{offer.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {offer.status === 'pending' && (
                <div className="flex gap-3">
                  <Button fullWidth onClick={() => handleAcceptOffer(offer.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept Offer
                  </Button>
                  <Button fullWidth variant="secondary" onClick={() => handleCounterOffer(offer.id)}>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Counter Offer
                  </Button>
                  <Button fullWidth variant="ghost" onClick={() => handleRejectOffer(offer.id)}>
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SellerOffersPage
