import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildDrQuirkGeometry } from "../../../lib/masks/drQuirkGeometry";
import type { MaskTheme } from "../../../types/investor";
import type { MaskState } from "../../../lib/maskPose";
import { useMaskAnimation } from "./useMaskAnimation";

type Props = { state: MaskState; intensity?: number; isSpeaking?: boolean; theme: MaskTheme };

// Dr. Quirk's battle mask: an asymmetric, fractured shell over a magenta-emissive backing, one big
// glowing monocle-ring socket, one sharp mismatched slit, and jagged shards jutting off the jawline.
export default function DrQuirkArenaMask({ state, intensity = 1, isSpeaking = false, theme }: Props) {
  const { shell, backing, chin, monoclePosition, monocleRadius, slitPosition, jawShards } = useMemo(() => buildDrQuirkGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); jawShards.dispose(); }, [shell, backing, jawShards]);

  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useMaskAnimation(state, intensity, isSpeaking, { group, mouth, backingMat, eyeMats }, theme.eyeColor);

  return (
    <group ref={group}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.3} roughness={0.6} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.12} roughness={0.7} metalness={0.15} flatShading />
      </mesh>
      <mesh geometry={jawShards}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.2} roughness={0.65} metalness={0.1} flatShading />
      </mesh>

      <mesh position={monoclePosition} scale={[1, 0.78, 1]}>
        <circleGeometry args={[monocleRadius, 20]} />
        <meshStandardMaterial ref={(m) => { eyeMats.current[0] = m; }} color="#84cc16" emissive="#84cc16" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      <mesh position={[monoclePosition.x, monoclePosition.y, monoclePosition.z + 0.01]} scale={[1, 0.78, 1]} rotation={[0, 0, 0]}>
        <ringGeometry args={[monocleRadius * 0.95, monocleRadius * 1.12, 24]} />
        <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={1.2} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={slitPosition} scale={[1, 0.32, 1]} rotation={[0, 0, -0.18]}>
        <circleGeometry args={[0.15, 12]} />
        <meshStandardMaterial ref={(m) => { eyeMats.current[1] = m; }} color="#ff007f" emissive="#ff007f" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>

      <mesh ref={mouth} position={[chin.x, chin.y + 0.12, chin.z + 0.02]} rotation={[0, 0, 0.1]}>
        <boxGeometry args={[0.5, 0.06, 0.05]} />
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}
