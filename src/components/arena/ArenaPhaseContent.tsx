import type { useBattleArena } from "../../hooks/useBattleArena";
import PersonalitySelect from "./PersonalitySelect";
import PitchIntake from "./PitchIntake";
import ScanningPulse from "./ScanningPulse";
import QuestionPanel from "./QuestionPanel";
import ResponseControls from "./ResponseControls";
import JudgmentFlash from "./JudgmentFlash";
import ScorecardOverlay from "./ScorecardOverlay";
import AnswerReviewOverlay from "./AnswerReviewOverlay";

type Props = {
  arena: ReturnType<typeof useBattleArena>;
  isListening: boolean;
  transcript: string;
  audioLevels: number[];
  speechSupported: boolean;
  onToggleRecord: () => void;
  onGenerateDeck: () => void;
  isGeneratingDeck: boolean;
};

// Renders whichever phase-specific screen is active inside the arena's scrollable content area:
// personality pick, pitch intake, scanning pulse, the live question/response pair, the judgment
// verdict, or — once the pitch ends — the "What Went Wrong" review followed by the scorecard.
export default function ArenaPhaseContent({ arena, isListening, transcript, audioLevels, speechSupported, onToggleRecord, onGenerateDeck, isGeneratingDeck }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-start gap-6 pb-40 md:pb-6">
      {arena.phase === "personality-select" && <PersonalitySelect onSelect={arena.selectPersonality} />}
      {arena.phase === "input" && (
        <PitchIntake
          isListening={isListening}
          transcript={transcript}
          audioLevels={audioLevels}
          speechSupported={speechSupported}
          onToggleRecord={onToggleRecord}
          onSubmitPitch={arena.submitPitch}
        />
      )}
      {arena.phase === "scanning" && <ScanningPulse />}
      {(arena.phase === "attacking" || arena.phase === "response") && (
        <>
          <QuestionPanel question={arena.currentQuestion} onTypedComplete={arena.questionTypedOut} />
          <ResponseControls visible={arena.phase === "response"} onSubmitAnswer={arena.submitAnswer} />
        </>
      )}
      {arena.phase === "judgment" && (
        <JudgmentFlash
          tier={arena.lastResult?.tier ?? "average"}
          reaction={arena.lastResult?.reaction ?? ""}
          isLosing={arena.isLosing}
          failed={arena.failed}
          onRetry={arena.fightAgain}
        />
      )}
      {arena.phase === "scorecard" && arena.scorecard && arena.showAnswerReview && (
        <AnswerReviewOverlay review={arena.answerReview} onContinue={arena.continueToScorecard} />
      )}
      {arena.phase === "scorecard" && arena.scorecard && !arena.showAnswerReview && (
        <ScorecardOverlay
          scorecard={arena.scorecard}
          isPartial={arena.isPartial}
          health={arena.health}
          questionsSurvived={arena.rounds.length}
          personalityName={arena.personality?.name ?? "the investor"}
          onFightAgain={arena.fightAgain}
          onGenerateDeck={onGenerateDeck}
          isGeneratingDeck={isGeneratingDeck}
        />
      )}
    </div>
  );
}
