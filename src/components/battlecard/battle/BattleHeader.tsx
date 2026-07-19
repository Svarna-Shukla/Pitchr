import { motion } from "framer-motion";
import type { BattleOutcome } from "../../../types/battleCard";
import type { BattlePhase } from "../../../hooks/useBattleSequence";

type Props = { phase: BattlePhase; roundIndex: number; totalRounds: number; outcome: BattleOutcome };

// Top banner: "ROUND X OF 4" while fighting, or the final tally line once every round has resolved
export default function BattleHeader({ phase, roundIndex, totalRounds, outcome }: Props) {
  const label =
    phase === "tally"
      ? `You won ${outcome.playerWins} of ${totalRounds} rounds`
      : `Round ${roundIndex + 1} of ${totalRounds}`;
  return (
    <motion.p
      key={label}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-display text-sm font-bold uppercase tracking-[0.3em] text-white/60"
    >
      {label}
    </motion.p>
  );
}
