import { locations, type ManganeseLocation } from "./manganesePoints"

export interface ConcentrationTier {
  id: string
  label: string
  rangeLabel: string
  minPercent: number
  maxPercent: number
  color: string
  textColor: string
  borderColor: string
  description: string
  approxAreaKm2: number
}

export const CONCENTRATION_TIERS: ConcentrationTier[] = [
  {
    id: "ultra-high",
    label: "Ultra-High Grade Core",
    rangeLabel: "> 45% Mn",
    minPercent: 45,
    maxPercent: 55,
    color: "#b91c1c", // red-700
    textColor: "text-red-700",
    borderColor: "#991b1b",
    description: "Premium metallurgical and battery-grade direct shipping ore (DSO)",
    approxAreaKm2: 182,
  },
  {
    id: "high",
    label: "High Grade Deposit",
    rangeLabel: "35% – 45% Mn",
    minPercent: 35,
    maxPercent: 45,
    color: "#ea580c", // orange-600
    textColor: "text-orange-600",
    borderColor: "#c2410c",
    description: "High-grade commercial manganese zone suitable for ferro-alloy smelting",
    approxAreaKm2: 345,
  },
  {
    id: "medium",
    label: "Medium Grade Ore",
    rangeLabel: "25% – 35% Mn",
    minPercent: 25,
    maxPercent: 35,
    color: "#eab308", // yellow-500
    textColor: "text-yellow-700",
    borderColor: "#ca8a04",
    description: "Medium-grade mineralized zone requiring minimal beneficiation",
    approxAreaKm2: 430,
  },
  {
    id: "low",
    label: "Low Grade Mineralization",
    rangeLabel: "15% – 25% Mn",
    minPercent: 15,
    maxPercent: 25,
    color: "#84cc16", // lime-500
    textColor: "text-lime-700",
    borderColor: "#65a30d",
    description: "Low-grade halo zone; prospective for blending or intensive processing",
    approxAreaKm2: 375,
  },
  {
    id: "trace",
    label: "Trace / Peripheral Baseline",
    rangeLabel: "< 15% Mn",
    minPercent: 0,
    maxPercent: 15,
    color: "#15803d", // green-700
    textColor: "text-green-700",
    borderColor: "#166534",
    description: "Peripheral survey boundary with sub-economic manganese indications",
    approxAreaKm2: 248,
  },
]

export interface ManganeseZoneProperties {
  id: string
  zoneName: string
  tierId: string
  tierLabel: string
  rangeLabel: string
  averageMn: number
  minMn: number
  maxMn: number
  areaKm2: number
  confidence: number
  geologicalFormation: string
  primaryMineBelt: string
  color: string
}

export interface ManganeseZoneFeature {
  type: "Feature"
  properties: ManganeseZoneProperties
  geometry: {
    type: "Polygon"
    coordinates: number[][][]
  }
}

export interface ManganeseZoneFeatureCollection {
  type: "FeatureCollection"
  features: ManganeseZoneFeature[]
}

// Bounding box for the Balaghat-Ukwa-Tirodi-Malanjkhand exploration area
export const SURVEY_BOUNDS = {
  minLng: 79.98,
  maxLng: 80.42,
  minLat: 21.04,
  maxLat: 21.32,
}

