import { Check, Flame, Globe2, Layers, Layers3, Map, MapPin, Mountain, Satellite, Sliders } from "lucide-react"
import { useState } from "react"

export type ViewMode = "street" | "satellite" | "terrain"

interface ViewSelectorProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  showTerrainConcentration?: boolean
  onToggleTerrainConcentration?: () => void
  terrainMode?: "discrete" | "smooth"
  onToggleTerrainMode?: () => void
  showZones?: boolean
  onToggleZones?: () => void
  heatmapEnabled?: boolean
  onToggleHeatmap?: () => void
  showPoints?: boolean
  onTogglePoints?: () => void
}

const views: Array<{ value: ViewMode; label: string; icon: typeof Map }> = [
  { value: "street", label: "Street Map", icon: Map },
  { value: "satellite", label: "Satellite Imagery", icon: Satellite },
  { value: "terrain", label: "Topographic Terrain", icon: Mountain },
]

function ViewSelector({
  value,
  onChange,
  showTerrainConcentration = true,
  onToggleTerrainConcentration,
  terrainMode = "discrete",
  onToggleTerrainMode,
  showZones = true,
  onToggleZones,
  heatmapEnabled = false,
  onToggleHeatmap,
  showPoints = true,
  onTogglePoints,
}: ViewSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="absolute bottom-5 right-5 z-20">
      {open && (
        <div className="absolute bottom-16 right-0 w-72 rounded-2xl bg-white/95 backdrop-blur p-4 shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Base Map Options */}
          <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">Base Map</p>
          <div className="space-y-1">
            {views.map(({ value: viewValue, label, icon: Icon }) => (
              <button
                key={viewValue}
                onClick={() => onChange(viewValue)}
                aria-label={`Show ${label.toLowerCase()} view`}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs transition-colors ${
                  value === viewValue
                    ? "bg-teal-50 text-teal-800 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{label}</span>
                {value === viewValue && <Check size={16} className="text-teal-700" />}
              </button>
            ))}
          </div>

          {/* Manganese Overlays */}
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="px-1 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Manganese Layer Controls
            </p>
            <div className="space-y-1.5">
              {/* Color Coded Terrain Layer */}
              {onToggleTerrainConcentration && (
                <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={onToggleTerrainConcentration}
                      className="flex items-center gap-2 text-xs font-semibold text-gray-800 text-left"
                    >
                      <Globe2 size={15} className="text-teal-700 shrink-0" />
                      <div>
                        <div>Color-Coded Terrain</div>
                        <div className="flex items-center gap-1 text-[9px] text-gray-500 font-normal">
                          <span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" title="<10% Green" /> &lt;10%
                          <span className="inline-block w-2 h-2 rounded-full bg-[#eab308]" title="10-30% Yellow" /> &lt;30%
                          <span className="inline-block w-2 h-2 rounded-full bg-[#f97316]" title="30-60% Orange" /> 30-60%
                          <span className="inline-block w-2 h-2 rounded-full bg-[#dc2626]" title=">60% Red" /> &gt;60%
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={onToggleTerrainConcentration}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        showTerrainConcentration ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {showTerrainConcentration ? "ON" : "OFF"}
                    </button>
                  </div>

                  {showTerrainConcentration && onToggleTerrainMode && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-200/60 text-[10px] text-gray-600">
                      <span className="flex items-center gap-1">
                        <Sliders size={12} /> Style Mode:
                      </span>
                      <button
                        onClick={onToggleTerrainMode}
                        className="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-semibold text-gray-800 hover:bg-gray-100 transition-colors"
                      >
                        {terrainMode === "discrete" ? "Discrete Bands" : "Smooth Gradient"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Geological Area Zones */}
              {onToggleZones && (
                <button
                  onClick={onToggleZones}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers size={15} className="text-teal-700" />
                    <span>Geological Grade Zones</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      showZones ? "bg-teal-100 text-teal-800" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {showZones ? "ON" : "OFF"}
                  </span>
                </button>
              )}

              {/* Heatmap */}
              {onToggleHeatmap && (
                <button
                  onClick={onToggleHeatmap}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Flame size={15} className="text-orange-500" />
                    <span>Density Heatmap</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      heatmapEnabled ? "bg-orange-100 text-orange-800" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {heatmapEnabled ? "ON" : "OFF"}
                  </span>
                </button>
              )}

              {/* Borehole points */}
              {onTogglePoints && (
                <button
                  onClick={onTogglePoints}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} className="text-red-500" />
                    <span>Sample Boreholes</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      showPoints ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {showPoints ? "ON" : "OFF"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label="Open map layers"
        className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-xl border border-gray-200 hover:bg-gray-50 transition-all"
      >
        <Layers3 size={18} /> Layers
      </button>
    </div>
  )
}

export default ViewSelector