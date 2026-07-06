"use client";

/**
 * ActivityModel - Loads and displays a 3D GLTF model representing an athlete.
 * 
 * Supports two model types:
 * - Cyclist model: Shows a race-position cyclist avatar
 * - Jogging model: Shows a runner avatar
 * 
 * Uses GLTFLoader from @react-three/drei to load external .glb assets.
 */

import { useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";

/**
 * Model helper component that wraps GLTF loading.
 * Extracted to simplify the main ActivityModel component.
 * 
 * @param url - Path to the GLTF/GLB asset to load
 */
function Model({ url }: { url: string }) {
  /**
   * useGLTF is a hook from @react-three/drei that loads GLTF models asynchronously.
   * It returns the loaded scene ready to be rendered as a Three.js primitive.
   */
  const gltf = useGLTF(url);

  /** Debug log for development - remove in production */
  console.log("GLTF:", gltf);

  /**
   * Renders the loaded GLTF scene as a Three.js "primitive" object.
   * - object: The scene from the GLTF model
   * - scale: 1 (no scaling applied)
   * - position: [0, 0, 0] (centered in world space)
   */
  return (
    <primitive
      object={gltf.scene}
      scale={1}
      position={[0, 0, 0]}
    />
  );
}

/**
 * Main activity model component that determines which model to load
 * based on the activity type passed as a prop.
 * 
 * @param activity - Either "cycling" for cyclist model, or any other value for jogger model
 */
export default function ActivityModel({ activity }: any) {
  /**
   * Memoized URL computation to avoid unnecessary recalculations.
   * We pass 'activity' as dependency since that's what changes this URL.
   * Once computed, the URL stays stable even if other values change.
   */
  const url = useMemo(() => {
    /**
     * Select appropriate GLTF asset based on activity type:
     * - "cycling": Race-position cyclist avatar (dynamic sport pose)
     * - default/jogging: Running avatar (fallback for non-cycling activities)
     */
    if (activity === "cycling") {
      return "/assets/cyclist_-_racing_position.glb";
    }
    /** Fallback to jogging/run avatar for all other activity types */
    return "/assets/boy_jogging.glb";
  }, [activity]);

  /**
   * Suspense wrapper with a fallback loading indicator.
   * While GLTF model is loading, shows a simple box with normal material
   * to prevent flickering during async asset loading.
   */
  return (
    <Suspense fallback={<mesh><boxGeometry /><meshNormalMaterial /></mesh>}>
      <Model url={url} />
    </Suspense>
  );
}    