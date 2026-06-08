export function classifyWind(routeBearing: number, windDirection: number) {
  let diff = Math.abs(routeBearing - windDirection) % 360;

  if (diff > 180) {
    diff = 360 - diff;
  }

  if (diff < 45) {
    return "tailwind";
  }

  if (diff > 135) {
    return "headwind";
  }

  return "crosswind";
}
