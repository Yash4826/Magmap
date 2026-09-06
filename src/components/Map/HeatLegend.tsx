import { useState } from "react"
import { ChevronDown, ChevronUp, Globe2, Layers, Sliders } from "lucide-react"
import { getAreaStatistics, TERRAIN_CONCENTRATION_TIERS } from "../../data/manganeseZones"

interface HeatLegendProps {
  selectedTierId: string | null
  onSelectTier: (tierId: string | null) => void
  zoneOpacity: number
  onZoneOpacityChange: (opacity: number) => void
  showZones: boolean
  onToggleZones: () => void
  showTerrainConcentration?: boolean
  onToggleTerrainConcentration?: () => void
  terrainOpacity?: number
  onTerrainOpacityChange?: (opacity: number) => void
  terrainMode?: "discrete" | "smooth"
  onToggleTerrainMode?: () => void
}

function HeatLegend({
  selectedTierId,
  onSelectTier,
  zoneOpacity,
  onZoneOpacityChange,
  showZones,
  onToggleZones,
  showTerrainConcentration = true,
  onToggleTerrainConcentration,
  terrainOpacity = 0.65,
  onTerrainOpacityChange,
  terrainMode = "discrete",
  onToggleTerrainMode,
}: HeatLegendProps) {
  const [expanded, setExpanded] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<"terrain" | "geological">("terrain")
  const stats = getAreaStatistics()

  return (
    <div className="absolute bottom-5 left-5 z-20 w-[min(23rem,calc(100vw-2.5rem))] rounded-2xl bg-white/95 backdrop-blur shadow-2xl border border-gray-100 p-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Manganese Grade</span>
          <h3 className="text-sm font-bold text-gray-900">
            {activeTab === "terrain" ? "Terrain Color Code" : "Geological Area Bands"}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Layer settings"
            title="Layer Settings & Opacity"
            className={`p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors ${
              showSettings ? "bg-gray-100 text-teal-700" : ""
            }`}
          >
            <Sliders size={16} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse area legend" : "Expand area legend"}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1 mt-2.5 text-[11px] font-semibold">
        <button
          onClick={() => setActiveTab("terrain")}
          className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "terrain" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Globe2 size={13} className="text-teal-700" /> Terrain Tiers
        </button>
        <button
          onClick={() => setActiveTab("geological")}
          className={`flex-1 py-1 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "geological" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"
          }`}
        >
          <Layers size={13} className="text-teal-700" /> Geological Zones
        </button>
      </div>

      {/* Layer settings tray */}
      {showSettings && (
        <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-3">
          {onToggleTerrainConcentration && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <Globe2 size={14} className="text-teal-700" /> Terrain Color Surface
                </span>
                <button
                  onClick={onToggleTerrainConcentration}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    showTerrainConcentration ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {showTerrainConcentration ? "Enabled" : "Disabled"}
                </button>
              </div>
              {onTerrainOpacityChange && (
                <div>
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Terrain Surface Opacity</span>
                    <span className="font-semibold text-gray-800">{Math.round(terrainOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.95"
                    step="0.05"
                    value={terrainOpacity}
                    onChange={(e) => onTerrainOpacityChange(Number(e.target.value))}
                    className="w-full accent-teal-700 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                  />
                </div>
              )}
              {onToggleTerrainMode && (
                <div className="flex items-center justify-between pt-1 text-[11px] text-gray-600">
                  <span>Interpolation Style</span>
                  <button
                    onClick={onToggleTerrainMode}
                    className="px-2 py-0.5 rounded bg-white border border-gray-200 font-semibold text-gray-800 hover:bg-gray-50"
                  >
                    {terrainMode === "discrete" ? "Discrete Color Bands" : "Smooth Gradient"}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                <Layers size={14} className="text-teal-700" /> Geological Zone Outlines
              </span>
              <button
                onClick={onToggleZones}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  showZones ? "bg-teal-700 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {showZones ? "Enabled" : "Disabled"}
              </button>
            </div>
            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Zone Fill Opacity</span>
                <span className="font-semibold text-gray-800">{Math.round(zoneOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={zoneOpacity}
                onChange={(e) => onZoneOpacityChange(Number(e.target.value))}
                className="w-full accent-teal-700 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gradient / Discrete Threshold Bar */}
      {activeTab === "terrain" ? (
        <div className="mt-3">
          <div className="grid grid-cols-4 gap-1 h-3 rounded-full overflow-hidden shadow-inner">
            <div className="bg-[#22c55e] flex items-center justify-center text-[9px] font-bold text-white shadow-sm" />
            <div className="bg-[#eab308] flex items-center justify-center text-[9px] font-bold text-gray-900 shadow-sm" />
            <div className="bg-[#f97316] flex items-center justify-center text-[9px] font-bold text-white shadow-sm" />
            <div className="bg-[#dc2626] flex items-center justify-center text-[9px] font-bold text-white shadow-sm" />
          </div>
          <div className="mt-1 flex justify-between text-[10px] font-medium text-gray-600">
            <span>&lt; 10% (Green)</span>
            <span>&lt; 30% (Yellow)</span>
            <span>Orange</span>
            <span>&gt; 60% (Red)</span>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="h-3 rounded-full bg-gradient-to-r from-[#15803d] via-[#84cc16] via-[#eab308] via-[#ea580c] to-[#b91c1c] shadow-inner" />
          <div className="mt-1 flex justify-between text-[10px] font-medium text-gray-500">
            <span>&lt;15%</span>
            <span>20%</span>
            <span>30%</span>
            <span>40%</span>
            <span>50%+</span>
          </div>
        </div>
      )}

      {/* Expandable Area Coverage Breakdown */}
      {expanded && (
        <div className="mt-3.5 pt-3 border-t border-gray-100">
          {activeTab === "terrain" ? (
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 mb-2">
                <span>Terrain Color-Coded Tiers</span>
                <span className="text-[10px] text-teal-800 font-bold">~1,420 km²</span>
              </div>
              <div className="space-y-1.5">
                {TERRAIN_CONCENTRATION_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className="w-full text-left p-2 rounded-xl border border-gray-100 bg-white flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-md shrink-0 shadow-sm"
                        style={{ backgroundColor: tier.color }}
                      />
                      <div className="truncate">
                        <div className="font-semibold text-gray-800 text-[11px] leading-tight truncate">
                          {tier.rangeLabel}
                        </div>
                        <div className="text-[10px] text-gray-500">{tier.label}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-gray-800 text-[11px]">{tier.approxAreaKm2} km²</span>
                      <span className="text-[10px] text-gray-500 block">({tier.percentageOfTotal}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600 mb-2">
                <span>Geological Zones ({stats.totalAreaKm2} km²)</span>
                {selectedTierId && (
                  <button
                    onClick={() => onSelectTier(null)}
                    className="text-teal-700 hover:underline font-bold text-[10px]"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {stats.tiers.map((tier) => {
                  const isSelected = selectedTierId === tier.id
                  return (
                    <button
                      key={tier.id}
                      onClick={() => onSelectTier(isSelected ? null : tier.id)}
                      className={`w-full text-left p-2 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${
                        isSelected
                          ? "bg-teal-50 border-teal-600 shadow-sm"
                          : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-md shrink-0 shadow-sm"
                          style={{ backgroundColor: tier.color }}
                        />
                        <div className="truncate">
                          <div className="font-semibold text-gray-800 text-[11px] leading-tight truncate">
                            {tier.label}
                          </div>
                          <div className="text-[10px] text-gray-500">{tier.rangeLabel}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-gray-800 text-[11px]">{tier.areaKm2} km²</span>
                        <span className="text-[10px] text-gray-500 block">({tier.percentageOfTotal}%)</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <p className="mt-2.5 text-[10px] text-gray-400 leading-tight">
            Topographic terrain reveals underlying elevation contours through the color-coded manganese layer.
          </p>
        </div>
      )}
    </div>
  )
}

export default HeatLegend