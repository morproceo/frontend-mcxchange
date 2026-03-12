import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'

interface UseCarrierDataResult {
  carrierReport: any | null
  loading: boolean
  error: string | null
}

/**
 * Custom hook to fetch carrier intelligence data from MorPro Carrier API
 * Only fetches when dotNumber is provided. Deduplicates requests.
 */
export function useCarrierData(dotNumber: string | undefined): UseCarrierDataResult {
  const [carrierReport, setCarrierReport] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!dotNumber) return

    // Strip any prefix like "DOT-" — the API expects a plain numeric DOT number
    const cleanDot = dotNumber.replace(/\D/g, '')
    if (!cleanDot) return

    // Don't re-fetch if we already have data for this DOT
    if (fetchedRef.current === cleanDot && carrierReport) return

    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const response = await api.getCarrierReport(cleanDot)

        if (cancelled) return

        if (response.success && response.data) {
          setCarrierReport(response.data)
          fetchedRef.current = cleanDot
        } else {
          setError('Carrier data not available')
        }
      } catch (err: any) {
        if (cancelled) return
        console.error('Failed to fetch carrier data:', err)
        setError(err?.message || 'Failed to load carrier data')
        setCarrierReport(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [dotNumber])

  return { carrierReport, loading, error }
}

export default useCarrierData
