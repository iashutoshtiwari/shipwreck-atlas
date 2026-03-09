import type { WreckFeature, WreckFeatureCollection } from '@/lib/types'
import Fuse from 'fuse.js'

const DEFAULT_EMPTY_COLLECTION: WreckFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
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
      return (
        feature.type === 'Feature' &&
        feature.geometry?.type === 'Point' &&
        Array.isArray(feature.geometry.coordinates) &&
        feature.geometry.coordinates.length === 2
      )
    }),
  }
}

export function buildFuseIndex(features: WreckFeature[]): Fuse<WreckFeature> {
  return new Fuse(features, {
    threshold: 0.35,
    includeScore: true,
    keys: [
      { name: 'properties.name', weight: 0.45 },
      { name: 'properties.year_lost', weight: 0.2 },
      { name: 'properties.cause', weight: 0.2 },
      { name: 'properties.type', weight: 0.15 },
    ],
  })
}

export function searchWrecks(index: Fuse<WreckFeature>, query: string): WreckFeature[] {
  return index.search(query).map((result) => result.item)
}

export type SimpleBounds = [[number, number], [number, number]]

export function createBoundsForFeatures(features: WreckFeature[]): SimpleBounds {
  let minLat = Infinity
  let minLng = Infinity
  let maxLat = -Infinity
  let maxLng = -Infinity

  features.forEach((feature) => {
    const [lng, lat] = feature.geometry.coordinates

    if (lat < minLat) minLat = lat
    if (lng < minLng) minLng = lng
    if (lat > maxLat) maxLat = lat
    if (lng > maxLng) maxLng = lng
  })

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ]
}
