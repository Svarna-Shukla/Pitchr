import { motion } from "framer-motion";
import Button from "../Button";

type Props = { failed: boolean; onRetry: () => void };

// Phase 5 of the arena: a brief verdict beat between rounds while health bars settle to their new
// values, or a fallback retry prompt if the round's Groq call failed
export default function JudgmentFlash({ failed, onRetry }: Props) {
  if (failed) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-sm text-red-400">Something went wrong judging that round — try again.</p>
        <Button onClick={onRetry}>Restart Battle</Button>
      </div>
    );
  }

  return (
    <motion.p
      className="text-sm font-semibold uppercase tracking-widest text-orange-300"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
    >
      Judging response…
    </motion.p>
  );
}
