import { motion } from "framer-motion";

type Props = { roundNumber: number };

// Small top-center HUD element, stacked directly below the health bar: "QUESTION 4" — ticks up every
// round in the endless interrogation loop so the founder always knows how deep they are
export default function RoundCounter({ roundNumber }: Props) {
  return (
    <motion.div
      className="flex w-full justify-center pt-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-orange-400 backdrop-blur-md">
        Question {roundNumber}
      </span>
    </motion.div>
  );
}
