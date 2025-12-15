export type UserRole = 'buyer' | 'seller' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  verified: boolean
  trustScore: number
  memberSince: Date
  completedDeals: number
  reviews: Review[]
}

export type TrustLevel = 'high' | 'medium' | 'low'

export type AmazonStatus = 'active' | 'pending' | 'suspended' | 'none'
export type AmazonRelayScore = 'A' | 'B' | 'C' | 'D' | 'F' | null

export interface MCListing {
  id: string
  mcNumber: string
  sellerId: string
  seller: User
  title: string
  description: string
  price: number

  // Trust & Verification
  trustScore: number
  trustLevel: TrustLevel
  verified: boolean
  verificationBadges: string[]

  // MC Details
  yearsActive: number
  operationType: string[]
  fleetSize: number
  safetyRating: 'satisfactory' | 'conditional' | 'unsatisfactory' | 'not-rated'
  insuranceStatus: 'active' | 'expired' | 'pending'

  // Location
  state: string

  // Platform Integrations
  amazonStatus: AmazonStatus
  amazonRelayScore: AmazonRelayScore
  highwaySetup: boolean

  // What's Included
  sellingWithEmail: boolean
  sellingWithPhone: boolean

  // Premium listing
  isPremium: boolean

  // Documents
  documents: Document[]

  // Status
  status: 'active' | 'pending-verification' | 'sold' | 'reserved' | 'suspended'
  visibility: 'public' | 'private' | 'unlisted'

  // Metadata
  views: number
  saves: number
  createdAt: Date
  updatedAt: Date
  soldAt?: Date
}

export interface Document {
  id: string
  name: string
  type: 'insurance' | 'ucc-filing' | 'authority' | 'safety-record' | 'other'
  url: string
  uploadedAt: Date
  verified: boolean
}

export interface Review {
  id: string
  fromUserId: string
  fromUser: User
  toUserId: string
  rating: number
  comment: string
  dealId: string
  createdAt: Date
}

export interface Offer {
  id: string
  listingId: string
  listing: MCListing
  buyerId: string
  buyer: User
  amount: number
  message: string
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired'
  escrowStatus?: 'pending' | 'deposited' | 'released' | 'refunded'
  createdAt: Date
  expiresAt: Date
}

export interface SavedListing {
  id: string
  userId: string
  listingId: string
  listing: MCListing
  notes?: string
  savedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'offer' | 'message' | 'verification' | 'review' | 'deal' | 'system'
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: Date
}

export interface FilterOptions {
  priceMin?: number
  priceMax?: number
  yearsActiveMin?: number
  operationTypes?: string[]
  safetyRating?: string[]
  trustLevel?: TrustLevel[]
  verified?: boolean
  // New filters
  state?: string
  amazonStatus?: AmazonStatus | 'all'
  hasHighway?: boolean
  hasEmail?: boolean
  hasPhone?: boolean
  isPremium?: boolean
  sortBy?: 'price-asc' | 'price-desc' | 'trust-score' | 'newest' | 'oldest' | 'years-active'
}

export interface MCInquiry {
  id: string
  listingId: string
  mcNumber: string
  userId: string
  userName: string
  userEmail: string
  userPhone?: string
  message: string
  status: 'new' | 'in-progress' | 'responded' | 'closed'
  adminNotes?: string
  createdAt: Date
  updatedAt: Date
  responses: MCInquiryResponse[]
}

export interface MCInquiryResponse {
  id: string
  inquiryId: string
  adminId: string
  adminName: string
  message: string
  createdAt: Date
}

// Unlocked MC - when buyer uses credits to unlock a listing
export interface UnlockedMC {
  id: string
  listingId: string
  listing: MCListing
  buyerId: string
  unlockedAt: Date
  creditsUsed: number
  offer?: TransactionOffer
}

// Transaction Offer - formal offer from buyer to seller
export type OfferStatus = 'pending' | 'admin-approved' | 'admin-rejected' | 'deposit-pending' | 'deposit-paid' | 'in-transaction' | 'completed' | 'cancelled'

export interface TransactionOffer {
  id: string
  listingId: string
  listing: MCListing
  buyerId: string
  buyer: User
  sellerId: string
  seller: User
  offerAmount: number
  message: string
  status: OfferStatus
  adminNotes?: string
  depositAmount: number
  depositPaid: boolean
  depositPaidAt?: Date
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

// Transaction Room - the "round table" where buyer, seller, and admin collaborate
export type TransactionStatus =
  | 'awaiting-deposit'
  | 'deposit-received'
  | 'in-review'
  | 'buyer-approved'
  | 'seller-approved'
  | 'both-approved'
  | 'admin-final-review'
  | 'payment-pending'
  | 'payment-received'
  | 'completed'
  | 'cancelled'
  | 'disputed'

export interface TransactionRoom {
  id: string
  offerId: string
  offer: TransactionOffer
  listingId: string
  listing: MCListing
  buyerId: string
  buyer: User
  sellerId: string
  seller: User

  // Transaction Status
  status: TransactionStatus

  // Approvals
  buyerApproved: boolean
  buyerApprovedAt?: Date
  sellerApproved: boolean
  sellerApprovedAt?: Date
  adminApproved: boolean
  adminApprovedAt?: Date

  // Financial
  agreedPrice: number
  depositAmount: number
  depositPaid: boolean
  depositPaidAt?: Date
  finalPaymentAmount: number
  finalPaymentPaid: boolean
  finalPaymentPaidAt?: Date
  paymentInstructions?: string

  // Documents shared in transaction
  sellerDocuments: TransactionDocument[]

  // Communication
  messages: TransactionMessage[]

  // Timeline
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface TransactionDocument {
  id: string
  transactionId: string
  uploadedBy: 'buyer' | 'seller' | 'admin'
  uploaderId: string
  name: string
  type: string
  url: string
  verified: boolean
  uploadedAt: Date
}

export interface TransactionMessage {
  id: string
  transactionId: string
  senderId: string
  senderName: string
  senderRole: 'buyer' | 'seller' | 'admin'
  message: string
  isSystemMessage: boolean
  createdAt: Date
}

// Buyer Credits
export interface BuyerCredits {
  userId: string
  totalCredits: number
  usedCredits: number
  availableCredits: number
  creditHistory: CreditTransaction[]
}

export interface CreditTransaction {
  id: string
  userId: string
  amount: number
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  description: string
  relatedListingId?: string
  createdAt: Date
}
