import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

export interface TabItem {
  id: string
  label: string
  icon: LucideIcon
}

interface TabNavProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (id: string) => void
}

export default function TabNav({ tabs, activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex overflow-x-auto scrollbar-hide -mb-px" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={clsx(
                  'relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
