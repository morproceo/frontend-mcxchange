import { useState, useEffect } from 'react'
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
  DollarSign,
  Loader2,
  AlertCircle
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'
import api from '../services/api'

interface Listing {
  id: string
  mcNumber: string
  dotNumber?: string
  title: string
  price: number
  status: string
  views: number
  saves: number
  createdAt: string
  yearsInBusiness?: number
  fleetSize?: number
  trustScore?: number
  _count?: {
    offers: number
    savedBy: number
  }
}

const SellerListingsPage = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchListings()
  }, [activeFilter])

  const fetchListings = async () => {
    setLoading(true)
    setError(null)
    try {
      const statusParam = activeFilter === 'all' ? undefined : activeFilter.toUpperCase()
      const response = await api.getSellerListings({ status: statusParam })
      setListings(response.data || [])
    } catch (err: any) {
      console.error('Failed to fetch listings:', err)
      setError(err.message || 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'text-green-600'
      case 'PENDING_REVIEW':
        return 'text-yellow-600'
      case 'SOLD':
        return 'text-blue-600'
      case 'RESERVED':
        return 'text-purple-600'
      case 'REJECTED':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />
      case 'PENDING_REVIEW':
        return <Clock className="w-4 h-4" />
      case 'SOLD':
        return <DollarSign className="w-4 h-4" />
      case 'RESERVED':
        return <Clock className="w-4 h-4" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  const formatStatus = (status: string) => {
    return status.toLowerCase().replace(/_/g, ' ')
  }

  const stats = [
    {
      label: 'Active Listings',
      value: listings.filter(l => l.status.toUpperCase() === 'ACTIVE').length,
      color: 'text-green-600'
    },
    {
      label: 'Pending Review',
      value: listings.filter(l => l.status.toUpperCase() === 'PENDING_REVIEW').length,
      color: 'text-yellow-600'
    },
    {
      label: 'Sold',
      value: listings.filter(l => l.status.toUpperCase() === 'SOLD').length,
      color: 'text-blue-600'
    },
    {
      label: 'Total Views',
      value: listings.reduce((sum, l) => sum + (l.views || 0), 0),
      color: 'text-primary-600'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Listings</h2>
            <p className="text-gray-500">Manage your MC authority listings</p>
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
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'pending_review', 'sold'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeFilter === filter
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <span className="ml-3 text-gray-500">Loading listings...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <GlassCard>
            <div className="flex items-center justify-center py-8 text-red-500">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          </GlassCard>
        )}

        {/* Empty State */}
        {!loading && !error && listings.length === 0 && (
          <GlassCard>
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Listings Yet</h3>
              <p className="text-gray-500 mb-6">Create your first MC authority listing to get started.</p>
              <Button onClick={() => navigate('/seller/create-listing')}>
                <Package className="w-4 h-4 mr-2" />
                Create New Listing
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Listings */}
        {!loading && !error && listings.length > 0 && (
          <div className="space-y-4">
            {listings.map((listing) => (
              <GlassCard key={listing.id} hover={true}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">MC #{listing.mcNumber}</h3>
                      <span className={`bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${getStatusColor(listing.status)}`}>
                        {getStatusIcon(listing.status)}
                        <span className="capitalize">{formatStatus(listing.status)}</span>
                      </span>
                      {listing.trustScore && (
                        <TrustBadge
                          score={listing.trustScore}
                          level={getTrustLevel(listing.trustScore)}
                          verified={true}
                          size="sm"
                        />
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{listing.title}</p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span>{listing.views || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4" />
                        <span>{listing._count?.savedBy || listing.saves || 0} saves</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>{listing._count?.offers || 0} offers</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-xs text-gray-500 mb-1">Your Asking Price</div>
                    <div className="text-2xl font-bold text-primary-600 mb-2">
                      ${(listing.price || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Listed {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {(listing.yearsInBusiness || listing.fleetSize) && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {listing.yearsInBusiness && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Years Active</div>
                        <div className="font-semibold text-gray-900">{listing.yearsInBusiness} years</div>
                      </div>
                    )}
                    {listing.fleetSize && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">Fleet Size</div>
                        <div className="font-semibold text-gray-900">{listing.fleetSize} trucks</div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => navigate(`/mc/${listing.id}`)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  {listing.status.toUpperCase() !== 'SOLD' && (
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
                  {listing._count && listing._count.offers > 0 && listing.status.toUpperCase() === 'ACTIVE' && (
                    <Button fullWidth onClick={() => navigate('/seller/offers')}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Offers
                    </Button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SellerListingsPage
