import { useState } from 'react'
import { Truck as TruckIcon, Plus, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react'

export interface TruckFormValue {
  make: string
  model: string
  year: string
  mileage: string
  vin: string
  condition: '' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  description: string
  photos: File[]
}

interface Props {
  value: TruckFormValue[]
  onChange: (trucks: TruckFormValue[]) => void
}

export const emptyTruck = (): TruckFormValue => ({
  make: '',
  model: '',
  year: '',
  mileage: '',
  vin: '',
  condition: '',
  description: '',
  photos: [],
})

const CONDITIONS: Array<{ value: TruckFormValue['condition']; label: string }> = [
  { value: 'EXCELLENT', label: 'Excellent' },
  { value: 'GOOD', label: 'Good' },
  { value: 'FAIR', label: 'Fair' },
  { value: 'POOR', label: 'Poor' },
]

const TruckFormSection = ({ value, onChange }: Props) => {
  const [enabled, setEnabled] = useState(value.length > 0)

  const setEnabledAndSync = (next: boolean) => {
    setEnabled(next)
    if (next && value.length === 0) onChange([emptyTruck()])
    if (!next) onChange([])
  }

  const updateTruck = (index: number, patch: Partial<TruckFormValue>) => {
    onChange(value.map((t, i) => (i === index ? { ...t, ...patch } : t)))
  }

  const removeTruck = (index: number) => {
    const next = value.filter((_, i) => i !== index)
    onChange(next)
    if (next.length === 0) setEnabled(false)
  }

  const addTruck = () => onChange([...value, emptyTruck()])

  const addPhotos = (index: number, files: FileList | null) => {
    if (!files) return
    const incoming = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const existing = value[index].photos
    const combined = [...existing, ...incoming].slice(0, 5)
    updateTruck(index, { photos: combined })
  }

  const removePhoto = (truckIndex: number, photoIndex: number) => {
    const next = value[truckIndex].photos.filter((_, i) => i !== photoIndex)
    updateTruck(truckIndex, { photos: next })
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
        <TruckIcon className="w-5 h-5 text-indigo-500" />
        Selling a truck with this MC?
      </h3>
      <p className="text-sm text-gray-500 mb-5">
        Optional — include the truck(s) as part of the sale for a turnkey buyer.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setEnabledAndSync(true)}
          className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
            enabled
              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
          }`}
        >
          Yes, include truck(s)
        </button>
        <button
          type="button"
          onClick={() => setEnabledAndSync(false)}
          className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
            !enabled
              ? 'border-gray-500 bg-gray-100 text-gray-700'
              : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300'
          }`}
        >
          No
        </button>
      </div>

      {enabled && (
        <div className="space-y-4">
          {value.map((truck, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50/40 relative"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm text-gray-900">
                  Truck {index + 1}
                </h4>
                {value.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTruck(index)}
                    className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    value={truck.make}
                    onChange={(e) => updateTruck(index, { make: e.target.value })}
                    placeholder="Freightliner"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    value={truck.model}
                    onChange={(e) => updateTruck(index, { model: e.target.value })}
                    placeholder="Cascadia"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={truck.year}
                    onChange={(e) => updateTruck(index, { year: e.target.value })}
                    placeholder="2020"
                    min="1980"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Mileage
                  </label>
                  <input
                    type="number"
                    value={truck.mileage}
                    onChange={(e) => updateTruck(index, { mileage: e.target.value })}
                    placeholder="450000"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">VIN</label>
                  <input
                    type="text"
                    value={truck.vin}
                    onChange={(e) =>
                      updateTruck(index, { vin: e.target.value.toUpperCase() })
                    }
                    placeholder="1FUJGHDV8LLLH1234"
                    maxLength={17}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-mono uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => updateTruck(index, { condition: c.value })}
                        className={`px-2 py-1.5 rounded-lg border-2 text-xs font-medium transition-all ${
                          truck.condition === c.value
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Truck Description
                  </label>
                  <textarea
                    value={truck.description}
                    onChange={(e) =>
                      updateTruck(index, { description: e.target.value })
                    }
                    rows={3}
                    placeholder="Recent maintenance, modifications, accident history, tires, etc."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm resize-none"
                  />
                </div>

                {/* Photos */}
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Photos (up to 5)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {truck.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index, pIdx)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {truck.photos.length < 5 && (
                      <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">Add</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            addPhotos(index, e.target.files)
                            e.target.value = ''
                          }}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {truck.photos.length === 0 && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" /> JPG/PNG, up to 5 MB each
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTruck}
            className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add another truck
          </button>
        </div>
      )}
    </div>
  )
}

export default TruckFormSection
