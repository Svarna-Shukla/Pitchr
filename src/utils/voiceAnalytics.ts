import type { PaceTag, VoiceAnalytics, VoiceDeliverySummary } from "../types/voice";

export const FILLER_WORDS = ["um", "uh", "like", "you know", "so", "basically", "literally"];

const OPTIMAL_WPM_MIN = 130;
const OPTIMAL_WPM_MAX = 160;

const FILLER_PATTERN = new RegExp(`\\b(${FILLER_WORDS.join("|")})\\b`, "gi");

// Every filler-word occurrence in the transcript, in spoken order, lowercased for consistent tallying
function detectFillerWords(transcript: string): string[] {
  return (transcript.match(FILLER_PATTERN) ?? []).map((w) => w.toLowerCase());
}

// Blends pace control and filler discipline into one 0-100 delivery confidence read: WPM outside the
// 130-160 "investor-clear" band and a high filler-to-word ratio both drag the score down independently
function computeConfidenceScore(wpm: number, wordCount: number, fillerCount: number): number {
  if (wordCount === 0) return 0;
  const paceDeviation = wpm < OPTIMAL_WPM_MIN ? OPTIMAL_WPM_MIN - wpm : wpm > OPTIMAL_WPM_MAX ? wpm - OPTIMAL_WPM_MAX : 0;
  const paceScore = Math.max(0, 100 - paceDeviation * 1.2);
  const fillerScore = Math.max(0, 100 - (fillerCount / wordCount) * 400);
  return Math.round(paceScore * 0.5 + fillerScore * 0.5);
}

// Tags a WPM reading against the 130-160 WPM band investors read as confident and clear
export function paceTagForWpm(wpm: number): PaceTag {
  if (wpm > 0 && wpm < OPTIMAL_WPM_MIN) return "Too Slow";
  if (wpm > OPTIMAL_WPM_MAX) return "Too Fast";
  return "Optimal Pace";
}

// Analyzes one spoken response: word count, pace, filler words, and an overall delivery confidence score
export function analyzeVoiceResponse(transcript: string, durationSeconds: number): VoiceAnalytics {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const wpm = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0;
  const fillerWords = detectFillerWords(transcript);
  const fillerCount = fillerWords.length;
  return { transcript, wordCount, wpm, fillerCount, fillerWords, confidenceScore: computeConfidenceScore(wpm, wordCount, fillerCount) };
}

// Rolls up every voice-answered round's analytics into the single "Delivery & Voice Analysis" read
export function summarizeVoiceDelivery(rounds: VoiceAnalytics[]): VoiceDeliverySummary {
  if (!rounds.length) {
    return { totalFillerCount: 0, fillerBreakdown: {}, averageWpm: 0, paceTag: "Optimal Pace", authorityScore: 0, roundsAnalyzed: 0 };
  }
  const totalFillerCount = rounds.reduce((sum, r) => sum + r.fillerCount, 0);
  const fillerBreakdown: Record<string, number> = {};
  for (const round of rounds) {
    for (const word of round.fillerWords) fillerBreakdown[word] = (fillerBreakdown[word] ?? 0) + 1;
  }
  const averageWpm = Math.round(rounds.reduce((sum, r) => sum + r.wpm, 0) / rounds.length);
  const authorityScore = Math.round(rounds.reduce((sum, r) => sum + r.confidenceScore, 0) / rounds.length);
  return { totalFillerCount, fillerBreakdown, averageWpm, paceTag: paceTagForWpm(averageWpm), authorityScore, roundsAnalyzed: rounds.length };
}
