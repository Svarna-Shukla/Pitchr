import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildArthurPendeltonGeometry } from "../../../lib/masks/arthurPendeltonGeometry";
import type { MaskTheme } from "../../../types/investor";
import type { MaskState } from "../../../lib/maskPose";
import { useMaskAnimation } from "./useMaskAnimation";

type Props = { state: MaskState; intensity?: number; isSpeaking?: boolean; theme: MaskTheme };

// Arthur Pendelton's battle mask: a wide, rounded low-poly shell over an emerald-emissive backing,
// warm wide-set glowing eyes, and a stylized geometric beard fan hanging from the jaw.
export default function ArthurPendeltonArenaMask({ state, intensity = 1, isSpeaking = false, theme }: Props) {
  const { shell, backing, eyePositions, chin, beardAccent } = useMemo(() => buildArthurPendeltonGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); beardAccent.dispose(); }, [shell, backing, beardAccent]);

  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useMaskAnimation(state, intensity, isSpeaking, { group, mouth, backingMat, eyeMats }, theme.eyeColor);

  return (
    <group ref={group}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.2} roughness={0.55} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.1} roughness={0.6} metalness={0.2} flatShading />
      </mesh>
      <mesh geometry={beardAccent}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.15} roughness={0.6} metalness={0.15} flatShading />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.8, 1]}>
          <circleGeometry args={[0.18, 16]} />
          <meshStandardMaterial ref={(m) => { eyeMats.current[i] = m; }} color={theme.eyeColor} emissive={theme.eyeColor} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={mouth} position={[chin.x, chin.y + 0.16, chin.z + 0.04]}>
        <boxGeometry args={[0.5, 0.06, 0.05]} />
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}
