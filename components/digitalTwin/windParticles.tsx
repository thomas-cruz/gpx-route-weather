"use client";

/**
 * WindParticles - Visualizes wind direction using animated particle stream.
 * 
 * Shows blue semi-transparent rectangular particles flowing horizontally
 * to indicate where the wind is pushing from.
 * 
 * @param speed - Wind velocity (km/h) - affects rotation speed indirectly via direction
 * @param direction - Wind direction in degrees (where wind comes FROM)
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function WindParticles({
    speed,
    direction,
}: {
    /** Wind speed in kilometers per hour */
    speed: number;
    /** Wind direction in degrees (compass cardinal direction, 0=N, 90=E, etc.) */
    direction: number;
}) {
    const group =
        /** React ref to access the root `<group>` primitive during animations */
        useRef<THREE.Group>(null);

    /**
     * Animates wind particles every frame using R3F's useFrame hook.
     * 
     * Rotation math:
     * - Direction is in degrees (0-360 compass)
     * - Math.PI converts to radians (rad = deg × π/180)
     * - Negated because Three.js rotations go opposite to compass directions
     * 
     * Example: Wind from East (90°) rotates around Y-axis to align particles westward
     */
    useFrame(() => {
        if (!group.current) {
            return;
        }

        /**
         * Update particle group rotation to face wind direction.
         * Particles align with wind vector so they visually flow FROM the direction source.
         * 
         * Conversion to radians (R3F requires radians, not degrees):
         *   radians = degrees × (π / 180)
         * Inlined constants avoided for clarity on formula intent.
         */
        group.current.rotation.y =
            (-direction *
                Math.PI) /
            180;
    });

    return (
        /**
         * Root group container for all wind particles.
         * All children inherit this rotational transformation so they rotate together.
         * 
         * Rendering 50 individual boxes (~50 DOM nodes worth) is fine for CPU cards.
         */
        <group ref={group}>
        {/* 
            Render 50 wind particle indicators scattered across viewing area.
            * Each rectangle represents a strand of air flow.
            *
            * Random positioning strategy:
            * - X position: (-0.5 to +0.5) × 40 = -20 to +20 units wide
            * - Y position (height): 1 to 13 units above ground level
            * - Z depth: Similar lateral spread creating volumetric cloud
            *
            * This spreads particles naturally without explicit ordering.
            
        */}
            {Array.from({
                /** Fixed particle count chosen through experimentation */
                length: 50,
            }).map((_, i) => (
                <mesh
                    key={i}
                    /** Random position within scattering bounds */
                    position={[
                        /** Horizontal spread: ±20 units around center */
                        (Math.random() - 0.5) *
                        20,
                        /** Vertical spread: 1 to 11 units height range */
                        Math.random() * 3 +
                        1,
                        /** Depth spread matching horizontal dimension */
                        (Math.random() - 0.5) *
                        20,
                    ]}
                >
                    <boxGeometry
                        /** Thin elongated box: 0.4 wide, 0.02 tall/thin, 0.02 deep */
                        /** Aspect ratio ~20:1 to suggest directional stripes */
                        args={[
                            0.4,
                            0.02,
                            0.02,
                        ]}
                    />
                    <meshBasicMaterial
                        /** Bright cyan sky-light color representing air/water vapor */
                        color="#38bdf8"
                        /** Translucent allows depth perception */
                        transparent
                        /** Not fully opaque but still visible in foreground */
                        opacity={0.8}
                    />
                </mesh>
            ))}
        </group>
    );
}