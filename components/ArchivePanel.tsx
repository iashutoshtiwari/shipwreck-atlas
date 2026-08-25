'use client'

import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { WreckImage } from '@/components/WreckImage'
import { CATEGORY_LABELS, ERA_LABELS, formatYear } from '@/lib/map-utils'
import type {
  VesselCategory,
  WreckEra,
  WreckFeature,
  WreckFilters,
} from '@/lib/types'
import { VESSEL_CATEGORIES, WRECK_ERAS } from '@/lib/types'
import { Anchor, ChevronDown, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { memo, type CSSProperties } from 'react'

type ArchivePanelProps = {
  allWrecksCount: number
  filters: WreckFilters
  results: WreckFeature[]
  selectedId: string | null
  hoveredId: string | null
  mobileExpanded: boolean
  onFiltersChange: (filters: WreckFilters) => void
  onSelect: (wreck: WreckFeature) => void
  onHover: (id: string | null) => void
  onToggleMobile: () => void
}

export function ArchivePanel({
  allWrecksCount,
  filters,
  results,
  selectedId,
  hoveredId,
  mobileExpanded,
  onFiltersChange,
  onSelect,
  onHover,
  onToggleMobile,
}: ArchivePanelProps) {
  const hasFilters = Boolean(filters.query || filters.era !== 'all' || filters.category !== 'all')

  function resetFilters() {
    onFiltersChange({ query: '', era: 'all', category: 'all' })
  }

  return (
    <aside
      className='archive-panel'
      data-mobile-expanded={mobileExpanded}
      aria-label='Shipwreck archive'
    >
      <button
        type='button'
        className='mobile-panel-toggle'
        onClick={onToggleMobile}
        aria-expanded={mobileExpanded}
        aria-controls='archive-panel-content'
      >
        <span>
          <strong>{results.length}</strong> wrecks in view
        </span>
        <ChevronDown className='h-4 w-4' aria-hidden='true' />
      </button>

      <div id='archive-panel-content' className='archive-panel-content'>
        <div className='archive-tools'>
          <div>
            <p className='eyebrow'>The collection</p>
            <div className='mt-1 flex items-end justify-between gap-4'>
              <h2 className='font-serif text-[1.75rem] leading-none tracking-[-0.025em]'>Wreck index</h2>
              <p className='pb-0.5 text-xs text-muted-foreground' aria-live='polite'>
                {results.length} of {allWrecksCount}
              </p>
            </div>
          </div>

          <SearchBar
            value={filters.query}
            onChange={(query) => onFiltersChange({ ...filters, query })}
          />

          <div className='grid grid-cols-2 gap-2'>
            <label className='filter-field'>
              <span>Era</span>
              <select
                value={filters.era}
                onChange={(event) =>
                  onFiltersChange({ ...filters, era: event.target.value as WreckEra | 'all' })
                }
              >
                <option value='all'>All eras</option>
                {WRECK_ERAS.map((era) => (
                  <option key={era} value={era}>
                    {ERA_LABELS[era]}
                  </option>
                ))}
              </select>
            </label>
            <label className='filter-field'>
              <span>Vessel</span>
              <select
                value={filters.category}
                onChange={(event) =>
                  onFiltersChange({
                    ...filters,
                    category: event.target.value as VesselCategory | 'all',
                  })
                }
              >
                <option value='all'>All vessels</option>
                {VESSEL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {hasFilters ? (
            <Button
              type='button'
              variant='outline'
              size='default'
              onClick={resetFilters}
              className='h-9 w-full border-border bg-transparent text-xs text-muted-foreground hover:text-foreground'
            >
              <RotateCcw className='mr-2 h-3.5 w-3.5' aria-hidden='true' />
              Clear search and filters
            </Button>
          ) : null}
        </div>

        <div className='archive-results' role='region' aria-label='Matching shipwrecks'>
          {results.length ? (
            results.map((wreck, index) => (
              <WreckResult
                key={wreck.properties.id}
                wreck={wreck}
                index={index}
                active={selectedId === wreck.properties.id}
                hovered={hoveredId === wreck.properties.id}
                onSelect={onSelect}
                onHover={onHover}
              />
            ))
          ) : (
            <div className='archive-empty'>
              <Anchor className='h-5 w-5 text-primary' aria-hidden='true' />
              <p className='font-serif text-lg text-foreground'>No wrecks on this chart</p>
              <p className='text-xs leading-relaxed text-muted-foreground'>
                Try another term or clear the current filters.
              </p>
              <Button type='button' variant='outline' size='default' onClick={resetFilters}>
                Reset archive
              </Button>
            </div>
          )}
        </div>
        <footer className='archive-attribution'>
          <details className='archive-methodology'>
            <summary>About this archive</summary>
            <p>
              An independent hobby archive compiled from the named museums, archives, government
              agencies, and established references in each profile. Images link to their Wikimedia
              Commons credit and license pages. Last reviewed August 2026.
            </p>
            <div className='archive-methodology-links'>
              <Link href='/about'>Full project notes</Link>
              <a
                href='https://github.com/iashutoshtiwari/shipwreck-atlas'
                target='_blank'
                rel='noreferrer'
              >
                Source and corrections
              </a>
            </div>
          </details>
          <p>
            Cartography ©{' '}
            <a href='https://www.maptiler.com/copyright/' target='_blank' rel='noreferrer'>
              MapTiler
            </a>{' '}
            · Data ©{' '}
            <a href='https://www.openstreetmap.org/copyright' target='_blank' rel='noreferrer'>
              OpenStreetMap contributors
            </a>
          </p>
        </footer>
      </div>
    </aside>
  )
}

type WreckResultProps = {
  wreck: WreckFeature
  index: number
  active: boolean
  hovered: boolean
  onSelect: (wreck: WreckFeature) => void
  onHover: (id: string | null) => void
}

const WreckResult = memo(function WreckResult({
  wreck,
  index,
  active,
  hovered,
  onSelect,
  onHover,
}: WreckResultProps) {
  const { properties } = wreck

  return (
    <button
      type='button'
      className='wreck-result'
      data-active={active}
      data-hovered={hovered}
      aria-pressed={active}
      data-wreck-id={properties.id}
      style={{ '--result-index': Math.min(index, 10) } as CSSProperties}
      onClick={() => onSelect(wreck)}
      onMouseEnter={() => onHover(properties.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(properties.id)}
      onBlur={() => onHover(null)}
    >
      <span className='wreck-result-image'>
        <WreckImage image={properties.images[0]} sizes='72px' width={250} />
      </span>
      <span className='min-w-0 flex-1 text-left'>
        <span className='block truncate font-serif text-[1.05rem] leading-tight text-foreground'>
          {properties.name}
        </span>
        <span className='mt-1 block truncate text-[0.7rem] uppercase tracking-[0.11em] text-primary'>
          {formatYear(properties.year_lost)} · {CATEGORY_LABELS[properties.vessel_category]}
        </span>
        <span className='mt-1 block truncate text-xs text-muted-foreground'>
          {properties.location}
        </span>
      </span>
    </button>
  )
})
