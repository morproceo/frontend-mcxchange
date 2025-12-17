import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User as UserIcon, Shield, Key } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { DomileaIcon } from '../components/ui/DomileaLogo'

// Secret admin registration code - in production, this should be stored securely
const ADMIN_SECRET_CODE = 'DOMILEA-ADMIN-2024'

const AdminRegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [secretCode, setSecretCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate secret code
    if (secretCode !== ADMIN_SECRET_CODE) {
      setError('Invalid admin registration code')
      return
    }

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
      // Register as admin (uppercase for backend validation)
      await register(email, password, name, 'ADMIN' as any)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
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
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Registration</h1>
          <p className="text-gray-500">Create an administrator account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Warning Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Restricted Access</span>
              </div>
              <p className="mt-1 text-xs">
                This page is for authorized personnel only. You need a valid admin registration code.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Input
              label="Admin Registration Code"
              type="password"
              placeholder="Enter secret code"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              icon={<Key className="w-4 h-4" />}
              required
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
              placeholder="admin@domilea.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              required
            />

            <div className="text-xs text-gray-500">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  required
                />
                <span>
                  I confirm that I am authorized to create an administrator account and will handle all data responsibly.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="!bg-red-600 hover:!bg-red-700"
            >
              Create Admin Account
            </Button>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary-600 hover:text-secondary-700 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-6">
          This page is not linked from the public site.
        </p>
      </motion.div>
    </div>
  )
}

export default AdminRegisterPage
