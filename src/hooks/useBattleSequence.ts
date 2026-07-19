import { useEffect, useMemo, useState } from "react";
import { resolveBattle } from "../lib/battleCardScoring";
import type { RoundOutcome, StartupCardData } from "../types/battleCard";

export type BattlePhase = "intro" | "clash" | "roundResult" | "tally" | "done";

const INTRO_MS = 1200;
const CLASH_MS = 1100;
const RESULT_MS = 1500;
const TALLY_MS = 1400;

// Drives the fully self-timed 4-round battle: intro banner, then per-round clash + result, then tally, then done
export function useBattleSequence(player: StartupCardData, competitor: StartupCardData) {
  const outcome = useMemo(() => resolveBattle(player, competitor), [player, competitor]);
  const [phase, setPhase] = useState<BattlePhase>("intro");
  const [roundIndex, setRoundIndex] = useState(0);

  // Restarts the sequence from the top whenever a new opponent is battled
  useEffect(() => {
    setPhase("intro");
    setRoundIndex(0);
  }, [player, competitor]);

  // Advances the phase/round machine on a fixed timer, matching the pacing described in the spec
  useEffect(() => {
    if (phase === "done") return;
    const timer = setTimeout(() => {
      if (phase === "intro") setPhase("clash");
      else if (phase === "clash") setPhase("roundResult");
      else if (phase === "roundResult") {
        if (roundIndex < outcome.rounds.length - 1) {
          setRoundIndex((i) => i + 1);
          setPhase("clash");
        } else {
          setPhase("tally");
        }
      } else if (phase === "tally") setPhase("done");
    }, DURATIONS[phase]);
    return () => clearTimeout(timer);
  }, [phase, roundIndex, outcome.rounds.length]);

  const currentRound: RoundOutcome | undefined = outcome.rounds[roundIndex];

  return { outcome, phase, roundIndex, currentRound };
}

const DURATIONS: Record<Exclude<BattlePhase, "done">, number> = {
  intro: INTRO_MS,
  clash: CLASH_MS,
  roundResult: RESULT_MS,
  tally: TALLY_MS,
};

// this file has the battle sequence logic for the game, including the timing of each phase and the resolution of rounds between the player and competitor.
