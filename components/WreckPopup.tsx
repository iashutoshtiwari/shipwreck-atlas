"use client";

import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WreckFeature } from '@/lib/types';

type WreckPopupProps = {
  wreck: WreckFeature;
};

export function WreckPopup({ wreck }: WreckPopupProps) {
  const { properties } = wreck;
  const firstImage = properties.images[0];

  return (
    <Card className="w-70 border-border/65 bg-background/90 shadow-xl backdrop-blur-md sm:w-88">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-base leading-tight">{properties.name}</CardTitle>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Lost in {properties.year_lost}</p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {firstImage ? (
          <img
            src={firstImage}
            alt={properties.name}
            className="h-32 w-full rounded-lg object-cover ring-1 ring-border/60"
            loading="lazy"
          />
        ) : null}

        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 rounded-lg border border-border/70 bg-muted/35 p-2 text-xs">
          <dt className="font-medium text-muted-foreground">Type</dt>
          <dd>{properties.type}</dd>
          <dt className="font-medium text-muted-foreground">Cause</dt>
          <dd>{properties.cause}</dd>
          <dt className="font-medium text-muted-foreground">Depth</dt>
          <dd>{properties.depth_m.toLocaleString()} m</dd>
        </dl>

        <p className="text-xs leading-relaxed text-muted-foreground">{properties.summary}</p>

        {properties.sources.length ? (
          <ul className="space-y-1 text-xs">
            {properties.sources.map((source, index) => (
              <li key={source}>
                <a
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-card/65 px-2 py-1 text-primary transition-colors hover:bg-muted"
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