export const manganeseZones: ManganeseZoneFeatureCollection = {
  type: "FeatureCollection",
  features: [
    // 1. ULTRA HIGH GRADE CORES (>45% Mn)
    {
      type: "Feature",
      properties: {
        id: "zone-uhg-tirodi",
        zoneName: "Tirodi Main Ultra-Grade Lens",
        tierId: "ultra-high",
        tierLabel: "Ultra-High Grade Core",
        rangeLabel: "> 45% Mn",
        averageMn: 51.5,
        minMn: 48,
        maxMn: 54,
        areaKm2: 58,
        confidence: 94,
        geologicalFormation: "Mansar Gondite Formation",
        primaryMineBelt: "Tirodi-Katangi Belt",
        color: "#b91c1c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.170, 21.165],
          [80.198, 21.168],
          [80.205, 21.188],
          [80.185, 21.196],
          [80.165, 21.182],
          [80.170, 21.165],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-uhg-ukwa",
        zoneName: "Ukwa Central High-Purity Seam",
        tierId: "ultra-high",
        tierLabel: "Ultra-High Grade Core",
        rangeLabel: "> 45% Mn",
        averageMn: 47.8,
        minMn: 45,
        maxMn: 50,
        areaKm2: 62,
        confidence: 92,
        geologicalFormation: "Sausar Metasedimentary Horizon",
        primaryMineBelt: "Ukwa-Bharweli Horizon",
        color: "#b91c1c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.138, 21.202],
          [80.165, 21.206],
          [80.172, 21.228],
          [80.145, 21.232],
          [80.132, 21.215],
          [80.138, 21.202],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-uhg-kumhari",
        zoneName: "Kumhari South Metallurgical Basin",
        tierId: "ultra-high",
        tierLabel: "Ultra-High Grade Core",
        rangeLabel: "> 45% Mn",
        averageMn: 47.2,
        minMn: 45,
        maxMn: 51,
        areaKm2: 62,
        confidence: 91,
        geologicalFormation: "Chorbaoli Quartzite Overthrust",
        primaryMineBelt: "Kumhari-Malanjkhand Eastern Ridge",
        color: "#b91c1c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.315, 21.072],
          [80.348, 21.078],
          [80.355, 21.112],
          [80.328, 21.118],
          [80.310, 21.095],
          [80.315, 21.072],
        ]],
      },
    },

    // 2. HIGH GRADE DEPOSITS (35% – 45% Mn)
    {
      type: "Feature",
      properties: {
        id: "zone-hg-balaghat-east",
        zoneName: "Balaghat East Ore Aureole",
        tierId: "high",
        tierLabel: "High Grade Deposit",
        rangeLabel: "35% – 45% Mn",
        averageMn: 42.1,
        minMn: 36,
        maxMn: 45,
        areaKm2: 95,
        confidence: 89,
        geologicalFormation: "Mansar Schist Band",
        primaryMineBelt: "Bharweli-Balaghat Corridor",
        color: "#ea580c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.210, 21.175],
          [80.260, 21.182],
          [80.268, 21.218],
          [80.225, 21.225],
          [80.198, 21.198],
          [80.210, 21.175],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-hg-kandri-gevra",
        zoneName: "Kandri South – Gevra Ridge Extension",
        tierId: "high",
        tierLabel: "High Grade Deposit",
        rangeLabel: "35% – 45% Mn",
        averageMn: 39.4,
        minMn: 35,
        maxMn: 44,
        areaKm2: 88,
        confidence: 89,
        geologicalFormation: "Bichua Crystalline Complex",
        primaryMineBelt: "Kandri-Mansar Axis",
        color: "#ea580c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.150, 21.128],
          [80.235, 21.138],
          [80.245, 21.170],
          [80.190, 21.168],
          [80.155, 21.152],
          [80.150, 21.128],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-hg-chikla-north",
        zoneName: "Chikla – Hatta Prospect Corridor",
        tierId: "high",
        tierLabel: "High Grade Deposit",
        rangeLabel: "35% – 45% Mn",
        averageMn: 36.8,
        minMn: 35,
        maxMn: 42,
        areaKm2: 82,
        confidence: 86,
        geologicalFormation: "Sausar Banded Manganese",
        primaryMineBelt: "Chikla Fault Trench",
        color: "#ea580c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.195, 21.220],
          [80.242, 21.228],
          [80.248, 21.278],
          [80.208, 21.282],
          [80.188, 21.248],
          [80.195, 21.220],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-hg-malanjkhand-core",
        zoneName: "Malanjkhand North-East Extension",
        tierId: "high",
        tierLabel: "High Grade Deposit",
        rangeLabel: "35% – 45% Mn",
        averageMn: 38.6,
        minMn: 35,
        maxMn: 45,
        areaKm2: 80,
        confidence: 88,
        geologicalFormation: "Granitoid Contact Metasomatic",
        primaryMineBelt: "Malanjkhand Mining Sector",
        color: "#ea580c",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.295, 21.115],
          [80.345, 21.122],
          [80.355, 21.198],
          [80.320, 21.205],
          [80.288, 21.145],
          [80.295, 21.115],
        ]],
      },
    },

    // 3. MEDIUM GRADE ORE (25% – 35% Mn)
    {
      type: "Feature",
      properties: {
        id: "zone-mg-central-belt",
        zoneName: "Balaghat-Tirodi Intermediate Ore Belt",
        tierId: "medium",
        tierLabel: "Medium Grade Ore",
        rangeLabel: "25% – 35% Mn",
        averageMn: 29.4,
        minMn: 25,
        maxMn: 35,
        areaKm2: 175,
        confidence: 84,
        geologicalFormation: "Tirodi Biotite Gneiss",
        primaryMineBelt: "Central MOIL Mineral Concession",
        color: "#eab308",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.110, 21.160],
          [80.220, 21.165],
          [80.240, 21.230],
          [80.160, 21.240],
          [80.105, 21.200],
          [80.110, 21.160],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-mg-lalbarra-ridge",
        zoneName: "Lalbarra Ridge – Rampaili Horizon",
        tierId: "medium",
        tierLabel: "Medium Grade Ore",
        rangeLabel: "25% – 35% Mn",
        averageMn: 27.8,
        minMn: 25,
        maxMn: 34,
        areaKm2: 130,
        confidence: 82,
        geologicalFormation: "Sitasaongi Quartzite",
        primaryMineBelt: "Western Flank Prospect",
        color: "#eab308",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.060, 21.180],
          [80.118, 21.185],
          [80.112, 21.265],
          [80.062, 21.268],
          [80.045, 21.225],
          [80.060, 21.180],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-mg-kukra-basin",
        zoneName: "Kukra Basin – Southern Foothills",
        tierId: "medium",
        tierLabel: "Medium Grade Ore",
        rangeLabel: "25% – 35% Mn",
        averageMn: 32.5,
        minMn: 26,
        maxMn: 35,
        areaKm2: 125,
        confidence: 85,
        geologicalFormation: "Kandri Syncline Structure",
        primaryMineBelt: "Southern Border Escarpment",
        color: "#eab308",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.220, 21.090],
          [80.290, 21.095],
          [80.285, 21.140],
          [80.230, 21.135],
          [80.205, 21.108],
          [80.220, 21.090],
        ]],
      },
    },

    // 4. LOW GRADE MINERALIZATION (15% – 25% Mn)
    {
      type: "Feature",
      properties: {
        id: "zone-lg-west-halo",
        zoneName: "Lalbarra West – Parsada Mineralized Halo",
        tierId: "low",
        tierLabel: "Low Grade Mineralization",
        rangeLabel: "15% – 25% Mn",
        averageMn: 18.2,
        minMn: 15,
        maxMn: 25,
        areaKm2: 180,
        confidence: 78,
        geologicalFormation: "Khadkodra Amphibolite Group",
        primaryMineBelt: "Western Frontier",
        color: "#84cc16",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.035, 21.130],
          [80.130, 21.135],
          [80.125, 21.275],
          [80.038, 21.270],
          [80.025, 21.190],
          [80.035, 21.130],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-lg-malanjkhand-flank",
        zoneName: "Malanjkhand Approach & Valley Buffer",
        tierId: "low",
        tierLabel: "Low Grade Mineralization",
        rangeLabel: "15% – 25% Mn",
        averageMn: 19.5,
        minMn: 15,
        maxMn: 24,
        areaKm2: 195,
        confidence: 80,
        geologicalFormation: "Palaeoproterozoic Calc-granulite",
        primaryMineBelt: "Eastern Exploration Quadrant",
        color: "#84cc16",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.260, 21.110],
          [80.365, 21.115],
          [80.370, 21.230],
          [80.280, 21.235],
          [80.255, 21.160],
          [80.260, 21.110],
        ]],
      },
    },

    // 5. TRACE / PERIPHERAL BASELINE (<15% Mn)
    {
      type: "Feature",
      properties: {
        id: "zone-tr-sitadongri-north",
        zoneName: "Sitadongri – North Ridge Exploration Boundary",
        tierId: "trace",
        tierLabel: "Trace / Peripheral Baseline",
        rangeLabel: "< 15% Mn",
        averageMn: 9.8,
        minMn: 3,
        maxMn: 15,
        areaKm2: 138,
        confidence: 72,
        geologicalFormation: "Basement Gneiss Envelope",
        primaryMineBelt: "Northern Ridge Buffer",
        color: "#15803d",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.080, 21.230],
          [80.300, 21.235],
          [80.320, 21.295],
          [80.085, 21.290],
          [80.070, 21.255],
          [80.080, 21.230],
        ]],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "zone-tr-south-boundary",
        zoneName: "Rampaili South – Parsada Perimeter Zone",
        tierId: "trace",
        tierLabel: "Trace / Peripheral Baseline",
        rangeLabel: "< 15% Mn",
        averageMn: 11.4,
        minMn: 4,
        maxMn: 15,
        areaKm2: 110,
        confidence: 74,
        geologicalFormation: "Basement Alluvium / Unclassified",
        primaryMineBelt: "Southern Concession Margin",
        color: "#15803d",
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [80.050, 21.070],
          [80.280, 21.072],
          [80.275, 21.120],
          [80.065, 21.115],
          [80.045, 21.090],
          [80.050, 21.070],
        ]],
      },
    },
  ],
}

