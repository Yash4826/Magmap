import { Bookmark, BookmarkCheck, FileDown, Layers, MapPin, Sparkles, X } from "lucide-react"
import type { ManganeseLocation } from "../../data/manganesePoints"
import type { ManganeseZoneProperties, AreaInterpolationResult } from "../../data/manganeseZones"

interface LocationCardProps {
  location: ManganeseLocation | null
  zone?: ManganeseZoneProperties | null
  interpolated?: AreaInterpolationResult | null
  coordinates: [number, number] | null
  onGenerateReport: () => void
  anchor: { x: number; y: number } | null
  onClose: () => void
  pinned: boolean
  saved: boolean
  onToggleSaved: () => void
}

function LocationCard({
  location,
  zone,
  interpolated,
  coordinates,
  onGenerateReport,
  anchor,
  onClose,
  pinned,
  saved,
  onToggleSaved,
}: LocationCardProps) {
  // Determine title and badge
  const title = location?.locationName ?? zone?.zoneName ?? "Surveyed Concession Area"
  const tierLabel = zone?.rangeLabel ?? (interpolated ? interpolated.tier.rangeLabel : null)
  const mnPercent = location
    ? `${location.mnPercent}%`
    : zone
      ? `${zone.rangeLabel} (avg. ${zone.averageMn}%)`
      : interpolated
        ? `~${interpolated.estimatedMnPercent}%`
        : "Pending"

  const confidence = location
    ? `${location.confidence}%`
    : zone
      ? `${zone.confidence}%`
      : interpolated
        ? `${interpolated.estimatedConfidence}%`
        : "N/A"

  if (pinned) {
    return (
      <aside className="absolute right-0 top-0 z-30 flex h-full w-[min(31rem,calc(100vw-1rem))] overflow-hidden bg-white shadow-2xl border-l border-gray-200 animate-in slide-in-from-right duration-200">
        <div className="min-w-0 flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                  {zone ? "Concentration Zone" : location ? "Borehole Station" : "Area Analysis"}
                </span>
                {tierLabel && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: zone?.color ?? interpolated?.tier.color ?? "#0f766e" }}
                  >
                    {tierLabel}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-1">{title}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close location sidebar"
              className="p-1 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Bookmark toggle */}
          {location && (
            <button
              onClick={onToggleSaved}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {saved ? <BookmarkCheck size={16} className="text-teal-700" /> : <Bookmark size={16} />}
              {saved ? "Saved to Library" : "Bookmark Location"}
            </button>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-3">
              <span className="text-gray-500 block mb-1">Mn Concentration</span>
              <strong className="text-base text-teal-900 font-bold">{mnPercent}</strong>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
              <span className="text-gray-500 block mb-1">Geological Confidence</span>
              <strong className="text-base text-gray-900 font-bold">{confidence}</strong>
            </div>
          </div>

          {/* Zone Specific Attributes */}
          {zone && (
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Layers size={14} className="text-teal-700" /> Area Surface
                </span>
                <strong className="text-gray-800 font-semibold">{zone.areaKm2} km²</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Formation</span>
                <strong className="text-gray-800 font-semibold truncate max-w-[200px]" title={zone.geologicalFormation}>
                  {zone.geologicalFormation}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mining Belt</span>
                <strong className="text-gray-800 font-semibold truncate max-w-[200px]" title={zone.primaryMineBelt}>
                  {zone.primaryMineBelt}
                </strong>
              </div>
            </div>
          )}

          {/* Interpolated info / Validation */}
          {interpolated && (
            <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                <Sparkles size={14} className="text-amber-700" /> Continuous Spatial Interpolation
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Calculated via Inverse Distance Weighting across 24 local sample boreholes.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[11px]">
                <span className="text-amber-700">Nearest Ground Station</span>
                <strong className="text-amber-900">
                  {interpolated.nearestLocation.locationName} ({interpolated.distanceKm} km)
                </strong>
              </div>
            </div>
          )}

          {/* Coordinates info */}
          {coordinates && (
            <p className="text-[11px] text-gray-500 mt-4 font-mono">
              Coordinates: {coordinates[1].toFixed(5)}° N, {coordinates[0].toFixed(5)}° E
            </p>
          )}

          {/* Report Button */}
          <button
            onClick={onGenerateReport}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-xs font-semibold hover:bg-gray-800 transition-colors shadow-md"
          >
            <FileDown size={16} /> Generate Area Concentration Report
          </button>
        </div>
      </aside>
    )
  }

  // Hover floating card
  return (
    <aside
      className={`absolute z-30 w-[min(21rem,calc(100vw-2rem))] bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-white p-4 transition-all duration-150 pointer-events-none ${
        anchor ? "" : "bottom-5 left-5"
      }`}
      style={
        anchor
          ? {
              left: Math.min(anchor.x + 14, Math.max(16, window.innerWidth - 350)),
              top: Math.min(anchor.y + 14, Math.max(16, window.innerHeight - 260)),
            }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-teal-700 font-bold">
              {zone ? "Concentration Zone" : location ? "Detection Point" : "Interpolated Area"}
            </span>
            {tierLabel && (
              <span
                className="text-[9px] font-bold px-1.5 py-0.2 rounded text-white"
                style={{ backgroundColor: zone?.color ?? interpolated?.tier.color ?? "#0f766e" }}
              >
                {tierLabel}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-gray-900 mt-0.5 truncate">{title}</h3>
        </div>
        <MapPin className="text-teal-700 shrink-0 mt-1" size={18} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div className="bg-teal-50/70 rounded-xl p-2.5">
          <span className="text-gray-500 block text-[10px]">Mn Concentration</span>
          <strong className="text-teal-900 font-bold text-xs">{mnPercent}</strong>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5">
          <span className="text-gray-500 block text-[10px]">Confidence</span>
          <strong className="text-gray-900 font-bold text-xs">{confidence}</strong>
        </div>
      </div>

      {zone && (
        <p className="text-[10px] text-gray-500 mt-2">
          Area: <strong>{zone.areaKm2} km²</strong> · {zone.primaryMineBelt}
        </p>
      )}

      {interpolated && !zone && (
        <p className="text-[10px] text-gray-500 mt-2">
          Tier: <strong>{interpolated.tier.label}</strong> ({interpolated.nearestLocation.locationName})
        </p>
      )}
    </aside>
  )
}

export default LocationCard
