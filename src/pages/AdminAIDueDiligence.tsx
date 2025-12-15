import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TruckIcon,
  Calendar,
  ShieldCheck,
  FileText
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const AdminAIDueDiligence = () => {
  const [mcNumber, setMcNumber] = useState('')
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = () => {
    if (!mcNumber) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSearchResult({
        mcNumber: mcNumber,
        dotNumber: `DOT-${mcNumber}`,
        legalName: 'Sample Freight Solutions LLC',
        operatingAddress: '123 Transport Way, Dallas, TX 75201',
        yearsActive: 5,
        fleetSize: 12,
        safetyRating: 'satisfactory',
        insuranceStatus: 'active',
        operationType: ['Interstate', 'Long Haul'],

        // AI Assessment
        aiScore: 92,
        aiStatus: 'approved',

        // Compliance Checks
        amazonSetup: {
          status: 'good',
          message: 'Good Standing',
          lastChecked: '2024-01-10'
        },
        carrier411: {
          status: 'clear',
          message: 'No Issues Found',
          lastChecked: '2024-01-10'
        },
        uccLiens: {
          status: 'clear',
          message: 'No Active Liens',
          lastChecked: '2024-01-09'
        },
        highwayRMIS: {
          status: 'good',
          message: 'Good Standing',
          lastChecked: '2024-01-10'
        },

        // Additional Details
        documentation: {
          insurance: 'Complete & Current',
          authority: 'Valid',
          safetyReport: 'Available',
          uccFiling: 'Complete'
        },

        // Financial Info
        estimatedRevenue: '$2.4M',
        creditScore: 'Good',

        // Safety Metrics
        crashes: 0,
        inspections: 24,
        violations: 2,

        // Owner Info
        ownerName: 'John Smith',
        memberSince: '2019',
        completedDeals: 3
      })
      setIsLoading(false)
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
      case 'clear':
      case 'approved':
        return 'text-trust-high'
      case 'warning':
        return 'text-yellow-400'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
      case 'clear':
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-trust-high" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Shield className="w-5 h-5 text-white/60" />
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">AI Due Diligence</h2>
          <p className="text-white/60">Enter an MC number to perform comprehensive due diligence</p>
        </div>

        {/* Search Section */}
        <GlassCard className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="MC Number"
                placeholder="Enter MC number (e.g., 123456)"
                value={mcNumber}
                onChange={(e) => setMcNumber(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isLoading || !mcNumber}>
                {isLoading ? 'Analyzing...' : 'Run Analysis'}
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Results */}
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* AI Assessment Overview */}
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">AI Assessment Overview</h3>
                <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-full">
                  {getStatusIcon(searchResult.aiStatus)}
                  <span className={`font-semibold ${getStatusColor(searchResult.aiStatus)}`}>
                    {searchResult.aiStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Score Meter */}
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="#10b981"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - searchResult.aiScore / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-trust-high">{searchResult.aiScore}%</div>
                        <div className="text-sm text-white/60">AI Score</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/60">Documentation</span>
                    <span className="font-semibold text-trust-high">Complete</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Compliance</span>
                    <span className="font-semibold text-trust-high">Excellent</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Risk Level</span>
                    <span className="font-semibold text-trust-high">Low</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Credit Score</span>
                    <span className="font-semibold text-trust-high">{searchResult.creditScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Est. Revenue</span>
                    <span className="font-semibold">{searchResult.estimatedRevenue}</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Basic Information */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Basic Information</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/60 mb-1">MC Number</div>
                    <div className="font-semibold text-lg">MC #{searchResult.mcNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">DOT Number</div>
                    <div className="font-semibold">{searchResult.dotNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Legal Name</div>
                    <div className="font-semibold">{searchResult.legalName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Operating Address</div>
                    <div className="font-semibold text-sm">{searchResult.operatingAddress}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-white/60 mb-1">Owner</div>
                    <div className="font-semibold">{searchResult.ownerName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Member Since</div>
                    <div className="font-semibold">{searchResult.memberSince}</div>
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">Completed Deals</div>
                    <div className="font-semibold">{searchResult.completedDeals}</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Compliance & Status Checks */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Compliance & Status Checks</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-trust-high/20 flex items-center justify-center">
                        {getStatusIcon(searchResult.amazonSetup.status)}
                      </div>
                      <div>
                        <div className="font-semibold">Amazon Setup</div>
                        <div className={`text-sm ${getStatusColor(searchResult.amazonSetup.status)}`}>
                          {searchResult.amazonSetup.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 mt-2">
                    Last checked: {searchResult.amazonSetup.lastChecked}
                  </div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-trust-high/20 flex items-center justify-center">
                        {getStatusIcon(searchResult.carrier411.status)}
                      </div>
                      <div>
                        <div className="font-semibold">Carrier 411</div>
                        <div className={`text-sm ${getStatusColor(searchResult.carrier411.status)}`}>
                          {searchResult.carrier411.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 mt-2">
                    Last checked: {searchResult.carrier411.lastChecked}
                  </div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-trust-high/20 flex items-center justify-center">
                        {getStatusIcon(searchResult.uccLiens.status)}
                      </div>
                      <div>
                        <div className="font-semibold">UCC Liens</div>
                        <div className={`text-sm ${getStatusColor(searchResult.uccLiens.status)}`}>
                          {searchResult.uccLiens.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 mt-2">
                    Last checked: {searchResult.uccLiens.lastChecked}
                  </div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-trust-high/20 flex items-center justify-center">
                        {getStatusIcon(searchResult.highwayRMIS.status)}
                      </div>
                      <div>
                        <div className="font-semibold">Highway & RMIS</div>
                        <div className={`text-sm ${getStatusColor(searchResult.highwayRMIS.status)}`}>
                          {searchResult.highwayRMIS.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 mt-2">
                    Last checked: {searchResult.highwayRMIS.lastChecked}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Operational Details */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Operational Details</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Years Active</span>
                  </div>
                  <div className="text-2xl font-bold">{searchResult.yearsActive}</div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <TruckIcon className="w-4 h-4" />
                    <span>Fleet Size</span>
                  </div>
                  <div className="text-2xl font-bold">{searchResult.fleetSize}</div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Safety Rating</span>
                  </div>
                  <div className="text-lg font-bold capitalize">{searchResult.safetyRating}</div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <Shield className="w-4 h-4" />
                    <span>Insurance</span>
                  </div>
                  <div className="text-lg font-bold capitalize">{searchResult.insuranceStatus}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-white/60 mb-2">Operation Types</div>
                <div className="flex flex-wrap gap-2">
                  {searchResult.operationType.map((type: string) => (
                    <span key={type} className="glass-subtle px-3 py-1.5 rounded-full text-sm">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Safety Metrics */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Safety Metrics</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="glass-subtle rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-trust-high mb-1">{searchResult.crashes}</div>
                  <div className="text-sm text-white/60">Crashes (24 mo)</div>
                </div>

                <div className="glass-subtle rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold mb-1">{searchResult.inspections}</div>
                  <div className="text-sm text-white/60">Inspections</div>
                </div>

                <div className="glass-subtle rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{searchResult.violations}</div>
                  <div className="text-sm text-white/60">Violations</div>
                </div>
              </div>
            </GlassCard>

            {/* Documentation Status */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Documentation Status</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-400" />
                      <span className="font-semibold">Insurance Certificate</span>
                    </div>
                    <span className="text-sm text-trust-high">{searchResult.documentation.insurance}</span>
                  </div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-400" />
                      <span className="font-semibold">Authority Certificate</span>
                    </div>
                    <span className="text-sm text-trust-high">{searchResult.documentation.authority}</span>
                  </div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-400" />
                      <span className="font-semibold">Safety Report</span>
                    </div>
                    <span className="text-sm text-trust-high">{searchResult.documentation.safetyReport}</span>
                  </div>
                </div>

                <div className="glass-subtle rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-400" />
                      <span className="font-semibold">UCC Filing</span>
                    </div>
                    <span className="text-sm text-trust-high">{searchResult.documentation.uccFiling}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminAIDueDiligence
