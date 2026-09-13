import { OrbitControls } from "@react-three/drei";

/**
 * Camera controls for the 3D character viewer.
 * Enables rotation and zoom while disabling panning and locking polar limits.
 */
export default function CharacterControls() {
  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableZoom={true}
      minDistance={1.8}
      maxDistance={5.0}
      // Vertical angle limits: prevents looking underneath floor/pedestal
      minPolarAngle={Math.PI / 4}        // 45 degrees
      maxPolarAngle={Math.PI / 2.05}     // ~87 degrees
      // Center camera target at character chest level (~1.0m height)
      target={[0, 1.0, 0]}
      rotateSpeed={0.65}
      zoomSpeed={0.8}
    />
  );
}