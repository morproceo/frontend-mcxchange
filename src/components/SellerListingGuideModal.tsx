import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SellerListingGuideModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const TOTAL_SCENES = 3

const SellerListingGuideModal = ({ isOpen, onClose, onConfirm }: SellerListingGuideModalProps) => {
  const [scene, setScene] = useState(0)

  const handleNext = () => {
    if (scene < TOTAL_SCENES - 1) setScene(s => s + 1)
  }

  const handleClose = () => {
    setScene(0)
    onClose()
  }

  const handleConfirm = () => {
    setScene(0)
    onConfirm()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
              {/* Progress dots */}
              <div className="flex justify-center gap-2.5 pt-6 pb-2">
                {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === scene ? 'bg-emerald-500 scale-125' : i < scene ? 'bg-emerald-300' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* ========== SCENE 0: This is NOT just selling an MC ========== */}
                {scene === 0 && (
                  <motion.div
                    key="scene0"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="px-8 py-6"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                      This is{' '}
                      <span className="text-red-500 underline decoration-[3px] underline-offset-4">NOT</span>{' '}
                      just selling a DOT & MC number
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                        <div className="text-red-500 text-xl mb-2">&#10007;</div>
                        <h3 className="text-red-700 font-semibold mb-1">What people think</h3>
                        <p className="text-gray-600 text-sm">"I'm just selling my MC number and DOT to someone else."</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                        <div className="text-emerald-500 text-xl mb-2">&#10003;</div>
                        <h3 className="text-emerald-700 font-semibold mb-1">What it actually is</h3>
                        <p className="text-gray-600 text-sm">You are selling the <strong>interest and ownership of your entire business</strong>.</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        'This is a full company sale — you\'re transferring ownership of the legal entity.',
                        'The buyer receives your MC, DOT, EIN, articles of incorporation, insurance history, and operating rights.',
                        'This includes everything tied to that business — safety record, compliance history, and platform accounts.',
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm">
                          <span className="text-amber-500 mt-0.5 flex-shrink-0">&#9888;</span>
                          <p className="text-gray-600">{text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ========== SCENE 1: How it works (condensed) ========== */}
                {scene === 1 && (
                  <motion.div
                    key="scene1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="px-8 py-6"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                      How the process works
                    </h2>

                    <div className="space-y-4 mb-6">
                      {[
                        { step: '1', title: 'You list your business', desc: 'Set your price, add a description, and upload required documents. We verify everything through FMCSA.' },
                        { step: '2', title: 'A buyer makes an offer', desc: 'Verified buyers submit offers. You review and accept the one that works.' },
                        { step: '3', title: 'Domilea facilitates the deal', desc: 'The buyer places a deposit. We open a secure Transaction Room for both parties.' },
                        { step: '4', title: 'Legal transfer & closing', desc: 'A Bill of Sale transfers ownership. Buyer sends final payment. Deal closes.' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                            {item.step}
                          </div>
                          <div>
                            <h3 className="text-gray-900 font-semibold">{item.title}</h3>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <p className="text-indigo-800 text-sm font-medium">
                        All transactions are governed by Arizona state law. Domilea facilitates the connection — all deals must be closed through the platform.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ========== SCENE 2: Confirmation ========== */}
                {scene === 2 && (
                  <motion.div
                    key="scene2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="px-8 py-6 text-center"
                  >
                    <div className="mb-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        You're ready to list
                      </h2>
                      <p className="text-gray-500">
                        By clicking below, you confirm that you understand:
                      </p>
                    </div>

                    <div className="text-left max-w-md mx-auto mb-8 space-y-2.5">
                      {[
                        'Selling on Domilea means selling the full interest and ownership of your business.',
                        'You will need to provide legal documents proving ownership.',
                        'All transactions must be completed through the platform.',
                        'You are listing with genuine intent to sell.',
                      ].map((text, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-gray-600 text-sm">{text}</p>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleConfirm}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/25"
                    >
                      I Understand — Create My Listing
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom nav */}
              <div className="px-8 pb-6 flex items-center justify-between">
                <button
                  onClick={handleClose}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>

                {scene < TOTAL_SCENES - 1 && (
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-sm"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SellerListingGuideModal
