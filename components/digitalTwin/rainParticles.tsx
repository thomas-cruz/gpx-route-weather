"use client";

import { useMemo } from "react";

export default function RainParticles({
    precipitation,
}: {
    precipitation: number;
}) {
    const drops = useMemo(() => {
        const count = Math.min(
            500,
            precipitation * 100
        );

        return Array.from(
            { length: count },
            () => ({
                x:
                    (Math.random() - 0.5) *
                    20,

                y:
                    Math.random() * 10,

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
                        d.x,
                        d.y,
                        d.z,
                    ]}
                >
                    <sphereGeometry
                        args={[0.03]}
                    />
                    <meshBasicMaterial 
                        color="#3b82f6"
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            ))}
        </>
    );
}