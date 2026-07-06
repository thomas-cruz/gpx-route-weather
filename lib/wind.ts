/**
 * classifyWind - Categorize wind relative to route direction.
 * 
 * Wind classification matters for cyclist/runners:
 * - Tailwind: Behind them (helps speed, easier)
 * - Headwind: Opposite direction (hampers speed, harder)
 * - Crosswind: Side-to-side (affects handling/body position)
 * 
 * @param routeBearing - Direction of travel in degrees (0=N, 90=E, 180=S, 270=W)
 * @param windDirection - Where wind is coming FROM (same compass convention)
 * @returns "tailwind"|"headwind"|"crosswind"
 * 
 * Note: Wind direction means "where it comes FROM", not where it goes TO.
 * Example: Wind from NE (45°) pushing SW toward 225° bearing
 */
export function classifyWind(
  /** Bearing of rider's movement direction in degrees (compass notation) */
  routeBearing: number,
  /** Compass direction wind originates FROM (0°=North, 360°=full circle wrap) */
  windDirection: number
): "tailwind" | "headwind" | "crosswind" {
  /**
   * Compute shortest angular difference between route and wind angle.
   * 
   * Steps:
   * 1. Take absolute difference between two angles
   * 2. Modulo 360 to wrap circular compass within 0-359 range
   * 
   * Example: Route = 90° (East), Wind from = 45° (Northeast)
   * diff = |90 - 45| % 360 = 45 (45° difference)
   */
  let diff = Math.abs(routeBearing - windDirection) % 360;

  /**
   * Handle cross-compass boundary case (difference > 180°):
   * 
   * Example: Route = 10°, Wind from = 350° (almost North)
   * Initial diff = |10 - 350| % 360 = 340 (incorrect - almost full circle!)
   * Corrected: 360 - 340 = 20° (small difference = same quadrant)
   * 
   * This ensures diff is always the smallest arc between two points on compass.
   */
  if (diff > 180) {
    diff = 360 - diff;
  }

  /**
   * Classify based on wind-relative angle:
   * 
   * - Tailwind: 0°-45° (wind pushing from behind)
   * - Crosswind: 45°-135° (wind blowing from side)
   * - Headwind: >135° (wind hitting front)
   */
  if (diff < 45) {
    /** Wind coming from within ±45° behind rider's direction */
    return "tailwind";
  }

  if (diff > 135) {
    /** Wind opposing rider from ahead */
    return "headwind";
  }

  /**
   * Otherwise wind is blowing across rider's path
   * Moderate crosswinds (45°-135° difference)
   */
  return "crosswind";
}
