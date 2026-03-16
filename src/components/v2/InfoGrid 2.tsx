import { motion } from 'framer-motion'

interface InfoGridItem {
  label: string
  value: string | number
  blur?: boolean
}

interface InfoGridProps {
  items: InfoGridItem[]
  columns?: 2 | 3
}

export default function InfoGrid({ items, columns = 3 }: InfoGridProps) {
  const gridCls = columns === 2
    ? 'grid sm:grid-cols-2 gap-3'
    : 'grid sm:grid-cols-2 lg:grid-cols-3 gap-3'

  return (
    <div className={gridCls}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="bg-gray-50 rounded-lg p-3"
        >
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.label}</p>
          <p className={`text-sm font-semibold text-gray-800 mt-0.5 ${item.blur ? 'blur-sm select-none' : ''}`}>
            {item.value}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
