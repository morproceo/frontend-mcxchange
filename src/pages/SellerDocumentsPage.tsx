import { motion } from 'framer-motion'
import {
  FileText,
  Circle,
  Info,
  ArrowRight,
} from 'lucide-react'
import Card from '../components/ui/Card'
import { REQUIRED_DOCUMENTS } from '../constants/documents'

const SellerDocumentsPage = () => {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Documents Checklist</h2>
        <p className="text-gray-500 text-sm mt-1">
          These documents will be required when a buyer accepts your listing and a transaction begins.
          No action needed now — you will upload them in the <strong>Transaction Room</strong>.
        </p>
      </div>

      {/* Info Banner */}
      <Card className="mb-6 !bg-indigo-50 !border-indigo-100">
        <div className="flex items-start gap-3">
          <ArrowRight className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-indigo-900">When do I upload these?</h4>
            <p className="text-xs text-indigo-700 mt-1">
              Once a buyer makes an offer and a transaction is created, you'll find the document upload section
              inside the Transaction Room. You'll also be able to add login credentials and any additional documents there.
            </p>
          </div>
        </div>
      </Card>

      {/* Required Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Required Documents</h3>
        <div className="space-y-3">
          {REQUIRED_DOCUMENTS.filter(d => d.required).map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 text-gray-300">
                    <Circle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <h4 className="text-sm font-semibold text-gray-900">{doc.label}</h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-50 text-red-600">Required</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">{doc.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Optional Documents</h3>
        <div className="space-y-3">
          {REQUIRED_DOCUMENTS.filter(d => !d.required).map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 text-gray-300">
                    <Circle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <h4 className="text-sm font-semibold text-gray-900">{doc.label}</h4>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">If applicable</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-6">{doc.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <Card>
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Additional Information May Be Required</h4>
            <p className="text-xs text-gray-500 mt-1">
              Buyers may request additional company information or documents during the due diligence process.
              This can include financial statements, tax returns, driver rosters, equipment lists, or other records
              specific to their requirements. You will be notified through your dashboard messages if a buyer needs anything else.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SellerDocumentsPage
