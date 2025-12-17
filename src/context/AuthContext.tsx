import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '../types'
import api from '../services/api'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<User>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Helper to convert backend role (uppercase) to frontend role (lowercase)
const normalizeRole = (role: string): UserRole => {
  const lowerRole = role.toLowerCase()
  if (lowerRole === 'buyer' || lowerRole === 'seller' || lowerRole === 'admin') {
    return lowerRole as UserRole
  }
  return 'buyer' // default fallback
}

// Helper to convert frontend role to backend role (uppercase)
const toBackendRole = (role: UserRole): string => {
  return role.toUpperCase()
}

// Transform API user response to frontend User type
const transformUser = (apiUser: any): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.name,
    role: normalizeRole(apiUser.role),
    avatar: apiUser.avatar || undefined,
    verified: apiUser.verified || apiUser.emailVerified || false,
    trustScore: apiUser.trustScore || 0,
    memberSince: new Date(apiUser.memberSince || apiUser.createdAt),
    completedDeals: apiUser.completedDeals || 0,
    reviews: apiUser.reviews || [],
    totalCredits: apiUser.totalCredits || 0,
    usedCredits: apiUser.usedCredits || 0
  }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored token and validate session
    const initAuth = async () => {
      const token = api.getToken()
      if (token) {
        try {
          // Validate token by getting current user
          const response = await api.getCurrentUser()
          if (response.user) {
            const transformedUser = transformUser(response.user)
            setUser(transformedUser)
            localStorage.setItem('mcx_user', JSON.stringify(transformedUser))
          } else {
            // No user returned, clear everything
            api.setToken(null)
            localStorage.removeItem('mcx_user')
            localStorage.removeItem('mcx_refresh_token')
            setUser(null)
          }
        } catch (error) {
          // Token is invalid, clear it
          console.error('Session validation failed:', error)
          api.setToken(null)
          localStorage.removeItem('mcx_user')
          localStorage.removeItem('mcx_refresh_token')
          setUser(null)
        }
      } else {
        // No token, clear any stale user data
        localStorage.removeItem('mcx_user')
        localStorage.removeItem('mcx_refresh_token')
        setUser(null)
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true)
    try {
      const response = await api.login(email, password)

      const transformedUser = transformUser(response.user)
      setUser(transformedUser)
      localStorage.setItem('mcx_user', JSON.stringify(transformedUser))

      return transformedUser
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
    setIsLoading(true)
    try {
      const response = await api.register({
        email,
        password,
        name,
        role: toBackendRole(role)
      })

      const transformedUser = transformUser(response.user)
      setUser(transformedUser)
      localStorage.setItem('mcx_user', JSON.stringify(transformedUser))

      return transformedUser
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw new Error(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('mcx_user')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
