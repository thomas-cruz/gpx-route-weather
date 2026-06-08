import { RoutePoint } from "@/types/route";

export function sampleRoute(route: RoutePoint[], intervalKm = 5) {
  if (route.length === 0) {
    return [];
  }

  const samples = [route[0]];

  let nextDistance = intervalKm;

  for (const point of route) {
    if (point.distanceKm >= nextDistance) {
      samples.push(point);
      nextDistance += intervalKm;
    }
  }

  const last = route[route.length - 1];

  if (samples[samples.length - 1] !== last) {
    samples.push(last);
  }

  return samples;
}
