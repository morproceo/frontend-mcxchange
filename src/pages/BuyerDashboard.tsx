import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  MessageSquare,
  CheckCircle,
  Clock,
  Search,
  TrendingUp,
  Eye,
  SlidersHorizontal,
  X,
  LayoutDashboard,
  Unlock,
  Coins,
  Sparkles,
  MapPin,
  Loader2,
  ShoppingBag,
  CreditCard,
  Receipt,
  DollarSign
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import TrustBadge from '../components/ui/TrustBadge'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import MCCard from '../components/MCCard'
import api from '../services/api'
import { getPartialMCNumber, getTrustLevel } from '../utils/helpers'
import { FilterOptions, MCListing } from '../types'

interface Payment {
  id: string
  type: 'DEPOSIT' | 'FINAL_PAYMENT' | 'CREDIT_PURCHASE' | 'SUBSCRIPTION' | 'LISTING_FEE'
  amount: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  method?: 'STRIPE' | 'ZELLE' | 'WIRE' | 'CHECK'
  stripePaymentId?: string
  createdAt: string
}

interface Transaction {
  id: string
  status: string
  agreedPrice: number
  depositAmount: number
  depositPaidAt?: string
  completedAt?: string
  createdAt: string
  listing: {
    id: string
    mcNumber: string
    dotNumber?: string
    title: string
  }
  seller: {
    id: string
    name: string
  }
  payments?: Payment[]
}

interface UnlockedListing {
  id: string
  mcNumber: string
  dotNumber?: string
  legalName?: string
  state?: string
  amazonScore?: string
  sellingWithEmail?: boolean
  sellingWithPhone?: boolean
  unlockedAt: Date
  listing: {
    id: string
    price: number
  }
}

interface BuyerOffer {
  id: string
  listingId: string
  amount: number
  status: string
  message?: string
  counterAmount?: number
  createdAt: string
  expiresAt?: string
  listing?: {
    id: string
    mcNumber: string
    title: string
  }
  seller?: {
    id: string
    name: string
  }
}

