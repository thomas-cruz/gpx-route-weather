"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";

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
  const skyColor =
    sample.precipitation > 2
        ? "#6B7280"      // stormy
        : sample.uvIndex > 7
        ? "#4FC3F7"      // bright blue
        : "#A5D8FF";    // cloudy blue

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
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(skyColor);
        }}
      >
        <ambientLight intensity={0.5} />
        <Sky
          distance={450000}
          sunPosition={[5, 2, 5]}
          inclination={0.5}
          azimuth={0.25}
        />

        <Sun uvIndex={sample.uvIndex} />

        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
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