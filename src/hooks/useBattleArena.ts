import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MaskState } from "../components/arena/mask/ArenaMask";
import type { AnswerTier, ArenaRound, BattlePhase } from "../types/arena";
import type { VoiceAnalytics } from "../types/voice";
import type { PersonalityConfig, PersonalityId } from "../types/investor";
import { getInvestorProfile, pickVoiceLine } from "../lib/investorProfiles";
import { speakInvestorLine, stopInvestorVoice } from "../lib/speakAsInvestor";
import { savePitchResult } from "../lib/pitchHistory";
import { combinedGrade, overallScore } from "../lib/scoring";
import { aggregateBossDamage, pickNextBossInvestor } from "../lib/bossMode";
import { useArenaHealth } from "./useArenaHealth";
import { usePitcherator } from "./usePitcherator";
import { useSpeechSynthesis } from "./useSpeechSynthesis";
import { useVoiceEngine } from "./useVoiceEngine";

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
  const voiceEngine = useVoiceEngine();
  const [phase, setPhase] = useState<BattlePhase>("personality-select");
  const [personality, setPersonality] = useState<PersonalityConfig | null>(null);
  const [isBossMode, setIsBossMode] = useState(false);
  const [rounds, setRounds] = useState<ArenaRound[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [pitchTranscript, setPitchTranscript] = useState("");
  const [lastResult, setLastResult] = useState<{ tier: AnswerTier; reaction: string } | null>(null);
  const [isPartial, setIsPartial] = useState(false);
  const [reviewAcknowledged, setReviewAcknowledged] = useState(false);
  // True for as long as the investor's own voice (ElevenLabs audio or the browser speechSynthesis
  // fallback) is actually playing — gates the founder's mic in ResponseControls so it never
  // transcribes the app's own voice as an answer (see speakInvestorLine's callbacks below)
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const scanningReady = useRef(false);
  const attackTrigger = useRef(0);
  const historySaved = useRef(false);

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

  // Once a full (non-partial) scorecard lands, log the completed pitch to localStorage — the
  // hackathon-demo analytics trail an Analytics dashboard reads back via getPitchHistory(), independent
  // of whether the founder goes on to generate a slide deck from this session
  useEffect(() => {
    if (phase !== "scorecard" || isPartial || !pitcherator.scorecard || !personality || historySaved.current) return;
    historySaved.current = true;
    const score = overallScore(pitcherator.scorecard.ratings);
    savePitchResult({
      investorId: personality.id,
      investorName: personality.name,
      grade: combinedGrade(score, health.founderHealth),
      score,
      healthRemaining: health.founderHealth,
      questionsSurvived: rounds.length,
      transcript: pitchTranscript,
    });
  }, [phase, isPartial, pitcherator.scorecard, personality, health.founderHealth, rounds.length, pitchTranscript]);

  // Every investor speaks their attack question aloud — in HD via their own cloned ElevenLabs voice,
  // or via the browser's native speechSynthesis if Fast Voice is on — the moment it's ready to launch
  // (Phase 4); QuestionPanel still types it out visually in parallel. currentQuestion is already
  // updated to the new question by the time phase flips to "attacking" (see usePitcherator's
  // start/playRound), so this fires exactly once per attack.
  useEffect(() => {
    if (phase === "attacking" && personality && voice.enabled && pitcherator.currentQuestion) {
      speakInvestorLine(pitcherator.currentQuestion, personality.voiceId, voiceEngine.engine, personality.fallbackVoice, {
        onStart: () => setIsAISpeaking(true),
        onEnd: () => setIsAISpeaking(false),
      }).catch(console.error);
    }
  }, [phase, personality, voice.enabled, pitcherator.currentQuestion, voiceEngine.engine]);

  // If the opening question fails to generate, drop back to intake so the founder can retry
  useEffect(() => {
    if (pitcherator.failed && phase === "scanning") setPhase("input");
  }, [pitcherator.failed, phase]);

  // Hard safety net: the instant either fighter's health reaches zero during a live round, force an
  // immediate transition to game over. submitAnswer already does this inline for the common path (a
  // judged answer), but this effect also covers any other way health could land at zero mid-session,
  // and guarantees no investor audio survives into the game-over screen
  useEffect(() => {
    const isLivePhase = phase === "scanning" || phase === "attacking" || phase === "response" || phase === "judgment";
    if (!isLivePhase) return;
    if (health.founderHealth <= 0 || health.investorHealth <= 0) {
      stopInvestorVoice();
      setIsAISpeaking(false);
      setPhase("gameover");
    }
  }, [phase, health.founderHealth, health.investorHealth]);

  // Picks the investor personality for this session and moves to pitch intake
  const selectPersonality = useCallback((id: PersonalityId) => {
    setIsBossMode(false);
    setPersonality(getInvestorProfile(id));
    setPhase("input");
  }, []);

  // Enters "The Ultimate Tank" (Boss Mode): all 5 investors sit on the panel together and a random
  // one takes the floor each turn. Picks the opening speaker immediately so the mask stage/UI already
  // has an active investor to show on the pitch-intake screen.
  const enterBossMode = useCallback(() => {
    setIsBossMode(true);
    setPersonality(pickNextBossInvestor());
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
      pitcherator.start(transcript, personality, isBossMode);
    },
    [pitcherator, health, personality, isBossMode]
  );

  // Once the question has fully typed out, the mask stops "speaking" and listens for the answer
  const questionTypedOut = useCallback(() => setPhase("response"), []);

  // Judges the founder's answer (or a timeout), updates health/streaks, speaks the reaction, and either
  // loops back to the next attack or ends the session on 0 health. In Boss Mode, a new random investor
  // is picked to take the floor BEFORE judging — that investor both reacts to the answer just given and
  // asks the next question, in their own tone and voice, so "who's speaking" genuinely changes turn to turn.
  const submitAnswer = useCallback(
    async (text: string, isTimeout = false, voiceAnalytics?: VoiceAnalytics) => {
      if (!personality || phase === "gameover") return;
      const question = pitcherator.currentQuestion;
      const nextRoundNumber = roundNumber + 1;
      const activeInvestor = isBossMode ? pickNextBossInvestor(personality.id) : personality;
      if (isBossMode) setPersonality(activeInvestor);
      setPhase("judgment");
      setLastResult(null);
      const healthBefore = health.founderHealth;
      const result = await pitcherator.playRound(text, isTimeout, activeInvestor, rounds, nextRoundNumber, isBossMode);
      if (!result) return;
      const finalHealth = health.applyResult(result.tier);
      const round: ArenaRound = {
        question,
        answer: isTimeout && !text.trim() ? "" : text,
        tier: result.tier,
        reaction: result.reaction,
        voiceAnalytics,
        investorId: activeInvestor.id,
        healthDelta: finalHealth - healthBefore,
      };
      setRounds((r) => [...r, round]);
      setLastResult({ tier: result.tier, reaction: result.reaction });
      if (finalHealth <= 0) {
        // Session's over on this blow — don't let a reaction line start (or let one already in
        // flight, e.g. the attack question, keep talking) under the game-over screen
        stopInvestorVoice();
        setIsAISpeaking(false);
        setPhase("gameover");
        return;
      }
      // Every investor's reaction line goes through their own cloned ElevenLabs voice (or the browser
      // native fallback under Fast Voice), matching the attack question above
      const line = pickVoiceLine(activeInvestor, result.tier);
      if (voice.enabled)
        speakInvestorLine(line, activeInvestor.voiceId, voiceEngine.engine, activeInvestor.fallbackVoice, {
          onStart: () => setIsAISpeaking(true),
          onEnd: () => setIsAISpeaking(false),
        }).catch(console.error);
      setRoundNumber(nextRoundNumber);
      window.setTimeout(() => {
        attackTrigger.current += 1;
        setPhase("attacking");
      }, JUDGMENT_DISPLAY_MS);
    },
    [pitcherator, health, personality, isBossMode, rounds, roundNumber, voice, voiceEngine.engine, phase]
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
    setIsBossMode(false);
    setIsPartial(false);
    setReviewAcknowledged(false);
    historySaved.current = false;
    health.reset();
    pitcherator.reset();
    setPhase("personality-select");
  }, [pitcherator, health]);

  // Boss Mode's post-pitch damage log: which investor on the panel hit the founder hardest, computed
  // fresh whenever the round history changes
  const bossDamageLog = useMemo(() => aggregateBossDamage(rounds), [rounds]);

  const maskState: MaskState =
    phase === "attacking"
      ? "speaking"
      : phase === "response"
        ? "listening"
        : phase === "judgment"
          ? health.founderHealth < LOSING_THRESHOLD
            ? "winning"
            : lastResult
              ? tierToMaskState(lastResult.tier)
              // Still awaiting the Groq judgment call — the mask stays in listening mode rather than idle
              : "listening"
          : "idle";

  return {
    phase,
    personality,
    isBossMode,
    bossDamageLog,
    rounds,
    roundNumber,
    pitchTranscript,
    currentQuestion: pitcherator.currentQuestion,
    scorecard: pitcherator.scorecard,
    answerReview: pitcherator.answerReview,
    showAnswerReview: phase === "scorecard" && isPartial && !reviewAcknowledged,
    isPartial,
    failed: pitcherator.failed,
    health: health.founderHealth,
    streakEvent: health.streakEvent,
    streakCount: health.streakCount,
    isLosing: health.founderHealth < LOSING_THRESHOLD,
    lastResult,
    maskState,
    maskIntensity: personality?.maskIntensity ?? 1,
    attackTrigger: attackTrigger.current,
    voiceIsSpeaking: voice.isSpeaking,
    isAISpeaking,
    voiceEnabled: voice.enabled,
    toggleVoice: voice.toggle,
    voiceEngine: voiceEngine.engine,
    toggleVoiceEngine: voiceEngine.toggle,
    selectPersonality,
    enterBossMode,
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
