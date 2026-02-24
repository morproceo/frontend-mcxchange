import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, X, Shield } from 'lucide-react'
import Button from './ui/Button'

const IdentityVerificationBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('identity-banner-dismissed') === 'true'
  })

  if (dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('identity-banner-dismissed', 'true')
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-800">
            Identity Verification Required
          </h3>
          <p className="text-sm text-amber-700 mt-1">
            Verify your identity to access all platform features including viewing listing details, making offers, and sending messages.
          </p>
          <div className="mt-3">
            <Link to="/settings">
              <Button size="sm" variant="primary">
                <Shield className="w-4 h-4 mr-1" />
                Verify Now
              </Button>
            </Link>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-400 hover:text-amber-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default IdentityVerificationBanner
