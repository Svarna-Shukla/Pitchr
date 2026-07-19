import type { useBattleArena } from "../../hooks/useBattleArena";
import ArenaLayout from "./ArenaLayout";
import PitchHealthBar from "./PitchHealthBar";
import RoundCounter from "./RoundCounter";
import StreakBadge from "./StreakBadge";
import EndPitchButton from "./EndPitchButton";
import SpeakerToggle from "./SpeakerToggle";
import MaskStage from "./MaskStage";
import GameOverOverlay from "./GameOverOverlay";
import ArenaPhaseContent from "./ArenaPhaseContent";

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

const LIVE_PHASES = ["scanning", "attacking", "response", "judgment"];

// Top-level Battle Arena coordinator: personality pick, pitch intake, then the endless mask-driven
// attack/response/judgment loop, ending in either a voluntary scorecard or a hard game-over screen.
// Phase-specific screen content lives in <ArenaPhaseContent>; this component owns only the persistent
// HUD chrome (health bar, round counter, mask stage) that sits above it.
export default function BattleArena(props: Props) {
  const { arena } = props;
  const isLive = LIVE_PHASES.includes(arena.phase);
  const flash = arena.phase === "judgment" && arena.lastResult ? (arena.lastResult.tier === "strong" ? "green" : "red") : null;

  if (arena.phase === "gameover") {
    return <GameOverOverlay onTryAgain={arena.fightAgain} onViewPartial={arena.viewPartialResults} />;
  }

  return (
    <ArenaLayout health={isLive ? arena.health : undefined}>
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
          isSpeaking={arena.voiceIsSpeaking}
        />
      )}

      <ArenaPhaseContent {...props} />
    </ArenaLayout>
  );
}
