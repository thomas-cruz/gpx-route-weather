"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import ActivityModel from "./activityModel";
import WindParticles from "./windParticles";
import RainParticles from "./rainParticles";
import Sun from "./sun";
import { ActivityType } from "@/types/activity";

interface DigitalTwinSceneProps {
  sample: any;
  activity: ActivityType;
}

export default function DigitalTwinScene({
  sample,
  activity,
}: DigitalTwinSceneProps) {
  if (!sample) return null;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: false,
          alpha: true,
        }}
        camera={{
          position: [0, 2, 6],
          fov: 50,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <hemisphereLight
            // skyColor="#87ceeb"
            groundColor="#444444"
            intensity={1.2}
        />

        <Sun uvIndex={sample.uvIndex} />

        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          {/* <meshStandardMaterial /> */}
          <meshStandardMaterial
              color="#4b5563"
              roughness={1}
          />
        </mesh>

        <group position={[0, 1, 0]}>
          <ActivityModel activity={activity} />
        </group>

        <WindParticles
          speed={sample.windSpeed}
          direction={sample.windDirection}
        />

        <RainParticles precipitation={sample.precipitation} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}

// export default function DigitalTwinScene() {
//   return <div style={{ color: "red" }}>TWIN LOADED</div>;
// }