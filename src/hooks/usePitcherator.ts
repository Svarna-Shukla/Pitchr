import { useCallback, useState } from "react";
import type { PitcheratorStage, Scorecard } from "../types/pitcherator";
import type { AnswerTier, ArenaRound } from "../types/arena";
import type { PersonalityConfig } from "../types/investor";
import { fetchGroqJSON } from "../lib/groq";
import { buildOpeningPrompt, buildRoundContent, buildRoundPrompt, SCORECARD_PROMPT } from "../lib/interrogationPrompts";

type RoundResult = { tier: AnswerTier; reaction: string; nextQuestion: string };

// Drives the endless interrogation: fetch one opening question, then after every answer fetch both
// the judgment of that answer AND the next question in a single Groq call (so the investor can
// reference prior answers and escalate difficulty), finally generating the scorecard on demand
export function usePitcherator() {
  const [stage, setStage] = useState<PitcheratorStage>("idle");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
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
  // all in one call so the investor's tone can reference earlier rounds
  const playRound = useCallback(
    async (answer: string, isTimeout: boolean, personality: PersonalityConfig, history: ArenaRound[], roundNumber: number): Promise<RoundResult | null> => {
      setFailed(false);
      const prompt = buildRoundPrompt(personality, roundNumber);
      const content = buildRoundContent(pitchTranscript, history, currentQuestion, answer, isTimeout);
      const data = await fetchGroqJSON<{ tier: AnswerTier; reaction: string; nextQuestion: string }>(prompt, content, 400);
      if (!data) {
        setFailed(true);
        return null;
      }
      const tier: AnswerTier = isTimeout ? "timeout" : data.tier;
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

  // Resets the whole flow back to idle
  const reset = useCallback(() => {
    setStage("idle");
    setCurrentQuestion("");
    setScorecard(null);
    setFailed(false);
    setPitchTranscript("");
  }, []);

  return { stage, currentQuestion, scorecard, failed, pitchTranscript, start, playRound, generateScorecard, reset };
}
