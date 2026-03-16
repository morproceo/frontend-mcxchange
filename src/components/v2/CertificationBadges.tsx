import { Award, Leaf, FlaskConical } from 'lucide-react'

interface CertificationBadgesProps {
  smartway?: boolean
  carbtru?: boolean
  phmsa?: boolean
}

export default function CertificationBadges({ smartway, carbtru, phmsa }: CertificationBadgesProps) {
  const badges = [
    { name: 'SmartWay', active: smartway, icon: Leaf, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'CARB Compliant', active: carbtru, icon: Award, color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { name: 'PHMSA Hazmat', active: phmsa, icon: FlaskConical, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  ]

  const activeBadges = badges.filter(b => b.active)

  if (activeBadges.length === 0) {
    return (
      <p className="text-sm text-gray-400">No certifications on file</p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {activeBadges.map(badge => {
        const Icon = badge.icon
        return (
          <span
            key={badge.name}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${badge.color}`}
          >
            <Icon className="w-4 h-4" />
            {badge.name}
          </span>
        )
      })}
    </div>
  )
}
