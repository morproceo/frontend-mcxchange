import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Unlock,
  DollarSign,
  Eye,
  Send,
  X,
  Coins,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Building2,
  Shield,
  CreditCard,
  ArrowRight,
  Loader2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { UnlockedMC, BuyerCredits, OfferStatus } from '../types'

const BuyerUnlockedMCsPage = () => {
  const { user } = useAuth()
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [selectedMC, setSelectedMC] = useState<UnlockedMC | null>(null)
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [submittingOffer, setSubmittingOffer] = useState(false)

  // Mock buyer credits data
  const buyerCredits: BuyerCredits = {
    userId: user?.id || '',
    totalCredits: 10,
    usedCredits: 3,
    availableCredits: 7,
    creditHistory: [
      { id: '1', userId: user?.id || '', amount: 10, type: 'purchase', description: 'Purchased 10 credits', createdAt: new Date('2024-01-01') },
      { id: '2', userId: user?.id || '', amount: -1, type: 'usage', description: 'Unlocked MC #789012', relatedListingId: '1', createdAt: new Date('2024-01-05') },
      { id: '3', userId: user?.id || '', amount: -1, type: 'usage', description: 'Unlocked MC #456789', relatedListingId: '2', createdAt: new Date('2024-01-10') },
      { id: '4', userId: user?.id || '', amount: -1, type: 'usage', description: 'Unlocked MC #123456', relatedListingId: '3', createdAt: new Date('2024-01-15') },
    ]
  }

  // Mock unlocked MCs data
  const unlockedMCs: UnlockedMC[] = [
    {
      id: '1',
      listingId: 'listing-1',
      listing: {
        id: 'listing-1',
        mcNumber: '789012',
        sellerId: 'seller-1',
        seller: { id: 'seller-1', email: 'seller@test.com', name: 'Transport Co', role: 'seller', verified: true, trustScore: 92, memberSince: new Date(), completedDeals: 5, reviews: [] },
        title: 'Established 5-Year MC Authority',
        description: 'Clean safety record, Amazon Relay ready',
        price: 15000,
        trustScore: 92,
        trustLevel: 'high',
        verified: true,
        verificationBadges: ['Safety Verified', 'Insurance Current'],
        yearsActive: 5,
        operationType: ['Freight', 'Household Goods'],
        fleetSize: 3,
        safetyRating: 'satisfactory',
        insuranceStatus: 'active',
        state: 'TX',
        amazonStatus: 'active',
        amazonRelayScore: 'A',
        highwaySetup: true,
        sellingWithEmail: true,
        sellingWithPhone: true,
        isPremium: true,
        documents: [],
        status: 'active',
        visibility: 'public',
        views: 245,
        saves: 18,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      buyerId: user?.id || '',
      unlockedAt: new Date('2024-01-05'),
      creditsUsed: 1,
      offer: undefined
    },
    {
      id: '2',
      listingId: 'listing-2',
      listing: {
        id: 'listing-2',
        mcNumber: '456789',
        sellerId: 'seller-2',
        seller: { id: 'seller-2', email: 'seller2@test.com', name: 'Freight Masters', role: 'seller', verified: true, trustScore: 88, memberSince: new Date(), completedDeals: 3, reviews: [] },
        title: '3-Year MC with Highway Setup',
        description: 'Highway.com integrated, great ratings',
        price: 12000,
        trustScore: 88,
        trustLevel: 'high',
        verified: true,
        verificationBadges: ['Highway Verified'],
        yearsActive: 3,
        operationType: ['Freight'],
        fleetSize: 2,
        safetyRating: 'satisfactory',
        insuranceStatus: 'active',
        state: 'CA',
        amazonStatus: 'pending',
        amazonRelayScore: null,
        highwaySetup: true,
        sellingWithEmail: true,
        sellingWithPhone: false,
        isPremium: false,
        documents: [],
        status: 'active',
        visibility: 'public',
        views: 156,
        saves: 12,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      buyerId: user?.id || '',
      unlockedAt: new Date('2024-01-10'),
      creditsUsed: 1,
      offer: {
        id: 'offer-1',
        listingId: 'listing-2',
        listing: {} as any,
        buyerId: user?.id || '',
        buyer: user as any,
        sellerId: 'seller-2',
        seller: {} as any,
        offerAmount: 11000,
        message: 'Interested in this MC',
        status: 'pending',
        depositAmount: 1000,
        depositPaid: false,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      }
    },
    {
      id: '3',
      listingId: 'listing-3',
      listing: {
        id: 'listing-3',
        mcNumber: '123456',
        sellerId: 'seller-3',
        seller: { id: 'seller-3', email: 'seller3@test.com', name: 'Quick Haul LLC', role: 'seller', verified: true, trustScore: 95, memberSince: new Date(), completedDeals: 8, reviews: [] },
        title: '7-Year Premium MC Authority',
        description: 'Amazon A-rated, clean history',
        price: 22000,
        trustScore: 95,
        trustLevel: 'high',
        verified: true,
        verificationBadges: ['Safety Verified', 'Premium Seller'],
        yearsActive: 7,
        operationType: ['Freight', 'Hazmat'],
        fleetSize: 5,
        safetyRating: 'satisfactory',
        insuranceStatus: 'active',
        state: 'FL',
        amazonStatus: 'active',
        amazonRelayScore: 'A',
        highwaySetup: true,
        sellingWithEmail: true,
        sellingWithPhone: true,
        isPremium: true,
        documents: [],
        status: 'active',
        visibility: 'public',
        views: 312,
        saves: 24,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      buyerId: user?.id || '',
      unlockedAt: new Date('2024-01-15'),
      creditsUsed: 1,
      offer: {
        id: 'offer-2',
        listingId: 'listing-3',
        listing: {} as any,
        buyerId: user?.id || '',
        buyer: user as any,
        sellerId: 'seller-3',
        seller: {} as any,
        offerAmount: 20000,
        message: 'Ready to proceed with purchase',
        status: 'admin-approved',
        depositAmount: 1000,
        depositPaid: false,
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-17')
      }
    }
  ]

  const getOfferStatusBadge = (status: OfferStatus) => {
    const statusConfig = {
      'pending': { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      'admin-approved': { label: 'Approved - Pay Deposit', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      'admin-rejected': { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: AlertCircle },
      'deposit-pending': { label: 'Deposit Pending', color: 'bg-blue-100 text-blue-700', icon: CreditCard },
      'deposit-paid': { label: 'Deposit Paid', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
      'in-transaction': { label: 'In Transaction', color: 'bg-purple-100 text-purple-700', icon: FileText },
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
      'cancelled': { label: 'Cancelled', color: 'bg-gray-100 text-gray-700', icon: X }
    }
    return statusConfig[status]
  }

  const handleOpenOfferModal = (mc: UnlockedMC) => {
    setSelectedMC(mc)
    setOfferAmount(mc.listing.price.toString())
    setOfferMessage('')
    setShowOfferModal(true)
  }

  const handleSubmitOffer = async () => {
    if (!selectedMC || !offerAmount) return
    setSubmittingOffer(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setSubmittingOffer(false)
    setShowOfferModal(false)
    // In real app, would refresh data
    alert('Offer submitted successfully! Admin will review shortly.')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unlocked MCs</h1>
          <p className="text-gray-500">View and manage your unlocked MC authorities</p>
        </div>
        <Link to="/buyer/subscription">
          <Button>
            <Coins className="w-4 h-4 mr-2" />
            Buy More Credits
          </Button>
        </Link>
      </div>

      {/* Credits Card */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Coins className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Available Credits</p>
              <p className="text-3xl font-bold text-white">{buyerCredits.availableCredits}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Total Purchased</p>
              <p className="text-xl font-semibold text-white">{buyerCredits.totalCredits}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Used</p>
              <p className="text-xl font-semibold text-white">{buyerCredits.usedCredits}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">MCs Unlocked</p>
              <p className="text-xl font-semibold text-white">{unlockedMCs.length}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Unlocked MCs List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Unlocked Listings</h2>

        {unlockedMCs.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Unlock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Unlocked MCs Yet</h3>
              <p className="text-gray-500 mb-4">Browse the marketplace and unlock MC listings to view full details</p>
              <Link to="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {unlockedMCs.map((unlockedMC, index) => {
              const listing = unlockedMC.listing
              const offer = unlockedMC.offer
              const statusConfig = offer ? getOfferStatusBadge(offer.status) : null

              return (
                <motion.div
                  key={unlockedMC.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* MC Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">MC #{listing.mcNumber}</h3>
                              {listing.isPremium && (
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                  Premium
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{listing.title}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {listing.yearsActive} years active
                              </span>
                              <span className="flex items-center gap-1">
                                <Shield className="w-4 h-4" />
                                {listing.trustScore}% trust
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${listing.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Offer Status / Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                        {offer ? (
                          <>
                            <div className="flex flex-col items-start sm:items-end gap-1">
                              {statusConfig && (
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                                  <statusConfig.icon className="w-4 h-4" />
                                  {statusConfig.label}
                                </div>
                              )}
                              <p className="text-sm text-gray-500">
                                Offer: ${offer.offerAmount.toLocaleString()}
                              </p>
                            </div>

                            {offer.status === 'admin-approved' && !offer.depositPaid && (
                              <Link to={`/buyer/deposit/${offer.id}`}>
                                <Button>
                                  <CreditCard className="w-4 h-4 mr-2" />
                                  Pay $1,000 Deposit
                                </Button>
                              </Link>
                            )}

                            {offer.status === 'in-transaction' && (
                              <Link to={`/transaction/${offer.transactionId}`}>
                                <Button>
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  View Transaction
                                </Button>
                              </Link>
                            )}
                          </>
                        ) : (
                          <div className="flex gap-2">
                            <Link to={`/mc/${listing.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </Link>
                            <Button size="sm" onClick={() => handleOpenOfferModal(unlockedMC)}>
                              <Send className="w-4 h-4 mr-2" />
                              Place Offer
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Unlocked date */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Unlock className="w-4 h-4" />
                        Unlocked on {unlockedMC.unlockedAt.toLocaleDateString()}
                      </span>
                      <span>{unlockedMC.creditsUsed} credit used</span>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && selectedMC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowOfferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Place an Offer</h2>
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* MC Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">MC #{selectedMC.listing.mcNumber}</p>
                      <p className="text-sm text-gray-500">Asking Price: ${selectedMC.listing.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Offer Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Offer Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900 resize-none"
                    placeholder="Add a message to the admin about your offer..."
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">What happens next?</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>1. Admin reviews your offer</li>
                        <li>2. If approved, you'll pay a $1,000 refundable deposit</li>
                        <li>3. Transaction room opens for both parties</li>
                        <li>4. Final approval and payment instructions provided</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowOfferModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleSubmitOffer}
                  loading={submittingOffer}
                  disabled={!offerAmount || submittingOffer}
                >
                  {submittingOffer ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Offer
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BuyerUnlockedMCsPage
