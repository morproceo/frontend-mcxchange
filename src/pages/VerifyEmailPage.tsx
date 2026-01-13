import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { DomileaIcon } from '../components/ui/DomileaLogo'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

type VerificationStatus = 'verifying' | 'success' | 'error' | 'no-token'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [status, setStatus] = useState<VerificationStatus>('verifying')
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('no-token')
        return
      }

      try {
        const response = await api.verifyEmail(token)
        setStatus('success')
        setMessage(response.message || 'Email verified successfully!')
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message || 'Failed to verify email. The link may have expired.')
      }
    }

    verifyEmail()
  }, [token])

  const handleResendVerification = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setResending(true)
    try {
      await api.resendVerificationEmail()
      setResendSuccess(true)
    } catch (err: any) {
      setMessage(err.message || 'Failed to resend verification email.')
    } finally {
      setResending(false)
    }
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'seller': return '/seller/dashboard'
      case 'buyer': return '/buyer/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/'
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
        </div>

        <Card>
          <div className="py-6 text-center">
            {status === 'verifying' && (
              <>
                <Loader2 className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email...</h2>
                <p className="text-gray-500">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
                <p className="text-gray-500 mb-6">{message}</p>
                <Link to={getDashboardPath()}>
                  <Button fullWidth size="lg">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
                <p className="text-gray-500 mb-6">{message}</p>

                {resendSuccess ? (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-4">
                    <p className="text-green-700 text-sm">
                      A new verification email has been sent. Please check your inbox.
                    </p>
                  </div>
                ) : isAuthenticated ? (
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={handleResendVerification}
                    loading={resending}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button fullWidth variant="secondary">
                      Sign in to resend verification
                    </Button>
                  </Link>
                )}
              </>
            )}

            {status === 'no-token' && (
              <>
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-10 h-10 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Verification Token</h2>
                <p className="text-gray-500 mb-6">
                  Please use the link from your verification email, or request a new one.
                </p>

                {resendSuccess ? (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 mb-4">
                    <p className="text-green-700 text-sm">
                      A new verification email has been sent. Please check your inbox.
                    </p>
                  </div>
                ) : isAuthenticated ? (
                  <Button
                    fullWidth
                    onClick={handleResendVerification}
                    loading={resending}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Verification Email
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button fullWidth>
                      Sign in to verify your email
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default VerifyEmailPage
