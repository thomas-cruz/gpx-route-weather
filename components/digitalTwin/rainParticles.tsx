"use client";

/**
 * RainParticles - Simulates falling rain with particle-based visualization.
 * 
 * Renders spherical water droplets colored teal to distinguish from terrain.
 * Rain density scales with precipitation input (more rain = more drops shown).
 * 
 * @param precipitation - Measured rainfall in mm (controls visible drop count)
 */

import { useMemo } from "react";

export default function RainParticles({
  precipitation,
}: {
  /** Precipitation intensity in millimeters */
  precipitation: number;
}) {
    /**
     * Memoize rain drop generation to avoid recreating on every render.
     * Recalculate only when precipitation intensity changes.
     * 
     * Visibility scaling formula:
     * - Light rain (≤1mm): Few to zero drops visible
     * - Showers (1-5mm): Moderate rain effect (~100-500 drops)
     * - Heavy storms (>5mm): Max density capped at 500 drops
     * 
     * Cap prevents browser slowdowns with hundreds of meshes on screen.
     */
    const drops = useMemo(() => {
      const count = Math.min(
        /** Performance safety cap for particle count */
        500,
        /** Precipitation multiplier: more rain = more visible drops */
        precipitation * 100
      );

      return Array.from(
        /** Generate exact array length for loop */
        { length: count },
        () => ({
          /** Scattered horizontal position across scene */
          x:
            (Math.random() - 0.5) *
            20,

          /** Vertical position from ground up */
          y:
            Math.random() * 10,

          /** Depth position creating 3D cloud */
          z:
            (Math.random() - 0.5) *
            20,
        })
      );
    }, [precipitation]);

    return (
      <>
        {drops.map((d, i) => (
          <mesh
            key={i}
            position={[
              /** Drop's X world coordinate (horizontal position) */
              d.x,
              /** Drop's Y world coordinate (height above ground) */
              d.y,
              /** Drop's Z world coordinate (depth from camera) */
              d.z,
            ]}
          >
            <sphereGeometry
              /** Radius 0.03 units ≈ 3cm in meter-scale scene (reasonable rain drop size) */
              args={[0.03]}
            />
            <meshBasicMaterial
              /** Cyan-blue matches typical rain visualization aesthetics */
              color="#3b82f6"
              /** Semi-transparent so drops fade visually */
              transparent
              /** Moderate opacity - not ghost-like but not solid */
              opacity={0.7}
            />
          </mesh>
        ))}
      </>
    );    
}