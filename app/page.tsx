import { AtlasApp } from '@/components/AtlasApp'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import { Suspense } from 'react'

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
    <main className='atlas-initial-loading' aria-label='Loading Shipwreck Atlas' aria-live='polite'>
      <span className='map-loading-ring atlas-initial-spinner' aria-hidden='true' />
      <span className='atlas-loading-label'>Drawing ocean chart…</span>
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
