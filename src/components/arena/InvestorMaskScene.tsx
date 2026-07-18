import { Canvas } from "@react-three/fiber";
import InvestorMask from "./InvestorMask";

type Props = { isAttacking: boolean; isListening: boolean };

// Lightweight R3F canvas housing the investor's 3D mask, isolated so InvestorSide.tsx stays layout-only
export default function InvestorMaskScene({ isAttacking, isListening }: Props) {
  return (
    <Canvas camera={{ position: [0, 0, 4.6], fov: 36 }} gl={{ alpha: true }}>
      <hemisphereLight intensity={0.6} color="#ffb347" groundColor="#000000" />
      <pointLight position={[2, 2, 3]} intensity={40} color="#ff7700" />
      <InvestorMask isAttacking={isAttacking} isListening={isListening} />
    </Canvas>
  );
}
