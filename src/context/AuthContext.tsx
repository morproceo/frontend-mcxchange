import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '../types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('mcx_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, _password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role,
        verified: true,
        trustScore: 85,
        memberSince: new Date(),
        completedDeals: 5,
        reviews: []
      }

      setUser(mockUser)
      localStorage.setItem('mcx_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, _password: string, name: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        verified: false,
        trustScore: 0,
        memberSince: new Date(),
        completedDeals: 0,
        reviews: []
      }

      setUser(mockUser)
      localStorage.setItem('mcx_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mcx_user')
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
