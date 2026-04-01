import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Loader2,
  TrendingUp,
  TrendingDown,
  Shield,
  Truck,
  Users,
  Package as PackageIcon,
  Mail,
  Phone,
  Zap,
  ArrowRight,
  RotateCcw,
  Calculator,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import api from '../services/api'
import { FMCSACarrierData } from '../types'

interface PriceBreakdownItem {
  label: string
  value: number
  icon: any
  positive: boolean
}

const MCPricingEstimator = () => {
  const [mcNumber, setMcNumber] = useState('')
  const [step, setStep] = useState<'input' | 'calculating' | 'result'>('input')
  const [error, setError] = useState<string | null>(null)
  const [carrierData, setCarrierData] = useState<FMCSACarrierData | null>(null)
  const [suggestedRange, setSuggestedRange] = useState<{ low: number; high: number }>({ low: 0, high: 0 })
  const [breakdown, setBreakdown] = useState<PriceBreakdownItem[]>([])
  const [displayNumber, setDisplayNumber] = useState(0)
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Animated number cycling during "calculating"
  useEffect(() => {
    if (step === 'calculating') {
      let count = 0
      animationRef.current = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 40000) + 5000)
        count++
        if (count > 20) {
          if (animationRef.current) clearInterval(animationRef.current)
        }
      }, 80)

      return () => {
        if (animationRef.current) clearInterval(animationRef.current)
      }
    }
  }, [step])

  const calculatePrice = (data: FMCSACarrierData, extras: { amazonStatus: string; highwaySetup: boolean; sellingWithEmail: boolean; sellingWithPhone: boolean }) => {
    let basePrice = 8000
    const items: PriceBreakdownItem[] = []

    // Years active (estimate from mcs150Date or use a default)
    let yearsActive = 0
    if (data.mcs150Date) {
      const mcsDate = new Date(data.mcs150Date)
      yearsActive = Math.max(0, Math.floor((Date.now() - mcsDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)))
    }
    if (yearsActive >= 5) {
      const bonus = Math.min(yearsActive * 800, 8000)
      basePrice += bonus
      items.push({ label: `${yearsActive}+ years active`, value: bonus, icon: TrendingUp, positive: true })
    } else if (yearsActive >= 2) {
      const bonus = yearsActive * 500
      basePrice += bonus
      items.push({ label: `${yearsActive} years active`, value: bonus, icon: TrendingUp, positive: true })
    }

    // Safety rating
    const safety = data.safetyRating?.toLowerCase()
    if (safety === 'satisfactory') {
      basePrice += 3000
      items.push({ label: 'Satisfactory safety rating', value: 3000, icon: Shield, positive: true })
    } else if (safety === 'conditional') {
      basePrice -= 2000
      items.push({ label: 'Conditional safety rating', value: -2000, icon: AlertTriangle, positive: false })
    } else if (safety === 'unsatisfactory') {
      basePrice -= 5000
      items.push({ label: 'Unsatisfactory safety rating', value: -5000, icon: AlertTriangle, positive: false })
    }

    // Fleet size / power units
    if (data.totalPowerUnits >= 10) {
      const bonus = Math.min(data.totalPowerUnits * 200, 4000)
      basePrice += bonus
      items.push({ label: `${data.totalPowerUnits} power units`, value: bonus, icon: Truck, positive: true })
    } else if (data.totalPowerUnits >= 3) {
      const bonus = data.totalPowerUnits * 150
      basePrice += bonus
      items.push({ label: `${data.totalPowerUnits} power units`, value: bonus, icon: Truck, positive: true })
    }

    // Drivers
    if (data.totalDrivers >= 5) {
      const bonus = Math.min(data.totalDrivers * 100, 2000)
      basePrice += bonus
      items.push({ label: `${data.totalDrivers} drivers on file`, value: bonus, icon: Users, positive: true })
    }

    // BASIC scores (lower is better)
    const avgBasic = [
      data.unsafeDrivingBasic,
      data.hoursOfServiceBasic,
      data.vehicleMaintenanceBasic,
      data.driverFitnessBasic,
    ].filter(s => s > 0)

    if (avgBasic.length > 0) {
      const avg = avgBasic.reduce((a, b) => a + b, 0) / avgBasic.length
      if (avg <= 30) {
        basePrice += 2500
        items.push({ label: 'Excellent BASIC scores', value: 2500, icon: Shield, positive: true })
      } else if (avg <= 50) {
        basePrice += 1000
        items.push({ label: 'Good BASIC scores', value: 1000, icon: Shield, positive: true })
      } else if (avg > 75) {
        basePrice -= 2000
        items.push({ label: 'High BASIC scores', value: -2000, icon: AlertTriangle, positive: false })
      }
    }

    // Crash history
    if (data.crashTotal === 0 && (data.driverInsp > 0 || data.vehicleInsp > 0)) {
      basePrice += 2000
      items.push({ label: 'Clean crash record', value: 2000, icon: CheckCircle, positive: true })
    } else if (data.fatalCrash > 0) {
      basePrice -= 4000
      items.push({ label: 'Fatal crash on record', value: -4000, icon: AlertTriangle, positive: false })
    } else if (data.crashTotal > 2) {
      basePrice -= 1500
      items.push({ label: `${data.crashTotal} crashes on record`, value: -1500, icon: TrendingDown, positive: false })
    }

    // Insurance
    if (data.insuranceOnFile && data.bipdOnFile > 0) {
      basePrice += 1500
      items.push({ label: 'Active insurance on file', value: 1500, icon: Shield, positive: true })
    }

    // Cargo types (hazmat = premium)
    if (data.cargoTypes?.some(c => c.toLowerCase().includes('hazmat') || c.toLowerCase().includes('hazardous'))) {
      basePrice += 3000
      items.push({ label: 'HazMat certified', value: 3000, icon: PackageIcon, positive: true })
    }

    // Amazon Relay
    if (extras.amazonStatus && extras.amazonStatus.toLowerCase() !== 'none' && extras.amazonStatus.toLowerCase() !== 'not-setup') {
      basePrice += 4000
      items.push({ label: 'Amazon Relay active', value: 4000, icon: PackageIcon, positive: true })
    }

    // Highway setup
    if (extras.highwaySetup) {
      basePrice += 2000
      items.push({ label: 'Highway setup included', value: 2000, icon: Zap, positive: true })
    }

    // Selling with email
    if (extras.sellingWithEmail) {
      basePrice += 1000
      items.push({ label: 'Email accounts included', value: 1000, icon: Mail, positive: true })
    }

    // Selling with phone
    if (extras.sellingWithPhone) {
      basePrice += 1000
      items.push({ label: 'Phone numbers included', value: 1000, icon: Phone, positive: true })
    }

    // Ensure minimum
    basePrice = Math.max(basePrice, 5000)

    const low = Math.round(basePrice * 0.85 / 500) * 500
    const high = Math.round(basePrice * 1.15 / 500) * 500

    return { low, high, breakdown: items }
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = mcNumber.replace(/[^0-9]/g, '')
    if (!cleaned) {
      setError('Please enter a valid MC number')
      return
    }

    setError(null)
    setStep('calculating')

    try {
      const response = await api.fmcsaLookupByMC(cleaned)
      if (response.success && response.data) {
        setCarrierData(response.data)

        // Small delay for the animation effect
        await new Promise(resolve => setTimeout(resolve, 2000))

        const result = calculatePrice(response.data, {
          amazonStatus: 'none',
          highwaySetup: false,
          sellingWithEmail: false,
          sellingWithPhone: false,
        })

        setSuggestedRange({ low: result.low, high: result.high })
        setBreakdown(result.breakdown)
        setStep('result')
      } else {
        setError('No carrier found with that MC number')
        setStep('input')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to look up carrier')
      setStep('input')
    }
  }

  const handleToggleExtra = (field: 'amazonStatus' | 'highwaySetup' | 'sellingWithEmail' | 'sellingWithPhone') => {
    if (!carrierData) return

    // Re-calculate with toggled extras
    const currentExtras = {
      amazonStatus: breakdown.some(b => b.label === 'Amazon Relay active') ? 'active' : 'none',
      highwaySetup: breakdown.some(b => b.label === 'Highway setup included'),
      sellingWithEmail: breakdown.some(b => b.label === 'Email accounts included'),
      sellingWithPhone: breakdown.some(b => b.label === 'Phone numbers included'),
    }

    if (field === 'amazonStatus') {
      currentExtras.amazonStatus = currentExtras.amazonStatus === 'active' ? 'none' : 'active'
    } else {
      currentExtras[field] = !currentExtras[field]
    }

    const result = calculatePrice(carrierData, currentExtras)
    setSuggestedRange({ low: result.low, high: result.high })
    setBreakdown(result.breakdown)
  }

  const handleReset = () => {
    setStep('input')
    setMcNumber('')
    setCarrierData(null)
    setSuggestedRange({ low: 0, high: 0 })
    setBreakdown([])
    setError(null)
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 -m-6 mb-5 p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Pricing Estimator</h3>
            <p className="text-xs text-gray-500">Get a suggested listing price for your authority</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Input Step */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <form onSubmit={handleLookup} className="space-y-3">
              <Input
                placeholder="Enter MC number (e.g. 123456)"
                value={mcNumber}
                onChange={(e) => { setMcNumber(e.target.value); setError(null) }}
                icon={<Search className="w-4 h-4" />}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button type="submit" fullWidth disabled={!mcNumber.trim()}>
                <Calculator className="w-4 h-4 mr-2" />
                Estimate My Price
              </Button>
            </form>
          </motion.div>
        )}

        {/* Calculating Step */}
        {step === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-6 text-center"
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              {/* Spinning outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-500 border-r-fuchsia-500"
              />
              {/* Inner pulsing circle */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute inset-2 rounded-full bg-gradient-to-br from-violet-50 to-fuchsia-50 flex items-center justify-center"
              >
                <span className="text-lg font-bold text-violet-600 font-mono">
                  ${displayNumber.toLocaleString()}
                </span>
              </motion.div>
            </div>
            <p className="text-sm font-medium text-gray-700">Analyzing carrier data...</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Loader2 className="w-3 h-3 text-violet-500 animate-spin" />
              <p className="text-xs text-gray-400">Crunching safety, fleet, insurance & market data</p>
            </div>
          </motion.div>
        )}

        {/* Result Step */}
        {step === 'result' && carrierData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Company Name */}
            <div className="text-center mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide">MC #{carrierData.mcNumber || mcNumber}</p>
              <p className="font-semibold text-gray-900 text-sm">{carrierData.legalName}</p>
            </div>

            {/* Price Range */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-4 mb-4 border border-violet-100 text-center"
            >
              <p className="text-xs text-violet-600 font-medium mb-1">Suggested Listing Price</p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-2xl font-bold text-gray-900">${suggestedRange.low.toLocaleString()}</span>
                <span className="text-gray-400">—</span>
                <span className="text-2xl font-bold text-gray-900">${suggestedRange.high.toLocaleString()}</span>
              </div>
            </motion.div>

            {/* Toggle Extras */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { key: 'amazonStatus' as const, label: 'Amazon Relay', icon: PackageIcon, active: breakdown.some(b => b.label === 'Amazon Relay active') },
                { key: 'highwaySetup' as const, label: 'Highway Setup', icon: Zap, active: breakdown.some(b => b.label === 'Highway setup included') },
                { key: 'sellingWithEmail' as const, label: 'With Email', icon: Mail, active: breakdown.some(b => b.label === 'Email accounts included') },
                { key: 'sellingWithPhone' as const, label: 'With Phone', icon: Phone, active: breakdown.some(b => b.label === 'Phone numbers included') },
              ].map((extra) => (
                <button
                  key={extra.key}
                  type="button"
                  onClick={() => handleToggleExtra(extra.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    extra.active
                      ? 'bg-violet-50 border-violet-200 text-violet-700'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <extra.icon className="w-3.5 h-3.5" />
                  {extra.label}
                  {extra.active && <CheckCircle className="w-3 h-3 ml-auto text-violet-500" />}
                </button>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-1.5 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Price Breakdown</p>
              {breakdown.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className={`w-3.5 h-3.5 ${item.positive ? 'text-emerald-500' : 'text-red-400'}`} />
                    <span className="text-gray-600">{item.label}</span>
                  </div>
                  <span className={`font-semibold ${item.positive ? 'text-emerald-600' : 'text-red-500'}`}>
                    {item.positive ? '+' : ''}${Math.abs(item.value).toLocaleString()}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={handleReset} className="flex-shrink-0">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                fullWidth
                onClick={() => {
                  const mid = Math.round((suggestedRange.low + suggestedRange.high) / 2)
                  window.location.href = `/seller/create-listing?mc=${mcNumber}&price=${mid}`
                }}
              >
                List at This Price
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Estimate based on FMCSA data and market factors. Actual value may vary.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default MCPricingEstimator
