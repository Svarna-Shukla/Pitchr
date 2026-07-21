import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { EyeStyle, MeshConfig, MeshShape } from "../../../types/investor";

type Props = { meshConfig: MeshConfig };

// Builds the base wireframe geometry for one investor's head shape. Icosahedron (Wildcard) gets each
// vertex pushed outward by a deterministic random amount so it reads as an unpredictable, spiky burst
// rather than a perfectly regular solid — seeded off the vertex index so it's stable across re-renders.
function buildGeometry(shape: MeshShape): THREE.BufferGeometry {
  switch (shape) {
    case "octahedron":
      return new THREE.OctahedronGeometry(1.2, 0);
    case "box":
      return new THREE.BoxGeometry(0.95, 1.9, 0.95);
    case "icosahedron": {
      const geo = new THREE.IcosahedronGeometry(1.05, 0);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const spike = 1 + Math.abs(Math.sin(i * 12.9898)) * 0.55;
        pos.setXYZ(i, pos.getX(i) * spike, pos.getY(i) * spike, pos.getZ(i) * spike);
      }
      geo.computeVertexNormals();
      return geo;
    }
    case "torusKnot":
      return new THREE.TorusKnotGeometry(0.65, 0.24, 64, 8);
  }
}

// Renders this investor's pair of glowing eyes, positioned/shaped per their eyeStyle
function Eyes({ eyeStyle, color, accentColor }: { eyeStyle: EyeStyle; color: string; accentColor?: string }) {
  switch (eyeStyle) {
    case "visor":
      return (
        <mesh position={[0, 0.18, 0.95]}>
          <boxGeometry args={[0.62, 0.13, 0.06]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
        </mesh>
      );
    case "narrow":
      return (
        <>
          {[-0.26, 0.26].map((x) => (
            <mesh key={x} position={[x, 0.2, 0.95]} scale={[1, 0.35, 1]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={1.8} toneMapped={false} />
            </mesh>
          ))}
        </>
      );
    case "offset":
      return (
        <>
          <mesh position={[-0.28, 0.24, 0.92]} scale={0.85}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
          </mesh>
          <mesh position={[0.3, 0.08, 0.92]} scale={1.15}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={accentColor ?? color} emissive={accentColor ?? color} emissiveIntensity={2} toneMapped={false} />
          </mesh>
        </>
      );
    case "soft-oval":
      return (
        <>
          {[-0.27, 0.27].map((x) => (
            <mesh key={x} position={[x, 0.16, 0.92]} scale={[1, 0.7, 1]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} toneMapped={false} />
            </mesh>
          ))}
        </>
      );
    case "glow-round":
    default:
      return (
        <>
          {[-0.27, 0.27].map((x) => (
            <mesh key={x} position={[x, 0.18, 0.92]}>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.2} toneMapped={false} />
            </mesh>
          ))}
        </>
      );
  }
}

// One investor's rotating 3D wireframe head, shaped/colored/paced entirely by their meshConfig —
// used by the pre-session preview modal so each investor reads as visually distinct before the
// founder commits to a battle. Continuously rotates via useFrame; `erratic` investors (Wildcard) also
// wobble on the other two axes instead of spinning cleanly on one.
export default function InvestorHeadMesh({ meshConfig }: Props) {
  const { shape, color, accentColor, eyeStyle, rotationSpeed, erratic } = meshConfig;
  const geometry = useMemo(() => buildGeometry(shape), [shape]);
  const group = useRef<THREE.Group>(null);
  const eyeColor = eyeStyle === "offset" ? color : (accentColor ?? color);

  useFrame((frameState, delta) => {
    if (!group.current) return;
    group.current.rotation.y += rotationSpeed * delta * 60;
    if (erratic) {
      const t = frameState.clock.elapsedTime;
      group.current.rotation.x = Math.sin(t * 1.3) * 0.25;
      group.current.rotation.z = Math.cos(t * 0.9) * 0.18;
    }
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe roughness={0.4} metalness={0.2} />
      </mesh>
      <Eyes eyeStyle={eyeStyle} color={eyeColor} accentColor={accentColor} />
    </group>
  );
}
