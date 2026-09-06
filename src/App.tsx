import { useEffect, useState } from "react"
import { Flame, SlidersHorizontal } from "lucide-react"

import MapView from "./components/Map/MapView"
import SearchBar from "./components/Search/SearchBar"
import FilterPanel from "./components/Filters/FilterPanel"
import LocationCard from "./components/Location/LocationCard"
import ViewSelector from "./components/Controls/ViewSelector"
import LibraryMenu from "./components/Controls/LibraryMenu"
import HeatLegend from "./components/Map/HeatLegend"
import { locations, type ManganeseLocation } from "./data/manganesePoints"

function App() {

  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [draftMinimum, setDraftMinimum] = useState(0)
  const [minimumMn, setMinimumMn] = useState(0)
  const [draftMaximum, setDraftMaximum] = useState(55)
  const [maximumMn, setMaximumMn] = useState(55)
  const [draftConfidence, setDraftConfidence] = useState(0)
  const [minimumConfidence, setMinimumConfidence] = useState(0)
  const [draftPotential, setDraftPotential] = useState("All")
  const [potential, setPotential] = useState("All")
  const [draftSource, setDraftSource] = useState("All")
  const [source, setSource] = useState("All")
  const [heatmapEnabled, setHeatmapEnabled] = useState(true)
    const [viewMode, setViewMode] = useState<"street" | "satellite" | "terrain">("street")
  const [hoveredLocation, setHoveredLocation] = useState<ManganeseLocation | null>(null)
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<ManganeseLocation | null>(null)
  const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number] | null>(null)
  const [savedLocations, setSavedLocations] = useState<ManganeseLocation[]>(() => {
    const stored = window.localStorage.getItem("moil-saved-locations")
    return stored ? JSON.parse(stored) as ManganeseLocation[] : []
  })
  const [recentLocations, setRecentLocations] = useState<ManganeseLocation[]>([])

  useEffect(() => {
    window.localStorage.setItem("moil-saved-locations", JSON.stringify(savedLocations))
  }, [savedLocations])

  const visibleLocations = locations.filter((location) => {
    const matchesSearch = location.locationName.toLowerCase().includes(searchTerm.toLowerCase().trim())
    return matchesSearch &&
      location.mnPercent >= minimumMn &&
      location.mnPercent <= maximumMn &&
      location.confidence >= minimumConfidence &&
      (potential === "All" || location.potential === potential) &&
      (source === "All" || location.source === source)
  })

  const focusedLocation = hoveredLocation ?? selectedLocation

  const resetFilters = () => {
    setSearchTerm("")
    setDraftMinimum(0)
    setMinimumMn(0)
    setDraftMaximum(55)
    setMaximumMn(55)
    setDraftConfidence(0)
    setMinimumConfidence(0)
    setDraftPotential("All")
    setPotential("All")
    setDraftSource("All")
    setSource("All")
    setHeatmapEnabled(true)
    setHoveredLocation(null)
    setHoverPosition(null)
    setSelectedLocation(null)
    setSelectedCoordinates(null)
    setFilterOpen(false)
  }

  const generateReport = () => {
    const target = focusedLocation
      ? `${focusedLocation.locationName} (${focusedLocation.latitude}, ${focusedLocation.longitude})`
      : selectedCoordinates
        ? `Selected coordinate (${selectedCoordinates[1].toFixed(5)}, ${selectedCoordinates[0].toFixed(5)})`
        : "Current map view"
    const report = [
      "MOIL MANGANESE DETECTION REPORT",
      `Generated: ${new Date().toISOString()}`,
      `Target: ${target}`,
      focusedLocation ? `Mn Grade: ${focusedLocation.mnPercent}%` : "Mn Grade: Pending field sample",
      focusedLocation ? `Confidence: ${focusedLocation.confidence}%` : "Confidence: Not available",
      focusedLocation ? `Potential: ${focusedLocation.potential}` : "Potential: Not classified",
      focusedLocation ? `Source: ${focusedLocation.source}` : "Source: Map selection",
    ].join("\n")
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "moil-manganese-report.txt"
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="relative w-screen h-screen min-h-screen overflow-hidden">

      <MapView
        locations={visibleLocations}
        heatmapEnabled={heatmapEnabled}
        viewMode={viewMode}
        onHover={(location, position) => {
          setHoveredLocation(location)
          setHoverPosition(position)
        }}
        onSelect={(location, coordinates) => {
          setHoveredLocation(null)
          setHoverPosition(null)
          setSelectedLocation(location)
          setSelectedCoordinates(coordinates)
          if (location) setRecentLocations((current) => [location, ...current.filter((item) => item.id !== location.id)].slice(0, 6))
        }}
      />

      {heatmapEnabled && <HeatLegend />}
      <ViewSelector value={viewMode} onChange={setViewMode} />
      <LibraryMenu savedLocations={savedLocations} recentLocations={recentLocations} onChooseLocation={(location) => {
        setHoveredLocation(null)
        setSelectedLocation(location)
        setSelectedCoordinates([location.longitude, location.latitude])
      }} />

      <SearchBar value={searchTerm} onChange={setSearchTerm} />

      <button
        onClick={() => setFilterOpen(true)}
        aria-label="Open filters"
        className="absolute top-6 right-6 z-10 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
      >
        <SlidersHorizontal size={22} />
      </button>

      <button
        onClick={() => setHeatmapEnabled((enabled) => !enabled)}
        aria-label={heatmapEnabled ? "Hide Manganese heatmap" : "Show Manganese heatmap"}
        className={`absolute top-24 right-6 z-20 w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${heatmapEnabled ? "bg-orange-500 text-white" : "bg-white text-gray-700"}`}
      >
        <Flame size={22} />
      </button>

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
          setHoverPosition(null)
          setFilterOpen(false)
        }}
        onReset={resetFilters}
      />

      {(focusedLocation || selectedCoordinates) && (
        <LocationCard
          location={focusedLocation}
          coordinates={selectedCoordinates}
          onGenerateReport={generateReport}
          anchor={hoveredLocation ? hoverPosition : null}
          onClose={() => {
            setHoveredLocation(null)
            setHoverPosition(null)
            setSelectedLocation(null)
            setSelectedCoordinates(null)
          }}
          pinned={Boolean(selectedLocation || selectedCoordinates)}
          saved={Boolean(focusedLocation && savedLocations.some((item) => item.id === focusedLocation.id))}
          onToggleSaved={() => {
            if (!focusedLocation) return
            setSavedLocations((current) => current.some((item) => item.id === focusedLocation.id) ? current.filter((item) => item.id !== focusedLocation.id) : [...current, focusedLocation])
          }}
        />
      )}

    </main>
  )
}

export default App