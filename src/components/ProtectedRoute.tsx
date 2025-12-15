import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { UserRole } from '../types'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: UserRole[]
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8">
          <div className="animate-pulse text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
