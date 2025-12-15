import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Shield,
  CheckCircle,
  Lock,
  DollarSign,
  Building2,
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const BuyerDepositPage = () => {
  const { offerId } = useParams()
  const navigate = useNavigate()
  const { user: _user } = useAuth()

  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  // Mock offer data (in real app, fetch by offerId)
  const offer = {
    id: offerId,
    listing: {
      mcNumber: '123456',
      title: '7-Year Premium MC Authority',
      price: 22000
    },
    offerAmount: 20000,
    depositAmount: 1000,
    seller: {
      name: 'Quick Haul LLC'
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500))

    setProcessing(false)
    setPaymentComplete(true)
  }

  if (paymentComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Deposit Received!</h1>
          <p className="text-gray-500 mb-6">
            Your $1,000 deposit has been successfully processed. A transaction room is being created
            where you can work with the seller and admin to complete the purchase.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Transaction room created for you, seller, and admin</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Review all MC documents and information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Both parties approve the transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Admin provides final payment instructions</span>
              </li>
            </ul>
          </div>
          <Button onClick={() => navigate('/buyer/transactions')} fullWidth>
            Go to Transaction Room
          </Button>
        </motion.div>
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
            Seller: {offer.seller.name}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Asking Price</span>
            <span className="text-gray-900">${offer.listing.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Your Offer</span>
            <span className="font-medium text-gray-900">${offer.offerAmount.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="font-medium text-gray-900">Deposit Due Now</span>
            <span className="text-xl font-bold text-gray-900">${offer.depositAmount.toLocaleString()}</span>
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

      {/* Payment Form */}
      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-500">Secure Payment</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
              placeholder="John Smith"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-900"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={processing}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pay $1,000 Deposit
                </>
              )}
            </Button>
          </div>
        </form>

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
