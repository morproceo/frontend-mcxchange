import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, CheckCircle, ChevronDown } from 'lucide-react'

interface ScrollToAgreeModalProps {
  isOpen: boolean
  onClose: () => void
  onFullyScrolled: () => void
  title: string
  icon: ReactNode
  children: ReactNode
}

const ScrollToAgreeModal = ({ isOpen, onClose, onFullyScrolled, title, icon, children }: ScrollToAgreeModalProps) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset scroll state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false)
    }
  }, [isOpen])

  // Auto-enable if content fits without scrolling
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current
      if (scrollHeight <= clientHeight) {
        setHasScrolledToBottom(true)
      }
    }
  }, [isOpen])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight <= 50) {
      setHasScrolledToBottom(true)
    }
  }

  const handleConfirm = () => {
    onFullyScrolled()
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="relative flex flex-col w-full h-full sm:m-auto sm:max-w-3xl sm:max-h-[90vh] sm:rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  {icon}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 sm:p-8"
            >
              {children}
            </div>

            {/* Scroll Indicator */}
            {!hasScrolledToBottom && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-[72px] sm:bottom-[80px] left-0 right-0 flex flex-col items-center pointer-events-none"
              >
                <div className="bg-gradient-to-t from-white via-white/90 to-transparent pt-8 pb-2 w-full flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-500 mb-1">Scroll down to continue reading</span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Bottom Action Bar */}
            <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
              <button
                onClick={handleConfirm}
                disabled={!hasScrolledToBottom}
                className={`w-full py-4 px-6 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all ${
                  hasScrolledToBottom
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {hasScrolledToBottom ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    I Have Read This Document
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Read Full Document to Continue
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ScrollToAgreeModal
