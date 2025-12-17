import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  CheckCircle,
  Users,
  FileCheck,
  Handshake,
  Star,
  ArrowRight,
  MessageSquare
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import TalkToMariaModal from '../components/TalkToMariaModal'

const HomePage = () => {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)
  const features = [
    {
      icon: Shield,
      title: 'Verified Trust Scores',
      description: 'Every MC is scored and verified with compliance data, giving you confidence in every transaction.'
    },
    {
      icon: FileCheck,
      title: 'Complete Documentation',
      description: 'Access full history, safety records, insurance, and UCC filings all in one place.'
    },
    {
      icon: Handshake,
      title: 'Secure Escrow',
      description: 'Protected transactions with built-in escrow services for buyer and seller peace of mind.'
    },
    {
      icon: Star,
      title: 'Reputation System',
      description: 'Build your profile through verified deals and reviews, making trust a valuable currency.'
    }
  ]

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up as a buyer or seller and verify your identity'
    },
    {
      number: '02',
      title: 'Browse or List',
      description: 'Explore verified MCs or create your own listing with documents'
    },
    {
      number: '03',
      title: 'Make a Deal',
      description: 'Connect, negotiate, and complete transactions securely'
    },
    {
      number: '04',
      title: 'Build Reputation',
      description: 'Leave reviews and grow your trust score over time'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900">
              The Trusted Marketplace
              <br />
              <span className="gradient-text">for All Trucking Needs</span>
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Buy and sell motor carrier authorities with confidence. Every listing is verified,
              scored, and backed by complete transparency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="min-w-[200px]">
                  Browse Marketplace
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link to="/register">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  List Your MC
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Verified Listings</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-secondary-500" />
                <span>Secure Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-700" />
                <span>Trusted Community</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Why Choose Domilea?</h2>
          <p className="text-xl text-gray-500">
            The first platform built specifically for trading carrier authorities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-500">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-500">
              Get started in four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full relative">
                  <div className="text-6xl font-bold text-gray-100 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{step.title}</h3>
                  <p className="text-gray-500">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-gray-300" />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-0">
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the trusted marketplace for motor carrier authorities
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=seller">
                <Button size="lg" className="min-w-[200px] bg-white text-gray-900 hover:bg-gray-100">
                  Sell Your MC
                </Button>
              </Link>

              <Link to="/register?role=buyer">
                <Button size="lg" variant="outline" className="min-w-[200px] border-white text-white hover:bg-white/10">
                  Find an MC to Buy
                </Button>
              </Link>

              <Button
                size="lg"
                variant="ghost"
                className="min-w-[200px] text-white hover:bg-white/10"
                onClick={() => setIsConsultationOpen(true)}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Talk to a Rep
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Floating Consultation Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsConsultationOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 rounded-full bg-black shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        <MessageSquare className="w-8 h-8 text-white" />
      </motion.button>

      {/* Consultation Modal */}
      <TalkToMariaModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  )
}

export default HomePage
