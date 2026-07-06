"use client";

/**
 * DigitalTwinScene - Creates a visualization showing weather conditions around a GPX route.
 * 
 * This component renders a three.js scene depicting:
 * - Real-time weather samples along a route (rain, wind, sun, sky color)
 * - An activity model (cyclist/jogger) positioned on the terrain
 * - Particle systems for wind and rain effects
 * 
 * @param sample - A weather data point containing: temperature, precipitation, uvIndex, windSpeed, windDirection, windType
 * @param activity - The activity type ("cycling" | other)
 */

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";

import ActivityModel from "./activityModel";
import WindParticles from "./windParticles";
import RainParticles from "./rainParticles";
import Sun from "./sun";
import { ActivityType } from "@/types/activity";

interface DigitalTwinSceneProps {
  /** Weather sample data object with properties like temperature, precipitation, uvIndex, windSpeed */
  sample: any;
  /** Type of activity (e.g., cycling, jogging) to render */
  activity: ActivityType;
}

export default function DigitalTwinScene({
  /** Weather data for the current position */
  sample,
  /** Activity model type to display */
  activity,
}: DigitalTwinSceneProps) {
  /**
   * Early return guard: requires valid weather sample data.
   * This prevents rendering issues when passing invalid/null data.
   */
  if (!sample) return null;

  /**
   * Dynamic sky color selection based on weather conditions:
   * - Heavy precipitation (>2mm): Dark gray ("stormy" - simulates overcast/rainy skies)
   * - High UV index (>7): Bright cyan/blue ("sunny midday" condition)
   * - Otherwise: Medium blue ("partly cloudy" default sky)
   */
  const skyColor =
    /** Check for heavy rainfall (stormy conditions) */
    sample.precipitation > 2
    ? "#6B7280"
    /** Check for intense sun (high UV index = bright sunlight) */
    : sample.uvIndex > 7
    ? "#4FC3F7"
    /** Default cloudy blue sky */
    : "#A5D8FF";    

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