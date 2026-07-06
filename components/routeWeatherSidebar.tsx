/**
 * routeWeatherSidebar - Displays weather summary for each sampled route point.
 * 
 * Renders a scrollable card listing weather conditions at regular intervals
 * along the GPX route (using previously-sampled waypoints).
 * 
 * @param samples - Array of weather data points from route sampling
 */
export default function Sidebar({ samples }: any) {
  return (
    /**
     * Scrollable card component using Tailwind CSS utility classes:
     * - Full width, ~20rem on large screens
     * - Borders and rounded corners for card styling
     * - Fixed-height with scrolling for long routes
     */
    <div className=" w-full
            lg:w-80
            border
            rounded
            p-4
            max-h-[400px]
            lg:max-h-[700px]
            overflow-y-auto">
      {samples.map((sample: any, index) => (
        <div
          key={index}
          /** Bottom-border separator for readability between entries */
          className="border-b p-2">
          
          <div>
            🌡️ {sample.temperature}
            °C
          </div>

          <div>
            🌧️ {sample.precipitation}
            {/* /** Millimeter measurement of precipitation/rainfall */ }
            mm
          </div>

          <div>
            ☀️ UV {sample.uvIndex}
            {/* Solar radiation danger level displayed as numeric index */}
          </div>

          <div>
            💨 {sample.windSpeed}
            {/* Wind velocity measured at standard 10-meter elevation */}
            km/h
          </div>

          <div>
            {/* Wind type classification: tailwind, headwind, crosswind */}
            {sample.windType}
          </div>
        </div>
      ))}
    </div>
  );
}    
