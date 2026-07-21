import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildVictoriaSterlingGeometry } from "../../../lib/masks/victoriaSterlingGeometry";
import type { MaskTheme } from "../../../types/investor";
import type { MaskState } from "../../../lib/maskPose";
import { useMaskAnimation } from "./useMaskAnimation";

type Props = { state: MaskState; intensity?: number; isSpeaking?: boolean; theme: MaskTheme };

// Victoria Sterling's battle mask: a razor-cheeked obsidian shell over an amethyst-emissive backing,
// narrow calculating eye slits, and a slick geometric crown standing in for a hairframe.
export default function VictoriaSterlingArenaMask({ state, intensity = 1, isSpeaking = false, theme }: Props) {
  const { shell, backing, eyePositions, chin, crownAccent } = useMemo(() => buildVictoriaSterlingGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); crownAccent.dispose(); }, [shell, backing, crownAccent]);

  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useMaskAnimation(state, intensity, isSpeaking, { group, mouth, backingMat, eyeMats }, theme.eyeColor);

  return (
    <group ref={group}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.3} roughness={0.45} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.1} roughness={0.3} metalness={0.5} flatShading />
      </mesh>
      <mesh geometry={crownAccent}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.2} roughness={0.25} metalness={0.6} flatShading />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.5, 1]}>
          <circleGeometry args={[0.16, 16]} />
          <meshStandardMaterial ref={(m) => { eyeMats.current[i] = m; }} color={theme.eyeColor} emissive={theme.eyeColor} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={mouth} position={[chin.x, chin.y + 0.12, chin.z + 0.02]}>
        <boxGeometry args={[0.42, 0.05, 0.05]} />
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}
