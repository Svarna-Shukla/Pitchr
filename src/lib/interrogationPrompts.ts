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

You will be given the founder's original pitch, the full history of questions/answers so far, and their latest answer. Reference specific things they said earlier if relevant — call out contradictions, vague language, or filler words directly. Evaluate the latest answer fairly and realistically:
- Score 8-10: specific, addresses the question directly, backed by logic or data
- Score 5-7: relevant and reasonable but could be more specific
- Score 3-4: vague or only partially addresses the question
- Score 1-2: completely off topic, evasive, or nonsensical
Most real founders' answers land between 4 and 7 — reserve a score below 3 for answers that are truly terrible, and reserve 8+ for answers that are genuinely impressive with specifics. Return JSON only, no markdown, with this exact shape:
{"score":1-10,"reaction":"1-2 sentence in-character reaction to their latest answer","nextQuestion":"the next brutal question to ask"}
"score" is an integer 1-10 grading how well the latest answer defended the pitch.`;
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

// Powers the post-game-over "What Went Wrong" screen: rewrites each answer to be clearer, more
// structured, and more convincing, using the founder's own core ideas — never a different answer
export const ANSWER_REVIEW_PROMPT = `You are a pitch coach. For each Q&A pair below, the founder gave the answer to an investor question. Rewrite it to be clearer, more structured, and more convincing. Rules: keep the same core ideas the founder mentioned, do not add completely new information they did not say, fix rambling by organizing ideas logically, replace vague language with specific language, remove repetition, strengthen the opening sentence, add a clear conclusion. Return JSON only, no markdown, with this exact shape:
{"reviews":[{"note":"one short sentence naming the specific weakness, e.g. 'Jumped between ideas without connecting them.' or 'Too vague, no specific numbers or examples.'","corrected":"the rewritten answer as plain text"}]}
Return exactly one review object per Q&A pair given, in the same order.

Q&A pairs:`;

// Retries a single answer's rewrite in isolation, used when the batched rewrite above came back
// too close to the original — forceDifferent appends an explicit instruction to diverge more
export function buildSingleAnswerReviewPrompt(forceDifferent: boolean): string {
  const base = `You are a pitch coach. The founder gave this answer to an investor question. Rewrite it to be clearer, more structured, and more convincing. Rules: keep the same core ideas the founder mentioned, do not add completely new information they did not say, fix rambling by organizing ideas logically, replace vague language with specific language, remove repetition, strengthen the opening sentence, add a clear conclusion.`;
  const forceLine = forceDifferent ? " The rewrite must be significantly different in structure and clarity from the original." : "";
  return `${base}${forceLine} Return JSON only, no markdown, with this exact shape: {"corrected":"the rewritten answer as plain text"}

Answer:`;
}

// The very first question of a session — no history yet, always basic difficulty
export function buildOpeningPrompt(personality: PersonalityConfig): string {
  return `You are a startup investor about to grill a founder. ${personality.promptStyle}
${DIFFICULTY_GUIDANCE.basic}

Return JSON only, no markdown, with this exact shape: {"question":"your opening question"}`;
}
