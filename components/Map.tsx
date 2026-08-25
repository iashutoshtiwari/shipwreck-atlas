'use client'

import '@maptiler/sdk/dist/maptiler-sdk.css'

import type { WreckFeature } from '@/lib/types'
import * as maptilersdk from '@maptiler/sdk'
import type { ExpressionSpecification } from '@maptiler/sdk'
import { KeyRound, RotateCcw, TriangleAlert } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

type MapProps = {
  wrecks: WreckFeature[]
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

const SOURCE_ID = 'shipwrecks'
const CLUSTERS_LAYER = 'wreck-clusters'
const CLUSTER_COUNT_LAYER = 'wreck-cluster-count'
const POINTS_LAYER = 'wreck-points'
const WORLD_BOUNDS: maptilersdk.LngLatBoundsLike = [
  [-170, -72],
  [170, 75],
]

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function layerStateExpression(
  selectedId: string | null,
  hoveredId: string | null,
): ExpressionSpecification {
  return [
    'case',
    ['==', ['get', 'id'], selectedId ?? ''],
    10,
    ['==', ['get', 'id'], hoveredId ?? ''],
    8,
    6,
  ]
}

function layerColorExpression(selectedId: string | null): ExpressionSpecification {
  return ['case', ['==', ['get', 'id'], selectedId ?? ''], '#f3e4c7', '#bc8b55']
}

export function Map({ wrecks, selectedId, hoveredId, onSelect, onHover }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maptilersdk.Map | null>(null)
  const popupRef = useRef<maptilersdk.Popup | null>(null)
  const wrecksRef = useRef(wrecks)
  const previousSelectedIdRef = useRef<string | null>(null)
  const onSelectRef = useRef(onSelect)
  const onHoverRef = useRef(onHover)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)
  const apiKey = process.env.NEXT_PUBLIC_MAPTILER_KEY

  useEffect(() => {
    onSelectRef.current = onSelect
    onHoverRef.current = onHover
  }, [onHover, onSelect])

  useEffect(() => {
    wrecksRef.current = wrecks
  }, [wrecks])

  useEffect(() => {
    if (!apiKey || !mapContainerRef.current || mapRef.current) return

    maptilersdk.config.apiKey = apiKey
    const map = new maptilersdk.Map({
      container: mapContainerRef.current,
      style: maptilersdk.MapStyle.OCEAN.DARK,
      center: [8, 22],
      zoom: 1.25,
      minZoom: 1,
      maxZoom: 13,
      maxPitch: 0,
      renderWorldCopies: true,
      navigationControl: 'top-right',
      geolocateControl: false,
      terrainControl: false,
      scaleControl: 'bottom-right',
      maptilerLogo: true,
      attributionControl: { compact: 'auto' },
    })

    mapRef.current = map

    map.on('load', () => {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: wrecks },
        cluster: true,
        clusterMaxZoom: 7,
        clusterRadius: 52,
      })

      map.addLayer({
        id: CLUSTERS_LAYER,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#9a7149',
          'circle-radius': ['step', ['get', 'point_count'], 17, 5, 20, 10, 24],
          'circle-stroke-color': 'rgba(247, 232, 204, 0.82)',
          'circle-stroke-width': 1,
          'circle-opacity': 0.92,
        },
      })

      map.addLayer({
        id: CLUSTER_COUNT_LAYER,
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-size': 11,
        },
        paint: {
          'text-color': '#07151c',
        },
      })

      map.addLayer({
        id: POINTS_LAYER,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': layerColorExpression(selectedId),
          'circle-radius': layerStateExpression(selectedId, hoveredId),
          'circle-stroke-color': '#f3e4c7',
          'circle-stroke-width': ['case', ['==', ['get', 'id'], selectedId ?? ''], 3, 1.5],
          'circle-opacity': 0.96,
          'circle-radius-transition': {
            duration: prefersReducedMotion() ? 0 : 180,
            delay: 0,
          },
          'circle-color-transition': {
            duration: prefersReducedMotion() ? 0 : 180,
            delay: 0,
          },
          'circle-stroke-width-transition': {
            duration: prefersReducedMotion() ? 0 : 180,
            delay: 0,
          },
        },
      })

      map.on('click', CLUSTERS_LAYER, async (event) => {
        const feature = map.queryRenderedFeatures(event.point, { layers: [CLUSTERS_LAYER] })[0]
        const clusterId = feature?.properties?.cluster_id
        const source = map.getSource(SOURCE_ID) as maptilersdk.GeoJSONSource | undefined

        if (!source || clusterId === undefined || feature.geometry.type !== 'Point') return

        const zoom = await source.getClusterExpansionZoom(Number(clusterId))
        map.easeTo({
          center: feature.geometry.coordinates as [number, number],
          zoom,
          duration: prefersReducedMotion() ? 0 : 650,
        })
      })

      map.on('click', POINTS_LAYER, (event) => {
        const id = event.features?.[0]?.properties?.id
        if (typeof id === 'string') onSelectRef.current(id)
      })

      map.on('mouseenter', CLUSTERS_LAYER, () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', CLUSTERS_LAYER, () => {
        map.getCanvas().style.cursor = ''
      })

      map.on('mouseenter', POINTS_LAYER, (event) => {
        map.getCanvas().style.cursor = 'pointer'
        const feature = event.features?.[0]
        const id = feature?.properties?.id
        const name = feature?.properties?.name

        if (typeof id === 'string') onHoverRef.current(id)
        if (feature?.geometry.type === 'Point' && typeof name === 'string') {
          popupRef.current?.remove()
          popupRef.current = new maptilersdk.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 12,
            className: 'wreck-map-tooltip',
          })
            .setLngLat(feature.geometry.coordinates as [number, number])
            .setText(name)
            .addTo(map)
        }
      })

      map.on('mouseleave', POINTS_LAYER, () => {
        map.getCanvas().style.cursor = ''
        onHoverRef.current(null)
        popupRef.current?.remove()
      })

      setMapLoaded(true)
    })

    map.on('error', () => {
      if (!map.isStyleLoaded()) setMapError(true)
    })

    return () => {
      popupRef.current?.remove()
      map.remove()
      mapRef.current = null
    }
    // Map initialization deliberately runs only when the public API key changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey])

  useEffect(() => {
    const map = mapRef.current
    if (!mapLoaded || !map) return

    const source = map.getSource(SOURCE_ID) as maptilersdk.GeoJSONSource | undefined
    source?.setData({ type: 'FeatureCollection', features: wrecks })
  }, [mapLoaded, wrecks])

  useEffect(() => {
    const map = mapRef.current
    if (!mapLoaded || !map || !map.getLayer(POINTS_LAYER)) return

    map.setPaintProperty(
      POINTS_LAYER,
      'circle-radius',
      layerStateExpression(selectedId, hoveredId),
    )
    map.setPaintProperty(POINTS_LAYER, 'circle-color', layerColorExpression(selectedId))
    map.setPaintProperty(POINTS_LAYER, 'circle-stroke-width', [
      'case',
      ['==', ['get', 'id'], selectedId ?? ''],
      3,
      1.5,
    ])
  }, [hoveredId, mapLoaded, selectedId])

  useEffect(() => {
    const map = mapRef.current
    if (!mapLoaded || !map) return

    const previousSelectedId = previousSelectedIdRef.current
    previousSelectedIdRef.current = selectedId

    if (!selectedId) {
      if (previousSelectedId) {
        map.easeTo({
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          duration: prefersReducedMotion() ? 0 : 480,
        })
      }
      return
    }

    const wreck = wrecksRef.current.find((feature) => feature.properties.id === selectedId)
    if (!wreck) return

    const rightPadding = window.innerWidth >= 1024 ? 430 : 0

    map.easeTo({
      center: wreck.geometry.coordinates,
      zoom: Math.max(map.getZoom(), 4.4),
      padding: { top: 40, right: rightPadding, bottom: 40, left: 0 },
      duration: prefersReducedMotion() ? 0 : 760,
    })
  }, [mapLoaded, selectedId])

  const resetMap = useCallback(() => {
    const map = mapRef.current
    if (!map) return

    map.fitBounds(WORLD_BOUNDS, {
      padding: 40,
      duration: prefersReducedMotion() ? 0 : 650,
    })
  }, [])

  if (!apiKey) {
    return (
      <div className='map-setup-state'>
        <span className='map-state-icon'>
          <KeyRound className='h-5 w-5' aria-hidden='true' />
        </span>
        <p className='font-serif text-2xl'>Map key required</p>
        <p>
          Add <code>NEXT_PUBLIC_MAPTILER_KEY</code> to <code>.env.local</code>, then restart the
          development server. The archive remains fully browsable without it.
        </p>
        <a href='https://cloud.maptiler.com/account/keys/' target='_blank' rel='noreferrer'>
          Open MapTiler keys
        </a>
      </div>
    )
  }

  return (
    <>
      <div ref={mapContainerRef} className={`ocean-map${mapLoaded ? ' is-loaded' : ''}`} />
      <button type='button' className='map-reset-button' onClick={resetMap} aria-label='Reset world view'>
        <RotateCcw className='h-4 w-4' aria-hidden='true' />
      </button>
      {mapError ? (
        <div className='map-error' role='status'>
          <TriangleAlert className='h-4 w-4' aria-hidden='true' />
          The ocean chart could not finish loading. Check the MapTiler key and network connection.
        </div>
      ) : null}
    </>
  )
}
