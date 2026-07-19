import type { ScorecardRatings } from "../types/pitcherator";

// Sums the 6 individual ratings into a single score out of 60
export function overallScore(ratings: ScorecardRatings): number {
  return Object.values(ratings).reduce((sum, v) => sum + v, 0);
}

// Final grade combines how much health survived with the answer-quality score: health above 60 caps
// an A/B, health 30-60 caps a C/D, and hitting 0 (or dropping below 30 without hitting exactly 0) is
// an automatic F regardless of how sharp the answers were
export function combinedGrade(total: number, health: number): string {
  const strong = total >= 30;
  if (health > 60) return strong ? "A" : "B";
  if (health >= 30) return strong ? "C" : "D";
  return "F";
}
