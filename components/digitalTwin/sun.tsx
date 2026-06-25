export default function Sun({
    uvIndex,
}: {
    uvIndex: number;
}) {
    return (
        <directionalLight
            position={[10, 15, 5]}
            intensity={
                Math.max(0.5, uvIndex / 2)
            }
        />
    );
}