declare module '*.geojson' {
  import type { WreckFeatureCollection } from '@/lib/types';

  const value: WreckFeatureCollection;
  export default value;
}