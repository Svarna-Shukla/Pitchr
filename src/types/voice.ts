// Per-response voice delivery metrics computed from one round's transcript + spoken duration
export interface VoiceAnalytics {
  transcript: string;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerWords: string[];
  confidenceScore: number;
}

export type PaceTag = "Too Fast" | "Optimal Pace" | "Too Slow";

// Aggregated voice delivery read across every round the founder answered by voice this session
export interface VoiceDeliverySummary {
  totalFillerCount: number;
  fillerBreakdown: Record<string, number>;
  averageWpm: number;
  paceTag: PaceTag;
  authorityScore: number;
  roundsAnalyzed: number;
}
