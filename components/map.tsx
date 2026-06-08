"use client";

import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import { parseGpx } from "@/lib/parseGpx";
import { addDistances, getBearing } from "@/lib/routeAnalysis";

import { sampleRoute } from "@/lib/sampleRoute";
import { getWeather } from "@/lib/weather";
import { classifyWind } from "@/lib/wind";

import type { RoutePoint, WeatherSample } from "@/types/route";
import { ActivityType } from "@/types/activity";
import { ACTIVITY_CONFIG } from "@/lib/activityConfig";

type Props = {
  gpxData: string;
  startTime: string;
  activity: ActivityType;
};

const ASSUMED_SPEED_KMH = 20;

export default function RouteMap({ gpxData, startTime, activity }: Props) {
  const [samples, setSamples] = useState<WeatherSample[]>([]);
  const config = ACTIVITY_CONFIG[activity];

  const parsedRoute = useMemo(() => {
    const coords = parseGpx(gpxData);

    return addDistances(coords);
  }, [gpxData]);

  const routeCoords = useMemo(
    () => parsedRoute.map((p) => [p.lat, p.lon]) as [number, number][],
    [parsedRoute]
  );

  const sampledRoute = useMemo(
    () => sampleRoute(parsedRoute, config.sampleIntervalKm),
    [parsedRoute, config]
  );

  useEffect(() => {
    async function loadWeather() {
      if (sampledRoute.length === 0 || !startTime) {
        return;
      }

      const startDate = new Date(startTime);

      //
      // STEP 1:
      // Build unique weather locations
      //
      const uniqueLocations = new Map<string, (typeof sampledRoute)[number]>();

      for (const point of sampledRoute) {
        const key = `${point.lat.toFixed(
          config.weatherGridSize
        )}-${point.lon.toFixed(config.weatherGridSize)}`;

        if (!uniqueLocations.has(key)) {
          uniqueLocations.set(key, point);
        }
      }

      //
      // STEP 2:
      // Fetch all weather requests in parallel
      //
      const weatherEntries = await Promise.all(
        Array.from(uniqueLocations.entries()).map(async ([key, point]) => {
          try {
            const weather = await getWeather(point.lat, point.lon);

            return [key, weather] as const;
          } catch (error) {
            console.error("Weather fetch failed:", error);

            return [key, null] as const;
          }
        })
      );

      //
      // STEP 3:
      // Create cache
      //
      const weatherCache = new Map(weatherEntries);

      //
      // STEP 4:
      // Build weather samples
      //
      const weatherSamples: WeatherSample[] = [];

      for (let i = 0; i < sampledRoute.length; i++) {
        const point = sampledRoute[i];

        const cacheKey = `${point.lat.toFixed(
          config.weatherGridSize
        )}-${point.lon.toFixed(config.weatherGridSize)}`;

        const weather = weatherCache.get(cacheKey);

        if (!weather?.hourly) {
          continue;
        }

        const arrivalHours = point.distanceKm / config.speedKmh;

        const arrivalTime = new Date(
          startDate.getTime() + arrivalHours * 60 * 60 * 1000
        );

        const targetHour = arrivalTime.toISOString().slice(0, 13);

        const hourIndex = weather.hourly.time.findIndex((t: string) =>
          t.startsWith(targetHour)
        );

        if (hourIndex === -1) {
          continue;
        }

        let routeBearing = 0;

        if (i < sampledRoute.length - 1) {
          routeBearing = getBearing(point, sampledRoute[i + 1]);
        } else if (i > 0) {
          routeBearing = getBearing(sampledRoute[i - 1], point);
        }

        const windDirection = weather.hourly.wind_direction_10m[hourIndex];

        weatherSamples.push({
          lat: point.lat,
          lon: point.lon,

          arrivalTime,

          temperature: weather.hourly.temperature_2m[hourIndex],

          windSpeed: weather.hourly.wind_speed_10m[hourIndex],

          windDirection,

          uvIndex: weather.hourly.uv_index[hourIndex],

          precipitation: weather.hourly.precipitation[hourIndex],

          routeBearing,

          windType: classifyWind(routeBearing, windDirection),
        });
      }

      console.log("Weather samples:", weatherSamples.length);

      setSamples(weatherSamples);
    }

    loadWeather();
  }, [sampledRoute, startTime]);

  if (parsedRoute.length === 0) {
    return <div className="text-red-500">No route found.</div>;
  }

  const center = [parsedRoute[0].lat, parsedRoute[0].lon] as [number, number];

  function getWeatherEmoji(precipitation: number, uvIndex: number) {
    if (precipitation >= 1) {
      return "🌧️";
    }

    if (uvIndex >= 6) {
      return "☀️";
    }

    return "⛅";
  }

  function getWindTypeSymbol(windType: string) {
    switch (windType) {
      case "Headwind":
        return "⬆️";

      case "Tailwind":
        return "⬇️";

      default:
        return "➡️";
    }
  }

  function getWindTypeColor(windType: string) {
    switch (windType) {
      case "Headwind":
        return "#dc2626";

      case "Tailwind":
        return "#16a34a";

      default:
        return "#eab308";
    }
  }

  function getWindBarbs(windSpeed: number) {
    if (windSpeed < 10) {
      return "▶";
    }

    if (windSpeed < 20) {
      return "▶▶";
    }

    if (windSpeed < 30) {
      return "▶▶▶";
    }

    return "▶▶▶▶";
  }

  const createForecastCard = (sample: WeatherSample) => {
    const borderColor = getWindTypeColor(sample.windType);

    const weatherEmoji = getWeatherEmoji(sample.precipitation, sample.uvIndex);

    const windSymbol = getWindTypeSymbol(sample.windType);

    const barbs = getWindBarbs(sample.windSpeed);

    return L.divIcon({
      html: `
        <div
          style="
            background:white;
            border:3px solid ${borderColor};
            border-radius:10px;
            padding:6px;
            min-width:90px;
            font-size:12px;
            font-weight:bold;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            text-align:center;
          "
        >
          <div>
            ${weatherEmoji}
            ${Math.round(sample.temperature)}°
          </div>
  
          <div
            style="
              margin-top:4px;
              display:flex;
              justify-content:center;
              align-items:center;
              gap:4px;
            "
          >
            <span>
              ${windSymbol}
            </span>
  
            <span
              style="
                display:inline-block;
                transform: rotate(${sample.windDirection}deg);
              "
            >
              ${barbs}
            </span>
          </div>
  
          <div>
            💨 ${Math.round(sample.windSpeed)}
          </div>
  
          <div>
            ☀️ ${Math.round(sample.uvIndex)}
          </div>
  
          <div>
            🌧️ ${sample.precipitation}
          </div>
        </div>
      `,
      className: "",
      iconSize: [100, 90],
      iconAnchor: [50, 45],
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <MapContainer
          center={center}
          zoom={11}
          style={{
            height: "700px",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Polyline positions={routeCoords} color="#2563eb" weight={4} />

          {samples.map((sample, index) => (
            <Marker
              key={index}
              position={[sample.lat, sample.lon]}
              icon={createForecastCard(sample)}
            >
              <Popup>
                <div className="space-y-1">
                  <div>
                    <strong>{sample.arrivalTime.toLocaleString()}</strong>
                  </div>

                  <div>
                    🌡️ {sample.temperature}
                    °C
                  </div>

                  <div>🌧️ {sample.precipitation} mm</div>

                  <div>☀️ UV {sample.uvIndex}</div>

                  <div>💨 {sample.windSpeed} km/h</div>

                  <div>Wind Dir: {sample.windDirection}°</div>

                  <div>Route Bearing: {sample.routeBearing}°</div>

                  <div>
                    <strong>{sample.windType}</strong>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="w-80 overflow-y-auto border rounded p-4 h-[700px]">
        <h2 className="font-bold text-lg mb-4">Route Weather</h2>

        {samples.map((sample, index) => (
          <div key={index} className="border-b py-3">
            <div className="font-medium">
              {sample.arrivalTime.toLocaleTimeString()}
            </div>

            <div>
              🌡️ {sample.temperature}
              °C
            </div>

            <div>🌧️ {sample.precipitation} mm</div>

            <div>☀️ UV {sample.uvIndex}</div>

            <div>💨 {sample.windSpeed} km/h</div>

            <div>{sample.windType}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
