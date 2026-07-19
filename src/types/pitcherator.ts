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

// One round's side-by-side answer comparison for the post-game-over "What Went Wrong" screen: the
// founder's actual answer, a structure/clarity-only rewrite of that same answer, and a one-line note
// on what specifically was wrong with it
export type AnswerReviewItem = {
  question: string;
  answer: string;
  corrected: string;
  note: string;
};


// pitcherator feature