/**
 * Returns summary statistics across all concentration percentage tiers.
 */
export function getAreaStatistics() {
  const totalSurveyedArea = CONCENTRATION_TIERS.reduce((sum, t) => sum + t.approxAreaKm2, 0)

  const tiersWithCoverage = CONCENTRATION_TIERS.map((tier) => {
    const matchingZones = manganeseZones.features.filter((f) => f.properties.tierId === tier.id)
    const areaKm2 = tier.approxAreaKm2
    const percentageOfTotal = Number(((areaKm2 / totalSurveyedArea) * 100).toFixed(1))
    return {
      ...tier,
      areaKm2,
      percentageOfTotal,
      zoneCount: matchingZones.length,
    }
  })

  return {
    totalAreaKm2: totalSurveyedArea,
    tiers: tiersWithCoverage,
    totalZones: manganeseZones.features.length,
  }
}

/**
 * Find which defined concentration zone contains a point (using ray casting).
 */
export function findZoneAtPoint(longitude: number, latitude: number): ManganeseZoneProperties | null {
  for (const feature of manganeseZones.features) {
    const ring = feature.geometry.coordinates[0]
    if (pointInPolygon([longitude, latitude], ring)) {
      return feature.properties
    }
  }
  return null
}

function pointInPolygon(point: [number, number], vs: number[][]): boolean {
  const x = point[0]
  const y = point[1]
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0]
    const yi = vs[i][1]
    const xj = vs[j][0]
    const yj = vs[j][1]
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

