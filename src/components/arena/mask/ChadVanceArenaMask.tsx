import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildChadVanceGeometry } from "../../../lib/masks/chadVanceGeometry";
import type { MaskTheme } from "../../../types/investor";
import type { MaskState } from "../../../lib/maskPose";
import { useMaskAnimation } from "./useMaskAnimation";

type Props = { state: MaskState; intensity?: number; isSpeaking?: boolean; theme: MaskTheme };

// Chad Vance's battle mask: a sleek shattered shell over a cyan-emissive backing, a continuous glowing
// visor band standing in for eye sockets, and slicked-back angular hair spikes swept off the forehead.
export default function ChadVanceArenaMask({ state, intensity = 1, isSpeaking = false, theme }: Props) {
  const { shell, backing, chin, visorPosition, visorWidth, hairAccent } = useMemo(() => buildChadVanceGeometry(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); hairAccent.dispose(); }, [shell, backing, hairAccent]);

  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useMaskAnimation(state, intensity, isSpeaking, { group, mouth, backingMat, eyeMats }, theme.eyeColor);

  return (
    <group ref={group}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.3} roughness={0.4} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.1} roughness={0.35} metalness={0.55} flatShading />
      </mesh>
      <mesh geometry={hairAccent}>
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={0.15} roughness={0.3} metalness={0.6} flatShading />
      </mesh>
      <mesh position={visorPosition} scale={[visorWidth, 0.16, 1]}>
        <boxGeometry args={[1, 1, 0.06]} />
        <meshStandardMaterial
          ref={(m) => { eyeMats.current[0] = m; }}
          color={theme.eyeColor}
          emissive={theme.eyeColor}
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={mouth} position={[chin.x, chin.y + 0.12, chin.z + 0.02]}>
        <boxGeometry args={[0.5, 0.06, 0.05]} />
        <meshStandardMaterial color={theme.baseColor} emissive={theme.glowColor} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}
