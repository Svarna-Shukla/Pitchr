import { motion } from "framer-motion";
import type { BattlePhase } from "../../../hooks/useBattleSequence";
import type { RoundOutcome } from "../../../types/battleCard";

type Props = { round: RoundOutcome; phase: BattlePhase };

// Centre-screen clash for one round: the stat name, two bars racing from the outside edges toward the
// middle (player orange from the left, competitor red from the right), and the point-gap verdict text
export default function RoundClashBars({ round, phase }: Props) {
  const filled = phase === "clash" || phase === "roundResult" || phase === "tally";
  const gap = Math.abs(round.playerScore - round.competitorScore);
  const tie = round.winner === "tie";

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4">
      <motion.p
        key={round.stat}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-xl font-black uppercase tracking-widest text-white"
      >
        {round.stat} Clash
      </motion.p>
      <div className="relative flex h-4 w-full">
        <div className="flex h-full w-1/2 justify-end overflow-hidden">
          <motion.div
            className="h-full rounded-l bg-[color:var(--color-accent)]"
            initial={{ width: 0 }}
            animate={{ width: filled ? `${round.playerScore}%` : 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex h-full w-1/2 justify-start overflow-hidden">
          <motion.div
            className="h-full rounded-r bg-red-400"
            initial={{ width: 0 }}
            animate={{ width: filled ? `${round.competitorScore}%` : 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="absolute left-1/2 top-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white/40" />
      </div>
      {(phase === "roundResult" || phase === "tally") && (
        <motion.p
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-sm font-bold ${tie ? "text-white/60" : round.winner === "player" ? "text-green-400" : "text-red-400"}`}
        >
          {tie ? "Round tied" : round.winner === "player" ? `You won by ${gap} points` : `They beat you by ${gap} points`}
        </motion.p>
      )}
    </div>
  );
}
