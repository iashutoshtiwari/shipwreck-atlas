import { readFile } from 'node:fs/promises'

const fileUrl = new URL('../data/wrecks.geojson', import.meta.url)
const collection = JSON.parse(await readFile(fileUrl, 'utf8'))

const eras = new Set(['ancient', 'age-of-sail', 'industrial-age', 'world-wars', 'modern'])
const categories = new Set(['passenger', 'naval', 'merchant', 'exploration'])
const statuses = new Set(['in_situ', 'partial_remains', 'salvaged', 'raised', 'destroyed'])
const requiredStrings = [
  'id',
  'name',
  'loss_date',
  'location',
  'region',
  'flag',
  'vessel_type',
  'cause',
  'summary',
]

const errors = []
const ids = new Set()

if (collection.type !== 'FeatureCollection' || !Array.isArray(collection.features)) {
  errors.push('Root must be a GeoJSON FeatureCollection with a features array.')
} else {
  collection.features.forEach((feature, index) => {
    const label = feature?.properties?.name ?? `Feature ${index + 1}`
    const properties = feature?.properties ?? {}
    const coordinates = feature?.geometry?.coordinates

    if (feature?.type !== 'Feature' || feature?.geometry?.type !== 'Point') {
      errors.push(`${label}: must be a Point feature.`)
    }

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      errors.push(`${label}: coordinates must contain longitude and latitude.`)
    } else {
      const [longitude, latitude] = coordinates
      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        errors.push(`${label}: longitude is outside -180…180.`)
      }
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        errors.push(`${label}: latitude is outside -90…90.`)
      }
    }

    for (const key of requiredStrings) {
      if (typeof properties[key] !== 'string' || !properties[key].trim()) {
        errors.push(`${label}: ${key} must be a non-empty string.`)
      }
    }

    if (ids.has(properties.id)) errors.push(`${label}: duplicate id "${properties.id}".`)
    ids.add(properties.id)

    if (!Number.isInteger(properties.year_lost)) errors.push(`${label}: year_lost must be an integer.`)
    if (!eras.has(properties.era)) errors.push(`${label}: invalid era "${properties.era}".`)
    if (!categories.has(properties.vessel_category)) {
      errors.push(`${label}: invalid vessel_category "${properties.vessel_category}".`)
    }
    if (!statuses.has(properties.status)) errors.push(`${label}: invalid status "${properties.status}".`)

    for (const key of ['depth_m', 'lives_lost']) {
      const value = properties[key]
      if (value !== null && (!Number.isFinite(value) || value < 0)) {
        errors.push(`${label}: ${key} must be null or a non-negative number.`)
      }
    }

    if (!Array.isArray(properties.images) || properties.images.length === 0) {
      errors.push(`${label}: requires at least one image.`)
    } else {
      properties.images.forEach((image, imageIndex) => {
        for (const key of ['src', 'alt', 'credit', 'license', 'source_url']) {
          if (typeof image[key] !== 'string' || !image[key].trim()) {
            errors.push(`${label}: image ${imageIndex + 1} is missing ${key}.`)
          }
        }
      })
    }

    if (!Array.isArray(properties.sources) || properties.sources.length === 0) {
      errors.push(`${label}: requires at least one source.`)
    } else {
      properties.sources.forEach((source, sourceIndex) => {
        if (!source.label || !source.url) {
          errors.push(`${label}: source ${sourceIndex + 1} requires label and url.`)
        }
      })
    }
  })
}

if (collection.features?.length !== 24) {
  errors.push(`Expected 24 wrecks, found ${collection.features?.length ?? 0}.`)
}

if (errors.length) {
  console.error(`Shipwreck data validation failed with ${errors.length} error(s):`)
  errors.forEach((error) => console.error(`- ${error}`))
  process.exit(1)
}

console.log(`Validated ${collection.features.length} shipwreck records.`)
