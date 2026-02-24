import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

interface BuyerWelcomeAnimationProps {
  userId: string
}

const TOTAL_SCENES = 7

const BuyerWelcomeAnimation = ({ userId }: BuyerWelcomeAnimationProps) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState(0)
  const [animating, setAnimating] = useState(false)

  const markSeen = () => {
    localStorage.setItem(`mcx_buyer_welcome_seen_${userId}`, 'true')
  }

  const handleConfirm = () => {
    markSeen()
    navigate('/buyer/dashboard', { replace: true })
  }

  const handleNext = useCallback(() => {
    if (animating) return
    if (scene >= TOTAL_SCENES - 1) return
    setAnimating(true)

    const currentEl = containerRef.current?.querySelector(`.scene-${scene}`)
    if (currentEl) {
      gsap.to(currentEl, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setScene((s) => s + 1)
          setAnimating(false)
        },
      })
    } else {
      setScene((s) => s + 1)
      setAnimating(false)
    }
  }, [scene, animating])

  useEffect(() => {
    const sceneEl = containerRef.current?.querySelector(`.scene-${scene}`)
    if (!sceneEl) return

    const ctx = gsap.context(() => {
      gsap.set(sceneEl, { opacity: 1 })

      const items = sceneEl.querySelectorAll('.anim')
      if (items.length) {
        gsap.fromTo(
          items,
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            stagger: 0.1,
            ease: 'power3.out',
          }
        )
      }

      if (scene === 0) {
        const icon = sceneEl.querySelector('.welcome-icon')
        if (icon) {
          gsap.fromTo(icon, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.7)' })
        }
      }

      if (scene === TOTAL_SCENES - 1) {
        const icon = sceneEl.querySelector('.confirm-icon')
        if (icon) {
          gsap.fromTo(icon, { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' })
        }
      }
    }, sceneEl)

    return () => ctx.revert()
  }, [scene])

  const isLastScene = scene === TOTAL_SCENES - 1

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-gray-900 overflow-y-auto"
    >
      {/* Progress dots */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === scene
                ? 'bg-blue-400 scale-125'
                : i < scene
                  ? 'bg-blue-400/40'
                  : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* ========== SCENE 0: Welcome ========== */}
      {scene === 0 && (
        <div className="scene-0 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="welcome-icon anim mb-6">
            <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto" fill="none">
              <circle cx="40" cy="40" r="38" fill="#3b82f6" />
              <path d="M28 34h24v16a4 4 0 01-4 4H32a4 4 0 01-4-4V34z" fill="#ffffff" />
              <path d="M26 30a4 4 0 014-4h20a4 4 0 014 4v4H26v-4z" fill="#ffffff" opacity="0.8" />
              <circle cx="40" cy="42" r="3" fill="#3b82f6" />
              <path d="M40 42v4" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="anim text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4">
            Welcome to Domilea
          </h1>
          <p className="anim text-lg sm:text-xl text-gray-300 max-w-lg">
            Before you start browsing MC authorities, here's everything you need to know about buying on our platform.
          </p>
        </div>
      )}

      {/* ========== SCENE 1: Identity Verification ========== */}
      {scene === 1 && (
        <div className="scene-1 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="anim mb-6">
              <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto" fill="none">
                <rect x="8" y="12" width="48" height="40" rx="4" fill="#3b82f6" opacity="0.2" />
                <rect x="8" y="12" width="48" height="40" rx="4" stroke="#60a5fa" strokeWidth="2" />
                <circle cx="28" cy="32" r="8" fill="#60a5fa" />
                <path d="M40 26h12M40 32h10M40 38h8" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <h2 className="anim text-3xl sm:text-4xl font-bold text-white mb-4">
              First, we need to verify your identity
            </h2>
            <p className="anim text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              MC authorities are <strong className="text-white">high-value business assets</strong>. To protect both buyers and sellers, every user must verify their identity before accessing the marketplace.
            </p>

            <div className="space-y-4 text-left max-w-xl mx-auto">
              {[
                { icon: '🪪', title: 'Government-issued ID', desc: 'Submit a valid government ID through our secure Stripe Identity verification.' },
                { icon: '🔒', title: 'Your data is protected', desc: 'Verification is handled by Stripe — we never store your ID documents.' },
                { icon: '⚡', title: 'Quick & easy', desc: 'The process takes less than 2 minutes and you only need to do it once.' },
              ].map((item, i) => (
                <div key={i} className="anim flex items-start gap-4 bg-white/5 rounded-xl p-4">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 2: How Credits Work ========== */}
      {scene === 2 && (
        <div className="scene-2 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="anim mb-6">
              <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto" fill="none">
                <circle cx="32" cy="32" r="26" fill="#f59e0b" opacity="0.2" />
                <circle cx="32" cy="32" r="26" stroke="#fbbf24" strokeWidth="2" />
                <text x="32" y="38" textAnchor="middle" fill="#fbbf24" fontSize="20" fontWeight="bold">C</text>
              </svg>
            </div>

            <h2 className="anim text-3xl sm:text-4xl font-bold text-white mb-4">
              How credits work
            </h2>
            <p className="anim text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              To view the full details of any MC authority listing, you'll need credits. Here's how the system works:
            </p>

            <div className="space-y-5 text-left max-w-xl mx-auto">
              {[
                { step: '1', title: 'Subscribe to a plan', desc: 'Choose a subscription tier that fits your needs. Each tier comes with a set number of credits per month.' },
                { step: '2', title: 'Browse the marketplace', desc: 'Explore MC authority listings freely — you can see summaries, pricing, and key stats without spending credits.' },
                { step: '3', title: 'Unlock listings with credits', desc: 'When you find an MC you\'re interested in, use 1 credit to unlock the full details, documents, and seller contact information.' },
                { step: '4', title: 'Make an offer', desc: 'Once unlocked, you can make offers, request documents, and communicate with the seller through the platform.' },
              ].map((item, i) => (
                <div key={i} className="anim flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 3: Subscription Tiers ========== */}
      {scene === 3 && (
        <div className="scene-3 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="anim text-3xl sm:text-4xl font-bold text-white mb-4">
              Choose the plan that's right for you
            </h2>
            <p className="anim text-gray-300 text-base sm:text-lg mb-8">
              Each subscription tier unlocks more credits and premium features.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  name: 'Starter',
                  color: 'from-blue-500 to-cyan-500',
                  border: 'border-blue-500/30',
                  credits: '4 credits/mo',
                  features: ['Unlock 4 MC listings', 'Basic marketplace access', 'Email support'],
                  popular: false,
                },
                {
                  name: 'Professional',
                  color: 'from-purple-500 to-indigo-500',
                  border: 'border-purple-500/50',
                  credits: '10 credits/mo',
                  features: ['Unlock 10 MC listings', 'Priority marketplace access', 'Advanced search filters', 'Priority support'],
                  popular: false,
                },
                {
                  name: 'Enterprise',
                  color: 'from-yellow-500 to-orange-500',
                  border: 'border-yellow-500/50',
                  credits: '10 credits/mo',
                  features: ['AI-powered due diligence', 'Credit report access', 'Dedicated support', 'Early access to listings'],
                  popular: true,
                },
              ].map((plan, i) => (
                <div key={i} className={`anim relative rounded-2xl p-5 text-left bg-white/5 border ${plan.border}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full">
                      POPULAR
                    </div>
                  )}
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${plan.color} font-bold text-lg mb-1`}>
                    {plan.name}
                  </div>
                  <div className="text-white font-semibold text-sm mb-3">{plan.credits}</div>
                  <div className="space-y-1.5">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-400">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="anim text-gray-500 text-sm">
              You can change or upgrade your plan at any time from your dashboard.
            </p>
          </div>
        </div>
      )}

      {/* ========== SCENE 4: AI Tools & Features ========== */}
      {scene === 4 && (
        <div className="scene-4 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="anim mb-6">
              <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto" fill="none">
                <rect x="8" y="8" width="48" height="48" rx="12" fill="#8b5cf6" opacity="0.2" />
                <rect x="8" y="8" width="48" height="48" rx="12" stroke="#a78bfa" strokeWidth="2" />
                <path d="M24 28l4 4-4 4M32 36h8" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="anim text-3xl sm:text-4xl font-bold text-white mb-4">
              Our AI-powered tools have your back
            </h2>
            <p className="anim text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Depending on your subscription tier, you'll have access to powerful tools designed to help you make smarter buying decisions.
            </p>

            <div className="space-y-4 text-left max-w-xl mx-auto">
              {[
                { icon: '🤖', title: 'AI Due Diligence', desc: 'Our AI analyzes safety records, compliance history, and authority data to flag potential risks before you buy.' },
                { icon: '📊', title: 'Credit Reports', desc: 'Access detailed credit and financial reports on MC authorities to understand the true value of what you\'re purchasing.' },
                { icon: '💬', title: 'AI Assistant', desc: 'Have questions? Our AI assistant can help you navigate the platform, understand listings, and answer your questions 24/7.' },
                { icon: '📞', title: 'Customer Service', desc: 'Higher-tier plans include priority dedicated support to help you through every step of the buying process.' },
              ].map((item, i) => (
                <div key={i} className="anim flex items-start gap-4 bg-white/5 rounded-xl p-4">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 5: Important Rules ========== */}
      {scene === 5 && (
        <div className="scene-5 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="anim text-3xl sm:text-4xl font-bold text-white mb-4">
              A few important things to know
            </h2>
            <p className="anim text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              MC authorities are real business assets. Here's what you should know before purchasing.
            </p>

            <div className="space-y-4 text-left max-w-xl mx-auto">
              {[
                { title: 'You are buying a real business', desc: 'When you purchase an MC authority, you are buying the full interest and ownership of a legal business entity — not just a number.' },
                { title: 'An agreement is required', desc: 'Before any transaction is finalized, both buyer and seller must sign a Bill of Sale transferring ownership of the business.' },
                { title: 'Do your due diligence', desc: 'Use our AI tools, credit reports, and FMCSA data to research listings thoroughly before making an offer.' },
              ].map((item, i) => (
                <div key={i} className="anim flex items-start gap-4 bg-white/5 rounded-xl p-4">
                  <span className="flex-shrink-0 mt-0.5">
                    <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495z" />
                      <path fill="#1f2937" d="M10 7a.75.75 0 01.75.75v3a.75.75 0 11-1.5 0v-3A.75.75 0 0110 7zm0 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 6: Confirmation ========== */}
      {scene === 6 && (
        <div className="scene-6 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-lg mx-auto">
            <div className="confirm-icon anim mb-6">
              <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto" fill="none">
                <circle cx="40" cy="40" r="38" fill="#3b82f6" />
                <path d="M24 40l10 10 22-22" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="anim text-3xl sm:text-4xl font-bold text-white mb-4">
              You're ready to go
            </h2>
            <p className="anim text-gray-300 text-base sm:text-lg mb-3">
              Here's a quick recap of your next steps:
            </p>

            <div className="anim text-left max-w-md mx-auto mb-8 space-y-3">
              {[
                { step: '1', text: 'Verify your identity in Settings to unlock full platform access.' },
                { step: '2', text: 'Choose a subscription plan to get credits for unlocking MC listings.' },
                { step: '3', text: 'Browse the marketplace and use credits to unlock listings you\'re interested in.' },
                { step: '4', text: 'Use our AI tools to research and make informed offers.' },
                { step: '5', text: 'Talk to our AI assistant anytime if you need help navigating the platform.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {item.step}
                  </div>
                  <p className="text-gray-300 text-sm pt-0.5">{item.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="anim inline-flex items-center justify-center px-10 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-2xl transition-colors duration-200 shadow-lg shadow-blue-500/25"
            >
              Let's Go
            </button>
          </div>
        </div>
      )}

      {/* Next button — shown on all scenes except the last */}
      {!isLastScene && (
        <div className="fixed bottom-8 inset-x-0 flex justify-center z-50">
          <button
            onClick={handleNext}
            disabled={animating}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg"
          >
            Next
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default BuyerWelcomeAnimation
