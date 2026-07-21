import { Suspense, lazy } from "react";
import type { PersonalityId } from "../../../types/investor";
import { getInvestorProfile, getInvestorColor } from "../../../lib/investorProfiles";
import { isWebGLAvailable } from "../../../lib/webgl";

const InvestorHeadScene = lazy(() => import("./InvestorHeadScene"));

type Props = { investorId: PersonalityId };

// Plain CSS fallback shown in place of the Canvas when the browser can't create a WebGL context
function NoWebGLFallback({ color }: { color: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-24 w-24 rounded-full" style={{ background: `radial-gradient(circle, ${color}55, transparent 70%)`, boxShadow: `0 0 50px 18px ${color}33` }} />
    </div>
  );
}

// Sizeable, self-contained 3D preview: one investor's own dedicated, hand-sculpted mask, gated behind
// a WebGL availability check like the hero/arena masks. Used inside InvestorPreviewModal.
export default function InvestorHeadPreview({ investorId }: Props) {
  const fallbackColor = getInvestorColor(getInvestorProfile(investorId));
  if (!isWebGLAvailable()) return <NoWebGLFallback color={fallbackColor} />;

  return (
    <Suspense fallback={<NoWebGLFallback color={fallbackColor} />}>
      <InvestorHeadScene investorId={investorId} />
    </Suspense>
  );
}
