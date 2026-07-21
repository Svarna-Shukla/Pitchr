import { useRef, useState } from "react";
import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const REDUCED_MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const BASE_SPEED = 0.16;
const HOVER_SPEED = 0.28;
const IDLE_AMPLITUDE = 0.55;

type GlowRefs = {
  group: RefObject<THREE.Group | null>;
  shellMat?: RefObject<THREE.MeshStandardMaterial | null>;
  backingMat: RefObject<THREE.MeshStandardMaterial | null>;
  accentMats?: RefObject<(THREE.MeshStandardMaterial | null)[]>;
};

// Shared idle/mouse-tilt/hover driver for every investor's preview mask — extracted from the original
// Tai Lung landing-page mask so all five get the exact same feel: a slow idle yaw, a gentle pointer
// follow, and a faster spin + brighter glow whenever hovered. No OrbitControls, purely useFrame.
export function useMaskIdleTiltHover(refs: GlowRefs) {
  const [hovered, setHovered] = useState(false);
  const clock = useRef(0);
  const glow = useRef(0.4);

  useFrame((state, delta) => {
    const { group, shellMat, backingMat, accentMats } = refs;
    if (!group.current) return;

    clock.current += delta * (hovered ? HOVER_SPEED : BASE_SPEED);
    const idleY = Math.sin(clock.current) * IDLE_AMPLITUDE;
    const pointerY = REDUCED_MOTION ? 0 : state.pointer.x * 0.35;
    const pointerX = REDUCED_MOTION ? 0 : -state.pointer.y * 0.2;

    group.current.rotation.y += (idleY + pointerY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (pointerX - group.current.rotation.x) * 0.05;

    const targetGlow = hovered ? 1.2 : 0.15;
    glow.current += (targetGlow - glow.current) * 0.08;
    if (shellMat?.current) shellMat.current.emissiveIntensity = 0.03 + glow.current * 0.12;
    if (backingMat.current) backingMat.current.emissiveIntensity = 1.1 + glow.current * 0.8;
    const accentIntensity = hovered ? 3.4 : 2;
    for (const mat of accentMats?.current ?? []) if (mat) mat.emissiveIntensity += (accentIntensity - mat.emissiveIntensity) * 0.1;
  });

  return { hovered, setHovered };
}
