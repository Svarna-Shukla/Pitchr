import { motion } from "framer-motion";
import type { AnswerReviewItem } from "../../types/pitcherator";
import AnswerComparisonCard from "./AnswerComparisonCard";
import Button from "../Button";

type Props = { review: AnswerReviewItem[] | null; onContinue: () => void };

// The "What Went Wrong" screen: shown once, right after game over, before the main scorecard. Walks
// through every question of the session with the founder's actual answer next to a structure/clarity
// -only rewrite of that same answer, so the correction reads as an edit rather than a replacement.
export default function AnswerReviewOverlay({ review, onContinue }: Props) {
  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col items-center gap-6 px-2 pb-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-display text-2xl font-bold text-white">What Went Wrong</h2>
      <p className="max-w-md text-sm text-white/50">Every answer you gave, next to a cleaned-up version of the same answer.</p>

      {!review ? (
        <p className="text-sm text-white/40">Reviewing your answers…</p>
      ) : (
        <div className="flex w-full flex-col gap-8">
          {review.map((item, i) => (
            <AnswerComparisonCard key={i} item={item} index={i} />
          ))}
        </div>
      )}

      <Button onClick={onContinue} disabled={!review} className="mt-2">
        See Full Scorecard
      </Button>
    </motion.div>
  );
}
