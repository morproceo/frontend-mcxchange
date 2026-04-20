import { useState, useEffect, FormEvent } from 'react'
import { Save, Loader2 } from 'lucide-react'
import Input from './ui/Input'
import Button from './ui/Button'
import type { BuyerPreferencesData } from '../types'

interface Props {
  initialValues: BuyerPreferencesData | null
  onSave: (data: Partial<BuyerPreferencesData>) => Promise<void>
  showAdminNotes?: boolean
  saving?: boolean
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

type Tri = 'yes' | 'no' | 'any'

function triFromBool(v?: boolean | null): Tri {
  if (v === true) return 'yes'
  if (v === false) return 'no'
  return 'any'
}
function boolFromTri(v: Tri): boolean | null {
  if (v === 'yes') return true
  if (v === 'no') return false
  return null
}

const TRI_OPTIONS: { value: Tri; label: string }[] = [
  { value: 'any', label: "Don't care" },
  { value: 'yes', label: 'Yes — required' },
  { value: 'no', label: 'No — must not have' },
]

function TriSelect({ label, value, onChange }: { label: string; value: Tri; onChange: (v: Tri) => void }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Tri)}
        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {TRI_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function toNumberOrNull(s: string): number | null {
  if (!s.trim()) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export default function BuyerRequirementsForm({ initialValues, onSave, showAdminNotes = false, saving = false }: Props) {
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [preferredStates, setPreferredStates] = useState<string[]>([])
  const [cargoTypesText, setCargoTypesText] = useState('')
  const [minYearsActive, setMinYearsActive] = useState('')
  const [minFleetSize, setMinFleetSize] = useState('')
  const [preferredSafetyRating, setPreferredSafetyRating] = useState<string>('')
  const [needsAmazon, setNeedsAmazon] = useState<Tri>('any')
  const [minAmazonRelayScore, setMinAmazonRelayScore] = useState('')
  const [needsHighway, setNeedsHighway] = useState<Tri>('any')
  const [needsFactoring, setNeedsFactoring] = useState<Tri>('any')
  const [needsRmis, setNeedsRmis] = useState<Tri>('any')
  const [needsEmail, setNeedsEmail] = useState<Tri>('any')
  const [needsPhone, setNeedsPhone] = useState<Tri>('any')
  const [needsInsurance, setNeedsInsurance] = useState<Tri>('any')
  const [buyerNotes, setBuyerNotes] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    const v = initialValues
    setMinPrice(v?.minPrice != null ? String(v.minPrice) : '')
    setMaxPrice(v?.maxPrice != null ? String(v.maxPrice) : '')
    setPreferredStates(Array.isArray(v?.preferredStates) ? v!.preferredStates as string[] : [])
    setCargoTypesText(Array.isArray(v?.cargoTypes) ? (v!.cargoTypes as string[]).join(', ') : '')
    setMinYearsActive(v?.minYearsActive != null ? String(v.minYearsActive) : '')
    setMinFleetSize(v?.minFleetSize != null ? String(v.minFleetSize) : '')
    setPreferredSafetyRating(v?.preferredSafetyRating || '')
    setNeedsAmazon(triFromBool(v?.needsAmazon))
    setMinAmazonRelayScore(v?.minAmazonRelayScore || '')
    setNeedsHighway(triFromBool(v?.needsHighway))
    setNeedsFactoring(triFromBool(v?.needsFactoring))
    setNeedsRmis(triFromBool(v?.needsRmis))
    setNeedsEmail(triFromBool(v?.needsEmail))
    setNeedsPhone(triFromBool(v?.needsPhone))
    setNeedsInsurance(triFromBool(v?.needsInsurance))
    setBuyerNotes(v?.buyerNotes || '')
    setAdminNotes(v?.adminNotes || '')
  }, [initialValues])

  const toggleState = (st: string) => {
    setPreferredStates((prev) => prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st])
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    const min = toNumberOrNull(minPrice)
    const max = toNumberOrNull(maxPrice)
    if (min != null && max != null && min > max) {
      setLocalError('Min price cannot be greater than max price')
      return
    }
    const cargoTypes = cargoTypesText.trim()
      ? cargoTypesText.split(',').map((s) => s.trim()).filter(Boolean)
      : null

    const payload: Partial<BuyerPreferencesData> = {
      minPrice: min,
      maxPrice: max,
      preferredStates: preferredStates.length > 0 ? preferredStates : null,
      cargoTypes,
      minYearsActive: toNumberOrNull(minYearsActive),
      minFleetSize: toNumberOrNull(minFleetSize),
      preferredSafetyRating: (preferredSafetyRating || null) as BuyerPreferencesData['preferredSafetyRating'],
      needsAmazon: boolFromTri(needsAmazon),
      minAmazonRelayScore: minAmazonRelayScore || null,
      needsHighway: boolFromTri(needsHighway),
      needsFactoring: boolFromTri(needsFactoring),
      needsRmis: boolFromTri(needsRmis),
      needsEmail: boolFromTri(needsEmail),
      needsPhone: boolFromTri(needsPhone),
      needsInsurance: boolFromTri(needsInsurance),
      buyerNotes: buyerNotes || null,
    }
    if (showAdminNotes) payload.adminNotes = adminNotes || null
    await onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Price + basics */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Budget & company size</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="Min price ($)" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="e.g. 10000" />
          <Input label="Max price ($)" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="e.g. 50000" />
          <Input label="Min years active" type="number" value={minYearsActive} onChange={(e) => setMinYearsActive(e.target.value)} placeholder="e.g. 2" />
          <Input label="Min fleet size" type="number" value={minFleetSize} onChange={(e) => setMinFleetSize(e.target.value)} placeholder="e.g. 1" />
        </div>
      </div>

      {/* Safety + cargo */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Safety & operations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum safety rating</label>
            <select
              value={preferredSafetyRating}
              onChange={(e) => setPreferredSafetyRating(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Don't care</option>
              <option value="SATISFACTORY">Satisfactory only</option>
              <option value="CONDITIONAL">Satisfactory or Conditional</option>
              <option value="NONE">Any non-unsatisfactory</option>
            </select>
          </div>
          <Input
            label="Cargo types (comma-separated)"
            value={cargoTypesText}
            onChange={(e) => setCargoTypesText(e.target.value)}
            placeholder="e.g. Dry Van, Reefer, Flatbed"
          />
        </div>
      </div>

      {/* Platform flags */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Platforms & setup</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TriSelect label="Amazon Relay" value={needsAmazon} onChange={setNeedsAmazon} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Amazon Relay score</label>
            <select
              value={minAmazonRelayScore}
              onChange={(e) => setMinAmazonRelayScore(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Don't care</option>
              <option value="A">A</option>
              <option value="B">B or better</option>
              <option value="C">C or better</option>
              <option value="D">D or better</option>
            </select>
          </div>
          <TriSelect label="Highway setup" value={needsHighway} onChange={setNeedsHighway} />
          <TriSelect label="RMIS setup" value={needsRmis} onChange={setNeedsRmis} />
          <TriSelect label="Has factoring agreement" value={needsFactoring} onChange={setNeedsFactoring} />
          <TriSelect label="Insurance on file" value={needsInsurance} onChange={setNeedsInsurance} />
          <TriSelect label="Seller includes email" value={needsEmail} onChange={setNeedsEmail} />
          <TriSelect label="Seller includes phone" value={needsPhone} onChange={setNeedsPhone} />
        </div>
      </div>

      {/* Preferred states */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Preferred states <span className="text-xs font-normal text-gray-500">(none = any state)</span></h4>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-xl bg-gray-50">
          {US_STATES.map((st) => {
            const active = preferredStates.includes(st)
            return (
              <button
                type="button"
                key={st}
                onClick={() => toggleState(st)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {st}
              </button>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Buyer notes</label>
        <textarea
          value={buyerNotes}
          onChange={(e) => setBuyerNotes(e.target.value)}
          rows={3}
          placeholder="Anything else that matters — timing, financing, specific lanes..."
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {showAdminNotes && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Admin notes <span className="text-xs font-normal text-amber-600">(private — buyer never sees this)</span>
          </label>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Internal notes about this buyer..."
            className="w-full px-3 py-2 border border-amber-200 bg-amber-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

      {localError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{localError}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save requirements
        </Button>
      </div>
    </form>
  )
}
