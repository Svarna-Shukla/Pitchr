import { useCallback, useState } from "react";
import type { PitcheratorStage, Scorecard } from "../types/pitcherator";
import { fetchGroqJSON } from "../lib/groq";

const QUESTIONS_PROMPT = `Return exactly 3 brutal investor questions as a JSON array of strings only, no markdown, no numbering, each targeting a weak part of this pitch:

Transcript:`;

const SCORECARD_PROMPT = `Based on these investor Q&A pairs from a pitch grilling, return JSON only, no markdown, with this exact shape:
{"ratings":{"clarity":0-10,"confidence":0-10,"marketUnderstanding":0-10,"problemStrength":0-10,"defensibility":0-10,"ask":0-10},"suggestions":["...","...","..."]}
Ratings are integers 0-10. Suggestions are exactly 3 specific, actionable improvements.

Q&A:`;

// Drives the Pitcherator flow: ask 3 brutal investor questions, collect spoken answers, then score the pitch
export function usePitcherator() {
  const [stage, setStage] = useState<PitcheratorStage>("idle");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [failed, setFailed] = useState(false);

  // Generates the 3 investor questions from the pitch transcript and begins the flow
  const start = useCallback(async (pitchTranscript: string) => {
    setFailed(false);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setScorecard(null);
    const qs = await fetchGroqJSON<string[]>(QUESTIONS_PROMPT, pitchTranscript);
    if (!qs || qs.length === 0) {
      setFailed(true);
      return;
    }
    setQuestions(qs);
    setStage("asking");
  }, []);

  // Generates the scorecard from all 3 Q&A pairs
  const generateScorecard = useCallback(async (qs: string[], as: string[]) => {
    setStage("generating-scorecard");
    const qa = qs.map((q, i) => `Q: ${q}\nA: ${as[i] ?? ""}`).join("\n\n");
    const card = await fetchGroqJSON<Scorecard>(SCORECARD_PROMPT, qa, 700);
    if (card) {
      setScorecard(card);
      setStage("scorecard");
    } else {
      setFailed(true);
      setStage("asking");
    }
  }, []);

  // Records the user's spoken answer to the current question and advances, or triggers the scorecard after the 3rd
  const submitAnswer = useCallback(
    (text: string) => {
      const nextAnswers = [...answers, text];
      setAnswers(nextAnswers);
      if (nextAnswers.length >= questions.length) {
        generateScorecard(questions, nextAnswers);
      } else {
        setCurrentQuestionIndex((i) => i + 1);
      }
    },
    [answers, questions, generateScorecard]
  );

  // Resets the whole flow back to idle
  const reset = useCallback(() => {
    setStage("idle");
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScorecard(null);
    setFailed(false);
  }, []);

  return { stage, questions, currentQuestionIndex, answers, scorecard, failed, start, submitAnswer, reset };
}
