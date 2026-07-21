import { Canvas } from "@react-three/fiber";
import type { PersonalityId } from "../../../types/investor";
import { getInvestorProfile } from "../../../lib/investorProfiles";
import { PREVIEW_MASKS } from "./masks/previewMaskRegistry";
import InvestorMaskParticles from "./masks/InvestorMaskParticles";

type Props = { investorId: PersonalityId };

// Particle pacing per investor — most drift at the shared baseline; Dr. Quirk's read as chaotic
// glitch dust, Arthur's and Victoria's drift noticeably slower and calmer.
const PARTICLE_PACING: Record<PersonalityId, { speed: number; chaos: number }> = {
  tailung: { speed: 1, chaos: 1 },
  techbro: { speed: 1, chaos: 1 },
  mogul: { speed: 0.7, chaos: 0.8 },
  wildcard: { speed: 1.8, chaos: 2.4 },
  mentor: { speed: 0.55, chaos: 0.7 },
};

// Transparent WebGL scene for one investor's 3D preview head — their own dedicated, hand-sculpted
// BufferGeometry mask (looked up from PREVIEW_MASKS), a dramatic two-light rig drawn from their
// theme, and a floating particle field in their signature colors. Lazy-loaded by InvestorHeadPreview.
export default function InvestorHeadScene({ investorId }: Props) {
  const investor = getInvestorProfile(investorId);
  const theme = investor.maskTheme;
  const Mask = PREVIEW_MASKS[investor.id];
  const pacing = PARTICLE_PACING[investor.id];

  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <hemisphereLight args={[theme.ambientColor, "#050505", 0.35]} />
      <pointLight position={[0, -1.8, 2]} color={theme.pointLightColor} intensity={2.6} distance={10} decay={2} />
      <InvestorMaskParticles colors={theme.particleColors} speed={pacing.speed} chaos={pacing.chaos} />
      <Mask theme={theme} />
    </Canvas>
  );
}
