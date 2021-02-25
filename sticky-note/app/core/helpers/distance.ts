export type Coords = {
  lat: number
  lng: number
}

enum Bearing {
  NE = 45,
  SE = 135,
  SW = 225,
  NW = 315,
}

const toRadians = (x: number) => (x * Math.PI) / 180

const fromRadians = (x: number) => (x * 180) / Math.PI

export const coordsFromDistance = (
  { lat, lng }: Coords,
  distanceKm: number,
  bearing: Bearing
): Coords => {
  const R = 6378.1
  const bearingRads = toRadians(bearing)
  const latRads = toRadians(lat)
  const lngRads = toRadians(lng)

  const nextLatRads = Math.asin(
    Math.sin(latRads) * Math.cos(distanceKm / R) +
      Math.cos(latRads) * Math.sin(distanceKm / R) * Math.cos(bearingRads)
  )
  const nextLngRads =
    lngRads +
    Math.atan2(
      Math.sin(bearingRads) * Math.sin(distanceKm / R) * Math.cos(nextLatRads),
      Math.cos(distanceKm / R) - Math.sin(nextLatRads) * Math.sin(nextLatRads)
    )

  return {
    lat: fromRadians(nextLatRads),
    lng: fromRadians(nextLngRads),
  }
}

export const fiveKmBounds = (coords: Coords) => {
  const get = (bearing: Bearing) => coordsFromDistance(coords, 15, bearing)

  return {
    north: Math.max(get(Bearing.NE).lng, get(Bearing.NW).lng),
    south: Math.min(get(Bearing.SE).lng, get(Bearing.SW).lng),
    east: Math.max(get(Bearing.NE).lat, get(Bearing.SE).lat),
    west: Math.min(get(Bearing.NW).lat, get(Bearing.SW).lat),
  }
}
