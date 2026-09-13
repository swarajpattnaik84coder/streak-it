import { useLayoutEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Loads and renders the GLB character model.
 *
 * BONE INSPECTION RESULTS (from GLB JSON analysis):
 * - Model IS properly rigged with 65-joint humanoid skeleton ("Armature")
 * - Skinned meshes: Male_Ranger_Arms, Male_Ranger_Body, Male_Ranger_Head_Hood, etc.
 * - All mesh nodes use Skin 0 ("Armature")
 * - Confirmed bone names: root, pelvis, spine_01-03, clavicle_l/r, upperarm_l/r,
 *   lowerarm_l/r, hand_l/r, thigh_l/r, calf_l/r, foot_l/r, Head, neck_01
 *
 * T-POSE ROOT CAUSE:
 * - upperarm_l has Y ≈ +90 deg in local bone space → arm points horizontally
 * - upperarm_r has Y ≈ -90 deg in local bone space → arm points horizontally
 * - Previous fix used rotation.z += offset (WRONG axis — doesn't match local bone orientation)
 * - CORRECT FIX: use bone.quaternion.multiply(delta) to add a -75 deg Z rotation
 *   in bone-local space, which swings the arm downward.
 *
 * FACE ROOT CAUSE:
 * - Single mesh "Male_Ranger_Head_Hood" contains both face and hood geometry
 * - Cannot hide hood independently; face visibility must come from lighting.
 *
 * SKIN MATERIAL: "MI_Regular_Male" is used for the exposed skin (arm interior, Prim 1 of Male_Ranger_Arms)
 * HEAD MATERIAL: "MI_Ranger" (includes hood + potentially face)
 */
export default function CharacterModel({ modelPath = "/models/character_ranger.glb" }) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();

  const clone = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone(true);

    // ── 1. POSE: use quaternion multiplication to lower arms ──────────────
    // Delta quaternion: rotate -75 deg around local Z axis to swing arm down from T-pose
    // Computed analytically: arm goes from Y≈90 horizontal to natural side position
    const deltaL = new THREE.Quaternion(0, 0, Math.sin(-75 * Math.PI / 360), Math.cos(-75 * Math.PI / 360));
    const deltaR = new THREE.Quaternion(0, 0, Math.sin( 75 * Math.PI / 360), Math.cos( 75 * Math.PI / 360));
    // Slight elbow bend delta (Z axis of lowerarm in local bone space)
    const deltaElbow = new THREE.Quaternion(0, 0, Math.sin(12 * Math.PI / 360), Math.cos(12 * Math.PI / 360));

    const upperarm_l = cloned.getObjectByName("upperarm_l");
    const upperarm_r = cloned.getObjectByName("upperarm_r");
    const lowerarm_l = cloned.getObjectByName("lowerarm_l");
    const lowerarm_r = cloned.getObjectByName("lowerarm_r");
    const head       = cloned.getObjectByName("Head");

    if (upperarm_l) {
      upperarm_l.quaternion.multiply(deltaL);
    } else {
      console.warn("CharacterModel: upperarm_l bone NOT FOUND in clone");
    }
    if (upperarm_r) {
      upperarm_r.quaternion.multiply(deltaR);
    } else {
      console.warn("CharacterModel: upperarm_r bone NOT FOUND in clone");
    }
    // Small elbow bend to prevent straight-rod arms
    if (lowerarm_l) lowerarm_l.quaternion.multiply(deltaElbow);
    if (lowerarm_r) {
      const deltaElbowR = new THREE.Quaternion(0, 0, Math.sin(-12 * Math.PI / 360), Math.cos(-12 * Math.PI / 360));
      lowerarm_r.quaternion.multiply(deltaElbowR);
    }
    // Upright head
    if (head) {
      head.rotation.x = 0.03;
    }

    // ── 2. Material quality improvements ─────────────────────────────────
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
          // Ensure material is not transparent/hidden
          if (child.material.transparent) child.material.opacity = 1.0;
          child.material.needsUpdate = true;
        }
      }
    });

    return cloned;
  }, [scene]);

  useLayoutEffect(() => {
    if (!clone || !groupRef.current) return;

    // Force skeleton update after pose changes
    clone.traverse((child) => {
      if (child.isSkinnedMesh && child.skeleton) {
        child.skeleton.update();
      }
    });

    // Compute bounding box after pose normalization and ground on pedestal
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const targetHeight = 2.0;
    const scale = size.y > 0 ? targetHeight / size.y : 1;

    groupRef.current.scale.set(scale, scale, scale);
    groupRef.current.position.set(
      -center.x * scale,
      -box.min.y * scale,
      -center.z * scale
    );
  }, [clone]);

  if (!clone) return null;

  return (
    <group ref={groupRef}>
      <primitive object={clone} dispose={null} />
    </group>
  );
}

useGLTF.preload("/models/character_ranger.glb");