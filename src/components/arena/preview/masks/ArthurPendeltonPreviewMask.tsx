import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildArthurPendeltonGeometry } from "../../../../lib/masks/arthurPendeltonGeometry";
import type { MaskTheme } from "../../../../types/investor";
import { useMaskIdleTiltHover } from "./useMaskIdleTiltHover";

type Props = { theme: MaskTheme };

export default function ArthurPendeltonPreviewMask({ theme }: Props) {
  const { shell, backing, eyePositions, beardAccent } = useMemo(() => buildArthurPendeltonGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); beardAccent.dispose(); }, [shell, backing, beardAccent]);

  const group = useRef<THREE.Group>(null);
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  const { setHovered } = useMaskIdleTiltHover({ group, shellMat, backingMat, accentMats: eyeMats });

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.2} roughness={0.55} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial ref={shellMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.08} roughness={0.6} metalness={0.2} flatShading />
      </mesh>
      <mesh geometry={beardAccent}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.1} roughness={0.6} metalness={0.15} flatShading />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.8, 1]}>
          <circleGeometry args={[0.16, 16]} />
          <meshStandardMaterial ref={(m) => { eyeMats.current[i] = m; }} color={theme.eyeColor} emissive={theme.eyeColor} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
