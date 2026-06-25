import * as toGeoJSON from "@mapbox/togeojson";

export function parseGpx(gpx: string) {
  if (!gpx || typeof gpx !== "string") {
    console.warn("parseGpx: invalid input");
    return [];
  }

  const trimmed = gpx.trim();

  if (!trimmed.startsWith("<")) {
    console.warn("parseGpx: input is not XML");
    return [];
  }

  const dom = new DOMParser().parseFromString(trimmed, "text/xml");

  // 🔥 detect XML parser errors
  const parserError = dom.getElementsByTagName("parsererror");

  if (parserError.length > 0) {
    console.error("Invalid GPX XML", parserError);
    return [];
  }

  const geojson = toGeoJSON.gpx(dom);

  const line = geojson.features.find(
    (f: any) => f.geometry?.type === "LineString"
  );

  if (!line) return [];

  return line.geometry.coordinates.map(([lon, lat]: number[]) => ({
    lat,
    lon,
  }));
}