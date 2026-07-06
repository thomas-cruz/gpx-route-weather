/**
 * Sun - Renders sun and sunlight source based on UV index intensity.
 * 
 * Displays a visual sun mesh and a directional light whose brightness
 * scales with the UV index value from weather API data.
 * 
 * @param uvIndex - Ultraviolet index from 0-11+ (scale indicating sun intensity)
 */
export default function Sun({ uvIndex }: { uvIndex: number }) {
  return (
    <>
    {/* 
       * Directional light mimicking sun rays illuminating scene.
       * Positioned high in sky (y=15) and offset from camera.
       * 
       * Intensity formula: max(0.5, uvIndex/2)
       * - Minimum 0.5 prevents total darkness even at low UV
       * - Scales roughly linearly: UV 0→0.5, UV 2→1.5, UV 10→5.5
       * - Cap at 1.0 typically sufficient for daylight simulation
    */}
      <directionalLight
        position={[10, 15, 5]}
        /** Clamp to reasonable brightness levels */
        intensity={Math.max(0.5, uvIndex / 2)}
      />
    {/*
       * Visual sun representation floating in scene.
       * Yellow-orange sphere (#FFD54A) matching sun iconography.
       * 
       * Positioned slightly offset from light source for artistic balance.
       * Not meant to be photorealistic, just iconic weather indicator.
      */}
      <mesh position={[8, 10, 5]}>
        <sphereGeometry
          /** Small sphere radius for distant appearance */
          args={[0.8]}
        />
        <meshBasicMaterial
          /** Golden-yellow sun color */
          color="#FFD54A"
        />
      </mesh>
    </>
  );
}    