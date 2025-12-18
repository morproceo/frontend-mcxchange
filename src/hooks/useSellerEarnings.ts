import { useState, useEffect, useCallback } from 'react'
import { api } from '../services/api'

// Types for earnings data
export interface CompletedTransaction {
  id: string
  mcNumber: string
  listingTitle: string
  buyerName: string
  agreedPrice: number
  platformFee: number
  netEarnings: number
  completedAt: Date
}

export interface StripePayment {
  id: string
  amount: number
  description: string | null
  receiptUrl: string | null
  created: Date
  paymentMethod: { brand: string; last4: string } | null
  type: 'listing_fee' | 'charge' | 'unknown'
  mcNumber: string | null
}

export interface EarningsTotals {
  gross: number
  fees: number
  net: number
}

interface UseSellerEarningsResult {
  // Completed deals/transactions
  transactions: CompletedTransaction[]
  totals: EarningsTotals
  // Stripe payment history
  stripePayments: StripePayment[]
  // Loading states
  loading: boolean
  stripeLoading: boolean
  error: string | null
  // Actions
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch and manage seller earnings data
 * Fetches both completed transactions and Stripe payment history
 */
export function useSellerEarnings(): UseSellerEarningsResult {
  const [transactions, setTransactions] = useState<CompletedTransaction[]>([])
  const [totals, setTotals] = useState<EarningsTotals>({ gross: 0, fees: 0, net: 0 })
  const [stripePayments, setStripePayments] = useState<StripePayment[]>([])
  const [loading, setLoading] = useState(true)
  const [stripeLoading, setStripeLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Transform API response to CompletedTransaction type
   */
  const transformTransaction = (data: any): CompletedTransaction => ({
    id: data.id,
    mcNumber: data.listing?.mcNumber ?? 'N/A',
    listingTitle: data.listing?.title ?? 'Unknown Listing',
    buyerName: data.buyer?.name ?? 'Unknown Buyer',
    agreedPrice: Number(data.agreedPrice) || 0,
    platformFee: Number(data.platformFee) || 0,
    netEarnings: Number(data.netEarnings) || 0,
    completedAt: data.completedAt ? new Date(data.completedAt) : new Date(),
  })

  /**
   * Transform Stripe data to StripePayment type
   */
  const transformStripePayment = (
    charge?: any,
    session?: any
  ): StripePayment => {
    // Prefer checkout session data if available
    if (session) {
      return {
        id: session.id,
        amount: session.amountTotal || 0,
        description: session.type === 'listing_fee'
          ? `Listing Fee - MC #${session.mcNumber || 'N/A'}`
          : session.mode === 'subscription'
            ? 'Subscription Payment'
            : 'Payment',
        receiptUrl: null,
        created: session.created ? new Date(session.created) : new Date(),
        paymentMethod: null,
        type: session.type === 'listing_fee' ? 'listing_fee' : 'unknown',
        mcNumber: session.mcNumber || null,
      }
    }

    // Fall back to charge data
    if (charge) {
      return {
        id: charge.id,
        amount: charge.amount || 0,
        description: charge.description,
        receiptUrl: charge.receiptUrl,
        created: charge.created ? new Date(charge.created) : new Date(),
        paymentMethod: charge.paymentMethod,
        type: 'charge',
        mcNumber: charge.metadata?.mcNumber || null,
      }
    }

    // Should never happen
    return {
      id: 'unknown',
      amount: 0,
      description: null,
      receiptUrl: null,
      created: new Date(),
      paymentMethod: null,
      type: 'unknown',
      mcNumber: null,
    }
  }

  /**
   * Fetch completed transactions (earnings)
   */
  const fetchEarnings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.getSellerEarnings({ limit: 100 })

      if (response.success) {
        const transformedTransactions = (response.data || []).map(transformTransaction)
        setTransactions(transformedTransactions)
        setTotals(response.totals || { gross: 0, fees: 0, net: 0 })
      }
    } catch (err) {
      console.error('Failed to fetch seller earnings:', err)
      setError('Failed to load earnings data')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch Stripe payment history
   */
  const fetchStripeHistory = useCallback(async () => {
    try {
      setStripeLoading(true)

      const response = await api.getSellerStripeHistory()

      if (response.success && response.data) {
        const payments: StripePayment[] = []

        // Add checkout sessions (listing fees, etc.)
        for (const session of response.data.checkoutSessions || []) {
          payments.push(transformStripePayment(undefined, session))
        }

        // Add charges that aren't already covered by sessions
        for (const charge of response.data.charges || []) {
          // Check if this charge is already represented by a session
          const sessionIds = (response.data.checkoutSessions || []).map(s => s.id)
          if (!sessionIds.includes(charge.id)) {
            payments.push(transformStripePayment(charge, undefined))
          }
        }

        // Sort by date, newest first
        payments.sort((a, b) => b.created.getTime() - a.created.getTime())

        setStripePayments(payments)
      }
    } catch (err) {
      console.error('Failed to fetch Stripe history:', err)
      // Don't set error for stripe - it's secondary data
    } finally {
      setStripeLoading(false)
    }
  }, [])

  /**
   * Fetch all data
   */
  const refetch = useCallback(async () => {
    await Promise.all([fetchEarnings(), fetchStripeHistory()])
  }, [fetchEarnings, fetchStripeHistory])

  // Fetch data on mount
  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    transactions,
    totals,
    stripePayments,
    loading,
    stripeLoading,
    error,
    refetch,
  }
}

export default useSellerEarnings
