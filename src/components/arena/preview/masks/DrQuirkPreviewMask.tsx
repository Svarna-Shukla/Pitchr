import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildDrQuirkGeometry } from "../../../../lib/masks/drQuirkGeometry";
import type { MaskTheme } from "../../../../types/investor";
import { useMaskIdleTiltHover } from "./useMaskIdleTiltHover";

type Props = { theme: MaskTheme };

export default function DrQuirkPreviewMask({ theme }: Props) {
  const { shell, backing, monoclePosition, monocleRadius, slitPosition, jawShards } = useMemo(() => buildDrQuirkGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); jawShards.dispose(); }, [shell, backing, jawShards]);

  const group = useRef<THREE.Group>(null);
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  const { setHovered } = useMaskIdleTiltHover({ group, shellMat, backingMat, accentMats: eyeMats });

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.3} roughness={0.6} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial ref={shellMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.08} roughness={0.7} metalness={0.15} flatShading />
      </mesh>
      <mesh geometry={jawShards}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.14} roughness={0.65} metalness={0.1} flatShading />
      </mesh>

      <mesh position={monoclePosition} scale={[1, 0.78, 1]}>
        <circleGeometry args={[monocleRadius, 20]} />
        <meshStandardMaterial ref={(m) => { eyeMats.current[0] = m; }} color="#84cc16" emissive="#84cc16" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[monoclePosition.x, monoclePosition.y, monoclePosition.z + 0.01]} scale={[1, 0.78, 1]}>
        <ringGeometry args={[monocleRadius * 0.95, monocleRadius * 1.12, 24]} />
        <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={1.4} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={slitPosition} scale={[1, 0.32, 1]} rotation={[0, 0, -0.18]}>
        <circleGeometry args={[0.15, 12]} />
        <meshStandardMaterial ref={(m) => { eyeMats.current[1] = m; }} color="#ff007f" emissive="#ff007f" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}
