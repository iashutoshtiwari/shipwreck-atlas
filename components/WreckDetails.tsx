'use client'

import { Button } from '@/components/ui/button'
import { WreckImage } from '@/components/WreckImage'
import { CATEGORY_LABELS, STATUS_LABELS, formatMetric } from '@/lib/map-utils'
import type { WreckFeature } from '@/lib/types'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Flag,
  Gauge,
  MapPin,
  Ship,
  Users,
  X,
} from 'lucide-react'
import { memo, useEffect, useRef, useState } from 'react'

type WreckDetailsProps = {
  wreck: WreckFeature
  onClose: () => void
}

function WreckDetailsComponent({ wreck, onClose }: WreckDetailsProps) {
  const { properties } = wreck
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const activeImage = properties.images[activeImageIndex]

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    closeButtonRef.current?.focus()
  }, [properties.id])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsClosing(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (!isClosing) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(onClose, reducedMotion ? 0 : 800)

    return () => window.clearTimeout(timeout)
  }, [isClosing, onClose])

  function showPreviousImage() {
    setActiveImageIndex((index) =>
      index === 0 ? properties.images.length - 1 : index - 1,
    )
  }

  function showNextImage() {
    setActiveImageIndex((index) => (index + 1) % properties.images.length)
  }

  return (
    <div
      className='wreck-details'
      data-closing={isClosing}
      role='dialog'
      aria-labelledby={`wreck-title-${properties.id}`}
      onAnimationEnd={(event) => {
        if (isClosing && event.currentTarget === event.target) onClose()
      }}
    >
      <div ref={scrollRef} className='wreck-details-scroll'>
        <div className='detail-hero'>
          <WreckImage
            key={activeImage.src}
            image={activeImage}
            sizes='(max-width: 1023px) 100vw, 420px'
            preload
            width={960}
            className='detail-hero-image'
          />
          <div className='detail-hero-shade' />
          <Button
            ref={closeButtonRef}
            type='button'
            variant='outline'
            size='icon'
            onClick={() => setIsClosing(true)}
            disabled={isClosing}
            className='detail-close'
            aria-label='Close wreck profile'
          >
            <X className='h-4 w-4' aria-hidden='true' />
          </Button>

          {properties.images.length > 1 ? (
            <div className='gallery-controls' role='group' aria-label='Image gallery controls'>
              <button type='button' onClick={showPreviousImage} aria-label='Previous image'>
                <ChevronLeft className='h-4 w-4' aria-hidden='true' />
              </button>
              <span aria-live='polite'>
                {activeImageIndex + 1} / {properties.images.length}
              </span>
              <button type='button' onClick={showNextImage} aria-label='Next image'>
                <ChevronRight className='h-4 w-4' aria-hidden='true' />
              </button>
            </div>
          ) : null}
        </div>

        <div className='image-credit'>
          <span>{activeImage.credit}</span>
          <a href={activeImage.source_url} target='_blank' rel='noreferrer'>
            {activeImage.license}
            <ExternalLink className='h-3 w-3' aria-hidden='true' />
          </a>
        </div>

        <article className='detail-content detail-reveal'>
          <header>
            <p className='eyebrow'>{STATUS_LABELS[properties.status]}</p>
            <h2
              id={`wreck-title-${properties.id}`}
              className='mt-2 font-serif text-[2.15rem] leading-[0.96] tracking-[-0.035em]'
            >
              {properties.name}
            </h2>
            <p className='mt-3 flex items-start gap-2 text-sm text-muted-foreground'>
              <MapPin className='mt-0.5 h-3.5 w-3.5 shrink-0 text-primary' aria-hidden='true' />
              {properties.location} · {properties.region}
            </p>
          </header>

          <div className='detail-rule' />

          <dl className='wreck-facts'>
            <Fact icon={CalendarDays} label='Lost' value={properties.loss_date} />
            <Fact
              icon={Ship}
              label='Vessel'
              value={`${CATEGORY_LABELS[properties.vessel_category]} · ${properties.vessel_type}`}
            />
            <Fact icon={Flag} label='Flag' value={properties.flag} />
            <Fact icon={Gauge} label='Depth' value={formatMetric(properties.depth_m, 'm')} />
            <Fact
              icon={Users}
              label='Lives lost'
              value={
                properties.lives_lost === null
                  ? 'Unknown'
                  : properties.lives_lost === 0
                    ? 'None recorded'
                    : properties.lives_lost.toLocaleString()
              }
            />
          </dl>

          <section className='detail-section'>
            <p className='detail-label'>The loss</p>
            <p className='text-sm font-medium leading-relaxed text-foreground/90'>{properties.cause}</p>
          </section>

          <section className='detail-section'>
            <p className='detail-label'>Historical note</p>
            <p className='font-serif text-[1.08rem] leading-[1.65] text-foreground/85'>
              {properties.summary}
            </p>
          </section>

          <section className='detail-section pb-8'>
            <p className='detail-label'>References</p>
            <ul className='source-list'>
              {properties.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target='_blank' rel='noreferrer'>
                    <span>{source.label}</span>
                    <ExternalLink className='h-3.5 w-3.5 shrink-0' aria-hidden='true' />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </div>
  )
}

export const WreckDetails = memo(WreckDetailsComponent)

type FactProps = {
  icon: typeof CalendarDays
  label: string
  value: string
}

function Fact({ icon: Icon, label, value }: FactProps) {
  return (
    <div>
      <dt>
        <Icon className='h-3.5 w-3.5 text-primary' aria-hidden='true' />
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  )
}
