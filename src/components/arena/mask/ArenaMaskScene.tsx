import { Canvas } from "@react-three/fiber";
import type { PersonalityId } from "../../../types/investor";
import { getInvestorProfile, getInvestorColor } from "../../../lib/investorProfiles";
import ArenaMask, { type MaskState } from "./ArenaMask";
import InvestorHeadMesh from "../preview/InvestorHeadMesh";
import ShockwaveRing from "./ShockwaveRing";

type Props = { state: MaskState; attackTrigger: number; investorId: PersonalityId; intensity?: number; isSpeaking?: boolean };

// R3F canvas housing the big interrogation presence: Tai Lung's dedicated ArenaMask geometry, or the
// selected investor's own wireframe InvestorHeadMesh for everyone else — plus a strong under-light in
// their color and a dim blue hemisphere from above, and the shockwave ring that punches outward
// whenever the mask attacks.
export default function ArenaMaskScene({ state, attackTrigger, investorId, intensity = 1, isSpeaking = false }: Props) {
  const investor = getInvestorProfile(investorId);
  const glowColor = getInvestorColor(investor);

  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ alpha: true }}>
      <hemisphereLight args={["#3b5bdb", "#050505", 0.3]} />
      <pointLight position={[0, -1.5, 2.4]} color={glowColor} intensity={5} distance={10} decay={2} />
      {investor.meshConfig ? (
        <InvestorHeadMesh meshConfig={investor.meshConfig} />
      ) : (
        <ArenaMask state={state} intensity={intensity} isSpeaking={isSpeaking} />
      )}
      <ShockwaveRing trigger={attackTrigger} />
    </Canvas>
  );
}
