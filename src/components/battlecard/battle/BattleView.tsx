import { X } from "lucide-react";
import type { StartupCardData } from "../../../types/battleCard";
import { useBattleSequence } from "../../../hooks/useBattleSequence";
import BattleHeader from "./BattleHeader";
import RoundClashBars from "./RoundClashBars";
import BattleCardSlot from "./BattleCardSlot";
import BattleResultScreen from "./BattleResultScreen";

type Props = { player: StartupCardData; competitor: StartupCardData; onExit: () => void; onAnotherCompetitor: () => void };

// Full-screen battle: player card left, competitor right, dark dramatic backdrop, 4 timed rounds of
// stat clashes with reactive glow/crack, then hands off to the VICTORY/DEFEAT result screen
export default function BattleView({ player, competitor, onExit, onAnotherCompetitor }: Props) {
  const { outcome, phase, roundIndex, currentRound } = useBattleSequence(player, competitor);

  if (phase === "done") {
    return <BattleResultScreen player={player} competitor={competitor} outcome={outcome} onAnotherCompetitor={onAnotherCompetitor} />;
  }

  const resolved = phase === "clash" ? outcome.rounds.slice(0, roundIndex) : outcome.rounds.slice(0, roundIndex + 1);
  const playerCracks = resolved.filter((r) => r.winner === "competitor").length;
  const competitorCracks = resolved.filter((r) => r.winner === "player").length;
  const showFlash = phase === "roundResult" && currentRound;
  const playerFlash = showFlash ? (currentRound!.winner === "player" ? "win" : currentRound!.winner === "competitor" ? "lose" : null) : null;
  const competitorFlash = showFlash ? (currentRound!.winner === "competitor" ? "win" : currentRound!.winner === "player" ? "lose" : null) : null;
  const playerFinal = phase === "tally" ? (outcome.winner === "player" ? "winner" : "loser") : null;
  const competitorFinal = phase === "tally" ? (outcome.winner === "competitor" ? "winner" : "loser") : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 bg-[#050507] px-4">
      <button onClick={onExit} aria-label="Exit battle" className="absolute right-5 top-5 min-h-11 min-w-11 rounded-full p-2 text-white/40 hover:text-white">
        <X className="h-5 w-5" />
      </button>

      <BattleHeader phase={phase} roundIndex={roundIndex} totalRounds={outcome.rounds.length} outcome={outcome} />

      {phase !== "tally" && currentRound && <RoundClashBars round={currentRound} phase={phase} />}

      <div className="flex w-full max-w-4xl items-center justify-between gap-4">
        <BattleCardSlot card={player} side="left" crackCount={playerCracks} flash={playerFlash} final={playerFinal} />
        <BattleCardSlot card={competitor} side="right" crackCount={competitorCracks} flash={competitorFlash} final={competitorFinal} />
      </div>
    </div>
  );
}
