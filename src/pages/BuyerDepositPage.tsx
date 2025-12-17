import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Shield,
  CheckCircle,
  Lock,
  DollarSign,
  Building2,
  ArrowLeft,
  AlertCircle,
  Loader2,
  ExternalLink
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

interface OfferData {
  id: string
  listing: {
    mcNumber: string
    title: string
    price: number
    seller?: {
      name: string
    }
  }
  amount: number
  counterAmount?: number
  transaction?: {
    id: string
    depositAmount: number
    agreedPrice: number
    status: string
  }
  seller?: {
    name: string
  }
}

const BuyerDepositPage = () => {
  const { offerId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user: _user } = useAuth()

  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offer, setOffer] = useState<OfferData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [_transactionId, setTransactionId] = useState<string | null>(null)

  // Check for cancelled payment from URL params
  useEffect(() => {
    const depositStatus = searchParams.get('deposit')
    if (depositStatus === 'cancelled') {
      toast.error('Payment was cancelled. You can try again.')
    }
  }, [searchParams])

  // Fetch offer data from API
  useEffect(() => {
    const fetchOffer = async () => {
      if (!offerId) {
        setError('No offer ID provided')
        setLoading(false)
        return
      }

      try {
        const response = await api.getOffer(offerId)
        if (response.success && response.data) {
          setOffer(response.data)
          if (response.data.transaction?.id) {
            setTransactionId(response.data.transaction.id)
          }
        } else {
          setError('Offer data not found')
        }
      } catch (err: any) {
        console.error('Error fetching offer:', err)
        setError(err.message || 'Failed to load offer data')
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [offerId])

  const handlePayDeposit = async () => {
    if (!offerId) return

    setProcessing(true)

    try {
      // Create Stripe checkout session
      const response = await api.createDepositCheckout(offerId)

      if (response.success && response.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url
      } else {
        toast.error('Failed to create checkout session')
        setProcessing(false)
      }
    } catch (err: any) {
      console.error('Payment error:', err)
      toast.error(err.message || 'Failed to initiate payment')
      setProcessing(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-500">Loading offer details...</p>
        </div>
      </div>
    )
  }

  // Error state (no offer data)
  if (error || !offer) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <Card>
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Offer Not Found</h2>
            <p className="text-gray-500 mb-6">
              {error || 'The offer you are looking for could not be loaded.'}
            </p>
            <Button onClick={() => navigate('/buyer/unlocked')}>
              View Unlocked MCs
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Unlocked MCs
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pay Deposit</h1>
        <p className="text-gray-500">Secure your offer with a refundable deposit</p>
      </div>

      {/* Order Summary */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Summary</h2>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">MC #{offer.listing.mcNumber}</p>
              <p className="text-sm text-gray-500">{offer.listing.title}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Seller: {offer.listing?.seller?.name || offer.seller?.name || 'Unknown'}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Asking Price</span>
            <span className="text-gray-900">${offer.listing.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Agreed Amount</span>
            <span className="font-medium text-gray-900">${(offer.counterAmount || offer.amount).toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="font-medium text-gray-900">Deposit Due Now</span>
            <span className="text-xl font-bold text-gray-900">
              ${(offer.transaction?.depositAmount || 1000).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="mt-4 bg-green-50 rounded-xl p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Fully Refundable Deposit</p>
              <p className="text-green-700">
                Your deposit is held in escrow and fully refundable if the transaction doesn't proceed.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Section */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Secure Payment via Stripe</span>
        </div>

        <div className="text-center py-4">
          <p className="text-gray-600 mb-6">
            You'll be redirected to Stripe's secure checkout page to complete your payment.
          </p>

          <Button
            onClick={handlePayDeposit}
            fullWidth
            size="lg"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5 mr-2" />
                Pay ${(offer?.transaction?.depositAmount || 1000).toLocaleString()} Deposit
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Lock className="w-4 h-4" />
            SSL Encrypted
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4" />
            PCI Compliant
          </div>
        </div>
      </Card>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">About the Deposit</p>
            <ul className="space-y-1 text-blue-700">
              <li>- Deposit secures your position and opens the transaction room</li>
              <li>- Held in secure escrow until transaction completes</li>
              <li>- Deducted from final purchase price upon completion</li>
              <li>- Fully refundable if deal doesn't proceed</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default BuyerDepositPage
