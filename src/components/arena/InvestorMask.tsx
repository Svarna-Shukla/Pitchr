import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { isAttacking: boolean; isListening: boolean };

const EYE_POSITIONS: [number, number, number][] = [
  [-0.55, 0.25, 1.15],
  [0.55, 0.25, 1.15],
];

// Rounded, organic investor head: a heavily segmented sphere (dome silhouette, flat-shaded so it still
// reads as low-poly) with two sunken eye sockets and a horizontal mouth slit that pulses when attacking.
export default function InvestorMask({ isAttacking, isListening }: Props) {
  const group = useRef<THREE.Group>(null);
  const headMat = useRef<THREE.MeshStandardMaterial>(null);
  const mouthMat = useRef<THREE.MeshStandardMaterial>(null);

  // Lerps scale/position toward an attacking lunge or a calmer listening pose, and pulses the mouth glow
  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = isAttacking ? 1.3 : 1.0;
    const targetZ = isAttacking ? 0.4 : 0;
    const lerpSpeed = Math.min(1, delta * 5);
    const nextScale = THREE.MathUtils.lerp(group.current.scale.x, targetScale, lerpSpeed);
    group.current.scale.setScalar(nextScale);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetZ, lerpSpeed);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, isAttacking ? 0.1 : 0, lerpSpeed);

    const targetMouthGlow = isAttacking ? 3.5 : isListening ? 0.6 : 1.6;
    if (mouthMat.current) mouthMat.current.emissiveIntensity = THREE.MathUtils.lerp(mouthMat.current.emissiveIntensity, targetMouthGlow, lerpSpeed);
    const targetHeadGlow = isListening ? 0.15 : 0.4;
    if (headMat.current) headMat.current.emissiveIntensity = THREE.MathUtils.lerp(headMat.current.emissiveIntensity, targetHeadGlow, lerpSpeed);
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial ref={headMat} flatShading color="#ff7700" emissive="#331100" emissiveIntensity={0.4} roughness={0.6} />
      </mesh>
      {EYE_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.22, 6, 6]} />
          <meshStandardMaterial flatShading color="#1a0a00" emissive="#7a2a00" emissiveIntensity={0.5} roughness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -0.85, 1.2]}>
        <boxGeometry args={[0.8, 0.1, 0.1]} />
        <meshStandardMaterial ref={mouthMat} flatShading color="#2a0d00" emissive="#ff5500" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
    </group>
  );
}