export interface AreaInterpolationResult {
  isWithinSurveyArea: boolean
  estimatedMnPercent: number
  estimatedConfidence: number
  tier: ConcentrationTier
  zone: ManganeseZoneProperties | null
  nearestLocation: ManganeseLocation
  distanceKm: number
}

/**
 * Spatial interpolation (Inverse Distance Weighting - IDW)
 * Predicts continuous manganese concentration % and geological confidence at any arbitrary coordinate.
 */
export function interpolateMnConcentration(longitude: number, latitude: number): AreaInterpolationResult {
  // Check if within broader survey bounds
  const isWithinSurveyArea =
    longitude >= SURVEY_BOUNDS.minLng &&
    longitude <= SURVEY_BOUNDS.maxLng &&
    latitude >= SURVEY_BOUNDS.minLat &&
    latitude <= SURVEY_BOUNDS.maxLat

  let sumWeights = 0
  let weightedMnSum = 0
  let weightedConfSum = 0

  let nearestLoc = locations[0]
  let minDistanceKm = Infinity

  // Power parameter for IDW (p=2 is standard)
  const power = 2

  for (const loc of locations) {
    // Approximate distance in km (1 deg lat ~ 111 km, 1 deg lon ~ 103 km at 21 deg N)
    const dx = (longitude - loc.longitude) * 103.5
    const dy = (latitude - loc.latitude) * 111.0
    const distanceKm = Math.hypot(dx, dy)

    if (distanceKm < minDistanceKm) {
      minDistanceKm = distanceKm
      nearestLoc = loc
    }

    if (distanceKm < 0.05) {
      // Extremely close to an exact sample station
      const tier = getTierForPercentage(loc.mnPercent)
      const zone = findZoneAtPoint(longitude, latitude)
      return {
        isWithinSurveyArea,
        estimatedMnPercent: loc.mnPercent,
        estimatedConfidence: loc.confidence,
        tier,
        zone,
        nearestLocation: loc,
        distanceKm: Number(distanceKm.toFixed(2)),
      }
    }

    const weight = 1 / Math.pow(distanceKm, power)
    sumWeights += weight
    weightedMnSum += loc.mnPercent * weight
    weightedConfSum += loc.confidence * weight
  }

  const rawMn = sumWeights > 0 ? weightedMnSum / sumWeights : 10
  const rawConf = sumWeights > 0 ? weightedConfSum / sumWeights : 65

  // Confidence decays slightly with distance from nearest ground control
  const distancePenalty = Math.min(25, minDistanceKm * 1.5)
  const adjustedConfidence = Math.max(50, Math.min(96, Math.round(rawConf - distancePenalty)))
  const estimatedMn = Number(Math.max(2, Math.min(75, rawMn)).toFixed(1))

  const tier = getTierForPercentage(estimatedMn)
  const zone = findZoneAtPoint(longitude, latitude)

  return {
    isWithinSurveyArea,
    estimatedMnPercent: estimatedMn,
    estimatedConfidence: adjustedConfidence,
    tier,
    zone,
    nearestLocation: nearestLoc,
    distanceKm: Number(minDistanceKm.toFixed(2)),
  }
}

