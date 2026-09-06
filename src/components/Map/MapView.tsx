import { useEffect, useMemo, useRef } from "react"
import { Map, Marker } from "maplibre-gl"
import type { GeoJSONSource, MapMouseEvent } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import type { ManganeseLocation } from "../../data/manganesePoints"
import {
  manganeseZones,
  interpolateMnConcentration,
  generateTerrainRaster,
  SURVEY_BOUNDS,
  type ManganeseZoneProperties,
  type AreaInterpolationResult,
} from "../../data/manganeseZones"

export interface MapSelectionPayload {
  location: ManganeseLocation | null
  zone: ManganeseZoneProperties | null
  interpolated: AreaInterpolationResult | null
  coordinates: [number, number]
}

export interface MapHoverPayload {
  location: ManganeseLocation | null
  zone: ManganeseZoneProperties | null
  interpolated: AreaInterpolationResult | null
}

interface MapViewProps {
  locations: ManganeseLocation[]
  heatmapEnabled: boolean
  showZones?: boolean
  showTerrainConcentration?: boolean
  showPoints?: boolean
  zoneOpacity?: number
  terrainOpacity?: number
  terrainMode?: "discrete" | "smooth"
  selectedTierId?: string | null
  viewMode: "street" | "satellite" | "terrain"
  onHover: (data: MapHoverPayload | null, position: { x: number; y: number } | null) => void
  onSelect: (payload: MapSelectionPayload) => void
}

