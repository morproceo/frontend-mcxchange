import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import Card from '../components/ui/Card'

const TermsPage = () => {
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
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-gray-500">Last Updated: {currentDate}</p>
        </div>

        <Card>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-6">
              These Terms and Conditions govern the use of www.domilea.com operated by Domilea ("Company").
              By accessing or using the platform, you agree to be legally bound by these Terms.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Role of Domilea</h2>
            <p className="text-gray-700 mb-6">
              Domilea operates as an online marketplace and, in certain transactions, acts as a broker or
              intermediary between buyers and sellers. Domilea may receive compensation for brokerage services.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Buyer Obligations</h2>
            <p className="text-gray-700 mb-6">
              Buyers agree not to contact sellers directly outside the platform. Violation results in a{' '}
              <strong>$500 USD charge</strong> as liquidated damages. Buyers must provide real and accurate
              personal information.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Seller Obligations</h2>
            <p className="text-gray-700 mb-6">
              Sellers agree to close all transactions with Domilea users through the platform.
              Selling off-platform to Domilea users results in a <strong>$1,000 USD charge</strong> as
              liquidated damages.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Subscriptions</h2>
            <p className="text-gray-700 mb-6">
              All paid subscriptions are billed monthly and continue until cancellation is requested.
              No refunds for partial periods.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Identity Verification</h2>
            <p className="text-gray-700 mb-6">
              Users agree to identity and business verification when requested by Domilea.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
            <p className="text-gray-700 mb-6">
              Domilea is not responsible for transaction outcomes, listing accuracy, or user conduct.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Governing Law</h2>
            <p className="text-gray-700 mb-6">
              These Terms are governed by the laws of the State of Illinois.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default TermsPage
