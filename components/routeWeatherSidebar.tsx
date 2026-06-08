export default function Sidebar({ samples }: any) {
  return (
    <div className="w-80 overflow-auto">
      {samples.map((sample: any) => (
        <div key={sample.distanceKm} className="border-b p-2">
          <div>km {sample.distanceKm.toFixed(1)}</div>

          <div>
            🌡️ {sample.temperature}
            °C
          </div>

          <div>
            🌧️ {sample.precipitation}
            mm
          </div>

          <div>☀️ UV {sample.uvIndex}</div>

          <div>
            💨 {sample.windSpeed}
            km/h
          </div>

          <div>{sample.windType}</div>
        </div>
      ))}
    </div>
  );
}
