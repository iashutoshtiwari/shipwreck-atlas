import '@/styles/globals.css'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import type { Metadata, Viewport } from 'next'
import { Manrope, Newsreader } from 'next/font/google'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Shipwreck Atlas | Maritime History Map',
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  category: 'history',
  keywords: [
    'shipwrecks',
    'maritime history',
    'shipwreck map',
    'underwater archaeology',
    'historic ships',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: 'Shipwreck Atlas | Maritime History Map',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipwreck Atlas | Maritime History Map',
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#06151d',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' className={`dark ${manrope.variable} ${newsreader.variable}`}>
      <head>
        <link rel='preconnect' href='https://api.maptiler.com' crossOrigin='anonymous' />
        <link rel='preconnect' href='https://upload.wikimedia.org' crossOrigin='anonymous' />
      </head>
      <body
        suppressHydrationWarning
        className='bg-background font-sans text-foreground antialiased'
      >
        {children}
      </body>
    </html>
  )
}
