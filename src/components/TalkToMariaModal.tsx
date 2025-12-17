import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  CheckCircle
} from 'lucide-react'
import GlassCard from './ui/GlassCard'
import Button from './ui/Button'
import Input from './ui/Input'
import Textarea from './ui/Textarea'

interface TalkToMariaModalProps {
  isOpen: boolean
  onClose: () => void
}

const TalkToMariaModal = ({ isOpen, onClose }: TalkToMariaModalProps) => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: ''
  })

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  })

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('payment')
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate payment processing
    setTimeout(() => {
      setStep('success')
    }, 1500)
  }

  const handleClose = () => {
    setStep('form')
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: ''
    })
    setPaymentData({
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: ''
    })
    onClose()
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <GlassCard>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Talk to a Representative</h2>
                      <p className="text-sm text-white/60">Expert MC Authority Consultation</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Consultation Info Banner */}
                {step === 'form' && (
                  <div className="glass-subtle rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                        <User className="w-8 h-8 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">Domilea Representative</h3>
                        <p className="text-sm text-white/80 mb-2">Senior MC Authority Consultant</p>
                        <p className="text-xs text-white/60">
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
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        icon={<Calendar className="w-4 h-4" />}
                        required
                      />
                      <Input
                        label="Preferred Time *"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        icon={<Calendar className="w-4 h-4" />}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">What would you like to discuss? *</label>
                      <Textarea
                        placeholder="Tell us about your situation, questions, or what you need help with..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    <div className="glass-subtle rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-lg">Consultation Fee</div>
                          <div className="text-sm text-white/60">60-minute expert consultation</div>
                        </div>
                        <div className="text-3xl font-bold text-primary-400">$100</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" fullWidth onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button type="submit" fullWidth>
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                )}

                {/* Payment Step */}
                {step === 'payment' && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="glass-subtle rounded-lg p-4 mb-6">
                      <h3 className="font-bold mb-3">Consultation Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Name:</span>
                          <span>{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Date & Time:</span>
                          <span>{formData.date} at {formData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Duration:</span>
                          <span>60 minutes</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/10 flex justify-between font-bold">
                          <span>Total:</span>
                          <span className="text-primary-400">$100.00</span>
                        </div>
                      </div>
                    </div>

                    <Input
                      label="Card Number *"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                      icon={<CreditCard className="w-4 h-4" />}
                      required
                    />

                    <Input
                      label="Cardholder Name *"
                      placeholder="Name on card"
                      value={paymentData.cardName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                      icon={<User className="w-4 h-4" />}
                      required
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="Expiry Date *"
                        placeholder="MM/YY"
                        value={paymentData.expiry}
                        onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                        required
                      />
                      <Input
                        label="CVV *"
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        value={paymentData.cvv}
                        onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                        required
                      />
                    </div>

                    <div className="glass-subtle rounded-lg p-3 flex gap-2 text-xs text-white/60">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 text-trust-high" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="ghost" fullWidth onClick={() => setStep('form')}>
                        Back
                      </Button>
                      <Button type="submit" fullWidth>
                        Pay $100
                      </Button>
                    </div>
                  </form>
                )}

                {/* Success Step */}
                {step === 'success' && (
                  <div className="text-center py-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                      className="w-20 h-20 rounded-full bg-trust-high/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle className="w-12 h-12 text-trust-high" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-2">Consultation Booked!</h3>
                    <p className="text-white/80 mb-6">
                      Thank you! Our representative will reach out to you shortly to confirm your consultation.
                    </p>

                    <div className="glass-subtle rounded-lg p-6 text-left mb-6">
                      <h4 className="font-bold mb-3">Confirmation Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">Name:</span>
                          <span>{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Email:</span>
                          <span>{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Phone:</span>
                          <span>{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Scheduled:</span>
                          <span>{formData.date} at {formData.time}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/10 flex justify-between">
                          <span className="text-white/60">Payment:</span>
                          <span className="text-trust-high font-semibold">$100.00 Paid</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-white/60 mb-6">
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
