import type { AnswerTier } from "./arena";

// The 4 investor personalities the founder can choose to be grilled by
export type PersonalityId = "silent" | "shark" | "pattern" | "technical";

// Everything that changes about the interrogation based on which investor is running it: the tone
// guidance fed into the Groq round prompt, how intensely the mask reacts, and the short canned
// lines used for spoken (Web Speech Synthesis) feedback per answer tier
export type PersonalityConfig = {
  id: PersonalityId;
  name: string;
  tagline: string;
  description: string;
  promptStyle: string;
  maskIntensity: number;
  voiceLines: Record<AnswerTier, string[]>;
};
