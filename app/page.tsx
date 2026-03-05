"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import rawWrecks from '@/data/wrecks.geojson';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { buildFuseIndex, normalizeWreckFeatures, searchWrecks } from '@/lib/map-utils';
import type { WreckFeatureCollection } from '@/lib/types';

const Map = dynamic(() => import('@/components/Map').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div
      className="h-[74vh] w-full animate-pulse rounded-3xl border border-border/60 bg-muted/40 sm:h-[80vh]"
      aria-label="Loading map"
    />
  )
});

const wreckCollection = normalizeWreckFeatures(rawWrecks as WreckFeatureCollection);

export default function Page() {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => buildFuseIndex(wreckCollection.features), []);

  const filteredWrecks = useMemo(() => {
    if (!query.trim()) {
      return wreckCollection.features;
    }

    return searchWrecks(fuse, query);
  }, [fuse, query]);

  const highlightedNames = useMemo(() => new Set(filteredWrecks.map((feature) => feature.properties.name)), [filteredWrecks]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(2,132,199,0.1),transparent_35%)]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-size-[36px_36px] opacity-20" />

      <header className="sticky top-0 z-1000 border-b border-border/70 bg-background/72 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="mb-1 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-primary/90">Maritime archive</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Shipwreck Atlas</h1>
            <p className="text-sm text-muted-foreground">Historical wrecks mapped from a local GeoJSON dataset</p>
          </div>
          <div className="flex w-full items-start gap-2 lg:w-auto">
            <SearchBar value={query} onChange={setQuery} resultCount={filteredWrecks.length} totalCount={wreckCollection.features.length} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-5 pt-4 sm:px-6 lg:px-8">
        <Map allWrecks={wreckCollection.features} visibleWrecks={filteredWrecks} highlightedNames={highlightedNames} />
      </main>

      <footer className="border-t border-border/70 bg-background/82 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <span>Map data: OpenStreetMap contributors</span>
          <span>Built for modern static hosting with Next.js</span>
        </div>
      </footer>
    </div>
  );
}