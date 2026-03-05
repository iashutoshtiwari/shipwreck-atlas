"use client";

import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Ship, Waves } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WreckFeature } from '@/lib/types';

type WreckPopupProps = {
  wreck: WreckFeature;
};

const CAROUSEL_INTERVAL_MS = 3200;

export function WreckPopup({ wreck }: WreckPopupProps) {
  const { properties } = wreck;
  const images = useMemo(() => properties.images.filter(Boolean), [properties.images]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [properties.name]);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <Card className="w-[18.25rem] border-border/40 bg-background/92 shadow-[0_26px_44px_-24px_rgba(2,6,23,0.7)] backdrop-blur-md sm:w-[22rem]">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-base leading-tight tracking-tight">{properties.name}</CardTitle>
        <p className="inline-flex w-fit items-center gap-1 rounded-full border border-border/60 bg-muted/55 px-2 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
          <Ship className="h-3 w-3" aria-hidden="true" />
          Lost in {properties.year_lost}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {images.length ? (
          <div className="relative h-36 w-full overflow-hidden rounded-xl">
            {images.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${properties.name} photo ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  index === activeImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
              />
            ))}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/65 via-black/10 to-transparent px-2.5 pb-2 pt-4 text-[11px] text-white">
              <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-2 py-0.5 backdrop-blur-sm">
                <Waves className="h-3 w-3" aria-hidden="true" />
                Gallery
              </span>
              <span className="rounded-full bg-black/30 px-2 py-0.5 backdrop-blur-sm">
                {activeImageIndex + 1}/{images.length}
              </span>
            </div>
          </div>
        ) : null}

        {images.length > 1 ? (
          <div className="flex justify-center gap-1" aria-hidden="true">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeImageIndex ? 'w-5 bg-primary' : 'w-1.5 bg-primary/35'
                }`}
              />
            ))}
          </div>
        ) : null}

        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 rounded-xl bg-muted/35 p-2.5 text-xs">
          <dt className="font-medium text-muted-foreground">Type</dt>
          <dd>{properties.type}</dd>
          <dt className="font-medium text-muted-foreground">Cause</dt>
          <dd>{properties.cause}</dd>
          <dt className="font-medium text-muted-foreground">Depth</dt>
          <dd>{properties.depth_m.toLocaleString()} m</dd>
        </dl>

        <p className="text-xs leading-relaxed text-muted-foreground">{properties.summary}</p>

        {properties.sources.length ? (
          <ul className="flex flex-wrap gap-1.5 text-xs">
            {properties.sources.map((source, index) => (
              <li key={source}>
                <a
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-card/70 px-2.5 py-1 text-primary transition-all hover:-translate-y-px hover:bg-muted"
                >
                  Source {index + 1}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}