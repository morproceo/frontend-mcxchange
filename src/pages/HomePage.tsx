import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  Shield,
  Lock,
  FileCheck,
  Users,
  Search,
  Sparkles,
  Star,
  MessageSquare,
  TrendingUp,
  Fuel,
  HardHat,
  UserPlus,
  Headphones,
  Briefcase,
  ChevronRight,
  AlertTriangle,
  EyeOff,
  ShieldOff,
  Loader2,
  Hash,
  XCircle,
  Activity,
  Gauge,
  BarChart3,
  Truck,
  Umbrella,
  SquareParking,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import AnimatedCounter from '../components/v2/AnimatedCounter'
import Input from '../components/ui/Input'
import api from '../services/api'
import TalkToMariaModal from '../components/TalkToMariaModal'

// ── Data ──────────────────────────────────────────────────

const heroStats = [
  { value: 47, suffix: 'M+', prefix: '$', label: 'Platform Volume' },
  { value: 900, suffix: '+', prefix: '', label: 'Businesses Listed' },
  { value: 2400, suffix: '+', prefix: '', label: 'Verified Carriers' },
  { value: 98, suffix: '%', prefix: '', label: 'Satisfaction Rate' },
  { value: 24, suffix: '/7', prefix: '', label: 'Expert Support' },
]

const problems = [
  {
    icon: AlertTriangle,
    title: 'Unverified Listings Everywhere',
    description: 'No way to know if a trucking business is legitimate before you invest. Hidden violations, lapsed insurance, and ghost companies waste your time and money.',
    accent: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: EyeOff,
    title: 'Zero Transparency',
    description: 'Hidden compliance issues, safety violations, and insurance gaps surface after the deal — when it\'s too late to walk away.',
    accent: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: ShieldOff,
    title: 'No Protection for Your Money',
    description: 'Wire $50K to a stranger and hope for the best? That\'s the status quo. No escrow, no recourse, no safety net.',
    accent: 'text-orange-500',
    bg: 'bg-orange-50',
  },
]

const features = [
  { icon: Sparkles, title: 'AI-Powered Due Diligence', description: 'FMCSA records, insurance history, safety scores, and compliance data — analyzed automatically so you can make informed decisions.' },
  { icon: Shield, title: 'Verified Trust Scores', description: 'Every listed business is scored on 20+ data points. See exactly what you\'re getting before you commit.' },
  { icon: Lock, title: 'Secure Escrow Protection', description: 'Your funds are held in escrow until both parties confirm the transfer. Your money stays protected at every step.' },
  { icon: FileCheck, title: 'Complete Transparency', description: 'Operating history, UCC filings, insurance certificates, and safety records — everything in one place, nothing hidden.' },
  { icon: Users, title: 'Expert Guidance', description: 'Transportation specialists who guide you through every deal, from first offer to completed business transfer.' },
  { icon: Search, title: 'Carrier Intelligence Tools', description: 'Search any MC or DOT number instantly. Deep-dive into carrier data and make your move with confidence.' },
]

const steps = [
  { number: '01', icon: Search, title: 'Explore & Discover', description: 'Browse verified trucking businesses filtered by state, price, Amazon status, and more — or list yours for qualified buyers to find.' },
  { number: '02', icon: FileCheck, title: 'Verify & Trust', description: 'AI-generated due diligence reports, trust scores, and complete compliance history at your fingertips. Know what you\'re getting.' },
  { number: '03', icon: CheckCircle, title: 'Connect & Close', description: 'Make offers through secure escrow. Our team guides you through every step of the business transfer process.' },
]

const services = [
  { icon: SquareParking, title: 'Parking', description: 'List your truck parking spots and earn extra income, or find secure overnight parking on the road.', href: 'https://www.gospotty.com/', external: true },
  { icon: Fuel, title: 'Fuel Program', description: 'Discounted diesel at 4,000+ truck stops nationwide. Save $0.20–$0.50/gallon.', href: '/services/fuel-program' },
  { icon: HardHat, title: 'Safety & DOT Compliance', description: 'Mock audits, driver files, drug testing, and CSA monitoring to keep you running clean.', href: '/services/safety' },
  { icon: UserPlus, title: 'Driver Recruiting', description: 'Qualified CDL drivers delivered to your inbox. Pre-screened and ready to roll.', href: '/services/recruiting' },
  { icon: Headphones, title: 'Dispatch Services', description: 'Professional dispatchers finding top-paying loads and handling broker negotiations.', href: '/services/dispatch' },
  { icon: Briefcase, title: 'Admin & Back Office', description: 'IFTA, permits, BOC-3, process agent — all the paperwork handled so you can drive.', href: '/services/admin' },
  { icon: Search, title: 'Carrier Search & MC Lookup', description: 'Instant FMCSA lookups, carrier verification, and business due diligence reports.', href: '/services' },
]

