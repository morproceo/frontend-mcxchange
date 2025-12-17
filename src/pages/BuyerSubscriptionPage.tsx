import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Coins,
  Check,
  Sparkles,
  Zap,
  Crown,
  Shield,
  ArrowLeft,
  Star,
  TrendingUp,
  Unlock,
  CheckCircle,
  XCircle,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19.99,
    credits: 4,
    icon: Coins,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    popular: false,
    features: [
      '4 MC unlock credits',
      'Basic support',
      'Access to marketplace',
      'Save favorites',
      'Email notifications'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 39.99,
    credits: 10,
    icon: Zap,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    popular: true,
    features: [
      '10 MC unlock credits',
      'Priority support',
      'Access to marketplace',
      'Save unlimited favorites',
      'Email & SMS notifications',
      'Early access to new listings',
      'Price drop alerts'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 79.99,
    credits: 25,
    icon: Crown,
    color: 'from-yellow-500 to-orange-500',
    bgColor: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    popular: false,
    features: [
      '25 MC unlock credits',
      'Dedicated account manager',
      'Access to marketplace',
      'Unlimited favorites',
      'Priority notifications',
      'Early access to new listings',
      'Price drop alerts',
      'Bulk unlock discounts',
      'API access'
    ]
  }
]

interface Subscription {
  id: string
  plan: string
  status: string
  creditsPerMonth: number
  creditsRemaining: number
  startDate: string
  endDate: string
  renewalDate: string
  isYearly: boolean
}

const BuyerSubscriptionPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isLoading: authLoading } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<string | null>('professional')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [credits, setCredits] = useState({ total: 0, used: 0, available: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Check URL params for success/cancel and verify subscription
  useEffect(() => {
    const verifyAndFulfill = async () => {
      if (searchParams.get('success') === 'true' && user) {
        try {
          // Call verify endpoint to ensure subscription is fulfilled and credits are added
          const response = await api.verifySubscription()
          if (response.data?.fulfilled) {
            setSuccessMessage('Subscription activated successfully! Your credits have been added.')
            // Refresh subscription data to show updated credits
            const subResponse = await api.getSubscription()
            if (subResponse.data) {
              setSubscription(subResponse.data.subscription)
              setCredits(subResponse.data.credits)
            }
          } else {
            setSuccessMessage('Subscription payment received! Processing your credits...')
          }
        } catch (err) {
          console.error('Failed to verify subscription:', err)
          // Still try to refresh subscription data even if verify failed
          try {
            const subResponse = await api.getSubscription()
            if (subResponse.data) {
              setSubscription(subResponse.data.subscription)
              setCredits(subResponse.data.credits)
            }
          } catch (subErr) {
            console.error('Failed to fetch subscription:', subErr)
          }
          setSuccessMessage('Subscription payment received! Your account will be updated shortly.')
        }
        // Clear the success param from URL to prevent re-verification on refresh
        window.history.replaceState({}, '', '/buyer/subscription')
      }
    }
    verifyAndFulfill()

    if (searchParams.get('canceled') === 'true') {
      setError('Subscription checkout was canceled.')
    }
  }, [searchParams, user])

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscription = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        return
      }

      // Only fetch if user is authenticated
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await api.getSubscription()
        setSubscription(response.data.subscription)
        setCredits(response.data.credits)
      } catch (err: any) {
        console.error('Failed to fetch subscription:', err)
        // If 401 error, the token is invalid - don't show error to user
        if (err.message?.includes('401') || err.message?.includes('No token') || err.message?.includes('Access denied')) {
          // Token is invalid, let auth context handle cleanup
          setSubscription(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user, authLoading])

  const handleSubscribe = async (planId: string) => {
    // Check if user is authenticated - rely on AuthContext state, not api.getToken()
    // which may have timing issues between token being set and React state updating
    if (!user) {
      navigate('/login?redirect=/buyer/subscription')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await api.createSubscriptionCheckout(planId, billingCycle === 'yearly')

      // Redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Failed to create checkout session')
      setIsProcessing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      await api.cancelSubscription()
      setSuccessMessage('Subscription cancelled successfully. You will retain access until the end of your billing period.')
      // Refresh subscription data
      const response = await api.getSubscription()
      setSubscription(response.data.subscription)
    } catch (err: any) {
      console.error('Cancel error:', err)
      setError(err.message || 'Failed to cancel subscription')
    } finally {
      setIsProcessing(false)
    }
  }

  // Manual verify/sync subscription for users who paid but credits weren't added
  const handleVerifySubscription = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await api.verifySubscription()
      if (response.data?.fulfilled) {
        setSuccessMessage('Subscription verified! Your credits have been added.')
        // Refresh subscription data
        const subResponse = await api.getSubscription()
        if (subResponse.data) {
          setSubscription(subResponse.data.subscription)
          setCredits(subResponse.data.credits)
        }
      } else {
        setError(response.data?.message || 'No active subscription found. Please complete checkout.')
      }
    } catch (err: any) {
      console.error('Verify error:', err)
      setError(err.message || 'Failed to verify subscription')
    } finally {
      setIsProcessing(false)
    }
  }

  const getYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.8).toFixed(2)
  }

  const currentCredits = credits.available

  // Show loading state while auth is initializing or fetching subscription
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Show current subscription if user has one
  const hasActiveSubscription = subscription && subscription.status === 'ACTIVE'

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{successMessage}</p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Current Subscription Card */}
        {hasActiveSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border-purple-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Active Subscription</h2>
                      <p className="text-gray-600 capitalize">{subscription.plan.toLowerCase()} Plan</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span>{subscription.creditsRemaining} credits remaining</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Renews {new Date(subscription.renewalDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  loading={isProcessing}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Cancel Subscription
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 mb-4"
          >
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">
              {hasActiveSubscription ? 'Upgrade Your Plan' : 'Unlock More MC Authorities'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            {hasActiveSubscription ? 'Change Your Plan' : 'Choose Your Plan'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Get credits to unlock full MC details and find the perfect authority for your business
          </motion.p>

          {/* Current Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-sm">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600">Current Balance:</span>
              <span className="text-2xl font-bold text-yellow-600">{currentCredits}</span>
              <span className="text-gray-600">credits</span>
            </div>
            {/* Show verify button if user might have paid but credits weren't added */}
            {currentCredits === 0 && (
              <button
                onClick={handleVerifySubscription}
                disabled={isProcessing}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2 transition-colors"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                Already paid? Click to sync your subscription
              </button>
            )}
          </motion.div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 flex items-center gap-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id
            const isCurrentPlan = hasActiveSubscription && subscription.plan.toLowerCase() === plan.id
            const price = billingCycle === 'monthly' ? plan.price : Number(getYearlyPrice(plan.price))

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  className={`relative overflow-hidden cursor-pointer transition-all ${
                    isSelected ? `ring-2 ring-gray-900 ${plan.borderColor}` : ''
                  } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''} ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                  onClick={() => !isCurrentPlan && setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-1 text-xs font-bold">
                      MOST POPULAR
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-1 text-xs font-bold">
                      CURRENT PLAN
                    </div>
                  )}

                  <div className={`bg-gradient-to-r ${plan.bgColor} -m-6 ${plan.popular || isCurrentPlan ? 'mt-2' : ''} mb-6 p-6 border-b border-gray-100`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-sm text-gray-500">{plan.credits} credits/month</p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">${billingCycle === 'monthly' ? plan.price : (price / 12).toFixed(2)}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Billed ${price} annually
                      </p>
                    )}
                  </div>

                  {/* Credits Highlight */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 mb-6">
                    <Coins className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">{plan.credits}</div>
                      <div className="text-sm text-gray-600">MC unlock credits</div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <Check className={`w-4 h-4 ${plan.popular ? 'text-purple-500' : 'text-green-500'}`} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  {isCurrentPlan ? (
                    <Button
                      fullWidth
                      variant="outline"
                      disabled
                      className="bg-green-50 border-green-200 text-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant={isSelected ? 'primary' : 'outline'}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPlan(plan.id)
                      }}
                      className={isSelected ? `bg-gradient-to-r ${plan.color} border-0` : ''}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selected
                        </>
                      ) : (
                        'Select Plan'
                      )}
                    </Button>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Checkout Section */}
        {selectedPlan && (!hasActiveSubscription || subscription.plan.toLowerCase() !== selectedPlan) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="max-w-2xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 -m-6 mb-6 p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {hasActiveSubscription ? 'Upgrade Your Subscription' : 'Complete Your Subscription'}
                </h2>
                <p className="text-gray-600">
                  {plans.find(p => p.id === selectedPlan)?.name} Plan - {plans.find(p => p.id === selectedPlan)?.credits} credits/month
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">
                    {plans.find(p => p.id === selectedPlan)?.name} ({billingCycle})
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${billingCycle === 'monthly'
                      ? plans.find(p => p.id === selectedPlan)?.price
                      : getYearlyPrice(plans.find(p => p.id === selectedPlan)?.price || 0)
                    }
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Annual discount (20%)</span>
                    <span>
                      -${((plans.find(p => p.id === selectedPlan)?.price || 0) * 12 * 0.2).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${billingCycle === 'monthly'
                      ? plans.find(p => p.id === selectedPlan)?.price
                      : getYearlyPrice(plans.find(p => p.id === selectedPlan)?.price || 0)
                    }
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3 mb-6">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-green-700 mb-1">Secure Payment via Stripe</p>
                  <p className="text-gray-600">Your payment is encrypted and secure. Cancel anytime.</p>
                </div>
              </div>

              {/* Subscribe Button */}
              <Button
                fullWidth
                size="lg"
                onClick={() => handleSubscribe(selectedPlan)}
                loading={isProcessing}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {hasActiveSubscription ? 'Upgrade Now' : 'Subscribe Now'}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription at any time.
              </p>
            </Card>
          </motion.div>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Get Credits?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Full MC Details</h3>
              <p className="text-gray-600 text-sm">
                Unlock complete information including legal name, address, contact details, and more.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Information</h3>
              <p className="text-gray-600 text-sm">
                All MC data is verified through FMCSA and other official sources.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Make Better Decisions</h3>
              <p className="text-gray-600 text-sm">
                Access Amazon scores, factoring info, and compliance status before buying.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerSubscriptionPage
