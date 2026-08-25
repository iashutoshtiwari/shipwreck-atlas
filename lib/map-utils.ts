import type {
  VesselCategory,
  WreckEra,
  WreckFeature,
  WreckFeatureCollection,
  WreckFilters,
  WreckStatus,
} from '@/lib/types'
import Fuse from 'fuse.js'

const DEFAULT_EMPTY_COLLECTION: WreckFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

export const ERA_LABELS: Record<WreckEra, string> = {
  ancient: 'Ancient world',
  'age-of-sail': 'Age of sail',
  'industrial-age': 'Steam & steel',
  'world-wars': 'World wars',
  modern: 'Modern era',
}

export const CATEGORY_LABELS: Record<VesselCategory, string> = {
  passenger: 'Passenger',
  naval: 'Naval',
  merchant: 'Merchant',
  exploration: 'Exploration',
}

export const STATUS_LABELS: Record<WreckStatus, string> = {
  in_situ: 'Remains in situ',
  partial_remains: 'Partial remains',
  salvaged: 'Substantially salvaged',
  raised: 'Raised and preserved',
  destroyed: 'Destroyed or dispersed',
}

export function normalizeWreckFeatures(collection: WreckFeatureCollection): WreckFeatureCollection {
  if (
    !collection ||
    collection.type !== 'FeatureCollection' ||
    !Array.isArray(collection.features)
  ) {
    return DEFAULT_EMPTY_COLLECTION
  }

  return {
    type: 'FeatureCollection',
    features: collection.features.filter((feature) => {
      const [longitude, latitude] = feature.geometry?.coordinates ?? []

      return (
        feature.type === 'Feature' &&
        feature.geometry?.type === 'Point' &&
        Number.isFinite(longitude) &&
        Number.isFinite(latitude) &&
        longitude >= -180 &&
        longitude <= 180 &&
        latitude >= -90 &&
        latitude <= 90 &&
        Boolean(feature.properties?.id)
      )
    }),
  }
}

export function buildFuseIndex(features: WreckFeature[]): Fuse<WreckFeature> {
  return new Fuse(features, {
    threshold: 0.32,
    ignoreLocation: true,
    keys: [
      { name: 'properties.name', weight: 0.34 },
      { name: 'properties.location', weight: 0.16 },
      { name: 'properties.region', weight: 0.1 },
      { name: 'properties.year_lost', weight: 0.1 },
      { name: 'properties.cause', weight: 0.1 },
      { name: 'properties.vessel_type', weight: 0.1 },
      { name: 'properties.flag', weight: 0.1 },
    ],
  })
}

export function filterWrecks(
  features: WreckFeature[],
  index: Fuse<WreckFeature>,
  filters: WreckFilters,
): WreckFeature[] {
  const candidates = filters.query.trim()
    ? index.search(filters.query.trim()).map((result) => result.item)
    : [...features].sort((a, b) => b.properties.year_lost - a.properties.year_lost)

  return candidates.filter((feature) => {
    const matchesEra = filters.era === 'all' || feature.properties.era === filters.era
    const matchesCategory =
      filters.category === 'all' || feature.properties.vessel_category === filters.category

    return matchesEra && matchesCategory
  })
}

export function formatYear(year: number): string {
  return year < 0 ? `${Math.abs(year)} BCE` : year.toString()
}

export function formatMetric(value: number | null, unit: string): string {
  return value === null ? 'Unknown' : `${value.toLocaleString()} ${unit}`
}

export function toFeatureCollection(features: WreckFeature[]): WreckFeatureCollection {
  return { type: 'FeatureCollection', features }
}
