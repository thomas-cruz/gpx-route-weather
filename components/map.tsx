"use client"
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import * as toGeoJSON from "togeojson";
import { DOMParser } from "xmldom";
import axios from "axios";

type MapProps = {
  gpxData: string;
};

const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY"; // Replace with your OpenWeatherMap API key

type WeatherPoint = {
  lat: number;
  lng: number;
  temp: number;
  icon: string;
  description: string;
};

export default function Map({ gpxData }: MapProps) {
  const [weatherPoints, setWeatherPoints] = useState<WeatherPoint[]>([]);

  // Parse GPX and extract coordinates
  const routeCoords = useMemo(() => {
    const dom = new DOMParser().parseFromString(gpxData, "text/xml");
    const geojson = toGeoJSON.gpx(dom);
    const line = geojson.features.find(
      (f: any) => f.geometry.type === "LineString"
    );
    if (!line) return [];
    // Leaflet expects [lat, lng]
    return line.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
  }, [gpxData]);

  // Fetch weather for every ~10th point
  useEffect(() => {
    if (routeCoords.length === 0) return;
    const step = Math.max(1, Math.floor(routeCoords.length / 10));
    const fetchWeather = async () => {
      const points: WeatherPoint[] = [];
      for (let i = 0; i < routeCoords.length; i += step) {
        const [lat, lng] = routeCoords[i];
        try {
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric`;
          const res = await axios.get(url);
          const weather = res.data;
          points.push({
            lat,
            lng,
            temp: Math.round(weather.main.temp),
            icon: weather.weather[0].icon,
            description: weather.weather[0].description,
          });
        } catch (e) {
          // Ignore errors
        }
      }
      setWeatherPoints(points);
    };
    fetchWeather();
  }, [routeCoords]);

  if (routeCoords.length === 0) {
    return <div className="text-red-500">No route found in GPX file.</div>;
  }

  // Center map on first point
  const center = routeCoords[0];

  return (
    <MapContainer center={center} zoom={13} style={{ height: 500, width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Polyline positions={routeCoords} color="#3b82f6" weight={4} />
      {weatherPoints.map((pt, idx) => {
        const icon = useMemo(
          () =>
            L.icon({
              iconUrl: `https://openweathermap.org/img/wn/${pt.icon}.png`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            }),
          [pt.icon]
          );
      return(
        <Marker
          key={idx}
          position={[pt.lat, pt.lng]}
          icon={icon}
        >
          <Popup>
            <div>
              <strong>{pt.temp}°C</strong>
              <br />
              {pt.description}
            </div>
          </Popup>
        </Marker>
      )})}
    </MapContainer>
  );
}