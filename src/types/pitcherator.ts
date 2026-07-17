export type PitcheratorStage = "idle" | "asking" | "generating-scorecard" | "scorecard";

export type ScorecardRatings = {
  clarity: number;
  confidence: number;
  marketUnderstanding: number;
  problemStrength: number;
  defensibility: number;
  ask: number;
};

export type Scorecard = {
  ratings: ScorecardRatings;
  suggestions: string[];
};


// pitcherator feature