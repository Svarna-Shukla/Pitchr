import type { PersonalityConfig } from "../types/investor";
import type { ArenaRound } from "../types/arena";

// Which topic tier a round belongs to, based purely on how far into the endless session it is
export type DifficultyTier = "basic" | "market" | "brutal";

const DIFFICULTY_GUIDANCE: Record<DifficultyTier, string> = {
  basic: "Ask a basic, foundational question about the idea itself — what it is, who it's for, why it matters.",
  market: "Ask a harder question about market size, competition, or the revenue model. Be specific and skeptical.",
  brutal:
    "Ask a brutal question about defensibility, why you specifically deserve investment, or what could kill this company. Show no mercy.",
};

// Maps an endless-mode round number to its topic tier: 1-3 basic, 4-7 market/competition/revenue, 8+ brutal
export function difficultyTier(roundNumber: number): DifficultyTier {
  if (roundNumber <= 3) return "basic";
  if (roundNumber <= 7) return "market";
  return "brutal";
}

// Builds the instruction half of the per-round Groq prompt: personality tone + difficulty guidance +
// the exact JSON shape to return, asking it to judge the just-given answer and throw the next question
export function buildRoundPrompt(personality: PersonalityConfig, roundNumber: number): string {
  const tier = difficultyTier(roundNumber);
  return `You are a startup investor grilling a founder. ${personality.promptStyle}
${DIFFICULTY_GUIDANCE[tier]}

You will be given the founder's original pitch, the full history of questions/answers so far, and their latest answer. Reference specific things they said earlier if relevant — call out contradictions, vague language, or filler words directly. Return JSON only, no markdown, with this exact shape:
{"tier":"strong"|"average"|"weak","reaction":"1-2 sentence in-character reaction to their latest answer","nextQuestion":"the next brutal question to ask"}
"tier" grades how well the latest answer defended the pitch.`;
}

// Builds the data half of the per-round prompt: the original pitch, prior rounds, and the answer just given
export function buildRoundContent(pitchTranscript: string, history: ArenaRound[], latestQuestion: string, answer: string, isTimeout: boolean): string {
  const historyText = history.map((r, i) => `Q${i + 1}: ${r.question}\nA${i + 1}: ${r.answer} [judged: ${r.tier}]`).join("\n\n");
  const answerText = isTimeout ? "(the founder said nothing before the timer ran out)" : answer;
  return `Original pitch:\n${pitchTranscript}\n\nHistory:\n${historyText || "(none yet)"}\n\nLatest question: ${latestQuestion}\nLatest answer: ${answerText}`;
}

// The final scorecard prompt, reused as-is once the founder ends the pitch (voluntarily or via game over)
export const SCORECARD_PROMPT = `Based on these investor Q&A pairs from a pitch grilling, return JSON only, no markdown, with this exact shape:
{"ratings":{"clarity":0-10,"confidence":0-10,"marketUnderstanding":0-10,"problemStrength":0-10,"defensibility":0-10,"ask":0-10},"suggestions":["...","...","..."]}
Ratings are integers 0-10. Suggestions are exactly 3 specific, actionable improvements.

Q&A:`;

// The very first question of a session — no history yet, always basic difficulty
export function buildOpeningPrompt(personality: PersonalityConfig): string {
  return `You are a startup investor about to grill a founder. ${personality.promptStyle}
${DIFFICULTY_GUIDANCE.basic}

Return JSON only, no markdown, with this exact shape: {"question":"your opening question"}`;
}
