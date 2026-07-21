import { Canvas } from "@react-three/fiber";
import type { PersonalityId } from "../../../types/investor";
import { getInvestorProfile, getInvestorColor } from "../../../lib/investorProfiles";
import ArenaMask from "../mask/ArenaMask";
import InvestorHeadMesh from "./InvestorHeadMesh";

type Props = { investorId: PersonalityId };

// Transparent WebGL scene for one investor's 3D preview head — small dramatic two-light rig (a cool
// hemisphere fill plus a colored point light matched to the investor's own color) so each preview
// reads as a distinct, glowing presence. Tai Lung renders his dedicated ArenaMask geometry (the same
// one used in the live battle arena); every other investor renders their wireframe InvestorHeadMesh.
// Lazy-loaded by InvestorHeadPreview.
export default function InvestorHeadScene({ investorId }: Props) {
  const investor = getInvestorProfile(investorId);
  const glowColor = getInvestorColor(investor);

  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <hemisphereLight args={["#ffffff", "#050505", 0.35]} />
      <pointLight position={[1.5, 1.5, 2.5]} color={glowColor} intensity={2.2} distance={10} decay={2} />
      {investor.meshConfig ? <InvestorHeadMesh meshConfig={investor.meshConfig} /> : <ArenaMask state="idle" intensity={1} isSpeaking={false} />}
    </Canvas>
  );
}
