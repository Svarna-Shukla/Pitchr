import type { useBattleArena } from "../../hooks/useBattleArena";
import ArenaLayout from "./ArenaLayout";
import PitchHealthBar from "./PitchHealthBar";
import RoundCounter from "./RoundCounter";
import StreakBadge from "./StreakBadge";
import EndPitchButton from "./EndPitchButton";
import SpeakerToggle from "./SpeakerToggle";
import MaskStage from "./MaskStage";
import PersonalitySelect from "./PersonalitySelect";
import PitchIntake from "./PitchIntake";
import ScanningPulse from "./ScanningPulse";
import QuestionPanel from "./QuestionPanel";
import ResponseControls from "./ResponseControls";
import JudgmentFlash from "./JudgmentFlash";
import ScorecardOverlay from "./ScorecardOverlay";
import GameOverOverlay from "./GameOverOverlay";

type Props = {
  arena: ReturnType<typeof useBattleArena>;
  isListening: boolean;
  transcript: string;
  audioLevels: number[];
  onToggleRecord: () => void;
  onGenerateDeck: () => void;
  isGeneratingDeck: boolean;
};

const LIVE_PHASES = ["scanning", "attacking", "response", "judgment"];

// Top-level Battle Arena coordinator: personality pick, pitch intake, then the endless mask-driven
// attack/response/judgment loop, ending in either a voluntary scorecard or a hard game-over screen.
export default function BattleArena({ arena, isListening, transcript, audioLevels, onToggleRecord, onGenerateDeck, isGeneratingDeck }: Props) {
  const isLive = LIVE_PHASES.includes(arena.phase);
  const flash = arena.phase === "judgment" && arena.lastResult ? (arena.lastResult.tier === "strong" ? "green" : "red") : null;

  if (arena.phase === "gameover") {
    return <GameOverOverlay onTryAgain={arena.fightAgain} onViewPartial={arena.viewPartialResults} />;
  }

  return (
    <ArenaLayout>
      {isLive && <PitchHealthBar health={arena.health} />}
      {isLive && <RoundCounter roundNumber={arena.roundNumber} />}
      {isLive && <StreakBadge streakEvent={arena.streakEvent} />}
      {isLive && <EndPitchButton onClick={arena.endPitch} />}
      {isLive && <SpeakerToggle enabled={arena.voiceEnabled} onToggle={arena.toggleVoice} />}

      {arena.phase !== "personality-select" && (
        <MaskStage
          state={arena.maskState}
          attackTrigger={arena.attackTrigger}
          flash={flash}
          flashKey={arena.rounds.length}
          compact={arena.phase === "scorecard"}
          intensity={arena.maskIntensity}
        />
      )}

      <div className="flex flex-1 flex-col items-center justify-start gap-6 pb-40 md:pb-6">
        {arena.phase === "personality-select" && <PersonalitySelect onSelect={arena.selectPersonality} />}
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
        {arena.phase === "scorecard" && arena.scorecard && (
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
    </ArenaLayout>
  );
}
