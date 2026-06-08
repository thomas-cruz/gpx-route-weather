export async function getWeather(lat: number, lon: number) {
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

  const res = await fetch(url);

  return res.json();
}
