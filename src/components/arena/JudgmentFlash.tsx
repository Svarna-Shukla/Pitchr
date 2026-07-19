import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { AnswerTier } from "../../types/arena";
import Button from "../Button";

type Props = { tier: AnswerTier; reaction: string; isAnalyzing: boolean; isLosing: boolean; failed: boolean; onRetry: () => void };

const TIER_BORDER: Record<AnswerTier, string> = { strong: "#4ade80", average: "#facc15", weak: "#f87171", timeout: "#991b1b" };
const HOLD_MS = 3500;
const FADE_MS = 500;

// The verdict beat below the mask, right after a round is judged: the investor's Groq-generated
// reaction line, held on screen for a full 3.5s (long enough to actually read), then faded over 0.5s.
// The parent only advances to the next attack once this whole window has elapsed, so the next
// question never starts typing over a comment that's still fading. Falls back to a retry prompt if
// the round's Groq call failed outright.
export default function JudgmentFlash({ tier, reaction, isAnalyzing, isLosing, failed, onRetry }: Props) {
  const [fading, setFading] = useState(false);

  // Starts the hold-then-fade timer fresh every time a new reaction comes in
  useEffect(() => {
    setFading(false);
    const t = window.setTimeout(() => setFading(true), HOLD_MS);
    return () => window.clearTimeout(t);
  }, [reaction]);

  if (failed) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <p className="text-sm text-red-400">Something went wrong judging that round — try again.</p>
        <Button onClick={onRetry}>Restart Battle</Button>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col items-center gap-3 px-6 text-center"
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: "easeInOut" }}
    >
      <div className="rounded-2xl border bg-black/50 px-6 py-5 backdrop-blur-md" style={{ borderColor: `${TIER_BORDER[tier]}44` }}>
        <p className="max-w-md text-xl font-black leading-snug text-white sm:text-2xl">
          {isAnalyzing ? "Analyzing…" : reaction || "…"}
        </p>
      </div>
      {isLosing && (
        <motion.p className="text-sm font-semibold text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          You are losing this pitch.
        </motion.p>
      )}
    </motion.div>
  );
}
