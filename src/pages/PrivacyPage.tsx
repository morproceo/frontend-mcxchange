import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import Card from '../components/ui/Card'
import { PrivacyContent } from '../components/LegalDocumentContent'

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy and Data Protection Standard</h1>
          <p className="text-gray-500">Jurisdiction: United States (Federal); State of Arizona</p>
        </div>

        <Card>
          <PrivacyContent />
        </Card>
      </motion.div>
    </div>
  )
}

export default PrivacyPage
