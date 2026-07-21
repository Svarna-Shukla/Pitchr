import { Canvas } from "@react-three/fiber";
import type { PersonalityId } from "../../../types/investor";
import { getInvestorProfile } from "../../../lib/investorProfiles";
import type { MaskState } from "./ArenaMask";
import { ARENA_MASKS } from "./arenaMaskRegistry";
import ShockwaveRing from "./ShockwaveRing";

export type { MaskState } from "./ArenaMask";

type Props = { state: MaskState; attackTrigger: number; investorId: PersonalityId; intensity?: number; isSpeaking?: boolean };

// R3F canvas housing the big interrogation presence: each investor's own dedicated, hand-sculpted
// BufferGeometry mask (looked up from ARENA_MASKS) — plus a strong under-light and a contrasting
// ambient light both drawn from that investor's theme, and the shockwave ring that punches outward
// whenever the mask attacks.
export default function ArenaMaskScene({ state, attackTrigger, investorId, intensity = 1, isSpeaking = false }: Props) {
  const investor = getInvestorProfile(investorId);
  const theme = investor.maskTheme;
  const Mask = ARENA_MASKS[investor.id];

  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ alpha: true }}>
      <hemisphereLight args={[theme.ambientColor, "#050505", 0.35]} />
      <pointLight position={[0, -1.5, 2.4]} color={theme.pointLightColor} intensity={5} distance={10} decay={2} />
      <Mask state={state} intensity={intensity} isSpeaking={isSpeaking} theme={theme} />
      <ShockwaveRing trigger={attackTrigger} />
    </Canvas>
  );
}
