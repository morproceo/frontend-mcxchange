import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

interface SellerWelcomeAnimationProps {
  userId: string
}

const TOTAL_SCENES = 6

const SellerWelcomeAnimation = ({ userId }: SellerWelcomeAnimationProps) => {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [scene, setScene] = useState(0)
  const [animating, setAnimating] = useState(false)

  const markSeen = () => {
    localStorage.setItem(`mcx_seller_welcome_seen_${userId}`, 'true')
  }

  const handleConfirm = () => {
    markSeen()
    navigate('/seller/dashboard', { replace: true })
  }

  const handleNext = useCallback(() => {
    if (animating) return
    if (scene >= TOTAL_SCENES - 1) return
    setAnimating(true)

    // Fade out current scene, then advance
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

  // Animate content in whenever scene changes
  useEffect(() => {
    const sceneEl = containerRef.current?.querySelector(`.scene-${scene}`)
    if (!sceneEl) return

    const ctx = gsap.context(() => {
      // Reset scene to visible
      gsap.set(sceneEl, { opacity: 1 })

      // Animate all .anim children
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

      // Special: scene 0 icon spin
      if (scene === 0) {
        const icon = sceneEl.querySelector('.welcome-icon')
        if (icon) {
          gsap.fromTo(icon, { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.7)' })
        }
      }

      // Special: scene 1 "NOT" pop
      if (scene === 1) {
        const notEl = sceneEl.querySelector('.reality-not')
        if (notEl) {
          gsap.fromTo(notEl, { scale: 0.5 }, { scale: 1, duration: 0.4, delay: 0.5, ease: 'back.out(2.5)' })
        }
      }

      // Special: scene 5 confirm icon
      if (scene === 5) {
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
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
    >
      {/* Progress dots */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2.5">
        {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === scene
                ? 'bg-emerald-500 scale-125'
                : i < scene
                  ? 'bg-emerald-300'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* ========== SCENE 0: Welcome ========== */}
      {scene === 0 && (
        <div className="scene-0 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <div className="welcome-icon anim mb-8">
            <svg viewBox="0 0 80 80" className="w-24 h-24 mx-auto" fill="none">
              <circle cx="40" cy="40" r="38" fill="#10b981" />
              <path
                d="M40 18 C40 18, 56 30, 56 42 C56 51, 49 58, 40 58 C31 58, 24 51, 24 42 C24 30, 40 18, 40 18Z"
                fill="#ffffff"
              />
              <circle cx="40" cy="42" r="6" fill="#10b981" />
            </svg>
          </div>
          <h1 className="anim text-4xl sm:text-5xl font-extrabold text-gray-900 mb-5">
            Welcome to Domilea
          </h1>
          <p className="anim text-xl sm:text-2xl text-gray-500 max-w-lg leading-relaxed">
            Before you get started, there are a few important things you need to know about selling on our platform.
          </p>
        </div>
      )}

      {/* ========== SCENE 1: This is NOT just selling an MC ========== */}
      {scene === 1 && (
        <div className="scene-1 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="anim text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              This is{' '}
              <span className="reality-not inline-block text-red-500 underline decoration-4 underline-offset-4">
                NOT
              </span>{' '}
              just selling a DOT & MC number
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="anim bg-red-50 border border-red-200 rounded-2xl p-6 text-left">
                <div className="text-red-500 text-2xl mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-red-700 font-semibold text-lg mb-2">What people think</h3>
                <p className="text-gray-600 text-base">"I'm just selling my MC number and DOT to someone else."</p>
              </div>

              <div className="anim bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-left">
                <div className="text-emerald-500 text-2xl mb-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-emerald-700 font-semibold text-lg mb-2">What it actually is</h3>
                <p className="text-gray-600 text-base">You are selling the <strong className="text-gray-900">interest and ownership of your entire business</strong> — the MC is just one part of it.</p>
              </div>
            </div>

            <div className="space-y-3 text-left max-w-xl mx-auto">
              {[
                'This is a full company sale — you\'re transferring ownership of the legal entity, not just a number.',
                'The buyer receives your MC authority, DOT, EIN, articles of incorporation, insurance history, and operating rights.',
                'This includes everything tied to that business — safety record, compliance history, platform accounts, and more.',
              ].map((text, i) => (
                <div key={i} className="anim flex items-start gap-3">
                  <span className="text-amber-500 mt-1 flex-shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.168 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495z" /><path fill="#ffffff" d="M10 7a.75.75 0 01.75.75v3a.75.75 0 11-1.5 0v-3A.75.75 0 0110 7zm0 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z" /></svg>
                  </span>
                  <p className="text-gray-600 text-base sm:text-lg">
                    <strong className="text-gray-900">{text.split(' — ')[0]}</strong>
                    {text.includes(' — ') ? ` — ${text.split(' — ')[1]}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 2: What you're really selling ========== */}
      {scene === 2 && (
        <div className="scene-2 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="anim text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              When you list on Domilea, you're selling:
            </h2>

            <div className="space-y-4 text-left max-w-xl mx-auto mb-8">
              {[
                { icon: '\u{1F3E2}', title: 'Your Legal Entity', desc: 'The LLC or Corporation that holds your authority' },
                { icon: '\u{1F4CB}', title: 'MC & DOT Authority', desc: 'Your FMCSA operating authority and DOT number' },
                { icon: '\u{1F4C4}', title: 'Articles of Incorporation & EIN', desc: 'The founding documents and tax ID of the business' },
                { icon: '\u{1F6E1}\uFE0F', title: 'Safety & Compliance History', desc: 'Your safety rating, inspection history, and compliance record' },
                { icon: '\u{1F517}', title: 'Platform Integrations', desc: 'Amazon Relay, Highway, factoring relationships, and load board setups' },
                { icon: '\u{1F4CA}', title: 'Operating History', desc: 'Years of active authority, fleet records, and business reputation' },
              ].map((item, i) => (
                <div key={i} className="anim flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="anim bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-xl mx-auto">
              <p className="text-amber-800 font-medium text-base sm:text-lg">
                This is why we require your Articles of Incorporation, EIN Letter, Driver License, Certificate of Insurance, and Loss Run — these documents prove ownership and legitimacy of the entire business.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 3: The Legal Process ========== */}
      {scene === 3 && (
        <div className="scene-3 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="anim text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              How the legal process works
            </h2>

            <div className="space-y-5 text-left max-w-xl mx-auto mb-8">
              {[
                { step: '1', title: 'You list your business', desc: 'Provide your MC/DOT, upload required documents, and set your asking price. We verify everything through FMCSA records.' },
                { step: '2', title: 'A buyer makes an offer', desc: 'Verified buyers submit offers through the platform. You review and accept the one that works for you.' },
                { step: '3', title: 'Domilea facilitates the transaction', desc: 'We connect you with the buyer and provide the platform tools. The buyer places a deposit, and we open a secure Transaction Room for both parties.' },
                { step: '4', title: 'Legal transfer of ownership', desc: 'A Bill of Sale is prepared to transfer the interest and ownership of the business. Both parties review and sign.' },
                { step: '5', title: 'Final payment & closing', desc: 'The buyer sends the remaining payment. Once confirmed, ownership is officially transferred and the deal is closed.' },
              ].map((item, i) => (
                <div key={i} className="anim flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-full bg-indigo-500 flex items-center justify-center text-white text-base font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="anim bg-indigo-50 border border-indigo-200 rounded-2xl p-5 max-w-xl mx-auto">
              <p className="text-indigo-800 font-medium text-base sm:text-lg">
                All transactions are governed by the laws of the State of Arizona. Domilea facilitates the connection between buyers and sellers — you are doing business with each other directly. All deals must be closed through the platform.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 4: Post with Intention ========== */}
      {scene === 4 && (
        <div className="scene-4 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="anim text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Post with intention
            </h2>

            <div className="space-y-4 text-left max-w-xl mx-auto">
              {[
                { title: 'Only list if you are ready to sell', desc: 'When you create a listing, real buyers will see it and make real offers. Don\'t list unless you genuinely intend to sell.' },
                { title: 'Provide accurate information', desc: 'Your MC/DOT is verified against FMCSA records. Misrepresenting your authority, safety record, or business details will result in removal.' },
                { title: 'Upload all required documents', desc: 'Articles of Incorporation, EIN Letter, Driver License, Certificate of Insurance, and Loss Run are all required to verify your business.' },
                { title: 'Understand what you are transferring', desc: 'You are transferring full ownership and interest of your business entity. Once the deal closes, the buyer owns everything associated with that company.' },
              ].map((item, i) => (
                <div key={i} className="anim flex items-start gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <span className="flex-shrink-0 mt-0.5">
                    <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-gray-900 font-semibold text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-base">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== SCENE 5: Confirmation ========== */}
      {scene === 5 && (
        <div className="scene-5 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
          <div className="max-w-lg mx-auto">
            <div className="confirm-icon anim mb-8">
              <svg viewBox="0 0 80 80" className="w-24 h-24 mx-auto" fill="none">
                <circle cx="40" cy="40" r="38" fill="#10b981" />
                <path d="M24 40l10 10 22-22" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="anim text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              You're all set
            </h2>
            <p className="anim text-gray-500 text-lg sm:text-xl mb-4">
              By clicking below, you confirm that you understand:
            </p>

            <div className="anim text-left max-w-md mx-auto mb-8 space-y-3">
              {[
                'Selling on Domilea means selling the full interest and ownership of your business — not just an MC number.',
                'You will need to provide legal documents proving ownership.',
                'All transactions must be completed through the Domilea platform.',
                'You are listing with genuine intent to sell.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-600 text-base sm:text-lg">{text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="anim inline-flex items-center justify-center px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold rounded-2xl transition-colors duration-200 shadow-lg shadow-emerald-500/25"
            >
              I Understand
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
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg text-base"
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

export default SellerWelcomeAnimation
