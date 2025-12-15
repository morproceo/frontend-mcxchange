import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'

const SellerDocumentsPage = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'insurance' | 'authority' | 'safety' | 'other'>('all')

  const documents = [
    {
      id: '1',
      name: 'Insurance Certificate 2024',
      category: 'insurance',
      type: 'PDF',
      size: '2.4 MB',
      uploadedDate: '2024-01-05',
      status: 'verified',
      expiryDate: '2024-12-31',
      listingId: '123456'
    },
    {
      id: '2',
      name: 'Operating Authority Certificate',
      category: 'authority',
      type: 'PDF',
      size: '1.8 MB',
      uploadedDate: '2024-01-05',
      status: 'verified',
      expiryDate: null,
      listingId: '123456'
    },
    {
      id: '3',
      name: 'Safety Rating Report',
      category: 'safety',
      type: 'PDF',
      size: '3.2 MB',
      uploadedDate: '2024-01-04',
      status: 'verified',
      expiryDate: null,
      listingId: '123456'
    },
    {
      id: '4',
      name: 'UCC Filing Documentation',
      category: 'other',
      type: 'PDF',
      size: '1.5 MB',
      uploadedDate: '2024-01-03',
      status: 'verified',
      expiryDate: null,
      listingId: '123456'
    },
    {
      id: '5',
      name: 'Vehicle Registration Docs',
      category: 'other',
      type: 'PDF',
      size: '4.1 MB',
      uploadedDate: '2024-01-08',
      status: 'pending',
      expiryDate: '2024-06-30',
      listingId: '789012'
    },
    {
      id: '6',
      name: 'Insurance Certificate - Expired',
      category: 'insurance',
      type: 'PDF',
      size: '2.1 MB',
      uploadedDate: '2023-12-15',
      status: 'expired',
      expiryDate: '2023-12-31',
      listingId: '345678'
    }
  ]

  const filteredDocuments = documents.filter(doc =>
    activeCategory === 'all' || doc.category === activeCategory
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-trust-high'
      case 'pending':
        return 'text-yellow-400'
      case 'expired':
      case 'rejected':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />
      case 'expired':
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const stats = [
    {
      label: 'Total Documents',
      value: documents.length,
      color: 'text-primary-400'
    },
    {
      label: 'Verified',
      value: documents.filter(d => d.status === 'verified').length,
      color: 'text-trust-high'
    },
    {
      label: 'Pending Review',
      value: documents.filter(d => d.status === 'pending').length,
      color: 'text-yellow-400'
    },
    {
      label: 'Expired',
      value: documents.filter(d => d.status === 'expired').length,
      color: 'text-red-400'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Documents</h2>
            <p className="text-white/60">Manage your listing documents and certificates</p>
          </div>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="text-sm text-white/60 mb-1">{stat.label}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'insurance', 'authority', 'safety', 'other'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'glass-subtle text-white/80 hover:bg-white/15'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Document Requirements */}
        <GlassCard className="mb-6" variant="subtle">
          <h3 className="font-semibold mb-3">Required Documents for Listing</h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-trust-high" />
              <span>Current Insurance Certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-trust-high" />
              <span>Operating Authority Certificate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-trust-high" />
              <span>Safety Rating Report</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-trust-high" />
              <span>UCC Filing Documentation</span>
            </div>
          </div>
        </GlassCard>

        {/* Documents List */}
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <GlassCard key={doc.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{doc.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span className="capitalize">{doc.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span>MC #{doc.listingId}</span>
                      <span>•</span>
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}</span>
                      {doc.expiryDate && (
                        <>
                          <span>•</span>
                          <span className={new Date(doc.expiryDate) < new Date() ? 'text-red-400' : ''}>
                            Expires {new Date(doc.expiryDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SellerDocumentsPage
