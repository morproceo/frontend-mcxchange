import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Loader2
} from 'lucide-react'
import GlassCard from './ui/GlassCard'
import Button from './ui/Button'
import Input from './ui/Input'
import Textarea from './ui/Textarea'
import { toast } from 'react-hot-toast'
import api from '../services/api'

interface TalkToMariaModalProps {
  isOpen: boolean
  onClose: () => void
}

const TalkToMariaModal = ({ isOpen, onClose }: TalkToMariaModalProps) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [consultationFee, setConsultationFee] = useState<number>(100) // Default
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  })

  // Fetch consultation fee when modal opens
  useEffect(() => {
    if (isOpen) {
      api.getConsultationFee()
        .then(data => setConsultationFee(data.fee))
        .catch(err => console.error('Failed to fetch consultation fee:', err))
    }
  }, [isOpen])

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create consultation and get Stripe checkout URL
      const response = await api.createConsultationCheckout({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        message: formData.message
      })

      // Redirect to Stripe checkout
      window.location.href = response.checkoutUrl
    } catch (error: any) {
      console.error('Failed to create consultation:', error)
      toast.error(error.message || 'Failed to process request. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep('form')
    setIsSubmitting(false)
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      preferredTime: '',
      message: ''
    })
    onClose()
  }

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <GlassCard hover={false}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Talk to a Representative</h2>
                      <p className="text-sm text-gray-500">Expert MC Authority Consultation</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Consultation Info Banner */}
                {step === 'form' && (
                  <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-4 mb-6 border border-secondary-100">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-secondary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">Domilea Representative</h3>
                        <p className="text-sm text-secondary-600 mb-2">Senior MC Authority Consultant</p>
                        <p className="text-xs text-gray-600">
                          Our team has 15+ years of experience helping carriers navigate MC authority purchases,
                          compliance, and business growth strategies.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Step */}
                {step === 'form' && (
                  <form onSubmit={handleSubmitForm} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        icon={<User className="w-4 h-4" />}
                        required
                      />
                      <Input
                        label="Email Address *"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        icon={<Mail className="w-4 h-4" />}
                        required
                      />
                    </div>

                    <Input
                      label="Phone Number *"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      icon={<Phone className="w-4 h-4" />}
                      required
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Preferred Date *"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        icon={<Calendar className="w-4 h-4" />}
                        min={getMinDate()}
                        required
                      />
                      <Input
                        label="Preferred Time *"
                        type="time"
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        icon={<Calendar className="w-4 h-4" />}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">What would you like to discuss? *</label>
                      <Textarea
                        placeholder="Tell us about your situation, questions, or what you need help with..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-4 border border-secondary-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg text-gray-900">Consultation Fee</div>
                          <div className="text-sm text-gray-500">60-minute expert consultation</div>
                        </div>
                        <div className="text-3xl font-bold text-secondary-600">${consultationFee.toFixed(2)}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" fullWidth onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button type="submit" fullWidth disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          `Pay $${consultationFee.toFixed(2)} & Book Consultation`
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Success Step - shown when returning from Stripe */}
                {step === 'success' && (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Consultation Booked!</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you! Our representative will reach out to you shortly to confirm your consultation.
                    </p>

                    <div className="bg-gray-50 rounded-xl p-6 text-left mb-6 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">Confirmation Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="text-gray-900">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-900">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span className="text-gray-900">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Scheduled:</span>
                          <span className="text-gray-900">{formData.preferredDate} at {formData.preferredTime}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                          <span className="text-gray-500">Payment:</span>
                          <span className="text-green-600 font-semibold">${consultationFee.toFixed(2)} Paid</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-6">
                      A confirmation email has been sent to {formData.email}
                    </p>

                    <Button fullWidth onClick={handleClose}>
                      Close
                    </Button>
                  </div>
                )}
              </GlassCard>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default TalkToMariaModal
