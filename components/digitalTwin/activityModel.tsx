"use client";

import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";

function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);

  console.log("GLTF:", gltf);

  return (
    <primitive
      object={gltf.scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

export default function ActivityModel({ activity }: any) {
  const url = useMemo(() => {
    if (activity === "cycling") return "/assets/cyclist_-_racing_position.glb";
    return "/assets/boy_jogging.glb";
  }, [activity]);

  return (
    <Suspense fallback={<mesh><boxGeometry /><meshNormalMaterial /></mesh>}>
      <Model url={url} />
    </Suspense>
  );
}