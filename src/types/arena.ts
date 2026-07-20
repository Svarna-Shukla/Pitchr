import type { VoiceAnalytics } from "./voice";

// Define all quality ratings for founder responses
export type AnswerTier = "strong" | "neutral" | "weak" | "timeout";

// The complete set of states the Battle Arena cycles through
export type BattlePhase =
  | "personality-select"
  | "input"
  | "scanning"
  | "attack_projectile"
  | "attacking"
  | "response"
  | "judgment"
  | "gameover"
  | "scorecard";

// One completed round of the investor interrogation: question, answer, and evaluation tier
export type ArenaRound = {
  question: string;
  answer: string;
  tier?: AnswerTier;
  reaction?: string;
  voiceAnalytics?: VoiceAnalytics;
};

// Global health and round tracking state object for the arena session
export interface ArenaState {
  phase: BattlePhase;
  roundIndex: number;
  investorHealth: number;
  founderHealth: number;
  rounds: ArenaRound[];
}