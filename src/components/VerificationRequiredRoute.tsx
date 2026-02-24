import { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthPromptPage from './AuthPromptPage'
import IdentityVerificationPrompt from './IdentityVerificationPrompt'

interface VerificationRequiredRouteProps {
  children: ReactNode
}

/**
 * A route wrapper that requires both authentication AND identity verification.
 * - Not authenticated -> shows AuthPromptPage
 * - Admin -> renders children (bypass verification)
 * - Not identity verified -> shows IdentityVerificationPrompt
 * - Otherwise -> renders children
 */
const VerificationRequiredRoute = ({ children }: VerificationRequiredRouteProps) => {
  const { isAuthenticated, isLoading, user, isIdentityVerified } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Not authenticated - show auth prompt page
  if (!isAuthenticated) {
    return <AuthPromptPage />
  }

  // Admin bypass
  if (user?.role === 'admin') {
    return <>{children}</>
  }

  // Not identity verified - show verification prompt
  if (!isIdentityVerified) {
    return <IdentityVerificationPrompt />
  }

  return <>{children}</>
}

export default VerificationRequiredRoute
