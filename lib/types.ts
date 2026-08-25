export const WRECK_ERAS = [
  'ancient',
  'age-of-sail',
  'industrial-age',
  'world-wars',
  'modern',
] as const

export const VESSEL_CATEGORIES = [
  'passenger',
  'naval',
  'merchant',
  'exploration',
] as const

export const WRECK_STATUSES = [
  'in_situ',
  'partial_remains',
  'salvaged',
  'raised',
  'destroyed',
] as const

export type WreckEra = (typeof WRECK_ERAS)[number]
export type VesselCategory = (typeof VESSEL_CATEGORIES)[number]
export type WreckStatus = (typeof WRECK_STATUSES)[number]

export type WreckImage = {
  src: string
  alt: string
  credit: string
  license: string
  source_url: string
}

export type WreckSource = {
  label: string
  url: string
}

export type WreckProperties = {
  id: string
  name: string
  year_lost: number
  loss_date: string
  era: WreckEra
  location: string
  region: string
  flag: string
  vessel_category: VesselCategory
  vessel_type: string
  cause: string
  depth_m: number | null
  lives_lost: number | null
  status: WreckStatus
  summary: string
  images: WreckImage[]
  sources: WreckSource[]
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

export type WreckFilters = {
  query: string
  era: WreckEra | 'all'
  category: VesselCategory | 'all'
}
