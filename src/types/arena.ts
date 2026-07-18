// The 6 states the Battle Arena cycles through, from first pitch input to the final scorecard
export type BattlePhase = "input" | "scanning" | "attack_projectile" | "response" | "judgment" | "scorecard";

// One completed round of the investor grilling: the question thrown and the founder's answer to it
export type ArenaRound = {
  question: string;
  answer: string;
};


