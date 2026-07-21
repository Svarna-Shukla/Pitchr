import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildChadVanceGeometry } from "../../../../lib/masks/chadVanceGeometry";
import type { MaskTheme } from "../../../../types/investor";
import { useMaskIdleTiltHover } from "./useMaskIdleTiltHover";

type Props = { theme: MaskTheme };

export default function ChadVancePreviewMask({ theme }: Props) {
  const { shell, backing, visorPosition, visorWidth, hairAccent } = useMemo(() => buildChadVanceGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); hairAccent.dispose(); }, [shell, backing, hairAccent]);

  const group = useRef<THREE.Group>(null);
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  const { setHovered } = useMaskIdleTiltHover({ group, shellMat, backingMat, accentMats: eyeMats });

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.3} roughness={0.4} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial ref={shellMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.06} roughness={0.35} metalness={0.55} flatShading />
      </mesh>
      <mesh geometry={hairAccent}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.1} roughness={0.3} metalness={0.6} flatShading />
      </mesh>
      <mesh position={visorPosition} scale={[visorWidth, 0.16, 1]}>
        <boxGeometry args={[1, 1, 0.06]} />
        <meshStandardMaterial ref={(m) => { eyeMats.current[0] = m; }} color={theme.eyeColor} emissive={theme.eyeColor} emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  );
}
