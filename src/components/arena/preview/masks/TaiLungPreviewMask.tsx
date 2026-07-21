import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildMaskGeometries } from "../../../../lib/maskGeometry";
import type { MaskTheme } from "../../../../types/investor";
import { useMaskIdleTiltHover } from "./useMaskIdleTiltHover";

type Props = { theme: MaskTheme };

// Tai Lung's preview mask: the exact hand-sculpted geometry from the original mask, ported into the
// shared per-investor preview pattern (idle yaw + mouse-tilt + hover glow) so his selection-modal
// presence matches the other four instead of sitting on a static idle pose.
export default function TaiLungPreviewMask({ theme }: Props) {
  const { shell, backing, eyePositions } = useMemo(() => buildMaskGeometries(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); }, [shell, backing]);

  const group = useRef<THREE.Group>(null);
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  const { setHovered } = useMaskIdleTiltHover({ group, shellMat, backingMat, accentMats: eyeMats });

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.3} roughness={0.5} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial ref={shellMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.08} roughness={0.65} metalness={0.2} flatShading />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p}>
          <circleGeometry args={[0.13, 12]} />
          <meshStandardMaterial ref={(m) => { eyeMats.current[i] = m; }} color={theme.eyeColor} emissive={theme.eyeColor} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