export function getTierForPercentage(mnPercent: number): ConcentrationTier {
  for (const tier of CONCENTRATION_TIERS) {
    if (mnPercent >= tier.minPercent && (tier.id === "ultra-high" ? mnPercent <= 75 : mnPercent < tier.maxPercent)) {
      return tier
    }
  }
  return CONCENTRATION_TIERS[CONCENTRATION_TIERS.length - 1]
}

export interface TerrainConcentrationTier {
  id: string
  label: string
  rangeLabel: string
  minPercent: number
  maxPercent: number
  color: string
  rgb: [number, number, number]
  textColor: string
  description: string
  approxAreaKm2: number
  percentageOfTotal: number
}

export const TERRAIN_CONCENTRATION_TIERS: TerrainConcentrationTier[] = [
  {
    id: "terrain-red",
    label: "Core Metallurgical Seam",
    rangeLabel: "> 60% Mn",
    minPercent: 60,
    maxPercent: 100,
    color: "#dc2626", // Red
    rgb: [220, 38, 38],
    textColor: "text-red-600",
    description: "Ultra-high concentration deposit core (>60% Mn)",
    approxAreaKm2: 120,
    percentageOfTotal: 8.5,
  },
  {
    id: "terrain-orange",
    label: "High Grade Ore Body",
    rangeLabel: "30% – 60% Mn",
    minPercent: 30,
    maxPercent: 60,
    color: "#f97316", // Orange
    rgb: [249, 115, 22],
    textColor: "text-orange-600",
    description: "Commercial high-grade formation (30%–60% Mn)",
    approxAreaKm2: 440,
    percentageOfTotal: 31.0,
  },
  {
    id: "terrain-yellow",
    label: "Moderate Concentration",
    rangeLabel: "10% – 30% Mn",
    minPercent: 10,
    maxPercent: 30,
    color: "#eab308", // Yellow
    rgb: [234, 179, 8],
    textColor: "text-yellow-600",
    description: "Medium to low grade zone (10%–30% Mn)",
    approxAreaKm2: 490,
    percentageOfTotal: 34.5,
  },
  {
    id: "terrain-green",
    label: "Baseline / Country Rock",
    rangeLabel: "< 10% Mn",
    minPercent: 0,
    maxPercent: 10,
    color: "#22c55e", // Green
    rgb: [34, 197, 94],
    textColor: "text-green-600",
    description: "Sub-economic baseline & country rock (<10% Mn)",
    approxAreaKm2: 370,
    percentageOfTotal: 26.0,
  },
]

