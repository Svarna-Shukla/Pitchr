import { motion } from "framer-motion";
import type { AnswerTier } from "../../types/arena";
import Button from "../Button";

type Props = { tier: AnswerTier; reaction: string; isLosing: boolean; failed: boolean; onRetry: () => void };

const TIER_COLOR: Record<AnswerTier, string> = { strong: "#4ade80", average: "#facc15", weak: "#f87171", timeout: "#991b1b" };

// The verdict beat below the mask, right after a round is judged: the investor's Groq-generated
// reaction line, colored by how the answer was judged, plus an extra ominous line once the founder's
// pitch health has dropped low. Falls back to a retry prompt if the round's Groq call failed outright.
export default function JudgmentFlash({ tier, reaction, isLosing, failed, onRetry }: Props) {
  if (failed) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <p className="text-sm text-red-400">Something went wrong judging that round — try again.</p>
        <Button onClick={onRetry}>Restart Battle</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 px-6 text-center">
      <motion.p
        className="max-w-md text-2xl font-black sm:text-3xl"
        style={{ color: TIER_COLOR[tier] }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {reaction || "…"}
      </motion.p>
      {isLosing && (
        <motion.p className="text-sm font-semibold text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          You are losing this pitch.
        </motion.p>
      )}
    </div>
  );
}
