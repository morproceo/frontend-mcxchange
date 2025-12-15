import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Coins,
  Check,
  Sparkles,
  Zap,
  Crown,
  CreditCard,
  Shield,
  ArrowLeft,
  Star,
  TrendingUp,
  Unlock
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 19.99,
    credits: 4,
    icon: Coins,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
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
    color: 'from-primary-500 to-purple-500',
    bgColor: 'from-primary-500/10 to-purple-500/10',
    borderColor: 'border-primary-500/30',
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
    bgColor: 'from-yellow-500/10 to-orange-500/10',
    borderColor: 'border-yellow-500/30',
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

const BuyerSubscriptionPage = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>('professional')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentCredits] = useState(4) // Mock current credits

  const handleSubscribe = async (_planId: string) => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    // In real app, would process payment and redirect
    navigate('/buyer/dashboard')
  }

  const getYearlyPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.8).toFixed(2) // 20% discount for yearly
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-4"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Unlock More MC Authorities</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Choose Your Plan
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            Get credits to unlock full MC details and find the perfect authority for your business
          </motion.p>

          {/* Current Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10"
          >
            <Coins className="w-5 h-5 text-yellow-400" />
            <span className="text-white/60">Current Balance:</span>
            <span className="text-2xl font-bold text-yellow-400">{currentCredits}</span>
            <span className="text-white/60">credits</span>
          </motion.div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="glass rounded-xl p-1 flex items-center gap-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-primary-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-primary-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 rounded text-xs bg-trust-high/20 text-trust-high font-bold">
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
            const price = billingCycle === 'monthly' ? plan.price : Number(getYearlyPrice(plan.price))

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard
                  className={`relative overflow-hidden cursor-pointer transition-all ${
                    isSelected ? `ring-2 ring-primary-500 ${plan.borderColor}` : ''
                  } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary-500 to-purple-500 text-center py-1 text-xs font-bold">
                      MOST POPULAR
                    </div>
                  )}

                  <div className={`bg-gradient-to-r ${plan.bgColor} -m-6 ${plan.popular ? 'mt-2' : ''} mb-6 p-6 border-b border-white/10`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <p className="text-sm text-white/60">{plan.credits} credits/month</p>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${billingCycle === 'monthly' ? plan.price : (price / 12).toFixed(2)}</span>
                      <span className="text-white/60">/month</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <p className="text-sm text-white/60 mt-1">
                        Billed ${price} annually
                      </p>
                    )}
                  </div>

                  {/* Credits Highlight */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mb-6">
                    <Coins className="w-8 h-8 text-yellow-400" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">{plan.credits}</div>
                      <div className="text-sm text-white/60">MC unlock credits</div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <Check className={`w-4 h-4 ${plan.popular ? 'text-primary-400' : 'text-trust-high'}`} />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Select Button */}
                  <Button
                    fullWidth
                    variant={isSelected ? 'primary' : 'secondary'}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedPlan(plan.id)
                    }}
                    className={isSelected ? `bg-gradient-to-r ${plan.color}` : ''}
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
                </GlassCard>
              </motion.div>
            )
          })}
        </div>

        {/* Payment Section */}
        {selectedPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="max-w-2xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-pink-500/10 -m-6 mb-6 p-6 border-b border-white/10">
                <h2 className="text-2xl font-bold mb-2">Complete Your Subscription</h2>
                <p className="text-white/60">
                  {plans.find(p => p.id === selectedPlan)?.name} Plan - {plans.find(p => p.id === selectedPlan)?.credits} credits/month
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/60">
                    {plans.find(p => p.id === selectedPlan)?.name} ({billingCycle})
                  </span>
                  <span className="font-semibold">
                    ${billingCycle === 'monthly'
                      ? plans.find(p => p.id === selectedPlan)?.price
                      : getYearlyPrice(plans.find(p => p.id === selectedPlan)?.price || 0)
                    }
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="flex justify-between text-sm text-trust-high">
                    <span>Annual discount (20%)</span>
                    <span>
                      -${((plans.find(p => p.id === selectedPlan)?.price || 0) * 12 * 0.2).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-primary-400">
                    ${billingCycle === 'monthly'
                      ? plans.find(p => p.id === selectedPlan)?.price
                      : getYearlyPrice(plans.find(p => p.id === selectedPlan)?.price || 0)
                    }
                  </span>
                </div>
              </div>

              {/* Payment Form */}
              <div className="space-y-4 mb-6">
                <Input
                  label="Card Number"
                  placeholder="4242 4242 4242 4242"
                  icon={<CreditCard className="w-4 h-4" />}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    placeholder="MM/YY"
                  />
                  <Input
                    label="CVC"
                    placeholder="123"
                  />
                </div>
                <Input
                  label="Cardholder Name"
                  placeholder="John Doe"
                />
              </div>

              {/* Security Notice */}
              <div className="p-4 rounded-xl bg-trust-high/10 border border-trust-high/30 flex items-start gap-3 mb-6">
                <Shield className="w-5 h-5 text-trust-high flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-trust-high mb-1">Secure Payment</p>
                  <p className="text-white/70">Your payment is encrypted and secure. Cancel anytime.</p>
                </div>
              </div>

              {/* Subscribe Button */}
              <Button
                fullWidth
                size="lg"
                onClick={() => handleSubscribe(selectedPlan)}
                loading={isProcessing}
                className="bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Subscribe Now
              </Button>

              <p className="text-xs text-center text-white/40 mt-4">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription at any time.
              </p>
            </GlassCard>
          </motion.div>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Get Credits?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Unlock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Full MC Details</h3>
              <p className="text-white/60 text-sm">
                Unlock complete information including legal name, address, contact details, and more.
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Verified Information</h3>
              <p className="text-white/60 text-sm">
                All MC data is verified through FMCSA and other official sources.
              </p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-trust-high to-green-500 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Make Better Decisions</h3>
              <p className="text-white/60 text-sm">
                Access Amazon scores, factoring info, and compliance status before buying.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerSubscriptionPage
