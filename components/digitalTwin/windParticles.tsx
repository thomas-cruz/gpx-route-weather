"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function WindParticles({
    direction,
}: {
    speed: number;
    direction: number;
}) {
    const group =
        useRef<THREE.Group>(null);

    useFrame(() => {
        if (!group.current) {
            return;
        }

        group.current.rotation.y =
            (-direction *
                Math.PI) /
            180;
    });

    return (
        <group ref={group}>
            {Array.from({
                length: 50,
            }).map((_, i) => (
                <mesh
                    key={i}
                    position={[
                        (Math.random() - 0.5) *
                        20,
                        Math.random() * 3 +
                        1,
                        (Math.random() - 0.5) *
                        20,
                    ]}
                >
                    <boxGeometry
                        args={[
                            0.4,
                            0.02,
                            0.02,
                        ]}
                    />
                    <meshBasicMaterial />
                </mesh>
            ))}
        </group>
    );
}