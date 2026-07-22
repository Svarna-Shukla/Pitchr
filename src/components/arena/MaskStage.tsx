import { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MaskState } from "./mask/ArenaMask";
import type { PersonalityId } from "../../types/investor";
import ListeningPulseRings from "./ListeningPulseRings";
import ListeningBadge from "./ListeningBadge";

const ArenaMaskScene = lazy(() => import("./mask/ArenaMaskScene"));

type Props = {
  state: MaskState;
  attackTrigger: number;
  investorId: PersonalityId;
  flash: "green" | "red" | null;
  flashKey: number;
  compact?: boolean;
  fill?: boolean;
  intensity?: number;
  isSpeaking?: boolean;
};

// Top ~60%-of-screen stage: the big looming interrogation mask, a soft blue "processing" outline while
// listening to the founder's answer, and a full-screen color flash fired on judgment (green = strong
// answer, red = weak answer). Shrinks to a small watching presence once `compact` (the scorecard phase),
// or surges to fill the viewport once `fill` (the game-over sequence). Capped at 250px tall on mobile
// unless filling, so the mask stays present without dominating a small screen.
export default function MaskStage({ state, attackTrigger, investorId, flash, flashKey, compact = false, fill = false, intensity = 1, isSpeaking = false }: Props) {
  return (
    <motion.div
      className={fill ? "relative flex w-full shrink-0 items-center justify-center" : "relative flex w-full shrink-0 items-center justify-center max-h-[250px] sm:max-h-none"}
      animate={{ height: fill ? "100vh" : compact ? "20vh" : "52vh", opacity: compact ? 0.35 : 1 }}
      transition={{ duration: fill ? 1 : 0.6, ease: "easeInOut" }}
    >
      <ListeningPulseRings active={state === "listening"} />
      <ListeningBadge active={state === "listening"} />
      <div className="h-full w-full max-w-2xl">
        <Suspense fallback={null}>
          <ArenaMaskScene state={state} attackTrigger={attackTrigger} investorId={investorId} intensity={intensity} isSpeaking={isSpeaking} />
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
