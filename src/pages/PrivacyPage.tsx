import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Card from '../components/ui/Card'

const PrivacyPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500">Last Updated: {currentDate}</p>
        </div>

        <Card>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-6">
              This Privacy Policy explains how Domilea collects, uses, and protects personal data
              of users accessing www.domilea.com.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information Collected</h2>
            <p className="text-gray-700 mb-6">
              We collect names, emails, phone numbers, billing information, identity verification data,
              and business-related information. Stripe processes all payments.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Use of Information</h2>
            <p className="text-gray-700 mb-6">
              Information is used to operate the platform, facilitate brokerage transactions,
              process subscriptions, verify identity, and comply with legal obligations.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Sharing</h2>
            <p className="text-gray-700 mb-6">
              We share information only with service providers such as Stripe, identity verification services,
              or legal authorities when required. We do not sell personal data.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-gray-700 mb-6">
              Domilea uses reasonable safeguards but cannot guarantee absolute security.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. User Rights</h2>
            <p className="text-gray-700 mb-6">
              Illinois and U.S. residents may request access, correction, or deletion of personal data
              where permitted by law.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              This Privacy Policy is governed by the laws of the State of Illinois.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default PrivacyPage
