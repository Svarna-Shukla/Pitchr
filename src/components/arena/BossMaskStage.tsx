import { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MaskState } from "./mask/ArenaMask";
import type { PersonalityId } from "../../types/investor";
import ListeningPulseRings from "./ListeningPulseRings";
import ListeningBadge from "./ListeningBadge";

const BossTankScene = lazy(() => import("./mask/BossTankScene"));

type Props = {
  state: MaskState;
  attackTrigger: number;
  activeInvestorId: PersonalityId;
  flash: "green" | "red" | null;
  flashKey: number;
  compact?: boolean;
  isSpeaking?: boolean;
};

// "The Ultimate Tank" (Boss Mode)'s equivalent of MaskStage: a wider panel-table stage so all 5
// investor masks fit side-by-side, with the same judgment color-flash behavior as the single-investor
// arena. Shrinks to a small watching presence once `compact` (the scorecard phase).
export default function BossMaskStage({ state, attackTrigger, activeInvestorId, flash, flashKey, compact = false, isSpeaking = false }: Props) {
  return (
    <motion.div
      className="relative flex w-full shrink-0 items-center justify-center max-h-[320px] sm:max-h-none"
      animate={{ height: compact ? "20vh" : "56vh", opacity: compact ? 0.35 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <ListeningPulseRings active={state === "listening"} wide />
      <ListeningBadge active={state === "listening"} />
      <div className="h-full w-full max-w-5xl">
        <Suspense fallback={null}>
          <BossTankScene state={state} attackTrigger={attackTrigger} activeInvestorId={activeInvestorId} isSpeaking={isSpeaking} />
        </Suspense>
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            key={flashKey}
            className="pointer-events-none fixed inset-0 z-[70]"
            style={{ background: flash === "green" ? "radial-gradient(circle at 70% 50%, rgba(34,197,94,0.35), transparent 70%)" : "radial-gradient(circle at 70% 50%, rgba(220,38,38,0.4), transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
