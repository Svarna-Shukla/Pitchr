import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { colors: [string, string]; count?: number; speed?: number; chaos?: number };

const SPREAD_X = 2.6;
const SPREAD_Z = 1.6;
const HEIGHT = 3.2;
const REDUCED_MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Generalizes the landing-page mask's particle field so every investor gets their own floating spark
// field drifting slowly upward around their head, in their own two signature colors. `chaos` widens
// the horizontal drift for investors whose particles should read as more erratic (e.g. Dr. Quirk).
export default function InvestorMaskParticles({ colors, count = 60, speed = 1, chaos = 1 }: Props) {
  const points = useRef<THREE.Points>(null);

  const { positions, colorAttr, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colorAttr = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const c0 = new THREE.Color(colors[0]);
    const c1 = new THREE.Color(colors[1]);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      positions[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
      const c = Math.random() > 0.5 ? c0 : c1;
      colorAttr[i * 3] = c.r;
      colorAttr[i * 3 + 1] = c.g;
      colorAttr[i * 3 + 2] = c.b;
      speeds[i] = (0.15 + Math.random() * 0.35) * speed;
    }
    return { positions, colorAttr, speeds };
  }, [colors, count, speed]);

  useFrame((state, delta) => {
    if (REDUCED_MOTION) return;
    const geo = points.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * delta;
      if (y > HEIGHT / 2) y = -HEIGHT / 2;
      const x = pos.getX(i) + Math.sin(state.clock.elapsedTime * 0.6 * chaos + i) * 0.05 * chaos * delta;
      pos.setY(i, y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colorAttr, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.85} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}
