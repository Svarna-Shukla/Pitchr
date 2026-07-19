import type { FounderKit } from "./founderKit";
import type { Slide } from "./slide";

export type SessionRecord = {
  id: string;
  createdAt: string;
  slides: Slide[];
  founderKit?: FounderKit | null;
  healthRemaining?: number;
  grade?: string;
  questionsSurvived?: number;
};

// This type represents a single session record in the database, including its slides, optional founder kit, and optional health/grade information.