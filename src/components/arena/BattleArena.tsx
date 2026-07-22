import { useState } from "react";
import type { useBattleArena } from "../../hooks/useBattleArena";
import ArenaLayout from "./ArenaLayout";
import PitchHealthBar from "./PitchHealthBar";
import RoundCounter from "./RoundCounter";
import StreakBadge from "./StreakBadge";
import EndPitchButton from "./EndPitchButton";
import SpeakerToggle from "./SpeakerToggle";
import VoiceEngineToggle from "./VoiceEngineToggle";
import ActiveSpeakerBadge from "./ActiveSpeakerBadge";
import MaskStage from "./MaskStage";
import BossMaskStage from "./BossMaskStage";
import GameOverOverlay from "./GameOverOverlay";
import ArenaPhaseContent from "./ArenaPhaseContent";
import HelpModeToggle from "./coach/HelpModeToggle";
import CoachTipsPanel from "./coach/CoachTipsPanel";

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
  const [helpMode, setHelpMode] = useState(false);
  const isLive = LIVE_PHASES.includes(arena.phase);
  const flash = arena.phase === "judgment" && arena.lastResult ? (arena.lastResult.tier === "strong" ? "green" : "red") : null;

  if (arena.phase === "gameover") {
    return <GameOverOverlay investorId={arena.personality?.id ?? "lordvane"} onTryAgain={arena.fightAgain} onViewPartial={arena.viewPartialResults} />;
  }

  return (
    <ArenaLayout health={isLive ? arena.health : undefined}>
      {isLive && <PitchHealthBar health={arena.health} />}
      {isLive && <RoundCounter roundNumber={arena.roundNumber} streakCount={arena.streakCount} />}
      {isLive && arena.isBossMode && <ActiveSpeakerBadge investor={arena.personality} />}
      {isLive && <StreakBadge streakEvent={arena.streakEvent} />}
      {isLive && <EndPitchButton onClick={arena.endPitch} />}
      {isLive && <SpeakerToggle enabled={arena.voiceEnabled} onToggle={arena.toggleVoice} />}
      {arena.phase !== "personality-select" && <VoiceEngineToggle engine={arena.voiceEngine} onToggle={arena.toggleVoiceEngine} />}
      {isLive && <HelpModeToggle enabled={helpMode} onToggle={() => setHelpMode((v) => !v)} />}
      {arena.personality && (
        <CoachTipsPanel investor={arena.personality} roundNumber={arena.roundNumber} visible={helpMode && isLive} />
      )}

      {arena.phase !== "personality-select" && arena.personality && arena.isBossMode && (
        <BossMaskStage
          state={arena.maskState}
          attackTrigger={arena.attackTrigger}
          activeInvestorId={arena.personality.id}
          flash={flash}
          flashKey={arena.rounds.length}
          compact={arena.phase === "scorecard"}
          isSpeaking={arena.voiceIsSpeaking}
        />
      )}
      {arena.phase !== "personality-select" && arena.personality && !arena.isBossMode && (
        <MaskStage
          state={arena.maskState}
          attackTrigger={arena.attackTrigger}
          investorId={arena.personality.id}
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
