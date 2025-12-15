import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Building2,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Upload,
  Download,
  Send,
  AlertCircle,
  X,
  User,
  Crown,
  Lock,
  Unlock,
  Eye,
  CreditCard,
  ArrowRight,
  Check,
  XCircle,
  Loader2,
  MapPin,
  Calendar,
  Truck,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
  AlertTriangle,
  Package,
  Star,
  Hash,
  Briefcase,
  FileCheck,
  Scale,
  Banknote,
  Receipt,
  Info,
  ArrowLeft,
  BadgeCheck,
  ClipboardCheck,
  History,
  UserCheck,
  Target,
  Layers,
  ExternalLink,
  ShieldCheck,
  ScrollText,
  Handshake,
  CircleDollarSign,
  CheckCheck,
  EyeOff,
  Settings
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { TransactionRoom, TransactionStatus, TransactionMessage, TransactionDocument } from '../types'

// Transaction workflow steps for buyer
type BuyerStep =
  | 'confirm-intent'      // Step 1: Confirm purchase intent
  | 'terms-agreement'     // Step 2: Accept terms & disclaimer
  | 'deposit-payment'     // Step 3: Pay deposit via Stripe
  | 'awaiting-admin'      // Step 4: Wait for admin approval
  | 'bill-of-sale'        // Step 5: Review & approve bill of sale
  | 'final-payment'       // Step 6: Pay remaining balance
  | 'completed'           // Step 7: Transaction complete

