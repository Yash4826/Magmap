import { useEffect, useState } from "react"
import { Flame, Layers, Mountain, SlidersHorizontal } from "lucide-react"

import MapView, { type MapHoverPayload, type MapSelectionPayload } from "./components/Map/MapView"
import SearchBar from "./components/Search/SearchBar"
import FilterPanel from "./components/Filters/FilterPanel"
import LocationCard from "./components/Location/LocationCard"
import ViewSelector, { type ViewMode } from "./components/Controls/ViewSelector"
import LibraryMenu from "./components/Controls/LibraryMenu"
import HeatLegend from "./components/Map/HeatLegend"
import { locations, type ManganeseLocation } from "./data/manganesePoints"
import {
  type ManganeseZoneProperties,
  type AreaInterpolationResult,
  CONCENTRATION_TIERS,
} from "./data/manganeseZones"

function App() {
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [draftMinimum, setDraftMinimum] = useState(0)
  const [minimumMn, setMinimumMn] = useState(0)
  const [draftMaximum, setDraftMaximum] = useState(75)
  const [maximumMn, setMaximumMn] = useState(75)
  const [draftConfidence, setDraftConfidence] = useState(0)
  const [minimumConfidence, setMinimumConfidence] = useState(0)
  const [draftPotential, setDraftPotential] = useState("All")
  const [potential, setPotential] = useState("All")
  const [draftSource, setDraftSource] = useState("All")
  const [source, setSource] = useState("All")

  // Overlays
  const [showTerrainConcentration, setShowTerrainConcentration] = useState(true)
  const [terrainOpacity, setTerrainOpacity] = useState(0.65)
  const [terrainMode, setTerrainMode] = useState<"discrete" | "smooth">("discrete")
  const [heatmapEnabled, setHeatmapEnabled] = useState(false)
  const [showZones, setShowZones] = useState(true)
  const [showPoints, setShowPoints] = useState(true)
  const [zoneOpacity, setZoneOpacity] = useState(0.5)
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("terrain")

  // Hover & selection states
  const [hoveredLocation, setHoveredLocation] = useState<ManganeseLocation | null>(null)
  const [hoveredZone, setHoveredZone] = useState<ManganeseZoneProperties | null>(null)
  const [hoveredInterpolated, setHoveredInterpolated] = useState<AreaInterpolationResult | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

  const [selectedLocation, setSelectedLocation] = useState<ManganeseLocation | null>(null)
  const [selectedZone, setSelectedZone] = useState<ManganeseZoneProperties | null>(null)
  const [selectedInterpolated, setSelectedInterpolated] = useState<AreaInterpolationResult | null>(null)
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null)

  const [savedLocations, setSavedLocations] = useState<ManganeseLocation[]>(() => {
    const stored = window.localStorage.getItem("moil-saved-locations")
    return stored ? (JSON.parse(stored) as ManganeseLocation[]) : []
  })
  const [recentLocations, setRecentLocations] = useState<ManganeseLocation[]>([])

  useEffect(() => {
    window.localStorage.setItem("moil-saved-locations", JSON.stringify(savedLocations))
  }, [savedLocations])

  // Filter locations based on filters and selected tier
  const visibleLocations = locations.filter((location) => {
    const matchesSearch = location.locationName.toLowerCase().includes(searchTerm.toLowerCase().trim())
    const matchesMn = location.mnPercent >= minimumMn && location.mnPercent <= maximumMn
    const matchesConfidence = location.confidence >= minimumConfidence
    const matchesPotential = potential === "All" || location.potential === potential
    const matchesSource = source === "All" || location.source === source

    // Tier filtering if active
    let matchesTier = true
    if (selectedTierId) {
      const activeTier = CONCENTRATION_TIERS.find((t) => t.id === selectedTierId)
      if (activeTier) {
        matchesTier =
          location.mnPercent >= activeTier.minPercent &&
          (activeTier.id === "ultra-high" ? location.mnPercent <= 75 : location.mnPercent < activeTier.maxPercent)
      }
    }

    return matchesSearch && matchesMn && matchesConfidence && matchesPotential && matchesSource && matchesTier
  })

  const resetFilters = () => {
    setSearchTerm("")
    setDraftMinimum(0)
    setMinimumMn(0)
    setDraftMaximum(75)
    setMaximumMn(75)
    setDraftConfidence(0)
    setMinimumConfidence(0)
    setDraftPotential("All")
    setPotential("All")
    setDraftSource("All")
    setSource("All")
    setSelectedTierId(null)
    setShowTerrainConcentration(true)
    setTerrainMode("discrete")
    setHeatmapEnabled(false)
    setShowZones(true)
    setShowPoints(true)
    setHoveredLocation(null)
    setHoveredZone(null)
    setHoveredInterpolated(null)
    setHoverPosition(null)
    setSelectedLocation(null)
    setSelectedZone(null)
    setSelectedInterpolated(null)
    setSelectedCoordinates(null)
    setFilterOpen(false)
  }

  const generateReport = () => {
    const lines: string[] = [
      "============================================================",
      "             MOIL MANGANESE EXPLORATION REPORT              ",
      "============================================================",
      `Generated: ${new Date().toLocaleString()}`,
      `Concession Region: Balaghat - Tirodi - Ukwa Manganese Belt`,
    ]

    if (selectedZone) {
      lines.push(
        `\n[AREA CONCENTRATION ZONE ASSESSMENT]`,
        `Zone Name: ${selectedZone.zoneName}`,
        `Grade Tier: ${selectedZone.tierLabel} (${selectedZone.rangeLabel})`,
        `Average Concentration: ${selectedZone.averageMn}% Mn`,
        `Concentration Range: ${selectedZone.minMn}% – ${selectedZone.maxMn}% Mn`,
        `Surface Coverage: ${selectedZone.areaKm2} sq km`,
        `Geological Formation: ${selectedZone.geologicalFormation}`,
        `Primary Mining Belt: ${selectedZone.primaryMineBelt}`,
        `Geological Confidence: ${selectedZone.confidence}%`,
      )
    } else if (selectedLocation) {
      lines.push(
        `\n[BOREHOLE / SAMPLE STATION ASSAY]`,
        `Station Name: ${selectedLocation.locationName}`,
        `Coordinates: ${selectedLocation.latitude.toFixed(5)}° N, ${selectedLocation.longitude.toFixed(5)}° E`,
        `Mn Concentration: ${selectedLocation.mnPercent}%`,
        `Confidence Level: ${selectedLocation.confidence}%`,
        `Ore Potential: ${selectedLocation.potential}`,
        `Sample Source: ${selectedLocation.source}`,
      )
    }

    if (selectedInterpolated) {
      lines.push(
        `\n[SPATIAL INTERPOLATION ESTIMATE]`,
        `Predicted Mn Concentration: ${selectedInterpolated.estimatedMnPercent}% Mn`,
        `Predicted Grade Tier: ${selectedInterpolated.tier.label} (${selectedInterpolated.tier.rangeLabel})`,
        `Interpolated Confidence: ${selectedInterpolated.estimatedConfidence}%`,
        `Nearest Ground Control: ${selectedInterpolated.nearestLocation.locationName} (${selectedInterpolated.distanceKm} km away)`,
      )
    }

    if (selectedCoordinates) {
      lines.push(
        `Target Coordinates: ${selectedCoordinates[1].toFixed(5)}° N, ${selectedCoordinates[0].toFixed(5)}° E`,
      )
    }

    lines.push(
      `\n============================================================`,
      `MOIL Limited Geological Exploration & Resource Database`,
      `============================================================`,
    )

    const report = lines.join("\n")
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = `moil-manganese-${(selectedZone?.zoneName ?? selectedLocation?.locationName ?? "area").toLowerCase().replace(/\s+/g, "-")}-report.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  // Active focused item for hover or selection
  const isPinned = Boolean(selectedLocation || selectedZone || selectedCoordinates)
  const activeLocation = isPinned ? selectedLocation : hoveredLocation
  const activeZone = isPinned ? selectedZone : hoveredZone
  const activeInterpolated = isPinned ? selectedInterpolated : hoveredInterpolated

  return (
    <main className="relative w-screen h-screen min-h-screen overflow-hidden font-sans">
      <MapView
        locations={visibleLocations}
        heatmapEnabled={heatmapEnabled}
        showZones={showZones}
        showTerrainConcentration={showTerrainConcentration}
        showPoints={showPoints}
        zoneOpacity={zoneOpacity}
        terrainOpacity={terrainOpacity}
        terrainMode={terrainMode}
        selectedTierId={selectedTierId}
        viewMode={viewMode}
        onHover={(data: MapHoverPayload | null, position) => {
          if (!isPinned) {
            setHoveredLocation(data?.location ?? null)
            setHoveredZone(data?.zone ?? null)
            setHoveredInterpolated(data?.interpolated ?? null)
            setHoverPosition(position)
          }
        }}
        onSelect={(payload: MapSelectionPayload) => {
          setHoveredLocation(null)
          setHoveredZone(null)
          setHoveredInterpolated(null)
          setHoverPosition(null)
          setSelectedLocation(payload.location)
          setSelectedZone(payload.zone)
          setSelectedInterpolated(payload.interpolated)
          setSelectedCoordinates(payload.coordinates)

          if (payload.location) {
            setRecentLocations((current) =>
              [payload.location!, ...current.filter((item) => item.id !== payload.location!.id)].slice(0, 6),
            )
          }
        }}
      />

      {/* Area Legend & Concentration Breakdown */}
      <HeatLegend
        selectedTierId={selectedTierId}
        onSelectTier={setSelectedTierId}
        zoneOpacity={zoneOpacity}
        onZoneOpacityChange={setZoneOpacity}
        showZones={showZones}
        onToggleZones={() => setShowZones((prev) => !prev)}
        showTerrainConcentration={showTerrainConcentration}
        onToggleTerrainConcentration={() => setShowTerrainConcentration((prev) => !prev)}
        terrainOpacity={terrainOpacity}
        onTerrainOpacityChange={setTerrainOpacity}
        terrainMode={terrainMode}
        onToggleTerrainMode={() => setTerrainMode((prev) => (prev === "discrete" ? "smooth" : "discrete"))}
      />

      {/* Map View & Layer Controls */}
      <ViewSelector
        value={viewMode}
        onChange={setViewMode}
        showTerrainConcentration={showTerrainConcentration}
        onToggleTerrainConcentration={() => setShowTerrainConcentration((prev) => !prev)}
        terrainMode={terrainMode}
        onToggleTerrainMode={() => setTerrainMode((prev) => (prev === "discrete" ? "smooth" : "discrete"))}
        showZones={showZones}
        onToggleZones={() => setShowZones((prev) => !prev)}
        heatmapEnabled={heatmapEnabled}
        onToggleHeatmap={() => setHeatmapEnabled((prev) => !prev)}
        showPoints={showPoints}
        onTogglePoints={() => setShowPoints((prev) => !prev)}
      />

      {/* Library Menu */}
      <LibraryMenu
        savedLocations={savedLocations}
        recentLocations={recentLocations}
        onChooseLocation={(location) => {
          setHoveredLocation(null)
          setHoveredZone(null)
          setHoveredInterpolated(null)
          setSelectedLocation(location)
          setSelectedZone(null)
          setSelectedCoordinates([location.longitude, location.latitude])
        }}
      />

      {/* Search Bar */}
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      {/* Filter Button */}
      <button
        onClick={() => setFilterOpen(true)}
        aria-label="Open filters"
        className="absolute top-4 right-4 z-10 w-14 h-14 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 transition-all border border-gray-100"
      >
        <SlidersHorizontal size={22} />
      </button>

      {/* Quick Color-Coded Terrain Button */}
      <button
        onClick={() => setShowTerrainConcentration((prev) => !prev)}
        aria-label={showTerrainConcentration ? "Hide Color-Coded Terrain" : "Show Color-Coded Terrain"}
        title={
          showTerrainConcentration
            ? "Hide Color-Coded Terrain (<10% Green, 10-30% Yellow, 30-60% Orange, >60% Red)"
            : "Show Color-Coded Terrain"
        }
        className={`absolute top-20 right-4 z-10 w-14 h-14 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all border border-gray-100 ${
          showTerrainConcentration
            ? "bg-teal-700 text-white shadow-teal-700/25"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Mountain size={18} />
        <span className="text-[9px] font-bold mt-0.5">Terrain</span>
      </button>

      {/* Quick Geological Zones Toggle Button */}
      <button
        onClick={() => setShowZones((prev) => !prev)}
        aria-label={showZones ? "Hide Area Concentration Zones" : "Show Area Concentration Zones"}
        title={showZones ? "Hide Area Concentration Zones" : "Show Area Concentration Zones"}
        className={`absolute top-36 right-4 z-10 w-14 h-14 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all border border-gray-100 ${
          showZones ? "bg-teal-700 text-white shadow-teal-700/20" : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Layers size={18} />
        <span className="text-[9px] font-bold mt-0.5">Zones</span>
      </button>

      {/* Heatmap Quick Toggle Button */}
      <button
        onClick={() => setHeatmapEnabled((enabled) => !enabled)}
        aria-label={heatmapEnabled ? "Hide Manganese Heatmap" : "Show Manganese Heatmap"}
        title={heatmapEnabled ? "Hide Manganese Heatmap" : "Show Manganese Heatmap"}
        className={`absolute top-52 right-4 z-10 w-14 h-14 rounded-2xl shadow-lg flex flex-col items-center justify-center transition-all border border-gray-100 ${
          heatmapEnabled ? "bg-orange-500 text-white shadow-orange-500/20" : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Flame size={18} />
        <span className="text-[9px] font-bold mt-0.5">Heat</span>
      </button>

      {/* Filters Modal */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        minimumMn={draftMinimum}
        onMinimumMnChange={setDraftMinimum}
        maximumMn={draftMaximum}
        onMaximumMnChange={setDraftMaximum}
        minimumConfidence={draftConfidence}
        onMinimumConfidenceChange={setDraftConfidence}
        potential={draftPotential}
        onPotentialChange={setDraftPotential}
        source={draftSource}
        onSourceChange={setDraftSource}
        onApply={() => {
          setMinimumMn(draftMinimum)
          setMaximumMn(draftMaximum)
          setMinimumConfidence(draftConfidence)
          setPotential(draftPotential)
          setSource(draftSource)
          setHoveredLocation(null)
          setHoveredZone(null)
          setHoveredInterpolated(null)
          setHoverPosition(null)
          setFilterOpen(false)
        }}
        onReset={resetFilters}
      />

      {/* Location / Area Inspection Card */}
      {(activeLocation || activeZone || activeInterpolated || selectedCoordinates) && (
        <LocationCard
          location={activeLocation}
          zone={activeZone}
          interpolated={activeInterpolated}
          coordinates={selectedCoordinates}
          onGenerateReport={generateReport}
          anchor={!isPinned && hoverPosition ? hoverPosition : null}
          onClose={() => {
            setHoveredLocation(null)
            setHoveredZone(null)
            setHoveredInterpolated(null)
            setHoverPosition(null)
            setSelectedLocation(null)
            setSelectedZone(null)
            setSelectedInterpolated(null)
            setSelectedCoordinates(null)
          }}
          pinned={isPinned}
          saved={Boolean(activeLocation && savedLocations.some((item) => item.id === activeLocation.id))}
          onToggleSaved={() => {
            if (!activeLocation) return
            setSavedLocations((current) =>
              current.some((item) => item.id === activeLocation.id)
                ? current.filter((item) => item.id !== activeLocation.id)
                : [...current, activeLocation],
            )
          }}
        />
      )}
    </main>
  )
}

export default App