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

const SellerDashboard = () => {
  const { user } = useAuth()

  // API data state
  const [myListings, setMyListings] = useState<MCListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch seller's listings from API
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true)
        setError(null)
        // TODO: Add endpoint to get seller's own listings
        // For now, fetch all and filter by sellerId (will be empty until listings exist)
        const response = await api.getListings()

        const transformedListings: MCListing[] = (response.listings || [])
          .filter((listing: any) => listing.sellerId === user?.id)
          .map((listing: any) => ({
            id: listing.id,
            mcNumber: listing.mcNumber,
            title: listing.title || `MC Authority #${listing.mcNumber}`,
            description: listing.description || '',
            price: listing.askingPrice || 0,
            yearsActive: listing.yearsActive || 0,
            fleetSize: listing.fleetSize || 0,
            operationType: listing.operationType || [],
            safetyRating: listing.safetyRating || 'satisfactory',
            insuranceStatus: listing.insuranceStatus || 'active',
            verified: listing.verified || false,
            premium: listing.isPremium || false,
            trustScore: listing.trustScore || 70,
            trustLevel: getTrustLevel(listing.trustScore || 70),
            createdAt: new Date(listing.createdAt),
            seller: {
              id: listing.seller?.id || listing.sellerId,
              name: listing.seller?.name || 'Unknown Seller',
              email: listing.seller?.email || '',
              verified: listing.seller?.isVerified || false,
              trustScore: listing.seller?.trustScore || 70,
              memberSince: new Date(listing.seller?.createdAt || Date.now()),
              completedDeals: listing.seller?.completedDeals || 0
            }
          }))
          .slice(0, 2)

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
  }, [user?.id])

  const stats = [
    {
      icon: Package,
      label: 'Active Listings',
      value: '3',
      change: '+1 this month',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-50'
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: '1,234',
      change: '+156 this week',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: MessageSquare,
      label: 'New Offers',
      value: '5',
      change: '2 pending review',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: '$145K',
      change: 'Last 12 months',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ]

  const recentOffers = [
    {
      id: '1',
      mcNumber: '123456',
      buyer: 'John Buyer',
      amount: 42000,
      status: 'pending',
      date: '2 hours ago'
    },
    {
      id: '2',
      mcNumber: '789012',
      buyer: 'Sarah Smith',
      amount: 58000,
      status: 'accepted',
      date: '1 day ago'
    },
    {
      id: '3',
      mcNumber: '345678',
      buyer: 'Mike Johnson',
      amount: 70000,
      status: 'pending',
      date: '3 days ago'
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
              <div className="space-y-4">
                {recentOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">MC #{offer.mcNumber}</div>
                        <div className="text-sm text-gray-500">{offer.buyer}</div>
                      </div>
                      {offer.status === 'pending' ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Accepted
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-secondary-600 font-bold">
                        ${offer.amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{offer.date}</div>
                    </div>

                    {offer.status === 'pending' && (
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" fullWidth>Accept</Button>
                        <Button size="sm" fullWidth variant="outline">Decline</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

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
