/**
 * sampleRoute - Downsamples long GPX routes to manageable sample intervals.
 * 
 * Large GPX files can have thousands of waypoints (one every few meters).
 * This function reduces them to one sample per X kilometers for:
 * - Weather data lookups (APIs prefer fewer requests)
 * - Performance improvements (less data to process/render)
 * - Visual simplification (easier particle animations)
 * 
 * @param route - Array of route waypoints, each having: lat, lon, distanceKm, etc.
 * @param intervalKm - Sample every N kilometers (default: 5km)
 * @returns Reduced set of waypoints spaced approximately N km apart
 * 
 * @example
 * // Original route: 100 waypoints, ~200km
 * // After sampling at 10km intervals: ~20 waypoints
 */
import { RoutePoint } from "@/types/route";

export function sampleRoute(
  route: RoutePoint[],
  /**
   * Distance interval in kilometers between samples.
   * Lower values = more samples (higher precision, more resources)
   * Higher values = fewer samples (lower resource usage, less accurate weather)
   */
  intervalKm = 5
): RoutePoint[] {
  /**
   * Guard clause: Empty route means no samples possible.
   * Returns empty array instead of crashing.
   */
  if (route.length === 0) {
    return [];
  }

  /**
   * Initialize samples array with first waypoint.
   * Every route sampling MUST include the starting point
   * as reference for weather calculations and route tracking.
   */
  const samples: RoutePoint[] = [route[0]];

  /**
   * Track the distance threshold for the next sample collection.
   * Starts at intervalKm (first sample after initial point)
   */
  let nextDistance = intervalKm;

  /**
   * Iterate through all route waypoints looking for those at or beyond
   * our sampling interval distance.
   * 
   * Strategy: Greedy sampling - grab first point at/after each interval mark.
   * Result: Roughly evenly-spaced samples within acceptable margin of error.
   */
  for (const point of route) {
    if (point.distanceKm >= nextDistance) {
      /**
       * Found candidate waypoint at/past our target interval.
       * Add it to samples and advance next target distance by interval amount.
       * 
       * Note: We use `>=` to catch edge cases where multiple segments happen
       * in one interval (rare but possible with fast travel).
       */
      samples.push(point);
      /** Advance our target by adding another interval spacing */
      nextDistance += intervalKm;
    }
  }

  /**
   * Ensure route end-point is included in samples.
   * The loop above might miss the final point if it falls 
   * just short of nextDistance.
   */
  const last = route[route.length - 1];

  /**
   * Check whether last waypoint already exists in samples.
   * If not, append it to ensure complete coverage of route.
   */
  if (samples[samples.length - 1] !== last) {
    samples.push(last);
  }

  /**
   * Return downsampled waypoint list for weather/weather effect processing.
   */
  return samples;
}
