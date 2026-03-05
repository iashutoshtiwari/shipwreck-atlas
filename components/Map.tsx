"use client";

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import { useEffect, useMemo, useState } from 'react';
import L, { type DivIcon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useTheme } from 'next-themes';
import { WreckPopup } from '@/components/WreckPopup';
import { createBoundsForFeatures } from '@/lib/map-utils';
import type { WreckFeature } from '@/lib/types';

type MapProps = {
  allWrecks: WreckFeature[];
  visibleWrecks: WreckFeature[];
  highlightedNames: Set<string>;
};

// Clamp latitude to tile-supported range while allowing effectively infinite longitude panning.
const HORIZONTAL_WRAP_BOUNDS = L.latLngBounds(
  L.latLng(-85, -1_000_000_000),
  L.latLng(85, 1_000_000_000)
);

function createMarkerIcon(highlighted: boolean): DivIcon {
  return L.divIcon({
    className: 'wreck-marker-wrapper',
    html: `<div class="wreck-marker ${highlighted ? 'wreck-marker-highlight' : ''}"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
}

const DEFAULT_MARKER_ICON = createMarkerIcon(false);
const HIGHLIGHT_MARKER_ICON = createMarkerIcon(true);

function RemoveLeafletPrefix() {
  const map = useMap();

  useEffect(() => {
    map.attributionControl.setPrefix(false);
  }, [map]);

  return null;
}

function MapZoomToResults({ features }: { features: WreckFeature[] }) {
  const map = useMap();

  useEffect(() => {
    if (!features.length) {
      return;
    }

    if (features.length === 1) {
      const [lng, lat] = features[0].geometry.coordinates;
      map.flyTo([lat, lng], Math.max(map.getZoom(), 5), { duration: 0.6 });
      return;
    }

    map.flyToBounds(createBoundsForFeatures(features), { padding: [50, 50], duration: 0.7 });
  }, [features, map]);

  return null;
}

function MarkersLayer({
  allWrecks,
  highlightedNames
}: {
  allWrecks: WreckFeature[];
  highlightedNames: Set<string>;
}) {
  return (
    <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds maxClusterRadius={55}>
      {allWrecks.map((wreck) => {
        const [lng, lat] = wreck.geometry.coordinates;
        const highlighted = highlightedNames.has(wreck.properties.name);

        return (
          <Marker
            key={`${wreck.properties.name}-${wreck.properties.year_lost}-${lng}-${lat}`}
            position={[lat, lng]}
            icon={highlighted ? HIGHLIGHT_MARKER_ICON : DEFAULT_MARKER_ICON}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.96}>
              {wreck.properties.name}
            </Tooltip>
            <Popup maxWidth={388} minWidth={245} autoPanPadding={[22, 24]}>
              <WreckPopup wreck={wreck} />
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
}

export function Map({ allWrecks, visibleWrecks, highlightedNames }: MapProps) {
  const { resolvedTheme } = useTheme();
  const [mapReady, setMapReady] = useState(false);

  const tileUrl = resolvedTheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = resolvedTheme === 'dark'
    ? '&copy; OpenStreetMap contributors &copy; CARTO'
    : '&copy; OpenStreetMap contributors';

  const memoizedWrecks = useMemo(() => allWrecks, [allWrecks]);

  return (
    <section className="relative h-[74vh] w-full overflow-hidden rounded-3xl border border-border/50 bg-card/20 shadow-[0_18px_60px_-34px_rgba(14,165,233,0.42)] sm:h-[80vh]">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxBounds={HORIZONTAL_WRAP_BOUNDS}
        maxBoundsViscosity={1}
        worldCopyJump
        scrollWheelZoom
        className="h-full w-full"
        whenReady={() => setMapReady(true)}
      >
        <RemoveLeafletPrefix />
        <TileLayer attribution={tileAttribution} url={tileUrl} noWrap={false} />
        <MapZoomToResults features={visibleWrecks} />
        {mapReady ? <MarkersLayer allWrecks={memoizedWrecks} highlightedNames={highlightedNames} /> : null}
      </MapContainer>
    </section>
  );
}