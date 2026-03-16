interface InfoGridItem {
  label: string
  value: string | number
  blur?: boolean
}

interface InfoGridProps {
  items: InfoGridItem[]
}

export default function InfoGrid({ items }: InfoGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-3">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
          <p className={`text-sm font-semibold text-gray-900 mt-0.5 ${item.blur ? 'blur-sm select-none' : ''}`}>
            {item.value || '\u2014'}
          </p>
        </div>
      ))}
    </div>
  )
}
