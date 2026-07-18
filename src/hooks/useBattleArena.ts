import { useCallback, useEffect, useState } from "react";
import type { BattlePhase, ArenaRound } from "../types/arena";
import { usePitcherator } from "./usePitcherator";
import { useArenaHealth } from "./useArenaHealth";

const JUDGMENT_DISPLAY_MS = 1400;

// Orchestrates the full Battle Arena experience: wraps usePitcherator's Groq-backed question/scorecard
// generation with a presentation-facing phase machine, live health bars, and the completed Q&A rounds
// needed later to regenerate the deck.
export function useBattleArena() {
  const pitcherator = usePitcherator();
  const health = useArenaHealth();
  const [phase, setPhase] = useState<BattlePhase>("input");
  const [rounds, setRounds] = useState<ArenaRound[]>([]);
  const [pitchTranscript, setPitchTranscript] = useState("");

  // Once question generation succeeds, the first attack can fly
  useEffect(() => {
    if (pitcherator.stage === "asking" && phase === "scanning") setPhase("attack_projectile");
  }, [pitcherator.stage, phase]);

  // Once the final scorecard is ready, reveal it regardless of which phase was mid-flight
  useEffect(() => {
    if (pitcherator.stage === "scorecard" && phase !== "scorecard") setPhase("scorecard");
  }, [pitcherator.stage, phase]);

  // If question generation fails, drop back to the input step so the founder can retry
  useEffect(() => {
    if (pitcherator.failed && phase === "scanning") setPhase("input");
  }, [pitcherator.failed, phase]);

  // Kicks off a fresh battle from the founder's pitch transcript
  const submitPitch = useCallback(
    (transcript: string) => {
      if (!transcript.trim()) return;
      setRounds([]);
      setPitchTranscript(transcript);
      health.reset();
      setPhase("scanning");
      pitcherator.start(transcript);
    },
    [pitcherator, health]
  );

  // Called once the flying question SVG collides with the founder's side
  const questionLanded = useCallback(() => {
    health.damageFounder();
    setPhase("response");
  }, [health]);

  // Records the founder's answer, damages the investor by its estimated strength, and either
  // advances to the next attack or leaves the arena in "judgment" until the final scorecard lands
  const submitAnswer = useCallback(
    (text: string) => {
      const question = pitcherator.questions[pitcherator.currentQuestionIndex] ?? "";
      setRounds((r) => [...r, { question, answer: text }]);
      health.damageInvestor(text);
      setPhase("judgment");
      const isLastRound = pitcherator.currentQuestionIndex >= pitcherator.questions.length - 1;
      pitcherator.submitAnswer(text);
      if (!isLastRound) {
        window.setTimeout(() => setPhase("attack_projectile"), JUDGMENT_DISPLAY_MS);
      }
    },
    [pitcherator, health]
  );

  // Flushes the battle entirely and returns to the pitch-intake step
  const fightAgain = useCallback(() => {
    setRounds([]);
    setPitchTranscript("");
    health.reset();
    pitcherator.reset();
    setPhase("input");
  }, [pitcherator, health]);

  return {
    phase,
    rounds,
    pitchTranscript,
    currentQuestion: pitcherator.questions[pitcherator.currentQuestionIndex] ?? "",
    roundNumber: pitcherator.currentQuestionIndex + 1,
    totalRounds: pitcherator.questions.length || 3,
    scorecard: pitcherator.scorecard,
    failed: pitcherator.failed,
    investorHealth: health.investorHealth,
    founderHealth: health.founderHealth,
    isAttacking: phase === "attack_projectile",
    isUnderAttack: phase === "attack_projectile",
    submitPitch,
    questionLanded,
    submitAnswer,
    fightAgain,
  };
}
