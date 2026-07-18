// The states the Battle Arena cycles through: pick an investor, pitch input, scanning, endless
// attack/response/judgment loop, and finally either the voluntary scorecard or a hard game-over
export type BattlePhase = "personality-select" | "input" | "scanning" | "attacking" | "response" | "judgment" | "scorecard" | "gameover";

// How an answer landed, driving both the health delta and the mask's reaction
export type AnswerTier = "strong" | "average" | "weak" | "timeout";

// One completed round of the investor grilling: the question thrown, the founder's answer, the
// judged tier, and the investor's spoken/displayed reaction to it
export type ArenaRound = {
  question: string;
  answer: string;
  tier: AnswerTier;
  reaction: string;
};
