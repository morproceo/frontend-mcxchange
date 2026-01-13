export type UserRole = 'buyer' | 'seller' | 'admin'

// ============================================
// API Response Types (matching backend structure)
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: ValidationError[]
  pagination?: PaginationInfo
}

export interface ValidationError {
  field: string
  message: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Auth API Response Types
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn?: string
}

export interface AuthLoginResponse {
  user: UserResponse
  tokens: AuthTokens
}

export interface AuthRegisterResponse {
  user: UserResponse
  tokens: AuthTokens
}

export interface UserResponse {
  id: string
  email: string
  name: string
  role: string
  verified: boolean
  emailVerified: boolean
  trustScore: number
  memberSince: string
  avatar?: string
  totalCredits: number
  usedCredits: number
}

// Subscription Types
export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAST_DUE' | 'INCOMPLETE'

export interface SubscriptionInfo {
  id: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  creditsPerMonth: number
  creditsRemaining: number
  startDate: string
  endDate: string
  renewalDate: string
  isYearly: boolean
}

export interface CreditsInfo {
  total: number
  used: number
  available: number
}

export interface SubscriptionResponse {
  subscription: SubscriptionInfo | null
  credits: CreditsInfo
  recentTransactions: CreditTransaction[]
}

export interface CheckoutSessionResponse {
  sessionId: string
  url: string
}

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
  totalCredits?: number
  usedCredits?: number
}

export type TrustLevel = 'high' | 'medium' | 'low'

export type AmazonStatus = 'active' | 'pending' | 'suspended' | 'none'
export type AmazonRelayScore = 'A' | 'B' | 'C' | 'D' | 'F' | null

// Safety Rating enum for type safety
export type SafetyRating = 'satisfactory' | 'conditional' | 'unsatisfactory' | 'not-rated'

// Listing status enum
export type ListingStatus = 'active' | 'pending-verification' | 'sold' | 'reserved' | 'suspended'

// Listing visibility enum
export type ListingVisibility = 'public' | 'private' | 'unlisted'

// Insurance status enum
export type InsuranceStatus = 'active' | 'expired' | 'pending'

export interface MCListing {
  id: string
  mcNumber: string
  sellerId: string
  seller: User
  title: string
  description: string
  askingPrice?: number     // Seller's requested price
  listingPrice?: number    // Admin-set published price (shown to buyers)
  price?: number           // Legacy field - use listingPrice || askingPrice

  // Trust & Verification
  trustScore: number
  trustLevel: TrustLevel
  verified: boolean
  verificationBadges: string[]

  // MC Details
  yearsActive: number
  operationType: string[]
  fleetSize: number
  safetyRating: SafetyRating
  insuranceStatus: InsuranceStatus

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
  status: ListingStatus
  visibility: ListingVisibility

  // Metadata
  views: number
  saves: number
  createdAt: Date
  updatedAt: Date
  soldAt?: Date
}

// Extended listing details from backend (includes FMCSA data)
export interface MCListingExtended extends MCListing {
  // FMCSA / DOT data
  dotNumber: string
  legalName: string
  dbaName: string
  city: string
  address: string
  totalDrivers: number

  // Insurance details
  bipdCoverage?: number
  cargoCoverage?: number
  bondAmount?: number
  insuranceOnFile: boolean

  // Contact info
  contactEmail: string
  contactPhone: string

  // Safety
  saferScore: string

  // Raw data from FMCSA API (JSON stringified)
  fmcsaData?: string
  cargoTypes?: string

  // Unlock/ownership status (set by backend based on authenticated user)
  isUnlocked: boolean
  isSaved: boolean
  isOwner: boolean
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

// ============================================
// Pricing Configuration Types
// ============================================

export interface SubscriptionPlanConfig {
  name: string
  credits: number
  priceMonthly: number
  priceYearly: number
  stripePriceIdMonthly: string
  stripePriceIdYearly: string
  features: string[]
}

export interface CreditPack {
  id: string
  credits: number
  price: number
  stripePriceId: string
}

export interface PlatformFeesConfig {
  listingFee: number
  premiumListingFee: number
  transactionFeePercentage: number
  depositPercentage: number
  minDeposit: number
  maxDeposit: number
  consultationFee?: number
}

export interface PricingConfig {
  subscriptionPlans: {
    starter: SubscriptionPlanConfig
    professional: SubscriptionPlanConfig
    enterprise: SubscriptionPlanConfig
  }
  platformFees: PlatformFeesConfig
  creditPacks: CreditPack[]
}

// ============================================
// FMCSA Data Types
// ============================================

export interface FMCSACarrierData {
  dotNumber: string
  mcNumber?: string
  legalName: string
  dbaName?: string
  carrierOperation: string
  hqCity: string
  hqState: string
  physicalAddress: string
  phone: string
  safetyRating: string
  safetyRatingDate?: string
  totalDrivers: number
  totalPowerUnits: number
  mcs150Date?: string
  allowedToOperate: string
  bipdRequired: number
  cargoRequired: number
  bondRequired: number
  insuranceOnFile: boolean
  bipdOnFile: number
  cargoOnFile: number
  bondOnFile: number
  cargoTypes: string[]
  // Inspection Data (from FMCSA carrier endpoint)
  driverInsp: number
  driverOosInsp: number
  driverOosRate: number
  vehicleInsp: number
  vehicleOosInsp: number
  vehicleOosRate: number
  hazmatInsp: number
  hazmatOosInsp: number
  hazmatOosRate: number
  // Crash Data
  crashTotal: number
  fatalCrash: number
  injuryCrash: number
  towCrash: number
  // BASIC Scores
  unsafeDrivingBasic: number
  hoursOfServiceBasic: number
  driverFitnessBasic: number
  controlledSubstancesBasic: number
  vehicleMaintenanceBasic: number
  hazmatBasic: number
  crashIndicatorBasic: number
}

export interface FMCSAAuthorityHistory {
  commonAuthorityStatus: string
  commonAuthorityGrantDate?: string
  commonAuthorityReinstatedDate?: string
  commonAuthorityRevokedDate?: string
  contractAuthorityStatus: string
  contractAuthorityGrantDate?: string
  brokerAuthorityStatus: string
  brokerAuthorityGrantDate?: string
}

export interface FMCSAInsuranceHistory {
  insurerName: string
  policyNumber: string
  insuranceType: string
  coverageAmount: number
  effectiveDate: string
  cancellationDate?: string
  status: string
}

export interface FMCSASnapshot {
  carrier: FMCSACarrierData | null
  authority: FMCSAAuthorityHistory | null
  insurance: FMCSAInsuranceHistory[] | null
}

// SMS (Safety Measurement System) Types
export interface FMCSASMSBasic {
  basicName: string
  basicCode: string
  percentile: number
  totalInspections: number
  totalViolations: number
  oosInspections: number
  oosRate: number
  thresholdPercent: number
  exceedsThreshold: boolean
}

export interface FMCSASMSData {
  dotNumber: string
  totalInspections: number
  totalDriverInspections: number
  totalVehicleInspections: number
  totalHazmatInspections: number
  totalIepInspections: number
  driverOosRate: number
  vehicleOosRate: number
  driverOosInspections: number
  vehicleOosInspections: number
  totalCrashes: number
  fatalCrashes: number
  injuryCrashes: number
  towCrashes: number
  basics: FMCSASMSBasic[]
  safetyRating: string
  safetyRatingDate?: string
  snapshotDate?: string
}

// ============================================
// Stripe Transaction Types
// ============================================

export interface StripeTransaction {
  id: string
  type: 'payment_intent' | 'checkout_session' | 'charge'
  amount: number
  amountFormatted: string
  currency: string
  status: string
  created: number
  createdDate: string
  description: string | null
  customer: {
    id: string | null
    email: string | null
    name: string | null
    phone: string | null
  }
  billing: {
    name: string | null
    email: string | null
    phone: string | null
    address: {
      line1: string | null
      line2: string | null
      city: string | null
      state: string | null
      postalCode: string | null
      country: string | null
    } | null
  }
  paymentMethod: {
    type: string | null
    brand: string | null
    last4: string | null
    expMonth: number | null
    expYear: number | null
    cardholderName: string | null
  } | null
  // User verification - matches cardholder against platform user
  matchedUser: {
    id: string
    name: string
    email: string
  } | null
  nameMatchStatus: 'match' | 'partial' | 'mismatch' | 'unknown'
  metadata: Record<string, string>
  receiptUrl: string | null
  refunded: boolean
  refundedAmount: number
}
