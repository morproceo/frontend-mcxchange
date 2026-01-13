import { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import AuthPromptPage from './AuthPromptPage'

interface AuthRequiredRouteProps {
  children: ReactNode
}

/**
 * A route wrapper that shows an authentication prompt page
 * instead of redirecting to login. This provides a better UX
 * by showing users why they need to sign in.
 */
const AuthRequiredRoute = ({ children }: AuthRequiredRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()

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

  return <>{children}</>
}

export default AuthRequiredRoute
