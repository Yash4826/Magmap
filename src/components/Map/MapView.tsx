import { useEffect, useMemo, useRef } from "react"
import { Map, Marker } from "maplibre-gl"
import type { GeoJSONSource, MapMouseEvent } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import type { ManganeseLocation } from "../../data/manganesePoints"

interface MapViewProps {
  locations: ManganeseLocation[]
  heatmapEnabled: boolean
  viewMode: "street" | "satellite" | "terrain"
  onHover: (location: ManganeseLocation | null, position: { x: number; y: number } | null) => void
  onSelect: (location: ManganeseLocation | null, coordinates: [number, number]) => void
}

function createGeoJson(locations: ManganeseLocation[]) {
  return {
    type: "FeatureCollection" as const,
    features: locations.map((location) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [location.longitude, location.latitude],
      },
      properties: {
        id: location.id,
        locationName: location.locationName,
        mnPercent: location.mnPercent,
        confidence: location.confidence,
        potential: location.potential,
      },
    })),
  }
}

const MN_MAX = 55

function getManganeseColor(mnPercent: number) {
  const stops = [
    { value: 0, color: [21, 128, 61] },
    { value: 10, color: [74, 222, 128] },
    { value: 20, color: [163, 230, 53] },
    { value: 30, color: [250, 204, 21] },
    { value: 40, color: [249, 115, 22] },
    { value: MN_MAX, color: [220, 38, 38] },
  ]
  const value = Math.max(0, Math.min(MN_MAX, mnPercent))
  const upperIndex = stops.findIndex((stop) => value <= stop.value)
  const upper = stops[upperIndex === -1 ? stops.length - 1 : upperIndex]
  const lower = stops[Math.max(0, upperIndex - 1)]
  const range = upper.value - lower.value || 1
  const progress = (value - lower.value) / range
  const color = lower.color.map((channel, index) => Math.round(channel + (upper.color[index] - channel) * progress))
  return `rgb(${color.join(", ")})`
}

function MapView({ locations, heatmapEnabled, viewMode, onHover, onSelect }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const locationsRef = useRef(locations)
  const onHoverRef = useRef(onHover)
  const onSelectRef = useRef(onSelect)
  const heatmapRef = useRef(heatmapEnabled)

  const mapStyles = useMemo(() => ({
    street: {
      version: 8 as const,
      sources: {
        openstreetmap: {
          type: "raster" as const,
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },
      },
      layers: [{ id: "openstreetmap", type: "raster" as const, source: "openstreetmap" }],
    },
    satellite: {
      version: 8 as const,
      sources: {
        satellite: {
          type: "raster" as const,
          tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
          tileSize: 256,
          attribution: "Tiles © Esri",
        },
      },
      layers: [{ id: "satellite", type: "raster" as const, source: "satellite" }],
    },
    terrain: {
      version: 8 as const,
      sources: {
        terrain: {
          type: "raster" as const,
          tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenTopoMap contributors",
        },
      },
      layers: [{ id: "terrain", type: "raster" as const, source: "terrain" }],
    },
  }), [])

  useEffect(() => {
    locationsRef.current = locations
    onHoverRef.current = onHover
    onSelectRef.current = onSelect
    heatmapRef.current = heatmapEnabled
  }, [locations, heatmapEnabled, onHover, onSelect])

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new Map({
      container: mapContainer.current,

      style: mapStyles[viewMode],

      center: [80.15, 21.18],

      zoom: 8,
    })
    mapRef.current = map

    const handleMapClick = (event: MapMouseEvent) => {
      const coordinates: [number, number] = [event.lngLat.lng, event.lngLat.lat]
      const nearest = locationsRef.current.reduce<ManganeseLocation | null>((closest, location) => {
        const distance = Math.hypot(location.longitude - coordinates[0], location.latitude - coordinates[1])
        if (!closest) return distance < 0.12 ? location : null
        const closestDistance = Math.hypot(closest.longitude - coordinates[0], closest.latitude - coordinates[1])
        return distance < closestDistance ? location : closest
      }, null)
      onSelectRef.current(nearest, coordinates)
    }
    map.on("click", handleMapClick)

    const addHeatmap = () => {
      if (map.getSource("manganese-data")) return

      map.addSource("manganese-data", {
        type: "geojson",
        data: createGeoJson(locationsRef.current),
      })
      map.addLayer({
        id: "manganese-heatmap",
        type: "heatmap",
        source: "manganese-data",
        layout: { visibility: heatmapRef.current ? "visible" : "none" },
        paint: {
          "heatmap-weight": ["interpolate", ["linear"], ["get", "mnPercent"], 0, 0.15, MN_MAX, 1],
          "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 7, 0.8, 12, 1.35],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 7, 55, 10, 34, 14, 18],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0.6, 13, 0.76],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(21, 128, 61, 0)",
            0.12, "rgba(21, 128, 61, 0.42)",
            0.3, "#4ade80",
            0.5, "#a3e635",
            0.7, "#facc15",
            0.86, "#f97316",
            1, "#dc2626",
          ],
        },
      })
      map.addLayer({
        id: "manganese-points",
        type: "circle",
        source: "manganese-data",
        paint: {
          "circle-radius": 5,
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "mnPercent"],
            0, "#15803d",
            10, "#4ade80",
            20, "#a3e635",
            30, "#facc15",
            40, "#f97316",
            MN_MAX, "#dc2626",
          ],
          "circle-opacity": 0,
          "circle-stroke-opacity": 0,
        },
      })

      map.on("mousemove", "manganese-points", (event) => {
        map.getCanvas().style.cursor = "pointer"
        const id = event.features?.[0]?.properties?.id
        const containerRect = mapContainer.current?.getBoundingClientRect()
        const position = containerRect
          ? { x: containerRect.left + event.point.x, y: containerRect.top + event.point.y }
          : null
        onHoverRef.current(locationsRef.current.find((location) => location.id === Number(id)) ?? null, position)
      })
      map.on("mouseleave", "manganese-points", () => {
        map.getCanvas().style.cursor = ""
      })
    }

    map.on("load", addHeatmap)
    if (map.isStyleLoaded()) addHeatmap()

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.off("load", addHeatmap)
      map.off("click", handleMapClick)
      map.remove()
      mapRef.current = null
    }
  }, [mapStyles, viewMode])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const source = map.getSource("manganese-data") as GeoJSONSource | undefined
    source?.setData(createGeoJson(locations))

    if (map.getLayer("manganese-heatmap")) {
      map.setLayoutProperty("manganese-heatmap", "visibility", heatmapEnabled ? "visible" : "none")
    }

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = locations.map((location) => {
      const mapMarker = new Marker({ color: getManganeseColor(location.mnPercent) })
        .setLngLat([location.longitude, location.latitude])
        .addTo(map)
      const marker = mapMarker.getElement()

      marker.addEventListener("mouseenter", () => {
        const rect = marker.getBoundingClientRect()
        onHoverRef.current(location, { x: rect.left, y: rect.bottom })
      })
      marker.addEventListener("mouseleave", () => {
        onHoverRef.current(null, null)
      })
      marker.addEventListener("click", (event) => {
        event.stopPropagation()
        onSelectRef.current(location, [location.longitude, location.latitude])
      })

      return mapMarker
    })
  }, [locations, heatmapEnabled])

  return (
    <div
      ref={mapContainer}
      className="absolute inset-0 h-full w-full"
    />
  )
}

export default MapView