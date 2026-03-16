import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export interface TabItem {
  id: string
  label: string
  icon?: any
}

interface TabNavProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (id: string) => void
}

export default function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeTabObj = tabs.find(t => t.id === activeTab)
  const ActiveIcon = activeTabObj?.icon

  return (
    <>
      {/* Desktop: horizontal tabs */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-1 border-b border-gray-200 pb-px">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? 'text-indigo-600 bg-indigo-50/60' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile: sticky dropdown selector */}
      <div className="md:hidden sticky top-0 z-30 shadow-lg rounded-b-2xl" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
        <div className="px-4 py-3">
          {/* Label */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-300/60 mb-1.5 px-1">Tap to explore sections</p>

          {/* Current tab button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 active:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <div className="flex items-center gap-2.5">
              {ActiveIcon && <ActiveIcon className="w-5 h-5 text-indigo-300" />}
              <span className="text-sm font-bold text-white">{activeTabObj?.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-indigo-300/70">{tabs.length} sections</span>
              <motion.div animate={{ rotate: mobileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-indigo-300" />
              </motion.div>
            </div>
          </button>

          {/* Dropdown menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 space-y-1">
                  {tabs.map((tab) => {
                    const isActive = tab.id === activeTab
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => { onTabChange(tab.id); setMobileOpen(false) }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-colors ${
                          isActive
                            ? 'bg-indigo-500/30 border border-indigo-400/40'
                            : 'bg-white/5 hover:bg-white/10 active:bg-white/15 border border-transparent'
                        }`}
                      >
                        {Icon && <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-300' : 'text-indigo-400/60'}`} />}
                        <span className={`text-sm ${isActive ? 'font-bold text-white' : 'font-medium text-white/70'}`}>{tab.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
