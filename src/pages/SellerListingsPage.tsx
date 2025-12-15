import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Package,
  Eye,
  Heart,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'

const SellerListingsPage = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'sold'>('all')

  const myListings = [
    {
      id: '1',
      mcNumber: '123456',
      title: 'Established Interstate Authority - Clean Record',
      price: 45000,
      status: 'active',
      views: 234,
      saves: 12,
      offers: 3,
      createdAt: '2024-01-05',
      yearsActive: 5,
      fleetSize: 12,
      trustScore: 85
    },
    {
      id: '2',
      mcNumber: '789012',
      title: 'Regional Carrier Authority - Excellent Safety',
      price: 32000,
      status: 'pending',
      views: 89,
      saves: 5,
      offers: 0,
      createdAt: '2024-01-10',
      yearsActive: 3,
      fleetSize: 8,
      trustScore: 78
    },
    {
      id: '3',
      mcNumber: '345678',
      title: 'Long Haul Authority - Amazon Approved',
      price: 52000,
      status: 'sold',
      views: 456,
      saves: 28,
      offers: 8,
      createdAt: '2023-12-15',
      yearsActive: 7,
      fleetSize: 15,
      trustScore: 92
    },
    {
      id: '4',
      mcNumber: '901234',
      title: 'Expedited Freight Authority',
      price: 38000,
      status: 'active',
      views: 178,
      saves: 9,
      offers: 2,
      createdAt: '2024-01-08',
      yearsActive: 4,
      fleetSize: 6,
      trustScore: 81
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-trust-high'
      case 'pending':
        return 'text-yellow-400'
      case 'sold':
        return 'text-blue-400'
      default:
        return 'text-white/60'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'sold':
        return <DollarSign className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  const filteredListings = myListings.filter(listing =>
    activeFilter === 'all' || listing.status === activeFilter
  )

  const stats = [
    {
      label: 'Active Listings',
      value: myListings.filter(l => l.status === 'active').length,
      color: 'text-trust-high'
    },
    {
      label: 'Pending Review',
      value: myListings.filter(l => l.status === 'pending').length,
      color: 'text-yellow-400'
    },
    {
      label: 'Sold',
      value: myListings.filter(l => l.status === 'sold').length,
      color: 'text-blue-400'
    },
    {
      label: 'Total Views',
      value: myListings.reduce((sum, l) => sum + l.views, 0),
      color: 'text-primary-400'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">My Listings</h2>
            <p className="text-white/60">Manage your MC authority listings</p>
          </div>
          <Button onClick={() => navigate('/seller/create-listing')}>
            <Package className="w-4 h-4 mr-2" />
            Create New Listing
          </Button>
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
          {(['all', 'active', 'pending', 'sold'] as const).map((filter) => (
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

        {/* Listings */}
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <GlassCard key={listing.id} hover={true}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">MC #{listing.mcNumber}</h3>
                    <span className={`glass-subtle px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${getStatusColor(listing.status)}`}>
                      {getStatusIcon(listing.status)}
                      <span className="capitalize">{listing.status}</span>
                    </span>
                    <TrustBadge
                      score={listing.trustScore}
                      level={getTrustLevel(listing.trustScore)}
                      verified={true}
                      size="sm"
                    />
                  </div>
                  <p className="text-white/80 mb-3">{listing.title}</p>

                  <div className="flex items-center gap-6 text-sm text-white/60">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      <span>{listing.views} views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-4 h-4" />
                      <span>{listing.saves} saves</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" />
                      <span>{listing.offers} offers</span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary-400 mb-2">
                    ${listing.price.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60">
                    Listed {new Date(listing.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass-subtle rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Years Active</div>
                  <div className="font-semibold">{listing.yearsActive} years</div>
                </div>
                <div className="glass-subtle rounded-lg p-3">
                  <div className="text-xs text-white/60 mb-1">Fleet Size</div>
                  <div className="font-semibold">{listing.fleetSize} trucks</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => navigate(`/mc/${listing.id}`)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                {listing.status !== 'sold' && (
                  <>
                    <Button fullWidth variant="secondary">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button fullWidth variant="ghost">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                {listing.offers > 0 && listing.status === 'active' && (
                  <Button fullWidth onClick={() => navigate('/seller/offers')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Offers
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

export default SellerListingsPage
