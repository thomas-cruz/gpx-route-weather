/**
 * Fetch weather data for a specific latitude/longitude location from Open-Meteo API.
 * 
 * This function retrieves hourly weather predictions useful for planning routes.
 * Data includes conditions that matter for outdoor sports (cyclists, runners):
 * - Temperature (comfort levels)
 * - Wind speed & direction (effort/visibility impact)
 * - Precipitation (rain chance/intensity)
 * - UV Index (sun protection needs)
 * 
 * @param lat - Latitude coordinate of the location
 * @param lon - Longitude coordinate of the location
 * @returns Promise resolving to Open-Meteo JSON response containing `hourly` data
 */
export async function getWeather(lat: number, lon: number) {
  /**
   * Construct URL for Open-Meteo weather API.
   * Base endpoint: https://api.open-meteo.com/v1/forecast
   * Parameters:
   * - latitude/longitude: Single point query
   * - hourly: Time-series measurements (required for route interpolation)
   * 
   * Selected parameters (comma-separated):
   * - temperature_2m: Air temperature at 2m height
   * - wind_speed_10m: Wind velocity at 10m height\normalized for aerodynamic drag calculations)
   * - wind_direction_10m: Wind bearing (degrees from north) useful for head/tailwind analysis)
   * - precipitation: Rainfall amount (mm)\nfor visual rain effects
   * - uv_index: Solar ultraviolet index (health/safety concern)
   */
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    `&hourly=` +
    `temperature_2m,` +
    `wind_speed_10m,` +
    `wind_direction_10m,` +
    `precipitation,` +
    `uv_index`;

  /** Perform HTTP GET request to API */
  const res = await fetch(url);

  /** Parse JSON response and return to caller for processing */
  return res.json();
}
