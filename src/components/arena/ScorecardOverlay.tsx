import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Wand2 } from "lucide-react";
import type { Scorecard } from "../../types/pitcherator";
import type { ArenaRound } from "../../types/arena";
import { overallScore, combinedGrade } from "../../lib/scoring";
import Button from "../Button";
import GradeReveal from "./GradeReveal";
import ScoreMatrix from "./ScoreMatrix";
import ShareButton from "./ShareButton";
import VoiceDeliveryCard from "./voice/VoiceDeliveryCard";

type Props = {
  scorecard: Scorecard;
  isPartial: boolean;
  health: number;
  questionsSurvived: number;
  rounds: ArenaRound[];
  personalityName: string;
  hasReview: boolean;
  onBackToReview: () => void;
  onFightAgain: () => void;
  onGenerateDeck: () => void;
  isGeneratingDeck: boolean;
};

// Final phase of the arena: the pitch is over, either by choice or by 0 health. Reveals the grade and
// 6-metric breakdown, then offers a rematch, a shareable result card, and — for a voluntary, full
// session only — unlocking the Deck tab with a freshly generated deck built from the transcript.
export default function ScorecardOverlay({ scorecard, isPartial, health, questionsSurvived, rounds, personalityName, hasReview, onBackToReview, onFightAgain, onGenerateDeck, isGeneratingDeck }: Props) {
  const total = overallScore(scorecard.ratings);
  const grade = combinedGrade(total, health);

  return (
    <motion.div
      className="flex w-full max-w-md flex-col items-center gap-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isPartial && hasReview && (
        <button
          onClick={onBackToReview}
          className="self-start text-xs font-semibold text-white/50 transition hover:text-white/80"
        >
          <ArrowLeft className="mr-1 inline h-3.5 w-3.5" /> Review My Answers
        </button>
      )}
      <h2 className="font-display text-2xl font-bold text-white">{isPartial ? "Here's What Went Wrong" : "Pitch Complete"}</h2>
      <GradeReveal total={total} grade={grade} />
      <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/60">
        Questions Survived: {questionsSurvived}
      </span>
      <ScoreMatrix ratings={scorecard.ratings} />
      <VoiceDeliveryCard rounds={rounds} />

      <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">Improve</h3>
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
        <ShareButton health={health} questionsSurvived={questionsSurvived} grade={grade} personalityName={personalityName} />
        {!isPartial && (
          <Button onClick={onGenerateDeck} disabled={isGeneratingDeck} className="flex-1">
            <Wand2 className="h-4 w-4" /> {isGeneratingDeck ? "Forging your deck…" : "Generate My Deck"}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
