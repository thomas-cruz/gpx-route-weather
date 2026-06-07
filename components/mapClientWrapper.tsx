"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// import Map from "../components/map";
const Map = dynamic(() => import("../components/map"), { ssr: false });


export default function MapClientWrapper() {
  const [gpxData, setGpxData] = useState<string | null>(null);

  return (
    <div>
      <input
        type="file"
        accept=".gpx"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const text = await file.text();
            setGpxData(text);
          }
        }}
      />
      {gpxData && <Map gpxData={gpxData} />}
    </div>
  );
}