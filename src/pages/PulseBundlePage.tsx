import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  ShieldAlert,
  FileBarChart,
  Check,
  Sparkles,
  Loader2,
  Package,
  Zap,
  ArrowRight,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { toast } from 'react-hot-toast'

const PulseBundlePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const monthlyPrice = 14.99
  const yearlyPrice = 143.90
  const yearlyMonthly = (yearlyPrice / 12)
  const savings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100)

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/login?redirect=/buyer/package-tool')
      return
    }

    setIsProcessing(true)
    try {
      const response = await api.createSubscriptionCheckout('package_tool', billingCycle === 'yearly')
      if (response.data?.url) {
        window.location.href = response.data.url
      } else {
        toast.error('Failed to create checkout session')
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }

  const tools = [
    {
      icon: Activity,
      name: 'CarrierPulse',
      description: 'Full carrier intelligence dashboard with BASIC scores, inspection history, crash data, violations, insurance status, and fleet details. Powered by live FMCSA data.',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      icon: ShieldAlert,
      name: 'Chameleon Check',
      description: 'Detect chameleon carriers — companies that shut down and reopen under new names to dodge safety records. Protect yourself from fraud before you buy.',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      icon: FileBarChart,
      name: 'Safety Improvement Report',
      description: 'Detailed safety analysis showing trends, risk areas, and actionable recommendations. Understand exactly where a carrier stands before making a deal.',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ]

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 border border-rose-200 mb-4">
            <Package className="w-4 h-4 text-rose-600" />
            <span className="text-sm font-medium text-rose-700">All-in-One Intelligence Bundle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Pulse Bundle</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Every carrier intelligence tool you need — one subscription, one price. Make smarter decisions with complete data.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="space-y-4 mb-10">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <tool.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{tool.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{tool.description}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${tool.bgColor} flex-shrink-0`}>
                    <span className={`text-xs font-semibold ${tool.textColor}`}>Included</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 -m-6 mb-6 p-6 border-b border-gray-100">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-rose-500" />
                  <h2 className="text-xl font-bold text-gray-900">Choose Your Plan</h2>
                </div>

                {/* Billing Toggle */}
                <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      billingCycle === 'yearly'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Yearly
                    <span className="ml-1.5 text-xs text-emerald-500 font-bold">Save {savings}%</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-5xl font-bold text-gray-900">
                  ${billingCycle === 'monthly' ? monthlyPrice.toFixed(2) : yearlyMonthly.toFixed(2)}
                </span>
                <span className="text-gray-500 text-lg">/month</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-gray-500">
                  Billed ${yearlyPrice.toFixed(2)} annually
                </p>
              )}
            </div>

            {/* What's included summary */}
            <div className="grid md:grid-cols-2 gap-3 mb-8">
              {[
                'CarrierPulse — BASIC scores & inspections',
                'Chameleon Check — fraud detection',
                'Safety Improvement Report',
                'Carrier intelligence tools',
                'Unlimited lookups',
                'Live FMCSA data',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              fullWidth
              size="lg"
              onClick={handleSubscribe}
              loading={isProcessing}
              className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Pulse Bundle
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-4">
              Cancel anytime. Secure checkout powered by Stripe.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PulseBundlePage
