export type RoutePoint = {
  lat: number;
  lon: number;
  distanceKm: number;
};

export type WeatherSample = {
  lat: number;
  lon: number;

  arrivalTime: Date;

  temperature: number;

  windSpeed: number;
  windDirection: number;

  uvIndex: number;

  precipitation: number;

  routeBearing: number;

  windType:
    | "headwind"
    | "tailwind"
    | "crosswind";
};