const TransactionRoomPage = () => {
  const { transactionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [activeTab, setActiveTab] = useState<'timeline' | 'parties' | 'business' | 'documents' | 'financials' | 'messages'>('timeline')
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [approving, setApproving] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDocumentPreview, setShowDocumentPreview] = useState<string | null>(null)

  // Buyer workflow state
  const [buyerStep, setBuyerStep] = useState<BuyerStep>('confirm-intent')
  const [intentConfirmed, setIntentConfirmed] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [billingName, setBillingName] = useState('')

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'zelle'>('card')
  const [zelleSentConfirmed, setZelleSentConfirmed] = useState(false)

  // Comprehensive mock transaction data
  const [transaction, setTransaction] = useState<TransactionRoom & {
    businessDetails: {
      legalName: string
      dba: string
      einNumber: string
      dotNumber: string
      mcNumber: string
      businessAddress: string
      mailingAddress: string
      phoneNumber: string
      faxNumber: string
      email: string
      website: string
      entityType: string
      stateOfIncorporation: string
      dateEstablished: Date
      operatingStatus: string
      cargoTypes: string[]
      operationClassification: string[]
      equipmentTypes: string[]
      radius: string
      hazmatCertified: boolean
      bondedCarrier: boolean
    }
    safetyRecord: {
      saferScore: string
      crashRate: number
      inspectionRate: number
      outOfServiceRate: number
      driverOutOfServiceRate: number
      hazmatOutOfServiceRate: number
      lastInspectionDate: Date
      totalInspections: number
      totalCrashes: number
      fatalCrashes: number
      injuryCrashes: number
      towCrashes: number
      basicScores: {
        unsafeDriving: number
        hoursOfService: number
        driverFitness: number
        controlledSubstances: number
        vehicleMaintenance: number
        hazmatCompliance: number
      }
    }
    insuranceInfo: {
      liabilityInsurance: {
        provider: string
        policyNumber: string
        coverage: number
        expirationDate: Date
        status: string
      }
      cargoInsurance: {
        provider: string
        policyNumber: string
        coverage: number
        expirationDate: Date
        status: string
      }
      bondInfo: {
        type: string
        amount: number
        status: string
      }
    }
    financialHistory: {
      annualRevenue: number
      avgMonthlyLoads: number
      avgRatePerMile: number
      fuelCosts: number
      maintenanceCosts: number
      insuranceCosts: number
      outstandingDebts: number
      uccFilings: {
        id: string
        filingDate: Date
        securedParty: string
        amount: number
        status: string
      }[]
    }
    platformIntegrations: {
      amazonRelay: {
        status: string
        score: string
        loads: number
        rating: number
        memberSince: Date
      }
      highway: {
        status: string
        factoring: boolean
        quickPay: boolean
        setupDate: Date
      }
      dat: {
        status: string
        rating: number
      }
    }
    transferItems: {
      mcAuthority: boolean
      dotNumber: boolean
      emailAccounts: string[]
      phoneNumbers: string[]
      amazonRelayAccount: boolean
      highwayAccount: boolean
      factoringAgreements: boolean
      existingContracts: {
        name: string
        type: string
        transferable: boolean
      }[]
      equipment: {
        type: string
        quantity: number
        included: boolean
      }[]
    }
    driverHistory: {
      totalDrivers: number
      currentDrivers: number
      driverTurnoverRate: number
      drugTestCompliance: boolean
      lastDrugTestDate: Date
      driverQualificationFiles: boolean
      driversWithViolations: number
    }
    sellerInfo: {
      contactName: string
      contactTitle: string
      contactPhone: string
      contactEmail: string
      reasonForSelling: string
      yearsOwned: number
      transitionSupport: boolean
      transitionSupportDays: number
      sellerNotes: string
      responseTime: string
      verificationStatus: 'verified' | 'pending' | 'unverified'
      previousSales: number
      completedDeals: number
    }
    buyerInfo: {
      companyName: string
      contactName: string
      contactTitle: string
      contactPhone: string
      contactEmail: string
      intendedUse: string
      experienceYears: number
      currentMCsOwned: number
      financingStatus: string
      verificationStatus: 'verified' | 'pending' | 'unverified'
      previousPurchases: number
    }
    // Workflow tracking
    workflow: {
      currentStep: BuyerStep
      intentConfirmedAt?: Date
      termsAcceptedAt?: Date
      depositPaidAt?: Date
      depositStripeId?: string
      // Zelle payment tracking
      depositPaymentMethod?: 'card' | 'zelle'
      depositZellePending?: boolean
      depositZelleSentAt?: Date
      depositZelleConfirmedByAdmin?: boolean
      depositZelleConfirmedAt?: Date
      // Final payment Zelle tracking
      finalPaymentMethod?: 'card' | 'zelle'
      finalPaymentZellePending?: boolean
      finalPaymentZelleSentAt?: Date
      finalPaymentZelleConfirmedByAdmin?: boolean
      finalPaymentZelleConfirmedAt?: Date
      adminApprovedDepositAt?: Date
      billOfSaleGeneratedAt?: Date
      buyerApprovedBillOfSaleAt?: Date
      sellerApprovedBillOfSaleAt?: Date
      adminApprovedBillOfSaleAt?: Date
      finalPaymentPaidAt?: Date
      finalPaymentStripeId?: string
      completedAt?: Date
    }
  }>({
    id: transactionId || 'txn-123',
    offerId: 'offer-1',
    offer: {} as any,
    listingId: 'listing-1',
    listing: {
      id: 'listing-1',
      mcNumber: '123456',
      title: '7-Year Premium MC Authority',
      description: 'Clean safety record with Amazon Relay A-rating. Established carrier with excellent history.',
      price: 22000,
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
      trustScore: 95,
      verified: true
    } as any,
    buyerId: 'buyer-1',
    buyer: {
      id: 'buyer-1',
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '(555) 123-4567',
      trustScore: 92,
      verified: true,
      completedDeals: 3
    } as any,
    sellerId: 'seller-1',
    seller: {
      id: 'seller-1',
      name: 'Quick Haul LLC',
      email: 'quickhaul@example.com',
      phone: '(555) 987-6543',
      trustScore: 95,
      verified: true,
      completedDeals: 8
    } as any,
    status: 'in-review',
    buyerApproved: false,
    sellerApproved: false,
    adminApproved: false,
    agreedPrice: 20000,
    depositAmount: 1000,
    depositPaid: true,
    depositPaidAt: new Date('2024-01-15'),
    finalPaymentAmount: 19000,
    finalPaymentPaid: false,
    sellerDocuments: [
      { id: '1', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'MC Authority Certificate.pdf', type: 'authority', url: '#', verified: true, uploadedAt: new Date('2024-01-16') },
      { id: '2', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'DOT Registration.pdf', type: 'authority', url: '#', verified: true, uploadedAt: new Date('2024-01-16') },
      { id: '3', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'Insurance Certificate - Liability.pdf', type: 'insurance', url: '#', verified: true, uploadedAt: new Date('2024-01-16') },
      { id: '4', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'Insurance Certificate - Cargo.pdf', type: 'insurance', url: '#', verified: true, uploadedAt: new Date('2024-01-16') },
      { id: '5', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'FMCSA Safety Record.pdf', type: 'safety', url: '#', verified: true, uploadedAt: new Date('2024-01-16') },
      { id: '6', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'Inspection History Report.pdf', type: 'safety', url: '#', verified: true, uploadedAt: new Date('2024-01-16') },
      { id: '7', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'UCC-1 Filing Statement.pdf', type: 'financial', url: '#', verified: true, uploadedAt: new Date('2024-01-17') },
      { id: '8', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'Amazon Relay Agreement.pdf', type: 'contract', url: '#', verified: true, uploadedAt: new Date('2024-01-17') },
      { id: '9', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'Articles of Incorporation.pdf', type: 'legal', url: '#', verified: true, uploadedAt: new Date('2024-01-17') },
      { id: '10', transactionId: transactionId || '', uploadedBy: 'seller', uploaderId: 'seller-1', name: 'Operating Agreement.pdf', type: 'legal', url: '#', verified: false, uploadedAt: new Date('2024-01-17') },
      { id: '11', transactionId: transactionId || '', uploadedBy: 'admin', uploaderId: 'admin-1', name: 'Transfer Agreement Draft.pdf', type: 'transfer', url: '#', verified: false, uploadedAt: new Date('2024-01-18') },
    ],
    messages: [
      { id: '1', transactionId: transactionId || '', senderId: 'system', senderName: 'System', senderRole: 'admin', message: 'Transaction room created. Welcome to the round table!', isSystemMessage: true, createdAt: new Date('2024-01-15T10:00:00') },
      { id: '2', transactionId: transactionId || '', senderId: 'admin-1', senderName: 'Maria (Domilea)', senderRole: 'admin', message: 'Hello! I\'ll be facilitating this transaction. Please review all documents and let me know if you have any questions.', isSystemMessage: false, createdAt: new Date('2024-01-15T10:05:00') },
      { id: '3', transactionId: transactionId || '', senderId: 'seller-1', senderName: 'Quick Haul LLC', senderRole: 'seller', message: 'I\'ve uploaded all the required documents including the MC Authority, DOT registration, insurance certificates, and safety records. Let me know if you need anything else.', isSystemMessage: false, createdAt: new Date('2024-01-16T09:30:00') },
      { id: '4', transactionId: transactionId || '', senderId: 'buyer-1', senderName: 'Mike Davis', senderRole: 'buyer', message: 'Thanks! I\'m reviewing the documents now. The safety record looks great. Can you confirm the Amazon Relay account will be transferred with the MC?', isSystemMessage: false, createdAt: new Date('2024-01-16T14:20:00') },
      { id: '5', transactionId: transactionId || '', senderId: 'seller-1', senderName: 'Quick Haul LLC', senderRole: 'seller', message: 'Yes, the Amazon Relay account with A-rating will be fully transferred. I\'ll provide all login credentials after the transaction is complete.', isSystemMessage: false, createdAt: new Date('2024-01-16T15:45:00') },
      { id: '6', transactionId: transactionId || '', senderId: 'admin-1', senderName: 'Maria (Domilea)', senderRole: 'admin', message: 'I\'ve uploaded the draft transfer agreement for both parties to review. Please let me know if any changes are needed before we proceed.', isSystemMessage: false, createdAt: new Date('2024-01-18T11:00:00') },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    // Extended business details
    businessDetails: {
      legalName: 'Quick Haul Transportation LLC',
      dba: 'Quick Haul Logistics',
      einNumber: '**-***7892',
      dotNumber: '3456789',
      mcNumber: '123456',
      businessAddress: '1234 Transport Way, Jacksonville, FL 32256',
      mailingAddress: '1234 Transport Way, Jacksonville, FL 32256',
      phoneNumber: '(904) 555-1234',
      faxNumber: '(904) 555-1235',
      email: 'dispatch@quickhaul.com',
      website: 'www.quickhaul.com',
      entityType: 'Limited Liability Company',
      stateOfIncorporation: 'Florida',
      dateEstablished: new Date('2017-03-15'),
      operatingStatus: 'Authorized For Hire',
      cargoTypes: ['General Freight', 'Household Goods', 'Metal/Sheets/Coils', 'Motor Vehicles', 'Building Materials'],
      operationClassification: ['Authorized For Hire', 'Carrier', 'Interstate'],
      equipmentTypes: ['Dry Van', 'Flatbed', 'Reefer'],
      radius: 'Regional & Long Haul',
      hazmatCertified: true,
      bondedCarrier: true
    },
    safetyRecord: {
      saferScore: 'Satisfactory',
      crashRate: 0.2,
      inspectionRate: 15.5,
      outOfServiceRate: 4.2,
      driverOutOfServiceRate: 3.1,
      hazmatOutOfServiceRate: 0,
      lastInspectionDate: new Date('2024-01-10'),
      totalInspections: 47,
      totalCrashes: 1,
      fatalCrashes: 0,
      injuryCrashes: 0,
      towCrashes: 1,
      basicScores: {
        unsafeDriving: 12,
        hoursOfService: 18,
        driverFitness: 5,
        controlledSubstances: 0,
        vehicleMaintenance: 15,
        hazmatCompliance: 8
      }
    },
    insuranceInfo: {
      liabilityInsurance: {
        provider: 'Progressive Commercial',
        policyNumber: 'PGC-****5678',
        coverage: 1000000,
        expirationDate: new Date('2024-12-31'),
        status: 'Active'
      },
      cargoInsurance: {
        provider: 'Progressive Commercial',
        policyNumber: 'PGC-****5679',
        coverage: 100000,
        expirationDate: new Date('2024-12-31'),
        status: 'Active'
      },
      bondInfo: {
        type: 'BMC-84 Surety Bond',
        amount: 75000,
        status: 'Active'
      }
    },
    financialHistory: {
      annualRevenue: 425000,
      avgMonthlyLoads: 35,
      avgRatePerMile: 2.85,
      fuelCosts: 95000,
      maintenanceCosts: 28000,
      insuranceCosts: 24000,
      outstandingDebts: 0,
      uccFilings: []
    },
    platformIntegrations: {
      amazonRelay: {
        status: 'Active',
        score: 'A',
        loads: 156,
        rating: 4.8,
        memberSince: new Date('2020-06-15')
      },
      highway: {
        status: 'Active',
        factoring: true,
        quickPay: true,
        setupDate: new Date('2019-08-20')
      },
      dat: {
        status: 'Active',
        rating: 98
      }
    },
    transferItems: {
      mcAuthority: true,
      dotNumber: true,
      emailAccounts: ['dispatch@quickhaul.com', 'accounting@quickhaul.com'],
      phoneNumbers: ['(904) 555-1234', '(904) 555-1236'],
      amazonRelayAccount: true,
      highwayAccount: true,
      factoringAgreements: true,
      existingContracts: [
        { name: 'Amazon Relay Partner Agreement', type: 'Broker', transferable: true },
        { name: 'Highway Factoring Agreement', type: 'Factoring', transferable: true }
      ],
      equipment: []
    },
    driverHistory: {
      totalDrivers: 8,
      currentDrivers: 5,
      driverTurnoverRate: 15,
      drugTestCompliance: true,
      lastDrugTestDate: new Date('2024-01-05'),
      driverQualificationFiles: true,
      driversWithViolations: 0
    },
    sellerInfo: {
      contactName: 'James Rodriguez',
      contactTitle: 'Owner/Operator',
      contactPhone: '(904) 555-1234',
      contactEmail: 'james@quickhaul.com',
      reasonForSelling: 'Retirement - Moving out of the trucking industry after 15 years',
      yearsOwned: 7,
      transitionSupport: true,
      transitionSupportDays: 30,
      sellerNotes: 'Happy to provide training on dispatch systems and introduce to regular shippers. All driver files are organized and up to date.',
      responseTime: 'Usually responds within 2 hours',
      verificationStatus: 'verified',
      previousSales: 2,
      completedDeals: 2
    },
    buyerInfo: {
      companyName: 'Davis Transport Solutions',
      contactName: 'Mike Davis',
      contactTitle: 'CEO',
      contactPhone: '(555) 123-4567',
      contactEmail: 'mike@davistransport.com',
      intendedUse: 'Expanding existing fleet operations - Currently operating 3 trucks, looking to grow with established MC',
      experienceYears: 5,
      currentMCsOwned: 1,
      financingStatus: 'Pre-approved financing',
      verificationStatus: 'verified',
      previousPurchases: 1
    },
    workflow: {
      currentStep: 'confirm-intent' as BuyerStep,
      // These will be populated as the transaction progresses
      intentConfirmedAt: undefined,
      termsAcceptedAt: undefined,
      depositPaidAt: undefined,
      depositStripeId: undefined,
      adminApprovedDepositAt: undefined,
      billOfSaleGeneratedAt: undefined,
      buyerApprovedBillOfSaleAt: undefined,
      sellerApprovedBillOfSaleAt: undefined,
      adminApprovedBillOfSaleAt: undefined,
      finalPaymentPaidAt: undefined,
      finalPaymentStripeId: undefined,
      completedAt: undefined
    }
  })

  // Determine user role in this transaction
  const getUserRole = () => {
    if (user?.role === 'admin') return 'admin'
    if (user?.id === transaction.buyerId) return 'buyer'
    if (user?.id === transaction.sellerId) return 'seller'
    return 'buyer' // default for demo
  }

  const userRole = getUserRole()

  // Buyer can only see seller contact info after final payment is received
  const canBuyerSeeSellerInfo = transaction.status === 'completed' && transaction.finalPaymentPaid

  const getStatusConfig = (status: TransactionStatus) => {
    const configs: Record<TransactionStatus, { label: string; color: string; description: string }> = {
      'awaiting-deposit': { label: 'Awaiting Deposit', color: 'bg-yellow-100 text-yellow-700', description: 'Waiting for buyer deposit' },
      'deposit-received': { label: 'Deposit Received', color: 'bg-blue-100 text-blue-700', description: 'Deposit confirmed, review in progress' },
      'in-review': { label: 'In Review', color: 'bg-blue-100 text-blue-700', description: 'Parties reviewing documents' },
      'buyer-approved': { label: 'Buyer Approved', color: 'bg-green-100 text-green-700', description: 'Waiting for seller approval' },
      'seller-approved': { label: 'Seller Approved', color: 'bg-green-100 text-green-700', description: 'Waiting for buyer approval' },
      'both-approved': { label: 'Both Approved', color: 'bg-emerald-100 text-emerald-700', description: 'Awaiting admin final review' },
      'admin-final-review': { label: 'Admin Review', color: 'bg-purple-100 text-purple-700', description: 'Admin conducting final review' },
      'payment-pending': { label: 'Payment Pending', color: 'bg-orange-100 text-orange-700', description: 'Awaiting final payment' },
      'payment-received': { label: 'Payment Received', color: 'bg-emerald-100 text-emerald-700', description: 'Verifying payment' },
      'completed': { label: 'Completed', color: 'bg-green-100 text-green-700', description: 'Transaction complete!' },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-700', description: 'Transaction cancelled' },
      'disputed': { label: 'Disputed', color: 'bg-red-100 text-red-700', description: 'Under dispute resolution' }
    }
    return configs[status]
  }

  const statusConfig = getStatusConfig(transaction.status)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (activeTab === 'messages') {
      scrollToBottom()
    }
  }, [activeTab, transaction.messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    setSendingMessage(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const newMsg: TransactionMessage = {
      id: Date.now().toString(),
      transactionId: transaction.id,
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderRole: userRole,
      message: newMessage,
      isSystemMessage: false,
      createdAt: new Date()
    }
    setTransaction(prev => ({ ...prev, messages: [...prev.messages, newMsg] }))
    setNewMessage('')
    setSendingMessage(false)
  }

  const handleApprove = async () => {
    setApproving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (userRole === 'buyer') {
      setTransaction(prev => ({
        ...prev,
        buyerApproved: true,
        buyerApprovedAt: new Date(),
        status: prev.sellerApproved ? 'both-approved' : 'buyer-approved'
      }))
    } else if (userRole === 'seller') {
      setTransaction(prev => ({
        ...prev,
        sellerApproved: true,
        sellerApprovedAt: new Date(),
        status: prev.buyerApproved ? 'both-approved' : 'seller-approved'
      }))
    } else if (userRole === 'admin') {
      setTransaction(prev => ({
        ...prev,
        adminApproved: true,
        adminApprovedAt: new Date(),
        status: 'payment-pending',
        paymentInstructions: `Payment Instructions for Transaction #${transaction.id}

Amount Due: $${transaction.finalPaymentAmount.toLocaleString()}

Wire Transfer Details:
Bank: Chase Bank
Routing Number: 021000021
Account Number: ****4567
Account Name: Domilea Escrow LLC

Reference: TXN-${transaction.id}

Please include the reference number in your wire transfer memo.
Once payment is received and verified (typically within 1-2 business days),
all MC authority documents and credentials will be released to you.

For questions, contact us at escrow@domilea.com`
      }))
    }
    setApproving(false)
  }

  const handleFinalPayment = async () => {
    setTransaction(prev => ({
      ...prev,
      finalPaymentPaid: true,
      finalPaymentPaidAt: new Date(),
      status: 'completed',
      completedAt: new Date()
    }))
    setShowPaymentModal(false)
  }

  const canApprove = () => {
    if (userRole === 'buyer' && !transaction.buyerApproved) return true
    if (userRole === 'seller' && !transaction.sellerApproved) return true
    if (userRole === 'admin' && transaction.buyerApproved && transaction.sellerApproved && !transaction.adminApproved) return true
    return false
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'authority': return <Award className="w-5 h-5 text-blue-600" />
      case 'insurance': return <Shield className="w-5 h-5 text-green-600" />
      case 'safety': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'financial': return <DollarSign className="w-5 h-5 text-emerald-600" />
      case 'legal': return <Scale className="w-5 h-5 text-purple-600" />
      case 'contract': return <FileCheck className="w-5 h-5 text-orange-600" />
      case 'transfer': return <ArrowRight className="w-5 h-5 text-gray-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const groupedDocuments = transaction.sellerDocuments.reduce((acc, doc) => {
    const category = doc.type
    if (!acc[category]) acc[category] = []
    acc[category].push(doc)
    return acc
  }, {} as Record<string, typeof transaction.sellerDocuments>)

  // Get back URL based on user role
  const getBackUrl = () => {
    if (userRole === 'admin') return '/admin/transactions'
    if (userRole === 'seller') return '/seller/transactions'
    return '/buyer/transactions'
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to={getBackUrl()}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Transactions
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-sm">Transaction Room</p>
                <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-gray-300">
                  #{transaction.id}
                </span>
              </div>
              <h1 className="text-2xl font-bold">{transaction.businessDetails.legalName}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  MC #{transaction.listing.mcNumber}
                </span>
                <span className="flex items-center gap-1">
                  <Hash className="w-4 h-4" />
                  DOT #{transaction.businessDetails.dotNumber}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.color}`}>
              <span className="font-medium">{statusConfig.label}</span>
            </div>
            <p className="text-sm text-gray-400">{statusConfig.description}</p>
          </div>
        </div>

        {/* Quick Stats - Role Specific */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div>
            <p className="text-gray-400 text-sm">
              {userRole === 'seller' ? 'Listing Price' : userRole === 'buyer' ? 'Your Price' : 'Transaction Value'}
            </p>
            <p className="text-2xl font-bold">
              ${userRole === 'seller' ? transaction.listing.price.toLocaleString() : transaction.agreedPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Years Active</p>
            <p className="text-2xl font-bold">{transaction.listing.yearsActive} Years</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Safety Rating</p>
            <p className="text-2xl font-bold">{transaction.safetyRecord.saferScore}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Amazon Score</p>
            <p className="text-2xl font-bold">{transaction.platformIntegrations.amazonRelay.score}-Rated</p>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Buyer */}
        <Card className={`${userRole === 'buyer' ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{transaction.buyer.name}</p>
                {userRole === 'buyer' && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <p className="text-sm text-gray-500">Buyer</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              {transaction.buyer.email}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <Star className="w-4 h-4" />
              Trust Score: {transaction.buyer.trustScore}%
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            {transaction.buyerApproved ? (
              <span className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                Approved on {transaction.buyerApprovedAt?.toLocaleDateString()}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-yellow-600">
                <Clock className="w-5 h-5" />
                Pending Approval
              </span>
            )}
          </div>
        </Card>

        {/* Seller */}
        <Card className={`${userRole === 'seller' ? 'ring-2 ring-purple-500' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">{transaction.seller.name}</p>
                {userRole === 'seller' && (
                  <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <p className="text-sm text-gray-500">Seller</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            {/* Hide seller email from buyers until transaction is completed */}
            {userRole === 'buyer' && !canBuyerSeeSellerInfo ? (
              <p className="flex items-center gap-2 text-gray-400">
                <Lock className="w-4 h-4" />
                <span className="italic">Contact info released after payment</span>
              </p>
            ) : (
              <p className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                {transaction.seller.email}
              </p>
            )}
            <p className="flex items-center gap-2 text-gray-600">
              <Star className="w-4 h-4" />
              Trust Score: {transaction.seller.trustScore}%
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            {transaction.sellerApproved ? (
              <span className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                Approved on {transaction.sellerApprovedAt?.toLocaleDateString()}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-yellow-600">
                <Clock className="w-5 h-5" />
                Pending Approval
              </span>
            )}
          </div>
        </Card>

        {/* Admin/Facilitator */}
        <Card className={`${userRole === 'admin' ? 'ring-2 ring-amber-500' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">Domilea</p>
                {userRole === 'admin' && (
                  <span className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <p className="text-sm text-gray-500">Transaction Facilitator</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              Escrow Protected
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <FileCheck className="w-4 h-4" />
              Document Verification
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            {transaction.adminApproved ? (
              <span className="flex items-center gap-2 text-green-600 font-medium">
                <CheckCircle className="w-5 h-5" />
                Finalized on {transaction.adminApprovedAt?.toLocaleDateString()}
              </span>
            ) : (
              <span className="flex items-center gap-2 text-gray-500">
                <Clock className="w-5 h-5" />
                Awaiting Both Approvals
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
        {[
          { id: 'timeline', label: 'Transaction Progress', icon: Clock },
          { id: 'parties', label: 'Buyer & Seller', icon: Users, blur: userRole === 'buyer' && transaction.workflow.currentStep !== 'completed' },
          { id: 'business', label: 'Business Details', icon: Building2, blur: userRole === 'buyer' && transaction.workflow.currentStep !== 'completed' },
          { id: 'documents', label: 'Documents', icon: FileText, count: transaction.sellerDocuments.length, blur: userRole === 'buyer' && transaction.workflow.currentStep !== 'completed' },
          { id: 'financials', label: 'Financials', icon: DollarSign },
          { id: 'messages', label: 'Messages', icon: MessageSquare, count: transaction.messages.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-gray-100' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column - Step Progress & Current Step */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow Steps Progress */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Transaction Progress
                </h3>
                <div className="relative">
                  {[
                    { id: 'confirm-intent', label: 'Confirm Purchase Intent', icon: Target, description: 'Confirm you want to proceed with this MC purchase' },
                    { id: 'terms-agreement', label: 'Terms & Agreement', icon: ScrollText, description: 'Review and accept terms of service' },
                    { id: 'deposit-payment', label: 'Deposit Payment', icon: CreditCard, description: 'Pay $1,000 refundable deposit' },
                    { id: 'awaiting-admin', label: 'Admin Approval', icon: Shield, description: 'Waiting for admin to verify and approve' },
                    { id: 'bill-of-sale', label: 'Bill of Sale', icon: FileCheck, description: 'All parties review and approve agreement' },
                    { id: 'final-payment', label: 'Final Payment', icon: CircleDollarSign, description: 'Pay remaining balance' },
                    { id: 'completed', label: 'Transaction Complete', icon: CheckCheck, description: 'MC Authority transferred to you' },
                  ].map((step, index) => {
                    const stepOrder = ['confirm-intent', 'terms-agreement', 'deposit-payment', 'awaiting-admin', 'bill-of-sale', 'final-payment', 'completed']
                    const currentIndex = stepOrder.indexOf(transaction.workflow.currentStep)
                    const stepIndex = stepOrder.indexOf(step.id)
                    const isCompleted = stepIndex < currentIndex
                    const isCurrent = step.id === transaction.workflow.currentStep
                    const isPending = stepIndex > currentIndex

                    return (
                      <div key={step.id} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                            isCompleted ? 'bg-green-100' : isCurrent ? 'bg-blue-100 ring-4 ring-blue-50' : 'bg-gray-100'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <step.icon className={`w-5 h-5 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                            )}
                          </div>
                          {index < 6 && (
                            <div className={`w-0.5 h-full mt-2 ${isCompleted ? 'bg-green-300' : 'bg-gray-200'}`} />
                          )}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className={`font-semibold ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-400'}`}>
                            {step.label}
                            {isCurrent && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Current</span>}
                          </p>
                          <p className={`text-sm ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>

              {/* Current Step Action Card - BUYER ONLY */}
              {userRole === 'buyer' && (
                <>
                  {/* Step 1: Confirm Purchase Intent */}
                  {transaction.workflow.currentStep === 'confirm-intent' && (
                    <Card className="border-2 border-blue-200 bg-blue-50/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Confirm Your Purchase Intent</h3>
                          <p className="text-sm text-gray-600">Step 1 of 7</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">MC Authority Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">MC Number</p>
                            <p className="font-medium">#{transaction.listing.mcNumber}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Years Active</p>
                            <p className="font-medium">{transaction.listing.yearsActive} Years</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Your Purchase Price</p>
                            <p className="font-bold text-green-600">${transaction.agreedPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Safety Rating</p>
                            <p className="font-medium">{transaction.safetyRecord.saferScore}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="intent-confirm"
                          checked={intentConfirmed}
                          onChange={(e) => setIntentConfirmed(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="intent-confirm" className="text-sm text-gray-700">
                          I confirm that I intend to purchase MC Authority #{transaction.listing.mcNumber} for ${transaction.agreedPrice.toLocaleString()}.
                          I understand this begins a formal transaction process.
                        </label>
                      </div>

                      <Button
                        fullWidth
                        disabled={!intentConfirmed}
                        onClick={() => {
                          setTransaction(prev => ({
                            ...prev,
                            workflow: { ...prev.workflow, currentStep: 'terms-agreement', intentConfirmedAt: new Date() }
                          }))
                        }}
                      >
                        Continue to Terms & Agreement
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Card>
                  )}

                  {/* Step 2: Terms & Agreement */}
                  {transaction.workflow.currentStep === 'terms-agreement' && (
                    <Card className="border-2 border-blue-200 bg-blue-50/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <ScrollText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Terms of Service & Agreement</h3>
                          <p className="text-sm text-gray-600">Step 2 of 7</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 mb-4 max-h-64 overflow-y-auto">
                        <h4 className="font-bold text-gray-900 mb-2">IMPORTANT DISCLAIMERS & TERMS</h4>

                        <div className="space-y-4 text-sm text-gray-700">
                          <div>
                            <h5 className="font-semibold text-red-600 mb-1">Deposit Refund Policy</h5>
                            <p>The $1,000 deposit is <strong>refundable only under specific circumstances</strong>:</p>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              <li>If Domilea or the seller cancels the transaction</li>
                              <li>If material misrepresentation is discovered during due diligence</li>
                              <li>If the MC Authority fails FMCSA compliance verification</li>
                            </ul>
                            <p className="mt-2 text-red-600 font-medium">Deposits are NOT refundable if you simply change your mind or fail to complete the purchase.</p>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-1">All Sales Are Final</h5>
                            <p>Once the transaction is completed and the MC Authority is transferred, all sales are final. There are no refunds on completed transfers.</p>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-1">Buyer's Due Diligence</h5>
                            <p>You are purchasing this MC Authority at your own discretion and risk. While Domilea performs verification, you are responsible for conducting your own due diligence including:</p>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              <li>Verifying all FMCSA records</li>
                              <li>Reviewing safety scores and inspection history</li>
                              <li>Confirming insurance transferability</li>
                              <li>Consulting with legal and financial advisors</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-1">Limitation of Liability</h5>
                            <p>Domilea acts as a facilitator and marketplace. We are not liable for:</p>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              <li>Future changes in FMCSA regulations affecting the MC</li>
                              <li>Business performance after transfer</li>
                              <li>Third-party claims or disputes</li>
                              <li>Loss of broker/shipper relationships</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-semibold mb-1">Transfer Process</h5>
                            <p>MC Authority transfers require filing with the FMCSA and may take 4-6 weeks to complete. During this period, you may not be able to operate under this MC number.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-red-800">
                            <strong>READ CAREFULLY:</strong> By proceeding, you acknowledge that you have read, understood, and agree to all terms above.
                            You accept full responsibility for your purchase decision.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="terms-accept"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="terms-accept" className="text-sm text-gray-700">
                          I have read and agree to the Terms of Service, Deposit Refund Policy, and all disclaimers.
                          I understand this is a binding agreement and I am proceeding at my own risk.
                        </label>
                      </div>

                      <Button
                        fullWidth
                        disabled={!termsAccepted}
                        onClick={() => {
                          setTransaction(prev => ({
                            ...prev,
                            workflow: { ...prev.workflow, currentStep: 'deposit-payment', termsAcceptedAt: new Date() }
                          }))
                        }}
                      >
                        I Agree - Continue to Deposit Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Card>
                  )}

                  {/* Step 3: Deposit Payment */}
                  {transaction.workflow.currentStep === 'deposit-payment' && (
                    <Card className="border-2 border-blue-200 bg-blue-50/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Deposit Payment</h3>
                          <p className="text-sm text-gray-600">Step 3 of 7</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-gray-600">Deposit Amount</span>
                          <span className="text-2xl font-bold text-gray-900">$1,000.00</span>
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                          This deposit will be held in escrow and applied to your final purchase price.
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-3">Select Payment Method</label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setPaymentMethod('card')}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === 'card'
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <CreditCard className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-400'}`} />
                              <p className={`font-medium ${paymentMethod === 'card' ? 'text-blue-700' : 'text-gray-700'}`}>Credit/Debit Card</p>
                              <p className="text-xs text-gray-500 mt-1">Instant processing</p>
                            </button>
                            <button
                              onClick={() => setPaymentMethod('zelle')}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                paymentMethod === 'zelle'
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <CircleDollarSign className={`w-6 h-6 mx-auto mb-2 ${paymentMethod === 'zelle' ? 'text-purple-600' : 'text-gray-400'}`} />
                              <p className={`font-medium ${paymentMethod === 'zelle' ? 'text-purple-700' : 'text-gray-700'}`}>Zelle Transfer</p>
                              <p className="text-xs text-gray-500 mt-1">Manual verification</p>
                            </button>
                          </div>
                        </div>

                        {/* Card Payment Form */}
                        {paymentMethod === 'card' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                              <input
                                type="text"
                                value={billingName}
                                onChange={(e) => setBillingName(e.target.value)}
                                placeholder="Name on card"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                <input
                                  type="text"
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  placeholder="123"
                                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Zelle Payment Instructions */}
                        {paymentMethod === 'zelle' && (
                          <div className="space-y-4">
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                              <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                                <CircleDollarSign className="w-5 h-5" />
                                Zelle Payment Instructions
                              </h4>
                              <div className="space-y-3 text-sm">
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-gray-500 text-xs mb-1">Send Zelle payment to:</p>
                                  <p className="font-bold text-gray-900 text-lg">payments@domilea.com</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-gray-500 text-xs mb-1">Amount to send:</p>
                                  <p className="font-bold text-gray-900 text-lg">$1,000.00</p>
                                </div>
                                <div className="bg-white rounded-lg p-3">
                                  <p className="text-gray-500 text-xs mb-1">Include in memo/note:</p>
                                  <p className="font-mono font-bold text-gray-900">TXN-{transaction.id}</p>
                                </div>
                              </div>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-800">
                                  <p className="font-medium mb-1">Important:</p>
                                  <ul className="list-disc list-inside space-y-1 text-amber-700">
                                    <li>Send exactly $1,000.00 - no more, no less</li>
                                    <li>Include the transaction ID in your memo</li>
                                    <li>Admin will verify and confirm within 24 hours</li>
                                    <li>Do not close this page after confirming</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={zelleSentConfirmed}
                                onChange={(e) => setZelleSentConfirmed(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                              />
                              <span className="text-gray-700">
                                I have sent the Zelle payment of <strong>$1,000.00</strong> to <strong>payments@domilea.com</strong>
                              </span>
                            </label>
                          </div>
                        )}
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                          <Shield className="w-4 h-4" />
                          Secured by Stripe. Your payment information is encrypted.
                        </div>
                      )}

                      {paymentMethod === 'card' ? (
                        <Button
                          fullWidth
                          loading={processingPayment}
                          disabled={!billingName || cardNumber.length < 15 || !cardExpiry || cardCvc.length < 3}
                          onClick={() => {
                            setProcessingPayment(true)
                            setTimeout(() => {
                              setProcessingPayment(false)
                              setTransaction(prev => ({
                                ...prev,
                                depositPaid: true,
                                depositPaidAt: new Date(),
                                workflow: {
                                  ...prev.workflow,
                                  currentStep: 'awaiting-admin',
                                  depositPaidAt: new Date(),
                                  depositPaymentMethod: 'card',
                                  depositStripeId: 'pi_' + Math.random().toString(36).substr(2, 14)
                                }
                              }))
                            }, 2000)
                          }}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Pay $1,000 Deposit
                        </Button>
                      ) : (
                        <Button
                          fullWidth
                          loading={processingPayment}
                          disabled={!zelleSentConfirmed}
                          variant={zelleSentConfirmed ? 'primary' : 'secondary'}
                          onClick={() => {
                            setProcessingPayment(true)
                            setTimeout(() => {
                              setProcessingPayment(false)
                              setTransaction(prev => ({
                                ...prev,
                                workflow: {
                                  ...prev.workflow,
                                  currentStep: 'awaiting-admin',
                                  depositPaymentMethod: 'zelle',
                                  depositZellePending: true,
                                  depositZelleSentAt: new Date()
                                }
                              }))
                            }, 1000)
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Confirm Zelle Payment Sent
                        </Button>
                      )}
                    </Card>
                  )}

                  {/* Step 4: Awaiting Admin Approval */}
                  {transaction.workflow.currentStep === 'awaiting-admin' && (
                    <Card className={`border-2 ${transaction.workflow.depositZellePending ? 'border-purple-200 bg-purple-50/30' : 'border-yellow-200 bg-yellow-50/30'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${transaction.workflow.depositZellePending ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                          {transaction.workflow.depositZellePending ? (
                            <CircleDollarSign className="w-6 h-6 text-purple-600" />
                          ) : (
                            <Shield className="w-6 h-6 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {transaction.workflow.depositZellePending ? 'Awaiting Zelle Verification' : 'Awaiting Admin Approval'}
                          </h3>
                          <p className="text-sm text-gray-600">Step 4 of 7</p>
                        </div>
                      </div>

                      {/* Zelle Pending Verification */}
                      {transaction.workflow.depositZellePending && (
                        <div className="bg-white rounded-xl p-6 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">Zelle Payment Pending Verification</h4>
                          <p className="text-gray-600 mb-4">
                            Our admin team is verifying your Zelle payment. This usually takes 1-24 hours.
                            You will be notified once the payment is confirmed.
                          </p>
                          <div className="bg-purple-50 rounded-lg p-4 text-sm text-left space-y-2">
                            <p><strong>Transaction ID:</strong> {transaction.id}</p>
                            <p><strong>Payment Method:</strong> Zelle</p>
                            <p><strong>Amount:</strong> $1,000.00</p>
                            <p><strong>Sent At:</strong> {transaction.workflow.depositZelleSentAt?.toLocaleString()}</p>
                            <p><strong>Status:</strong> <span className="text-purple-600 font-medium">Pending Admin Verification</span></p>
                          </div>
                        </div>
                      )}

                      {/* Card Payment Confirmed */}
                      {!transaction.workflow.depositZellePending && (
                        <div className="bg-white rounded-xl p-6 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">Your Deposit Has Been Received</h4>
                          <p className="text-gray-600 mb-4">
                            Our team is reviewing your transaction and verifying the MC Authority details.
                            You will be notified once the admin approves and the Bill of Sale is ready.
                          </p>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-500">
                            <p><strong>Transaction ID:</strong> {transaction.id}</p>
                            <p><strong>Deposit ID:</strong> {transaction.workflow.depositStripeId || 'Processing...'}</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-blue-700">
                          <strong>What happens next?</strong> Once approved, you'll receive the Bill of Sale for review.
                          All parties (you, the seller, and admin) must approve before proceeding to final payment.
                        </p>
                      </div>
                    </Card>
                  )}

                  {/* Step 5: Bill of Sale */}
                  {transaction.workflow.currentStep === 'bill-of-sale' && (
                    <Card className="border-2 border-blue-200 bg-blue-50/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                          <FileCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Bill of Sale Review</h3>
                          <p className="text-sm text-gray-600">Step 5 of 7</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900">Purchase Agreement</h4>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download PDF
                          </Button>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4 mb-4 text-sm">
                          <p className="font-semibold mb-2">MC Authority Bill of Sale</p>
                          <p className="text-gray-600 mb-2">
                            This agreement confirms the sale of MC Authority #{transaction.listing.mcNumber} from
                            {' '}<span className="font-medium">{transaction.seller.name}</span> to
                            {' '}<span className="font-medium">{transaction.buyer.name}</span> for the agreed price of
                            {' '}<span className="font-medium">${transaction.agreedPrice.toLocaleString()}</span>.
                          </p>
                          <p className="text-gray-500 text-xs">Generated: {new Date().toLocaleDateString()}</p>
                        </div>

                        {/* Approval Status */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Buyer Approval
                            </span>
                            {transaction.workflow.buyerApprovedBillOfSaleAt ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Approved
                              </span>
                            ) : (
                              <span className="text-yellow-600 text-sm">Pending</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              Seller Approval
                            </span>
                            {transaction.workflow.sellerApprovedBillOfSaleAt ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Approved
                              </span>
                            ) : (
                              <span className="text-yellow-600 text-sm">Pending</span>
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="flex items-center gap-2">
                              <Crown className="w-4 h-4" />
                              Admin Approval
                            </span>
                            {transaction.workflow.adminApprovedBillOfSaleAt ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Approved
                              </span>
                            ) : (
                              <span className="text-yellow-600 text-sm">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {!transaction.workflow.buyerApprovedBillOfSaleAt && (
                        <Button
                          fullWidth
                          onClick={() => {
                            setTransaction(prev => ({
                              ...prev,
                              buyerApproved: true,
                              buyerApprovedAt: new Date(),
                              workflow: { ...prev.workflow, buyerApprovedBillOfSaleAt: new Date() }
                            }))
                          }}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Approve Bill of Sale
                        </Button>
                      )}

                      {transaction.workflow.buyerApprovedBillOfSaleAt && !transaction.workflow.sellerApprovedBillOfSaleAt && (
                        <div className="p-4 bg-yellow-50 rounded-xl text-center">
                          <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                          <p className="text-sm text-yellow-700">Waiting for seller to approve...</p>
                        </div>
                      )}

                      {transaction.workflow.buyerApprovedBillOfSaleAt && transaction.workflow.sellerApprovedBillOfSaleAt && !transaction.workflow.adminApprovedBillOfSaleAt && (
                        <div className="p-4 bg-yellow-50 rounded-xl text-center">
                          <Crown className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                          <p className="text-sm text-yellow-700">Waiting for admin final approval...</p>
                        </div>
                      )}
                    </Card>
                  )}

                  {/* Step 6: Final Payment */}
                  {transaction.workflow.currentStep === 'final-payment' && (
                    <Card className="border-2 border-green-200 bg-green-50/30">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                          <CircleDollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Final Payment</h3>
                          <p className="text-sm text-gray-600">Step 6 of 7 - Almost there!</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Payment Summary</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Purchase Price</span>
                            <span className="font-medium">${transaction.agreedPrice.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-green-600">
                            <span>Deposit Paid</span>
                            <span>-${transaction.depositAmount.toLocaleString()}</span>
                          </div>
                          <div className="border-t pt-3 flex items-center justify-between">
                            <span className="font-semibold text-gray-900">Balance Due</span>
                            <span className="text-2xl font-bold text-gray-900">${transaction.finalPaymentAmount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                        <h5 className="font-semibold text-blue-800 mb-2">Payment Instructions</h5>
                        <p className="text-sm text-blue-700">
                          Please complete the final payment to transfer the MC Authority.
                          Once payment is confirmed, all business information and documents will be released to you.
                        </p>
                      </div>

                      <Button
                        fullWidth
                        loading={processingPayment}
                        onClick={() => {
                          setProcessingPayment(true)
                          setTimeout(() => {
                            setProcessingPayment(false)
                            setTransaction(prev => ({
                              ...prev,
                              finalPaymentPaid: true,
                              finalPaymentPaidAt: new Date(),
                              status: 'completed',
                              completedAt: new Date(),
                              workflow: {
                                ...prev.workflow,
                                currentStep: 'completed',
                                finalPaymentPaidAt: new Date(),
                                finalPaymentStripeId: 'pi_' + Math.random().toString(36).substr(2, 14),
                                completedAt: new Date()
                              }
                            }))
                          }, 2000)
                        }}
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Pay ${transaction.finalPaymentAmount.toLocaleString()} - Complete Purchase
                      </Button>
                    </Card>
                  )}

                  {/* Step 7: Completed */}
                  {transaction.workflow.currentStep === 'completed' && (
                    <Card className="border-2 border-green-300 bg-green-50">
                      <div className="text-center py-6">
                        <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCheck className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h3>
                        <p className="text-green-700 mb-4">
                          The MC Authority #{transaction.listing.mcNumber} has been successfully transferred to you.
                        </p>
                        <div className="bg-white rounded-xl p-4 text-left">
                          <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
                          <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              All business documents are now available in the Documents tab
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              Seller contact information has been released
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              FMCSA transfer paperwork will be processed within 2-4 weeks
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              Seller will provide {transaction.sellerInfo.transitionSupportDays} days of transition support
                            </li>
                          </ul>
                        </div>
                        <Button className="mt-4" onClick={() => setActiveTab('documents')}>
                          <Download className="w-4 h-4 mr-2" />
                          View & Download Documents
                        </Button>
                      </div>
                    </Card>
                  )}
                </>
              )}

              {/* Seller/Admin view - Show status overview */}
              {(userRole === 'seller' || userRole === 'admin') && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    Deal Overview
                  </h3>
                  {userRole === 'seller' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm text-green-600 mb-1">Your Listing Price</p>
                        <p className="text-xl font-bold text-green-700">${transaction.listing.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-blue-600 mb-1">Buyer Deposit</p>
                        <p className="text-xl font-bold text-blue-700">${transaction.depositAmount.toLocaleString()}</p>
                        <p className="text-xs text-blue-500 mt-1">Held in escrow</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-sm text-purple-600 mb-1">Transaction Status</p>
                        <p className="text-lg font-bold text-purple-700">{transaction.depositPaid ? 'Deposit Secured' : 'Awaiting Deposit'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-500 mb-1">Seller's Price</p>
                        <p className="text-xl font-bold text-gray-700">${transaction.listing.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <p className="text-sm text-green-600 mb-1">Buyer's Price</p>
                        <p className="text-xl font-bold text-green-700">${transaction.agreedPrice.toLocaleString()}</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <p className="text-sm text-blue-600 mb-1">Deposit Paid</p>
                        <p className="text-xl font-bold text-blue-700">${transaction.depositAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4">
                        <p className="text-sm text-amber-600 mb-1">Platform Fee</p>
                        <p className="text-xl font-bold text-amber-700">${(transaction.agreedPrice - transaction.listing.price).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                {/* What's Being Transferred */}
                <h4 className="font-medium text-gray-900 mb-3">Items Included in Transfer</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'MC Authority', included: transaction.transferItems.mcAuthority, icon: Award },
                    { label: 'DOT Number', included: transaction.transferItems.dotNumber, icon: Hash },
                    { label: 'Amazon Relay Account', included: transaction.transferItems.amazonRelayAccount, icon: Package },
                    { label: 'Highway Account', included: transaction.transferItems.highwayAccount, icon: Truck },
                    { label: 'Email Accounts', included: transaction.transferItems.emailAccounts.length > 0, icon: Mail },
                    { label: 'Phone Numbers', included: transaction.transferItems.phoneNumbers.length > 0, icon: Phone },
                    { label: 'Factoring Agreements', included: transaction.transferItems.factoringAgreements, icon: Banknote },
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center gap-2 p-3 rounded-lg ${item.included ? 'bg-green-50' : 'bg-gray-50'}`}>
                      {item.included ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <item.icon className={`w-4 h-4 ${item.included ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={item.included ? 'text-gray-900' : 'text-gray-400'}>{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Contact Info Being Transferred */}
                {(transaction.transferItems.emailAccounts.length > 0 || transaction.transferItems.phoneNumbers.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-900 mb-3">Contact Information Included</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {transaction.transferItems.emailAccounts.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500 mb-2">Email Accounts</p>
                          {transaction.transferItems.emailAccounts.map((email, idx) => (
                            <p key={idx} className="text-gray-900">{email}</p>
                          ))}
                        </div>
                      )}
                      {transaction.transferItems.phoneNumbers.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500 mb-2">Phone Numbers</p>
                          {transaction.transferItems.phoneNumbers.map((phone, idx) => (
                            <p key={idx} className="text-gray-900">{phone}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
              )}

              {/* Admin Control Panel - Round Table View */}
              {userRole === 'admin' && (
                <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Admin Control Panel</h3>
                        <p className="text-sm text-gray-500">Transaction Round Table</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                      transaction.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {transaction.status.replace(/-/g, ' ').toUpperCase()}
                    </div>
                  </div>

                  {/* Round Table - All Parties Status */}
                  <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-600" />
                      All Parties Status
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {/* Buyer Status */}
                      <div className={`p-4 rounded-xl border-2 ${transaction.buyerApproved ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.buyerApproved ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-sm">Buyer</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{transaction.buyer.name}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {transaction.buyerApproved ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Seller Status */}
                      <div className={`p-4 rounded-xl border-2 ${transaction.sellerApproved ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.sellerApproved ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <Building2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-sm">Seller</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{transaction.seller.name}</p>
                        <div className="flex items-center gap-1 mt-2">
                          {transaction.sellerApproved ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Admin Status */}
                      <div className={`p-4 rounded-xl border-2 ${transaction.adminApproved ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${transaction.adminApproved ? 'bg-green-500' : 'bg-amber-500'}`}>
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-sm">Admin</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">Domilea</p>
                        <div className="flex items-center gap-1 mt-2">
                          {transaction.adminApproved ? (
                            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Finalized
                            </span>
                          ) : (
                            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Your Turn
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Summary */}
                  <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Financial Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Agreed Price</p>
                        <p className="text-lg font-bold text-gray-900">${transaction.agreedPrice.toLocaleString()}</p>
                      </div>
                      <div className={`rounded-lg p-3 ${transaction.depositPaid ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <p className="text-xs text-gray-500">Deposit</p>
                        <p className={`text-lg font-bold ${transaction.depositPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                          ${transaction.depositAmount.toLocaleString()}
                          {transaction.depositPaid && <CheckCircle className="w-4 h-4 inline ml-1" />}
                        </p>
                      </div>
                      <div className={`rounded-lg p-3 ${transaction.finalPaymentPaid ? 'bg-green-50' : 'bg-gray-50'}`}>
                        <p className="text-xs text-gray-500">Final Payment</p>
                        <p className={`text-lg font-bold ${transaction.finalPaymentPaid ? 'text-green-600' : 'text-gray-900'}`}>
                          ${transaction.finalPaymentAmount.toLocaleString()}
                          {transaction.finalPaymentPaid && <CheckCircle className="w-4 h-4 inline ml-1" />}
                        </p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500">Platform Fee</p>
                        <p className="text-lg font-bold text-amber-600">${(transaction.agreedPrice - transaction.listing.price).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Buyer Workflow Progress */}
                  <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-blue-600" />
                      Buyer Workflow Progress
                    </h4>
                    <div className="flex items-center justify-between mb-2">
                      {[
                        { step: 'confirm-intent', label: 'Intent', num: 1 },
                        { step: 'terms-agreement', label: 'Terms', num: 2 },
                        { step: 'deposit-payment', label: 'Deposit', num: 3 },
                        { step: 'awaiting-admin', label: 'Admin', num: 4 },
                        { step: 'bill-of-sale', label: 'Bill', num: 5 },
                        { step: 'final-payment', label: 'Payment', num: 6 },
                        { step: 'completed', label: 'Done', num: 7 },
                      ].map((item, index) => {
                        const stepOrder = ['confirm-intent', 'terms-agreement', 'deposit-payment', 'awaiting-admin', 'bill-of-sale', 'final-payment', 'completed']
                        const currentIndex = stepOrder.indexOf(transaction.workflow.currentStep)
                        const itemIndex = stepOrder.indexOf(item.step)
                        const isCompleted = itemIndex < currentIndex
                        const isCurrent = item.step === transaction.workflow.currentStep

                        return (
                          <div key={item.step} className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCompleted ? 'bg-green-500 text-white' :
                              isCurrent ? 'bg-blue-500 text-white' :
                              'bg-gray-200 text-gray-500'
                            }`}>
                              {isCompleted ? <Check className="w-4 h-4" /> : item.num}
                            </div>
                            <span className={`text-xs mt-1 ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{item.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Zelle Payment Verification Section */}
                  {transaction.workflow.depositZellePending && !transaction.workflow.depositZelleConfirmedByAdmin && (
                    <div className="bg-purple-50 rounded-xl p-4 mb-4 border-2 border-purple-300">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                          <CircleDollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-purple-800">Action Required: Verify Zelle Deposit</h4>
                          <p className="text-xs text-purple-600">Buyer claims to have sent Zelle payment</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 mb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Buyer:</span>
                          <span className="font-medium">{transaction.buyer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount Expected:</span>
                          <span className="font-bold text-purple-600">$1,000.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Transaction Reference:</span>
                          <span className="font-mono font-medium">TXN-{transaction.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Buyer Confirmed Sent:</span>
                          <span className="font-medium">{transaction.workflow.depositZelleSentAt?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setTransaction(prev => ({
                              ...prev,
                              depositPaid: true,
                              depositPaidAt: new Date(),
                              workflow: {
                                ...prev.workflow,
                                depositZellePending: false,
                                depositZelleConfirmedByAdmin: true,
                                depositZelleConfirmedAt: new Date(),
                                depositPaidAt: new Date()
                              }
                            }))
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Zelle Received
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            alert('Buyer will be notified that payment was not found.')
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Not Found
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Zelle Confirmed Badge */}
                  {transaction.workflow.depositZelleConfirmedByAdmin && (
                    <div className="bg-green-50 rounded-xl p-3 mb-4 border border-green-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Zelle Deposit Verified</span>
                        <span className="text-xs text-green-600 ml-auto">{transaction.workflow.depositZelleConfirmedAt?.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Final Payment Zelle Verification */}
                  {transaction.workflow.finalPaymentZellePending && !transaction.workflow.finalPaymentZelleConfirmedByAdmin && (
                    <div className="bg-purple-50 rounded-xl p-4 mb-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CircleDollarSign className="w-5 h-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-800">Final Payment Zelle Pending Verification</h4>
                      </div>
                      <div className="bg-white rounded-lg p-4 mb-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Buyer:</span>
                          <span className="font-medium">{transaction.buyer.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount Expected:</span>
                          <span className="font-bold text-purple-600">${transaction.finalPaymentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Transaction Reference:</span>
                          <span className="font-mono font-medium">TXN-{transaction.id}-FINAL</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Buyer Confirmed Sent:</span>
                          <span className="font-medium">{transaction.workflow.finalPaymentZelleSentAt?.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setTransaction(prev => ({
                              ...prev,
                              finalPaymentPaid: true,
                              finalPaymentPaidAt: new Date(),
                              status: 'completed',
                              completedAt: new Date(),
                              workflow: {
                                ...prev.workflow,
                                currentStep: 'completed',
                                finalPaymentZellePending: false,
                                finalPaymentZelleConfirmedByAdmin: true,
                                finalPaymentZelleConfirmedAt: new Date(),
                                finalPaymentPaidAt: new Date(),
                                completedAt: new Date()
                              }
                            }))
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Final Payment Received
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Payment Not Found
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Admin Actions Based on Current State */}
                  <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-600" />
                      Admin Actions
                    </h4>

                    <div className="space-y-3">
                      {/* Step 1-3: Waiting for buyer to complete initial steps */}
                      {['confirm-intent', 'terms-agreement', 'deposit-payment'].includes(transaction.workflow.currentStep) && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            Waiting for buyer to complete: <span className="font-medium capitalize">{transaction.workflow.currentStep.replace(/-/g, ' ')}</span>
                          </p>
                        </div>
                      )}

                      {/* Step 4: Admin needs to approve deposit and generate bill of sale */}
                      {transaction.workflow.currentStep === 'awaiting-admin' && (
                        <>
                          {!transaction.depositPaid && !transaction.workflow.depositZellePending && (
                            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                              <p className="text-sm text-yellow-700 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Deposit not yet received. Waiting for buyer payment.
                              </p>
                            </div>
                          )}

                          {transaction.depositPaid && (
                            <div className="space-y-3">
                              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-sm text-green-700 flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Deposit confirmed! Ready to proceed.
                                </p>
                              </div>
                              <Button
                                fullWidth
                                variant="primary"
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                onClick={() => {
                                  setTransaction(prev => ({
                                    ...prev,
                                    workflow: {
                                      ...prev.workflow,
                                      currentStep: 'bill-of-sale',
                                      adminApprovedDepositAt: new Date(),
                                      billOfSaleGeneratedAt: new Date()
                                    }
                                  }))
                                }}
                              >
                                <FileCheck className="w-4 h-4 mr-2" />
                                Approve Deposit & Generate Bill of Sale
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {/* Step 5: Bill of Sale - waiting for approvals */}
                      {transaction.workflow.currentStep === 'bill-of-sale' && (
                        <div className="space-y-3">
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-blue-700 mb-3">Bill of Sale generated. Waiting for party approvals:</p>
                            <div className="grid grid-cols-3 gap-2">
                              <div className={`p-2 rounded text-center text-xs ${transaction.buyerApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                Buyer: {transaction.buyerApproved ? 'Approved' : 'Pending'}
                              </div>
                              <div className={`p-2 rounded text-center text-xs ${transaction.sellerApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                Seller: {transaction.sellerApproved ? 'Approved' : 'Pending'}
                              </div>
                              <div className={`p-2 rounded text-center text-xs ${transaction.adminApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                Admin: {transaction.adminApproved ? 'Approved' : 'Ready'}
                              </div>
                            </div>
                          </div>

                          {/* Admin can approve after both parties approved */}
                          {transaction.buyerApproved && transaction.sellerApproved && !transaction.adminApproved && (
                            <Button
                              fullWidth
                              variant="primary"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                              onClick={() => {
                                setTransaction(prev => ({
                                  ...prev,
                                  adminApproved: true,
                                  adminApprovedAt: new Date(),
                                  status: 'payment-pending',
                                  workflow: {
                                    ...prev.workflow,
                                    currentStep: 'final-payment',
                                    adminApprovedBillOfSaleAt: new Date()
                                  },
                                  paymentInstructions: `Payment Instructions for Transaction #${transaction.id}\n\nAmount Due: $${transaction.finalPaymentAmount.toLocaleString()}\n\nWire/Zelle to: payments@domilea.com\nReference: TXN-${transaction.id}-FINAL`
                                }))
                              }}
                            >
                              <CheckCheck className="w-4 h-4 mr-2" />
                              Finalize & Send Payment Instructions
                            </Button>
                          )}

                          {/* Simulate party approvals for testing */}
                          <div className="flex gap-2 pt-2 border-t border-gray-100">
                            {!transaction.buyerApproved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setTransaction(prev => ({ ...prev, buyerApproved: true, buyerApprovedAt: new Date() }))}
                              >
                                Simulate Buyer Approve
                              </Button>
                            )}
                            {!transaction.sellerApproved && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setTransaction(prev => ({ ...prev, sellerApproved: true, sellerApprovedAt: new Date() }))}
                              >
                                Simulate Seller Approve
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 6: Final Payment */}
                      {transaction.workflow.currentStep === 'final-payment' && (
                        <div className="space-y-3">
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <p className="text-sm text-orange-700 flex items-center gap-2 mb-2">
                              <DollarSign className="w-4 h-4" />
                              Awaiting final payment of <strong>${transaction.finalPaymentAmount.toLocaleString()}</strong>
                            </p>
                            <p className="text-xs text-orange-600">Payment instructions have been sent to the buyer.</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              fullWidth
                              variant="primary"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => {
                                setTransaction(prev => ({
                                  ...prev,
                                  finalPaymentPaid: true,
                                  finalPaymentPaidAt: new Date(),
                                  status: 'completed',
                                  completedAt: new Date(),
                                  workflow: {
                                    ...prev.workflow,
                                    currentStep: 'completed',
                                    finalPaymentPaidAt: new Date(),
                                    completedAt: new Date()
                                  }
                                }))
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm Payment Received
                            </Button>
                            <Button
                              fullWidth
                              variant="outline"
                              onClick={() => {
                                setTransaction(prev => ({
                                  ...prev,
                                  workflow: {
                                    ...prev.workflow,
                                    finalPaymentZellePending: true,
                                    finalPaymentZelleSentAt: new Date()
                                  }
                                }))
                              }}
                            >
                              <CircleDollarSign className="w-4 h-4 mr-2" />
                              Simulate Zelle Sent
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Step 7: Completed */}
                      {transaction.workflow.currentStep === 'completed' && (
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-green-800">Transaction Completed!</p>
                              <p className="text-xs text-green-600">All steps finalized on {transaction.completedAt?.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Export Summary
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4 mr-1" />
                              Send Confirmation
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Verification */}
                  <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Document Verification
                    </h4>
                    <div className="space-y-2">
                      {transaction.sellerDocuments.slice(0, 4).map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700 truncate max-w-[180px]">{doc.name}</span>
                          </div>
                          {doc.verified ? (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Verified
                            </span>
                          ) : (
                            <Button size="sm" variant="outline" className="text-xs py-1 px-2">
                              Verify
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button fullWidth variant="outline" size="sm" className="mt-2">
                        View All {transaction.sellerDocuments.length} Documents
                      </Button>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message Parties
                    </Button>
                    <Button variant="outline" size="sm">
                      <ScrollText className="w-4 h-4 mr-1" />
                      Activity Log
                    </Button>
                  </div>

                  {/* Manual Step Control - For Testing */}
                  <div className="mt-6 pt-4 border-t border-amber-200">
                    <h4 className="font-medium text-gray-700 text-sm mb-3 flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Manual Step Control (Testing)
                    </h4>
                    <p className="text-xs text-gray-500 mb-3">Current Step: <span className="font-mono font-bold text-amber-600">{transaction.workflow.currentStep}</span></p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { step: 'confirm-intent', label: '1. Confirm Intent' },
                        { step: 'terms-agreement', label: '2. Terms' },
                        { step: 'deposit-payment', label: '3. Deposit' },
                        { step: 'awaiting-admin', label: '4. Awaiting Admin' },
                        { step: 'bill-of-sale', label: '5. Bill of Sale' },
                        { step: 'final-payment', label: '6. Final Payment' },
                        { step: 'completed', label: '7. Completed' },
                      ].map((item) => (
                        <button
                          key={item.step}
                          onClick={() => {
                            setTransaction(prev => ({
                              ...prev,
                              depositPaid: ['awaiting-admin', 'bill-of-sale', 'final-payment', 'completed'].includes(item.step),
                              depositPaidAt: ['awaiting-admin', 'bill-of-sale', 'final-payment', 'completed'].includes(item.step) ? new Date() : undefined,
                              workflow: {
                                ...prev.workflow,
                                currentStep: item.step as BuyerStep,
                                depositZellePending: item.step === 'awaiting-admin' ? prev.workflow.depositZellePending : false
                              }
                            }))
                          }}
                          className={`px-3 py-2 text-xs rounded-lg border transition-all ${
                            transaction.workflow.currentStep === item.step
                              ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    {/* Toggle Zelle Pending */}
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setTransaction(prev => ({
                            ...prev,
                            workflow: {
                              ...prev.workflow,
                              depositZellePending: !prev.workflow.depositZellePending,
                              depositZelleSentAt: !prev.workflow.depositZellePending ? new Date() : undefined
                            }
                          }))
                        }}
                        className={`w-full px-3 py-2 text-xs rounded-lg border transition-all ${
                          transaction.workflow.depositZellePending
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {transaction.workflow.depositZellePending ? '✓ Zelle Pending ON' : 'Toggle Zelle Pending'}
                      </button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Transaction Timeline */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Transaction Timeline
                </h3>
                <div className="relative">
                  {[
                    { step: 'Offer Submitted & Approved', completed: true, date: transaction.createdAt },
                    { step: 'Deposit Payment ($1,000)', completed: transaction.depositPaid, date: transaction.depositPaidAt },
                    { step: 'Transaction Room Opened', completed: true, date: transaction.createdAt },
                    { step: 'Document Review Period', completed: transaction.buyerApproved || transaction.sellerApproved, date: null },
                    { step: 'Buyer Approval', completed: transaction.buyerApproved, date: transaction.buyerApprovedAt },
                    { step: 'Seller Approval', completed: transaction.sellerApproved, date: transaction.sellerApprovedAt },
                    { step: 'Admin Final Review & Approval', completed: transaction.adminApproved, date: transaction.adminApprovedAt },
                    { step: 'Final Payment Instructions Sent', completed: !!transaction.paymentInstructions, date: transaction.adminApprovedAt },
                    { step: 'Final Payment Received', completed: transaction.finalPaymentPaid, date: transaction.finalPaymentPaidAt },
                    { step: 'MC Authority & Documents Transferred', completed: transaction.status === 'completed', date: transaction.completedAt },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {item.completed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <span className="w-3 h-3 rounded-full bg-gray-300" />
                          )}
                        </div>
                        {index < 9 && (
                          <div className={`w-0.5 h-full mt-2 ${item.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-2">
                        <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.step}
                        </p>
                        {item.date && (
                          <p className="text-sm text-gray-500">
                            {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Actions & Quick Info */}
            <div className="space-y-6">
              {/* Platform Integrations */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Integrations</h3>
                <div className="space-y-4">
                  {/* Amazon Relay */}
                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Amazon Relay</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                        {transaction.platformIntegrations.amazonRelay.score}-Rating
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Completed Loads</p>
                        <p className="font-medium">{transaction.platformIntegrations.amazonRelay.loads}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Member Since</p>
                        <p className="font-medium">{transaction.platformIntegrations.amazonRelay.memberSince.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highway */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">Highway.com</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {transaction.platformIntegrations.highway.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {transaction.platformIntegrations.highway.factoring && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Factoring</span>
                      )}
                      {transaction.platformIntegrations.highway.quickPay && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">QuickPay</span>
                      )}
                    </div>
                  </div>

                  {/* DAT */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">DAT Load Board</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {transaction.platformIntegrations.dat.rating}% Rating
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Safety Summary */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">SAFER Rating</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {transaction.safetyRecord.saferScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Inspections</span>
                    <span className="font-medium">{transaction.safetyRecord.totalInspections}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">OOS Rate</span>
                    <span className="font-medium">{transaction.safetyRecord.outOfServiceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Crashes</span>
                    <span className="font-medium">{transaction.safetyRecord.totalCrashes} (0 fatal)</span>
                  </div>
                </div>
              </Card>

              {/* Action Card */}
              {canApprove() && transaction.status !== 'completed' && (
                <Card className="bg-green-50 border-2 border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">
                    {userRole === 'admin' ? 'Ready for Final Approval' : 'Ready to Approve?'}
                  </h3>
                  <p className="text-sm text-green-700 mb-4">
                    {userRole === 'buyer' && 'Review all documents and business details before approving.'}
                    {userRole === 'seller' && 'Confirm all information is accurate and approve the sale.'}
                    {userRole === 'admin' && 'Both parties approved. Finalize and send payment instructions.'}
                  </p>
                  <Button
                    onClick={handleApprove}
                    loading={approving}
                    fullWidth
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {userRole === 'admin' ? 'Finalize Transaction' : 'Approve Transaction'}
                  </Button>
                </Card>
              )}

              {/* Payment Instructions */}
              {transaction.paymentInstructions && userRole === 'buyer' && (
                <Card className="bg-amber-50 border-2 border-amber-200">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-amber-800 mb-2">Payment Instructions</h3>
                      <pre className="text-xs text-amber-700 whitespace-pre-wrap font-mono bg-amber-100 rounded-lg p-3 overflow-x-auto">
                        {transaction.paymentInstructions}
                      </pre>
                    </div>
                  </div>
                </Card>
              )}

              {/* Admin Payment Action */}
              {userRole === 'admin' && transaction.status === 'payment-pending' && (
                <Card className="bg-blue-50 border-2 border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">Awaiting Payment</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    Payment instructions sent. Mark as complete once verified.
                  </p>
                  <Button onClick={() => setShowPaymentModal(true)} fullWidth>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Mark Payment Received
                  </Button>
                </Card>
              )}

              {/* Completed State */}
              {transaction.status === 'completed' && (
                <Card className="bg-green-50 border-2 border-green-200">
                  <div className="text-center py-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-green-800 mb-2">Transaction Complete!</h3>
                    <p className="text-sm text-green-700 mb-4">
                      {userRole === 'buyer'
                        ? 'All documents are now available for download.'
                        : userRole === 'seller'
                        ? 'Payment will be processed within 2-3 business days.'
                        : 'All parties have been notified.'}
                    </p>
                    {userRole === 'buyer' && (
                      <Button fullWidth>
                        <Download className="w-4 h-4 mr-2" />
                        Download All Documents
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'parties' && (
          <motion.div
            key="parties"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Seller Contact Info */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  Seller
                </h3>
                {transaction.sellerInfo.verificationStatus === 'verified' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              {/* Seller Contact - Hidden from buyers until transaction completed */}
              {userRole === 'buyer' && !canBuyerSeeSellerInfo ? (
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-400">Contact Hidden</p>
                      <p className="text-sm text-gray-400">Released after final payment</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-400">
                      <Phone className="w-4 h-4" />
                      <span className="blur-sm select-none">+1 (555) ***-****</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span className="blur-sm select-none">seller@*****.com</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{transaction.sellerInfo.contactName}</p>
                      <p className="text-sm text-gray-500">{transaction.seller.name}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <a href={`tel:${transaction.sellerInfo.contactPhone}`} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-purple-100 transition-colors">
                      <Phone className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-900 font-medium">{transaction.sellerInfo.contactPhone}</span>
                    </a>
                    <a href={`mailto:${transaction.sellerInfo.contactEmail}`} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-purple-100 transition-colors">
                      <Mail className="w-5 h-5 text-purple-600" />
                      <span className="text-gray-900 font-medium">{transaction.sellerInfo.contactEmail}</span>
                    </a>
                  </div>
                </div>
              )}
            </Card>

            {/* Buyer Contact Info */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Buyer
                </h3>
                {transaction.buyerInfo.verificationStatus === 'verified' && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{transaction.buyerInfo.contactName}</p>
                    <p className="text-sm text-gray-500">{transaction.buyerInfo.companyName}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <a href={`tel:${transaction.buyerInfo.contactPhone}`} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">{transaction.buyerInfo.contactPhone}</span>
                  </a>
                  <a href={`mailto:${transaction.buyerInfo.contactEmail}`} className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">{transaction.buyerInfo.contactEmail}</span>
                  </a>
                </div>
              </div>
            </Card>

            {/* Admin/Facilitator - Full Width */}
            <Card className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Domilea</h3>
                  <p className="text-sm text-gray-500">Transaction Facilitator</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="mailto:support@domilea.com" className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-900 font-medium">support@domilea.com</span>
                </a>
                <a href="tel:+18005551234" className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  <Phone className="w-5 h-5 text-amber-600" />
                  <span className="text-gray-900 font-medium">1-800-555-1234</span>
                </a>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">Escrow Protected</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'business' && (
          <motion.div
            key="business"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Company Information */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Legal Name</p>
                    <p className="font-medium text-gray-900">{transaction.businessDetails.legalName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">DBA</p>
                    <p className="font-medium text-gray-900">{transaction.businessDetails.dba}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">MC Number</p>
                    <p className="font-medium text-gray-900">#{transaction.businessDetails.mcNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">DOT Number</p>
                    <p className="font-medium text-gray-900">#{transaction.businessDetails.dotNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">EIN</p>
                    <p className="font-medium text-gray-900">{transaction.businessDetails.einNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Entity Type</p>
                    <p className="font-medium text-gray-900">{transaction.businessDetails.entityType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State of Incorporation</p>
                    <p className="font-medium text-gray-900">{transaction.businessDetails.stateOfIncorporation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date Established</p>
                    <p className="font-medium text-gray-900">{transaction.businessDetails.dateEstablished.toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Business Address</p>
                  <p className="font-medium text-gray-900 flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    {transaction.businessDetails.businessAddress}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {transaction.businessDetails.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {transaction.businessDetails.email}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Operations */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Operations
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Operating Status</p>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                    {transaction.businessDetails.operatingStatus}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Operation Classification</p>
                  <div className="flex flex-wrap gap-2">
                    {transaction.businessDetails.operationClassification.map((op, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {op}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Cargo Types</p>
                  <div className="flex flex-wrap gap-2">
                    {transaction.businessDetails.cargoTypes.map((cargo, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {cargo}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Equipment Types</p>
                  <div className="flex flex-wrap gap-2">
                    {transaction.businessDetails.equipmentTypes.map((eq, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Operating Radius</p>
                    <p className="font-medium text-gray-900">{transaction.businessDetails.radius}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Hazmat</p>
                      <p className="font-medium text-gray-900">
                        {transaction.businessDetails.hazmatCertified ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bonded</p>
                      <p className="font-medium text-gray-900">
                        {transaction.businessDetails.bondedCarrier ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Safety Record */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety Record (FMCSA)
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <span className="font-medium text-gray-900">SAFER Rating</span>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-lg">
                    {transaction.safetyRecord.saferScore}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{transaction.safetyRecord.totalInspections}</p>
                    <p className="text-sm text-gray-500">Inspections</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{transaction.safetyRecord.outOfServiceRate}%</p>
                    <p className="text-sm text-gray-500">OOS Rate</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">{transaction.safetyRecord.totalCrashes}</p>
                    <p className="text-sm text-gray-500">Crashes</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-3">BASIC Scores</p>
                  <div className="space-y-2">
                    {Object.entries(transaction.safetyRecord.basicScores).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-40 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${value < 50 ? 'bg-green-500' : value < 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-10 text-right">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Insurance */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Insurance & Bond
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Liability Insurance</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {transaction.insuranceInfo.liabilityInsurance.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Provider</p>
                      <p className="font-medium">{transaction.insuranceInfo.liabilityInsurance.provider}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Coverage</p>
                      <p className="font-medium">${transaction.insuranceInfo.liabilityInsurance.coverage.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Policy #</p>
                      <p className="font-medium">{transaction.insuranceInfo.liabilityInsurance.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expires</p>
                      <p className="font-medium">{transaction.insuranceInfo.liabilityInsurance.expirationDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Cargo Insurance</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {transaction.insuranceInfo.cargoInsurance.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Coverage</p>
                      <p className="font-medium">${transaction.insuranceInfo.cargoInsurance.coverage.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expires</p>
                      <p className="font-medium">{transaction.insuranceInfo.cargoInsurance.expirationDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Surety Bond</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                      {transaction.insuranceInfo.bondInfo.status}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-500">{transaction.insuranceInfo.bondInfo.type}</p>
                    <p className="font-medium">${transaction.insuranceInfo.bondInfo.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {activeTab === 'documents' && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Transaction Documents</h3>
                  <p className="text-sm text-gray-500">{transaction.sellerDocuments.length} documents uploaded</p>
                </div>
                {userRole === 'seller' && (
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                )}
              </div>

              {transaction.status !== 'completed' && userRole === 'buyer' && (
                <div className="bg-yellow-50 rounded-xl p-4 mb-6">
                  <div className="flex gap-3">
                    <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Documents Locked</p>
                      <p className="text-yellow-700">
                        Full document downloads will be available after transaction completion.
                        You can preview documents during the review period.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {Object.entries(groupedDocuments).map(([category, docs]) => (
                  <div key={category}>
                    <h4 className="font-medium text-gray-700 mb-3 capitalize flex items-center gap-2">
                      {getDocumentIcon(category)}
                      {category.replace('-', ' ')} Documents ({docs.length})
                    </h4>
                    <div className="space-y-2">
                      {docs.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                              {getDocumentIcon(doc.type)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                <span>by {doc.uploadedBy === 'seller' ? transaction.seller.name : 'Admin'}</span>
                              </div>
                            </div>
                            {doc.verified && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Preview
                            </Button>
                            {(transaction.status === 'completed' || userRole !== 'buyer') && (
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {transaction.status === 'completed' && userRole === 'buyer' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button fullWidth size="lg">
                    <Download className="w-5 h-5 mr-2" />
                    Download All Documents (ZIP)
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'financials' && (
          <motion.div
            key="financials"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Transaction Financials - Role Specific */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Transaction Financials
              </h3>
              {userRole === 'seller' ? (
                // Seller sees their listing price and payout info
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Your Listing Price</span>
                    <span className="font-semibold text-gray-900">${transaction.listing.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Buyer Deposit (Escrow)</span>
                    <span className="font-semibold text-blue-600">${transaction.depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-green-800">Your Payout</span>
                      <span className="text-2xl font-bold text-green-700">${transaction.listing.price.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      Payout will be processed within 2-3 business days after transaction completion
                    </p>
                  </div>
                </div>
              ) : userRole === 'buyer' ? (
                // Buyer sees their price and payment breakdown
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Listed Price</span>
                    <span className="text-gray-400 line-through">${transaction.listing.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Your Purchase Price</span>
                    <span className="font-semibold text-gray-900">${transaction.agreedPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Deposit Paid</span>
                    <span className="font-semibold text-blue-600">-${transaction.depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-lg font-semibold text-gray-900">Balance Due</span>
                    <span className="text-2xl font-bold text-gray-900">${transaction.finalPaymentAmount.toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                // Admin sees full breakdown with commission
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Seller's Listing Price</span>
                    <span className="font-semibold text-gray-900">${transaction.listing.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Buyer's Purchase Price</span>
                    <span className="font-semibold text-gray-900">${transaction.agreedPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Platform Commission</span>
                    <span className="font-semibold text-amber-600">${(transaction.agreedPrice - transaction.listing.price).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Deposit Held</span>
                    <span className="font-semibold text-blue-600">${transaction.depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Seller Payout</p>
                      <p className="text-xl font-bold text-green-700">${transaction.listing.price.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-600">Platform Revenue</p>
                      <p className="text-xl font-bold text-amber-700">${(transaction.agreedPrice - transaction.listing.price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Business Financial History */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Business Financial History
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600 mb-1">Estimated Annual Revenue</p>
                  <p className="text-2xl font-bold text-green-700">
                    ${transaction.financialHistory.annualRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Avg Monthly Loads</p>
                    <p className="text-xl font-bold text-gray-900">{transaction.financialHistory.avgMonthlyLoads}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Avg Rate/Mile</p>
                    <p className="text-xl font-bold text-gray-900">${transaction.financialHistory.avgRatePerMile}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Annual Expenses (Estimated)</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fuel Costs</span>
                      <span className="font-medium">${transaction.financialHistory.fuelCosts.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Maintenance</span>
                      <span className="font-medium">${transaction.financialHistory.maintenanceCosts.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">${transaction.financialHistory.insuranceCosts.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Outstanding Debts/Liens</span>
                    <span className={`font-bold ${transaction.financialHistory.outstandingDebts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {transaction.financialHistory.outstandingDebts > 0
                        ? `$${transaction.financialHistory.outstandingDebts.toLocaleString()}`
                        : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* UCC Filings */}
            <Card className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5" />
                UCC Filings & Liens
              </h3>
              {transaction.financialHistory.uccFilings.length === 0 ? (
                <div className="text-center py-8 bg-green-50 rounded-xl">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-green-800">No Active UCC Filings</p>
                  <p className="text-sm text-green-600">This MC authority has no outstanding liens or encumbrances.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transaction.financialHistory.uccFilings.map((filing) => (
                    <div key={filing.id} className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">UCC-1 Filing</p>
                          <p className="text-sm text-gray-500">
                            Filed: {filing.filingDate.toLocaleDateString()} | Secured Party: {filing.securedParty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-yellow-700">${filing.amount.toLocaleString()}</p>
                          <span className="text-sm text-yellow-600">{filing.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {transaction.messages.map((msg) => {
                  const isOwn = msg.senderId === user?.id || (userRole === msg.senderRole)
                  const roleColors = {
                    buyer: 'bg-blue-100 text-blue-800',
                    seller: 'bg-purple-100 text-purple-800',
                    admin: 'bg-amber-100 text-amber-800'
                  }

                  if (msg.isSystemMessage) {
                    return (
                      <div key={msg.id} className="text-center">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {msg.message}
                        </span>
                      </div>
                    )
                  }

                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%]`}>
                        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${roleColors[msg.senderRole]}`}>
                            {msg.senderRole.charAt(0).toUpperCase() + msg.senderRole.slice(1)}
                          </span>
                          <span className="text-sm font-medium text-gray-900">{msg.senderName}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`p-3 rounded-xl ${isOwn ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-100 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim() || sendingMessage}>
                    {sendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Confirmation Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Payment Received</h2>
              <p className="text-gray-600 mb-4">
                This will complete the transaction and release all documents to the buyer.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Final Payment Amount</span>
                  <span className="text-xl font-bold text-gray-900">${transaction.finalPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">+ Deposit Already Paid</span>
                  <span className="text-gray-500">${transaction.depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total Transaction Value</span>
                  <span className="font-bold text-green-600">${transaction.agreedPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setShowPaymentModal(false)}>
                  Cancel
                </Button>
                <Button fullWidth onClick={handleFinalPayment} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm & Complete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TransactionRoomPage
