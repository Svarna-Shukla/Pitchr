import { motion } from "framer-motion";
import { RotateCcw, Wand2 } from "lucide-react";
import type { Scorecard } from "../../types/pitcherator";
import { overallScore, letterGrade } from "../../lib/scoring";
import Button from "../Button";
import GradeReveal from "./GradeReveal";
import ScoreMatrix from "./ScoreMatrix";

type Props = {
  scorecard: Scorecard;
  onFightAgain: () => void;
  onGenerateDeck: () => void;
  isGeneratingDeck: boolean;
};

// Phase 6 of the arena: the battle is over. Reveals the final grade and 6-metric breakdown, then
// offers a rematch or unlocking the Deck tab with a freshly generated deck built from the transcript.
export default function ScorecardOverlay({ scorecard, onFightAgain, onGenerateDeck, isGeneratingDeck }: Props) {
  const total = overallScore(scorecard.ratings);
  const grade = letterGrade(total);

  return (
    <motion.div
      className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-display text-2xl font-bold text-white">Battle Complete</h2>
      <GradeReveal total={total} grade={grade} />
      <ScoreMatrix ratings={scorecard.ratings} />

      <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">Improve</h3>
      <ul className="space-y-1.5 text-left">
        {scorecard.suggestions.map((s, i) => (
          <li key={i} className="text-sm text-white/80">
            - {s}
          </li>
        ))}
      </ul>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Button variant="ghost" onClick={onFightAgain} className="flex-1">
          <RotateCcw className="h-4 w-4" /> Fight Again
        </Button>
        <Button onClick={onGenerateDeck} disabled={isGeneratingDeck} className="flex-1">
          <Wand2 className="h-4 w-4" /> {isGeneratingDeck ? "Forging your deck…" : "Generate My Deck"}
        </Button>
      </div>
    </motion.div>
  );
}