const testimonials = [
  {
    name: 'James Rodriguez',
    role: 'Owner-Operator',
    location: 'Houston, TX',
    quote: 'I found a verified trucking business with Amazon Relay active in under a week. The escrow process gave me total peace of mind — I knew my investment was protected every step of the way.',
    stars: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'Fleet Manager',
    location: 'Los Angeles, CA',
    quote: 'Listing our trucking business was seamless. Domilea handled verification, connected us with qualified buyers, and guided the entire transfer. We closed in 11 days.',
    stars: 5,
  },
  {
    name: 'Michael Williams',
    role: 'Carrier CEO',
    location: 'Miami, FL',
    quote: 'The AI due diligence report saved me from a bad deal. When I found the right business, the trust score matched reality. I closed with confidence and zero surprises.',
    stars: 5,
  },
]

// ── Animation Variants ─────────────────────────────────────

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// ── Component ──────────────────────────────────────────────

const HomePage = () => {
  const navigate = useNavigate()
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  // Carrier search state
  const [searchType, setSearchType] = useState<'mc' | 'dot'>('mc')
  const [searchValue, setSearchValue] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handleCarrierSearch = async () => {
    if (!searchValue.trim()) {
      setSearchError(`Please enter a ${searchType === 'mc' ? 'MC' : 'DOT'} number`)
      return
    }
    setSearchLoading(true)
    setSearchError(null)
    try {
      const cleanNumber = searchValue.replace(/^(MC|DOT)[-\s]*/i, '').trim()
      if (searchType === 'dot') {
        navigate(`/carrier-pulse-preview/${cleanNumber}`)
        return
      }
      // MC → resolve to DOT via backend API
      const res = await api.fmcsaLookupByMC(cleanNumber)
      if (res.success && res.data?.dotNumber) {
        navigate(`/carrier-pulse-preview/${res.data.dotNumber}`)
      } else {
        setSearchError(`No carrier found with MC number ${cleanNumber}`)
      }
    } catch {
      setSearchError('Unable to find carrier. Please check the number and try again.')
    } finally {
      setSearchLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* ─── Section 1: Dark Hero — StoryBrand Opening ────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        {/* Animated glow orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -40, 30, 0], y: [0, 30, -30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 20, -30, 0], y: [0, -20, 40, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-1/4 left-1/2 w-[450px] h-[450px] rounded-full bg-purple-500/15 blur-[100px]"
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Shimmer sweep */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-12 pointer-events-none"
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Eyebrow badge — authority signal */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.12] backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-gray-300">Trusted by 2,400+ Carriers Nationwide</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">The Trusted Marketplace for</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Trucking Businesses
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Whether you're looking to acquire a trucking company or sell your business to qualified buyers,
              Domilea gives you the tools, transparency, and protection to do it right.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/marketplace">
                <Button size="lg" className="min-w-[200px] bg-indigo-600 hover:bg-indigo-500 text-white">
                  Explore the Marketplace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/register?role=seller">
                <Button size="lg" variant="ghost" className="min-w-[200px] border border-white/20 text-white hover:bg-white/10">
                  List Your Business
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setIsConsultationOpen(true)}
              className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              Talk to an Expert
            </button>

            {/* Trust strip */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Verified Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Secure Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Due Diligence</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Carrier Pulse — Search + Value Proposition ────── */}
      <section className="relative py-16 bg-gradient-to-b from-[#1e293b] to-[#0f172a] overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Carrier Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stop Guessing. Start <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Knowing.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
              FMCSA gives you raw data. CarrierPulse tells you what it means — health scores, risk detection, safety grades, and actionable recommendations all in one place.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Search + What You Get */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {/* Search Card */}
              <div className="rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm p-6 mb-6">
                <h3 className="text-lg font-bold text-white mb-1">Search Any Carrier — Free Preview</h3>
                <p className="text-sm text-gray-400 mb-4">Enter an MC or DOT number to see what CarrierPulse reveals.</p>

                {/* MC / DOT Toggle */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => { setSearchType('mc'); setSearchError(null) }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${searchType === 'mc' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/15'}`}
                  >MC Number</button>
                  <button
                    onClick={() => { setSearchType('dot'); setSearchError(null) }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${searchType === 'dot' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/15'}`}
                  >DOT Number</button>
                </div>

                {/* Search Input */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => { setSearchValue(e.target.value); setSearchError(null) }}
                      onKeyDown={(e) => e.key === 'Enter' && handleCarrierSearch()}
                      placeholder={searchType === 'mc' ? 'Enter MC number (e.g. 123456)' : 'Enter DOT number (e.g. 1234567)'}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-white/[0.08] border border-white/[0.15] text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400/50 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleCarrierSearch}
                    disabled={searchLoading}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-600/25"
                  >
                    {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Search
                  </button>
                </div>
                {searchError && (
                  <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    {searchError}
                  </p>
                )}
              </div>

              {/* What CarrierPulse gives you */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  What you get with CarrierPulse
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Gauge, label: 'Health Score (0-100)', desc: 'Weighted score across safety, compliance, insurance, fleet & history' },
                    { icon: BarChart3, label: 'Industry Benchmarks', desc: 'Compare OOS rates, clean inspection rates vs national averages' },
                    { icon: TrendingUp, label: 'Violation Trends', desc: '24-month trends showing if safety is improving or worsening' },
                    { icon: Umbrella, label: 'Insurance Gap Analysis', desc: 'Coverage gaps, pending cancellations & renewal timeline' },
                  ].map((feature) => (
                    <div key={feature.label} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{feature.label}</p>
                        <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: FMCSA vs CarrierPulse Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.08]">
                  <h3 className="text-lg font-bold text-white">FMCSA Free Tools vs CarrierPulse</h3>
                  <p className="text-xs text-gray-400 mt-1">See what you're missing with free FMCSA data alone</p>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {/* Header Row */}
                  <div className="grid grid-cols-[1fr,80px,80px] px-6 py-2.5 bg-white/[0.03]">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Feature</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">FMCSA</span>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider text-center">Pulse</span>
                  </div>

                  {[
                    { feature: 'MC/DOT Lookup & Authority Status', fmcsa: true, pulse: true },
                    { feature: 'Raw BASIC Safety Scores', fmcsa: true, pulse: true },
                    { feature: 'Inspection & Crash Records', fmcsa: true, pulse: true },
                    { feature: 'Insurance Filing Status', fmcsa: true, pulse: true },
                    { feature: 'Carrier Health Score (0-100)', fmcsa: false, pulse: true },
                    { feature: 'Industry Benchmarks & Comparison', fmcsa: false, pulse: true },
                    { feature: 'Violation Trend Analysis (24 mo)', fmcsa: false, pulse: true },
                    { feature: 'Insurance Gap Detection', fmcsa: false, pulse: true },
                    { feature: 'Coverage Amount Analysis', fmcsa: false, pulse: true },
                    { feature: 'Fleet Age & VIN Inspection Data', fmcsa: false, pulse: true },
                    { feature: 'Prioritized Action Plan (A+ to D)', fmcsa: false, pulse: true, bundle: true },
                  ].map((row, i) => (
                    <div key={i} className={`grid grid-cols-[1fr,80px,80px] px-6 py-2.5 items-center ${!row.fmcsa ? 'bg-indigo-500/[0.03]' : ''}`}>
                      <span className="text-sm text-gray-300">
                        {row.feature}
                        {row.bundle && <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold rounded bg-cyan-500/15 text-cyan-400 uppercase">Bundle</span>}
                      </span>
                      <span className="text-center">
                        {row.fmcsa
                          ? <CheckCircle className="w-4 h-4 text-gray-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-gray-700 mx-auto" />
                        }
                      </span>
                      <span className="text-center">
                        <CheckCircle className="w-4 h-4 text-cyan-400 mx-auto" />
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 border-t border-white/[0.08]">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-white">Pulse Bundle</p>
                      <p className="text-xs text-gray-400">Unlimited lookups + all tools — <span className="text-cyan-400 font-semibold">$14.99/mo</span></p>
                    </div>
                    <Link to="/pricing">
                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25">
                        View Plans
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Problem / Stakes ──────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Trucking Business Market Is Broken. You Deserve Better.
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every day, trucking professionals lose money on unverified businesses, hidden compliance problems, and deals with zero protection.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {problems.map((p) => (
              <motion.div key={p.title} variants={fadeUp}>
                <Card hover className="h-full">
                  <div className={`w-12 h-12 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                    <p.icon className={`w-6 h-6 ${p.accent}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-500">{p.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12 text-lg font-semibold text-indigo-600"
          >
            That's why we built Domilea.
          </motion.p>
        </div>
      </section>

      {/* ─── Section 3: Stats Counter Bar ─────────────────── */}
      <section className="bg-[#1e293b] border-t border-white/[0.06] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {heroStats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Section 4: Guide — Domilea as the Answer ─────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              A Marketplace Built for Trucking Professionals
            </h2>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              We know this market is broken — and we've lived through the frustration ourselves.
              Domilea was built by transportation industry veterans who believe buying and selling
              trucking businesses should be fair, transparent, and safe for everyone.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}>
                <Card hover className="h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500">{f.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Section 5: The Plan — How It Works ──────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Domilea Works</h2>
            <p className="text-lg text-gray-500">Three simple steps to a trusted trucking business deal</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {steps.map((step, index) => (
              <motion.div key={step.number} variants={fadeUp} className="relative">
                <Card hover className="h-full relative overflow-hidden">
                  <div className="absolute -top-2 -right-2 text-[80px] font-black text-gray-100 leading-none select-none pointer-events-none">
                    {step.number}
                  </div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                      <step.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </Card>
                {/* Connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Section 6: Services Ecosystem ────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything Your Trucking Business Needs</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Beyond the marketplace — fuel savings, compliance, recruiting, dispatch, and more, all in one platform.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((s) => {
              const cardInner = (
                <Card hover className="h-full group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <s.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                        {s.title}
                      </h3>
                      <p className="text-sm text-gray-500">{s.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Card>
              )
              return (
                <motion.div key={s.title} variants={fadeUp}>
                  {s.external ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {cardInner}
                    </a>
                  ) : (
                    <Link to={s.href}>{cardInner}</Link>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── Section 7: Testimonials / Success Stories ────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Carriers Nationwide</h2>
            <p className="text-lg text-gray-500">Real carriers. Real results. Real peace of mind.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <article>
                  <Card hover className="h-full flex flex-col">
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 flex-1 leading-relaxed">"{t.quote}"</p>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role} — {t.location}</div>
                    </div>
                  </Card>
                </article>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Section 8: Final CTA — Dual Path ────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Next Chapter Starts Here</h2>
            <p className="text-lg text-gray-500">Whether you're growing your fleet or reaching qualified buyers — Domilea has you covered.</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Buyer path */}
            <motion.div variants={fadeUp}>
              <Card className="h-full border-indigo-200 border-2">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Find Your Next Trucking Business</h3>
                  <p className="text-gray-500 mb-6">
                    Browse verified trucking businesses with AI-powered trust scores, escrow protection, and expert support every step of the way.
                  </p>
                  <Link to="/marketplace">
                    <Button size="lg" fullWidth className="bg-indigo-600 hover:bg-indigo-500 text-white">
                      Explore the Marketplace
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Seller path */}
            <motion.div variants={fadeUp}>
              <Card className="h-full border-emerald-200 border-2">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Reach Qualified Buyers</h3>
                  <p className="text-gray-500 mb-6">
                    List your trucking business on the marketplace. We handle verification, connect you with serious buyers, and protect the transaction.
                  </p>
                  <Link to="/register?role=seller">
                    <Button size="lg" fullWidth className="bg-emerald-600 hover:bg-emerald-500 text-white">
                      List Your Business
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Ghost CTA */}
          <div className="text-center mt-8">
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-2 text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4" />
              Not sure? Talk to an Expert
            </button>
          </div>
        </div>
      </section>

      {/* ─── Section 9: Floating FAB + Modal ─────────────── */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsConsultationOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-black shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <MessageSquare className="w-7 h-7 text-white" />
      </motion.button>

      <TalkToMariaModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  )
}

export default HomePage
