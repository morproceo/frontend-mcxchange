import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { DomileaIcon } from '../components/ui/DomileaLogo'
import { UserRole } from '../types'

const RegisterPage = () => {
  const [searchParams] = useSearchParams()
  const initialRole = (searchParams.get('role') as UserRole) || 'buyer'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>(initialRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      await register(email, password, name, role)

      // Navigate based on role
      switch (role) {
        case 'seller':
          navigate('/seller/dashboard')
          break
        case 'buyer':
          navigate('/buyer/dashboard')
          break
        case 'admin':
          navigate('/admin/dashboard')
          break
        default:
          navigate('/')
      }
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <DomileaIcon size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500">Join the Domilea marketplace</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Select
              label="I want to"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { value: 'buyer', label: 'Buy MC Authorities' },
                { value: 'seller', label: 'Sell MC Authorities' },
                { value: 'admin', label: 'Admin Access' }
              ]}
            />

            <Input
              label="Full Name"
              type="text"
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<UserIcon className="w-4 h-4" />}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="text-xs text-gray-500">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  required
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="text-secondary-600 hover:text-secondary-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-secondary-600 hover:text-secondary-700 font-medium">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Create Account
            </Button>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary-600 hover:text-secondary-700 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegisterPage
