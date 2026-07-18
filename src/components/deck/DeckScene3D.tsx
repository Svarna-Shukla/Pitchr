import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

const PLANE_COUNT = 6;
const REDUCED_MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A fan of thin card-like planes standing in for pitch-deck slides, tilted into a shallow arc
function SlideFan() {
  const group = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  const planes = useMemo(
    () =>
      Array.from({ length: PLANE_COUNT }, (_, i) => {
        const t = i / (PLANE_COUNT - 1) - 0.5;
        return {
          position: [t * 1.6, Math.abs(t) * -0.3, -Math.abs(t) * 0.5] as [number, number, number],
          rotation: [0, t * 0.9, t * -0.25] as [number, number, number],
          accent: i % 2 === 0,
        };
      }),
    []
  );

  // Lerps the whole fan toward the pointer for a subtle, reactive parallax tilt
  useFrame((state) => {
    if (!group.current) return;
    if (!REDUCED_MOTION) {
      target.current.x = state.pointer.y * 0.15;
      target.current.y = state.pointer.x * 0.3;
    }
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * 0.04;
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * 0.04;
  });

  return (
    <Float speed={REDUCED_MOTION ? 0 : 1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={group}>
        {planes.map((p, i) => (
          <mesh key={i} position={p.position} rotation={p.rotation}>
            <planeGeometry args={[1.1, 1.5, 1, 1]} />
            <meshStandardMaterial
              color={p.accent ? "#241a0d" : "#1a1a1e"}
              emissive={p.accent ? "#f0a020" : "#000000"}
              emissiveIntensity={p.accent ? 0.22 : 0}
              roughness={0.55}
              metalness={0.15}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

// Restrained WebGL centerpiece for the Deck tab hero: a fan of card planes with real PBR lighting
export default function DeckScene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 3, 4]} intensity={1.1} />
      <pointLight position={[-2, -1, 2]} intensity={12} color="#f0a020" />
      <SlideFan />
    </Canvas>
  );
}
