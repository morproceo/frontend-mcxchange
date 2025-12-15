import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Eye
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'

const BuyerPurchasesPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-progress' | 'completed'>('all')

  const purchases = [
    {
      id: '1',
      mcNumber: '789012',
      listingTitle: 'Regional Carrier Authority - Excellent Safety',
      purchasePrice: 32000,
      status: 'completed',
      seller: 'Regional Routes LLC',
      purchaseDate: '2024-01-09',
      completionDate: '2024-01-12',
      transferStatus: 'complete',
      documents: ['Transfer Certificate', 'Insurance Docs', 'Authority Papers']
    },
    {
      id: '2',
      mcNumber: '123456',
      listingTitle: 'Established Interstate Authority - Clean Record',
      purchasePrice: 44000,
      status: 'in-progress',
      seller: 'TransportPro LLC',
      purchaseDate: '2024-01-11',
      completionDate: null,
      transferStatus: 'pending',
      documents: ['Purchase Agreement']
    }
  ]

  const filteredPurchases = purchases.filter(purchase =>
    activeFilter === 'all' || purchase.status === activeFilter
  )

  const stats = [
    {
      label: 'Total Purchases',
      value: purchases.length,
      color: 'text-primary-400'
    },
    {
      label: 'In Progress',
      value: purchases.filter(p => p.status === 'in-progress').length,
      color: 'text-yellow-400'
    },
    {
      label: 'Completed',
      value: purchases.filter(p => p.status === 'completed').length,
      color: 'text-trust-high'
    },
    {
      label: 'Total Spent',
      value: `$${(purchases.reduce((sum, p) => sum + p.purchasePrice, 0) / 1000).toFixed(0)}K`,
      color: 'text-primary-400'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">My Purchases</h2>
          <p className="text-white/60">View your purchased MC authorities and transfer status</p>
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

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'in-progress', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                activeFilter === filter
                  ? 'bg-primary-500 text-white'
                  : 'glass-subtle text-white/80 hover:bg-white/15'
              }`}
            >
              {filter === 'in-progress' ? 'In Progress' : filter}
            </button>
          ))}
        </div>

        {/* Purchases List */}
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => (
            <GlassCard key={purchase.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold">MC #{purchase.mcNumber}</h3>
                    <span className={`glass-subtle px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${
                      purchase.status === 'completed' ? 'text-trust-high' : 'text-yellow-400'
                    }`}>
                      {purchase.status === 'completed' ? (
                        <><CheckCircle className="w-4 h-4" />Completed</>
                      ) : (
                        <><Clock className="w-4 h-4" />In Progress</>
                      )}
                    </span>
                  </div>
                  <p className="text-white/80 mb-3">{purchase.listingTitle}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-white/60">Seller:</span>
                      <span className="text-white/90">{purchase.seller}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/60">Purchase Date:</span>
                      <span className="text-white/90">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                    </div>
                    {purchase.completionDate && (
                      <div className="flex gap-2">
                        <span className="text-white/60">Completed:</span>
                        <span className="text-white/90">{new Date(purchase.completionDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="text-white/60">Transfer Status:</span>
                      <span className={purchase.transferStatus === 'complete' ? 'text-trust-high' : 'text-yellow-400'}>
                        {purchase.transferStatus === 'complete' ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right ml-4">
                  <div className="text-2xl font-bold text-primary-400 mb-2">
                    ${purchase.purchasePrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60">Purchase Price</div>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Available Documents</div>
                <div className="flex flex-wrap gap-2">
                  {purchase.documents.map((doc, index) => (
                    <div key={index} className="glass-subtle px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-primary-400" />
                      <span>{doc}</span>
                      <Button variant="ghost" size="sm">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button fullWidth variant="secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button fullWidth variant="secondary">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
                <Button fullWidth variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuyerPurchasesPage
