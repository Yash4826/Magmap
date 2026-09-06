export interface ManganeseLocation {
  id: number
  locationName: string
  mnPercent: number
  confidence: number
  potential: "Very Low" | "Low" | "Moderate" | "High" | "Very High"
  source: string
  latitude: number
  longitude: number
}

export interface ManganeseFeatureCollection {
  type: "FeatureCollection"
  features: Array<{
    type: "Feature"
    properties: Omit<ManganeseLocation, "latitude" | "longitude">
    geometry: {
      type: "Point"
      coordinates: [number, number]
    }
  }>
}

const point = (
  id: number,
  locationName: string,
  longitude: number,
  latitude: number,
  mnPercent: number,
  confidence: number,
  potential: ManganeseLocation["potential"],
  source: string,
) => ({
  type: "Feature" as const,
  properties: { id, locationName, mnPercent, confidence, potential, source },
  geometry: { type: "Point" as const, coordinates: [longitude, latitude] as [number, number] },
})

export const manganesePoints: ManganeseFeatureCollection = {
  type: "FeatureCollection",
  features: [
    point(1, "Balaghat North Ridge", 80.105, 21.236, 8, 74, "Low", "Ground Samples"),
    point(2, "Ukwa West", 80.126, 21.245, 12, 78, "Low", "Satellite"),
    point(3, "Ukwa Zone A", 80.1548, 21.1852, 18, 91, "Moderate", "Borehole Data"),
    point(4, "Balaghat Zone A", 80.120, 21.183, 22, 82, "Moderate", "Ground Samples"),
    point(5, "Tirodi East", 80.178, 21.214, 26, 84, "Moderate", "Ground Samples"),
    point(6, "Chikla Prospect", 80.207, 21.231, 30, 86, "High", "Satellite"),
    point(7, "Mine Zone C", 80.200, 21.100, 34, 91, "High", "Borehole Data"),
    point(8, "Kandri South", 80.164, 21.143, 38, 88, "High", "Ground Samples"),
    point(9, "Gevra Ridge", 80.226, 21.158, 42, 90, "High", "Satellite"),
    point(10, "Ukwa Central", 80.151, 21.212, 45, 92, "Very High", "Borehole Data"),
    point(11, "Balaghat East", 80.246, 21.198, 48, 89, "Very High", "Ground Samples"),
    point(12, "Tirodi Main", 80.185, 21.175, 52, 94, "Very High", "Borehole Data"),
    point(13, "Kandri North", 80.138, 21.274, 15, 79, "Low", "Satellite"),
    point(14, "Sitadongri", 80.275, 21.224, 5, 69, "Very Low", "Ground Samples"),
    point(15, "Malanjkhand Approach", 80.292, 21.151, 20, 81, "Moderate", "Satellite"),
    point(16, "Malanjkhand Core", 80.316, 21.128, 34, 87, "High", "Borehole Data"),
    point(17, "Parsada Valley", 80.082, 21.151, 10, 72, "Low", "Ground Samples"),
    point(18, "Rampaili South", 80.111, 21.091, 15, 76, "Low", "Satellite"),
    point(19, "Lalbarra West", 80.050, 21.207, 18, 80, "Moderate", "Ground Samples"),
    point(20, "Lalbarra Ridge", 80.078, 21.256, 26, 83, "Moderate", "Borehole Data"),
    point(21, "Hatta Prospect", 80.224, 21.267, 30, 85, "High", "Satellite"),
    point(22, "Kukra Pit", 80.257, 21.118, 38, 88, "High", "Ground Samples"),
    point(23, "Kumhari North", 80.341, 21.188, 45, 90, "Very High", "Borehole Data"),
    point(24, "Kumhari South", 80.329, 21.084, 48, 93, "Very High", "Ground Samples"),
  ],
}

export const locations: ManganeseLocation[] = manganesePoints.features.map(({ properties, geometry }) => ({
  ...properties,
  longitude: geometry.coordinates[0],
  latitude: geometry.coordinates[1],
}))
