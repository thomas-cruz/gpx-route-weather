/**
 * routeAnalysis.ts - Utility functions for analyzing GPX route geometry.
 * 
 * Provides calculations for:
 * - Cumulative distance along a route segment-by-segment
 * - Bearing (direction) between two waypoint pairs
 * 
 * Uses Turf.js geospatial functions wrapped for ease of use.
 */
import { point, distance, bearing } from "@turf/turf";

/**
 * addDistances - Calculates cumulative distance for each waypoint along a route.
 * 
 * Accumulates distance from starting point to each coordinate, returning
 * an array where each item includes the distance traveled so far (km).
 * 
 * @param coords - Array of `{lat, lon}` objects representing route waypoints
 * @returns Same-length array with added `distanceKm` property to each coord
 * 
 * Usage example:
 * ```ts
 * const routeCoords = [{lat: 30}, {lat: 31, lon: 30}];
 * const withDistance = addDistances(routeCoords);
 * // [{lat:30, lon:30, distanceKm:0}, {lat:31, lon:30, distanceKm:5.2}]
 * ```
 */
export function addDistances(
  coords: {
    /** Latitudinal coordinate (-90 to 90) */
    lat: number;
    /** Longitudinal coordinate (-180 to 180) */
    lon: number;
  }[]
): typeof coords & { distanceKm: number }[] {
  /**
   * Accumulate distance incrementally.
   * Start at 0 for the first coordinate (origin), then add each segment.
   */
  let total = 0;

  /**
   * Map over all coordinates to build enhanced result with cumulative distance.
   * 
   * First coordinate (index 0): distance remains 0 (starting point)
   * Subsequent coordinates: add distance from previous point to current
   */
  return coords.map((coord, index) => {
    if (index > 0) {
      /**
       * Calculate distance from previous waypoint to current waypoint.
       * Turf's distance() takes GeoJSON Point arrays: [lon, lat]
       * Build point objects from coordinate objects before calling distance().
       */
      total += distance(
        /** Previous waypoint converted to GeoJSON Point format */
        point([coords[index - 1].lon, coords[index - 1].lat]),
        /** Current waypoint converted to GeoJSON Point format */
        point([coord.lon, coord.lat]),
        /** Request kilometers as unit */
        { units: "kilometers" }
      );
    }

    /**
     * Return coordinate unchanged except adding cumulative distance.
     * The spread operator (...) preserves all original properties
     * and then adds/overwrites with new distanceKm field.
     */
    return {
      /** Copy all original lat/lon from input coordinate */
      ...coord,
      /** Cumulative distance from route start (in km) */
      distanceKm: total,
    };
  });
}

/**
 * getBearing - Calculate compass direction (angle) from one point to another.
 * 
 * Bearing is measured clockwise from true north, 0°-360°.
 * Useful for understanding wind relative to route or path turns.
 * 
 * @param start - Starting waypoint
 * @param end - Ending waypoint
 * @returns Compass bearing in degrees (0-360, 0°=North, 90°=East, etc.)
 */
export function getBearing(
  /** Origin point for bearing calculation */
  start: {
    /** Starting point latitude */
    lat: number;
    /** Starting point longitude */
    lon: number;
  },
  /** Endpoint for bearing calculation */
  end: {
    /** Ending point latitude */
    lat: number;
    /** Ending point longitude */
    lon: number;
  }
): number {
  /**
   * Use Turf's bearing function to calculate direction.
   * Input expects [lon, lat] order (GeoJSON standard), so wrap
   * our coordinate objects into Point geometries first.
   */
  return bearing(point([start.lon, start.lat]), point([end.lon, end.lat]));
}
