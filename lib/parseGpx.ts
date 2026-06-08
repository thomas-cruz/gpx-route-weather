import * as toGeoJSON from "@mapbox/togeojson";
import type { LineString } from "geojson";
import { DOMParser } from "xmldom";

export function parseGpx(gpx: string) {
  const dom = new DOMParser().parseFromString(gpx, "text/xml");

  const geojson = toGeoJSON.gpx(dom);

  const line = geojson.features.find(
    (f: any) => f.geometry?.type === "LineString"
  );

  if (!line) return [];

  const coordinates = (line.geometry as LineString).coordinates;

  return coordinates.map(([lon, lat]) => ({
    lat,
    lon,
  }));
}
