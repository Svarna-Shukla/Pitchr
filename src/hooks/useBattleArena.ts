import { useCallback, useEffect, useRef, useState } from "react";
import type { MaskState } from "../components/arena/mask/ArenaMask";
import type { AnswerTier, ArenaRound, BattlePhase } from "../types/arena";
import type { VoiceAnalytics } from "../types/voice";
import type { PersonalityConfig, PersonalityId } from "../types/investor";
import { getPersonality, pickVoiceLine } from "../lib/investorPersonalities";
import { speakAsTaiLung } from "../lib/taiLungVoice";
import { useArenaHealth } from "./useArenaHealth";
import { usePitcherator } from "./usePitcherator";
import { useSpeechSynthesis } from "./useSpeechSynthesis";

// Matches JudgmentFlash's 3.5s hold + 0.5s fade exactly, so the next question never starts typing
// until the comment has fully faded out
const JUDGMENT_DISPLAY_MS = 4000;
const MIN_SCANNING_MS = 2000;
const LOSING_THRESHOLD = 40;

// Maps a judged answer tier to the mask's visual reaction state
function tierToMaskState(tier: AnswerTier): MaskState {
  if (tier === "strong") return "strong";
  if (tier === "neutral") return "average";
  return "weak";
}

// Orchestrates the endless Battle Arena: personality pick, pitch intake, then an unbounded
// attack/response/judgment loop that only ends on 0 health (game over) or a voluntary "End Pitch"
export function useBattleArena() {
  const pitcherator = usePitcherator();
  const health = useArenaHealth();
  const voice = useSpeechSynthesis();
  const [phase, setPhase] = useState<BattlePhase>("personality-select");
  const [personality, setPersonality] = useState<PersonalityConfig | null>(null);
  const [rounds, setRounds] = useState<ArenaRound[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [pitchTranscript, setPitchTranscript] = useState("");
  const [lastResult, setLastResult] = useState<{ tier: AnswerTier; reaction: string } | null>(null);
  const [isPartial, setIsPartial] = useState(false);
  const [reviewAcknowledged, setReviewAcknowledged] = useState(false);
  const scanningReady = useRef(false);
  const attackTrigger = useRef(0);

  // Enforces a minimum 2s "Analyzing your pitch..." beat even if the Groq call resolves faster
  useEffect(() => {
    if (phase !== "scanning") return;
    scanningReady.current = false;
    const timer = window.setTimeout(() => {
      scanningReady.current = true;
      if (pitcherator.stage === "asking") {
        attackTrigger.current += 1;
        setPhase("attacking");
      }
    }, MIN_SCANNING_MS);
    return () => window.clearTimeout(timer);
  }, [phase, pitcherator.stage]);

  // Once the opening question lands (and the minimum scan time has passed), the first attack fires
  useEffect(() => {
    if (pitcherator.stage === "asking" && phase === "scanning" && scanningReady.current) {
      attackTrigger.current += 1;
      setPhase("attacking");
    }
  }, [pitcherator.stage, phase]);

  // Once a (full or partial) scorecard is ready, reveal it
  useEffect(() => {
    if (pitcherator.stage === "scorecard" && phase !== "scorecard") setPhase("scorecard");
  }, [pitcherator.stage, phase]);

  // Tai Lung specifically speaks his attack question aloud in his own deep villain voice the moment
  // it's ready to launch (Phase 4) — every other personality's question stays visual-only, typed out
  // by QuestionPanel, matching existing behavior. currentQuestion is already updated to the new
  // question by the time phase flips to "attacking" (see usePitcherator's start/playRound), so this
  // fires exactly once per attack.
  useEffect(() => {
    if (phase === "attacking" && personality?.id === "tailung" && voice.enabled && pitcherator.currentQuestion) {
      speakAsTaiLung(pitcherator.currentQuestion);
    }
  }, [phase, personality, voice.enabled, pitcherator.currentQuestion]);

  // If the opening question fails to generate, drop back to intake so the founder can retry
  useEffect(() => {
    if (pitcherator.failed && phase === "scanning") setPhase("input");
  }, [pitcherator.failed, phase]);

  // Picks the investor personality for this session and moves to pitch intake
  const selectPersonality = useCallback((id: PersonalityId) => {
    setPersonality(getPersonality(id));
    setPhase("input");
  }, []);

  // Kicks off a fresh battle from the founder's pitch transcript
  const submitPitch = useCallback(
    (transcript: string) => {
      if (!transcript.trim() || !personality) return;
      setRounds([]);
      setRoundNumber(1);
      setLastResult(null);
      setIsPartial(false);
      setReviewAcknowledged(false);
      setPitchTranscript(transcript);
      health.reset();
      setPhase("scanning");
      pitcherator.start(transcript, personality);
    },
    [pitcherator, health, personality]
  );

  // Once the question has fully typed out, the mask stops "speaking" and listens for the answer
  const questionTypedOut = useCallback(() => setPhase("response"), []);

  // Judges the founder's answer (or a timeout), updates health/streaks, speaks the reaction, and either
  // loops back to the next attack or ends the session on 0 health
  const submitAnswer = useCallback(
    async (text: string, isTimeout = false, voiceAnalytics?: VoiceAnalytics) => {
      if (!personality) return;
      const question = pitcherator.currentQuestion;
      const nextRoundNumber = roundNumber + 1;
      setPhase("judgment");
      setLastResult(null);
      const result = await pitcherator.playRound(text, isTimeout, personality, rounds, nextRoundNumber);
      if (!result) return;
      const finalHealth = health.applyResult(result.tier);
      const round: ArenaRound = { question, answer: isTimeout && !text.trim() ? "" : text, tier: result.tier, reaction: result.reaction, voiceAnalytics };
      setRounds((r) => [...r, round]);
      setLastResult({ tier: result.tier, reaction: result.reaction });
      // Tai Lung's reaction lines go through his own dedicated deeper voice instead of the shared
      // generic one, so every line he speaks — attack question and judgment alike — is consistent
      const line = pickVoiceLine(personality, result.tier);
      if (personality.id === "tailung") {
        if (voice.enabled) speakAsTaiLung(line);
      } else {
        voice.speak(line);
      }
      if (finalHealth <= 0) {
        setPhase("gameover");
      } else {
        setRoundNumber(nextRoundNumber);
        window.setTimeout(() => {
          attackTrigger.current += 1;
          setPhase("attacking");
        }, JUDGMENT_DISPLAY_MS);
      }
    },
    [pitcherator, health, personality, rounds, roundNumber, voice]
  );

  // Voluntarily ends the pitch, generating the full scorecard from every round played
  const endPitch = useCallback(() => {
    setIsPartial(false);
    pitcherator.generateScorecard(rounds);
  }, [pitcherator, rounds]);

  // Called from the game-over screen's "See What Went Wrong" — same scorecard, marked partial, plus
  // the answer-by-answer review shown on the "What Went Wrong" screen before the scorecard itself
  const viewPartialResults = useCallback(() => {
    setIsPartial(true);
    setReviewAcknowledged(false);
    pitcherator.generateScorecard(rounds);
    pitcherator.generateAnswerReview(rounds);
  }, [pitcherator, rounds]);

  // Dismisses the "What Went Wrong" screen and reveals the full scorecard behind it
  const continueToScorecard = useCallback(() => setReviewAcknowledged(true), []);

  // From the scorecard, returns to the "What Went Wrong" review — the review data was never
  // discarded, `reviewAcknowledged` just gates which of the two screens is currently shown
  const backToReview = useCallback(() => setReviewAcknowledged(false), []);

  // Flushes the battle entirely and returns to the personality-select step
  const fightAgain = useCallback(() => {
    setRounds([]);
    setRoundNumber(1);
    setPitchTranscript("");
    setLastResult(null);
    setPersonality(null);
    setIsPartial(false);
    setReviewAcknowledged(false);
    health.reset();
    pitcherator.reset();
    setPhase("personality-select");
  }, [pitcherator, health]);

  const maskState: MaskState =
    phase === "attacking"
      ? "speaking"
      : phase === "response"
        ? "listening"
        : phase === "judgment"
          ? health.health < LOSING_THRESHOLD
            ? "winning"
            : lastResult
              ? tierToMaskState(lastResult.tier)
              // Still awaiting the Groq judgment call — the mask stays in listening mode rather than idle
              : "listening"
          : "idle";

  return {
    phase,
    personality,
    rounds,
    roundNumber,
    pitchTranscript,
    currentQuestion: pitcherator.currentQuestion,
    scorecard: pitcherator.scorecard,
    answerReview: pitcherator.answerReview,
    showAnswerReview: phase === "scorecard" && isPartial && !reviewAcknowledged,
    isPartial,
    failed: pitcherator.failed,
    health: health.health,
    streakEvent: health.streakEvent,
    streakCount: health.streakCount,
    isLosing: health.health < LOSING_THRESHOLD,
    lastResult,
    maskState,
    maskIntensity: personality?.maskIntensity ?? 1,
    attackTrigger: attackTrigger.current,
    voiceIsSpeaking: voice.isSpeaking,
    voiceEnabled: voice.enabled,
    toggleVoice: voice.toggle,
    selectPersonality,
    submitPitch,
    questionTypedOut,
    submitAnswer,
    endPitch,
    viewPartialResults,
    continueToScorecard,
    backToReview,
    fightAgain,
  };
}