const BuyerDashboard = () => {
  const { user } = useAuth()
  const [savedListings] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'overview' | 'unlocked' | 'marketplace'>('marketplace')
  // Credits from user data (will be 0 for new users)
  const userCredits = user?.totalCredits ? (user.totalCredits - (user.usedCredits || 0)) : 0

  // API data state
  const [listings, setListings] = useState<MCListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Transactions/Purchases state
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.getListings()

        // Transform backend data to frontend MCListing format
        // API returns response.data array
        const listingsData = response.data || response.listings || []
        const transformedListings: MCListing[] = listingsData.map((listing: any) => ({
          id: listing.id,
          mcNumber: listing.mcNumber,
          dotNumber: listing.dotNumber,
          title: listing.title || `MC Authority #${listing.mcNumber}`,
          description: listing.description || '',
          price: Number(listing.askingPrice) || 0,
          askingPrice: Number(listing.askingPrice) || 0,
          listingPrice: listing.listingPrice ? Number(listing.listingPrice) : undefined,
          yearsActive: listing.yearsActive || 0,
          fleetSize: listing.fleetSize || 0,
          totalDrivers: listing.totalDrivers || 0,
          state: listing.state || '',
          city: listing.city || '',
          operationType: listing.cargoTypes ? listing.cargoTypes.split(',') : [],
          safetyRating: (listing.safetyRating || 'satisfactory').toLowerCase(),
          insuranceStatus: listing.insuranceOnFile ? 'active' : 'none',
          insuranceOnFile: listing.insuranceOnFile || false,
          verified: listing.verified || false,
          isPremium: listing.isPremium || false,
          premium: listing.isPremium || false,
          amazonStatus: (listing.amazonStatus || 'none').toLowerCase(),
          amazonRelayScore: listing.amazonRelayScore || null,
          highwaySetup: listing.highwaySetup || false,
          sellingWithEmail: listing.sellingWithEmail || false,
          sellingWithPhone: listing.sellingWithPhone || false,
          trustScore: listing.seller?.trustScore || 70,
          trustLevel: getTrustLevel(listing.seller?.trustScore || 70),
          createdAt: new Date(listing.createdAt),
          seller: {
            id: listing.seller?.id || listing.sellerId,
            name: listing.seller?.name || 'Unknown Seller',
            email: listing.seller?.email || '',
            verified: listing.seller?.verified || false,
            trustScore: listing.seller?.trustScore || 70,
            memberSince: new Date(listing.seller?.createdAt || Date.now()),
            completedDeals: listing.seller?.completedDeals || 0
          }
        }))

        setListings(transformedListings)
      } catch (err) {
        console.error('Failed to fetch listings:', err)
        setError('Failed to load listings')
        setListings([])
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  // Fetch transactions/purchases
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true)
        const response = await api.getBuyerTransactions({ limit: 100 })
        setTransactions(response.data || [])
      } catch (err) {
        console.error('Failed to fetch transactions:', err)
      } finally {
        setTransactionsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // Unlocked listings state
  const [unlockedListings, setUnlockedListings] = useState<UnlockedListing[]>([])
  const [unlockedLoading, setUnlockedLoading] = useState(true)

  // Fetch unlocked listings
  useEffect(() => {
    const fetchUnlockedListings = async () => {
      try {
        setUnlockedLoading(true)
        const response = await api.getUnlockedListings({ limit: 100 })
        if (response.success && response.data) {
          const transformedListings: UnlockedListing[] = response.data.map((item: any) => ({
            id: item.id,
            mcNumber: item.mcNumber || item.listing?.mcNumber,
            dotNumber: item.dotNumber || item.listing?.dotNumber,
            legalName: item.legalName || item.listing?.legalName,
            state: item.state || item.listing?.state,
            amazonScore: item.amazonScore || item.listing?.amazonStatus,
            sellingWithEmail: item.sellingWithEmail || item.listing?.sellingWithEmail,
            sellingWithPhone: item.sellingWithPhone || item.listing?.sellingWithPhone,
            unlockedAt: new Date(item.unlockedAt || item.createdAt),
            listing: {
              id: item.listing?.id || item.listingId,
              price: item.listing?.askingPrice || item.listing?.price || 0,
            }
          }))
          setUnlockedListings(transformedListings)
        }
      } catch (err) {
        console.error('Failed to fetch unlocked listings:', err)
      } finally {
        setUnlockedLoading(false)
      }
    }

    fetchUnlockedListings()
  }, [])

  // My offers state
  const [myOffers, setMyOffers] = useState<BuyerOffer[]>([])
  const [offersLoading, setOffersLoading] = useState(true)

  // Fetch buyer offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setOffersLoading(true)
        const response = await api.getBuyerOffers()
        if (response.success && response.data) {
          setMyOffers(response.data)
        }
      } catch (err) {
        console.error('Failed to fetch offers:', err)
      } finally {
        setOffersLoading(false)
      }
    }

    fetchOffers()
  }, [])

  // Marketplace state
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState<FilterOptions>({
    priceMin: undefined,
    priceMax: undefined,
    yearsActiveMin: undefined,
    operationTypes: [],
    safetyRating: [],
    trustLevel: [],
    verified: undefined,
    sortBy: 'newest'
  })

  // Calculate total payments from transactions
  const totalPaid = transactions.reduce((sum, txn) => {
    const txnPayments = txn.payments || []
    const completedPayments = txnPayments.filter(p => p.status === 'COMPLETED')
    return sum + completedPayments.reduce((pSum, p) => pSum + Number(p.amount), 0)
  }, 0)

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Active Purchases',
      value: transactions.length,
      change: 'Transactions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: DollarSign,
      label: 'Total Paid',
      value: `$${totalPaid.toLocaleString()}`,
      change: 'Stripe payments',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Coins,
      label: 'Credits Available',
      value: userCredits,
      change: 'Unlock MC details',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      icon: Unlock,
      label: 'Unlocked MCs',
      value: unlockedListings.length,
      change: 'Full access',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ]

  const handleSaveListing = (id: string) => {
    // Toggle save/unsave logic would go here
    console.log('Toggle save for listing:', id)
  }

  const filteredListings = useMemo(() => {
    let results = listings.filter(listing => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          listing.mcNumber.includes(query) ||
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      const listingPrice = listing.listingPrice ?? listing.askingPrice ?? listing.price ?? 0
      if (filters.priceMin && listingPrice < filters.priceMin) return false
      if (filters.priceMax && listingPrice > filters.priceMax) return false
      if (filters.yearsActiveMin && listing.yearsActive < filters.yearsActiveMin) return false
      if (filters.trustLevel && filters.trustLevel.length > 0) {
        if (!filters.trustLevel.includes(listing.trustLevel)) return false
      }
      if (filters.verified !== undefined && listing.verified !== filters.verified) return false

      return true
    })

    switch (filters.sortBy) {
      case 'price-asc':
        results.sort((a, b) => (a.listingPrice ?? a.askingPrice ?? a.price ?? 0) - (b.listingPrice ?? b.askingPrice ?? b.price ?? 0))
        break
      case 'price-desc':
        results.sort((a, b) => (b.listingPrice ?? b.askingPrice ?? b.price ?? 0) - (a.listingPrice ?? a.askingPrice ?? a.price ?? 0))
        break
      case 'trust-score':
        results.sort((a, b) => b.trustScore - a.trustScore)
        break
      case 'newest':
        results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'oldest':
        results.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'years-active':
        results.sort((a, b) => b.yearsActive - a.yearsActive)
        break
    }

    return results
  }, [searchQuery, filters, listings])

  const clearFilters = () => {
    setFilters({
      priceMin: undefined,
      priceMax: undefined,
      yearsActiveMin: undefined,
      operationTypes: [],
      safetyRating: [],
      trustLevel: [],
      verified: undefined,
      sortBy: 'newest'
    })
    setSearchQuery('')
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Credits Banner */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 -m-6 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-600">{userCredits}</span>
                    <span className="text-gray-500">credits remaining</span>
                  </div>
                  <p className="text-sm text-gray-500">Use credits to unlock full MC details</p>
                </div>
              </div>
              <Link to="/buyer/subscription">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get More Credits
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Tabs - Mobile Friendly */}
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-2 bg-gray-100 rounded-xl p-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'overview'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('unlocked')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'unlocked'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Unlock className="w-4 h-4" />
              <span className="hidden sm:inline">Unlocked</span>
              {unlockedListings.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs">
                  {unlockedListings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'marketplace'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Browse</span>
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
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
              {/* My Offers */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">My Offers</h2>
                  <Link to="/buyer/offers" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>

                {offersLoading ? (
                  <Card>
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                      <p className="text-gray-500">Loading your offers...</p>
                    </div>
                  </Card>
                ) : myOffers.length > 0 ? (
                  <div className="space-y-4">
                    {myOffers.map((offer) => (
                      <Card key={offer.id}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <Link
                              to={`/mc/${offer.listing?.id || offer.listingId}`}
                              className="text-xl font-bold text-gray-900 hover:text-secondary-600 transition-colors"
                            >
                              MC #{getPartialMCNumber(offer.listing?.mcNumber || '')}
                            </Link>
                            <p className="text-gray-500 text-sm">{offer.listing?.title || 'Untitled Listing'}</p>
                          </div>

                          {offer.status === 'PENDING' && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {offer.status === 'COUNTERED' && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 border border-purple-200 text-purple-700 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Countered
                            </span>
                          )}
                          {offer.status === 'ACCEPTED' && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Accepted
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Your Offer</div>
                            <div className="text-xl font-bold text-secondary-600">
                              ${offer.amount.toLocaleString()}
                            </div>
                          </div>

                          {offer.status === 'COUNTERED' && offer.counterAmount && (
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Counter Offer</div>
                              <div className="text-xl font-bold text-purple-600">
                                ${offer.counterAmount.toLocaleString()}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>Submitted {new Date(offer.createdAt).toLocaleDateString()}</span>
                          {offer.expiresAt && <span>Expires {new Date(offer.expiresAt).toLocaleDateString()}</span>}
                        </div>

                        {offer.status === 'COUNTERED' && (
                          <div className="flex gap-2">
                            <Button size="sm" fullWidth>Accept Counter</Button>
                            <Button size="sm" fullWidth variant="secondary">
                              Counter Again
                            </Button>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No active offers</h3>
                      <p className="text-gray-500 mb-6">
                        Browse the marketplace and make offers on listings
                      </p>
                      <Link to="/marketplace">
                        <Button>Browse Marketplace</Button>
                      </Link>
                    </div>
                  </Card>
                )}
              </div>

              {/* Saved Listings */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Saved</h2>
                  <Link to="/buyer/saved" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
                    View All
                  </Link>
                </div>

                {savedListings.size > 0 && listings.filter(l => savedListings.has(l.id)).length > 0 ? (
                  <div className="space-y-4">
                    {listings
                      .filter(l => savedListings.has(l.id))
                      .map((listing) => (
                        <Card key={listing.id}>
                          <Link to={`/mc/${listing.id}`}>
                            <div className="mb-3">
                              <h3 className="font-bold text-gray-900 hover:text-secondary-600 transition-colors">
                                MC #{getPartialMCNumber(listing.mcNumber)}
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {listing.title}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mb-3">
                              <TrustBadge
                                score={listing.trustScore}
                                level={getTrustLevel(listing.trustScore)}
                                size="sm"
                                showScore={false}
                              />
                              <div className="text-secondary-600 font-bold">
                                ${(listing.listingPrice ?? listing.askingPrice ?? listing.price ?? 0).toLocaleString()}
                              </div>
                            </div>

                            <Button size="sm" fullWidth variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <Card>
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 mb-4">No saved listings yet</p>
                      <Link to="/marketplace">
                        <Button size="sm">Browse Marketplace</Button>
                      </Link>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by MC number, title, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      icon={<Search className="w-4 h-4" />}
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                  </Button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 border-t border-gray-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                      <Input
                        label="Min Price"
                        type="number"
                        placeholder="$0"
                        value={filters.priceMin || ''}
                        onChange={(e) =>
                          setFilters(prev => ({ ...prev, priceMin: e.target.value ? Number(e.target.value) : undefined }))
                        }
                      />

                      <Input
                        label="Max Price"
                        type="number"
                        placeholder="$100,000"
                        value={filters.priceMax || ''}
                        onChange={(e) =>
                          setFilters(prev => ({ ...prev, priceMax: e.target.value ? Number(e.target.value) : undefined }))
                        }
                      />

                      <Input
                        label="Min Years Active"
                        type="number"
                        placeholder="0"
                        value={filters.yearsActiveMin || ''}
                        onChange={(e) =>
                          setFilters(prev => ({
                            ...prev,
                            yearsActiveMin: e.target.value ? Number(e.target.value) : undefined
                          }))
                        }
                      />

                      <Select
                        label="Sort By"
                        value={filters.sortBy || 'newest'}
                        onChange={(e) =>
                          setFilters(prev => ({
                            ...prev,
                            sortBy: e.target.value as FilterOptions['sortBy']
                          }))
                        }
                        options={[
                          { value: 'newest', label: 'Newest First' },
                          { value: 'oldest', label: 'Oldest First' },
                          { value: 'price-asc', label: 'Price: Low to High' },
                          { value: 'price-desc', label: 'Price: High to Low' },
                          { value: 'trust-score', label: 'Trust Score' },
                          { value: 'years-active', label: 'Years Active' }
                        ]}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Clear Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>

            {/* Results */}
            <div className="mb-4">
              <p className="text-gray-500">
                {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
              </p>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <Card>
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500">Loading listings...</p>
                </div>
              </Card>
            ) : error ? (
              <Card>
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading listings</h3>
                  <p className="text-gray-500 mb-4">{error}</p>
                </div>
              </Card>
            ) : filteredListings.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <MCCard
                    key={listing.id}
                    listing={listing}
                    onSave={handleSaveListing}
                    isSaved={savedListings.has(listing.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No listings found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Unlocked MCs Tab */}
        {activeTab === 'unlocked' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Unlocked MC Authorities</h2>
                <p className="text-gray-500">Full access to {unlockedListings.length} MC details</p>
              </div>
            </div>

            {unlockedLoading ? (
              <Card>
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500">Loading unlocked MCs...</p>
                </div>
              </Card>
            ) : unlockedListings.length > 0 ? (
              <div className="space-y-4">
                {unlockedListings.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 -m-6 mb-4 p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Unlock className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <Link
                              to={`/mc/${item.listing.id}`}
                              className="text-xl font-bold text-gray-900 hover:text-secondary-600 transition-colors"
                            >
                              MC #{item.mcNumber}
                            </Link>
                            <div className="text-sm text-gray-500">
                              Unlocked on {item.unlockedAt.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-600">
                            ${item.listing.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">Asking Price</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">DOT Number</div>
                        <div className="font-semibold text-gray-900">{item.dotNumber}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">Legal Name</div>
                        <div className="font-semibold text-gray-900 text-sm">{item.legalName}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">State</div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-secondary-500" />
                          {item.state}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-1">Amazon Score</div>
                        <div className={`font-bold text-lg ${
                          item.amazonScore === 'A' ? 'text-emerald-600' :
                          item.amazonScore === 'B' ? 'text-green-600' :
                          item.amazonScore === 'C' ? 'text-amber-600' : 'text-orange-600'
                        }`}>
                          {item.amazonScore}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        item.sellingWithEmail
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : 'bg-gray-50 border border-gray-200 text-gray-500'
                      }`}>
                        {item.sellingWithEmail ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        Email Included
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        item.sellingWithPhone
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : 'bg-gray-50 border border-gray-200 text-gray-500'
                      }`}>
                        {item.sellingWithPhone ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        Phone Included
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link to={`/mc/${item.listing.id}`} className="flex-1">
                        <Button fullWidth>
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Details
                        </Button>
                      </Link>
                      <Button variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact Seller
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <Unlock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No unlocked MCs yet</h3>
                  <p className="text-gray-500 mb-6">
                    Browse the marketplace and use your credits to unlock MC details
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => setActiveTab('marketplace')}>
                      <Search className="w-4 h-4 mr-2" />
                      Browse Marketplace
                    </Button>
                    <Link to="/buyer/subscription">
                      <Button variant="outline">
                        <Coins className="w-4 h-4 mr-2" />
                        Get Credits
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default BuyerDashboard
