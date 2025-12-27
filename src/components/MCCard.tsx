import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Eye,
  Heart,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  Crown
} from 'lucide-react'
import { MCListing } from '../types'
import TrustBadge from './ui/TrustBadge'
import Card from './ui/Card'
import { formatDistanceToNow } from 'date-fns'
import { getPartialMCNumber, getTrustLevel } from '../utils/helpers'
import clsx from 'clsx'

interface MCCardProps {
  listing: MCListing
  onSave?: (id: string) => void
  isSaved?: boolean
}

const MCCard = ({ listing, onSave, isSaved }: MCCardProps) => {
  const getAmazonScoreColor = (score: string | null) => {
    if (!score) return 'text-gray-400'
    switch (score) {
      case 'A': return 'text-emerald-600'
      case 'B': return 'text-green-600'
      case 'C': return 'text-amber-600'
      case 'D': return 'text-orange-600'
      case 'F': return 'text-red-600'
      default: return 'text-gray-400'
    }
  }

  return (
    <Card hover className="group relative overflow-hidden">
      {/* Premium Badge */}
      {listing.isPremium && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold text-amber-700">PREMIUM</span>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <Link to={`/mc/${listing.id}`}>
              <h3 className="text-xl font-bold text-gray-900 hover:text-secondary-600 transition-colors mb-1">
                MC #{getPartialMCNumber(listing.mcNumber)}
              </h3>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 border border-gray-200">
                <MapPin className="w-3 h-3 text-gray-600" />
                <span className="font-semibold text-gray-700">{listing.state}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{listing.yearsActive} yrs</span>
              </div>
            </div>
          </div>

          {onSave && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSave(listing.id)}
              className={clsx(
                'p-2 rounded-full bg-gray-50 border border-gray-100 transition-colors',
                isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              )}
            >
              <Heart className={clsx('w-5 h-5', isSaved && 'fill-current')} />
            </motion.button>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-gray-900">
            ${(listing.listingPrice || listing.askingPrice || listing.price || 0).toLocaleString()}
          </div>
        </div>

        {/* Quick Info Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Amazon Status */}
          {listing.amazonStatus === 'active' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-lg">📦</span>
              <span className="text-xs font-medium text-emerald-700">Amazon</span>
              {listing.amazonRelayScore && (
                <span className={clsx('text-xs font-bold', getAmazonScoreColor(listing.amazonRelayScore))}>
                  {listing.amazonRelayScore}
                </span>
              )}
            </div>
          )}
          {listing.amazonStatus === 'pending' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-lg">📦</span>
              <span className="text-xs font-medium text-amber-700">Pending</span>
            </div>
          )}

          {/* Highway Setup */}
          {listing.highwaySetup && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
              <span className="text-lg">🛣️</span>
              <span className="text-xs font-medium text-blue-700">Highway</span>
            </div>
          )}
        </div>

        {/* What's Included in Sale */}
        <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-medium">Included in Sale</div>
          <div className="flex items-center gap-4">
            <div className={clsx(
              'flex items-center gap-1.5 text-xs font-medium',
              listing.sellingWithEmail ? 'text-emerald-600' : 'text-gray-400'
            )}>
              {listing.sellingWithEmail ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>Email</span>
            </div>
            <div className={clsx(
              'flex items-center gap-1.5 text-xs font-medium',
              listing.sellingWithPhone ? 'text-emerald-600' : 'text-gray-400'
            )}>
              {listing.sellingWithPhone ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>Phone</span>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mb-4">
          <TrustBadge
            score={listing.trustScore}
            level={getTrustLevel(listing.trustScore)}
            verified={listing.verified}
            size="sm"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{listing.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              <span>{listing.saves}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            {formatDistanceToNow(listing.createdAt, { addSuffix: true })}
          </div>
        </div>

        {/* View Details Button */}
        <Link to={`/mc/${listing.id}`}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="mt-4 w-full bg-black hover:bg-gray-800 text-white text-center py-2.5 rounded-xl font-medium transition-colors text-sm"
          >
            View Details
          </motion.div>
        </Link>
      </div>
    </Card>
  )
}

export default MCCard
