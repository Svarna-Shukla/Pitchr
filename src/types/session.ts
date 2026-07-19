import type { Slide } from "./slide";
import type { FounderKit } from "./founderKit";

export type SessionRecord = {
  id: string;
  createdAt: string;
  slides: Slide[];
  founderKit?: FounderKit | null;
  healthRemaining?: number;
  grade?: string;
  questionsSurvived?: number;
};
