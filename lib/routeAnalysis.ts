import { point, distance, bearing } from "@turf/turf";

export function addDistances(
  coords: {
    lat: number;
    lon: number;
  }[]
) {
  let total = 0;

  return coords.map((coord, index) => {
    if (index > 0) {
      total += distance(
        point([coords[index - 1].lon, coords[index - 1].lat]),
        point([coord.lon, coord.lat]),
        { units: "kilometers" }
      );
    }

    return {
      ...coord,
      distanceKm: total,
    };
  });
}

export function getBearing(
  start: {
    lat: number;
    lon: number;
  },
  end: {
    lat: number;
    lon: number;
  }
) {
  return bearing(point([start.lon, start.lat]), point([end.lon, end.lat]));
}
