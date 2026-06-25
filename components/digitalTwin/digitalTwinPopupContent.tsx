"use client";

import { useEffect, useRef, useState } from "react";
import DigitalTwinScene from "./digitalTwinScene";

export default function DigitalTwinPopupContent({ sample, activity }: any) {
  const [ready, setReady] = useState(false);

  const raf1 = useRef<number | null>(null);
  const raf2 = useRef<number | null>(null);

  useEffect(() => {
    raf1.current = requestAnimationFrame(() => {
      raf2.current = requestAnimationFrame(() => {
        setReady(true);
      });
    });

    return () => {
      if (raf1.current) cancelAnimationFrame(raf1.current);
      if (raf2.current) cancelAnimationFrame(raf2.current);
    };
  }, []);

  if (!ready) {
    return <div style={{ width: 280, height: 220 }}>Loading twin...</div>;
  }

  return (
    <div style={{ width: 280, height: 220, pointerEvents: 'none', zIndex: 400 }}>
      <DigitalTwinScene sample={sample} activity={activity} />
    </div>
  );
}