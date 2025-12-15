import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Star,
  DollarSign,
  Send,
  X,
  Crown,
  Shield,
  TruckIcon,
  Calendar,
  Package
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel, formatPrice } from '../utils/helpers'

interface PendingListing {
  id: string
  mcNumber: string
  title: string
  description: string
  price: number
  isPremium: boolean
  premiumPrice?: number
  premiumPriceSent?: boolean
  premiumPriceAccepted?: boolean
  seller: {
    id: string
    name: string
    email: string
    trustScore: number
    verified: boolean
    memberSince: string
    completedDeals: number
  }
  yearsActive: number
  fleetSize: number
  safetyRating: string
  insuranceStatus: string
  operationType: string[]
  submittedAt: string
  documentsCount: number
  verifiedDocuments: number
}

const AdminPendingReviewPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedListing, setSelectedListing] = useState<PendingListing | null>(null)
  const [showPremiumPriceModal, setShowPremiumPriceModal] = useState(false)
  const [premiumPrice, setPremiumPrice] = useState('')
  const [premiumMessage, setPremiumMessage] = useState('')
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [approvalNotes, setApprovalNotes] = useState('')

  // Mock pending listings data
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([
    {
      id: '1',
      mcNumber: '123456',
      title: 'Established Dry Van Authority - Clean Record',
      description: 'Well-maintained authority with 8 years of operation. Perfect safety record, all insurance current. Ready for immediate transfer.',
      price: 45000,
      isPremium: true,
      premiumPriceSent: false,
      seller: {
        id: 's1',
        name: 'John Smith',
        email: 'john@transportpro.com',
        trustScore: 92,
        verified: true,
        memberSince: '2022-01-15',
        completedDeals: 12
      },
      yearsActive: 8,
      fleetSize: 15,
      safetyRating: 'satisfactory',
      insuranceStatus: 'active',
      operationType: ['Dry Van', 'Interstate', 'Intrastate'],
      submittedAt: '2 hours ago',
      documentsCount: 5,
      verifiedDocuments: 4
    },
    {
      id: '2',
      mcNumber: '789012',
      title: 'Reefer Authority with Regional Routes',
      description: 'Established reefer operation serving the Midwest. Strong customer base, excellent compliance history.',
      price: 62000,
      isPremium: true,
      premiumPriceSent: true,
      premiumPrice: 299,
      premiumPriceAccepted: false,
      seller: {
        id: 's2',
        name: 'Sarah Johnson',
        email: 'sarah@coldchain.com',
        trustScore: 88,
        verified: true,
        memberSince: '2021-06-20',
        completedDeals: 18
      },
      yearsActive: 12,
      fleetSize: 22,
      safetyRating: 'satisfactory',
      insuranceStatus: 'active',
      operationType: ['Reefer', 'Regional', 'Interstate'],
      submittedAt: '5 hours ago',
      documentsCount: 6,
      verifiedDocuments: 6
    },
    {
      id: '3',
      mcNumber: '345678',
      title: 'Flatbed & Heavy Haul Specialist',
      description: 'Specialized flatbed and heavy haul authority. All permits and bonding in place. Strong reputation.',
      price: 78000,
      isPremium: false,
      seller: {
        id: 's3',
        name: 'Mike Williams',
        email: 'mike@heavyhaul.com',
        trustScore: 75,
        verified: false,
        memberSince: '2023-03-10',
        completedDeals: 3
      },
      yearsActive: 15,
      fleetSize: 18,
      safetyRating: 'satisfactory',
      insuranceStatus: 'active',
      operationType: ['Flatbed', 'Heavy Haul', 'Oversized', 'Interstate'],
      submittedAt: '1 day ago',
      documentsCount: 4,
      verifiedDocuments: 2
    },
    {
      id: '4',
      mcNumber: '567890',
      title: 'Growing LTL Authority - West Coast',
      description: 'Less-than-truckload authority with established West Coast routes. Clean safety record.',
      price: 38000,
      isPremium: true,
      premiumPriceSent: true,
      premiumPrice: 199,
      premiumPriceAccepted: true,
      seller: {
        id: 's4',
        name: 'David Chen',
        email: 'david@westcoastltl.com',
        trustScore: 85,
        verified: true,
        memberSince: '2022-08-05',
        completedDeals: 8
      },
      yearsActive: 5,
      fleetSize: 8,
      safetyRating: 'satisfactory',
      insuranceStatus: 'active',
      operationType: ['LTL', 'Regional', 'Dry Van'],
      submittedAt: '3 days ago',
      documentsCount: 5,
      verifiedDocuments: 5
    },
    {
      id: '5',
      mcNumber: '901234',
      title: 'Box Truck Authority - Local Delivery',
      description: 'Local delivery authority with box trucks. Great for Amazon and other delivery contracts.',
      price: 28000,
      isPremium: false,
      seller: {
        id: 's5',
        name: 'Lisa Anderson',
        email: 'lisa@localdelivery.com',
        trustScore: 70,
        verified: false,
        memberSince: '2023-11-20',
        completedDeals: 1
      },
      yearsActive: 4,
      fleetSize: 12,
      safetyRating: 'satisfactory',
      insuranceStatus: 'pending',
      operationType: ['Box Truck', 'Local', 'Intrastate'],
      submittedAt: '4 days ago',
      documentsCount: 3,
      verifiedDocuments: 1
    },
    {
      id: '6',
      mcNumber: '234567',
      title: 'Tanker Authority - Hazmat Certified',
      description: 'Tanker authority with full hazmat certification. Excellent safety record and compliance.',
      price: 85000,
      isPremium: true,
      premiumPriceSent: false,
      seller: {
        id: 's6',
        name: 'Robert Martinez',
        email: 'robert@hazmattanker.com',
        trustScore: 90,
        verified: true,
        memberSince: '2020-04-12',
        completedDeals: 25
      },
      yearsActive: 10,
      fleetSize: 14,
      safetyRating: 'satisfactory',
      insuranceStatus: 'active',
      operationType: ['Tanker', 'Hazmat', 'Interstate'],
      submittedAt: '6 hours ago',
      documentsCount: 8,
      verifiedDocuments: 7
    }
  ])

  const filteredListings = pendingListings.filter(listing => {
    const matchesSearch =
      listing.mcNumber.includes(searchTerm) ||
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getPremiumStatus = (listing: PendingListing) => {
    if (!listing.isPremium) return null
    if (listing.premiumPriceAccepted) {
      return { status: 'accepted', label: 'Premium Paid', color: 'text-trust-high' }
    }
    if (listing.premiumPriceSent) {
      return { status: 'pending', label: `Premium: ${formatPrice(listing.premiumPrice || 0)} (Pending)`, color: 'text-yellow-400' }
    }
    return { status: 'not-sent', label: 'Premium - Price Not Sent', color: 'text-orange-400' }
  }

  const handleSendPremiumPrice = () => {
    if (selectedListing && premiumPrice) {
      setPendingListings(prev => prev.map(l =>
        l.id === selectedListing.id
          ? { ...l, premiumPriceSent: true, premiumPrice: Number(premiumPrice) }
          : l
      ))
      setShowPremiumPriceModal(false)
      setPremiumPrice('')
      setPremiumMessage('')
      setSelectedListing(null)
      alert(`Premium price of ${formatPrice(Number(premiumPrice))} sent to ${selectedListing.seller.name}`)
    }
  }

  const handleApprove = () => {
    if (selectedListing) {
      setPendingListings(prev => prev.filter(l => l.id !== selectedListing.id))
      setShowApproveModal(false)
      setApprovalNotes('')
      setSelectedListing(null)
      alert(`Listing MC #${selectedListing.mcNumber} has been approved and is now live!`)
    }
  }

  const handleReject = () => {
    if (selectedListing && rejectionReason) {
      setPendingListings(prev => prev.filter(l => l.id !== selectedListing.id))
      setShowRejectModal(false)
      setRejectionReason('')
      setSelectedListing(null)
      alert(`Listing MC #${selectedListing.mcNumber} has been rejected. Seller has been notified.`)
    }
  }

  const stats = [
    {
      icon: Clock,
      label: 'Total Pending',
      value: pendingListings.length,
      color: 'text-yellow-400'
    },
    {
      icon: Crown,
      label: 'Premium Listings',
      value: pendingListings.filter(l => l.isPremium).length,
      color: 'text-purple-400'
    },
    {
      icon: DollarSign,
      label: 'Premium Price Pending',
      value: pendingListings.filter(l => l.isPremium && l.premiumPriceSent && !l.premiumPriceAccepted).length,
      color: 'text-orange-400'
    },
    {
      icon: CheckCircle,
      label: 'Ready to Approve',
      value: pendingListings.filter(l => !l.isPremium || l.premiumPriceAccepted).length,
      color: 'text-trust-high'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pending Review</h1>
          <p className="text-white/60">Review and approve MC listings pending verification</p>
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
                <div className="text-white/60 text-sm">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search by MC number, title, or seller name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Pending Listings */}
        <div className="space-y-4">
          {filteredListings.map((listing) => {
            const premiumStatus = getPremiumStatus(listing)
            const canApprove = !listing.isPremium || listing.premiumPriceAccepted

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GlassCard hover>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Header Row */}
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold">MC #{listing.mcNumber}</h3>
                        <span className="glass-subtle px-3 py-1 rounded-full text-xs text-yellow-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                        {listing.isPremium && (
                          <span className="px-3 py-1 rounded-full text-xs bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/30 text-purple-300 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Premium MC
                          </span>
                        )}
                        {premiumStatus && (
                          <span className={`glass-subtle px-3 py-1 rounded-full text-xs ${premiumStatus.color}`}>
                            {premiumStatus.label}
                          </span>
                        )}
                      </div>

                      <p className="text-white/80 mb-2">{listing.title}</p>
                      <p className="text-sm text-white/60 mb-4">{listing.description}</p>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="glass-subtle rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-1">Years Active</div>
                          <div className="font-semibold flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-primary-400" />
                            {listing.yearsActive}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-1">Fleet Size</div>
                          <div className="font-semibold flex items-center gap-1">
                            <TruckIcon className="w-4 h-4 text-primary-400" />
                            {listing.fleetSize}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-1">Safety</div>
                          <div className="font-semibold capitalize text-sm">
                            {listing.safetyRating.replace('-', ' ')}
                          </div>
                        </div>
                        <div className="glass-subtle rounded-lg p-3">
                          <div className="text-xs text-white/60 mb-1">Documents</div>
                          <div className="font-semibold text-sm">
                            {listing.verifiedDocuments}/{listing.documentsCount} verified
                          </div>
                        </div>
                      </div>

                      {/* Seller Info */}
                      <div className="flex items-center gap-3 glass-subtle rounded-lg p-3">
                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                          <span className="font-bold text-primary-400">
                            {listing.seller.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{listing.seller.name}</div>
                          <div className="text-xs text-white/60">{listing.seller.email}</div>
                        </div>
                        <TrustBadge
                          score={listing.seller.trustScore}
                          level={getTrustLevel(listing.seller.trustScore)}
                          verified={listing.seller.verified}
                          size="sm"
                        />
                        <div className="text-right text-sm">
                          <div className="text-white/60">{listing.seller.completedDeals} deals</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-primary-400">
                        {formatPrice(listing.price)}
                      </div>
                      <div className="text-xs text-white/60 mt-1">Listing Price</div>
                      <div className="text-xs text-white/40 mt-2">
                        Submitted {listing.submittedAt}
                      </div>
                    </div>
                  </div>

                  {/* Operation Types */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.operationType.map((type) => (
                      <span
                        key={type}
                        className="glass-subtle px-3 py-1 rounded-full text-xs"
                      >
                        {type}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/admin/review/${listing.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>

                    {listing.isPremium && !listing.premiumPriceSent && (
                      <Button
                        variant="secondary"
                        className="border-purple-400/50 hover:bg-purple-500/20"
                        onClick={() => {
                          setSelectedListing(listing)
                          setShowPremiumPriceModal(true)
                        }}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Send Premium Price
                      </Button>
                    )}

                    {listing.isPremium && listing.premiumPriceSent && !listing.premiumPriceAccepted && (
                      <Button
                        variant="ghost"
                        className="text-yellow-400 border border-yellow-400/30"
                        disabled
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Awaiting Payment
                      </Button>
                    )}

                    <Button
                      onClick={() => {
                        setSelectedListing(listing)
                        setShowApproveModal(true)
                      }}
                      disabled={!canApprove}
                      className={!canApprove ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>

                    <Button
                      variant="danger"
                      onClick={() => {
                        setSelectedListing(listing)
                        setShowRejectModal(true)
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>

                  {!canApprove && (
                    <p className="text-xs text-yellow-400 mt-3">
                      * Premium listing requires payment before approval
                    </p>
                  )}
                </GlassCard>
              </motion.div>
            )
          })}

          {filteredListings.length === 0 && (
            <GlassCard>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No pending listings</h3>
                <p className="text-white/60">All listings have been reviewed</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* Premium Price Modal */}
      <AnimatePresence>
        {showPremiumPriceModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPremiumPriceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30">
                    <Crown className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Set Premium Price</h3>
                </div>
                <button
                  onClick={() => setShowPremiumPriceModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="glass-subtle rounded-lg p-4 mb-6">
                <div className="text-sm text-white/60 mb-1">Listing</div>
                <div className="font-semibold">MC #{selectedListing.mcNumber}</div>
                <div className="text-white/80 text-sm mt-1">{selectedListing.title}</div>
                <div className="text-sm text-white/60 mt-2">
                  Seller: {selectedListing.seller.name}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <Input
                  label="Premium Price ($)"
                  type="number"
                  placeholder="Enter premium fee amount..."
                  value={premiumPrice}
                  onChange={(e) => setPremiumPrice(e.target.value)}
                  icon={<DollarSign className="w-4 h-4" />}
                />

                <Textarea
                  label="Message to Seller (Optional)"
                  placeholder="Add a personalized message explaining the premium benefits..."
                  value={premiumMessage}
                  onChange={(e) => setPremiumMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="text-sm text-white/60 mb-6 glass-subtle rounded-lg p-3">
                <Star className="w-4 h-4 inline mr-2 text-yellow-400" />
                Premium MC listings receive enhanced visibility, priority placement, and verified badge on the marketplace.
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowPremiumPriceModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  fullWidth
                  onClick={handleSendPremiumPrice}
                  disabled={!premiumPrice}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Price to Seller
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {showApproveModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowApproveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-trust-high/20">
                    <CheckCircle className="w-6 h-6 text-trust-high" />
                  </div>
                  <h3 className="text-xl font-bold">Approve Listing</h3>
                </div>
                <button
                  onClick={() => setShowApproveModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="glass-subtle rounded-lg p-4 mb-6">
                <div className="text-sm text-white/60 mb-1">Listing</div>
                <div className="font-semibold">MC #{selectedListing.mcNumber}</div>
                <div className="text-white/80 text-sm mt-1">{selectedListing.title}</div>
                <div className="text-primary-400 font-bold mt-2">
                  {formatPrice(selectedListing.price)}
                </div>
              </div>

              <Textarea
                label="Approval Notes (Internal)"
                placeholder="Add any internal notes about this approval..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                rows={3}
              />

              <p className="text-sm text-white/60 my-4">
                <Shield className="w-4 h-4 inline mr-2 text-trust-high" />
                This listing will be immediately visible on the marketplace after approval.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancel
                </Button>
                <Button fullWidth onClick={handleApprove}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Listing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-strong rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold">Reject Listing</h3>
                </div>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="glass-subtle rounded-lg p-4 mb-6">
                <div className="text-sm text-white/60 mb-1">Listing</div>
                <div className="font-semibold">MC #{selectedListing.mcNumber}</div>
                <div className="text-white/80 text-sm mt-1">{selectedListing.title}</div>
                <div className="text-sm text-white/60 mt-2">
                  Seller: {selectedListing.seller.name}
                </div>
              </div>

              <Textarea
                label="Rejection Reason (Required)"
                placeholder="Explain why this listing is being rejected. This will be sent to the seller..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />

              <p className="text-sm text-red-400/80 my-4">
                The seller will be notified of this rejection with your explanation.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Listing
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPendingReviewPage
