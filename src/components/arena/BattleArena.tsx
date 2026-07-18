import { motion } from "framer-motion";
import type { useBattleArena } from "../../hooks/useBattleArena";
import ArenaLayout from "./ArenaLayout";
import InvestorSide from "./InvestorSide";
import FounderSide from "./FounderSide";
import PitchIntake from "./PitchIntake";
import ScanningPulse from "./ScanningPulse";
import ProjectileEngine from "./ProjectileEngine";
import ResponseControls from "./ResponseControls";
import JudgmentFlash from "./JudgmentFlash";
import ScorecardOverlay from "./ScorecardOverlay";

type Props = {
  arena: ReturnType<typeof useBattleArena>;
  isListening: boolean;
  transcript: string;
  audioLevels: number[];
  onToggleRecord: () => void;
  onGenerateDeck: () => void;
  isGeneratingDeck: boolean;
};

// Top-level Battle Arena coordinator: renders the two fighters once a battle has started, and swaps
// the center phase content between pitch intake, scanning, attacks, responses, judgment, and the scorecard.
export default function BattleArena({ arena, isListening, transcript, audioLevels, onToggleRecord, onGenerateDeck, isGeneratingDeck }: Props) {
  const showFighters = arena.phase !== "input";

  return (
    <ArenaLayout>
      <div className="flex w-full max-w-5xl flex-col items-center gap-10">
        {showFighters && (
          <motion.div className="flex w-full" animate={{ opacity: arena.phase === "scorecard" ? 0.2 : 1 }}>
            <InvestorSide investorHealth={arena.investorHealth} isAttacking={arena.isAttacking} isListening={arena.phase === "response"} />
            <FounderSide founderHealth={arena.founderHealth} isUnderAttack={arena.isUnderAttack} />
          </motion.div>
        )}

        <div className="flex w-full justify-center">
          {arena.phase === "input" && (
            <PitchIntake
              isListening={isListening}
              transcript={transcript}
              audioLevels={audioLevels}
              onToggleRecord={onToggleRecord}
              onSubmitPitch={arena.submitPitch}
            />
          )}
          {arena.phase === "scanning" && <ScanningPulse />}
          {arena.phase === "attack_projectile" && (
            <ProjectileEngine
              question={arena.currentQuestion}
              roundNumber={arena.roundNumber}
              totalRounds={arena.totalRounds}
              onLanded={arena.questionLanded}
            />
          )}
          {arena.phase === "response" && <ResponseControls onSubmitAnswer={arena.submitAnswer} />}
          {arena.phase === "judgment" && <JudgmentFlash failed={arena.failed} onRetry={arena.fightAgain} />}
          {arena.phase === "scorecard" && arena.scorecard && (
            <ScorecardOverlay
              scorecard={arena.scorecard}
              onFightAgain={arena.fightAgain}
              onGenerateDeck={onGenerateDeck}
              isGeneratingDeck={isGeneratingDeck}
            />
          )}
        </div>
      </div>
    </ArenaLayout>
  );
}
