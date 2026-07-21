import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildVictoriaSterlingGeometry } from "../../../../lib/masks/victoriaSterlingGeometry";
import type { MaskTheme } from "../../../../types/investor";
import { useMaskIdleTiltHover } from "./useMaskIdleTiltHover";

type Props = { theme: MaskTheme };

export default function VictoriaSterlingPreviewMask({ theme }: Props) {
  const { shell, backing, eyePositions, crownAccent } = useMemo(() => buildVictoriaSterlingGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); crownAccent.dispose(); }, [shell, backing, crownAccent]);

  const group = useRef<THREE.Group>(null);
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  const { setHovered } = useMaskIdleTiltHover({ group, shellMat, backingMat, accentMats: eyeMats });

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.3} roughness={0.45} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial ref={shellMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.06} roughness={0.3} metalness={0.5} flatShading />
      </mesh>
      <mesh geometry={crownAccent}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.12} roughness={0.25} metalness={0.6} flatShading />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.5, 1]}>
          <circleGeometry args={[0.14, 16]} />
          <meshStandardMaterial ref={(m) => { eyeMats.current[i] = m; }} color={theme.eyeColor} emissive={theme.eyeColor} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
