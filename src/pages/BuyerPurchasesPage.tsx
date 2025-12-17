import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Download,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Eye,
  ShoppingBag
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

interface Purchase {
  id: string
  mcNumber: string
  listingTitle: string
  purchasePrice: number
  status: 'in-progress' | 'completed'
  seller: string
  purchaseDate: string
  completionDate: string | null
  transferStatus: 'pending' | 'complete'
  documents: string[]
}

const BuyerPurchasesPage = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'in-progress' | 'completed'>('all')

  // Empty array - will be populated from API
  const purchases: Purchase[] = []

  const filteredPurchases = purchases.filter(purchase =>
    activeFilter === 'all' || purchase.status === activeFilter
  )

  const stats = [
    {
      label: 'Total Purchases',
      value: purchases.length,
      color: 'text-gray-900'
    },
    {
      label: 'In Progress',
      value: purchases.filter(p => p.status === 'in-progress').length,
      color: 'text-yellow-600'
    },
    {
      label: 'Completed',
      value: purchases.filter(p => p.status === 'completed').length,
      color: 'text-green-600'
    },
    {
      label: 'Total Spent',
      value: `$${(purchases.reduce((sum, p) => sum + p.purchasePrice, 0) / 1000).toFixed(0)}K`,
      color: 'text-gray-900'
    }
  ]

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">My Purchases</h2>
          <p className="text-gray-500">View your purchased MC authorities and transfer status</p>
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
              <Card>
                <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              </Card>
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
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter === 'in-progress' ? 'In Progress' : filter}
            </button>
          ))}
        </div>

        {/* Purchases List */}
        <div className="space-y-4">
          {filteredPurchases.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No purchases yet</h3>
                <p className="text-gray-500 mb-6">
                  Your completed purchases will appear here
                </p>
                <Link to="/marketplace">
                  <Button>Browse Marketplace</Button>
                </Link>
              </div>
            </Card>
          ) : (
            filteredPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">MC #{purchase.mcNumber}</h3>
                      <span className={`bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1.5 ${
                        purchase.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {purchase.status === 'completed' ? (
                          <><CheckCircle className="w-4 h-4" />Completed</>
                        ) : (
                          <><Clock className="w-4 h-4" />In Progress</>
                        )}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{purchase.listingTitle}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <span className="text-gray-500">Seller:</span>
                        <span className="text-gray-900">{purchase.seller}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-gray-500">Purchase Date:</span>
                        <span className="text-gray-900">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      {purchase.completionDate && (
                        <div className="flex gap-2">
                          <span className="text-gray-500">Completed:</span>
                          <span className="text-gray-900">{new Date(purchase.completionDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <span className="text-gray-500">Transfer Status:</span>
                        <span className={purchase.transferStatus === 'complete' ? 'text-green-600' : 'text-yellow-600'}>
                          {purchase.transferStatus === 'complete' ? 'Complete' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ${purchase.purchasePrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Purchase Price</div>
                  </div>
                </div>

                {/* Documents */}
                {purchase.documents.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Available Documents</div>
                    <div className="flex flex-wrap gap-2">
                      {purchase.documents.map((doc, index) => (
                        <div key={index} className="bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">{doc}</span>
                          <Button variant="ghost" size="sm">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button fullWidth variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button fullWidth variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>
                  {purchase.documents.length > 0 && (
                    <Button fullWidth variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default BuyerPurchasesPage
