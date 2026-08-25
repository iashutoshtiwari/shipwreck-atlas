import { AtlasApp } from '@/components/AtlasApp'
import rawWrecks from '@/data/wrecks.geojson'
import { formatYear } from '@/lib/map-utils'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import type { WreckFeatureCollection } from '@/lib/types'
import { Anchor, Compass } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

const wrecks = [...(rawWrecks as WreckFeatureCollection).features].sort(
  (first, second) => second.properties.year_lost - first.properties.year_lost,
)

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en',
    },
    {
      '@type': 'Dataset',
      '@id': `${SITE_URL}/#shipwreck-dataset`,
      name: 'Shipwreck Atlas historical wreck collection',
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      spatialCoverage: 'Worldwide',
      temporalCoverage: '-0065/1994',
      isAccessibleForFree: true,
      variableMeasured: [
        'loss date',
        'location',
        'vessel category',
        'cause of loss',
        'depth',
        'lives lost',
        'wreck status',
      ],
      keywords: [
        'shipwrecks',
        'maritime history',
        'underwater archaeology',
        'historic vessels',
      ],
    },
  ],
}

function AtlasFallback() {
  return (
    <main className='seo-atlas-fallback'>
      <header className='seo-fallback-header'>
        <span className='brand-mark' aria-hidden='true'>
          <Anchor className='h-4 w-4' />
        </span>
        <span>
          <span className='eyebrow'>A maritime archive</span>
          <span className='seo-fallback-brand'>Shipwreck Atlas</span>
        </span>
        <Link href='/about' className='seo-about-link'>
          About
        </Link>
        <span className='seo-loading-note' role='status'>
          <Compass className='h-4 w-4 animate-spin motion-reduce:animate-none' aria-hidden='true' />
          Drawing interactive chart…
        </span>
      </header>

      <section className='seo-fallback-intro' aria-labelledby='atlas-introduction'>
        <p className='eyebrow'>Twenty-four sites · two millennia</p>
        <h1 id='atlas-introduction'>Explore the world’s defining shipwrecks</h1>
        <p>{SITE_DESCRIPTION}</p>
        <p className='seo-method-note'>
          This independent hobby archive compiles dates, locations, loss details, and present-day
          status from the named museums, archives, government agencies, and established references
          listed with every profile. Images link to their Wikimedia Commons credit and license pages.
        </p>
      </section>

      <section className='seo-wreck-index' aria-labelledby='static-wreck-index'>
        <div className='seo-index-heading'>
          <div>
            <p className='eyebrow'>The collection</p>
            <h2 id='static-wreck-index'>Historic wreck index</h2>
          </div>
          <span>{wrecks.length} records</span>
        </div>

        <div className='seo-wreck-grid'>
          {wrecks.map(({ properties }) => (
            <article key={properties.id} id={`wreck-${properties.id}`} className='seo-wreck-card'>
              <header>
                <p>
                  {formatYear(properties.year_lost)} · {properties.vessel_type}
                </p>
                <h3>{properties.name}</h3>
                <span>
                  {properties.location} · {properties.region}
                </span>
              </header>
              <p>{properties.summary}</p>
              <footer>
                <span>Sources</span>
                {properties.sources.map((source) => (
                  <a key={source.url} href={source.url} target='_blank' rel='noreferrer'>
                    {source.label}
                  </a>
                ))}
              </footer>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default function Page() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <Suspense fallback={<AtlasFallback />}>
        <AtlasApp />
      </Suspense>
    </>
  )
}
