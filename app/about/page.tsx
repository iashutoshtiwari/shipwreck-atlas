import rawWrecks from '@/data/wrecks.geojson'
import { formatYear } from '@/lib/map-utils'
import { SITE_NAME } from '@/lib/site'
import type { WreckFeatureCollection } from '@/lib/types'
import { Anchor, ArrowLeft, ArrowUpRight, BookOpen, ImageIcon, Layers3 } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

const description =
  'Learn how Shipwreck Atlas selects, researches, illustrates, and maintains its collection of 24 historic wreck sites.'

export const metadata: Metadata = {
  title: 'About the Atlas',
  description,
  alternates: { canonical: '/about' },
  openGraph: {
    title: `About the Atlas | ${SITE_NAME}`,
    description,
    url: '/about',
  },
}

const wrecks = [...(rawWrecks as WreckFeatureCollection).features].sort(
  (first, second) => second.properties.year_lost - first.properties.year_lost,
)

export default function AboutPage() {
  return (
    <main className='about-page'>
      <header className='about-header'>
        <Link href='/' className='about-brand' aria-label='Return to Shipwreck Atlas'>
          <span className='brand-mark' aria-hidden='true'>
            <Anchor className='h-4 w-4' />
          </span>
          <span>
            <span className='eyebrow'>A maritime archive</span>
            <span className='about-brand-title'>Shipwreck Atlas</span>
          </span>
        </Link>
        <Link href='/' className='about-back-link'>
          <ArrowLeft className='h-3.5 w-3.5' aria-hidden='true' />
          Open the atlas
        </Link>
      </header>

      <article className='about-content'>
        <section className='about-hero'>
          <p className='eyebrow'>About the project</p>
          <h1>A hand-built guide to the wrecks that shaped maritime history.</h1>
          <p className='about-lede'>
            Shipwreck Atlas is an independent hobby project for curious history enthusiasts. It
            brings twenty-four notable wreck sites into one navigable chart, pairing concise context
            with archival imagery and named references.
          </p>
          <div className='about-actions'>
            <Link href='/' className='about-primary-action'>
              Explore the map
              <ArrowUpRight className='h-4 w-4' aria-hidden='true' />
            </Link>
            <a
              href='https://github.com/iashutoshtiwari/shipwreck-atlas'
              target='_blank'
              rel='noreferrer'
            >
              View project source
            </a>
          </div>
        </section>

        <section className='about-principles' aria-label='Archive principles'>
          <article>
            <BookOpen className='h-4 w-4' aria-hidden='true' />
            <h2>Named references</h2>
            <p>
              Facts are compiled from museums, archives, government agencies, and established
              historical references linked from each profile.
            </p>
          </article>
          <article>
            <ImageIcon className='h-4 w-4' aria-hidden='true' />
            <h2>Traceable imagery</h2>
            <p>
              Images come from Wikimedia Commons and include visible creator, license, and source
              links. No generated historical imagery is used.
            </p>
          </article>
          <article>
            <Layers3 className='h-4 w-4' aria-hidden='true' />
            <h2>Wreck status matters</h2>
            <p>
              The archive distinguishes in-situ remains from partial remains, salvaged sites,
              raised vessels, and destroyed wrecks.
            </p>
          </article>
        </section>

        <section className='about-method'>
          <div>
            <p className='eyebrow'>Method</p>
            <h2>How a record enters the atlas</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <h3>Select a consequential site</h3>
                <p>
                  The collection favors wrecks with historical, archaeological, cultural, or
                  maritime-safety significance rather than attempting to catalogue every loss.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Cross-check the essentials</h3>
                <p>
                  Dates, coordinates, cause, casualties, depth, and current status are compared
                  against the references named in the record.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Keep the uncertainty visible</h3>
                <p>
                  Unknown depth or casualty values remain absent instead of being estimated, and
                  historic sites remain mapped even when a vessel was later raised or salvaged.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <section className='about-index' aria-labelledby='about-index-title'>
          <div className='about-section-heading'>
            <div>
              <p className='eyebrow'>The current edition</p>
              <h2 id='about-index-title'>Twenty-four wreck profiles</h2>
            </div>
            <span>c. 65 BCE—1994</span>
          </div>
          <div className='about-wreck-grid'>
            {wrecks.map(({ properties }) => (
              <Link key={properties.id} href={`/?wreck=${properties.id}`}>
                <span>{formatYear(properties.year_lost)}</span>
                <strong>{properties.name}</strong>
                <small>{properties.location}</small>
              </Link>
            ))}
          </div>
        </section>

        <footer className='about-footer'>
          <p>Independent, non-commercial, and last reviewed August 2026.</p>
          <p>
            See something that needs correction?{' '}
            <a
              href='https://github.com/iashutoshtiwari/shipwreck-atlas'
              target='_blank'
              rel='noreferrer'
            >
              Open the project repository
            </a>
            .
          </p>
        </footer>
      </article>
    </main>
  )
}
