import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildMaskGeometries } from "../../../lib/maskGeometry";

export type MaskState = "idle" | "speaking" | "listening" | "strong" | "average" | "weak" | "winning" | "gameover";

type Props = { state: MaskState; intensity?: number };

// Per-state target pose: uniform scale, forward/back lean (z), head-tilt (rotation.z), eye glow
// intensity + color mix toward white-hot, and how open the mouth slit is.
const TARGETS: Record<MaskState, { scale: number; z: number; tilt: number; eye: number; hot: number; mouth: number }> = {
  idle: { scale: 1, z: 0, tilt: 0, eye: 1.6, hot: 0, mouth: 0.15 },
  speaking: { scale: 1.15, z: 0.35, tilt: 0, eye: 3.2, hot: 0.15, mouth: 0.7 },
  listening: { scale: 0.9, z: -0.15, tilt: 0, eye: 0.9, hot: 0, mouth: 0.05 },
  strong: { scale: 0.85, z: -0.25, tilt: 0, eye: 1.2, hot: 0, mouth: 0.2 },
  average: { scale: 1.0, z: 0.05, tilt: 0.04, eye: 2.0, hot: 0.3, mouth: 0.45 },
  weak: { scale: 1.3, z: 0.45, tilt: 0.12, eye: 4, hot: 0.85, mouth: 1.1 },
  winning: { scale: 1.05, z: 0.1, tilt: 0, eye: 2.2, hot: 0.1, mouth: 0.35 },
  gameover: { scale: 2.4, z: 1.6, tilt: 0, eye: 6, hot: 1, mouth: 1.4 },
};

// Blends a state's target pose toward idle by `intensity` (< 1 dampens the reaction, > 1 exaggerates
// it) — this is how each investor personality's mask feels calmer or more volatile
function scaleTarget(target: (typeof TARGETS)["idle"], intensity: number) {
  const idle = TARGETS.idle;
  return {
    scale: idle.scale + (target.scale - idle.scale) * intensity,
    z: idle.z + (target.z - idle.z) * intensity,
    tilt: idle.tilt + (target.tilt - idle.tilt) * intensity,
    eye: idle.eye + (target.eye - idle.eye) * intensity,
    hot: idle.hot + (target.hot - idle.hot) * intensity,
    mouth: idle.mouth + (target.mouth - idle.mouth) * intensity,
  };
}

// The interrogation mask: a low-poly geometric skull/face — shattered charcoal shell over an orange
// emissive backing, two glowing oval eye sockets, and a horizontal mouth slit that opens, closes, or
// curls into a one-sided smirk depending on the current interrogation state.
export default function ArenaMask({ state, intensity = 1 }: Props) {
  const { shell, backing, eyePositions, chin } = useMemo(() => buildMaskGeometries(), []);
  useEffect(() => () => { shell.dispose(); backing.dispose(); }, [shell, backing]);

  const group = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    const t = state === "idle" || state === "gameover" ? TARGETS[state] : scaleTarget(TARGETS[state], intensity);
    const lerp = Math.min(1, delta * 4.5);
    clock.current += delta;
    const idleSway = state === "idle" ? Math.sin(clock.current * 0.4) * 0.12 : 0;
    const idleBob = state === "idle" ? Math.sin(clock.current * 0.6) * 0.04 : 0;
    const nod = state === "winning" ? Math.sin(clock.current * 1.2) * 0.05 : 0;
    group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, t.scale, lerp));
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, t.z, lerp);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, idleBob, lerp);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, idleSway, lerp);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, nod, lerp);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, t.tilt, lerp);

    if (mouth.current) {
      // The mouth flaps while the mask is "talking": attacking with a question, or reacting to the
      // founder's last answer (which is also when the spoken judgment line plays via Web Speech)
      const isTalking = state === "speaking" || state === "strong" || state === "average" || state === "weak" || state === "winning";
      const openPulse = isTalking ? 1 + Math.sin(clock.current * 10) * 0.35 : 1;
      const targetScaleY = t.mouth * openPulse;
      mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, Math.max(0.06, targetScaleY), lerp);
      const targetTiltZ = state === "strong" || state === "winning" ? -0.35 : 0;
      mouth.current.rotation.z = THREE.MathUtils.lerp(mouth.current.rotation.z, targetTiltZ, lerp);
    }

    const eyeColor = new THREE.Color("#ffb347").lerp(new THREE.Color("#ffffff"), t.hot);
    for (const mat of eyeMats.current) {
      if (!mat) continue;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, t.eye, lerp);
      mat.emissive.lerp(eyeColor, lerp);
    }
    if (backingMat.current) backingMat.current.emissiveIntensity = THREE.MathUtils.lerp(backingMat.current.emissiveIntensity, 1.1 + t.eye * 0.25, lerp);
  });

  return (
    <group ref={group}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial ref={backingMat} color="#210900" emissive="#f97316" emissiveIntensity={1.3} roughness={0.5} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial color="#1a1a1a" emissive="#f97316" emissiveIntensity={0.1} roughness={0.6} metalness={0.25} flatShading />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p} scale={[1, 0.68, 1]}>
          <circleGeometry args={[0.17, 16]} />
          <meshStandardMaterial ref={(m) => { eyeMats.current[i] = m; }} color="#ff9a4d" emissive="#ffb347" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}
      <mesh ref={mouth} position={[chin.x, chin.y + 0.12, chin.z + 0.02]}>
        <boxGeometry args={[0.55, 0.06, 0.05]} />
        <meshStandardMaterial color="#2a0d00" emissive="#ff5500" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}
