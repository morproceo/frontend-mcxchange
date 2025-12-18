import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  User,
  Building2,
  Crown,
  Check,
  Loader2,
  AlertCircle,
  Handshake
} from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'

interface ApprovalStatus {
  buyerApproved: boolean
  buyerApprovedAt?: Date
  sellerApproved: boolean
  sellerApprovedAt?: Date
  adminApproved: boolean
  adminApprovedAt?: Date
}

interface PartyInfo {
  id: string
  name: string
}

interface AgreementApprovalPanelProps {
  title: string
  description?: string
  approvalStatus: ApprovalStatus
  buyer: PartyInfo
  seller: PartyInfo
  userRole: 'buyer' | 'seller' | 'admin'
  onBuyerApprove: () => Promise<void>
  onSellerApprove: () => Promise<void>
  onAdminApprove: () => Promise<void>
  adminApproveLabel?: string
  showAdminSection?: boolean
  requireAllApprovals?: boolean
  children?: React.ReactNode
}

const AgreementApprovalPanel = ({
  title,
  description,
  approvalStatus,
  buyer,
  seller,
  userRole,
  onBuyerApprove,
  onSellerApprove,
  onAdminApprove,
  adminApproveLabel = 'Finalize & Approve',
  showAdminSection = true,
  requireAllApprovals = true,
  children
}: AgreementApprovalPanelProps) => {
  const [loading, setLoading] = useState<'buyer' | 'seller' | 'admin' | null>(null)

  const isBuyer = userRole === 'buyer'
  const isSeller = userRole === 'seller'
  const isAdmin = userRole === 'admin'

  const allPartiesApproved = approvalStatus.buyerApproved && approvalStatus.sellerApproved
  const allApproved = allPartiesApproved && approvalStatus.adminApproved

  const handleApprove = async (party: 'buyer' | 'seller' | 'admin') => {
    setLoading(party)
    try {
      if (party === 'buyer') {
        await onBuyerApprove()
      } else if (party === 'seller') {
        await onSellerApprove()
      } else {
        await onAdminApprove()
      }
    } finally {
      setLoading(null)
    }
  }

  const getStatusMessage = () => {
    if (allApproved) {
      return {
        type: 'success',
        message: 'All parties have approved! Transaction can proceed to the next step.'
      }
    }

    if (isBuyer) {
      if (!approvalStatus.buyerApproved) {
        return {
          type: 'action',
          message: 'Please review the agreement and approve to proceed.'
        }
      }
      if (!approvalStatus.sellerApproved) {
        return {
          type: 'waiting',
          message: 'Waiting for seller to review and approve...'
        }
      }
      if (!approvalStatus.adminApproved) {
        return {
          type: 'waiting',
          message: 'Both parties approved! Waiting for admin final review...'
        }
      }
    }

    if (isSeller) {
      if (!approvalStatus.sellerApproved) {
        return {
          type: 'action',
          message: 'Please review the agreement and approve to proceed.'
        }
      }
      if (!approvalStatus.buyerApproved) {
        return {
          type: 'waiting',
          message: 'Waiting for buyer to review and approve...'
        }
      }
      if (!approvalStatus.adminApproved) {
        return {
          type: 'waiting',
          message: 'Both parties approved! Waiting for admin final review...'
        }
      }
    }

    if (isAdmin) {
      if (!allPartiesApproved) {
        return {
          type: 'info',
          message: 'Waiting for both buyer and seller to approve before admin can finalize.'
        }
      }
      if (!approvalStatus.adminApproved) {
        return {
          type: 'action',
          message: 'Both parties have approved. Ready for admin review and finalization.'
        }
      }
    }

    return null
  }

  const statusMessage = getStatusMessage()

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <Handshake className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      </div>

      {/* Agreement Content (children) */}
      {children && (
        <div className="mb-4">
          {children}
        </div>
      )}

      {/* Approval Status Grid */}
      <div className="bg-white rounded-xl p-4 mb-4">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-gray-400" />
          Approval Status
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {/* Buyer Status */}
          <motion.div
            className={`p-4 rounded-xl border-2 transition-all ${
              approvalStatus.buyerApproved
                ? 'border-green-300 bg-green-50'
                : isBuyer && !approvalStatus.buyerApproved
                ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-400'
                : 'border-gray-200 bg-gray-50'
            }`}
            animate={approvalStatus.buyerApproved ? { scale: [1, 1.02, 1] } : {}}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                approvalStatus.buyerApproved ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Buyer</span>
            </div>
            <p className="text-xs text-gray-600 mb-2 truncate" title={buyer.name}>
              {buyer.name}
            </p>
            <div className="flex items-center gap-1">
              {approvalStatus.buyerApproved ? (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              ) : (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Pending
                </span>
              )}
            </div>
            {approvalStatus.buyerApprovedAt && (
              <p className="text-xs text-gray-400 mt-1">
                {new Date(approvalStatus.buyerApprovedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>

          {/* Seller Status */}
          <motion.div
            className={`p-4 rounded-xl border-2 transition-all ${
              approvalStatus.sellerApproved
                ? 'border-green-300 bg-green-50'
                : isSeller && !approvalStatus.sellerApproved
                ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-400'
                : 'border-gray-200 bg-gray-50'
            }`}
            animate={approvalStatus.sellerApproved ? { scale: [1, 1.02, 1] } : {}}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                approvalStatus.sellerApproved ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">Seller</span>
            </div>
            <p className="text-xs text-gray-600 mb-2 truncate" title={seller.name}>
              {seller.name}
            </p>
            <div className="flex items-center gap-1">
              {approvalStatus.sellerApproved ? (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Approved
                </span>
              ) : (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Pending
                </span>
              )}
            </div>
            {approvalStatus.sellerApprovedAt && (
              <p className="text-xs text-gray-400 mt-1">
                {new Date(approvalStatus.sellerApprovedAt).toLocaleDateString()}
              </p>
            )}
          </motion.div>

          {/* Admin Status */}
          {showAdminSection && (
            <motion.div
              className={`p-4 rounded-xl border-2 transition-all ${
                approvalStatus.adminApproved
                  ? 'border-green-300 bg-green-50'
                  : isAdmin && allPartiesApproved
                  ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-400'
                  : 'border-amber-200 bg-amber-50'
              }`}
              animate={approvalStatus.adminApproved ? { scale: [1, 1.02, 1] } : {}}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  approvalStatus.adminApproved ? 'bg-green-500' : 'bg-amber-500'
                }`}>
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-sm">Admin</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">MC Exchange</p>
              <div className="flex items-center gap-1">
                {approvalStatus.adminApproved ? (
                  <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Finalized
                  </span>
                ) : allPartiesApproved ? (
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Ready
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Waiting
                  </span>
                )}
              </div>
              {approvalStatus.adminApprovedAt && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(approvalStatus.adminApprovedAt).toLocaleDateString()}
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Approval Progress</span>
            <span>
              {[approvalStatus.buyerApproved, approvalStatus.sellerApproved, showAdminSection && approvalStatus.adminApproved].filter(Boolean).length}
              /{showAdminSection ? 3 : 2} approved
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ([approvalStatus.buyerApproved, approvalStatus.sellerApproved, showAdminSection && approvalStatus.adminApproved].filter(Boolean).length /
                    (showAdminSection ? 3 : 2)) *
                  100
                }%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl mb-4 ${
            statusMessage.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : statusMessage.type === 'action'
              ? 'bg-blue-50 border border-blue-200'
              : statusMessage.type === 'waiting'
              ? 'bg-yellow-50 border border-yellow-200'
              : 'bg-gray-50 border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {statusMessage.type === 'action' && <AlertCircle className="w-5 h-5 text-blue-600" />}
            {statusMessage.type === 'waiting' && <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />}
            {statusMessage.type === 'info' && <Clock className="w-5 h-5 text-gray-600" />}
            <p
              className={`text-sm font-medium ${
                statusMessage.type === 'success'
                  ? 'text-green-700'
                  : statusMessage.type === 'action'
                  ? 'text-blue-700'
                  : statusMessage.type === 'waiting'
                  ? 'text-yellow-700'
                  : 'text-gray-700'
              }`}
            >
              {statusMessage.message}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Buyer Approve Button */}
        {isBuyer && !approvalStatus.buyerApproved && (
          <Button
            fullWidth
            loading={loading === 'buyer'}
            onClick={() => handleApprove('buyer')}
          >
            <Check className="w-4 h-4 mr-2" />
            I Approve This Agreement
          </Button>
        )}

        {/* Seller Approve Button */}
        {isSeller && !approvalStatus.sellerApproved && (
          <Button
            fullWidth
            loading={loading === 'seller'}
            onClick={() => handleApprove('seller')}
          >
            <Check className="w-4 h-4 mr-2" />
            I Approve This Agreement
          </Button>
        )}

        {/* Admin Approve Button (only when both parties approved) */}
        {isAdmin && showAdminSection && allPartiesApproved && !approvalStatus.adminApproved && (
          <Button
            fullWidth
            loading={loading === 'admin'}
            onClick={() => handleApprove('admin')}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Crown className="w-4 h-4 mr-2" />
            {adminApproveLabel}
          </Button>
        )}

        {/* All Approved Message */}
        {allApproved && (
          <div className="p-4 bg-green-100 border border-green-300 rounded-xl text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-semibold">All Parties Have Approved!</p>
            <p className="text-green-600 text-sm">The transaction will now proceed to the next step.</p>
          </div>
        )}
      </div>
    </Card>
  )
}

export default AgreementApprovalPanel
