export default function Sun({
    uvIndex,
}: {
    uvIndex: number;
}) {
    return (
        <>
            <directionalLight
                position={[10, 15, 5]}
                intensity={
                    Math.max(0.5, uvIndex / 2)
                }
            />

            <mesh position={[8, 10, 5]}>
                <sphereGeometry args={[0.8]} />
                <meshBasicMaterial color="#FFD54A" />
            </mesh>
        </>
    );
}