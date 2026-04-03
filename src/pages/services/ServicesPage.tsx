import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Fuel,
  Shield,
  Users,
  Truck,
  FileText,
  ArrowRight,
  CheckCircle,
  Search,
  Loader2,
  XCircle,
  Hash,
  Phone,
  Zap
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'

const ServicesPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [mcNumber, setMcNumber] = useState('')
  const [dotNumber, setDotNumber] = useState('')
  const [searchType, setSearchType] = useState<'mc' | 'dot'>('mc')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const FMCSA_API_KEY = '7ac73313fb4ddad3948ebb1a0ef6ccebed130f8b'

  const redirectToCarrierPulse = (dotNum: string) => {
    if (isAuthenticated && user) {
      const role = user.role === 'admin' ? 'admin' : user.role === 'seller' ? 'seller' : 'buyer'
      navigate(`/${role}/carrier-pulse/${dotNum}`)
    } else {
      navigate(`/carrier-pulse-preview/${dotNum}`)
    }
  }

  const fetchCarrierData = async () => {
    const searchValue = searchType === 'mc' ? mcNumber : dotNumber
    if (!searchValue.trim()) {
      setError(`Please enter a ${searchType === 'mc' ? 'MC' : 'DOT'} number`)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const cleanNumber = searchValue.replace(/^(MC|DOT)[-\s]*/i, '').trim()

      if (searchType === 'dot') {
        // DOT number — redirect directly
        redirectToCarrierPulse(cleanNumber)
        return
      }

      // MC number — resolve to DOT first via FMCSA
      const url = `https://mobile.fmcsa.dot.gov/qc/services/carriers/docket-number/${cleanNumber}?webKey=${FMCSA_API_KEY}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Carrier not found')
      }

      const data = await response.json()

      if (data.content && data.content.length > 0) {
        const carrier = data.content[0].carrier
        const dotNum = carrier.dotNumber
        if (dotNum) {
          redirectToCarrierPulse(dotNum)
        } else {
          setError('Carrier found but no DOT number available.')
        }
      } else {
        setError(`No carrier found with MC number ${cleanNumber}`)
      }
    } catch (err) {
      setError('Unable to find carrier. Please check the number and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchCarrierData()
    }
  }

  const services = [
    {
      icon: Fuel,
      title: 'Fuel Program',
      description: 'Maximize your savings with our exclusive fuel discount network. Access discounts at all major truck stops nationwide.',
      link: '/services/fuel-program',
      features: ['Up to $0.75/gallon savings', 'All major truck stops', 'No fees or minimums']
    },
    {
      icon: Shield,
      title: 'Safety Services',
      description: 'Stay compliant and protect your business with comprehensive DOT safety compliance and risk management solutions.',
      link: '/services/safety',
      features: ['DOT compliance', 'Driver qualification files', 'Mock audits']
    },
    {
      icon: Users,
      title: 'Recruiting Services',
      description: 'Find qualified drivers faster with our full-service recruiting solutions designed for motor carriers.',
      link: '/services/recruiting',
      features: ['Driver sourcing', 'Screening & verification', 'Onboarding support']
    },
    {
      icon: Truck,
      title: 'Dispatch Services',
      description: 'Professional dispatch services to keep your trucks moving and your revenue growing.',
      link: '/services/dispatch',
      features: ['24/7 dispatch support', 'Load optimization', 'Rate negotiation']
    },
    {
      icon: FileText,
      title: 'Admin Services',
      description: 'Streamline your back office with our comprehensive administrative support services.',
      link: '/services/admin',
      features: ['Invoicing & billing', 'Document management', 'IFTA/IRP filing']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Carrier Search Focused */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              Free FMCSA Carrier Lookup Tool
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Carrier Snapshot
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Search Tool
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Instantly check any carrier's trust score and operating status.
              Get a quick snapshot of authority, safety, and compliance at a glance.
            </p>

            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <Card className="p-6 shadow-2xl">
                {/* Search Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSearchType('mc')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                      searchType === 'mc'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Hash className="w-4 h-4 inline mr-2" />
                    MC Number
                  </button>
                  <button
                    onClick={() => setSearchType('dot')}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                      searchType === 'dot'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Hash className="w-4 h-4 inline mr-2" />
                    DOT Number
                  </button>
                </div>

                {/* Search Input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder={searchType === 'mc' ? 'Enter MC Number (e.g., 123456)' : 'Enter DOT Number (e.g., 1234567)'}
                      value={searchType === 'mc' ? mcNumber : dotNumber}
                      onChange={(e) => searchType === 'mc' ? setMcNumber(e.target.value) : setDotNumber(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-lg pl-4 pr-4 py-3"
                    />
                  </div>
                  <Button
                    onClick={fetchCarrierData}
                    disabled={isLoading}
                    size="lg"
                    className="min-w-[160px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Examples */}
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span>Try:</span>
                  <button
                    onClick={() => { setSearchType('mc'); setMcNumber('384859'); }}
                    className="text-indigo-600 hover:underline"
                  >
                    MC-384859
                  </button>
                  <button
                    onClick={() => { setSearchType('dot'); setDotNumber('2213110'); }}
                    className="text-indigo-600 hover:underline"
                  >
                    DOT-2213110
                  </button>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Error & Empty States */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for a Carrier</h3>
              <p className="text-gray-600 mb-6">
                Enter an MC or DOT number above to instantly see a carrier's trust score, authority status, and fleet overview.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Trust Score (A-F)
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Operating Status
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Authority Status
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Fleet Size
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              More Services for Motor Carriers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to run a successful trucking operation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={service.link}>
                  <Card hover className="h-full group cursor-pointer">
                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                        <service.icon className="w-7 h-7 text-gray-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{service.title}</h3>
                    <p className="text-gray-500 mb-6">{service.description}</p>

                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-700">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
          </div>
          <div className="relative text-center py-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Need Help with Compliance?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Our team of experts can help you maintain a clean safety record and stay compliant with FMCSA regulations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="min-w-[200px] bg-white text-indigo-600 hover:bg-gray-100">
                  Get a Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <a href="tel:+18778141807">
                <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white/10">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (877) 814-1807
                </Button>
              </a>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default ServicesPage
