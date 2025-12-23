import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Eye,
  MessageSquare,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import MCCard from '../components/MCCard'
import api from '../services/api'
import { MCListing } from '../types'
import { getTrustLevel } from '../utils/helpers'

interface SellerOffer {
  id: string
  listingId: string
  amount: number
  status: string
  message?: string
  createdAt: string
  listing?: {
    mcNumber: string
    title: string
  }
  buyer?: {
    id: string
    name: string
  }
}

interface DashboardStats {
  listings: {
    total: number
    active: number
    pending: number
    sold: number
  }
  offers: {
    total: number
    pending: number
    accepted: number
  }
  totalViews: number
  totalEarnings: number
}

const SellerDashboard = () => {
  const { user } = useAuth()

  // API data state
  const [myListings, setMyListings] = useState<MCListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Stats and offers state
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentOffers, setRecentOffers] = useState<SellerOffer[]>([])
  const [offersLoading, setOffersLoading] = useState(true)

  // Fetch seller's listings from API
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true)
        setError(null)
        // Use the seller listings endpoint
        const response = await api.getSellerListings({ limit: 2 })

        const transformedListings: MCListing[] = (response.data || [])
          .map((listing: any) => ({
            id: listing.id,
            mcNumber: listing.mcNumber,
            sellerId: listing.sellerId || user?.id || '',
            title: listing.title || `MC Authority #${listing.mcNumber}`,
            description: listing.description || '',
            price: listing.askingPrice || listing.price || 0,
            yearsActive: listing.yearsActive || 0,
            fleetSize: listing.fleetSize || 0,
            operationType: listing.operationType || [],
            safetyRating: listing.safetyRating || 'satisfactory',
            insuranceStatus: listing.insuranceStatus || 'active',
            verified: listing.verified || false,
            isPremium: listing.isPremium || false,
            trustScore: listing.trustScore || 70,
            trustLevel: getTrustLevel(listing.trustScore || 70),
            verificationBadges: listing.verificationBadges || [],
            state: listing.state || '',
            amazonStatus: listing.amazonStatus || 'none',
            amazonRelayScore: listing.amazonRelayScore || null,
            highwaySetup: listing.highwaySetup || false,
            sellingWithEmail: listing.sellingWithEmail || false,
            sellingWithPhone: listing.sellingWithPhone || false,
            documents: listing.documents || [],
            status: listing.status || 'active',
            visibility: listing.visibility || 'public',
            views: listing.views || 0,
            saves: listing.saves || 0,
            createdAt: new Date(listing.createdAt),
            updatedAt: new Date(listing.updatedAt || listing.createdAt),
            seller: {
              id: user?.id || listing.sellerId,
              name: user?.name || 'Unknown Seller',
              email: user?.email || '',
              role: 'seller' as const,
              verified: user?.verified || false,
              trustScore: user?.trustScore || 70,
              memberSince: user?.memberSince || new Date(),
              completedDeals: user?.completedDeals || 0,
              reviews: []
            }
          }))

        setMyListings(transformedListings)
      } catch (err) {
        console.error('Failed to fetch listings:', err)
        setError('Failed to load your listings')
        setMyListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchMyListings()
  }, [user?.id, user?.name, user?.email, user?.verified, user?.trustScore, user?.memberSince])

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.getSellerDashboard()
        if (response.success && response.data) {
          setDashboardStats(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      }
    }

    fetchDashboardStats()
  }, [])

  // Fetch seller's offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setOffersLoading(true)
        const response = await api.getSellerOffers({ limit: 5 })
        if (response.success && response.data) {
          setRecentOffers(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err)
      } finally {
        setOffersLoading(false)
      }
    }

    fetchOffers()
  }, [])

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  const stats = [
    {
      icon: Package,
      label: 'Active Listings',
      value: dashboardStats?.listings.active.toString() || '0',
      change: `${dashboardStats?.listings.pending || 0} pending review`,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: dashboardStats?.totalViews.toLocaleString() || '0',
      change: 'All time',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: MessageSquare,
      label: 'Pending Offers',
      value: dashboardStats?.offers.pending.toString() || '0',
      change: `${dashboardStats?.offers.total || 0} total offers`,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: formatCurrency(dashboardStats?.totalEarnings || 0),
      change: `${dashboardStats?.listings.sold || 0} completed sales`,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Quick Action */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name}!</h2>
            <p className="text-gray-500">Here's what's happening with your listings today.</p>
          </div>

          <Link to="/seller/create-listing">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Listing
            </Button>
          </Link>
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
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm mb-1">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.change}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* My Listings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
              <Link to="/seller/listings" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {loading ? (
              <Card>
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500">Loading your listings...</p>
                </div>
              </Card>
            ) : error ? (
              <Card>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading listings</h3>
                  <p className="text-gray-500 mb-6">{error}</p>
                </div>
              </Card>
            ) : myListings.length > 0 ? (
              <div className="space-y-4">
                {myListings.map((listing) => (
                  <MCCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-500 mb-6">
                    Create your first listing to start selling
                  </p>
                  <Link to="/seller/create-listing">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>

          {/* Recent Offers */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Offers</h2>

            <Card>
              {offersLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-gray-400 mx-auto animate-spin" />
                  <p className="text-gray-500 mt-2">Loading offers...</p>
                </div>
              ) : recentOffers.length > 0 ? (
                <div className="space-y-4">
                  {recentOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-gray-900">MC #{offer.listing?.mcNumber || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{offer.buyer?.name || 'Unknown Buyer'}</div>
                        </div>
                        {offer.status === 'PENDING' ? (
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending
                          </span>
                        ) : offer.status === 'ACCEPTED' ? (
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Accepted
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-50 border border-gray-200 text-gray-700 flex items-center gap-1">
                            {offer.status}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-secondary-600 font-bold">
                          ${offer.amount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{formatRelativeTime(offer.createdAt)}</div>
                      </div>

                      {offer.status === 'PENDING' && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" fullWidth>Accept</Button>
                          <Button size="sm" fullWidth variant="outline">Decline</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No offers yet</p>
                  <p className="text-sm text-gray-400">Offers from buyers will appear here</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/seller/offers" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                  View All Offers →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerDashboard
