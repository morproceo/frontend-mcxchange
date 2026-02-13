/**
 * API Response Types
 * Properly typed interfaces to replace 'any' in API responses
 */

// Base API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

// Pagination
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User Types
export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  phone?: string;
  company?: string;
  avatar?: string;
  isVerified: boolean;
  emailVerified: boolean;
  credits: number;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Listing Types
export interface ApiListing {
  id: string;
  mcNumber: string;
  dotNumber: string;
  legalName: string;
  dbaName?: string;
  title: string;
  description?: string;
  askingPrice: number;
  listingPrice?: number;
  city: string;
  state: string;
  address?: string;
  yearsActive?: number;
  fleetSize?: number;
  totalDrivers?: number;
  safetyRating?: string;
  insuranceOnFile?: boolean;
  bipdCoverage?: number;
  cargoCoverage?: number;
  bondAmount?: number;
  amazonStatus?: string;
  amazonRelayScore?: string;
  highwaySetup?: boolean;
  sellingWithEmail?: boolean;
  sellingWithPhone?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  cargoTypes?: string[];
  status: string;
  visibility?: string;
  isPremium?: boolean;
  isVerified?: boolean;
  sellerId: string;
  seller?: ApiUser;
  createdAt: string;
  updatedAt: string;
}

// Offer Types
export interface ApiOffer {
  id: string;
  listingId: string;
  buyerId: string;
  amount: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired' | 'withdrawn';
  expiresAt?: string;
  listing?: ApiListing;
  buyer?: ApiUser;
  createdAt: string;
  updatedAt: string;
}

// Transaction Types
export interface ApiTransaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  offerId?: string;
  status: string;
  agreedPrice: number;
  depositAmount?: number;
  depositPaid?: boolean;
  platformFee?: number;
  buyerPaid?: boolean;
  sellerPaid?: boolean;
  completedAt?: string;
  listing?: ApiListing;
  buyer?: ApiUser;
  seller?: ApiUser;
  documents?: ApiDocument[];
  messages?: ApiMessage[];
  createdAt: string;
  updatedAt: string;
}

// Document Types
export interface ApiDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  uploadedBy: string;
  uploadedAt: string;
}

// Message Types
export interface ApiMessage {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  senderRole?: string;
  createdAt: string;
}

// FMCSA Types
export interface ApiFMCSAData {
  carrier: FMCSACarrier;
  authority: FMCSAAuthority;
  insurance: FMCSAInsurance[];
}

export interface FMCSACarrier {
  dotNumber: string;
  mcNumber?: string;
  legalName: string;
  dbaName?: string;
  carrierOperation: string;
  hqCity: string;
  hqState: string;
  physicalAddress: string;
  phone: string;
  safetyRating: string;
  safetyRatingDate?: string;
  totalDrivers: number;
  totalPowerUnits: number;
  mcs150Date?: string;
  allowedToOperate: string;
  insuranceOnFile: boolean;
  cargoTypes: string[];
  // Inspection data
  driverInsp?: number;
  driverOosInsp?: number;
  driverOosRate?: number;
  vehicleInsp?: number;
  vehicleOosInsp?: number;
  vehicleOosRate?: number;
  // BASIC scores
  unsafeDrivingBasic?: number;
  hoursOfServiceBasic?: number;
  vehicleMaintenanceBasic?: number;
  crashIndicatorBasic?: number;
  // Crash data
  crashTotal?: number;
  fatalCrash?: number;
  injuryCrash?: number;
}

export interface FMCSAAuthority {
  commonAuthorityStatus: string;
  commonAuthorityGrantDate?: string;
  contractAuthorityStatus?: string;
  brokerAuthorityStatus?: string;
}

export interface FMCSAInsurance {
  insurerName: string;
  policyNumber: string;
  insuranceType: string;
  coverageAmount: number;
  effectiveDate: string;
  cancellationDate?: string;
  status: string;
}

// Creditsafe Types
export interface ApiCreditsafeReport {
  companyId: string;
  companyName: string;
  creditScore?: number;
  creditRating?: string;
  creditLimit?: number;
  riskLevel?: string;
  financials?: CreditsafeFinancial[];
  directors?: CreditsafeDirector[];
  shareCapital?: {
    shareholders: CreditsafeShareholder[];
  };
  commentaries?: CreditsafeCommentary[];
  branchOffices?: CreditsafeBranch[];
}

export interface CreditsafeFinancial {
  year: number;
  revenue?: number;
  profit?: number;
  assets?: number;
  liabilities?: number;
}

export interface CreditsafeDirector {
  name: string;
  title?: string;
  positions?: CreditsafePosition[];
}

export interface CreditsafePosition {
  title: string;
  startDate?: string;
}

export interface CreditsafeShareholder {
  name: string;
  sharePercentage?: number;
}

export interface CreditsafeCommentary {
  type: string;
  text: string;
  date?: string;
}

export interface CreditsafeBranch {
  name: string;
  address?: string;
  city?: string;
  state?: string;
}

// Due Diligence Types
export interface ApiDueDiligenceReport {
  id: string;
  listingId: string;
  status: string;
  riskScore?: number;
  riskLevel?: string;
  recommendations?: string[];
  fullReport?: Record<string, unknown>;
  createdAt: string;
}

// Consultation Types
export interface ApiConsultation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  type: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dispute Types
export interface ApiDispute {
  id: string;
  transactionId?: string;
  userId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'under_review' | 'resolved' | 'rejected';
  resolution?: string;
  user?: ApiUser;
  createdAt: string;
  updatedAt: string;
}

// Activity Log Types
export interface ApiActivityLog {
  id: string;
  userId: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  user?: ApiUser;
  createdAt: string;
}

// Unlocked MC Types
export interface ApiUnlockedMC {
  id: string;
  listingId: string;
  userId: string;
  viewCount: number;
  listing?: ApiListing;
  createdAt: string;
}

// Credit Transaction Types
export interface ApiCreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'spend' | 'refund' | 'adjustment';
  description?: string;
  referenceId?: string;
  createdAt: string;
}

// Subscription Types
export interface ApiSubscription {
  id: string;
  userId: string;
  plan: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

// Platform Settings Types
export interface ApiPlatformSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  listingFee: number;
  premiumListingFee: number;
  transactionFeePercent: number;
  depositPercent: number;
  minDeposit: number;
  maxDeposit: number;
}

// Icon type for Lucide React
export type LucideIcon = React.ComponentType<{ className?: string; size?: number }>;

// Error handling helper type
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

// Helper function to extract error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
