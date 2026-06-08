import { ActivityType } from "@/types/activity";

export const ACTIVITY_CONFIG = {
  cycling: {
    speedKmh: 25,
    sampleIntervalKm: 10,
    weatherGridSize: 1,
  },

  running: {
    speedKmh: 10,
    sampleIntervalKm: 5,
    weatherGridSize: 2,
  },

  hiking: {
    speedKmh: 4,
    sampleIntervalKm: 2,
    weatherGridSize: 2,
  },
} satisfies Record<
  ActivityType,
  {
    speedKmh: number;
    sampleIntervalKm: number;
    weatherGridSize: number;
  }
>;
