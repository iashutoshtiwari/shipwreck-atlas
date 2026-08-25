import { SITE_URL } from '@/lib/site'
import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: '2026-08-25',
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: '2026-08-25',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
