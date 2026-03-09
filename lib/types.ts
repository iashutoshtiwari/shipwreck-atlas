export type WreckProperties = {
  name: string
  year_lost: number
  type: string
  cause: string
  depth_m: number
  summary: string
  images: string[]
  sources: string[]
}

export type WreckFeature = {
  type: 'Feature'
  properties: WreckProperties
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

export type WreckFeatureCollection = {
  type: 'FeatureCollection'
  features: WreckFeature[]
}
