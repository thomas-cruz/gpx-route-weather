"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ActivityType } from "@/types/activity";

const RouteMap = dynamic(() => import("./map"), { ssr: false });

export default function MapClientWrapper() {
  const [mounted, setMounted] = useState(false);

  const [gpxData, setGpxData] = useState("");

  const [startTime, setStartTime] = useState("");

  const [activity, setActivity] = useState<ActivityType>("cycling");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div
        className="
          rounded-xl
          border
          bg-gray-500
          p-6
          shadow-sm
        "
      >
        <h2
          className="
            mb-6
            text-xl
            font-bold
          "
        >
          Plan Your Activity
        </h2>
      <label
        className="
          flex
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-lg
          border-2
          border-dashed
          border-gray-300
          p-8
          hover:border-blue-400
        "
      >
        <div className="text-4xl">📍</div>

        <div className="mt-2 font-medium">Upload GPX Route</div>

        <div className="text-sm">Select a .gpx file</div>

        <input
          type="file"
          accept=".gpx"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];

            if (!file) return;

            setGpxData(await file.text());
          }}
        />
      </label>

      <div>
        <label className="mb-2 block font-medium">Start Time</label>

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="
              w-full
              rounded-lg
              border
              border-gray-300
              px-4
              py-3
            "
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            value: "cycling",
            label: "Cycling",
            emoji: "🚴",
          },
          {
            value: "running",
            label: "Running",
            emoji: "🏃",
          },
          {
            value: "hiking",
            label: "Hiking",
            emoji: "🥾",
          },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setActivity(item.value as ActivityType)}
            className={`
        rounded-lg
        border
        p-4
        text-center
        transition
        ${
          activity === item.value
            ? "border-blue-500 bg-gray-700"
            : "border-gray-200 hover:border-gray-300"
        }
      `}
          >
            <div className="text-2xl">{item.emoji}</div>

            <div className="mt-2 font-medium">{item.label}</div>
          </button>
        ))}
      </div>

      {gpxData && (
        <div
          className="
            rounded-lg
            border
            border-green-200
            bg-green-50
            p-3
            text-green-700
          "
        >
          ✓ GPX route loaded
        </div>
      )}
      </div>

      {gpxData && startTime && (
        <RouteMap gpxData={gpxData} startTime={startTime} activity={activity} />
      )}
    </div>
  );
}
