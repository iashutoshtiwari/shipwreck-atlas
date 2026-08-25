# Shipwreck Atlas

A dark, map-first maritime archive charting 24 historically significant shipwrecks from the ancient world to the late twentieth century.

## Stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS 4 with a dark-only token system
- MapTiler SDK / MapLibre vector mapping
- Fuse.js fuzzy search
- Local GeoJSON content with Wikimedia Commons image credits

## Local setup

Install dependencies and copy the environment template:

```bash
pnpm install
Copy-Item .env.example .env.local
```

Create a free MapTiler key at [cloud.maptiler.com](https://cloud.maptiler.com/account/keys/) and set it in `.env.local`:

```dotenv
NEXT_PUBLIC_MAPTILER_KEY=your_public_maptiler_key
NEXT_PUBLIC_SITE_URL=https://shipwreck-atlas.vercel.app
```

Set `NEXT_PUBLIC_SITE_URL` to the canonical production origin when using a custom domain. It is used by metadata, structured data, `robots.txt`, and the sitemap.

Then start the app:

```bash
pnpm dev
```

Without a key, the searchable archive and wreck profiles still work and the map displays a setup message.

## Content

Wreck records live in `data/wrecks.geojson`. Each feature includes a stable ID, loss date and location, era, vessel category, cause, depth, lives lost, present status, a concise history, credited Wikimedia Commons imagery, and named references.

Validate the collection after editing it:

```bash
pnpm validate:data
```

## Quality checks

```bash
pnpm validate:data
pnpm typecheck
pnpm lint
pnpm build
```

The project uses `output: 'export'`; the production build is written to `out/` for static hosting.

Preview the generated export locally with:

```bash
pnpm preview
```
