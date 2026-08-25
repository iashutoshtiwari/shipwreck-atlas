const DEFAULT_SITE_URL = 'https://shipwreck-atlas.vercel.app'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '')

export const SITE_NAME = 'Shipwreck Atlas'

export const SITE_DESCRIPTION =
  'Explore 24 famous shipwrecks—from the ancient Antikythera wreck to Estonia—through an interactive world map, archival images, facts, and trusted sources.'
