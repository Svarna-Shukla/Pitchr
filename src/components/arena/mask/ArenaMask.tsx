import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildMaskGeometries } from "../../../lib/maskGeometry";
import type { MaskState } from "../../../lib/maskPose";
import { useMaskAnimation } from "./useMaskAnimation";

export type { MaskState } from "../../../lib/maskPose";

type Props = { state: MaskState; intensity?: number; isSpeaking?: boolean };

// The interrogation mask: a low-poly geometric skull/face — shattered charcoal shell over an orange
// emissive backing, two glowing oval eye sockets, and a horizontal mouth slit that opens, closes, or
// curls into a one-sided smirk depending on the current interrogation state. All frame-by-frame pose
// animation lives in useMaskAnimation; this component owns only the geometry and materials.
export default function ArenaMask({ state, intensity = 1, isSpeaking = false }: Props) {
  const { shell, backing, eyePositions, chin } = useMemo(() => buildMaskGeometries(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); }, [shell, backing]);

  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useMaskAnimation(state, intensity, isSpeaking, { group, mouth, backingMat, eyeMats });

  return (
    <group ref={group}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color="#210900" emissive="#f97316" emissiveIntensity={1.3} roughness={0.5} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial color="#1a1a1a" emissive="#f97316" emissiveIntensity={0.1} roughness={0.6} metalness={0.25} flatShading />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.68, 1]}>
          <circleGeometry args={[0.17, 16]} />
          <meshStandardMaterial ref={(m) => { eyeMats.current[i] = m; }} color="#ff9a4d" emissive="#ffb347" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={mouth} position={[chin.x, chin.y + 0.12, chin.z + 0.02]}>
        <boxGeometry args={[0.55, 0.06, 0.05]} />
        <meshStandardMaterial color="#2a0d00" emissive="#ff5500" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}