export function getTerrainTierForPercentage(mnPercent: number): TerrainConcentrationTier {
  if (mnPercent > 60) return TERRAIN_CONCENTRATION_TIERS[0]
  if (mnPercent >= 30) return TERRAIN_CONCENTRATION_TIERS[1]
  if (mnPercent >= 10) return TERRAIN_CONCENTRATION_TIERS[2]
  return TERRAIN_CONCENTRATION_TIERS[3]
}

/**
 * Generate dynamic raster image data URL representing the terrain color-coded by manganese concentration.
 * Thresholds:
 * - < 10%: Green [34, 197, 94]
 * - 10% - 30%: Yellow [234, 179, 8]
 * - 30% - 60%: Orange [249, 115, 22]
 * - > 60%: Red [220, 38, 38]
 */
export function generateTerrainRaster(
  activeLocations: ManganeseLocation[] = locations,
  smooth: boolean = false,
  width: number = 256,
  height: number = 256,
): string | null {
  if (typeof document === "undefined") return null

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  const imgData = ctx.createImageData(width, height)
  const data = imgData.data

  const { minLng, maxLng, minLat, maxLat } = SURVEY_BOUNDS
  const lngRange = maxLng - minLng
  const latRange = maxLat - minLat

  const power = 2

  for (let py = 0; py < height; py++) {
    const lat = maxLat - (py / (height - 1)) * latRange

    for (let px = 0; px < width; px++) {
      const lng = minLng + (px / (width - 1)) * lngRange
      const idx = (py * width + px) * 4

      let sumWeights = 0
      let weightedMnSum = 0
      let exactMn: number | null = null

      for (let i = 0; i < activeLocations.length; i++) {
        const loc = activeLocations[i]
        const dx = (lng - loc.longitude) * 103.5
        const dy = (lat - loc.latitude) * 111.0
        const distSq = dx * dx + dy * dy

        if (distSq < 0.0025) {
          exactMn = loc.mnPercent
          break
        }

        const weight = 1 / Math.pow(distSq, power / 2)
        sumWeights += weight
        weightedMnSum += loc.mnPercent * weight
      }

      const mn = exactMn !== null ? exactMn : sumWeights > 0 ? weightedMnSum / sumWeights : 8

      let r: number
      let g: number
      let b: number
      let a: number

      if (smooth) {
        if (mn < 10) {
          r = 34
          g = 197
          b = 94
          a = 195
        } else if (mn < 30) {
          const t = (mn - 10) / 20
          r = Math.round(34 + t * (234 - 34))
          g = Math.round(197 + t * (179 - 197))
          b = Math.round(94 + t * (8 - 94))
          a = 205
        } else if (mn <= 60) {
          const t = (mn - 30) / 30
          r = Math.round(234 + t * (249 - 234))
          g = Math.round(179 + t * (115 - 179))
          b = Math.round(8 + t * (22 - 8))
          a = 215
        } else {
          const t = Math.min(1, (mn - 60) / 10)
          r = Math.round(249 + t * (220 - 249))
          g = Math.round(115 + t * (38 - 115))
          b = Math.round(22 + t * (38 - 22))
          a = 230
        }
      } else {
        // Discrete Bands requested by user:
        // < 10% is Green, < 30% is Yellow, then Orange, > 60% is Red
        if (mn < 10) {
          r = 34
          g = 197
          b = 94
          a = 200 // Green
        } else if (mn < 30) {
          r = 234
          g = 179
          b = 8
          a = 205 // Yellow
        } else if (mn <= 60) {
          r = 249
          g = 115
          b = 22
          a = 215 // Orange
        } else {
          r = 220
          g = 38
          b = 38
          a = 230 // Red
        }
      }

      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = a
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL("image/png")
}

