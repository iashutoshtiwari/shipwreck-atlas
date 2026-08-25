'use client'

import { ArchivePanel } from '@/components/ArchivePanel'
import { WreckDetails } from '@/components/WreckDetails'
import rawWrecks from '@/data/wrecks.geojson'
import { buildFuseIndex, filterWrecks, normalizeWreckFeatures } from '@/lib/map-utils'
import type { WreckFeature, WreckFeatureCollection, WreckFilters } from '@/lib/types'
import { Anchor, ListFilter, MapPin } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'

const OceanMap = dynamic(() => import('@/components/Map').then((module) => module.Map), {
  ssr: false,
  loading: () => (
    <div className='map-loading' aria-label='Loading ocean map'>
      <span className='map-loading-ring' />
      <span>Drawing ocean chart…</span>
    </div>
  ),
})

const wreckCollection = normalizeWreckFeatures(rawWrecks as WreckFeatureCollection)
const wrecksById = new Map(
  wreckCollection.features.map((wreck) => [wreck.properties.id, wreck]),
)
const wreckSearchIndex = buildFuseIndex(wreckCollection.features)

export function AtlasApp() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedSlug = searchParams.get('wreck')
  const [filters, setFilters] = useState<WreckFilters>({
    query: '',
    era: 'all',
    category: 'all',
  })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const focusReturnIdRef = useRef<string | null>(null)
  const deferredFilters = useDeferredValue(filters)

  const filteredWrecks = useMemo(
    () => filterWrecks(wreckCollection.features, wreckSearchIndex, deferredFilters),
    [deferredFilters],
  )
  const selectedWreck = selectedSlug ? wrecksById.get(selectedSlug) ?? null : null

  useEffect(() => {
    if (selectedSlug && !wrecksById.has(selectedSlug)) {
      router.replace('/', { scroll: false })
    }
  }, [router, selectedSlug])

  useEffect(() => {
    if (selectedWreck || !focusReturnIdRef.current) return

    const closingId = focusReturnIdRef.current
    focusReturnIdRef.current = null
    const frame = window.requestAnimationFrame(() => {
      const result = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-wreck-id]')).find(
        (element) => element.dataset.wreckId === closingId,
      )
      result?.focus()
    })

    return () => window.cancelAnimationFrame(frame)
  }, [selectedWreck])

  const selectWreck = useCallback(
    (wreck: WreckFeature) => {
      router.replace(`/?wreck=${encodeURIComponent(wreck.properties.id)}`, { scroll: false })
      setMobileExpanded(false)
    },
    [router, setMobileExpanded],
  )

  const closeDetails = useCallback(() => {
    focusReturnIdRef.current = selectedSlug
    router.replace('/', { scroll: false })
    setMobileExpanded(true)
  }, [router, selectedSlug, setMobileExpanded])

  const selectWreckById = useCallback(
    (id: string) => {
      const wreck = wrecksById.get(id)
      if (wreck) selectWreck(wreck)
    },
    [selectWreck],
  )

  return (
    <div className='atlas-shell' data-has-selection={Boolean(selectedWreck)}>
      <header className='atlas-header'>
        <Link href='/' className='brand-home-link' aria-label='Shipwreck Atlas home'>
          <span className='brand-mark' aria-hidden='true'>
            <Anchor className='h-4 w-4' />
          </span>
          <span className='min-w-0'>
            <span className='eyebrow hidden sm:block'>A maritime archive</span>
            <h1 className='brand-title truncate font-serif text-[1.55rem] leading-none tracking-[-0.035em] sm:text-[1.7rem]'>
              Shipwreck Atlas
            </h1>
          </span>
        </Link>
        <div className='header-rule' />
        <p className='hidden items-center gap-2 text-xs text-muted-foreground md:flex'>
          <MapPin className='h-3.5 w-3.5 text-primary' aria-hidden='true' />
          24 sites · c. 65 BCE—1994
        </p>
        <Link href='/about' className='header-about-link'>
          About
        </Link>
        <button
          type='button'
          className='header-archive-button'
          onClick={() => setMobileExpanded((value) => !value)}
          aria-label={mobileExpanded ? 'Close shipwreck archive' : 'Open shipwreck archive'}
          aria-expanded={mobileExpanded}
        >
          <ListFilter className='h-4 w-4' aria-hidden='true' />
          Archive
        </button>
      </header>

      <div className='atlas-workspace'>
        <ArchivePanel
          allWrecksCount={wreckCollection.features.length}
          filters={filters}
          results={filteredWrecks}
          selectedId={selectedWreck?.properties.id ?? null}
          hoveredId={hoveredId}
          mobileExpanded={mobileExpanded}
          onFiltersChange={setFilters}
          onSelect={selectWreck}
          onHover={setHoveredId}
          onToggleMobile={() => setMobileExpanded((value) => !value)}
        />

        <main className='map-stage' aria-label='Interactive map of shipwrecks'>
          <OceanMap
            wrecks={filteredWrecks}
            selectedId={selectedWreck?.properties.id ?? null}
            hoveredId={hoveredId}
            onSelect={selectWreckById}
            onHover={setHoveredId}
          />
          <div className='map-legend' aria-hidden='true'>
            <span className='legend-marker' />
            <span>Historic wreck site</span>
          </div>
        </main>

        {selectedWreck ? (
          <WreckDetails
            key={selectedWreck.properties.id}
            wreck={selectedWreck}
            onClose={closeDetails}
          />
        ) : null}
      </div>
    </div>
  )
}
