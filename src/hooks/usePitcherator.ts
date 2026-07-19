import { useCallback, useState } from "react";
import type { AnswerReviewItem, PitcheratorStage, Scorecard } from "../types/pitcherator";
import type { AnswerTier, ArenaRound } from "../types/arena";
import type { PersonalityConfig } from "../types/investor";
import { fetchGroqJSON } from "../lib/groq";
import {
  ANSWER_REVIEW_PROMPT,
  buildOpeningPrompt,
  buildRoundContent,
  buildRoundPrompt,
  buildSingleAnswerReviewPrompt,
  SCORECARD_PROMPT,
} from "../lib/interrogationPrompts";
import { similarity } from "../lib/textSimilarity";

const SIMILARITY_THRESHOLD = 0.75;

type RoundResult = { tier: AnswerTier; reaction: string; nextQuestion: string };

// Maps the investor's strict 1-10 score onto the three health-affecting tiers
function scoreToTier(score: number): AnswerTier {
  if (score >= 7) return "strong";
  if (score >= 4) return "average";
  return "weak";
}

const NO_ANSWER_REVIEW: Pick<AnswerReviewItem, "corrected" | "note"> = {
  corrected: "Prepare a specific, structured answer in advance so you're not caught silent when the clock runs out.",
  note: "No answer was given before time ran out.",
};

// Drives the endless interrogation: fetch one opening question, then after every answer fetch both
// the judgment of that answer AND the next question in a single Groq call (so the investor can
// reference prior answers and escalate difficulty), finally generating the scorecard on demand
export function usePitcherator() {
  const [stage, setStage] = useState<PitcheratorStage>("idle");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [answerReview, setAnswerReview] = useState<AnswerReviewItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [pitchTranscript, setPitchTranscript] = useState("");

  // Fetches the opening question for a fresh session
  const start = useCallback(async (transcript: string, personality: PersonalityConfig) => {
    setFailed(false);
    setScorecard(null);
    setPitchTranscript(transcript);
    const data = await fetchGroqJSON<{ question: string }>(buildOpeningPrompt(personality), transcript, 300);
    if (!data?.question) {
      setFailed(true);
      return;
    }
    setCurrentQuestion(data.question);
    setStage("asking");
  }, []);

  // Judges the answer just given (or a timeout) against the full history and fetches the next question,
  // all in one call so the investor's tone can reference earlier rounds. A timeout with nothing typed
  // is judged as a hard "timeout" tier; a timeout where the founder got a partial answer down before
  // the clock ran out is graded on its own merits like any other answer, not auto-penalized
  const playRound = useCallback(
    async (answer: string, isTimeout: boolean, personality: PersonalityConfig, history: ArenaRound[], roundNumber: number): Promise<RoundResult | null> => {
      setFailed(false);
      const silentTimeout = isTimeout && !answer.trim();
      const prompt = buildRoundPrompt(personality, roundNumber);
      const content = buildRoundContent(pitchTranscript, history, currentQuestion, answer, silentTimeout);
      const data = await fetchGroqJSON<{ score: unknown; reaction: string; nextQuestion: string }>(prompt, content, 400);
      if (!data) {
        setFailed(true);
        return null;
      }
      // A malformed or missing score (bad JSON shape, not a total fetch failure) defaults to a
      // middling 5/average rather than failing the whole round
      const score = typeof data.score === "number" && data.score >= 1 && data.score <= 10 ? data.score : 5;
      const tier: AnswerTier = silentTimeout ? "timeout" : scoreToTier(score);
      setCurrentQuestion(data.nextQuestion);
      return { tier, reaction: data.reaction, nextQuestion: data.nextQuestion };
    },
    [pitchTranscript, currentQuestion]
  );

  // Generates the final scorecard from however many rounds the session accumulated
  const generateScorecard = useCallback(async (rounds: ArenaRound[]) => {
    setStage("generating-scorecard");
    const qa = rounds.map((r) => `Q: ${r.question}\nA: ${r.answer}`).join("\n\n");
    const card = await fetchGroqJSON<Scorecard>(SCORECARD_PROMPT, qa, 700);
    if (card) {
      setScorecard(card);
      setStage("scorecard");
    } else {
      setFailed(true);
      setStage("asking");
    }
  }, []);

  // Builds the "What Went Wrong" answer comparisons: sends every answered (non-timeout) round to Groq
  // for a structure/clarity-only rewrite, then merges the results back in round order, filling in a
  // fixed fallback for any round the founder ran out the clock on
  const generateAnswerReview = useCallback(async (rounds: ArenaRound[]) => {
    const answered = rounds.filter((r) => r.tier !== "timeout" && r.answer.trim());
    if (!answered.length) {
      setAnswerReview(rounds.map((r) => ({ question: r.question, answer: r.answer, ...NO_ANSWER_REVIEW })));
      return;
    }
    const qa = answered.map((r, i) => `Q${i + 1}: ${r.question}\nA${i + 1}: ${r.answer}`).join("\n\n");
    const data = await fetchGroqJSON<{ reviews: { note: string; corrected: string }[] }>(ANSWER_REVIEW_PROMPT, qa, 900);
    const reviews = data?.reviews ?? [];
    let i = 0;
    const merged = rounds.map((r) => {
      if (r.tier === "timeout" || !r.answer.trim()) return { question: r.question, answer: r.answer, ...NO_ANSWER_REVIEW };
      const rev = reviews[i];
      i += 1;
      return { question: r.question, answer: r.answer, corrected: rev?.corrected ?? r.answer, note: rev?.note ?? "" };
    });

    // Re-issues any rewrite that came back too close to the original, forcing a more different
    // structure — catches the case where the model barely touched a founder's answer
    const strengthened = await Promise.all(
      merged.map(async (item) => {
        if (item.corrected === NO_ANSWER_REVIEW.corrected) return item;
        if (similarity(item.answer, item.corrected) <= SIMILARITY_THRESHOLD) return item;
        const retry = await fetchGroqJSON<{ corrected: string }>(buildSingleAnswerReviewPrompt(true), item.answer, 400);
        return retry?.corrected ? { ...item, corrected: retry.corrected } : item;
      })
    );
    setAnswerReview(strengthened);
  }, []);

  // Resets the whole flow back to idle
  const reset = useCallback(() => {
    setStage("idle");
    setCurrentQuestion("");
    setScorecard(null);
    setAnswerReview(null);
    setFailed(false);
    setPitchTranscript("");
  }, []);

  return { stage, currentQuestion, scorecard, answerReview, failed, pitchTranscript, start, playRound, generateScorecard, generateAnswerReview, reset };
}
