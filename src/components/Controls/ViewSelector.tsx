import { Check, Flame, Layers3, Map, Mountain, Satellite } from "lucide-react"
import { useState } from "react"

type ViewMode = "street" | "satellite" | "terrain"

interface ViewSelectorProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
}

const views: Array<{ value: ViewMode; label: string; icon: typeof Map }> = [
  { value: "street", label: "Map", icon: Map },
  { value: "satellite", label: "Satellite", icon: Satellite },
  { value: "terrain", label: "Terrain", icon: Mountain },
]

function ViewSelector({ value, onChange }: ViewSelectorProps) {
	const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-5 right-5 z-20">
      {open && (
        <div className="absolute bottom-16 right-0 w-56 rounded-2xl bg-white p-3 shadow-xl border border-gray-200">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Map layers</p>
          {views.map(({ value: viewValue, label, icon: Icon }) => (
            <button
              key={viewValue}
              onClick={() => onChange(viewValue)}
              aria-label={`Show ${label.toLowerCase()} view`}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{label}</span>
              {value === viewValue && <Check size={17} className="text-teal-700" />}
            </button>
          ))}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700">
              <Flame size={18} className="text-orange-500" />
              <span>Manganese heatmap</span>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label="Open map layers"
        className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-xl border border-gray-200 hover:bg-gray-50"
      >
        <Layers3 size={18} /> Layers
      </button>
    </div>
  )
}

export default ViewSelector