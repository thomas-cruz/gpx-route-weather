export default function Sidebar({ samples }: any) {
  return (
    <div className=" w-full
            lg:w-80
            border
            rounded
            p-4
            max-h-[400px]
            lg:max-h-[700px]
            overflow-y-auto">
      {samples.map((sample: any, index) => (
        <div key={index} className="border-b p-2">

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
