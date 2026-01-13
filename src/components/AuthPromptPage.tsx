import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, LogIn, UserPlus, TruckIcon, Shield, CheckCircle } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import { DomileaIcon } from './ui/DomileaLogo'

const AuthPromptPage = () => {
  const location = useLocation()
  const returnUrl = encodeURIComponent(location.pathname)

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Lock className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Sign In Required
            </h1>
            <p className="text-gray-600 text-lg">
              Create an account or sign in to view MC Authority details
            </p>
          </div>

          {/* Main Card */}
          <Card className="mb-6">
            <div className="text-center py-4">
              <div className="flex justify-center mb-6">
                <DomileaIcon size={48} />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Join Domilea Marketplace
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Get access to verified MC Authorities, detailed carrier information, and connect with sellers.
              </p>

              {/* Benefits */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-gray-50">
                  <TruckIcon className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">Browse MCs</div>
                  <div className="text-sm text-gray-500">Access marketplace listings</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">Verified Data</div>
                  <div className="text-sm text-gray-500">FMCSA verified carriers</div>
                </div>
                <div className="p-4 rounded-xl bg-gray-50">
                  <CheckCircle className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">Secure</div>
                  <div className="text-sm text-gray-500">Protected transactions</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 max-w-sm mx-auto">
                <Link to={`/login?redirect=${returnUrl}`}>
                  <Button fullWidth size="lg">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>

                <Link to={`/register?redirect=${returnUrl}`}>
                  <Button fullWidth size="lg" variant="secondary">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Create Account
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                Free to create an account. No credit card required.
              </p>
            </div>
          </Card>

          {/* Back to Marketplace Link */}
          <div className="text-center">
            <Link
              to="/marketplace"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Marketplace
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPromptPage
