# Shipwreck Atlas

A static-exportable Next.js 14 app that visualizes historical shipwrecks on an interactive world map.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- React Leaflet + Leaflet.markercluster
- Fuse.js search
- Shadcn-style UI components
- Lucide icons

## Run

```bash
npm install
npm run dev
```

## Build static export

```bash
npm run build
```

The generated static site is in `out/`.

## Data

Edit `data/wrecks.geojson` to add or modify shipwrecks.