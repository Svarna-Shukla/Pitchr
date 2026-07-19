import { motion } from "framer-motion";

type Props = { roundNumber: number; streakCount?: number };

// Small top-center HUD element, stacked directly below the health bar: "QUESTION 4" — ticks up every
// round in the endless interrogation loop, with a subtle streak counter underneath once one is active
export default function RoundCounter({ roundNumber, streakCount = 0 }: Props) {
  return (
    <motion.div
      className="flex w-full flex-col items-center gap-1 pt-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-orange-400 backdrop-blur-md">
        Question {roundNumber}
      </span>
      {streakCount !== 0 && (
        <span className={`text-[11px] font-semibold uppercase tracking-widest ${streakCount > 0 ? "text-orange-400/70" : "text-red-400/70"}`}>
          {Math.abs(streakCount)} {streakCount > 0 ? "strong" : "weak"} in a row
        </span>
      )}
    </motion.div>
  );
}
