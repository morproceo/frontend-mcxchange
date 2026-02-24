import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User as UserIcon, AlertCircle, Phone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { DomileaIcon } from '../components/ui/DomileaLogo'
import { UserRole } from '../types'

// Email validation regex - comprehensive check for valid email format
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/

// List of disposable/temporary email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'yopmail.com', 'temp-mail.org', 'fakeinbox.com',
  'sharklasers.com', 'trashmail.com', 'getnada.com', 'maildrop.cc',
  'dispostable.com', 'mintemail.com', 'mytemp.email', 'tempail.com'
]

// Validate email format and check for disposable domains
const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: 'Email is required' }
  }

  // Check basic format
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  // Extract domain
  const domain = email.split('@')[1]?.toLowerCase()

  // Check for disposable email domains
  if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
    return { isValid: false, error: 'Please use a permanent email address, not a temporary one' }
  }

  // Check domain has at least one dot (e.g., gmail.com, not gmail)
  if (domain && !domain.includes('.')) {
    return { isValid: false, error: 'Please enter a valid email domain' }
  }

  return { isValid: true }
}

const RegisterPage = () => {
  const [searchParams] = useSearchParams()
  const roleParam = searchParams.get('role')
  const redirectUrl = searchParams.get('redirect')
  // Only allow buyer or seller from URL params
  const initialRole: UserRole = (roleParam === 'seller' || roleParam === 'buyer') ? roleParam : 'buyer'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>(initialRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')

    // Format as (XXX) XXX-XXXX
    if (digits.length <= 3) {
      return digits
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  // Validate email on blur
  const handleEmailBlur = () => {
    const validation = validateEmail(email)
    setEmailError(validation.error || '')
  }

  // Clear email error when user starts typing again
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) {
      setEmailError('')
    }
  }

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEmailError('')

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || 'Invalid email')
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

    if (!termsAccepted) {
      setError('You must accept the Terms of Service and Privacy Policy')
      return
    }

    setLoading(true)

    try {
      // Register returns the user with their role
      const user = await register(email, password, name, role, phone)

      // If there's a redirect URL, use it (after validating it's a local path)
      if (redirectUrl && redirectUrl.startsWith('/')) {
        navigate(redirectUrl)
        return
      }

      // Navigate based on the user's role from the API response
      switch (user.role) {
        case 'seller':
          navigate('/seller/welcome')
          break
        case 'buyer':
          navigate('/buyer/welcome')
          break
        case 'admin':
          navigate('/admin/dashboard')
          break
        default:
          navigate('/')
      }
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
                { value: 'seller', label: 'Sell MC Authorities' }
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

            <div>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                icon={<Mail className="w-4 h-4" />}
                required
              />
              {emailError && (
                <div className="flex items-center gap-1.5 mt-1.5 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            <Input
              label="Phone Number"
              type="tel"
              placeholder="(555) 555-5555"
              value={phone}
              onChange={handlePhoneChange}
              icon={<Phone className="w-4 h-4" />}
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

            <div className="text-sm text-gray-600">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span>
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    target="_blank"
                    className="text-secondary-600 hover:text-secondary-700 font-medium underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    to="/privacy"
                    target="_blank"
                    className="text-secondary-600 hover:text-secondary-700 font-medium underline"
                  >
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
