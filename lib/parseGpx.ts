/**
 * parseGpx - Converts GPX XML track data into usable latitude/longitude array.
 * 
 * GPX format stores coordinates in GeoJSON order: [longitude, latitude].
 * We convert this to a standard map format: {lat, lon} for easier use.
 * 
 * @param gpx - Raw GPX XML string (from file content or stringified JSON)
 * @returns Array of `{lat, lon}` objects representing route waypoints
 */
import * as toGeoJSON from "@mapbox/togeojson";

export function parseGpx(gpx: string) {
  /** Validate input before processing */
  if (!gpx || typeof gpx !== "string") {
    /** Log warning for missing or non-string input */
    console.warn("parseGpx: invalid input");
    return [];
  }

  /** Remove leading/trailing whitespace/newlines from GPX */
  const trimmed = gpx.trim();

  // ⚠️ GPX must be valid XML starting with "<" - reject plain text/JSON
  if (!trimmed.startsWith("<")) {
    console.warn("parseGpx: input is not XML");
    return [];
  }

  /** Parse GPX XML string into DOM document using native browser parser */
  const dom = new DOMParser().parseFromString(trimmed, "text/xml");

  // 🔥 detect XML parser errors
  /** DOMParser returns a NodeList; parser errors show up as tag named "parsererror" */
  const parserError = dom.getElementsByTagName("parsererror");

  if (parserError.length > 0) {
    console.error("Invalid GPX XML", parserError);
    return [];
  }

  /**
   * Use mapbox/toGeoJSON library to parse GPX DOM element into GeoJSON.
   * toGeoJSON.gpx() specifically handles GPX XML structure.
   */
  const geojson = toGeoJSON.gpx(dom);

  /**
   * Find the LineString geometry representing the route track.
   * GeoJSON features typically include:
   * - Polygons for closed loops
   * - LineStrings for paths (what GPX tracks are)
   * - Points for GPS locations
   */
  const line = geojson.features.find(
    /** Filter to find feature with LineString geometry */
    (f: any) => f.geometry?.type === "LineString"
  );

  if (!line) {
    /** No route polyline found in GPX - likely no data or bad format */
    return [];
  }

  /**
   * Convert GeoJSON coordinates to our expected format.
   * GeoJSON uses [lon, lat] order, but most mapping libraries need {lat, lon}.
   * 
   * map() transforms each coordinate pair to our object format.
   */
  return line.geometry.coordinates.map(([lon, lat]: number[]) => ({
    /** Latitude (y-coordinate in maps, southern hemisphere first) */
    lat,
    /** Longitude (x-coordinate in maps, western hemisphere negative) */
    lon,
  }));
}    