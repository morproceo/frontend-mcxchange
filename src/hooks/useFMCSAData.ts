import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import type { FMCSACarrierData, FMCSAAuthorityHistory, FMCSAInsuranceHistory, FMCSASMSData } from '../types'

interface UseFMCSADataResult {
  carrier: FMCSACarrierData | null
  authority: FMCSAAuthorityHistory | null
  insurance: FMCSAInsuranceHistory[] | null
  smsData: FMCSASMSData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch FMCSA data for a carrier
 * @param mcNumber - The MC number to look up
 * @param enabled - Whether to fetch data (used to only fetch when unlocked)
 */
export function useFMCSAData(mcNumber: string | undefined, enabled: boolean = true): UseFMCSADataResult {
  const [carrier, setCarrier] = useState<FMCSACarrierData | null>(null)
  const [authority, setAuthority] = useState<FMCSAAuthorityHistory | null>(null)
  const [insurance, setInsurance] = useState<FMCSAInsuranceHistory[] | null>(null)
  const [smsData, setSmsData] = useState<FMCSASMSData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFMCSAData = useCallback(async () => {
    if (!mcNumber || !enabled) return

    try {
      setLoading(true)
      setError(null)

      // Fetch full snapshot from FMCSA
      const response = await api.fmcsaGetSnapshot(mcNumber, 'MC')

      if (response.success && response.data) {
        setCarrier(response.data.carrier)
        setAuthority(response.data.authority)
        setInsurance(response.data.insurance)

        // If we got carrier data, also fetch SMS data using the DOT number
        if (response.data.carrier?.dotNumber) {
          try {
            const smsResponse = await api.fmcsaGetSMSData(response.data.carrier.dotNumber)
            if (smsResponse.success && smsResponse.data) {
              setSmsData(smsResponse.data)
            }
          } catch (smsErr) {
            // SMS data is optional, don't fail the whole request
            console.warn('Failed to fetch SMS data:', smsErr)
          }
        }
      } else {
        setError('Unable to fetch FMCSA data')
      }
    } catch (err: any) {
      console.error('Failed to fetch FMCSA data:', err)
      setError(err.message || 'Failed to fetch FMCSA data')
    } finally {
      setLoading(false)
    }
  }, [mcNumber, enabled])

  useEffect(() => {
    fetchFMCSAData()
  }, [fetchFMCSAData])

  return {
    carrier,
    authority,
    insurance,
    smsData,
    loading,
    error,
    refetch: fetchFMCSAData,
  }
}

export default useFMCSAData