function createPointGeoJson(locations: ManganeseLocation[]) {
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

const MN_MAX = 70

function getManganeseColor(mnPercent: number) {
  // Color scale aligned with user thresholds:
  // <10% Green, 10-30% Yellow, 30-60% Orange, >60% Red
  const stops = [
    { value: 0, color: [34, 197, 94] },
    { value: 10, color: [234, 179, 8] },
    { value: 30, color: [249, 115, 22] },
    { value: 60, color: [220, 38, 38] },
    { value: MN_MAX, color: [153, 27, 27] },
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

function MapView({
  locations,
  heatmapEnabled,
  showZones = true,
  showTerrainConcentration = true,
  showPoints = true,
  zoneOpacity = 0.5,
  terrainOpacity = 0.65,
  terrainMode = "discrete",
  selectedTierId = null,
  viewMode,
  onHover,
  onSelect,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const markersRef = useRef<Marker[]>([])
  const locationsRef = useRef(locations)
  const onHoverRef = useRef(onHover)
  const onSelectRef = useRef(onSelect)
  const heatmapRef = useRef(heatmapEnabled)
  const showZonesRef = useRef(showZones)
  const showTerrainConcentrationRef = useRef(showTerrainConcentration)
  const showPointsRef = useRef(showPoints)
  const zoneOpacityRef = useRef(zoneOpacity)
  const terrainOpacityRef = useRef(terrainOpacity)
  const terrainModeRef = useRef(terrainMode)
  const selectedTierIdRef = useRef(selectedTierId)
  const hoveredZoneIdRef = useRef<string | null>(null)

  const mapStyles = useMemo(
    () => ({
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
    }),
    [],
  )

  useEffect(() => {
    locationsRef.current = locations
    onHoverRef.current = onHover
    onSelectRef.current = onSelect
    heatmapRef.current = heatmapEnabled
    showZonesRef.current = showZones
    showTerrainConcentrationRef.current = showTerrainConcentration
    showPointsRef.current = showPoints
    zoneOpacityRef.current = zoneOpacity
    terrainOpacityRef.current = terrainOpacity
    terrainModeRef.current = terrainMode
    selectedTierIdRef.current = selectedTierId
  }, [
    locations,
    heatmapEnabled,
    showZones,
    showTerrainConcentration,
    showPoints,
    zoneOpacity,
    terrainOpacity,
    terrainMode,
    selectedTierId,
    onHover,
    onSelect,
  ])

  useEffect(() => {
    if (!mapContainer.current) return

    const map = new Map({
      container: mapContainer.current,
      style: mapStyles[viewMode],
      center: [80.18, 21.18],
      zoom: 9.3,
      minZoom: 6,
      maxZoom: 18,
    })
    mapRef.current = map

    const handleMapClick = (event: MapMouseEvent) => {
      const coordinates: [number, number] = [event.lngLat.lng, event.lngLat.lat]

      // 1. Check if clicked near an exact sample point (< 0.04 degrees)
      const nearestPoint = locationsRef.current.reduce<ManganeseLocation | null>((closest, location) => {
        const distance = Math.hypot(location.longitude - coordinates[0], location.latitude - coordinates[1])
        if (!closest) return distance < 0.04 ? location : null
        const closestDistance = Math.hypot(closest.longitude - coordinates[0], closest.latitude - coordinates[1])
        return distance < closestDistance ? location : closest
      }, null)

      // 2. Query rendered features under click for zone polygons
      const features = map.queryRenderedFeatures(event.point, {
        layers: map.getLayer("manganese-zones-fill") ? ["manganese-zones-fill"] : [],
      })
      const clickedZone = (features[0]?.properties as ManganeseZoneProperties | undefined) ?? null

      // 3. Perform spatial continuous interpolation for this exact coordinate
      const interpolated = interpolateMnConcentration(coordinates[0], coordinates[1])

      onSelectRef.current({
        location: nearestPoint,
        zone: clickedZone ?? interpolated.zone,
        interpolated,
        coordinates,
      })
    }
    map.on("click", handleMapClick)

    const setupLayers = () => {
      // 1. ADD TERRAIN CONCENTRATION RASTER LAYER (<10% Green, 10-30% Yellow, 30-60% Orange, >60% Red)
      if (!map.getSource("terrain-concentration-source")) {
        const rasterUrl = generateTerrainRaster(
          locationsRef.current,
          terrainModeRef.current === "smooth",
        )

        if (rasterUrl) {
          map.addSource("terrain-concentration-source", {
            type: "image",
            url: rasterUrl,
            coordinates: [
              [SURVEY_BOUNDS.minLng, SURVEY_BOUNDS.maxLat], // top-left
              [SURVEY_BOUNDS.maxLng, SURVEY_BOUNDS.maxLat], // top-right
              [SURVEY_BOUNDS.maxLng, SURVEY_BOUNDS.minLat], // bottom-right
              [SURVEY_BOUNDS.minLng, SURVEY_BOUNDS.minLat], // bottom-left
            ],
          })

          map.addLayer({
            id: "terrain-concentration-layer",
            type: "raster",
            source: "terrain-concentration-source",
            layout: {
              visibility: showTerrainConcentrationRef.current ? "visible" : "none",
            },
            paint: {
              "raster-opacity": terrainOpacityRef.current,
              "raster-fade-duration": 0,
            },
          })
        }
      }

      // 2. ADD ZONES SOURCE & LAYERS
      if (!map.getSource("manganese-zones-data")) {
        map.addSource("manganese-zones-data", {
          type: "geojson",
          data: manganeseZones,
          promoteId: "id",
        })

        // Area polygon fill
        map.addLayer({
          id: "manganese-zones-fill",
          type: "fill",
          source: "manganese-zones-data",
          layout: {
            visibility: showZonesRef.current ? "visible" : "none",
          },
          paint: {
            "fill-color": ["get", "color"],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.82,
              zoneOpacityRef.current,
            ],
          },
        })

        // Area polygon boundaries
        map.addLayer({
          id: "manganese-zones-line",
          type: "line",
          source: "manganese-zones-data",
          layout: {
            visibility: showZonesRef.current ? "visible" : "none",
          },
          paint: {
            "line-color": "#ffffff",
            "line-width": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              3,
              1.5,
            ],
            "line-opacity": 0.85,
          },
        })

        // Zone hover events
        map.on("mousemove", "manganese-zones-fill", (event) => {
          map.getCanvas().style.cursor = "pointer"
          const feature = event.features?.[0]
          if (feature) {
            const zoneProps = feature.properties as ManganeseZoneProperties
            if (hoveredZoneIdRef.current && hoveredZoneIdRef.current !== zoneProps.id) {
              map.setFeatureState(
                { source: "manganese-zones-data", id: hoveredZoneIdRef.current },
                { hover: false },
              )
            }
            hoveredZoneIdRef.current = zoneProps.id
            map.setFeatureState(
              { source: "manganese-zones-data", id: zoneProps.id },
              { hover: true },
            )

            const containerRect = mapContainer.current?.getBoundingClientRect()
            const position = containerRect
              ? { x: containerRect.left + event.point.x, y: containerRect.top + event.point.y }
              : null

            const coords: [number, number] = [event.lngLat.lng, event.lngLat.lat]
            const interpolated = interpolateMnConcentration(coords[0], coords[1])

            onHoverRef.current(
              {
                location: null,
                zone: zoneProps,
                interpolated,
              },
              position,
            )
          }
        })

        map.on("mouseleave", "manganese-zones-fill", () => {
          map.getCanvas().style.cursor = ""
          if (hoveredZoneIdRef.current) {
            map.setFeatureState(
              { source: "manganese-zones-data", id: hoveredZoneIdRef.current },
              { hover: false },
            )
            hoveredZoneIdRef.current = null
          }
          onHoverRef.current(null, null)
        })
      }

      // 3. ADD HEATMAP SOURCE & LAYER
      if (!map.getSource("manganese-data")) {
        map.addSource("manganese-data", {
          type: "geojson",
          data: createPointGeoJson(locationsRef.current),
        })

        map.addLayer({
          id: "manganese-heatmap",
          type: "heatmap",
          source: "manganese-data",
          layout: { visibility: heatmapRef.current ? "visible" : "none" },
          paint: {
            "heatmap-weight": ["interpolate", ["linear"], ["get", "mnPercent"], 0, 0.15, MN_MAX, 1],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 7, 0.8, 12, 1.4],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 7, 60, 10, 36, 14, 20],
            "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0.55, 13, 0.75],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(34, 197, 94, 0)",
              0.15,
              "rgba(34, 197, 94, 0.45)",
              0.3,
              "#eab308",
              0.6,
              "#f97316",
              1,
              "#dc2626",
            ],
          },
        })
      }
    }

    map.on("load", setupLayers)
    if (map.isStyleLoaded()) setupLayers()

    return () => {
      markersRef.current.forEach((marker) => marker.remove())
      markersRef.current = []
      map.off("load", setupLayers)
      map.off("click", handleMapClick)
      map.remove()
      mapRef.current = null
    }
  }, [mapStyles, viewMode])

  // Sync data, layers, visibility, opacity, and markers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Update Terrain Concentration Layer
    const rasterSource = map.getSource("terrain-concentration-source") as
      | { updateImage: (opts: { url: string }) => void }
      | undefined

    if (rasterSource && typeof rasterSource.updateImage === "function") {
      const newUrl = generateTerrainRaster(locations, terrainMode === "smooth")
      if (newUrl) {
        rasterSource.updateImage({ url: newUrl })
      }
    }

    if (map.getLayer("terrain-concentration-layer")) {
      map.setLayoutProperty(
        "terrain-concentration-layer",
        "visibility",
        showTerrainConcentration ? "visible" : "none",
      )
      map.setPaintProperty("terrain-concentration-layer", "raster-opacity", terrainOpacity)
    }

    // Update point GeoJSON data
    const pointSource = map.getSource("manganese-data") as GeoJSONSource | undefined
    pointSource?.setData(createPointGeoJson(locations))

    // Update heatmap visibility
    if (map.getLayer("manganese-heatmap")) {
      map.setLayoutProperty("manganese-heatmap", "visibility", heatmapEnabled ? "visible" : "none")
    }

    // Update zones visibility and opacity
    if (map.getLayer("manganese-zones-fill")) {
      map.setLayoutProperty("manganese-zones-fill", "visibility", showZones ? "visible" : "none")

      // Filter by selectedTierId if active
      if (selectedTierId) {
        map.setFilter("manganese-zones-fill", ["==", ["get", "tierId"], selectedTierId])
        map.setFilter("manganese-zones-line", ["==", ["get", "tierId"], selectedTierId])
      } else {
        map.setFilter("manganese-zones-fill", null)
        map.setFilter("manganese-zones-line", null)
      }

      map.setPaintProperty("manganese-zones-fill", "fill-opacity", [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.82,
        zoneOpacity,
      ])
    }

    if (map.getLayer("manganese-zones-line")) {
      map.setLayoutProperty("manganese-zones-line", "visibility", showZones ? "visible" : "none")
    }

    // Update markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    if (showPoints) {
      markersRef.current = locations.map((location) => {
        const mapMarker = new Marker({ color: getManganeseColor(location.mnPercent) })
          .setLngLat([location.longitude, location.latitude])
          .addTo(map)
        const marker = mapMarker.getElement()

        marker.addEventListener("mouseenter", () => {
          const rect = marker.getBoundingClientRect()
          const coords: [number, number] = [location.longitude, location.latitude]
          const interpolated = interpolateMnConcentration(coords[0], coords[1])
          onHoverRef.current(
            {
              location,
              zone: null,
              interpolated,
            },
            { x: rect.left, y: rect.bottom },
          )
        })

        marker.addEventListener("mouseleave", () => {
          onHoverRef.current(null, null)
        })

        marker.addEventListener("click", (event) => {
          event.stopPropagation()
          const coords: [number, number] = [location.longitude, location.latitude]
          const interpolated = interpolateMnConcentration(coords[0], coords[1])
          onSelectRef.current({
            location,
            zone: null,
            interpolated,
            coordinates: coords,
          })
        })

        return mapMarker
      })
    }
  }, [
    locations,
    heatmapEnabled,
    showZones,
    showTerrainConcentration,
    showPoints,
    zoneOpacity,
    terrainOpacity,
    terrainMode,
    selectedTierId,
  ])

  return <div ref={mapContainer} className="absolute inset-0 h-full w-full" />
}

export default MapView