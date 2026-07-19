import { Canvas } from "@react-three/fiber";
import ArenaMask, { type MaskState } from "./ArenaMask";
import ShockwaveRing from "./ShockwaveRing";

type Props = { state: MaskState; attackTrigger: number; intensity?: number; isSpeaking?: boolean };

// R3F canvas housing the big interrogation mask: a strong orange under-light plus a dim blue
// hemisphere from above, and the shockwave ring that punches outward whenever the mask attacks.
export default function ArenaMaskScene({ state, attackTrigger, intensity = 1, isSpeaking = false }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ alpha: true }}>
      <hemisphereLight args={["#3b5bdb", "#050505", 0.3]} />
      <pointLight position={[0, -1.5, 2.4]} color="#f97316" intensity={5} distance={10} decay={2} />
      <ArenaMask state={state} intensity={intensity} isSpeaking={isSpeaking} />
      <ShockwaveRing trigger={attackTrigger} />
    </Canvas>
  );
}
